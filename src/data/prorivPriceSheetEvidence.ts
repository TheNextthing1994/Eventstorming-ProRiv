/**
 * Source inventory, not an approved tariff catalog.
 * Primary evidence: two uploaded screenshots 2026-10-09 of a Norwegian
 * "PRISLISTE" headed BETONGBORING with separate tables for GULVSAG,
 * VEGGSAG & HÅNDSAG and "ANDRE KOSTNADER".
 *
 * This repository is public. The amounts, customer identities and raw
 * commercial document images are intentionally NOT copied here.
 * On 2026-10-09 the user expressly confirmed this as Isa's CURRENT price list.
 * Individual small-print readings and applicability to specific contracts may
 * still require clarification; no validity-start date is visible in the images.
 */
export type PriceSheetEvidenceGroup = 'cost' | 'surcharge' | 'rule';

export interface PriceSheetEvidenceItem {
  id: string;
  norwegian: string;
  de: string;
  ru: string;
  group: PriceSheetEvidenceGroup;
}

export const PRORIV_PRICE_SHEET_EVIDENCE: PriceSheetEvidenceItem[] = [
  { id: 'transport-rigg', group: 'cost',
    norwegian: 'Transport og tilrigging pr. oppmøte',
    de: 'Transport und Rüsten je Anfahrt/Termin (zusammen eine Position)',
    ru: 'Транспорт и подготовка к работе за выезд (единая позиция)' },
  { id: 'floor-lift', group: 'cost',
    norwegian: 'Etasjelyft',
    de: 'Etagenhub (genaue Leistung klären; nicht automatisch Hebebühnenmiete)',
    ru: 'Подъём на этаж (уточнить услугу; не считать автоматически арендой подъёмника)' },
  { id: 'shoring', group: 'cost',
    norwegian: 'Stempling med dekkestøtte',
    de: 'Abstützung mit Deckenstützen, je Stück',
    ru: 'Установка подпорки перекрытия, за штуку' },
  { id: 'pilot-hole', group: 'cost',
    norwegian: 'Pilotboring',
    de: 'Pilotbohrung, je Stück',
    ru: 'Пилотное бурение, за штуку' },
  { id: 'extra-work', group: 'cost',
    norwegian: 'Timpris for ekstraarbeid',
    de: 'Zusatzarbeiten nach Stunden',
    ru: 'Дополнительные работы по часовому тарифу' },
  { id: 'stone', group: 'surcharge',
    norwegian: 'Ved betongboring/saging i granitt og gråstein',
    de: 'Aufschlag für Bohr-/Sägearbeiten in Granit und Graustein (nicht Asphalt)',
    ru: 'Надбавка за бурение/резку гранита и природного серого камня (не асфальта)' },
  { id: 'ceiling', group: 'surcharge',
    norwegian: 'For boring i tak',
    de: 'Aufschlag für Bohren in der Decke',
    ru: 'Надбавка за бурение в потолке' },
  { id: 'timber', group: 'surcharge',
    norwegian: 'Ved boring i massive tømmer',
    de: 'Aufschlag für Bohrungen in massivem Holz (nicht Verbundmaterial)',
    ru: 'Надбавка за бурение в массивной древесине (не композиты)' },
  { id: 'dry', group: 'surcharge',
    norwegian: 'Tørrboring',
    de: 'Aufschlag für Trockenbohren (Absaugung nicht ausdrücklich genannt)',
    ru: 'Надбавка за сухое бурение (пылеудаление прямо не указано)' },
  { id: 'reinforcement', group: 'surcharge',
    norwegian: 'Ved armering over Ø16',
    de: 'Aufschlag bei Bewehrung über Ø16',
    ru: 'Надбавка при арматуре свыше Ø16' },
  { id: 'plan-saw', group: 'surcharge',
    norwegian: 'For plansaging plus … pr. Lm',
    de: 'Zusätzliche Regel für Plansägen je laufendem Meter (Wortlaut/Anwendung klären)',
    ru: 'Дополнительное правило для плоскостной резки за погонный метр (уточнить)' },
  { id: 'frost', group: 'surcharge',
    norwegian: 'Frosttillegg ved utearbeid ved lavere temp enn 0°C',
    de: 'Frostzuschlag für Außenarbeiten unter 0 °C',
    ru: 'Зимняя надбавка при наружных работах ниже 0 °C' },
  { id: 'helper', group: 'rule',
    norwegian: 'For boring fra Ø400 beregnes hjelpemann',
    de: 'Bei Bohrungen ab Ø400 wird ein Helfer berechnet',
    ru: 'При бурении от Ø400 учитывается помощник' },
  { id: 'chipping-covering', group: 'rule',
    norwegian: 'Pigging og tildekking er ikke inkludert i enhetsprisene',
    de: 'Stemmarbeiten und Abdecken sind nicht im Einheitspreis enthalten; nach Zeitaufwand',
    ru: 'Долбление и укрытие не включены в единичную цену; по затраченному времени' },
  { id: 'minimum-thickness', group: 'rule',
    norwegian: 'Minimumstykkelse 15 cm. ved kjerneboring',
    de: 'Mindestberechnungsstärke für Kernbohren',
    ru: 'Минимальная расчётная толщина при колонковом бурении' },
  { id: 'minimum-saw-length', group: 'rule',
    norwegian: 'Minimumsmål 1 Lm ved betongsaging',
    de: 'Mindestberechnungslänge für Betonsägen',
    ru: 'Минимальная расчётная длина при резке бетона' },
  { id: 'work-height', group: 'rule',
    norwegian: 'Oppgitt priser gjelder arbeidshøyde inntil 300 cm',
    de: 'Genannte Grundpreise gelten bis zu einer bestimmten Arbeitshöhe',
    ru: 'Базовые цены действуют до указанной рабочей высоты' },
  { id: 'minimum-order', group: 'rule',
    norwegian: 'Minstepris pr. oppdrag',
    de: 'Mindestauftragswert laut Preisblatt',
    ru: 'Минимальная стоимость заказа по прайс-листу' },
  { id: 'ex-vat', group: 'rule',
    norwegian: 'Alle priser eks merverdiavgift',
    de: 'Preise ohne Mehrwertsteuer',
    ru: 'Цены без НДС' }
];
