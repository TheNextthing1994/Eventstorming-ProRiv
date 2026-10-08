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
import { TopicId } from '../types';

interface EventStormingHubProps {
  onNavigateHome: () => void;
  onSelectTopic: (topicId: TopicId) => void;
}

export const EventStormingHub: React.FC<EventStormingHubProps> = ({
  onNavigateHome,
  onSelectTopic
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'timeline' | 'rules' | 'exceptions'>('timeline');

  const categories = ['all', 'Session & Zeit', 'Rapport & Aufmaß', 'Preis & Kunde', 'ERP & Tripletex'];

  const filteredEvents = selectedCategory === 'all'
    ? DOMAIN_EVENTS_LIST
    : DOMAIN_EVENTS_LIST.filter(e => e.category === selectedCategory);

  const businessRules = [
    { nr: 1, title: 'WorkSession ≠ TimesheetEntry', text: 'Eine gestempelte WorkSession ist nicht automatisch ein freigegebener TimesheetEntry. Erst nach Pausenabzug und Prüfung entsteht ein abrechnungsfähiger Zeiteintrag.' },
    { nr: 2, title: 'TimesheetEntry ≠ WorkReport', text: 'Ein Zeiteintrag ist kein Arbeitsrapport. Die geleisteten Arbeitsstunden für den Lohn sind unabhängig von den produzierten Bohrmetern und Schnittflächen auf der Baustelle.' },
    { nr: 3, title: 'GPS ist Nachweis, kein Lohnabzug', text: 'GPS dient ausschließlich als Plausibilitätsnachweis beim Einstempeln. Eine Standortabweichung darf keinen automatischen Lohnabzug bewirken, sondern führt zu einer Vorarbeiter-Prüfaufgabe.' },
    { nr: 4, title: 'Getrennte Freigabepfade', text: 'Stundenfreigabe (für Lohn/Tripletex) und Rapportfreigabe (für Kundenabrechnung/Aufmaß) sind fachlich unabhängig. Verzögerte Aufmaßprüfungen blockieren die Stundenerfassung nicht.' },
    { nr: 5, title: 'Kundenunterschrift & ERP-Export entkoppelt', text: 'Eine Kundenunterschrift ist keine zwingende Voraussetzung für den internen Stundenexport nach Tripletex. Kunden erhalten SMS-Magic-Links zur asynchronen Prüfung.' },
    { nr: 6, title: 'Exportfehler stornieren keine Freigabe', text: 'Schlägt der API-Aufruf an Tripletex fehl, bleibt der Datensatz fachlich freigegeben. Der Fehler wird in einer Retry-Warteschlange behandelt.' },
    { nr: 7, title: 'Unveränderlicher PriceSnapshot', text: 'Ein freigegebener Arbeitsrapport friert alle Konditionen in einem PriceSnapshot ein. Spätere Preisänderungen in der Stammdatenliste dürfen bestehende Rapporte niemals unbemerkt mutieren.' },
    { nr: 8, title: 'Revisionssichere Korrekturen', text: 'Nachträgliche Änderungen an bereits freigegebenen Objekten erzeugen zwingend eine neue Version (WorkReportRevision) mit dokumentiertem Grund und Audit-Trail.' },
    { nr: 9, title: 'Strikte Export-Idempotenz', text: 'Wiederholte API-Aufrufe an Tripletex (z. B. nach Netzwerk-Timeout) dürfen niemals zu doppelten Stundeneinträgen führen. Jeder Export führt einen Idempotency-Key.' },
    { nr: 10, title: 'Offline-First mit Client-UUIDs', text: 'Offline-Aktionen auf dem Smartphone generieren eigene Client-UUIDs. Bei Wiederverbindung erfolgt eine geordnete, konfliktfreie Synchronisation gegen das Backend.' }
  ];

  const exceptionsList = [
    { case: 'GPS-Signal fehlt oder ungenau (>100m)', handling: 'Clock-in wird nicht blockiert. Event "ClockInExceptionRecorded" markiert den Eintrag zur Vorarbeiter-Sichtung.' },
    { case: 'Mitarbeiter außerhalb des Geofence', handling: 'Ausnahme wird registriert; Vorarbeiter prüft, ob es sich um Baustelleneinrichtung oder Materiallager handelte.' },
    { case: 'Vollständiger Offline-Betrieb (Keller/Tiefgarage)', handling: 'Alle Zeiten, Bohrpositionen und Fotos werden in lokaler SQLite gespeichert. Synchronisation erfolgt automatisch bei Netzrückkehr.' },
    { case: 'Vergessenes Ausstempeln am Schichtende', handling: 'Session bleibt offen oder wird nach Maximalzeit beendet. Vorarbeiter erhält Korrekturaufgabe mit Hinweisfenster.' },
    { case: 'Kunde reagiert nicht auf Magic-Link', handling: 'Link läuft nach Frist ab. Rapport verbleibt kaufmännisch freigegeben; Mahnprozess im Büro greift.' },
    { case: 'Kunde lehnt Rapport oder Positionen ab', handling: 'Event "CustomerReportRejected" löst Klärungsfall aus; Büro und Vorarbeiter passen Mengen an und erstellen neue Revision.' },
    { case: 'Tripletex-API nicht erreichbar / Export fehlgeschlagen', handling: 'Event "TripletexExportFailed" löst automatischen Retry-Zyklus aus. Fachliche Freigabe bleibt uneingeschränkt bestehen.' },
    { case: 'Nachträgliche Änderung nach erfolgreichem ERP-Export', handling: 'Erfordert Stornobuchung oder Differenzkorrektur über versionierte Revision im Backend.' }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Architektur- & Domänenmodell
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Event-Storming-Entwurf (18 Domain Events)
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Event Storming & Fachregeln (Domain Model)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zustandsübergänge, Aggregate, Commands, Policies und Ausnahmebehandlung von der Baustelle bis zum ERP-Export.
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          ← Zurück zur Originalskizze
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'timeline' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          18 Domain Events (Lebenszyklus)
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'rules' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          10 Fachliche Kernregeln
        </button>
        <button
          onClick={() => setActiveTab('exceptions')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'exceptions' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ausnahmefälle & Fehlerpfade
        </button>
      </div>

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1">Bereich:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'Alle Ereignisse' : cat}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="text-indigo-800 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded">
                      {event.category}
                    </span>
                    <span>Aggregate: {event.aggregate}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 font-mono tracking-tight flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{event.name}</span>
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                  <div className="flex items-center gap-1 text-slate-700">
                    <Terminal className="w-3 h-3 text-slate-400" />
                    <span className="font-mono text-[10px]">Command: {event.command}</span>
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    <strong>Policy:</strong> {event.policyOrRule}
                  </div>
                  {event.openDecision && (
                    <div className="text-rose-700 text-[10px] bg-rose-50/60 p-1 rounded">
                      <strong>Offen:</strong> {event.openDecision}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Die 10 unumstößlichen Fachregeln der ISA-Architektur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessRules.map(r => (
              <div key={r.nr} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                    {r.nr}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">{r.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'exceptions' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Dokumentierte Ausnahmebehandlung & Fehlerpfade</span>
          </div>
          <div className="divide-y divide-slate-100">
            {exceptionsList.map((item, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-800 sm:w-1/3">
                  {item.case}
                </span>
                <span className="text-slate-600 sm:w-2/3 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                  {item.handling}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
