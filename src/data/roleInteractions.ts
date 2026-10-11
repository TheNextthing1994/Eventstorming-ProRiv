import { ADMIN_JOURNEY_STEPS, type JourneyRoleId, type LocalizedText } from './roleJourneys';
import { WORKSHOP_STEPS } from './workshopContent';

export type InteractionActor = JourneyRoleId | 'system' | 'customer' | 'accounting';
export type InteractionBeat = { actor: InteractionActor; action: LocalizedText };
export type RoleInteraction = {
  id: string;
  participants: [JourneyRoleId, JourneyRoleId];
  title: LocalizedText;
  adminStepId?: string;
  processStepId?: string;
  beats: InteractionBeat[];
};

const l = (de: string, ru: string): LocalizedText => ({ de, ru });

// The relationships are views of existing workshop sources. An action here is
// a walkthrough proposal, not approval of a permission or a client requirement.
// adminStepId/processStepId reuse the original question IDs and note records.
export const ROLE_INTERACTIONS: RoleInteraction[] = [
  {
    id: 'invitation', participants: ['admin', 'worker'], adminStepId: 'invite',
    title: l('Einladung und Zugang', 'Приглашение и доступ'),
    beats: [
      { actor: 'admin', action: l('Sucht das Profil, trägt den Kontakt ein und verschickt den Einladungslink.', 'Ищет профиль, вводит контакт и отправляет ссылку-приглашение.') },
      { actor: 'worker', action: l('Erhält den Link, öffnet ihn und ergänzt seine Angaben.', 'Получает и открывает ссылку, дополняет свои данные.') },
      { actor: 'admin', action: l('Sieht, ob die Einladung angenommen wurde oder erneut gesendet werden muss.', 'Видит, принято ли приглашение или его нужно отправить повторно.') }
    ]
  },
  {
    id: 'permissions', participants: ['admin', 'worker'], adminStepId: 'profile',
    title: l('Profil und Rechte', 'Профиль и права'),
    beats: [
      { actor: 'worker', action: l('Vervollständigt die vereinbarten Pflichtangaben.', 'Заполняет согласованные обязательные данные.') },
      { actor: 'admin', action: l('Prüft das Profil und vergibt die mit Isa geklärten Rechte.', 'Проверяет профиль и назначает права, согласованные с Исой.') },
      { actor: 'worker', action: l('Sieht seine freigegebenen Funktionen und Baustellen.', 'Видит доступные ему функции и объекты.') }
    ]
  },
  {
    id: 'work-catalog', participants: ['admin', 'worker'], adminStepId: 'prices',
    title: l('Arbeitsarten und Preise', 'Виды работ и цены'),
    beats: [
      { actor: 'admin', action: l('Stellt mit der preisberechtigten Person Arbeitsarten und die richtige Preisgrundlage bereit.', 'Вместе с уполномоченным по ценам готовит виды работ и нужный прайс.') },
      { actor: 'worker', action: l('Wählt die Arbeitsart und trägt Maße und Mengen ein.', 'Выбирает вид работы, вводит размеры и объёмы.') },
      { actor: 'system', action: l('Berechnet nach den hinterlegten Regeln. Preisrechte und Sonderpreise bleiben zu klären.', 'Рассчитывает по заданным правилам. Доступ к ценам и особые цены нужно уточнить.') }
    ]
  },
  {
    id: 'worker-exit', participants: ['admin', 'worker'], adminStepId: 'closure',
    title: l('Austritt und Zugangssperre', 'Уход и блокировка доступа'),
    beats: [
      { actor: 'admin', action: l('Prüft offene Daten und veranlasst die nötige Zugangssperre.', 'Проверяет незавершённые данные и блокирует доступ при необходимости.') },
      { actor: 'system', action: l('Sperrt den Zugang. Noch nicht übertragene Stunden und Fotos müssen kontrolliert gesichert werden.', 'Блокирует доступ. Непереданные часы и фото нужно сохранить контролируемым способом.') },
      { actor: 'foreman', action: l('Übernimmt noch offene Rapporte und Stundenfälle.', 'Принимает незавершённые рапорты и случаи по часам.') }
    ]
  },
  {
    id: 'site-handover', participants: ['admin', 'foreman'], adminStepId: 'site',
    title: l('Baustelle übergeben', 'Передать объект'),
    beats: [
      { actor: 'admin', action: l('Bereitet Baustelle, Projektbezug und Kundenkontakt vor.', 'Готовит объект, привязку к проекту и контакт клиента.') },
      { actor: 'foreman', action: l('Übernimmt die Baustelle und prüft Einsatzort und Ansprechpartner.', 'Принимает объект, проверяет место работы и контакт.') },
      { actor: 'admin', action: l('Klärt oder berichtigt fehlende beziehungsweise falsche Angaben.', 'Уточняет или исправляет отсутствующие либо неверные данные.') }
    ]
  },
  {
    id: 'team-assignment', participants: ['admin', 'foreman'], adminStepId: 'assignment',
    title: l('Vorarbeiter und Mannschaft', 'Прораб и бригада'),
    beats: [
      { actor: 'admin', action: l('Ordnet der Baustelle den zuständigen Vorarbeiter zu.', 'Назначает ответственного прораба на объект.') },
      { actor: 'foreman', action: l('Stellt nach dem Teamvorschlag die Mannschaft zusammen und benennt gegebenenfalls einen Rapport-Verantwortlichen.', 'По предложению команды формирует бригаду и при необходимости назначает ответственного за рапорт.') },
      { actor: 'worker', action: l('Sieht seine Zuordnung und die zuständige Person.', 'Видит своё назначение и ответственного.') }
    ]
  },
  {
    id: 'report-rules', participants: ['admin', 'foreman'], adminStepId: 'report-policy',
    title: l('Rapportweg und Freigaben', 'Путь рапорта и согласование'),
    beats: [
      { actor: 'admin', action: l('Klärt mit Isa, ob der Arbeiter direkt sendet oder vorher eine Freigabe braucht.', 'Уточняет с Исой, отправляет ли рабочий напрямую или сначала требуется согласование.') },
      { actor: 'foreman', action: l('Übernimmt nur die tatsächlich vereinbarte Prüfung oder Weiterleitung.', 'Берёт на себя только согласованную проверку или передачу.') },
      { actor: 'admin', action: l('Richtet die bestätigten Zuständigkeiten und die Vertretung ein.', 'Настраивает подтверждённые обязанности и замену на время отсутствия.') }
    ]
  },
  {
    id: 'exceptions', participants: ['admin', 'foreman'], adminStepId: 'monitor',
    title: l('Offene Vorgänge klären', 'Уточнить незавершённые случаи'),
    beats: [
      { actor: 'system', action: l('Zeigt fehlende Zuordnungen, ausstehende Übertragungen oder Fehler.', 'Показывает отсутствие привязки, ожидающую передачу или ошибки.') },
      { actor: 'admin', action: l('Ordnet den Klärungsfall einer zuständigen Person zu.', 'Назначает ответственного за уточнение случая.') },
      { actor: 'foreman', action: l('Klärt fachliche Abweichungen mit den Arbeitern und prüft die Stunden in Tripletex.', 'Уточняет расхождения с рабочими и проверяет часы в Tripletex.') }
    ]
  },
  {
    id: 'corrections', participants: ['admin', 'foreman'], adminStepId: 'correction',
    title: l('Korrekturen und Übertragungsfehler', 'Исправления и ошибки передачи'),
    beats: [
      { actor: 'foreman', action: l('Meldet eine falsche Zuordnung, einen fehlerhaften Rapport oder eine Stundenabweichung.', 'Сообщает о неверной привязке, ошибке рапорта или расхождении часов.') },
      { actor: 'admin', action: l('Koordiniert die Berichtigung durch die berechtigte Person.', 'Координирует исправление уполномоченным лицом.') },
      { actor: 'foreman', action: l('Prüft die korrigierten Stunden in Tripletex; nach Freigabe gelten gesondert zu klärende Regeln.', 'Проверяет исправленные часы в Tripletex; правила после согласования нужно определить отдельно.') }
    ]
  },
  {
    id: 'site-closure', participants: ['admin', 'foreman'], adminStepId: 'closure',
    title: l('Baustelle abschließen', 'Закрыть объект'),
    beats: [
      { actor: 'foreman', action: l('Klärt, welche Arbeiten, Rapporte oder Stunden noch offen sind.', 'Уточняет незавершённые работы, рапорты и часы.') },
      { actor: 'admin', action: l('Schließt oder archiviert die Baustelle nach der mit Isa vereinbarten Regel.', 'Закрывает или архивирует объект по правилу, согласованному с Исой.') },
      { actor: 'accounting', action: l('Verarbeitet offene kaufmännische Vorgänge in Tripletex.', 'Обрабатывает незавершённые бухгалтерские операции в Tripletex.') }
    ]
  },
  {
    id: 'rapport-handover', participants: ['worker', 'foreman'], adminStepId: 'report-policy',
    title: l('Wer bekommt den Rapport?', 'Кому передаётся рапорт?'),
    beats: [
      { actor: 'worker', action: l('Erstellt den Rapport mit Leistungen und Fotos.', 'Создаёт рапорт с работами и фотографиями.') },
      { actor: 'foreman', action: l('Prüft oder leitet nur weiter, wenn Isa diesen Weg bestätigt. Der direkte Versand durch den Arbeiter ist die alternative Gesprächsgrundlage.', 'Проверяет или передаёт дальше только при подтверждении Исы. Прямая отправка рабочим — вариант из исходного разговора.') },
      { actor: 'customer', action: l('Bestätigt, kommentiert oder lehnt den erhaltenen Rapport ab.', 'Подтверждает, комментирует или отклоняет полученный рапорт.') }
    ]
  },
  {
    id: 'hours-review', participants: ['worker', 'foreman'], processStepId: 'approval',
    title: l('Stunden prüfen', 'Проверить часы'),
    beats: [
      { actor: 'worker', action: l('Erfasst seine Zeit und die ausgeführten Arbeiten.', 'Записывает время и выполненные работы.') },
      { actor: 'system', action: l('Überträgt die zugeordneten Projektstunden nach Tripletex; Details der Verbindung sind noch zu prüfen.', 'Передаёт часы проекта в Tripletex; детали подключения ещё нужно проверить.') },
      { actor: 'foreman', action: l('Vergleicht Stunden und dokumentierte Arbeit und prüft oder genehmigt in Tripletex.', 'Сверяет часы с выполненной работой и проверяет либо согласовывает в Tripletex.') }
    ]
  },
  {
    id: 'time-correction', participants: ['worker', 'foreman'], adminStepId: 'correction',
    title: l('Falsche Stunden berichtigen', 'Исправить неверные часы'),
    beats: [
      { actor: 'worker', action: l('Meldet eine vergessene oder falsche Zeitbuchung.', 'Сообщает о пропущенной или неверной записи времени.') },
      { actor: 'foreman', action: l('Prüft den Fall und klärt, wer die Korrektur durchführen darf.', 'Проверяет случай и уточняет, кто вправе его исправить.') },
      { actor: 'system', action: l('Hält die Änderung nachvollziehbar fest. Die Rückübertragung aus Tripletex bleibt zu klären.', 'Сохраняет историю изменения. Возврат исправлений из Tripletex нужно уточнить.') }
    ]
  }
];

export function interactionsBetween(a: JourneyRoleId, b: JourneyRoleId): RoleInteraction[] {
  return ROLE_INTERACTIONS.filter(item => item.participants.includes(a) && item.participants.includes(b) && a !== b);
}

export function interactionForAdminStep(stepId: string): RoleInteraction | undefined {
  return ROLE_INTERACTIONS.find(item => item.adminStepId === stepId && item.participants.includes('admin'));
}

export function interactionSource(interaction: RoleInteraction) {
  return {
    adminStep: ADMIN_JOURNEY_STEPS.find(step => step.id === interaction.adminStepId),
    processStep: WORKSHOP_STEPS.find(step => step.id === interaction.processStepId)
  };
}
