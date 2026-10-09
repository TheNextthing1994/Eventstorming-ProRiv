import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Filter,
  Layers,
  Terminal,
  Server
} from 'lucide-react';
import { DOMAIN_EVENTS_LIST } from '../db/knowledgeSeed';
import { EVENT_STORMING_LEGACY_RULES, EVENT_STORMING_LEGACY_EXCEPTIONS } from '../data/eventStormingLegacy';
import { TopicId, Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface EventStormingHubProps {
  language: Language;
  onNavigateHome: () => void;
  onSelectTopic: (topicId: TopicId) => void;
}

export const EventStormingHub: React.FC<EventStormingHubProps> = ({
  language,
  onNavigateHome,
  onSelectTopic
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'timeline' | 'rules' | 'exceptions'>('timeline');

  const categories = language === 'ru'
    ? [
        { id: 'all', label: 'Все категории' },
        { id: 'Session & Zeit', label: 'Сессии и время' },
        { id: 'Rapport & Aufmaß', label: 'Рапорты и замеры' },
        { id: 'Preis & Kunde', label: 'Цены и клиенты' },
        { id: 'ERP & Tripletex', label: 'ERP и Tripletex' }
      ]
    : language === 'bilingual'
      ? [
          { id: 'all', label: 'Alle / Все' },
          { id: 'Session & Zeit', label: 'Zeit / Время' },
          { id: 'Rapport & Aufmaß', label: 'Rapport / Замеры' },
          { id: 'Preis & Kunde', label: 'Preise / Цены' },
          { id: 'ERP & Tripletex', label: 'ERP / Tripletex' }
        ]
      : [
          { id: 'all', label: 'Alle Kategorien' },
          { id: 'Session & Zeit', label: 'Session & Zeit' },
          { id: 'Rapport & Aufmaß', label: 'Rapport & Aufmaß' },
          { id: 'Preis & Kunde', label: 'Preis & Kunde' },
          { id: 'ERP & Tripletex', label: 'ERP & Tripletex' }
        ];

  const filteredEvents = selectedCategory === 'all'
    ? DOMAIN_EVENTS_LIST
    : DOMAIN_EVENTS_LIST.filter(e => e.category === selectedCategory);

  const businessRules = EVENT_STORMING_LEGACY_RULES;
  const exceptionsList = EVENT_STORMING_LEGACY_EXCEPTIONS;

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {language === 'ru' ? 'Доменная модель и архитектура' : 'Architektur- & Domänenmodell'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {language === 'ru' ? 'Event Storming (18 событий)' : 'Event-Storming-Entwurf (18 Domain Events)'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {getTranslation('eventsTitle', language)}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {getTranslation('eventsSubtitle', language)}
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          {getTranslation('backToSketch', language)}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 leading-relaxed">
        {language === 'ru'
          ? 'Внимание: здесь сохранён исторический проект Event Storming. Старые обязательные согласования рапорта прорабом или офисом НЕ подтверждены заказчиком. Согласно разговору, рабочий отправляет рапорт клиенту сам; прораб проверяет часы в Tripletex. Обновлённую версию процесса смотрите в Senior-Workshop.'
          : 'Hinweis: Hier bleibt der historische Event-Storming-Entwurf erhalten. Frühere Pflichtfreigaben des Rapports durch Vorarbeiter oder Büro sind NICHT kundenseitig bestätigt. Laut Gespräch sendet der Arbeiter den Rapport selbst; der Vorarbeiter prüft die Stunden in Tripletex. Der aktuelle kundenbezogene Ablauf steht im Senior-Workshop.'}
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{getTranslation('tabTimeline', language)}</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{getTranslation('tabRules', language)}</span>
        </button>

        <button
          onClick={() => setActiveTab('exceptions')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'exceptions'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{getTranslation('tabExceptions', language)}</span>
        </button>
      </div>

      {/* Tab 1: Timeline / Events */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">
                {language === 'ru' ? 'Фильтр по этапу:' : 'Kategorie-Filter:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-indigo-100 text-indigo-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2.5 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200/60">
                    {language === 'ru' && event.categoryRu ? event.categoryRu : event.category}
                  </span>
                  <span className="text-slate-400">{event.aggregate}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-amber-900 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{event.name}</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {language === 'ru' && event.descriptionRu ? event.descriptionRu : event.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                  <div className="text-indigo-800 font-mono">
                    <span className="text-slate-400">Command: </span>{event.command}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-medium text-slate-700">
                      {language === 'ru' ? 'Правило: ' : 'Regel: '}
                    </span>
                    {language === 'ru' && event.policyOrRuleRu ? event.policyOrRuleRu : event.policyOrRule}
                  </div>
                  {event.openDecision && (
                    <div className="text-rose-700 bg-rose-50/70 p-1.5 rounded mt-1">
                      <span className="font-semibold">
                        {language === 'ru' ? 'Спорный момент: ' : 'Zu entscheiden: '}
                      </span>
                      {language === 'ru' && event.openDecisionRu ? event.openDecisionRu : event.openDecision}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 10 Core Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-950 font-medium">
            {language === 'ru'
              ? '10 нерушимых доменных правил архитектуры ISA для ProRiv AS'
              : '10 architektonische Kernregeln zur fehlerfreien Implementierung des MVP für ProRiv AS'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {businessRules.map(r => (
              <div
                key={r.nr}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-900 text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                    {r.nr}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'ru' ? r.titleRu : r.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">
                  {language === 'ru' ? r.textRu : r.text}
                </p>
                {language === 'bilingual' && (
                  <p className="text-[11px] text-slate-400 italic pl-7 border-t border-slate-100 pt-1">
                    DE: {r.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Exceptions Matrix */}
      {activeTab === 'exceptions' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-1/3">
                  {language === 'ru' ? 'Исключительная ситуация' : 'Ausnahmefall / Störung'}
                </th>
                <th className="py-3 px-4">
                  {language === 'ru' ? 'Регламентированная обработка в ISA' : 'Architekturbehandlung in ISA'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exceptionsList.map((exc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-rose-900 align-top">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{language === 'ru' ? exc.caseRu : exc.case}</span>
                    </div>
                    {language === 'bilingual' && (
                      <div className="text-[11px] text-slate-400 font-normal pl-5 mt-0.5">
                        DE: {exc.case}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed align-top">
                    {language === 'ru' ? exc.handlingRu : exc.handling}
                    {language === 'bilingual' && (
                      <div className="text-[11px] text-slate-500 italic mt-0.5">
                        DE: {exc.handling}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
