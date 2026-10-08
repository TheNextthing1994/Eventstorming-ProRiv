import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Building2,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { TopicId, DatabaseState, Language } from '../types';
import { TOPIC_DEFINITIONS, TOPIC_ORDER } from '../db/defaultData';
import { StatusBadge } from './StatusBadge';
import { getTranslation, getDualText } from '../i18n/translations';

interface PresentationModeProps {
  initialTopicId?: TopicId;
  databaseState: DatabaseState;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onExit: () => void;
  onNavigateHome: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  initialTopicId,
  databaseState,
  language,
  onLanguageChange,
  onExit,
  onNavigateHome
}) => {
  const [currentTopicId, setCurrentTopicId] = useState<TopicId>(initialTopicId || 'mobile-app');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const meta = TOPIC_DEFINITIONS[currentTopicId];
  const summary = databaseState.topics[currentTopicId]?.summary || '';

  const topicQuestions = databaseState.questions.filter(q => q.topicId === currentTopicId);
  const topicFindings = databaseState.findings.filter(f => f.topicId === currentTopicId || f.additionalTopicIds?.includes(currentTopicId));
  const topicCompetitors = databaseState.competitors.filter(c => c.topicId === currentTopicId || c.additionalTopicIds?.includes(currentTopicId));
  const topicDecisions = databaseState.decisions.filter(d => d.topicId === currentTopicId || d.additionalTopicIds?.includes(currentTopicId));
  const topicRecs = databaseState.recommendations.filter(r => r.topicId === currentTopicId || r.additionalTopicIds?.includes(currentTopicId));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onNavigateHome();
      } else if (e.key === 'ArrowRight') {
        const currentIndex = TOPIC_ORDER.indexOf(currentTopicId);
        const nextIndex = (currentIndex + 1) % TOPIC_ORDER.length;
        setCurrentTopicId(TOPIC_ORDER[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = TOPIC_ORDER.indexOf(currentTopicId);
        const prevIndex = (currentIndex - 1 + TOPIC_ORDER.length) % TOPIC_ORDER.length;
        setCurrentTopicId(TOPIC_ORDER[prevIndex]);
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (TOPIC_ORDER[idx]) {
          setCurrentTopicId(TOPIC_ORDER[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTopicId, onNavigateHome]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentIndex = TOPIC_ORDER.indexOf(currentTopicId);
  const prevTopic = TOPIC_ORDER[(currentIndex - 1 + TOPIC_ORDER.length) % TOPIC_ORDER.length];
  const nextTopic = TOPIC_ORDER[(currentIndex + 1) % TOPIC_ORDER.length];

  const currentBriefing = (language === 'ru' || language === 'bilingual') && meta.briefingRu
    ? meta.briefingRu
    : meta.briefing;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Presentation Bar */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{getTranslation('backToSketch', language)}</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                meta.colorType === 'green' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span className="text-sm font-bold tracking-tight text-white uppercase font-mono">
              {meta.sketchTitle}
            </span>
            <span className="text-xs text-slate-400 font-normal hidden md:inline">
              · {language === 'ru' ? meta.russianTitle : meta.germanTitle}
            </span>
          </div>
        </div>

        {/* Quick topic pills */}
        <div className="hidden lg:flex items-center gap-1.5">
          {TOPIC_ORDER.map((tId, idx) => {
            const isSelected = tId === currentTopicId;
            const tMeta = TOPIC_DEFINITIONS[tId];
            return (
              <button
                key={tId}
                onClick={() => setCurrentTopicId(tId)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  isSelected
                    ? 'bg-white text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {idx + 1}. {tMeta.sketchTitle}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher in Presentation Mode */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px] font-mono">
            <button
              onClick={() => onLanguageChange('de')}
              className={`px-2 py-0.5 rounded transition-colors ${language === 'de' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Deutsch"
            >
              DE
            </button>
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-2 py-0.5 rounded transition-colors ${language === 'ru' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Русский для сеньора"
            >
              RU
            </button>
            <button
              onClick={() => onLanguageChange('bilingual')}
              className={`px-2 py-0.5 rounded transition-colors ${language === 'bilingual' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Двуязычный режим (DE + RU)"
            >
              DE+RU
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={language === 'ru' ? 'Полноэкранный режим' : 'Vollbild'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            {getTranslation('exitPresentation', language)}
          </button>
        </div>
      </div>

      {/* Main Presentation Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto w-full space-y-8 select-text">
        {/* Title Card */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-2 uppercase tracking-widest">
            <span>
              {language === 'ru' ? `Тематическая область 0${currentIndex + 1} из 06` : `Themenbereich 0${currentIndex + 1} von 06`}
            </span>
            <span>·</span>
            <span>{meta.colorType === 'green' ? (language === 'ru' ? 'Архитектурное ядро' : 'Architekturkern') : (language === 'ru' ? 'Бизнес-модуль' : 'Fachmodul')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {meta.sketchTitle}
          </h1>
          <h2 className="text-lg text-slate-300 font-medium mt-1">
            {language === 'ru'
              ? meta.russianTitle
              : language === 'bilingual'
                ? `${meta.russianTitle} · ${meta.germanTitle}`
                : meta.germanTitle}
          </h2>

          {/* 5-Point Senior Briefing */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                {getTranslation('briefing1', language)}
              </span>
              <p className="text-slate-100 font-medium leading-relaxed">
                {currentBriefing.seniorAsked}
              </p>
              {language === 'bilingual' && meta.briefing && meta.briefing.seniorAsked !== currentBriefing.seniorAsked && (
                <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                  DE: {meta.briefing.seniorAsked}
                </p>
              )}
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block font-semibold">
                {getTranslation('briefing2', language)}
              </span>
              <p className="text-slate-200 leading-relaxed">
                {currentBriefing.findingsSummary}
              </p>
              {language === 'bilingual' && meta.briefing && meta.briefing.findingsSummary !== currentBriefing.findingsSummary && (
                <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                  DE: {meta.briefing.findingsSummary}
                </p>
              )}
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-semibold">
                {getTranslation('briefing3', language)}
              </span>
              <p className="text-slate-200 leading-relaxed">
                {currentBriefing.competitorSummary}
              </p>
              {language === 'bilingual' && meta.briefing && meta.briefing.competitorSummary !== currentBriefing.competitorSummary && (
                <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                  DE: {meta.briefing.competitorSummary}
                </p>
              )}
            </div>

            <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-800/60 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
                {getTranslation('briefing4', language)}
              </span>
              <p className="text-emerald-100 font-medium leading-relaxed">
                {currentBriefing.recommendationSummary}
              </p>
              {language === 'bilingual' && meta.briefing && meta.briefing.recommendationSummary !== currentBriefing.recommendationSummary && (
                <p className="text-[11px] text-emerald-300/70 italic pt-1 border-t border-emerald-900">
                  DE: {meta.briefing.recommendationSummary}
                </p>
              )}
            </div>

            <div className="p-3.5 bg-rose-950/30 rounded-xl border border-rose-900/50 space-y-1">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-semibold">
                {getTranslation('briefing5', language)}
              </span>
              <p className="text-rose-200 leading-relaxed">
                {currentBriefing.openSummary}
              </p>
              {language === 'bilingual' && meta.briefing && meta.briefing.openSummary !== currentBriefing.openSummary && (
                <p className="text-[11px] text-rose-300/70 italic pt-1 border-t border-rose-900">
                  DE: {meta.briefing.openSummary}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 1: Senior Questions & Answers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
              {language === 'ru'
                ? `Вопросы сеньора (${topicQuestions.filter(q => q.isResolved).length}/${topicQuestions.length} решено)`
                : `Fragen des Seniors (${topicQuestions.filter(q => q.isResolved).length}/${topicQuestions.length} beantwortet)`}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicQuestions.map(q => (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  q.isResolved
                    ? 'bg-emerald-950/20 border-emerald-800/50'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      q.isResolved ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono mb-1">
                      {language === 'ru' ? 'Оригинал из эскиза:' : 'Original:'} {q.question}
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {language === 'ru'
                        ? (q.russianTranslation || q.question)
                        : language === 'bilingual'
                          ? (q.russianTranslation ? `${q.russianTranslation} / ${q.germanTranslation || q.question}` : (q.germanTranslation || q.question))
                          : (q.germanTranslation || q.question)}
                    </h4>

                    {q.answer ? (
                      <div className="mt-3 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                        <span className="font-semibold text-emerald-400 block mb-1">
                          {language === 'ru' ? 'Результат / Ответ:' : 'Ergebnis / Antwort:'}
                        </span>
                        {language === 'ru' ? (q.answerRu || q.answer) : q.answer}
                      </div>
                    ) : (
                      <div className="text-xs text-amber-400/80 mt-2 italic font-mono">
                        {language === 'ru' ? '⏳ Открыто для согласования' : '⏳ Noch offen für Klärung'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Core Decisions */}
        {topicDecisions.length > 0 && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-emerald-400">
                {language === 'ru'
                  ? `Зафиксированные архитектурные решения (${topicDecisions.length})`
                  : `Beschlossene Architekturentscheidungen (${topicDecisions.length})`}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicDecisions.map(d => (
                <div
                  key={d.id}
                  className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-bold uppercase">{d.status}</span>
                    <span>{d.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'ru'
                      ? (d.titleRu || d.title)
                      : language === 'bilingual'
                        ? (d.titleRu ? `${d.titleRu} / ${d.title}` : d.title)
                        : d.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                    {language === 'ru' ? (d.rationaleRu || d.rationale) : d.rationale}
                  </p>
                  {d.responsiblePerson && (
                    <div className="text-[11px] text-slate-400">
                      {language === 'ru' ? 'Ответственный:' : 'Verantwortlich:'} {d.responsiblePerson}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Competitor Research */}
        {topicCompetitors.length > 0 && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
                {language === 'ru'
                  ? `Анализ программ-аналогов (${topicCompetitors.length})`
                  : `Wettbewerbsanalyse (${topicCompetitors.length})`}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicCompetitors.map(c => (
                <div
                  key={c.id}
                  className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3"
                >
                  <div>
                    <div className="text-xs font-mono text-emerald-400 uppercase">
                      {c.productName}
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {language === 'ru'
                        ? (c.analyzedFeatureRu || c.analyzedFeature)
                        : language === 'bilingual'
                          ? (c.analyzedFeatureRu ? `${c.analyzedFeatureRu} / ${c.analyzedFeature}` : c.analyzedFeature)
                          : c.analyzedFeature}
                    </h4>
                  </div>
                  <div className="text-xs space-y-2 text-slate-300">
                    <div>
                      <span className="text-slate-400 font-medium block">
                        {language === 'ru' ? 'Наблюдаемый процесс:' : 'Beobachteter Ablauf:'}
                      </span>
                      <p>{language === 'ru' ? (c.observedWorkflowRu || c.observedWorkflow) : c.observedWorkflow}</p>
                    </div>
                    <div className="p-2.5 bg-emerald-950/30 rounded border border-emerald-900/50">
                      <span className="text-emerald-400 font-semibold block mb-0.5">
                        {language === 'ru' ? 'Что берем для ISA:' : 'Key Takeaway:'}
                      </span>
                      <p className="text-slate-200">{language === 'ru' ? (c.keyTakeawayRu || c.keyTakeaway) : c.keyTakeaway}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Recommendations */}
        {topicRecs.length > 0 && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
                {language === 'ru'
                  ? `Архитектурные рекомендации (${topicRecs.length})`
                  : `Empfehlungen für unser Produkt (${topicRecs.length})`}
              </h3>
            </div>

            <div className="space-y-3">
              {topicRecs.map(r => (
                <div
                  key={r.id}
                  className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                        {language === 'ru' ? 'Приоритет:' : 'PRIO:'} {r.priority}
                      </span>
                      <span className="text-slate-500">·</span>
                      <StatusBadge status={r.status} language={language} />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {language === 'ru'
                        ? (r.titleRu || r.title)
                        : language === 'bilingual'
                          ? (r.titleRu ? `${r.titleRu} / ${r.title}` : r.title)
                          : r.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {language === 'ru' ? (r.descriptionRu || r.description) : r.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Footer */}
      <div className="h-14 bg-slate-900/90 border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
        <button
          onClick={() => setCurrentTopicId(prevTopic)}
          className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>
            {language === 'ru'
              ? `Предыдущая тема: ${TOPIC_DEFINITIONS[prevTopic].sketchTitle}`
              : `Vorheriges Thema: ${TOPIC_DEFINITIONS[prevTopic].sketchTitle}`}
          </span>
        </button>

        <div className="text-xs text-slate-400 font-mono hidden sm:inline">
          {language === 'ru'
            ? 'Используйте стрелки (← / →) или клавиши 1–6'
            : 'Verwende Pfeiltasten (← / →) oder Tasten 1–6'}
        </div>

        <button
          onClick={() => setCurrentTopicId(nextTopic)}
          className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <span>
            {language === 'ru'
              ? `Следующая тема: ${TOPIC_DEFINITIONS[nextTopic].sketchTitle}`
              : `Nächstes Thema: ${TOPIC_DEFINITIONS[nextTopic].sketchTitle}`}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
