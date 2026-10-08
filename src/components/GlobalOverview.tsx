import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  FolderKanban,
  Building2,
  Zap,
  Target
} from 'lucide-react';
import { DatabaseState, TopicId, Language } from '../types';
import { TOPIC_DEFINITIONS, TOPIC_ORDER } from '../db/defaultData';
import { calculateGlobalStats } from '../db/indexedDb';
import { MVP_STRATEGIC_STATEMENT } from '../db/knowledgeSeed';
import { getTranslation, PILOT_SCOPE_ITEMS } from '../i18n/translations';

interface GlobalOverviewProps {
  databaseState: DatabaseState;
  language: Language;
  onSelectTopic: (topicId: TopicId) => void;
  onNavigateHome: () => void;
  onNavigateSection?: (section: string) => void;
}

export const GlobalOverview: React.FC<GlobalOverviewProps> = ({
  databaseState,
  language,
  onSelectTopic,
  onNavigateHome,
  onNavigateSection
}) => {
  const stats = calculateGlobalStats(databaseState);

  const completionRate = stats.totalQuestions > 0
    ? Math.round((stats.resolvedQuestions / stats.totalQuestions) * 100)
    : 0;

  const quoteText = language === 'ru'
    ? MVP_STRATEGIC_STATEMENT.quoteRu
    : language === 'bilingual'
      ? `${MVP_STRATEGIC_STATEMENT.quoteRu} (${MVP_STRATEGIC_STATEMENT.quote})`
      : MVP_STRATEGIC_STATEMENT.quote;

  const pilotScopeList = PILOT_SCOPE_ITEMS[language] || PILOT_SCOPE_ITEMS.ru;

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {language === 'ru' ? 'Проект ISA · ProRiv AS' : 'Projekt ISA · ProRiv AS'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {getTranslation('overviewTitle', language)}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {getTranslation('overviewSubtitle', language)}
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          {getTranslation('backToSketch', language)}
        </button>
      </div>

      {/* STRATEGIC MVP BANNER */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
          <Target className="w-4 h-4 text-emerald-400" />
          <span>{getTranslation('mvpStrategyTitle', language)}</span>
        </div>

        <blockquote className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight leading-snug">
          &bdquo;{quoteText}&ldquo;
        </blockquote>

        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-emerald-300 block mb-2">
            {getTranslation('pilotScopeTitle', language)}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-300">
            {pilotScopeList.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SENIOR CLIENT QUESTIONS BANNER */}
      {(stats.clientQuestionsCount || 0) > 0 && (
        <div
          onClick={() => onNavigateSection?.('senior-decisions')}
          className="bg-amber-500/10 border-2 border-amber-300 rounded-xl p-4 cursor-pointer hover:bg-amber-500/15 transition-all flex flex-wrap items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  {language === 'ru' ? 'Подготовка к встрече с Сеньором' : 'Vorbereitung Senior-Meeting'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 font-mono">
                  {stats.clientQuestionsCount} {language === 'ru' ? 'вопросов клиенту (Isa)' : 'Fragen an Klienten (Isa)'}
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-0.5 font-medium">
                {language === 'ru'
                  ? `Зафиксировано ${stats.clientQuestionsCount} вопросов (из них ${stats.unresolvedClientQuestionsCount} открыто), где мы ждем информации от клиента Isa.`
                  : `${stats.clientQuestionsCount} Fragen fixiert (davon ${stats.unresolvedClientQuestionsCount} offen), die der Senior morgen dem Kunden Isa stellen muss.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1.5 rounded-lg">
            <span>{language === 'ru' ? 'Открыть повестку для Сеньора' : 'Agenda für Senior öffnen'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            {getTranslation('seniorQuestionsKpi', language)}
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.totalQuestions}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {getTranslation('seniorQuestionsSub', language)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            {getTranslation('answeredKpi', language)}
          </div>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            {stats.resolvedQuestions}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {completionRate}% {getTranslation('clarificationRate', language)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            {getTranslation('openPointsKpi', language)}
          </div>
          <div className="text-2xl font-bold text-rose-700 tabular-nums">
            {stats.unresolvedOpenPoints}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.totalOpenPoints} {getTranslation('ofPoints', language)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            {getTranslation('recommendationsKpi', language)}
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.totalRecommendations}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {getTranslation('recommendationsSub', language)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            {getTranslation('decisionsKpi', language)}
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.totalDecisions}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {getTranslation('decisionsSub', language)}
          </div>
        </div>
      </div>

      {/* Navigation Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div
          onClick={() => onNavigateSection?.('competitors')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-800" />
              <span>{getTranslation('competitors', language)}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">7 Softwareprodukte</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'ru'
              ? 'Исследование SmartDok, QuickBooks Time, Dalux, PlanRadar и Tripletex.'
              : 'Benchmarking von SmartDok, QuickBooks Time, Dalux, PlanRadar und Tripletex.'}
          </p>
          <span className="text-[11px] font-medium text-emerald-800 inline-flex items-center gap-1 pt-1">
            <span>{getTranslation('detailsBtn', language)}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateSection?.('event-storming')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-700" />
              <span>{getTranslation('events', language)}</span>
            </span>
            <span className="text-[11px] text-indigo-700 font-mono font-semibold">18 Events</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'ru'
              ? '18 доменных событий, 10 бизнес-правил и матрица обработки сбоев.'
              : '18 Domain Events, 10 Kernregeln und Fehlerpfade vom Baustelleneinsatz bis ERP.'}
          </p>
          <span className="text-[11px] font-medium text-indigo-800 inline-flex items-center gap-1 pt-1">
            <span>{getTranslation('detailsBtn', language)}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateSection?.('senior-decisions')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span>{getTranslation('seniorDecisions', language)}</span>
            </span>
            <span className="text-[11px] text-rose-700 font-mono font-semibold">10 Fragen</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'ru'
              ? '10 ключевых развилок для сеньора с предложениями и аргументацией.'
              : 'Die 10 zentralen Weichenstellungen mit aktuellem Vorschlag und Begründung.'}
          </p>
          <span className="text-[11px] font-medium text-rose-800 inline-flex items-center gap-1 pt-1">
            <span>{getTranslation('detailsBtn', language)}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Domain matrix table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            {getTranslation('domainOverviewTitle', language)}
          </h2>
          <span className="text-xs text-slate-400">
            {getTranslation('clickRowHint', language)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">{getTranslation('colDomain', language)}</th>
                <th className="py-3 px-4">{getTranslation('colTopic', language)}</th>
                <th className="py-3 px-4 text-center">{getTranslation('colQuestions', language)}</th>
                <th className="py-3 px-4 text-center">{getTranslation('colFindings', language)}</th>
                <th className="py-3 px-4 text-center">{getTranslation('colCompetitors', language)}</th>
                <th className="py-3 px-4 text-center">{getTranslation('colRecs', language)}</th>
                <th className="py-3 px-4 text-center">{getTranslation('colDecisions', language)}</th>
                <th className="py-3 px-4 text-right">{getTranslation('colAction', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TOPIC_ORDER.map((topicId) => {
                const meta = TOPIC_DEFINITIONS[topicId];
                const b = stats.topicBreakdown[topicId];
                const isGreen = meta.colorType === 'green';
                const topicRate = b.questionsTotal > 0
                  ? Math.round((b.questionsResolved / b.questionsTotal) * 100)
                  : 0;

                return (
                  <tr
                    key={topicId}
                    onClick={() => onSelectTopic(topicId)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isGreen ? 'bg-emerald-500' : 'bg-rose-400'
                          }`}
                        />
                        <span className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {meta.sketchTitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {language === 'ru'
                        ? meta.russianTitle
                        : language === 'bilingual'
                          ? `${meta.russianTitle} / ${meta.germanTitle}`
                          : meta.germanTitle}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      <span className="font-semibold text-slate-800">
                        {b.questionsResolved}/{b.questionsTotal}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1.5">
                        ({topicRate}%)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                      {b.findingsCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                      {b.competitorCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                      {b.recommendationsCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums font-semibold text-emerald-800">
                      {b.decisionsCount}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-slate-800 font-medium">
                        <span>{getTranslation('detailsBtn', language)}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
