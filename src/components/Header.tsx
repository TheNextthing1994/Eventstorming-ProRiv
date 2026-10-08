import React from 'react';
import {
  Search,
  Presentation,
  BarChart3,
  ArrowDownToLine,
  Building2,
  Zap,
  HelpCircle,
  Languages
} from 'lucide-react';
import { TopicId, Language } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { getTranslation } from '../i18n/translations';

interface HeaderProps {
  currentView: string;
  currentTopicId?: TopicId;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (view: string, topicId?: TopicId) => void;
  onOpenSearch: () => void;
  onOpenImportExport: () => void;
  onTogglePresentation: () => void;
  isPresentationActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentTopicId,
  language,
  onLanguageChange,
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
            {getTranslation('backToSketch', language)}
          </button>
          <span className="text-slate-600 text-sm">|</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
            {getTranslation('presentation', language)} {currentTopicId ? `· ${TOPIC_DEFINITIONS[currentTopicId]?.sketchTitle}` : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
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
              title="Русский язык для сеньора"
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

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-500 font-mono">{getTranslation('keys', language)}:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono text-[10px]">1-6</kbd> {getTranslation('topics', language)}
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono text-[10px]">ESC</kbd> {getTranslation('sketch', language)}
          </div>

          <button
            onClick={onTogglePresentation}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
          >
            {getTranslation('exitPresentation', language)}
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="min-h-14 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2 shrink-0 z-30 select-none">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onNavigate('home')}
          className="text-base font-bold tracking-tight text-slate-900 hover:text-emerald-800 transition-colors text-left"
        >
          {getTranslation('appName', language)}
        </button>
        <span className="hidden xl:inline text-xs text-slate-400 font-normal">
          {getTranslation('appSubtitle', language)}
        </span>
      </div>

      {/* Meeting-first navigation. Research remains accessible, but doesn't compete for attention. */}
      <nav className="flex items-center gap-1.5">
        <button
          onClick={() => onNavigate('home')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg ${currentView === 'home' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-600 hover:bg-slate-100'}`}>
          {language === 'ru' ? 'Эскиз' : 'Skizze'}
        </button>
        <button
          onClick={() => onNavigate('workshop')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg ${currentView === 'workshop' ? 'bg-emerald-700 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
          {language === 'ru' ? 'Встреча с сеньором' : 'Senior-Workshop'}
        </button>
        <details className="relative group">
          <summary className="px-3 py-2 cursor-pointer rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 list-none select-none">
            {language === 'ru' ? 'Исследование ▾' : 'Recherche ▾'}
          </summary>
          <div className="absolute top-full right-0 mt-2 w-56 p-2 bg-white border border-slate-200 rounded-xl shadow-xl z-40 space-y-1">
            {[
              ['overview', language === 'ru' ? 'Статус' : 'Status & Übersicht'],
              ['competitors', language === 'ru' ? 'Конкуренты' : 'Wettbewerber'],
              ['event-storming', 'Event Storming'],
              ['senior-decisions', language === 'ru' ? 'Открытые решения' : 'Offene Entscheidungen']
            ].map(([view,label])=>(
              <button key={view} onClick={() => onNavigate(view)} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 text-slate-700">{label}</button>
            ))}
            <div className="h-px bg-slate-100 my-1"/>
            <button onClick={onOpenSearch} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 text-slate-700">
              {language === 'ru' ? 'Поиск' : 'Suche'} (Ctrl+K)
            </button>
            <button onClick={onOpenImportExport} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 text-slate-700">
              {language === 'ru' ? 'Импорт / экспорт' : 'Import / Export'}
            </button>
          </div>
        </details>
      </nav>

      {/* Zone 3: Language Switcher & Presentation Button */}
      <div className="flex items-center gap-2">
        {/* Language selector toggle: [ DE | RU | DE+RU ] */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/90 text-[11px] font-mono">
          <button
            onClick={() => onLanguageChange('de')}
            className={`px-2 py-1 rounded transition-all font-semibold ${
              language === 'de'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Deutsch (vollständig auf Deutsch)"
          >
            DE
          </button>
          <button
            onClick={() => onLanguageChange('ru')}
            className={`px-2 py-1 rounded transition-all font-semibold ${
              language === 'ru'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Русский язык для сеньора (все на русском)"
          >
            RU
          </button>
          <button
            onClick={() => onLanguageChange('bilingual')}
            className={`px-2 py-1 rounded transition-all font-semibold ${
              language === 'bilingual'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Двуязычный режим: немецкий и русский параллельно"
          >
            DE+RU
          </button>
        </div>

        <button
          onClick={onTogglePresentation}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
        >
          <Presentation className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">{getTranslation('presentation', language)}</span>
        </button>
      </div>
    </header>
  );
};
