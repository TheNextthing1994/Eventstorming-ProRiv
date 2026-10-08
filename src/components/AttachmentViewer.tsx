import React, { useState, useRef } from 'react';
import { Paperclip, Link as LinkIcon, FileText, Image as ImageIcon, Trash2, ExternalLink, Plus, Eye, Download } from 'lucide-react';
import { AttachmentItem, TopicId } from '../types';

interface AttachmentViewerProps {
  topicId: TopicId;
  attachments: AttachmentItem[];
  onAddAttachment: (item: Omit<AttachmentItem, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteAttachment: (id: string) => Promise<void>;
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  topicId,
  attachments,
  onAddAttachment,
  onDeleteAttachment
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'files' | 'links' | 'notes'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'link' | 'note' | 'file'>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    mime: string;
    dataUrl: string;
  } | null>(null);

  const topicAttachments = attachments.filter(a => a.topicId === topicId);

  const filtered = topicAttachments.filter(a => {
    if (activeTab === 'files') return a.type === 'file';
    if (activeTab === 'links') return a.type === 'link';
    if (activeTab === 'notes') return a.type === 'note';
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Die Dateigröße überschreitet das Limit von 25 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedFile({
        name: file.name,
        size: file.size,
        mime: file.type,
        dataUrl: ev.target?.result as string
      });
      if (!title) setTitle(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (addType === 'link' && !url.trim()) return;
    if (addType === 'file' && !selectedFile) return;

    await onAddAttachment({
      topicId,
      title: title.trim(),
      type: addType,
      url: addType === 'link' ? url.trim() : undefined,
      notes: notes.trim() || undefined,
      fileName: selectedFile?.name,
      fileSize: selectedFile?.size,
      mimeType: selectedFile?.mime,
      fileData: selectedFile?.dataUrl
    });

    setTitle('');
    setUrl('');
    setNotes('');
    setSelectedFile(null);
    setShowAddModal(false);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alle ({topicAttachments.length})
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'files' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dateien & Screenshots
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'links' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Links & Quellen
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'notes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Notizen
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quelle oder Anhang hinzufügen</span>
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Paperclip className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-slate-700">Noch keine Quellen oder Anhänge</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Hinterlege Links zur Dokumentation, Screenshots von Konkurrenzprodukten, Architektur-Notizen oder PDF-Spezifikationen.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className="p-3.5 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {item.type === 'file' && <FileText className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {item.type === 'link' && <LinkIcon className="w-4 h-4 text-sky-600 shrink-0" />}
                    {item.type === 'note' && <FileText className="w-4 h-4 text-amber-600 shrink-0" />}
                    <h4 className="text-xs font-semibold text-slate-900 tracking-tight leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => onDeleteAttachment(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed whitespace-pre-wrap">
                    {item.notes}
                  </p>
                )}

                {/* Image preview thumbnail if image file */}
                {item.type === 'file' && item.fileData && item.mimeType?.startsWith('image/') && (
                  <div className="mb-2">
                    <img
                      src={item.fileData}
                      alt={item.title}
                      className="max-h-36 rounded border border-slate-200 object-cover cursor-pointer hover:opacity-95"
                      onClick={() => setPreviewImage(item.fileData || null)}
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">
                  {item.fileName ? `${item.fileName} (${formatFileSize(item.fileSize)})` : new Date(item.createdAt).toLocaleDateString('de-DE')}
                </span>

                <div className="flex items-center gap-2">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium"
                    >
                      <span>Öffnen</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {item.fileData && (
                    <a
                      href={item.fileData}
                      download={item.fileName || 'anhang'}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium"
                    >
                      <span>Herunterladen</span>
                      <Download className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Images */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg p-2 shadow-2xl overflow-auto">
            <img src={previewImage} alt="Vollbild Vorschau" className="max-w-full max-h-[85vh] object-contain rounded" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md"
            >
              Schließen (ESC)
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Neuen Anhang oder Quelle hinterlegen
            </h3>

            <div className="flex gap-2 border-b border-slate-200 pb-3 mb-4">
              <button
                type="button"
                onClick={() => setAddType('link')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  addType === 'link' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Web-Link / Quelle
              </button>
              <button
                type="button"
                onClick={() => setAddType('file')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  addType === 'file' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Datei / Screenshot
              </button>
              <button
                type="button"
                onClick={() => setAddType('note')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  addType === 'note' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Notiz / Zitat
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Titel / Bezeichnung</label>
                <input
                  type="text"
                  required
                  placeholder="z. B. AWS Cognito Token Flow Doku oder Screenshot SpediTime"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {addType === 'link' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              )}

              {addType === 'file' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Datei auswählen (max. 25 MB)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 border border-slate-200 rounded-md p-1.5"
                  />
                  {selectedFile && (
                    <div className="text-[11px] text-emerald-700 mt-1 font-mono">
                      Ausgewählt: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notizen / Kontext (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Wichtige Abschnitte, Zusammenfassung oder Verwendungszweck..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
