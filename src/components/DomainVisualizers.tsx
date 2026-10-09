import React from 'react';
import {
  Users,
  Shield,
  Layers,
  MapPin,
  Clock,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Cloud,
  Smartphone,
  Server,
  FileText
} from 'lucide-react';
import { Language } from '../types';

interface VisualizerProps {
  language?: Language;
}

/**
 * 1. USERS: Rollen- und Berechtigungsmatrix
 */
export const RoleMatrixVisualizer: React.FC<VisualizerProps> = ({ language = 'ru' }) => {
  const permissions = language === 'ru' ? [
    { action: 'Выбор стройплощадки и проекта', worker: true, foreman: true, office: true, customer: false, note: 'Рабочий выбирает свой объект' },
    { action: 'Старт / стоп рабочего времени (WorkSession)', worker: true, foreman: true, office: false, customer: false, note: 'Валидация GPS при отметке' },
    { action: 'Замеры бурения и резки, загрузка фото', worker: true, foreman: true, office: true, customer: false, note: 'Диаметры, глубина, погонные метры' },
    { action: 'Отправка рапорта клиенту', worker: true, foreman: false, office: false, customer: false, note: 'Рабочий отправляет сам по SMS/почте' },
    { action: 'Проверка и подтверждение GPS-отклонений', worker: false, foreman: true, office: true, customer: false, note: 'Бригадир оценивает расхождение' },
    { action: 'Проверка и утверждение часов в Tripletex', worker: false, foreman: true, office: false, customer: false, note: 'Прораб работает в Tripletex, а не в ISA' },

    { action: 'Изменение коммерческих тарифов и оверрайдов', worker: false, foreman: false, office: true, customer: false, note: 'Только офис управляет ценами' },
    { action: 'Открытие утвержденного рапорта на правку (ревизия)', worker: false, foreman: false, office: true, customer: false, note: 'Требует указания причины аудита' },
    { action: 'Просмотр и подтверждение рапорта по временной ссылке', worker: false, foreman: false, office: false, customer: true, note: 'Ссылка по SMS/Mail без пароля' },
    { action: 'Выгрузка часов и ссылок в Tripletex ERP', worker: false, foreman: false, office: true, customer: false, note: 'Асинхронная очередь экспорта' }
  ] : [
    { action: 'Baustelle & Projekt auswählen', worker: true, foreman: true, office: true, customer: false, note: 'Arbeiter wählt eigenen Einsatzort' },
    { action: 'Arbeitszeit starten / stoppen (WorkSession)', worker: true, foreman: true, office: false, customer: false, note: 'GPS-Plausibilisierung beim Stempeln' },
    { action: 'Kernbohr- & Säge-Aufmaß erfassen', worker: true, foreman: true, office: true, customer: false, note: 'Mengen, Maße (mm, cm, m), Fotos' },
    { action: 'Rapport an Kunden senden', worker: true, foreman: false, office: false, customer: false, note: 'Arbeiter versendet selbst per SMS / E-Mail' },
    { action: 'GPS-Ausnahmen prüfen & freigeben', worker: false, foreman: true, office: true, customer: false, note: 'Vorarbeiter beurteilt Standortabweichung' },
    { action: 'Arbeitsstunden in Tripletex prüfen', worker: false, foreman: true, office: false, customer: false, note: 'Vorarbeiter genehmigt in Tripletex, nicht in ISA' },

    { action: 'Kaufmännische Preise & Overrides bearbeiten', worker: false, foreman: false, office: true, customer: false, note: 'Nur Büro steuert Konditionen (Vorschlag)' },
    { action: 'Freigegebenen Rapport wieder öffnen (Revision)', worker: false, foreman: false, office: true, customer: false, note: 'Erfordert dokumentierten Audit-Grund' },
    { action: 'Rapport per Magic-Link einsehen & signieren', worker: false, foreman: false, office: false, customer: true, note: 'Zeitlich begrenzter SMS/Mail-Link' },
    { action: 'Stunden an Tripletex übertragen', worker: false, foreman: false, office: true, customer: false, note: 'Asynchrone Export-Warteschlange' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>
              {language === 'ru'
                ? 'Рекомендуемая матрица ролей и прав доступа (RBAC)'
                : 'Vorgeschlagene Rollen- & Berechtigungsmatrix (RBAC)'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'ru'
              ? 'Серверные правила авторизации на уровне бэкенда. Неподтвержденные правила помечены как предложения.'
              : 'Serverseitige Autorisierungsregeln. Unbestätigte Regeln sind als Vorschlag gekennzeichnet.'}
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {language === 'ru' ? 'Статус: Рекомендовано (Backend-RBAC)' : 'Status: Empfohlen (Backend-RBAC)'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">
                {language === 'ru' ? 'Действие / Бизнес-операция' : 'Aktion / Geschäftsfunktion'}
              </th>
              <th className="py-2.5 px-2 text-center w-24">
                {language === 'ru' ? 'Рабочий' : 'Arbeiter'}
              </th>
              <th className="py-2.5 px-2 text-center w-24">
                {language === 'ru' ? 'Бригадир' : 'Vorarbeiter'}
              </th>
              <th className="py-2.5 px-2 text-center w-24">
                {language === 'ru' ? 'Офис / Админ' : 'Büro / Admin'}
              </th>
              <th className="py-2.5 px-2 text-center w-24">
                {language === 'ru' ? 'Заказчик' : 'Kunde'}
              </th>
              <th className="py-2.5 px-3">
                {language === 'ru' ? 'Правило / Примечание' : 'Hinweis / Regel'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {permissions.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-medium text-slate-900">{p.action}</td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {p.worker ? (
                    <span className="text-emerald-700 font-bold">{language === 'ru' ? 'Да' : 'Ja'}</span>
                  ) : (
                    <span className="text-slate-300">{language === 'ru' ? 'Нет' : 'Nein'}</span>
                  )}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {p.foreman ? (
                    <span className="text-emerald-700 font-bold">{language === 'ru' ? 'Да' : 'Ja'}</span>
                  ) : (
                    <span className="text-slate-300">{language === 'ru' ? 'Нет' : 'Nein'}</span>
                  )}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {p.office ? (
                    <span className="text-emerald-700 font-bold">{language === 'ru' ? 'Да' : 'Ja'}</span>
                  ) : (
                    <span className="text-slate-300">{language === 'ru' ? 'Нет' : 'Nein'}</span>
                  )}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {p.customer ? (
                    <span className="text-sky-700 font-bold">{language === 'ru' ? 'Да' : 'Ja'}</span>
                  ) : (
                    <span className="text-slate-300">{language === 'ru' ? 'Нет' : 'Nein'}</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-slate-500 text-[11px]">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 2. CLIENTS: Datenmodell-Hierarchie Customer → Project → Site
 */
export const EntityHierarchyVisualizer: React.FC<VisualizerProps> = ({ language = 'ru' }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>
              {language === 'ru'
                ? 'Иерархия доменной модели: Customer → Project → Site'
                : 'Datenmodell-Hierarchie: Customer → Project → Site'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'ru'
              ? 'Строгое разделение исключает путаницу геозон, тарифов и синхронизации с Tripletex.'
              : 'Strikte Trennung verhindert Datenvermischung bei GPS, Tripletex und Preisregeln.'}
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {language === 'ru' ? 'Статус: Рекомендованная модель' : 'Status: Empfohlenes Domänenmodell'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              {language === 'ru' ? '1. Customer (Заказчик)' : '1. Customer (Kunde)'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Master: Tripletex</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {language === 'ru'
              ? 'Юридическое лицо, плательщик, условия оплаты и рамочные прайс-листы.'
              : 'Auftraggeber, Rechnungsempfänger, Zahlungskonditionen und Rahmenpreislisten.'}
          </p>
          <div className="text-[10px] font-mono text-slate-500 bg-white p-2 rounded border border-slate-200/60">
            • id (UUID)<br/>
            • tripletexCustomerId (Int)<br/>
            • name, orgNumber, contactEmail<br/>
            • defaultPriceAgreementId
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              {language === 'ru' ? '2. Project (Проект)' : '2. Project (Projekt)'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">1 : n zu Customer</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {language === 'ru'
              ? 'Договорной проект, бюджет, фикс/почасовая оплата, ответственный инженер.'
              : 'Kaufmännisches Projekt, Budget, Festpreis oder Regie, Projektleiter.'}
          </p>
          <div className="text-[10px] font-mono text-slate-500 bg-white p-2 rounded border border-slate-200/60">
            • id (UUID)<br/>
            • customerId (UUID)<br/>
            • tripletexProjectId (Int)<br/>
            • projectNumber, billingType<br/>
            • status (Active, Archived)
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/40 rounded-lg border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950">
              {language === 'ru' ? '3. Site (Стройплощадка)' : '3. Site (Baustelle / Einsatzort)'}
            </span>
            <span className="text-[10px] font-mono text-emerald-700">1 : n zu Project</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {language === 'ru'
              ? 'Физический адрес стройки с координатами GPS и радиусом геозоны.'
              : 'Physischer Ausführungsort mit Adresse, GPS-Koordinaten und optionalem Geofence.'}
          </p>
          <div className="text-[10px] font-mono text-slate-700 bg-white p-2 rounded border border-emerald-200/60">
            • id (UUID)<br/>
            • projectId (UUID)<br/>
            • address, latitude, longitude<br/>
            • geofenceRadiusMeters (z. B. 150m)<br/>
            • accessNotes (z. B. Schlüsselcode)
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-100/70 rounded-lg text-xs text-slate-700 flex flex-wrap items-center justify-between font-mono">
        <span className="font-semibold text-slate-800">
          {language === 'ru' ? 'Связь с фактической работой:' : 'Zuordnung der Arbeit:'}
        </span>
        <span>Site ──► WorkSession (Время) &amp; WorkReport (Замеры)</span>
      </div>
    </div>
  );
};

/**
 * 3. RAPORT: Aufmaß-Struktur & Modell-Vorschau
 */
export const WorkReportPreviewVisualizer: React.FC<VisualizerProps> = ({ language = 'ru' }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>
              {language === 'ru'
                ? 'Структура замеров и отраслевые операции ProRiv'
                : 'Aufmaß-Struktur & Gewerkespezifische Rapport-Vorschau'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'ru'
              ? 'Основные типы работ ProRiv с физическими единицами (без вымышленных цен).'
              : 'Hauptarbeitsarten von ProRiv mit korrekten physikalischen Einheiten (ohne Scheinpreise).'}
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {language === 'ru' ? 'Стандарт ProRiv' : 'ProRiv Projektstandard'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">
            {language === 'ru' ? 'А. Алмазное бурение' : 'A. Kernbohren'}
          </span>
          <ul className="space-y-1 text-slate-600 text-[11px]">
            <li>• <strong>{language === 'ru' ? 'Диаметр:' : 'Durchmesser:'}</strong> в мм (например, Ø 110 мм, Ø 200 мм)</li>
            <li>• <strong>{language === 'ru' ? 'Глубина:' : 'Bohrtiefe:'}</strong> в сантиметрах (толщина конструкции)</li>
            <li>• <strong>{language === 'ru' ? 'Количество:' : 'Anzahl:'}</strong> число отверстий</li>
            <li>• <strong>{language === 'ru' ? 'Положение:' : 'Ausrichtung:'}</strong> стена, пол, перекрытие, потолок</li>
          </ul>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">
            {language === 'ru' ? 'Б. Нарезка швов пола' : 'B. Bodensäge'}
          </span>
          <ul className="space-y-1 text-slate-600 text-[11px]">
            <li>• <strong>{language === 'ru' ? 'Глубина реза:' : 'Schnitttiefe:'}</strong> в см (например, 15 см, 25 см)</li>
            <li>• <strong>{language === 'ru' ? 'Длина реза:' : 'Schnittlänge:'}</strong> в погонных метрах (м)</li>
            <li>• <strong>{language === 'ru' ? 'Количество линий:' : 'Anzahl Schnitte:'}</strong> число участков</li>
            <li>• <strong>{language === 'ru' ? 'Площадь реза:' : 'Schnittfläche:'}</strong> расчетная величина</li>
          </ul>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">
            {language === 'ru' ? 'В. Стенорезка и ручная резка' : 'C. Wandsäge / Handsäge'}
          </span>
          <ul className="space-y-1 text-slate-600 text-[11px]">
            <li>• <strong>{language === 'ru' ? 'Глубина реза:' : 'Schnitttiefe:'}</strong> в сантиметрах</li>
            <li>• <strong>{language === 'ru' ? 'Длина реза:' : 'Schnittlänge:'}</strong> в погонных метрах (м)</li>
            <li>• <strong>{language === 'ru' ? 'Тип:' : 'Verfahren:'}</strong> рельсовая пила или ручной бензорез</li>
            <li>• <strong>{language === 'ru' ? 'Материал:' : 'Bauteil:'}</strong> бетон, кирпич, проем</li>
          </ul>
        </div>
      </div>

      {/* Grounded in ONE actual ProRiv rapport screenshot supplied 2026-10-09:
          "Andre tjenester / Other services (4)". Do not infer a complete catalog
          or publish the underlying customer's identity, workers or unit prices.
          First Norwegian line is cut off in the screenshot: "Merarbeid ifm. k-boring (tildek...)".
      */}
      <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200 space-y-2">
        <span className="text-xs font-bold text-slate-900 block">
          {language === 'ru'
            ? 'Дополнительные услуги — 4 строки из реального рапорта (не полный каталог):'
            : 'Zusatzleistungen – 4 Positionen aus einem echten Rapport (kein vollständiger Katalog):'}
        </span>
        <p className="text-[11px] text-slate-600">
          {language === 'ru'
            ? 'Оригинальные норвежские названия и переводы из скриншота. Три позиции в часах, Rigg / Transport — 1 шт. Цены и данные людей здесь не публикуются; правила тарификации ещё нужно уточнить.'
            : 'Originalbezeichnungen aus dem norwegischen Screenshot mit Übersetzung: 3 Stundenpositionen, Rigg / Transport als Stück. Preise und Personendaten werden hier nicht veröffentlicht; Abrechnungsregeln sind offen.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {[
            {
              original: 'Merarbeid ifm. k-boring (tildek…)',
              translation: language === 'ru' ? 'Дополнительная работа при колонковом бурении' : 'Zusatzarbeit bei Kernbohrungen',
              unit: language === 'ru' ? '6 часов' : '6 Stunden'
            },
            {
              original: 'Bruk av heis/stillas',
              translation: language === 'ru' ? 'Использование подъёмника / строительных лесов' : 'Benutzung Lift / Gerüst',
              unit: language === 'ru' ? '3 часа' : '3 Stunden'
            },
            {
              original: 'Hjelpearbeid',
              translation: language === 'ru' ? 'Работа помощника' : 'Helferarbeit',
              unit: language === 'ru' ? '12 часов' : '12 Stunden'
            },
            {
              original: 'Rigg / Transport (bor/sag)',
              translation: language === 'ru' ? 'Подготовка и транспорт (бурение / резка)' : 'Rüsten / Transport (Bohren / Sägen)',
              unit: language === 'ru' ? '1 шт.' : '1 Stück'
            }
          ].map((item, i) => (
            <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <div className="text-slate-900 font-semibold">{item.original}</div>
              <div className="text-slate-600">{item.translation}</div>
              <div className="mt-1 font-mono text-emerald-700">{item.unit}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-amber-800">
          {language === 'ru'
            ? 'Источник: загруженные 09.10.2026 скриншоты реального рапорта, раздел «Andre tjenester / Other services (4)». Название первой строки обрезано. Это 4 строки одного рапорта, не утверждённый прайс-лист ProRiv.'
            : 'Quelle: am 09.10.2026 hochgeladene Screenshots des echten Rapports, Abschnitt „Andre tjenester / Other services (4)“. Erste Positionsbezeichnung abgeschnitten. Kein freigegebener ProRiv-Gesamtkatalog.'}
        </p>
      </div>

      {/* Status workflow */}
      <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200 text-xs space-y-1.5">
        <span className="font-bold text-emerald-950 block">
          {language === 'ru' ? 'Жизненный цикл рапорта и версионирование:' : 'Rapport-Lebenszyklus & Revisionssicherheit:'}
        </span>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-700">
          <span className="px-2 py-0.5 bg-white rounded border border-slate-200 font-semibold">Draft</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-white rounded border border-slate-200 font-semibold">SentToCustomer</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-emerald-100 rounded border border-emerald-300 font-bold text-emerald-900">Confirmed / Rejected / Commented</span>
        </div>
        <p className="text-[11px] text-slate-600 mt-1">
          {language === 'ru'
            ? 'Из разговора: рапорт отправляет рабочий. Обязательное согласование прорабом НЕ подтверждено. Исправления и версии требуют уточнения.'
            : 'Laut Kundengespräch versendet der Arbeiter den Rapport selbst. Eine verpflichtende Vorarbeiterfreigabe ist NICHT bestätigt. Korrektur- und Versionsregeln bleiben offen.'}
        </p>
      </div>
    </div>
  );
};

/**
 * 4. VREMYA: Dreiteilung WorkSession != TimesheetEntry != WorkReport
 */
export const TimeTripleDivisionVisualizer: React.FC<VisualizerProps> = ({ language = 'ru' }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>
              {language === 'ru'
                ? 'Фундаментальное разделение: WorkSession ≠ TimesheetEntry ≠ WorkReport'
                : 'Fundamentale Dreiteilung: WorkSession ≠ TimesheetEntry ≠ WorkReport'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'ru'
              ? 'Три независимые сущности для присутствия, зарплатного табеля и строительного отчета.'
              : 'Drei eigenständige Entitäten für Anwesenheit, Lohnabrechnung und Leistungsnachweis.'}
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {language === 'ru' ? 'Архитектурное правило' : 'Status: Architektur-Kernregel'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-slate-900">1. WorkSession</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>{language === 'ru' ? 'Что это:' : 'Was es ist:'}</strong>{' '}
            {language === 'ru'
              ? 'Физическое время присутствия (Clock-in / Clock-out) на конкретной стройплощадке.'
              : 'Die physische Anwesenheitszeit (Clock-in / Clock-out) an einem Einsatzort.'}
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200/60 space-y-0.5">
            <div>• startTimestamp / endTimestamp</div>
            <div>• clockInLocation (Lat, Long, Accuracy)</div>
            <div>• exceptionFlag (Нет GPS / Вне геозоны)</div>
          </div>
          <span className="text-[10px] text-slate-400 block italic">
            {language === 'ru' ? 'Техническое подтверждение смены' : 'Dient als technischer Nachweis'}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-900">2. TimesheetEntry</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>{language === 'ru' ? 'Что это:' : 'Was es ist:'}</strong>{' '}
            {language === 'ru'
              ? 'Оплачиваемые рабочие часы после вычета перерывов и проверки бригадиром.'
              : 'Die abrechnungsrelevante Arbeitszeit nach Abzug von Pausen und Prüfung.'}
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200/60 space-y-0.5">
            <div>• workerId, projectId, activityCode</div>
            <div>• approvedHours, overtimeMultiplier</div>
            <div>• status (Submitted, Approved, Exported)</div>
          </div>
          <span className="text-[10px] text-slate-400 block italic">
            {language === 'ru' ? 'Экспортируется в Tripletex для зарплаты' : 'Wird an Tripletex übertragen; Vorarbeiter prüft dort'}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-slate-900">3. WorkReport</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>{language === 'ru' ? 'Что это:' : 'Was es ist:'}</strong>{' '}
            {language === 'ru'
              ? 'Строительный замер выполненных объемов бурения, резки и допработ.'
              : 'Das bauliche Aufmaß der ausgeführten Bohrungen, Schnitte und Regieleistungen.'}
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200/60 space-y-0.5">
            <div>• lines (Ø mm, глубина см, резка м)</div>
            <div>• evidence (фото, подпись заказчика)</div>
            <div>• priceSnapshot (фиксированные тарифы)</div>
          </div>
          <span className="text-[10px] text-slate-400 block italic">
            {language === 'ru' ? 'Предоставляется заказчику на проверку' : 'Wird dem Kunden zur Prüfung vorgelegt'}
          </span>
        </div>
      </div>

      {/* Clock-in exception workflow */}
      <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-200/70 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>
            {language === 'ru'
              ? 'Исключения GPS при чекине: Никогда не блокировать рабочего на объекте'
              : 'GPS-Ausnahmepfad beim Einstempeln: Niemals den Arbeiter blockieren'}
          </span>
        </div>
        <p className="text-[11px] text-slate-700 leading-relaxed">
          {language === 'ru' ? (
            <>
              Если бурильщик чекинится в подвале или подземном паркинге без GPS, приложение <strong>не</strong> блокирует работу.
              Смене присваивается событие <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">ClockInExceptionRecorded</code>.
              Бригадир видит отметку в очереди согласования и принимает решение.
            </>
          ) : (
            <>
              Wenn ein Betonbohrer in einem Keller oder Tiefgarage ohne GPS eincheckt, bricht die App <strong>nicht</strong> ab.
              Stattdessen wird die WorkSession mit dem Event <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">ClockInExceptionRecorded</code> versehen.
              Der Vorarbeiter sieht die Auffälligkeit in seiner Freigabeliste und entscheidet fachlich.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

/**
 * 5. API: Integrationsarchitektur Tripletex <-> ISA
 */
export const ApiArchitectureVisualizer: React.FC<VisualizerProps> = ({ language = 'ru' }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-700" />
            <span>
              {language === 'ru'
                ? 'Архитектура интеграции: Tripletex ↔ ISA Work API'
                : 'Integrationsarchitektur & Datenfluss: Tripletex ↔ ISA Work API'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'ru'
              ? 'Четкое разделение ответственности, асинхронные очереди и идемпотентность.'
              : 'Klare Schnittstellentrennung, asynchrone Warteschlangen und Idempotenz.'}
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {language === 'ru' ? 'Рекомендованный стандарт' : 'Status: Empfohlener Integrationsstandard'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Inbound */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
            <span>
              {language === 'ru' ? 'Tripletex → ISA (Справочники)' : 'Tripletex → ISA (Stammdatenabgleich)'}
            </span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-600">
            <li>• <strong>{language === 'ru' ? 'Заказчики:' : 'Kunden:'}</strong> {language === 'ru' ? 'Реквизиты и контакты из ERP' : 'Stammdaten und Kontaktadressen aus ERP'}</li>
            <li>• <strong>{language === 'ru' ? 'Проекты:' : 'Projekte:'}</strong> {language === 'ru' ? 'Номера проектов и статусы' : 'Projektnummern, Bezeichnungen und Status'}</li>
            <li>• <strong>{language === 'ru' ? 'Виды работ:' : 'Aktivitäten:'}</strong> {language === 'ru' ? 'Коды Tripletex (бурение, пила, дорога)' : 'Tripletex-Aktivitätscodes (Boring, Saging, Reisetid)'}</li>
            <li>• <strong>{language === 'ru' ? 'Сотрудники:' : 'Mitarbeiter:'}</strong> {language === 'ru' ? 'Идентификаторы Tripletex Employee ID' : 'Benutzerkonten und Employee-IDs'}</li>
          </ul>
        </div>

        {/* Outbound */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {language === 'ru' ? 'ISA → Tripletex (Выгрузка часов)' : 'ISA → Tripletex (Geprüfte Ausführungsdaten)'}
            </span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-600">
            <li>• <strong>{language === 'ru' ? 'Часы:' : 'Freigegebene Stunden:'}</strong> {language === 'ru' ? 'Сотрудник, проект, вид работ, часы' : 'Mitarbeiter, Projekt, Aktivität, Stunden'}</li>
            <li>• <strong>{language === 'ru' ? 'Ссылка на рапорт:' : 'Rapport-Referenz:'}</strong> {language === 'ru' ? 'Ссылка на PDF в S3' : 'Verlinkung des PDF-Prüfberichts in S3'}</li>
            <li>• <strong>{language === 'ru' ? 'Идемпотентность:' : 'Idempotenter Export:'}</strong> {language === 'ru' ? 'Ключ исключает дублирование записей' : 'Idempotency-Key verhindert Doppelbuchungen'}</li>
            <li>• <strong>{language === 'ru' ? 'Повторы при сбоях:' : 'Fehler-Retry:'}</strong> {language === 'ru' ? 'Сбои сети остаются в очереди' : 'Fehlgeschlagene Übertragungen verbleiben in Queue'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * 6. MOBILE APP: Technische Architektur (React Native, Cognito, S3, PostgreSQL)
 */
export const MobileTechStackVisualizer: React.FC<VisualizerProps> = ({ language = 'ru' }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>
              {language === 'ru'
                ? 'Технологический стек из оригинального эскиза сеньора'
                : 'Vorgeschriebene Technologie-Architektur aus der Originalskizze'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'ru'
              ? 'React Native, AWS Cognito и AWS Storage S3 строго сохраняются.'
              : 'React Native, AWS Cognito und AWS Storage S3 werden verbindlich beibehalten.'}
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {language === 'ru' ? 'Эскиз сеньора' : 'Vorgabe der Senior-Skizze'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-emerald-50/30 rounded-lg border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>React Native</span>
          </div>
          <p className="text-[11px] text-slate-600">
            {language === 'ru'
              ? 'Кроссплатформенный клиент iOS & Android с локальной SQLite.'
              : 'Plattformübergreifend für iOS & Android. Offline-fähig via lokaler SQLite-Datenbank.'}
          </p>
          <span className="text-[10px] font-mono text-emerald-800 block">
            {language === 'ru' ? 'В эскизе' : 'In Originalskizze'}
          </span>
        </div>

        <div className="p-3 bg-emerald-50/30 rounded-lg border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>AWS Cognito</span>
          </div>
          <p className="text-[11px] text-slate-600">
            {language === 'ru'
              ? 'User Pools, JWT-токены, безопасный оффлайн-рефреш сессий.'
              : 'User Pools, JWT-Token, sichere Authentifizierung und Offline-Token-Refresh.'}
          </p>
          <span className="text-[10px] font-mono text-emerald-800 block">
            {language === 'ru' ? 'В эскизе' : 'In Originalskizze'}
          </span>
        </div>

        <div className="p-3 bg-emerald-50/30 rounded-lg border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Cloud className="w-4 h-4 text-emerald-700" />
            <span>AWS Storage S3</span>
          </div>
          <p className="text-[11px] text-slate-600">
            {language === 'ru'
              ? 'Надежное хранилище фото со стройки и PDF через Presigned URLs.'
              : 'Sichere Ablage von Baustellenfotos, Unterschriften und generierten Rapport-PDFs via Presigned URLs.'}
          </p>
          <span className="text-[10px] font-mono text-emerald-800 block">
            {language === 'ru' ? 'В эскизе' : 'In Originalskizze'}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Database className="w-4 h-4 text-slate-700" />
            <span>PostgreSQL (+ PostGIS)</span>
          </div>
          <p className="text-[11px] text-slate-600">
            {language === 'ru'
              ? 'Реляционная база Work API с поддержкой геозон и транзакций.'
              : 'Relationale Work-API-Datenbank mit Geofencing-Unterstützung (AWS RDS Option).'}
          </p>
          <span className="text-[10px] font-mono text-slate-500 block">
            {language === 'ru' ? 'Рекомендация бэкенда' : 'Ergänzende Empfehlung'}
          </span>
        </div>
      </div>
    </div>
  );
};
