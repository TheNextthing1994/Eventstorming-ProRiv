import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, HelpCircle, Lightbulb, Building2, FileCheck2, AlertCircle, Paperclip } from 'lucide-react';
import { DatabaseState, TopicId } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { StatusBadge } from './StatusBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  databaseState: DatabaseState;
  onSelectResult: (topicId: TopicId) => void;
}

interface SearchResultItem {
  id: string;
  type: 'question' | 'finding' | 'competitor' | 'recommendation' | 'decision' | 'open_point' | 'attachment';
  typeLabel: string;
  title: string;
  snippet: string;
  topicId: TopicId;
  status?: any;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  databaseState,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Aggregate and search
  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list: SearchResultItem[] = [];

    // 1. Questions
    databaseState.questions.forEach(item => {
      const match =
        item.question.toLowerCase().includes(q) ||
        (item.germanTranslation && item.germanTranslation.toLowerCase().includes(q)) ||
        (item.answer && item.answer.toLowerCase().includes(q));

      if (match) {
        list.push({
          id: item.id,
          type: 'question',
          typeLabel: 'Frage des Seniors',
          title: item.question,
          snippet: item.answer || item.germanTranslation || 'Noch keine Antwort hinterlegt',
          topicId: item.topicId
        });
      }
    });

    // 2. Findings
    databaseState.findings.forEach(item => {
      const match =
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        (item.sourceName && item.sourceName.toLowerCase().includes(q));

      if (match) {
        list.push({
          id: item.id,
          type: 'finding',
          typeLabel: 'Erkenntnis',
          title: item.title,
          snippet: item.content,
          topicId: item.topicId,
          status: item.status
        });
      }
    });

    // 3. Competitors
    databaseState.competitors.forEach(item => {
      const match =
        item.productName.toLowerCase().includes(q) ||
        item.analyzedFeature.toLowerCase().includes(q) ||
        item.observedWorkflow.toLowerCase().includes(q) ||
        item.keyTakeaway.toLowerCase().includes(q) ||
        item.transferability.toLowerCase().includes(q);

      if (match) {
        list.push({
          id: item.id,
          type: 'competitor',
          typeLabel: 'Wettbewerbsanalyse',
          title: `${item.productName} – ${item.analyzedFeature}`,
          snippet: item.keyTakeaway || item.observedWorkflow,
          topicId: item.topicId
        });
      }
    });

    // 4. Recommendations
    databaseState.recommendations.forEach(item => {
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.rationale.toLowerCase().includes(q);

      if (match) {
        list.push({
          id: item.id,
          type: 'recommendation',
          typeLabel: 'Empfehlung',
          title: item.title,
          snippet: item.description,
          topicId: item.topicId,
          status: item.status
        });
      }
    });

    // 5. Open Points
    databaseState.openPoints.forEach(item => {
      const match =
        item.question.toLowerCase().includes(q) ||
        (item.resolutionNote && item.resolutionNote.toLowerCase().includes(q));

      if (match) {
        list.push({
          id: item.id,
          type: 'open_point',
          typeLabel: 'Offener Punkt',
          title: item.question,
          snippet: item.resolutionNote || `Zu klären mit: ${item.clarifyWith}`,
          topicId: item.topicId
        });
      }
    });

    // 6. Decisions
    databaseState.decisions.forEach(item => {
      const match =
        item.title.toLowerCase().includes(q) ||
        item.rationale.toLowerCase().includes(q) ||
        (item.responsiblePerson && item.responsiblePerson.toLowerCase().includes(q));

      if (match) {
        list.push({
          id: item.id,
          type: 'decision',
          typeLabel: 'Entscheidung',
          title: item.title,
          snippet: item.rationale,
          topicId: item.topicId
        });
      }
    });

    // 7. Attachments
    databaseState.attachments.forEach(item => {
      const match =
        item.title.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.fileName && item.fileName.toLowerCase().includes(q));

      if (match) {
        list.push({
          id: item.id,
          type: 'attachment',
          typeLabel: 'Quelle / Anhang',
          title: item.title,
          snippet: item.notes || item.fileName || item.url || '',
          topicId: item.topicId
        });
      }
    });

    if (filterTopic !== 'all') {
      return list.filter(item => item.topicId === filterTopic);
    }

    return list;
  }, [query, databaseState, filterTopic]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Globale Suche nach Fragen, Wettbewerbern (123erfasst...), Erkenntnissen, Quellen..."
            className="w-full text-sm bg-transparent focus:outline-none placeholder:text-slate-400 text-slate-900"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-white overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium mr-1">Bereich:</span>
          <button
            onClick={() => setFilterTopic('all')}
            className={`px-2 py-0.5 rounded transition-colors ${
              filterTopic === 'all' ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Alle Bereiche
          </button>
          {(Object.keys(TOPIC_DEFINITIONS) as TopicId[]).map(tId => (
            <button
              key={tId}
              onClick={() => setFilterTopic(tId)}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                filterTopic === tId ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {TOPIC_DEFINITIONS[tId].sketchTitle}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
          {!query ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tippe einen Suchbegriff ein, um alle Themen, Fragen, Wettbewerber und Beschlüsse zu durchsuchen.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Keine Treffer für &ldquo;{query}&rdquo; gefunden.
            </div>
          ) : (
            results.map(r => {
              const topicMeta = TOPIC_DEFINITIONS[r.topicId];
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectResult(r.topicId);
                    onClose();
                  }}
                  className="p-3 hover:bg-slate-50/90 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                        {topicMeta.sketchTitle}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-medium">{r.typeLabel}</span>
                      {r.status && <StatusBadge status={r.status} />}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {r.title}
                    </h4>

                    {r.snippet && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {r.snippet}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-slate-400 group-hover:text-slate-700 transition-colors pt-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
