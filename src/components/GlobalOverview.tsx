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
import { DatabaseState, TopicId } from '../types';
import { TOPIC_DEFINITIONS, TOPIC_ORDER } from '../db/defaultData';
import { calculateGlobalStats } from '../db/indexedDb';
import { MVP_STRATEGIC_STATEMENT } from '../db/knowledgeSeed';

interface GlobalOverviewProps {
  databaseState: DatabaseState;
  onSelectTopic: (topicId: TopicId) => void;
  onNavigateHome: () => void;
  onNavigateSection?: (section: string) => void;
}

export const GlobalOverview: React.FC<GlobalOverviewProps> = ({
  databaseState,
  onSelectTopic,
  onNavigateHome,
  onNavigateSection
}) => {
  const stats = calculateGlobalStats(databaseState);

  const completionRate = stats.totalQuestions > 0
    ? Math.round((stats.resolvedQuestions / stats.totalQuestions) * 100)
    : 0;

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Projekt ISA · ProRiv AS
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Recherche- und Statusübersicht
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Echtzeit-Kennzahlen, MVP-Strategie und Fortschritt über alle 6 Bereiche der Originalskizze.
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          ← Zurück zur Originalskizze
        </button>
      </div>

      {/* STRATEGIC MVP BANNER (Verpflichtend aus Auftrag 2) */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
          <Target className="w-4 h-4 text-emerald-400" />
          <span>Strategischer Grundsatz für das MVP</span>
        </div>

        <blockquote className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight leading-snug">
          &bdquo;{MVP_STRATEGIC_STATEMENT.quote}&ldquo;
        </blockquote>

        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-emerald-300 block mb-2">
            Empfohlener erster Pilot für ProRiv AS:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-300">
            {MVP_STRATEGIC_STATEMENT.pilotScope.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards (Zero-slop, clean numbers with tabular-nums) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Senior Fragen
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.totalQuestions}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Originalfragen aus Skizze
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200/70 bg-emerald-50/20 shadow-xs">
          <div className="text-[11px] font-mono text-emerald-800 uppercase tracking-wider mb-1">
            Beantwortet
          </div>
          <div className="text-2xl font-bold text-emerald-900 tabular-nums">
            {stats.resolvedQuestions}
          </div>
          <div className="text-xs text-emerald-700 mt-1 tabular-nums">
            {completionRate}% Klärungsquote
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-mono text-rose-700 uppercase tracking-wider mb-1">
            Offene Punkte
          </div>
          <div className="text-2xl font-bold text-rose-900 tabular-nums">
            {stats.unresolvedOpenPoints}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            von {stats.totalOpenPoints} Klärungsbedarfen
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Empfehlungen
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.totalRecommendations}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Architekturvorschläge
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Entscheidungen
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.totalDecisions}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Dokumentierte Beschlüsse
          </div>
        </div>
      </div>

      {/* Quick Access to Cross-Domain Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          onClick={() => onNavigateSection?.('competitors')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>Wettbewerbsrecherche</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">7 Produkte</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            SmartDok, Dalux, QuickBooks Time, PlanRadar, Fieldwire & Tripletex im Detail analysiert.
          </p>
          <span className="text-[11px] font-medium text-emerald-800 inline-flex items-center gap-1 pt-1">
            <span>Zur Wettbewerbsübersicht</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateSection?.('event-storming')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Event Storming Hub</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">18 Events</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Lebenszyklus, 10 Fachregeln und dokumentierte Ausnahmepfade von Baustelle bis ERP.
          </p>
          <span className="text-[11px] font-medium text-emerald-800 inline-flex items-center gap-1 pt-1">
            <span>Zu den Domain Events</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateSection?.('senior-decisions')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span>Mit dem Senior klären</span>
            </span>
            <span className="text-[11px] text-rose-700 font-mono font-semibold">10 Fragen</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Die 10 zentralen Weichenstellungen mit aktuellem Vorschlag und Begründung.
          </p>
          <span className="text-[11px] font-medium text-rose-800 inline-flex items-center gap-1 pt-1">
            <span>Zur Entscheidungsliste</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Domain matrix table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Übersicht nach Themenbereichen
          </h2>
          <span className="text-xs text-slate-400">
            Klicke auf eine Zeile für die Detailanalyse
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Bereich (Skizze)</th>
                <th className="py-3 px-4">Thema (Deutsch)</th>
                <th className="py-3 px-4 text-center">Fragen (Geklärt/Total)</th>
                <th className="py-3 px-4 text-center">Erkenntnisse</th>
                <th className="py-3 px-4 text-center">Wettbewerb</th>
                <th className="py-3 px-4 text-center">Empfehlungen</th>
                <th className="py-3 px-4 text-center">Entscheidungen</th>
                <th className="py-3 px-4 text-right">Aktion</th>
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
                      {meta.germanTitle}
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
                        <span>Details</span>
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
