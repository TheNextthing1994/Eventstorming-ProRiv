import { ADMIN_JOURNEY_STEPS } from './roleJourneys';
import { WORKSHOP_STEPS } from './workshopContent';
import { DOMAIN_EVENTS_LIST, INITIAL_OPEN_POINTS, SENIOR_DECISION_QUESTIONS } from '../db/knowledgeSeed';
import { generateInitialQuestions } from '../db/defaultData';
import { ISA_TEAM_QUESTIONS } from './isaTeamQuestions';
import { ROLE_QUESTION_LINKS } from './roleQuestionLinks';

export interface IsaQuestionCoverage {
  sourceKey: string;
  source: string;
  text: string;
  questionIds: string[];
  audience: 'isa' | 'team';
}
const t = (n: number) => `amruddy:team:${String(n).padStart(2, '0')}`;
const r = (n: number) => `amruddy:roles:${String(n).padStart(2, '0')}`;

// Questions already covered by the source 95 are referenced, not copied again.
const covered: Record<string, string[]> = {
  'admin:access:deputy': [t(5)],
  'admin:company:master-data': [t(6), r(38)],
  'admin:profile:worker-rights': [t(4), r(9)],
  'admin:site:site-owner': [t(7), r(5)],
  'admin:site:recipient': [r(8)],
  'admin:assignment:assignment-owner': [r(6), t(31), t(18)],
  'admin:assignment:report-owner': [t(10), r(17), t(5)],
  'admin:prices:price-owner': [t(17), r(50)],
  'admin:monitor:dashboard': [t(1), r(24), r(32)],
  'admin:monitor:alert': [r(42), t(38)],
  'admin:correction:time-editor': [r(16), t(33), r(43)],
  'admin:correction:report-editor': [r(23), r(26), r(43)],
  'admin:correction:error-owner': [r(42), r(43)],
  'admin:closure:close-site': [t(25), r(10)],
  'admin:closure:disable-user': [r(3), t(20)],
  'admin:closure:retention': [t(42)],
  'senior:sd-1': [t(4), r(9)], 'senior:sd-2': [t(11), r(18), r(19)],
  'senior:sd-3': [t(20), r(15), r(27)], 'senior:sd-4': [t(33), r(16)],
  'senior:sd-5': [t(4), t(17), r(9)], 'senior:sd-8': [t(22), r(39)],
  'senior:sd-9': [t(6), r(38)], 'senior:sd-10': [t(24), r(43)],
  'open:op-users-1': [t(4), r(9)], 'open:op-clients-1': [t(6), r(38)],
  'open:op-clients-2': [r(7)], 'open:op-raport-2': [t(11), r(18), r(19)],
  'sketch:q-orig-mobile-app-1': [t(26), t(40)], 'sketch:q-orig-mobile-app-3': [t(42)],
  'sketch:q-orig-users-1': [t(4), r(24)], 'sketch:q-orig-users-2': [t(1), r(16), r(49)],
  'sketch:q-orig-users-4': [t(17), t(29), r(20), r(50)],
  'sketch:q-orig-clients-4': [t(32), t(33)],
  'sketch:q-orig-raport-2': [t(4), r(9)], 'sketch:q-orig-raport-3': [t(24), r(43)],
  'sketch:q-orig-raport-4': [t(39)], 'sketch:q-orig-raport-5': [t(34)],
  'sketch:q-orig-raport-6': [r(8), r(33)], 'sketch:q-orig-raport-7': [t(38)],
  'sketch:q-orig-raport-8': [t(11), r(19)],
  'sketch:q-orig-vremya-4': [t(19), r(29)], 'sketch:q-orig-api-3': [t(25), t(38)],
  'process:time': [t(18), t(33)], 'process:work': [t(10), t(11), r(18), r(49)],
  'process:customer': [t(35), t(36), r(36), r(37)],
  'event:de-1': [t(20), r(15), r(27)], 'event:de-2': [t(19), r(29)],
  'event:de-5': [t(33), r(16)], 'event:de-8': [t(11), r(19)],
  'event:de-10': [t(38)], 'event:de-11': [r(50)], 'event:de-18': [r(42), t(24)],
  'raw:7.1': [t(6), t(7), r(6)], 'raw:7.2': [t(9), r(43), t(25)],
  'raw:7.3': [r(45), r(47), r(50)], 'raw:7.4': [r(33), r(35), r(36), r(37)],
  'raw:7.5': [t(18), r(13)], 'raw:7.6': [t(19), t(20), r(12)],
  'raw:7.7': [t(22), t(23), t(24), r(39)], 'raw:7.8': [t(4), r(24)], 'raw:7.9': [r(19)],
  'screenshots:1': [t(27)], 'screenshots:2': [r(45)], 'screenshots:3': [r(18), r(49)],
  'screenshots:4': [t(4), r(9)], 'screenshots:7': [t(6), r(2)],
  'gate:2': [t(18), t(33)], 'gate:3': [r(46), r(47), r(48), r(49), r(50)],
  'qa:p0-1': [t(11), r(18), r(19)], 'qa:p0-3': [t(4), r(9)],
  'qa:p0-4': [t(20), t(21)], 'qa:p0-5': [t(18), r(13)],
  'qa:p1-2': [t(24), r(42), r(43)], 'qa:p1-4': [t(19), t(20), t(21), t(26)],
  'diagram:price-rights': [t(4), r(9)], 'diagram:master-data': [t(6), r(38)],
  'diagram:radius': [t(19), r(29)], 'diagram:travel': [t(18), r(13)],
  'diagram:required-fields': [t(11), r(18)], 'diagram:correction': [t(24), r(43)],
  'diagram:freeze-prices': [r(50)], 'diagram:sync-timing': [t(23), r(40)],
  'diagram:export-documents': [t(22), r(39)],
  'diagramv2:workflow': [t(4), t(11), r(9)], 'diagramv2:time-rules': [t(18), t(19), t(20), t(21)],
  'diagramv2:price-rules': [r(46), r(47), r(49), r(50)], 'diagramv2:customer': [t(12), t(36), r(35)],
  'diagramv2:tripletex': [t(22), t(24), r(39), r(43)], 'diagramv2:architecture': [t(44)],
};
const additional = (key: string) => ISA_TEAM_QUESTIONS.filter(question => question.sourceKeys.includes(key)).map(question => question.id);
const technical = new Set(['open:op-vremya-1', 'open:op-api-1', 'open:op-app-1', 'qa:p1-1', 'qa:p1-2', 'qa:p1-3', 'qa:p1-4', 'qa:p1-5', 'diagram:mfa', 'diagramv2:tripletex', 'diagramv2:architecture']);
const coverage = (sourceKey: string, source: string, text: string): IsaQuestionCoverage => ({
  sourceKey, source, text, questionIds: [...new Set([...(ROLE_QUESTION_LINKS[sourceKey] || covered[sourceKey] || []), ...additional(sourceKey)])], audience: technical.has(sourceKey) ? 'team' : 'isa',
});

const libraryQuestions: [string, string, string][] = [
  ...[
    'Kunden und Objekte: Daten, Anlage, Status und Zuordnung.', 'Rapport, Rechnung, Zeitbezug und Korrekturen.',
    'Preise, Rabatte, Einheiten und Zuschläge.', 'Kundenantwort, Signatur, Ablehnung und verspätete Antwort.',
    'Arbeitszeitregeln, Pausen und Lohnkategorien.', 'Ankunft, HMS, Standort und fehlende Verbindung.',
    'Tripletex-Übertragung, Rückmeldungen und Korrekturen.', 'Vorarbeiterzugang und Zugriffsrechte.', 'Fotoformate und weitere Dateien.',
  ].map((text, i): [string, string, string] => [`raw:7.${i + 1}`, 'Kundengespräch RAW · §7', text]),
  ...[
    'Welche alten Masken werden heute benötigt?', 'Was bedeuteten Q.mm / L.mm und die aktuellen Maße?',
    'Wie werden Artikel, Maße und Zuschläge eingegeben; fehlt ein Sägebeispiel?', 'Wer sieht und ändert Preise und versendet mit oder ohne Preis?',
    'Was bedeutet Hjelpmann/ot beziehungsweise Timberarbeid?', 'Was gehört zu Interner-Timer?',
    'Woher kommen Kunde, Kontakt, Projekt und Avd.nr?', 'Wie laufen Versand, Kundenantwort und Korrektur; gibt es eine Vorarbeiterfreigabe?',
  ].map((text, i): [string, string, string] => [`screenshots:${i + 1}`, 'Screenshot-Auswertung · 11.10.2026', text]),
  ...['Ankunft/GPS/HMS/Offline', 'Zeit/Pausen', 'Rapport/Preis/Korrekturen', 'Kundenantwort und blockierte Folgeprozesse', 'Tripletex/Rollen']
    .map((text, i): [string, string, string] => [`gate:${i + 1}`, 'Living Process Gate V0.2 · §3', text]),
  ...['Pflichtfelder/Fotos', 'RA/AA und Preisversion', 'Zugriffsrechte', 'GPS-/Offline-Ausnahmen', 'Fahrt/Pausen/Überstunden', 'Signaturpflicht']
    .map((text, i): [string, string, string] => [`qa:p0-${i + 1}`, 'Event Storming QA V2 · P0', text]),
  ...['Mapping und Testkonto', 'Übertragung, Lesebestätigung und Korrekturen', 'Rapport in Tripletex', 'GPS, Offline und Datenschutz', 'Betrieb, Region und Backups', 'Kundenlink, Versionen und Zustellung']
    .map((text, i): [string, string, string] => [`qa:p1-${i + 1}`, 'Event Storming QA V2 · P1', text]),
  ...Object.entries({
    'customer-login': 'Kundenlogin oder Link?', 'site-object': 'Reicht Site; Projekt oder Bauabschnitt?', 'gps-history': 'GPS nur am Start/Ende oder Verlauf?',
    'geofence-owner': 'Wer legt Geofence an?', 'reference-times': 'Referenzzeiten, Herkunft und Abweichungsgrenze?', 'offline-duration': 'Wie lange ohne Netz?',
    'signature-policy': 'Muss jeder Rapport unterschrieben werden; welches Verfahren?', 'mvp-surcharges': 'Welche Zuschläge braucht das MVP?',
    'tripletex-activities': 'Welche Aktivitäten braucht ProRiv?', 'pilot-kill-criteria': 'Was stoppt den Piloten?', 'price-rights': 'Wer sieht oder ändert Preise?',
    'master-data': 'Welche Daten sind in welchem System führend?', 'radius': 'Welcher Geofence-Radius?', 'travel': 'Wie behandeln wir Reisezeit?',
    'required-fields': 'Welche Angaben sind Pflicht?', 'correction': 'Wer ändert nach Versand und Export?', 'freeze-prices': 'Wann wird der Preis fixiert?',
    'sync-timing': 'Echtzeit oder gesammelte Übergabe?', 'export-documents': 'Rapport, PDF, Fotos oder Link in Tripletex?', 'mfa': 'Zusätzliche Absicherung für Admin?',
  }).map(([id, text]): [string, string, string] => [`diagram:${id}`, 'Historische Event-Storming-Karte · keine Prozessfreigabe', text]),
  ...Object.entries({
    'clock-in': 'Offline-Clock-in blockieren oder vorläufig vormerken und nachprüfen?',
    workflow: 'Zeit- und Rapportfreigabe, Pflichtfelder und Preisrechte?', 'time-rules': 'Standortumfang, Reisezeit, Offline und Ausnahmen?',
    'price-rules': 'RA/AA, Mindestwerte, Zuschläge und Reihenfolge?', customer: 'Bestätigung oder Signatur; Berechtigung und Fristen?',
    tripletex: 'API-Felder, Schreib-/Korrekturpfade und Rapportziel?', architecture: 'AWS-Ausprägung, Region, Backend, Kosten und Backups?',
  }).map(([id, text]): [string, string, string] => [`diagramv2:${id}`, 'Event Storming KONSISTENT V2 · sechs Seiten', text]),
];

export const ISA_PROJECT_SOURCE_COVERAGE: IsaQuestionCoverage[] = [
  ...ADMIN_JOURNEY_STEPS.flatMap(step => step.questions.map(question => coverage(`admin:${step.id}:${question.id}`, 'Admin-Rollen-Workshop', question.text.de))),
  ...WORKSHOP_STEPS.map(step => coverage(`process:${step.id}`, 'Prozess-Workshop', step.openQuestion)),
  ...SENIOR_DECISION_QUESTIONS.map(question => coverage(`senior:${question.id}`, 'Senior-Entscheidungsfragen', question.question)),
  ...INITIAL_OPEN_POINTS.map(question => coverage(`open:${question.id}`, 'Offene Projektpunkte', question.question)),
  ...generateInitialQuestions().map(question => coverage(`sketch:${question.id}`, 'Senior-Skizze · konkrete Kundenfrage', question.clientQuestion || question.germanTranslation || question.question)),
  ...DOMAIN_EVENTS_LIST.map(event => coverage(`event:${event.id}`, `Event Storming · ${event.name}`, event.openDecision || event.name)),
  ...libraryQuestions.map(([key, source, text]) => coverage(key, source, text)),
];
