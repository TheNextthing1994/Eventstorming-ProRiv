import React from 'react';
import {
  Search,
  Presentation,
  BarChart3,
  ArrowDownToLine,
  Building2,
  Zap,
  HelpCircle
} from 'lucide-react';
import { TopicId } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';

interface HeaderProps {
  currentView: string;
  currentTopicId?: TopicId;
  onNavigate: (view: string, topicId?: TopicId) => void;
  onOpenSearch: () => void;
  onOpenImportExport: () => void;
  onTogglePresentation: () => void;
  isPresentationActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentTopicId,
  onNavigate,
  onOpenSearch,
  onOpenImportExport,
  onTogglePresentation,
  isPresentationActive
}) => {
  if (isPresentationActive) {
    return (
      <header className="h-14 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-6 select-none shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-sm font-semibold tracking-tight text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
          >
            ← Zurück zur Originalskizze
          </button>
          <span className="text-slate-600 text-sm">|</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
            Präsentationsmodus {currentTopicId ? `· ${TOPIC_DEFINITIONS[currentTopicId]?.sketchTitle}` : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-500 font-mono">Tasten:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono text-[10px]">1-6</kbd> Themen
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono text-[10px]">ESC</kbd> Skizze
          </div>
          <button
            onClick={onTogglePresentation}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
          >
            Beenden
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 select-none">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="text-base font-semibold tracking-tight text-slate-900 hover:text-emerald-800 transition-colors text-left"
        >
          ISA Research
        </button>
        <span className="hidden xl:inline text-xs text-slate-400 font-normal">
          ProRiv AS · Senior Architecture
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onNavigate('home')}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            currentView === 'home'
              ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Originalskizze
        </button>

        <button
          onClick={() => onNavigate('overview')}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
            currentView === 'overview'
              ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Status</span>
        </button>

        <button
          onClick={() => onNavigate('competitors')}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
            currentView === 'competitors'
              ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title="Wettbewerbsrecherche (SmartDok, Dalux, QuickBooks Time...)"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Wettbewerb</span>
        </button>

        <button
          onClick={() => onNavigate('event-storming')}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
            currentView === 'event-storming'
              ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title="Event Storming & 10 Kernregeln"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span>Events</span>
        </button>

        <button
          onClick={() => onNavigate('senior-decisions')}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
            currentView === 'senior-decisions'
              ? 'text-rose-900 bg-rose-50/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title="10 offene Fragen mit dem Senior klären"
        >
          <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Mit Senior klären</span>
          <span className="sm:hidden">Senior</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1"
          title="Globale Suche öffnen (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden lg:inline">Suche</span>
          <kbd className="hidden lg:inline text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded font-mono">⌘K</kbd>
        </button>

        <button
          onClick={onOpenImportExport}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1"
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Import/Export</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePresentation}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
        >
          <Presentation className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Präsentation</span>
        </button>
      </div>
    </header>
  );
};
