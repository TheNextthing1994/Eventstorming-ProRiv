import React, { useState } from 'react';
import { HelpCircle, ArrowLeft, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { SENIOR_DECISION_QUESTIONS } from '../db/knowledgeSeed';
import { TopicId, SeniorDecisionItem } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';

interface SeniorDecisionsHubProps {
  onNavigateHome: () => void;
  onSelectTopic: (topicId: TopicId) => void;
}

export const SeniorDecisionsHub: React.FC<SeniorDecisionsHubProps> = ({
  onNavigateHome,
  onSelectTopic
}) => {
  const [questionsList, setQuestionsList] = useState<SeniorDecisionItem[]>(SENIOR_DECISION_QUESTIONS);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const handleToggleStatus = (id: string) => {
    setQuestionsList(prev => prev.map(q => {
      if (q.id === id) {
        const nextStatus = q.status === 'offen' ? 'in_diskussion' : q.status === 'in_diskussion' ? 'entschieden' : 'offen';
        return { ...q, status: nextStatus };
      }
      return q;
    }));
  };

  const filtered = filterPriority === 'all'
    ? questionsList
    : questionsList.filter(q => q.priority === filterPriority);

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Entscheidungsliste
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              10 offene Kernfragen
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Mit dem Senior Software Engineer klären
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zentrale architektonische und fachliche Weichenstellungen vor Abschluss des MVP-Konzepts für ProRiv AS.
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          ← Zurück zur Originalskizze
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium mr-1">Priorität:</span>
        {['all', 'high', 'medium', 'low'].map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
              filterPriority === p
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p === 'all' ? 'Alle Fragen' : p.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 10 Decision Cards */}
      <div className="space-y-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3 transition-all hover:border-slate-300"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  0{item.number}
                </span>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.question}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>Verantwortlich: <strong>{item.responsiblePerson}</strong></span>
                    <span>·</span>
                    <span className="font-mono">Prio: {item.priority.toUpperCase()}</span>
                    <span>·</span>
                    <span className="font-mono">Stand: {item.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    item.status === 'entschieden'
                      ? 'bg-emerald-100 text-emerald-800 font-semibold'
                      : item.status === 'in_diskussion'
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                  title="Klicken zum Weiterschalten des Status"
                >
                  Status: {item.status.toUpperCase()}
                </button>
              </div>
            </div>

            {/* Proposal & Rationale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
              <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100 space-y-1">
                <span className="font-semibold text-emerald-950 block">Aktueller Lösungsvorschlag:</span>
                <p className="text-emerald-900 leading-relaxed">{item.currentProposal}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-800 block">Architektonische Begründung:</span>
                <p className="text-slate-600 leading-relaxed">{item.rationale}</p>
              </div>
            </div>

            {/* Linked Topics */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-slate-400">Verknüpft mit Kreis:</span>
                {item.connectedTopics.map(tId => (
                  <button
                    key={tId}
                    onClick={() => onSelectTopic(tId)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {TOPIC_DEFINITIONS[tId]?.sketchTitle}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
