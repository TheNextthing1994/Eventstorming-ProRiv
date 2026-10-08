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
import { TopicId, DatabaseState } from '../types';
import { TOPIC_DEFINITIONS, TOPIC_ORDER } from '../db/defaultData';
import { StatusBadge } from './StatusBadge';

interface PresentationModeProps {
  initialTopicId?: TopicId;
  databaseState: DatabaseState;
  onExit: () => void;
  onNavigateHome: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  initialTopicId,
  databaseState,
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Presentation Bar */}
      <div className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück zur Originalskizze</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                meta.colorType === 'green' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span className="text-sm font-bold tracking-tight text-white uppercase font-mono">
              {meta.sketchTitle}
            </span>
            <span className="text-xs text-slate-400 font-normal">· {meta.germanTitle}</span>
          </div>
        </div>

        {/* Quick topic pills for direct clicking in presentation */}
        <div className="hidden lg:flex items-center gap-1.5">
          {TOPIC_ORDER.map((tId, idx) => {
            const isSelected = tId === currentTopicId;
            const tMeta = TOPIC_DEFINITIONS[tId];
            return (
              <button
                key={tId}
                onClick={() => setCurrentTopicId(tId)}
                className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
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

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Vollbild umschalten"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            Präsentation beenden
          </button>
        </div>
      </div>

      {/* Main Presentation Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto w-full space-y-8 select-text">
        {/* Title Card */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-2 uppercase tracking-widest">
            <span>Themenbereich 0{currentIndex + 1} von 06</span>
            <span>·</span>
            <span>{meta.colorType === 'green' ? 'Architekturkern' : 'Fachmodul'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {meta.sketchTitle}
          </h1>
          <h2 className="text-lg text-slate-300 font-medium mt-1">
            {meta.germanTitle}
          </h2>
          {summary && (
            <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-4xl bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {summary}
            </p>
          )}

          {/* 5-Punkte Senior Briefing */}
          {meta.briefing && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                  1. Senior-Frage
                </span>
                <p className="text-slate-100 font-medium leading-relaxed">
                  {meta.briefing.seniorAsked}
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block font-semibold">
                  2. Bisher herausgefunden
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {meta.briefing.findingsSummary}
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-semibold">
                  3. Andere Programme
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {meta.briefing.competitorSummary}
                </p>
              </div>

              <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-800/60 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
                  4. Empfehlung für ISA
                </span>
                <p className="text-emerald-100 font-medium leading-relaxed">
                  {meta.briefing.recommendationSummary}
                </p>
              </div>

              <div className="p-3.5 bg-rose-950/30 rounded-xl border border-rose-900/50 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-semibold">
                  5. Noch zu klären
                </span>
                <p className="text-rose-200 leading-relaxed">
                  {meta.briefing.openSummary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Senior Questions & Answers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
              Fragen des Seniors ({topicQuestions.filter(q => q.isResolved).length}/{topicQuestions.length} beantwortet)
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
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {q.question}
                    </h4>
                    {q.germanTranslation && q.germanTranslation !== q.question && (
                      <div className="text-xs text-slate-400 mt-1">
                        Bedeutung: {q.germanTranslation}
                      </div>
                    )}
                    {q.answer ? (
                      <div className="mt-3 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                        <span className="font-semibold text-emerald-400 block mb-1">
                          Ergebnis / Antwort:
                        </span>
                        {q.answer}
                      </div>
                    ) : (
                      <div className="text-xs text-amber-400/80 mt-2 italic font-mono">
                        ⏳ Noch offen für Klärung
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Core Decisions (if any) */}
        {topicDecisions.length > 0 && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-emerald-400">
                Beschlossene Architekturentscheidungen ({topicDecisions.length})
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
                  <h4 className="text-sm font-bold text-white">{d.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                    {d.rationale}
                  </p>
                  {d.responsiblePerson && (
                    <div className="text-[11px] text-slate-400">
                      Verantwortlich: {d.responsiblePerson}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Competitor Research (if any) */}
        {topicCompetitors.length > 0 && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
                Wettbewerbsanalyse ({topicCompetitors.length})
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
                    <h4 className="text-sm font-bold text-white">{c.analyzedFeature}</h4>
                  </div>
                  <div className="text-xs space-y-2 text-slate-300">
                    <div>
                      <span className="text-slate-400 font-medium block">Beobachteter Ablauf:</span>
                      <p>{c.observedWorkflow}</p>
                    </div>
                    <div className="p-2.5 bg-emerald-950/30 rounded border border-emerald-900/50">
                      <span className="text-emerald-400 font-semibold block mb-0.5">Key Takeaway:</span>
                      <p className="text-slate-200">{c.keyTakeaway}</p>
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
                Empfehlungen für unser Produkt ({topicRecs.length})
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
                        PRIO: {r.priority}
                      </span>
                      <span className="text-slate-500">·</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <h4 className="text-sm font-bold text-white">{r.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Footer for Slide Flip */}
      <div className="h-14 bg-slate-900/90 border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
        <button
          onClick={() => setCurrentTopicId(prevTopic)}
          className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Vorheriges Thema: {TOPIC_DEFINITIONS[prevTopic].sketchTitle}</span>
        </button>

        <div className="text-xs text-slate-400 font-mono hidden sm:inline">
          Verwende Pfeiltasten (← / →) oder Tasten 1–6
        </div>

        <button
          onClick={() => setCurrentTopicId(nextTopic)}
          className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <span>Nächstes Thema: {TOPIC_DEFINITIONS[nextTopic].sketchTitle}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
