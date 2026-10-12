import { ISA_TEAM_QUESTIONS, type IsaQuestionView, type IsaTeamQuestion } from './isaTeamQuestions';
import type { LocalizedText } from './roleJourneys';
import { isaQuestionsForView } from '../utils/isaQuestions';

export const ISA_QUESTION_DEPTH_VALUES = [0, 20, 40, 60, 80, 100] as const;
export type IsaQuestionDepth = typeof ISA_QUESTION_DEPTH_VALUES[number];
export const ISA_QUESTION_DEPTH_STORAGE_KEY = 'isa_question_depth_v1';
const l = (de: string, ru: string): LocalizedText => ({ de, ru });
const t = (n: number) => `amruddy:team:${String(n).padStart(2, '0')}`;
const r = (n: number) => `amruddy:roles:${String(n).padStart(2, '0')}`;
const p = (id: string) => `proriv:project:${id}`;

interface DepthPacket {
  value: IsaQuestionDepth;
  title: LocalizedText;
  purpose: LocalizedText;
  addedIds: string[];
}

/** Editorial interview depth. Values are not quotas or measured coverage. */
const packets: DepthPacket[] = [
  { value: 0, title: l('Minimum', 'Минимум'), purpose: l('Zuerst die offenen Entscheidungen, die Rechte, Ablauf, Preise und Datenübergabe verändern.', 'Сначала открытые решения, которые меняют права, процесс, цены и передачу данных.'), addedIds: [
    t(4), t(6), p('presence-method'), p('break-rules'), t(11), p('price-priority'), r(47),
    p('rapport-sender-policy'), p('customer-gates'), t(22), t(21), t(27),
  ] },
  { value: 20, title: l('Kernablauf', 'Основной процесс'), purpose: l('Den normalen Einsatz konkret machen: Zuständigkeiten, Abrechnungsregeln und Stundenprüfung.', 'Уточнить обычный выезд: ответственность, правила расчёта и проверку часов.'), addedIds: [
    p('role-combination'), t(8), t(9), p('arrival-vs-start'), p('hms-responsibility'), p('hms-app-scope'), p('gps-scope'),
    p('ra-aa-details'), p('helper-400'), r(46), p('discount-scope'), p('send-without-price'),
    p('foreman-app-purpose'), p('tripletex-report-view'), p('hours-approval-location'),
    p('weekly-overtime'), t(23), t(33), r(43), t(10), t(29),
  ] },
  { value: 40, title: l('Wichtige Ausnahmen', 'Важные исключения'), purpose: l('Fehler, Rückfragen, strittige Positionen, fehlende Verbindung und geänderte Einsätze klären.', 'Разобрать ошибки, спорные позиции, отсутствие связи и изменения выездов.'), addedIds: [
    p('sent-report-correction'), r(16), p('time-deadline'), t(20), p('offline-duration'), p('offline-conflict'), p('offline-new-assignment'),
    p('customer-link-validity'), p('partial-acceptance'), p('signature-required'), t(35), p('late-customer-response'),
    p('pending-photo-send'), p('delivery-failure'), p('absent-author-correction'), p('minimum-order'),
    p('missing-matrix-row'), p('surcharge-conditions'), p('height-lift'), r(48), p('solo-worker'), t(31), t(32),
  ] },
  { value: 60, title: l('Alltag und Übergaben', 'Повседневная работа и передача'), purpose: l('Einladung, Vorbereitung, Dokumentation, Ansprechpartner und Zusammenarbeit im Alltag ergänzen.', 'Добавить приглашения, подготовку, документацию, контакты и взаимодействие в работе.'), addedIds: [
    p('first-admin'), p('invitation-channel'), p('invitation-expiry'), p('employee-profile'), p('login-method'),
    r(5), p('project-structure'), t(30), p('site-prerequisites'), r(11), r(24), t(18), r(28), r(30), r(17), r(18), r(19),
    p('legacy-work-categories'), p('saw-example'), p('other-attachments'), p('warranty-rework'),
    p('rapport-number'), p('rapport-deadline'), p('time-report-link'), p('customer-login'), r(33), r(34), r(35),
    p('temporary-workers'), p('team-clock-in'), p('tripletex-activities'), p('tripletex-test-owner'), p('tripletex-feedback'),
    r(42), t(38), p('reopen-site'), t(25), t(5),
  ] },
  { value: 80, title: l('Vertiefung', 'Подробный разбор'), purpose: l('Weitere Rollenperspektiven sowie Einführung, Betrieb und Abnahmekriterien besprechen.', 'Обсудить другие роли, запуск, эксплуатацию и критерии приёмки.'), addedIds: [
    p('overnight-time'), p('reference-times'), p('pilot-acceptance'), p('outage-recovery'), p('app-distribution'), p('working-languages'),
    r(4), r(8), r(9), r(12), r(13), r(14), r(15), r(20), r(21), r(22), r(23), r(25), r(26), r(27), r(29), r(31), r(32),
    t(12), t(13), t(15), t(16), t(17), t(19), t(24), t(28), t(36), t(37), t(39), t(41), t(42), t(43), t(44), t(45),
  ] },
  { value: 100, title: l('Vollständiger Katalog', 'Полный каталог'), purpose: l('Alle Fragen einschließlich sämtlicher Originale und weiterer Ich-Perspektiven anzeigen.', 'Показать все вопросы, включая все оригиналы и остальные вопросы от первого лица.'), addedIds: [] },
];

const knownIds = new Set(ISA_TEAM_QUESTIONS.map(question => question.id));
const rankedIds = new Set<string>();
export const ISA_QUESTION_DEPTH_PACKETS = packets.map(packet => {
  for (const id of packet.addedIds) {
    if (!knownIds.has(id) || rankedIds.has(id)) throw new Error(`Invalid interview priority: ${id}`);
    rankedIds.add(id);
  }
  return { ...packet, questionIds: packet.value === 100 ? [...knownIds] : [...rankedIds] };
});

export function parseIsaQuestionDepth(value: unknown): IsaQuestionDepth {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN;
  return ISA_QUESTION_DEPTH_VALUES.includes(number as IsaQuestionDepth) ? number as IsaQuestionDepth : 0;
}

export function isaQuestionsAtDepth(value: IsaQuestionDepth, view: IsaQuestionView = 'all'): IsaTeamQuestion[] {
  const packet = ISA_QUESTION_DEPTH_PACKETS.find(packet => packet.value === value)!;
  const ids = new Set(packet.questionIds);
  return isaQuestionsForView(view).filter(question => ids.has(question.id));
}

export function isaDepthForQuestion(id: string): IsaQuestionDepth {
  return ISA_QUESTION_DEPTH_PACKETS.find(packet => packet.questionIds.includes(id))?.value ?? 100;
}
