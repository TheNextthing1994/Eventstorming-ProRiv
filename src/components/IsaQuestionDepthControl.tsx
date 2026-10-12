import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ISA_QUESTION_DEPTH_PACKETS, parseIsaQuestionDepth, type IsaQuestionDepth } from '../data/isaQuestionDepth';
import type { Language } from '../types';

export function IsaQuestionDepthControl({ value, onChange, hiddenSelected = 0, language }: {
  value: IsaQuestionDepth;
  onChange: (value: IsaQuestionDepth) => void;
  hiddenSelected?: number;
  language: Language;
}) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const packet = ISA_QUESTION_DEPTH_PACKETS.find(packet => packet.value === value)!;
  const count = packet.questionIds.length;
  const label = language === 'ru' ? packet.title.ru : packet.title.de;
  return <section aria-label={t('Gesprächsumfang', 'Объём обсуждения')} className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6 space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><label htmlFor="isa-question-depth" className="flex items-center gap-2 text-base font-bold text-emerald-950"><SlidersHorizontal className="h-5 w-5" />{t('Gesprächsumfang', 'Объём обсуждения')}</label><p className="mt-1 text-sm text-slate-600">{language === 'ru' ? packet.purpose.ru : packet.purpose.de}</p></div>
      <div aria-live="polite" className="shrink-0 rounded-xl bg-white border border-emerald-200 px-4 py-2 text-right"><p className="text-2xl font-bold text-emerald-900 tabular-nums">{count} <span className="text-sm font-semibold">{t('Fragen im Paket', 'вопросов в подборке')}</span></p><p className="text-xs text-slate-500">{label}</p></div>
    </div>
    <input style={{ display: 'none' }} id="isa-question-depth" type="range" min={0} max={100} step={20} value={value} onChange={event => onChange(parseIsaQuestionDepth(event.target.value))} aria-valuetext={`${label} · ${count} ${t('Fragen', 'вопросов')}`} aria-describedby="isa-question-depth-help" className="w-full h-6 accent-emerald-700 cursor-pointer" />
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" role="group" aria-label={t('Gesprächsstufe direkt wählen', 'Выбрать уровень обсуждения')}>
      {ISA_QUESTION_DEPTH_PACKETS.map(step => <button key={step.value} type="button" onClick={() => onChange(step.value)} aria-pressed={value === step.value} className={`rounded-lg border px-2 py-2 text-xs text-center ${value === step.value ? 'border-emerald-600 bg-emerald-700 text-white' : 'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-100'}`}><span className="block font-semibold">{step.value === 0 ? t('Minimum', 'Минимум') : `${step.value} %`}</span><span className="block mt-1 opacity-80">{step.questionIds.length} {t('Fragen', 'вопросов')}</span></button>)}
    </div>
    <p id="isa-question-depth-help" className="text-xs leading-relaxed text-slate-600">{t('Die Stufen ergänzen sinnvolle Fragenpakete. Prozentwerte stehen für Vertiefung, nicht für gemessene Wissensabdeckung. Haken und Notizen bleiben beim Verstellen erhalten.', 'Уровни добавляют осмысленные группы вопросов. Проценты означают глубину разбора, а не измеренный охват знаний. Отметки и записи сохраняются при изменении уровня.')}</p>
    {hiddenSelected > 0 && <p role="status" className="text-xs text-amber-900 rounded-lg bg-amber-50 border border-amber-200 p-3">{hiddenSelected} {t('weitere ausgewählte Fragen liegen außerhalb dieser Stufe und bleiben in eurer Isa-Vorlage.', 'других выбранных вопросов находятся вне этого уровня и остаются в вашей подборке для Исы.')}</p>}
  </section>;
}
