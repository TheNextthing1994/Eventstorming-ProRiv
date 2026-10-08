import React, { useState } from 'react';
import { Building2, ArrowLeft, ExternalLink, AlertCircle, Search, Filter } from 'lucide-react';
import { DatabaseState, TopicId, CompetitorEntry } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { StatusBadge } from './StatusBadge';

interface CompetitorHubProps {
  databaseState: DatabaseState;
  onSelectTopic: (topicId: TopicId) => void;
  onNavigateHome: () => void;
}

export const CompetitorHub: React.FC<CompetitorHubProps> = ({
  databaseState,
  onSelectTopic,
  onNavigateHome
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const competitors = databaseState.competitors;

  const filteredCompetitors = competitors.filter(c =>
    c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.analyzedFeature.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Übergreifende Analyse
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Status: Vorläufige Schwerpunkte – Extern noch nicht belegt
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Wettbewerbsrecherche & Benchmarking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Systematische Untersuchung von SmartDok, FinkZeit, QuickBooks Time, Dalux, PlanRadar, Fieldwire und Tripletex für das Projekt ISA.
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          ← Zurück zur Originalskizze
        </button>
      </div>

      {/* Warning Notice as requested */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950 block mb-0.5">
            Wichtiger methodischer Grundsatz:
          </span>
          Diese Recherche dokumentiert unsere Untersuchungsrichtungen und Designinspirationen für ProRiv. Sie stellt keine vollständig extern verifizierte Feature-Matrix dar. Unbelegte Felder bleiben bewusst leer; es werden keine erfundenen Quellen, Zitate oder Preise angezeigt.
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Wettbewerber filtern (z. B. SmartDok, Geofence, Dalux)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {/* Competitor Overview Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Untersuchte Softwareprodukte im Überblick
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {competitors.length} Produkte erfasst
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Produkt</th>
                <th className="py-3 px-4">Was wir untersuchen</th>
                <th className="py-3 px-4">Bedeutung für ISA</th>
                <th className="py-3 px-4">Verknüpftes Thema</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompetitors.map(c => {
                const isSelected = selectedProduct === c.id;
                const topicMeta = TOPIC_DEFINITIONS[c.topicId];

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedProduct(isSelected ? null : c.id)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.productName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {c.analyzedFeature}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-900 font-medium">
                      {c.keyTakeaway}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTopic(c.topicId);
                        }}
                        className="text-xs text-slate-600 hover:text-emerald-800 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <span>{topicMeta?.sketchTitle}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} origin={c.origin} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Detaillierte Analyse-Profile der Wettbewerber
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompetitors.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={c.status} origin={c.origin} showOrigin />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {c.productName}
                    </h3>
                    <div className="text-xs font-medium text-emerald-800 mt-0.5">
                      Fokus: {c.analyzedFeature}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTopic(c.topicId)}
                    className="text-[11px] font-mono text-slate-500 hover:text-emerald-800 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                  >
                    Zum Thema {TOPIC_DEFINITIONS[c.topicId]?.sketchTitle} →
                  </button>
                </div>

                {c.investigationGoal && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-900 block mb-0.5">
                      Untersuchte Fragestellung:
                    </span>
                    {c.investigationGoal}
                  </div>
                )}

                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900 block">Beobachteter Ablauf:</span>
                    <p className="text-slate-600 leading-relaxed mt-0.5">{c.observedWorkflow}</p>
                  </div>

                  <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                    <span className="font-semibold text-emerald-950 block">Was wir für ISA lernen können:</span>
                    <p className="text-emerald-900 leading-relaxed mt-0.5">{c.keyTakeaway}</p>
                  </div>

                  {c.disadvantages && (
                    <div>
                      <span className="font-semibold text-rose-950 block">Bekannte Nachteile / Grenzen:</span>
                      <p className="text-slate-600 leading-relaxed mt-0.5">{c.disadvantages}</p>
                    </div>
                  )}

                  <div>
                    <span className="font-semibold text-slate-900 block">Übertragbarkeit auf unser Produkt:</span>
                    <p className="text-slate-600 leading-relaxed mt-0.5">{c.transferability}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Quelle: {c.sourceOrLink ? c.sourceOrLink : 'Keine externe Dokumentation verknüpft (unbelegt)'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
