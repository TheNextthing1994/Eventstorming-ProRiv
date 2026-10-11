import type { IsaQuestionContext } from './isaTeamQuestions';

const t = (n: number) => `amruddy:team:${String(n).padStart(2, '0')}`;
const r = (n: number) => `amruddy:roles:${String(n).padStart(2, '0')}`;

// Deliberate different perspectives; neither wording nor review state is merged.
const related: Record<number, number[]> = {
  1: [1], 2: [24, 25, 28, 32], 3: [11, 18], 4: [9], 5: [31], 6: [2, 38],
  7: [4, 5], 8: [6], 9: [21], 10: [17, 30], 11: [18, 19], 12: [8, 33, 35],
  13: [23, 26], 14: [44], 15: [47], 16: [46, 48], 17: [20, 50], 18: [12, 13],
  19: [29], 20: [15, 16, 27], 21: [14], 22: [39], 23: [40], 24: [42, 43],
  25: [10, 41], 29: [20], 33: [16, 43], 35: [37], 36: [34, 35], 38: [32], 41: [2],
};

export function originalRelatedIds(catalog: 'team' | 'roles', number: number): string[] {
  return catalog === 'team' ? (related[number] || []).map(r)
    : Object.entries(related).filter(([, roles]) => roles.includes(number)).map(([team]) => t(Number(team)));
}

const approval: IsaQuestionContext = { kind: 'interview', text: {
  de: 'Im Kundengespräch sendet der Arbeiter direkt an den Kunden. Eine zusätzliche Rapportfreigabe durch den Vorarbeiter ist ein offener Teamvorschlag. Die Originalfrage bleibt erhalten; diesen vorausgesetzten Schritt zuerst klären.',
  ru: 'По исходному разговору рабочий отправляет рапорт напрямую клиенту. Дополнительное утверждение прорабом — открытое предложение команды. Исходный вопрос сохранён; сначала уточните этот предполагаемый этап.',
} };
const tax: IsaQuestionContext = { kind: 'evidence', text: {
  de: 'Die aktuelle Preisliste nennt Preise ohne MVA. Für diese Originalfrage ist bereits eine Grundlage vorhanden; mit Isa nur die Anwendung im Auftrag und die Darstellung bestätigen.',
  ru: 'Текущий прайс указывает цены без MVA. Для этого исходного вопроса уже есть основание; с Исой подтвердите применение к заказу и отображение.',
} };
const sample: IsaQuestionContext = { kind: 'evidence', text: {
  de: 'Ein echter ausgefüllter Bohr-Rapport liegt bereits vor. Die Frage dient der Klärung künftiger Pflichtfelder; zusätzlich fehlt ein ausgefülltes Sägebeispiel.',
  ru: 'Настоящий заполненный рапорт по бурению уже есть. Вопрос нужен для уточнения будущих обязательных полей; дополнительно не хватает заполненного примера по резке.',
} };

export function originalQuestionContext(catalog: 'team' | 'roles', number: number): IsaQuestionContext | undefined {
  if (catalog === 'team' && [2, 13].includes(number) || catalog === 'roles' && [25, 26, 31].includes(number)) return approval;
  if (catalog === 'team' && number === 14 || catalog === 'roles' && number === 44) return tax;
  if (catalog === 'team' && number === 11) return sample;
  if (catalog === 'roles' && number === 45) return { kind: 'evidence', text: {
    de: 'Die aktuelle Bohrpreisliste rechnet je cm. Die alten Masken Q.mm / L.mm und die Bezeichnung Diameter in Sägetabellen sind damit noch nicht vollständig erklärt.',
    ru: 'Текущий прайс бурения рассчитывается за сантиметр. Это ещё не объясняет полностью старые поля Q.mm / L.mm и название Diameter в таблицах резки.',
  } };
  if (catalog === 'roles' && number === 50) return { kind: 'proposal', text: {
    de: 'Konkret festlegen, wann der Preisstand fixiert wird: bei Anlage, Versand oder Bestätigung. Preisversionen und Sondervereinbarungen sind zu klären; die Aktualität der vorhandenen Preisliste wurde bereits bestätigt.',
    ru: 'Уточните конкретный момент фиксации цены: создание, отправка или подтверждение. Версии цен и особые договорённости ещё открыты; актуальность имеющегося прайса уже подтверждена.',
  } };
  if (catalog === 'team' && number === 35) return { kind: 'proposal', text: {
    de: 'Keine Antwort, Ablehnung und Bestätigung sind alternative Ausgänge. Nichtantwort bedeutet ohne vereinbarte Regel keine Zustimmung. Auch klären, ob offene Rapporte Stundenexport, Lohnabschluss oder Rechnungsstellung beeinflussen.',
    ru: 'Отсутствие ответа, отказ и подтверждение — разные исходы. Без согласованного правила отсутствие ответа не означает согласия. Уточните также влияние на передачу часов, закрытие зарплаты и выставление счёта.',
  } };
}
