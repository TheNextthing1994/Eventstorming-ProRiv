import type { LocalizedText } from './roleJourneys';

export type IsaQuestionStageId = 'access' | 'order' | 'planning' | 'arrival' | 'time' | 'work' | 'pricing' | 'send' | 'customer' | 'tripletex' | 'corrections' | 'closure' | 'offline' | 'launch';
export interface IsaQuestionStage {
  id: IsaQuestionStageId;
  title: LocalizedText;
  events: LocalizedText;
}
const l = (de: string, ru: string): LocalizedText => ({ de, ru });

/** Interview structure, not a customer-approved sequence or state machine. */
export const ISA_QUESTION_STAGES: IsaQuestionStage[] = [
  { id: 'access', title: l('01 · Rollen, Einladung und Zugang', '01 · Роли, приглашение и доступ'), events: l('Mitarbeiter eingeladen · Zugang aktiviert · Rechte vergeben', 'Сотрудник приглашён · Доступ активирован · Права назначены') },
  { id: 'order', title: l('02 · Auftrag, Kunde und Baustelle', '02 · Заказ, клиент и объект'), events: l('Auftrag eingegangen · Kunde zugeordnet · Baustelle angelegt', 'Заказ получен · Клиент указан · Объект создан') },
  { id: 'planning', title: l('03 · Mannschaft und Aufgaben', '03 · Бригада и задания'), events: l('Mitarbeiter zugewiesen · Aufgabe verteilt · Vertretung bestimmt', 'Рабочий назначен · Задание распределено · Замена определена') },
  { id: 'arrival', title: l('04 · Ankunft, Standort und HMS', '04 · Прибытие, местоположение и HMS'), events: l('Ankunft gemeldet · Standort geprüft · Ausnahme gemeldet', 'Прибытие отмечено · Местоположение проверено · Исключение зарегистрировано') },
  { id: 'time', title: l('05 · Arbeitszeit und Pausen', '05 · Рабочее время и перерывы'), events: l('Arbeit begonnen · Pause erfasst · Arbeit beendet · Stunden eingereicht', 'Работа начата · Перерыв записан · Работа завершена · Часы поданы') },
  { id: 'work', title: l('06 · Leistungen, Zusatzarbeit und Fotos', '06 · Работы, дополнительные услуги и фото'), events: l('Leistung erfasst · Zusatzarbeit angefragt · Foto hinzugefügt', 'Работа записана · Дополнительная работа запрошена · Фото добавлено') },
  { id: 'pricing', title: l('07 · Preise und Abrechnungsart', '07 · Цены и тип расчёта'), events: l('Preis berechnet · Sonderpreis festgelegt · Preisstand fixiert', 'Цена рассчитана · Особая цена установлена · Цены зафиксированы') },
  { id: 'send', title: l('08 · Rapport erstellen und versenden', '08 · Создать и отправить рапорт'), events: l('Rapport erstellt · Versand ausgelöst · Zugestellt oder fehlgeschlagen', 'Рапорт создан · Отправка начата · Доставлено либо ошибка') },
  { id: 'customer', title: l('09 · Kundenantwort und Unterschrift', '09 · Ответ клиента и подпись'), events: l('Bestätigt ODER abgelehnt ODER noch keine Antwort', 'Подтверждено ИЛИ отклонено ИЛИ ответа пока нет') },
  { id: 'tripletex', title: l('10 · Tripletex, Stundenprüfung und Buchhaltung', '10 · Tripletex, проверка часов и бухгалтерия'), events: l('Stunden übertragen · Übertragung fehlgeschlagen · Stunden geprüft', 'Часы переданы · Ошибка передачи · Часы проверены') },
  { id: 'corrections', title: l('11 · Fehler, Änderungen und Stornierung', '11 · Ошибки, изменения и отмена'), events: l('Korrektur angefragt · Neue Version erstellt · Auftrag pausiert oder storniert', 'Исправление запрошено · Создана новая версия · Заказ приостановлен или отменён') },
  { id: 'closure', title: l('12 · Abschluss und Archiv', '12 · Завершение и архив'), events: l('Baustelle abgeschlossen · Archiviert · Für Nacharbeit wieder geöffnet', 'Объект завершён · Архивирован · Вновь открыт для доработки') },
  { id: 'offline', title: l('13 · Ohne Netz und Synchronisierung', '13 · Без связи и синхронизация'), events: l('Lokal gespeichert · Verbindung zurück · Konflikt geklärt', 'Сохранено на устройстве · Связь восстановлена · Конфликт разрешён') },
  { id: 'launch', title: l('14 · Einführung, Betrieb und Abnahme', '14 · Запуск, эксплуатация и приёмка'), events: l('Pilot gestartet · Fehler gemeldet · Ergebnis abgenommen', 'Пилот запущен · Ошибка сообщена · Результат принят') },
];

// Every original number occurs exactly once. IDs and source wording stay intact.
const originalStages: Record<'team' | 'roles', Partial<Record<IsaQuestionStageId, number[]>>> = {
  team: {
    access: [1, 2, 3, 4, 5], order: [6, 7, 30], planning: [8, 31], arrival: [19, 20],
    time: [18], work: [10, 11, 29], pricing: [14, 15, 16, 17, 34], send: [9, 38],
    customer: [12, 35, 36, 37], tripletex: [22, 23, 24], corrections: [13, 32, 33, 39],
    closure: [25, 42], offline: [21], launch: [26, 27, 28, 40, 41, 43, 44, 45],
  },
  roles: {
    access: [1, 3, 9], order: [2, 4, 5, 7, 8, 38], planning: [6, 11, 24, 31, 32],
    arrival: [15, 27, 29], time: [12, 13, 28, 30], work: [17, 18, 19, 20],
    pricing: [44, 45, 46, 47, 48, 49, 50], send: [21, 22], customer: [33, 34, 35, 36, 37],
    tripletex: [25, 39, 40, 41, 42, 43], corrections: [16, 23, 26], closure: [10], offline: [14],
  },
};

export function originalQuestionStage(catalog: 'team' | 'roles', number: number): IsaQuestionStageId {
  const matches = ISA_QUESTION_STAGES.filter(stage => originalStages[catalog][stage.id]?.includes(number));
  if (matches.length !== 1) throw new Error(`Missing or ambiguous question stage: ${catalog}:${number}`);
  return matches[0].id;
}
