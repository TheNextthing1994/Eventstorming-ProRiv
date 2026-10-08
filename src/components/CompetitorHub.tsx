import React, { useState } from 'react';
import { Building2, ArrowLeft, ExternalLink, AlertCircle, Search, Filter } from 'lucide-react';
import { DatabaseState, TopicId, CompetitorEntry, Language } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { StatusBadge } from './StatusBadge';
import { getTranslation } from '../i18n/translations';

interface CompetitorHubProps {
  databaseState: DatabaseState;
  language: Language;
  onSelectTopic: (topicId: TopicId) => void;
  onNavigateHome: () => void;
}

export const CompetitorHub: React.FC<CompetitorHubProps> = ({
  databaseState,
  language,
  onSelectTopic,
  onNavigateHome
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const competitors = databaseState.competitors;

  const filteredCompetitors = competitors.filter(c => {
    const q = searchQuery.toLowerCase();
    const nameMatch = c.productName.toLowerCase().includes(q);
    const featMatch = c.analyzedFeature.toLowerCase().includes(q) || (c.analyzedFeatureRu && c.analyzedFeatureRu.toLowerCase().includes(q));
    const takeawayMatch = c.keyTakeaway.toLowerCase().includes(q) || (c.keyTakeawayRu && c.keyTakeawayRu.toLowerCase().includes(q));
    return nameMatch || featMatch || takeawayMatch;
  });

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {language === 'ru' ? 'Сравнительный анализ' : 'Übergreifende Analyse'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {language === 'ru'
                ? 'Статус: Предварительные ориентиры — внешне еще не подтверждено'
                : 'Status: Vorläufige Schwerpunkte – Extern noch nicht belegt'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {getTranslation('compHubTitle', language)}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {getTranslation('compHubSubtitle', language)}
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          {getTranslation('backToSketch', language)}
        </button>
      </div>

      {/* Warning Notice as requested */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950 block mb-0.5">
            {language === 'ru' ? 'Методический принцип исследования:' : 'Wichtiger methodischer Grundsatz:'}
          </span>
          <p>{getTranslation('compWarning', language)}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getTranslation('compSearchPlaceholder', language)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      {/* Competitor Cards */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>{getTranslation('compOverview', language)} ({filteredCompetitors.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompetitors.map(comp => (
            <div
              key={comp.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3.5 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 text-white">
                      {comp.productName}
                    </span>
                    <StatusBadge status={comp.status} language={language} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                    {language === 'ru'
                      ? (comp.analyzedFeatureRu || comp.analyzedFeature)
                      : language === 'bilingual'
                        ? (comp.analyzedFeatureRu ? `${comp.analyzedFeatureRu} / ${comp.analyzedFeature}` : comp.analyzedFeature)
                        : comp.analyzedFeature}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onSelectTopic(comp.topicId)}
                    className="text-[11px] font-mono px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                  >
                    {TOPIC_DEFINITIONS[comp.topicId]?.sketchTitle}
                  </button>
                </div>
              </div>

              {/* Investigation details */}
              <div className="space-y-2 text-xs">
                {comp.investigationGoal && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">
                      {getTranslation('compGoal', language)}
                    </span>
                    <p className="text-slate-600">
                      {language === 'ru' ? (comp.investigationGoalRu || comp.investigationGoal) : comp.investigationGoal}
                    </p>
                  </div>
                )}

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700 block mb-0.5">
                    {getTranslation('compWorkflow', language)}
                  </span>
                  <p className="text-slate-600">
                    {language === 'ru' ? (comp.observedWorkflowRu || comp.observedWorkflow) : comp.observedWorkflow}
                  </p>
                </div>

                <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                  <span className="font-semibold text-emerald-950 block mb-0.5">
                    {getTranslation('compTakeaway', language)}
                  </span>
                  <p className="text-emerald-900">
                    {language === 'ru' ? (comp.keyTakeawayRu || comp.keyTakeaway) : comp.keyTakeaway}
                  </p>
                </div>

                {comp.disadvantages && (
                  <div className="p-2.5 bg-rose-50/40 rounded-lg border border-rose-100 text-rose-900">
                    <span className="font-semibold text-rose-950 block mb-0.5">
                      {getTranslation('compDisadvantages', language)}
                    </span>
                    <p>{language === 'ru' ? (comp.disadvantagesRu || comp.disadvantages) : comp.disadvantages}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                  <span>
                    <strong>{getTranslation('compTransfer', language)}</strong>{' '}
                    {language === 'ru' ? (comp.transferabilityRu || comp.transferability) : comp.transferability}
                  </span>
                  {comp.sourceOrLink ? (
                    <a
                      href={comp.sourceOrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>{getTranslation('compSource', language)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="italic text-slate-400 font-mono">
                      {language === 'ru' ? 'Источник: внутр. исследование' : 'Quelle: Interne Recherche'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
