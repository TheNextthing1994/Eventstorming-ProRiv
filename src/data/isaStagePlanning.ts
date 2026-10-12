import { ISA_TEAM_QUESTIONS } from './isaTeamQuestions';
import { ISA_QUESTION_STAGES, type IsaQuestionStageId } from './isaQuestionStages';
import type { LocalizedText } from './roleJourneys';
import type { IsaQuestionNotes } from '../types';

const p = (id: string) => `proriv:project:${id}`;
const t = (n: number) => `amruddy:team:${String(n).padStart(2, '0')}`;
const l = (de: string, ru: string): LocalizedText => ({ de, ru });
const scope: Record<IsaQuestionStageId, { questionIds: string[]; impact: LocalizedText }> = {
  access: { questionIds: [p('invitation-channel')], impact: l('Einladung und Benutzerverwaltung', 'Приглашения и управление сотрудниками') },
  order: { questionIds: [t(6)], impact: l('Datenübernahme oder eigene Verwaltungsformulare', 'Импорт данных либо собственные формы управления') },
  planning: { questionIds: [t(8)], impact: l('Baustellenzuordnung oder zusätzliche Aufgabenplanung', 'Назначение на объект либо дополнительное планирование заданий') },
  arrival: { questionIds: [p('gps-scope'), p('hms-app-scope')], impact: l('Standortfunktionen und Anbindung des vorhandenen HMS-Verfahrens', 'Геолокация и связь с существующим процессом HMS') },
  time: { questionIds: [t(18)], impact: l('Zeitarten und Zuordnung der Stunden', 'Виды времени и распределение часов') },
  work: { questionIds: [p('scope-work-types')], impact: l('Anzahl und Umfang der Rapportformulare', 'Количество и объём форм рапортов') },
  pricing: { questionIds: [p('scope-price-engine')], impact: l('Umfang der automatischen Preisberechnung', 'Объём автоматического расчёта цен') },
  send: { questionIds: [p('scope-rapport-channels')], impact: l('Versandkanäle und Zustellungsprüfung', 'Каналы отправки и проверка доставки') },
  customer: { questionIds: [p('scope-customer-confirmation')], impact: l('Kundenansicht und Unterschriftsfunktion', 'Страница клиента и подпись') },
  tripletex: { questionIds: [p('scope-tripletex-payload'), p('tripletex-feedback')], impact: l('Umfang und Richtung des Datenaustauschs mit Tripletex', 'Объём и направление обмена данными с Tripletex') },
  corrections: { questionIds: [p('scope-report-versions')], impact: l('Versionen und erneute Kundenbestätigung', 'Версии и повторное подтверждение клиента') },
  closure: { questionIds: [p('scope-site-closure')], impact: l('Abschlussverwaltung oder Übernahme des Abschlussstatus', 'Управление завершением либо получение его статуса') },
  offline: { questionIds: [t(21)], impact: l('Speicherung auf dem Gerät und spätere Übertragung', 'Хранение на устройстве и последующая передача') },
  launch: { questionIds: [p('scope-pilot-rollout'), p('scope-first-platforms')], impact: l('Geräte, Testumfang und Einführung', 'Устройства, объём тестирования и внедрение') },
};

// These are catalog objects, not another question bank or note namespace.
export const ISA_STAGE_PLANS = ISA_QUESTION_STAGES.map(stage => ({ ...stage, ...scope[stage.id] }));
export const ISA_STAGE_PLANNING_QUESTION_IDS = ISA_STAGE_PLANS.flatMap(stage => stage.questionIds);
for (const stage of ISA_STAGE_PLANS) for (const id of stage.questionIds) {
  if (!ISA_TEAM_QUESTIONS.some(q => q.id === id && q.stageId === stage.id)) throw new Error('Invalid stage planning question: ' + id);
}

export function questionsForStagePlan(stageId: IsaQuestionStageId) {
  const ids = scope[stageId].questionIds;
  return ids.map(id => ISA_TEAM_QUESTIONS.find(question => question.id === id)!);
}

export function additionalQuestionsForStagePlan(stageId: IsaQuestionStageId) {
  const primary = new Set(scope[stageId].questionIds);
  return ISA_TEAM_QUESTIONS.filter(question => question.stageId === stageId && !primary.has(question.id));
}

export function selectedStageQuestions(stageId: IsaQuestionStageId, notes: IsaQuestionNotes) {
  return [...questionsForStagePlan(stageId), ...additionalQuestionsForStagePlan(stageId)].filter(q => notes[q.id]?.includeInIsa);
}
