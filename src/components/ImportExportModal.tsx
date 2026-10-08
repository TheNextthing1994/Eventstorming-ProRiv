import React, { useState, useRef } from 'react';
import {
  X,
  FileJson,
  FileText,
  Download,
  Upload,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { DatabaseState, TopicId, KnowledgeStatus, Language } from '../types';
import { TOPIC_DEFINITIONS, TOPIC_ORDER } from '../db/defaultData';
import {
  exportStateAsJson,
  exportStateAsMarkdown,
  importFromJson,
  saveFinding,
  saveQuestion,
  saveRecommendation,
  saveDecision
} from '../db/indexedDb';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  databaseState: DatabaseState;
  language?: Language;
  onDataImported: () => Promise<void>;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  databaseState,
  language = 'ru',
  onDataImported
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copiedType, setCopiedType] = useState<'json' | 'md' | null>(null);

  // Import form state
  const [importMode, setImportMode] = useState<'json' | 'text'>('text');
  const [importText, setImportText] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>('mobile-app');
  const [selectedCategory, setSelectedCategory] = useState<'findings' | 'questions' | 'recommendations' | 'decisions'>('findings');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export handlers
  const handleDownloadJson = async () => {
    const json = await exportStateAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `architecture_research_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = async () => {
    const md = await exportStateAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `architecture_research_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (type: 'json' | 'md') => {
    const text = type === 'json' ? await exportStateAsJson() : await exportStateAsMarkdown();
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Import handler for file drop/picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const content = ev.target?.result as string;
      if (file.name.endsWith('.json')) {
        setImportMode('json');
        setImportText(content);
      } else {
        setImportMode('text');
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  // Process text or JSON import
  const handleExecuteImport = async () => {
    setImportStatus(null);
    if (!importText.trim()) return;

    if (importMode === 'json') {
      const success = await importFromJson(importText);
      if (success) {
        setImportStatus('JSON-Datenbank erfolgreich importiert!');
        await onDataImported();
        setTimeout(() => onClose(), 1200);
      } else {
        setImportStatus('Fehler beim Importieren: Bitte gültiges JSON prüfen.');
      }
      return;
    }

    // Process Text / Markdown import into the chosen circle & category
    try {
      const now = new Date().toISOString();
      // Split by double newline or bullet points into logical chunks
      const paragraphs = importText
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

      let count = 0;

      for (const para of paragraphs) {
        const firstLineEnd = para.indexOf('\n');
        const title = (firstLineEnd !== -1 ? para.substring(0, firstLineEnd) : para)
          .replace(/^#+\s*/, '')
          .replace(/^[-*]\s*/, '')
          .substring(0, 90);
        const body = firstLineEnd !== -1 ? para.substring(firstLineEnd + 1).trim() : para;

        if (selectedCategory === 'findings') {
          await saveFinding({
            id: `f-imp-${Date.now()}-${count}`,
            topicId: selectedTopicId,
            title: title || 'Importierte Erkenntnis',
            content: body || title,
            origin: 'project_context',
            status: 'project_known',
            sourceName: sourceName.trim() || undefined,
            sourceUrl: sourceUrl.trim() || undefined,
            createdAt: now,
            updatedAt: now
          });
        } else if (selectedCategory === 'questions') {
          await saveQuestion({
            id: `q-imp-${Date.now()}-${count}`,
            topicId: selectedTopicId,
            question: title || 'Importierte Frage',
            answer: body !== title ? body : '',
            isResolved: false,
            origin: 'project_context',
            status: 'open_decision',
            createdAt: now,
            updatedAt: now
          });
        } else if (selectedCategory === 'recommendations') {
          await saveRecommendation({
            id: `r-imp-${Date.now()}-${count}`,
            topicId: selectedTopicId,
            title: title || 'Importierte Empfehlung',
            description: body || title,
            rationale: 'Aus Recherche-Notizen importiert',
            priority: 'medium',
            origin: 'architecture_recommendation',
            status: 'recommended',
            createdAt: now,
            updatedAt: now
          });
        } else if (selectedCategory === 'decisions') {
          await saveDecision({
            id: `d-imp-${Date.now()}-${count}`,
            topicId: selectedTopicId,
            title: title || 'Importierte Entscheidung',
            date: now.split('T')[0],
            rationale: body || title,
            status: 'decided',
            origin: 'architecture_recommendation',
            decisionStatus: 'recommended',
            createdAt: now,
            updatedAt: now
          });
        }

        count++;
      }

      setImportStatus(`${count} Einträge erfolgreich in "${TOPIC_DEFINITIONS[selectedTopicId].sketchTitle}" importiert!`);
      await onDataImported();
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setImportStatus(`Import fehlgeschlagen: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">
              {language === 'ru' ? 'Импорт и экспорт данных' : 'Datenimport & Export'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-white">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 text-xs font-semibold border-b-2 mr-6 transition-colors ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'ru' ? 'Экспорт данных (JSON и Markdown)' : 'Daten exportieren (JSON & Markdown)'}
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'ru' ? 'Импорт исследования (Текст, .md, .json)' : 'Recherche importieren (Text, .md, .json)'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 leading-relaxed">
                Exportiere den gesamten Forschungsstand. Die JSON-Datei enthält alle Datenstrukturen inklusive
                Hotspot-Kalibrierung und Anhänge. Die Markdown-Datei dient als lesbarer Bericht für den Senior.
              </p>

              {/* Markdown Export Box */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Markdown-Bericht für den Senior (.md)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Strukturierter Bericht aller 6 Bereiche, Fragen, Antworten, Wettbewerber und Entscheidungen.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy('md')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    {copiedType === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'md' ? 'Kopiert' : 'Kopieren'}</span>
                  </button>
                  <button
                    onClick={handleDownloadMarkdown}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.md)</span>
                  </button>
                </div>
              </div>

              {/* JSON Export Box */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-sky-700" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Vollständige Datenbank als JSON (.json)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Sicherungskopie aller Entitäten, Hotspots und Quelltexte für Backup und Migration.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy('json')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    {copiedType === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'json' ? 'Kopiert' : 'Kopieren'}</span>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.json)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Importquelle wählen:</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,.md,.txt"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium"
                >
                  <Upload className="w-3 h-3 text-slate-500" />
                  <span>Datei hochladen (.json / .md / .txt)</span>
                </button>
              </div>

              {/* Mode switch: Text vs Full JSON */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setImportMode('text')}
                  className={`p-2 rounded-lg border text-left ${
                    importMode === 'text'
                      ? 'border-emerald-600 bg-emerald-50/50 font-semibold text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Text / Markdown importieren
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('json')}
                  className={`p-2 rounded-lg border text-left ${
                    importMode === 'json'
                      ? 'border-emerald-600 bg-emerald-50/50 font-semibold text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Komplette JSON-Datenbank wiederherstellen
                </button>
              </div>

              {importMode === 'text' && (
                <div className="space-y-3 p-4 bg-slate-50/80 rounded-lg border border-slate-200/80">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Zu welchem Kreis gehört der Inhalt?
                      </label>
                      <select
                        value={selectedTopicId}
                        onChange={e => setSelectedTopicId(e.target.value as TopicId)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md bg-white"
                      >
                        {TOPIC_ORDER.map(tId => (
                          <option key={tId} value={tId}>
                            {TOPIC_DEFINITIONS[tId].sketchTitle} ({TOPIC_DEFINITIONS[tId].germanTitle})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Kategorie der importierten Daten
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md bg-white"
                      >
                        <option value="findings">Erkenntnisse & Notizen</option>
                        <option value="questions">Fragen des Seniors</option>
                        <option value="recommendations">Empfehlungen</option>
                        <option value="decisions">Beschlossene Entscheidungen</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Quelle / Dokument (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="z. B. Benchmark Analyse Q3"
                        value={sourceName}
                        onChange={e => setSourceName(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Quellen-URL (optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={sourceUrl}
                        onChange={e => setSourceUrl(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {importMode === 'json' ? 'JSON Inhalt hier einfügen' : 'Text / Markdown-Absätze hier einfügen'}
                </label>
                <textarea
                  rows={8}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder={
                    importMode === 'json'
                      ? '{\n  "questions": [...],\n  "findings": [...]\n}'
                      : 'Absatz 1: Erkenntnis zur Offline-Fähigkeit\n\nAbsatz 2: Weiterer Punkt mit Details...'
                  }
                  className="w-full text-xs font-mono p-3 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {importStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
                  {importStatus}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
          >
            Schließen
          </button>
          {activeTab === 'import' && (
            <button
              onClick={handleExecuteImport}
              disabled={!importText.trim()}
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-md transition-colors"
            >
              Importieren & Speichern
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
