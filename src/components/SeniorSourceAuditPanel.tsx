import React, { useState } from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { AuditLens, SeniorAuditItem, SENIOR_SOURCE_AUDIT_DATE, seniorAuditRelevant, seniorAuditAdoption } from '../data/seniorSourceAudit';

interface Props { lens: AuditLens; language: Language }
const localText = (item: SeniorAuditItem, key: 'need'|'proven'|'use'|'boundary'|'nextTest', lang: Language): string =>
  String(item[(key + (lang === 'ru' ? 'Ru' : 'De')) as keyof SeniorAuditItem]);

const sourceKind = (item: SeniorAuditItem, ru: boolean) =>
  item.sourceType === 'Hersteller'
    ? (ru ? 'Заявление производителя' : 'Herstellerangabe')
    : item.sourceType === 'Offizielles GitHub'
      ? (ru ? 'Исходный код / репозиторий' : 'Code / Projekt-Repo')
      : (ru ? 'Официальная документация' : 'Offizielle Dokumentation');

export const SeniorSourceAuditPanel: React.FC<Props> = ({lens, language}) => {
  const [showAll, setShowAll] = useState(false);
  const ru = language === 'ru';
  const items = seniorAuditRelevant(lens);
  const visible = showAll ? items : items.slice(0, 4);
  const label = (de: string, russian: string) => ru ? russian : de;

  return (
    <section className="space-y-3" aria-label={label('Geprüfte Quellen und ihre Grenzen','Проверенные источники и ограничения')}>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 px-3 py-2 text-xs text-slate-700">
        <div className="font-bold text-emerald-950">
          {label('Recherche-Audit mit Primärquellen', 'Проверка по первоисточникам')}
          <span className="ml-2 font-normal text-slate-500">{SENIOR_SOURCE_AUDIT_DATE}</span>
        </div>
        <p className="mt-1">
          {label('Belegte Hersteller-/Projektangabe ≠ tatsächlich in ISA getestet. Keine dieser Integrationen wurde mit Isas Tripletex-Konto oder einer ProRiv-Produktiv-App getestet.',
                 'Документация производителя/проекта ≠ проверенная интеграция ISA. Интеграций в рабочем аккаунте Исы ещё нет.')}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        {visible.map(item => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
            <div className="flex flex-wrap justify-between gap-2 items-start">
              <div className="text-sm font-bold text-slate-900">{item.name}</div>
              <span className="text-[10px] rounded px-1.5 py-0.5 bg-slate-100 text-slate-700 font-semibold">
                {item.kind === 'oss' ? 'OSS' : item.kind === 'api' ? 'API / Service' : label('Konkurrent / Vorbild','Конкурент / пример')}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-950">
              {label('Unsere Einstufung: ', 'Наш вывод: ')}
              {seniorAuditAdoption(item.id) === 'prototype'
                ? label('Als Baustein / Prototyp testen', 'Проверить как компонент / прототип')
                : seniorAuditAdoption(item.id) === 'existing'
                  ? label('Bestehenden Bestand anbinden / prüfen', 'Подключить / проверить существующую систему')
                  : seniorAuditAdoption(item.id) === 'defer'
                    ? label('Vorerst nicht einbauen', 'Пока не внедрять')
                    : label('Nur als Markt-/UX-Vorbild vergleichen', 'Только сравнить как пример')}
            </div>
            <p className="text-[11px]">
              <strong className="text-slate-500">{label('Kundenbedarf: ','Потребность: ')}</strong>
              {localText(item, 'need', language)}
            </p>
            <p className="text-[11px]">
              <strong className="text-emerald-800">{label('Quellenbelegt: ','Подтверждено источником: ')}</strong>
              {localText(item, 'proven', language)}
            </p>
            <p className="text-[11px]">
              <strong className="text-slate-700">{label('Für ISA: ','Для ISA: ')}</strong>
              {localText(item, 'use', language)}
            </p>
            <details className="border-t border-slate-100 pt-2">
              <summary className="cursor-pointer text-[11px] font-semibold text-amber-800 flex gap-1 items-center">
                <ChevronDown className="h-3 w-3"/>{label('Grenzen, Lizenz und nächster Test', 'Ограничения, лицензия и тест')}
              </summary>
              <p className="text-[11px] text-slate-600 mt-2">
                <strong>{label('Grenze: ','Ограничение: ')}</strong>{localText(item, 'boundary', language)}
              </p>
              <p className="text-[11px] text-slate-600 mt-2">
                <strong>{label('Nächster Test: ','Следующий тест: ')}</strong>{localText(item, 'nextTest', language)}
              </p>
              {item.license && <p className="text-[11px] mt-2"><strong>Lizenz:</strong> {item.license}</p>}
            </details>
            <div className="flex justify-between flex-wrap items-center gap-2 text-[10px] border-t border-slate-100 pt-2">
              <span className="text-amber-800">
                {label('ISA-Integration: noch nicht getestet', 'Интеграция ISA: не тестировалась')}
              </span>
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline inline-flex items-center gap-1">
                {sourceKind(item,ru)} <ExternalLink className="h-3 w-3"/>
              </a>
            </div>
          </article>
        ))}
      </div>
      {items.length > 4 && <button type="button" onClick={()=>setShowAll(!showAll)} className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-200">
        {showAll ? label('Weniger anzeigen','Скрыть') : label('Alle ' + items.length + ' Quellen anzeigen','Показать все источники (' + items.length + ')')}
      </button>}
    </section>
  );
};
