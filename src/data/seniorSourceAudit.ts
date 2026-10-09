/**
 * Senior-facing source audit, checked 2026-10-09 against official vendor pages,
 * upstream OSS repositories/license texts and official Tripletex documentation.
 * IMPORTANT: "source verified" means that a named claim is evidenced by the
 * given primary source, NOT that the ISA integration has been implemented/tested.
 * Manufacturer statements are NOT independent performance test results.
 * This file contains no client prices, employee data or API credentials.
 */
export type AuditLens = 'process' | 'market' | 'tech' | 'risk';
export type AuditKind = 'commercial' | 'oss' | 'api';
export type AuditSource = 'Hersteller' | 'Offizielles GitHub' | 'Offizielle API-Dokumentation';
export interface SeniorAuditItem {
  id: string;
  name: string;
  kind: AuditKind;
  lenses: AuditLens[];
  needDe: string;
  needRu: string;
  provenDe: string;
  provenRu: string;
  useDe: string;
  useRu: string;
  boundaryDe: string;
  boundaryRu: string;
  nextTestDe: string;
  nextTestRu: string;
  license?: string;
  sourceType: AuditSource;
  sourceUrl: string;
  /** Tested against actual ISA / Tripletex account? All false as of audit. */
  integrationTested: false;
}
export const SENIOR_SOURCE_AUDIT_DATE = '2026-10-09';
export const SENIOR_SOURCE_AUDIT: SeniorAuditItem[] = [
  {
    id:'expo',name:'Expo / React Native',kind:'oss',lenses:['tech','market'],
    needDe:'Eine einfache iOS-/Android-App für Arbeiter.',needRu:'Простое приложение iOS/Android.',
    provenDe:'Offenes Framework für Android, iOS und Web, unter MIT; native Module verfügbar.',
    provenRu:'Открытый фреймворк Android/iOS/Web, лицензия MIT; нативные модули.',
    useDe:'Technische Basis für eigene ISA-Oberfläche, kein fertiges Baustellenprodukt.',
    useRu:'Основа собственной ISA, не готовая строительная программа.',
    boundaryDe:'Zeit, Rapport, Preislogik, Authentifizierung und Synchronisierung müssen wir entwickeln.',
    boundaryRu:'Время, рапорты, цены, авторизацию и синхронизацию нужно разрабатывать.',
    nextTestDe:'Mini-App mit SQLite, Kamera und Offline-Speichern auf iOS/Android.',
    nextTestRu:'Прототип с SQLite, камерой и офлайн-сохранением на iOS/Android.',
    license:'MIT',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/expo/expo',integrationTested:false
  },
  {
    id:'expo-location',name:'Expo Location',kind:'oss',lenses:['tech','risk'],
    needDe:'Standort nur beim Ein-/Ausstempeln prüfen.',needRu:'Проверка координат при начале/конце смены.',
    provenDe:'Liest die Position des Geräts; benötigt Standortberechtigungen.',
    provenRu:'Получает координаты устройства; требует разрешения на геолокацию.',
    useDe:'GPS-Plausibilisierung für WorkSession ohne separate Tracking-Plattform.',
    useRu:'Проверка места для WorkSession без отдельного сервера слежения.',
    boundaryDe:'Weder HMS-Anwesenheitsliste noch robuste Offline-Ausnahmelogik fertig enthalten. GPS kann ungenau sein.',
    boundaryRu:'Не готовый HMS-реестр; нужно построить исключения для отсутствующего GPS.',
    nextTestDe:'GPS aus Keller/Tiefgarage, verweigerte Berechtigung und Geofence-Abweichung testen.',
    nextTestRu:'Протестировать подвал, отказ доступа и расхождение с геозоной.',
    license:'Expo-Modul (Repo MIT)',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/expo/expo/blob/main/packages/expo-location/README.md',integrationTested:false
  },
  {
    id:'expo-sqlite',name:'Expo SQLite',kind:'oss',lenses:['tech'],
    needDe:'Rapporte und Zeitdaten ohne Empfang erfassen.',needRu:'Записывать рапорты и часы без интернета.',
    provenDe:'Persistente lokale SQLite-Datenbank im App-Gerät.',
    provenRu:'Постоянная локальная база SQLite на устройстве.',
    useDe:'Offline-Zwischenspeicher für eigene Zeit-/Rapportdaten.',
    useRu:'Локальное сохранение записей до синхронизации.',
    boundaryDe:'Kein fertiger Server-Sync, keine Konfliktauflösung, keine Foto-Upload-Queue.',
    boundaryRu:'Нет готового серверного обмена, разрешения конфликтов или очереди фото.',
    nextTestDe:'Offline schreiben, App beenden, wieder öffnen und konfliktfrei zum Server senden.',
    nextTestRu:'Сохранить офлайн, перезапустить и синхронизировать без дублей.',
    license:'Expo-Modul (Repo MIT)',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/expo/expo/blob/main/packages/expo-sqlite/README.md',integrationTested:false
  },
  {
    id:'odk',name:'ODK Collect',kind:'oss',lenses:['market','tech'],
    needDe:'Bohr-/Säge-Rapporte mit Foto und abhängigen Eingabefeldern.',
    needRu:'Рапорты с фото и условными полями.',
    provenDe:'Eigenständige quelloffene Android-App zur Formularerfassung; Apache 2.0; für schwierige Offline-Einsatzbedingungen ausgelegt.',
    provenRu:'Отдельное Android-приложение для форм и офлайн-сбора, Apache 2.0.',
    useDe:'Schnell ProRiv-Eingabefelder und Ablauf als Prototyp prüfen.',
    useRu:'Быстро проверить шаблон полей ProRiv на практике.',
    boundaryDe:'Keine fertige React-Native-Komponente, kein fertiger ProRiv-Preisrechner; iOS-App nicht durch dieses Repo belegt.',
    boundaryRu:'Не компонент React Native; нет готового расчёта цен; это Android-приложение.',
    nextTestDe:'Rapport mit Durchmesser, Tiefe, Position, Foto und Offline-Abgabe nachbauen.',
    nextTestRu:'Создать офлайн-форму с диаметром, глубиной, фото и отправкой.',
    license:'Apache-2.0',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/getodk/collect',integrationTested:false
  },
  {
    id:'pdfme',name:'pdfme',kind:'oss',lenses:['tech','market'],
    needDe:'Kundenfähige Rapport-PDFs erzeugen.',needRu:'Создавать PDF-рапорты для клиентов.',
    provenDe:'MIT-lizenzierte PDF-Bibliothek mit Vorlagen; Erzeugung im Browser und in Node.js.',
    provenRu:'MIT-библиотека с шаблонами PDF; работает в браузере и Node.js.',
    useDe:'Rapport-PDF aus unseren Mengen/Fotos/Metadaten generieren.',
    useRu:'Генерация PDF из полей, фото и данных ISA.',
    boundaryDe:'Kein Versand, kein Kunden-Bestätigungsworkflow, keine rechtsverbindliche Signaturprüfung integriert.',
    boundaryRu:'Нет доставки, ответа клиента или проверки юридической силы подписи.',
    nextTestDe:'PDF-Layout des echten Isa-Rapports mit Testdaten erzeugen.',
    nextTestRu:'Сделать PDF по образцу рапорта Исы из тестовых данных.',
    license:'MIT',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/pdfme/pdfme',integrationTested:false
  },
  {
    id:'signature-pad',name:'Signature Pad',kind:'oss',lenses:['tech','market'],
    needDe:'Unterschrift auf Touchgerät erfassen.',needRu:'Подпись пальцем на экране.',
    provenDe:'MIT-Bibliothek zum Zeichnen und Exportieren handschriftlicher Unterschriften im HTML5-Canvas.',
    provenRu:'MIT-библиотека для рисования подписи на HTML5 Canvas.',
    useDe:'Möglicher Baustein für Web-Unterschriftenseite des Kunden.',
    useRu:'Возможна подпись клиента в веб-странице.',
    boundaryDe:'Web-Canvas-Baustein, kein fertiger React-Native-Signatur-/Identitäts- oder Rechtsnachweis.',
    boundaryRu:'Это веб-canvas, не готовый юридический/идентификационный сервис.',
    nextTestDe:'Browser-/Mobil-Signatur, Bildexport und Nachvollziehbarkeit testen.',
    nextTestRu:'Проверить подпись на мобильном браузере и экспорт изображения.',
    license:'MIT',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/szimek/signature_pad',integrationTested:false
  },
  {
    id:'keycloak',name:'Keycloak',kind:'oss',lenses:['tech','risk'],
    needDe:'Benutzer authentifizieren, Sitzungen verwalten.',needRu:'Вход пользователей и сессии.',
    provenDe:'Apache-2.0-Identity-/Access-Management mit OIDC, SSO und Rollen.',
    provenRu:'Apache-2.0 система аутентификации с OIDC/SSO/ролями.',
    useDe:'Mögliche selbst betriebene Alternative für Login.',
    useRu:'Возможная самостоятельно размещаемая альтернатива авторизации.',
    boundaryDe:'Kein Ersatz für backendseitige ProRiv-RBAC-Regeln; zusätzlicher Betrieb; AWS Cognito steht bereits in Seniors Skizze.',
    boundaryRu:'Не заменяет проверку ролей в API, требует обслуживания; Cognito уже в эскизе.',
    nextTestDe:'Nur vergleichen, falls Senior von Cognito abweichen möchte.',
    nextTestRu:'Сравнить, только если сеньор хочет альтернативу Cognito.',
    license:'Apache-2.0',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/keycloak/keycloak',integrationTested:false
  },
  {
    id:'solidtime',name:'Solidtime',kind:'oss',lenses:['market','tech','risk'],
    needDe:'Projektzeiten erfassen.',needRu:'Учёт часов по проектам.',
    provenDe:'Quelloffene, selbsthostbare Web-Zeiterfassung; AGPL-3.0.',
    provenRu:'Самостоятельно размещаемый веб-трекер времени, AGPL-3.0.',
    useDe:'Fertigen Zeiterfassungs-Ablauf vergleichen; eventuell getrennt betreiben.',
    useRu:'Изучить готовый процесс учёта времени.',
    boundaryDe:'Kein nachgewiesener Baustellen-HMS-/Offline-React-Native-ProRiv-Flow; AGPL-Pflichten vor Codeübernahme prüfen.',
    boundaryRu:'Не готовый HMS/оффлайн-флоу ProRiv; проверить AGPL до использования кода.',
    nextTestDe:'Demo für Projektzeiten und Datenexport; Lizenzfolgen abhängig von Einbau/Betrieb bewerten.',
    nextTestRu:'Проверить демо, экспорт и последствия AGPL.',
    license:'AGPL-3.0',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/solidtime-io/solidtime',integrationTested:false
  },
  {
    id:'kimai',name:'Kimai',kind:'oss',lenses:['market','tech'],
    needDe:'Arbeitszeiten/Projekte und Berichte verwalten.',needRu:'Вести время, проекты и отчёты.',
    provenDe:'Offene, webbasierte Mehrbenutzer-Zeiterfassung mit Projekten, Berichten und Rechnungsoptionen.',
    provenRu:'Открытый веб-учёт времени: проекты, отчёты, счета.',
    useDe:'Vergleichsmodell für Zeiten/Projekte, nicht automatisch App-Baustein.',
    useRu:'Образец работы с часами и проектами.',
    boundaryDe:'Keine belegte native Offline-Baustellen-App oder Tripletex-Mapping; Lizenzdetails je Nutzung genau prüfen.',
    boundaryRu:'Нет доказанной офлайн-строительной мобильной интеграции с Tripletex.',
    nextTestDe:'API-/Export- und Mobil-Bedienbarkeit mit realem Beispiel evaluieren.',
    nextTestRu:'Оценить API, экспорт и мобильную пригодность.',
    sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/kimai/kimai',integrationTested:false
  },
  {
    id:'erpnext',name:'ERPNext',kind:'oss',lenses:['market','tech','risk'],
    needDe:'Rabatte, Preislisten und Zuschlagsregeln abbilden.',needRu:'Прайсы, скидки и надбавки.',
    provenDe:'Vollständiges GPL-3.0-ERP mit implementierten Pricing-Rule-Funktionen.',
    provenRu:'Полная ERP под GPL-3.0 с правилами ценообразования.',
    useDe:'Referenz für Preisregel-Design, nicht automatisch eigenes ERP übernehmen.',
    useRu:'Пример структуры прайс-правил, не замена Tripletex.',
    boundaryDe:'Für ISA zweites ERP mit hoher Betriebs-/Lizenz-Komplexität; Bohrpreismatrix und korrekte Aufschlagreihenfolge nicht getestet.',
    boundaryRu:'Вторая ERP избыточна; расчёт специфических надбавок надо проверять.',
    nextTestDe:'Preisregel für Bohrdurchmesser, Decken-/Wandtarif und Zuschlag als Vergleich modellieren.',
    nextTestRu:'Смоделировать правило цена по диаметру, стене/потолку и надбавкам.',
    license:'GPL-3.0',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/frappe/erpnext',integrationTested:false
  },
  {
    id:'traccar',name:'Traccar',kind:'oss',lenses:['market','tech','risk'],
    needDe:'Einsatzort/Geofence für Arbeiter berücksichtigen.',needRu:'Местоположение и геозоны.',
    provenDe:'Apache-2.0-Server für GPS-Tracking mit Geofences, Benachrichtigungen und APIs.',
    provenRu:'GPS-сервер под Apache-2.0 с геозонами и API.',
    useDe:'Geofence-Lösung bei künftigem Trackingbedarf vergleichen.',
    useRu:'Возможное решение для геозон при реальной необходимости.',
    boundaryDe:'Primär für laufendes Geräte-Tracking, für einmaligen Clock-in voraussichtlich zu komplex; kein HMS-ProRiv-Fertigmodul.',
    boundaryRu:'Система непрерывного GPS; избыточна для одиночной отметки.',
    nextTestDe:'Erst Datenschutzbedarf klären; Expo Location als schlankere Option prüfen.',
    nextTestRu:'Уточнить потребность и защиту данных; сравнить с Expo Location.',
    license:'Apache-2.0',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/traccar/traccar',integrationTested:false
  },
  {
    id:'docuseal',name:'DocuSeal',kind:'oss',lenses:['market','tech','risk'],
    needDe:'Rapport rechtsnachvollziehbar elektronisch unterzeichnen.',needRu:'Электронное подписание документов.',
    provenDe:'Selbsthostbare digitale Dokumentenunterschrift; AGPLv3 mit zusätzlichen Namensnennungs-Bedingungen gemäß Repo.',
    provenRu:'Сервис электронных подписей; AGPLv3 и дополнительные требования атрибуции.',
    useDe:'Option für umfangreicheren Signatur-Workflow.',
    useRu:'Вариант для полноценного процесса подписания.',
    boundaryDe:'Kein Rapport-Preisrechner und keine automatische Kundenablehnung; zusätzlich Lizenz/Attribution und Signaturniveau prüfen.',
    boundaryRu:'Нет расчёта рапорта и клиентских отказов; проверить лицензию и правовой статус.',
    nextTestDe:'API-/Embedded-Flow, rechtliche Signaturanforderung und AGPL-Integration prüfen.',
    nextTestRu:'Проверить встраивание, законность подписи и требования AGPL.',
    license:'AGPLv3 + zusätzliche Bedingungen',sourceType:'Offizielles GitHub',sourceUrl:'https://github.com/docusealco/docuseal',integrationTested:false
  },
  {
    id:'jobbkontroll',name:'Jobbkontroll',kind:'commercial',lenses:['process','market'],
    needDe:'Einfache mobile Stunden und Projekte auf Baustellen.',needRu:'Учёт часов и проектов со смартфона.',
    provenDe:'Hersteller nennt mobiles Stempeln, Projekt-/Budgetübersicht und ausdrücklich Buchhaltungsintegration mit Tripletex.',
    provenRu:'Производитель заявляет мобильные часы, проекты и интеграцию с Tripletex.',
    useDe:'UX-Vorbild für einfache Zeiterfassung und bestehende ERP-Anbindung.',
    useRu:'Пример удобного учёта часов и связи с ERP.',
    boundaryDe:'Keine Quelle für Behauptung „keine Tripletex-Integration“; QR/Geofence/Offline-Rapporte hier nicht belegt. Nicht OSS.',
    boundaryRu:'Утверждение об отсутствии Tripletex неверно; QR/геозоны/офлайн не доказаны. Не OSS.',
    nextTestDe:'Demo zu Offline, QR/GPS und Rapport mit Kernbohr-Positionen anfragen.',
    nextTestRu:'Запросить демо офлайн, QR/GPS и рапорта для бурения.',
    sourceType:'Hersteller',sourceUrl:'https://www.jobbkontroll.no/',integrationTested:false
  },
  {
    id:'smartdok',name:'SmartDok',kind:'commercial',lenses:['process','market','risk'],
    needDe:'Norwegische Baustellenzeiten, HMS-Liste, Übergabe zur Buchhaltung.',
    needRu:'Норвежские часы, HMS-список и бухгалтерия.',
    provenDe:'Hersteller nennt mobile Zeiterfassung, HMS-Mannschaftsliste, Rollenansichten und Tripletex-Integration.',
    provenRu:'Производитель заявляет учёт часов, электронный HMS-список и интеграцию Tripletex.',
    useDe:'Vorgehen für norwegische Baustellen, Rollen und ERP-Verzahnung vergleichen.',
    useRu:'Пример норвежских процессов и учёта времени.',
    boundaryDe:'Herstellerangaben, nicht selbst getestet; kein nachgewiesenes spezielles ProRiv-Bohr-/Sägepreisformular.',
    boundaryRu:'Данные производителя, не проверены в демо; нет доказанной формы ProRiv.',
    nextTestDe:'Demo für Stempel-Ausnahmen, Behördenliste und ProRiv-spezifische Rapporte.',
    nextTestRu:'Демо: исключения, HMS, бурение/резка.',
    sourceType:'Hersteller',sourceUrl:'https://smartdok.no/',integrationTested:false
  },
  {
    id:'coredocket',name:'CoreDocket',kind:'commercial',lenses:['process','market'],
    needDe:'Bohr-/Säge-Mengen, Materialzuschläge und Kundenrapport.',
    needRu:'Расчёт бурения/резки, надбавки и подпись заказчика.',
    provenDe:'Hersteller demonstriert Preis-Matrix nach Tiefe/Menge, Mindestkosten, Zusatzzeiten, Unterschriften und Offline-Rapporte.',
    provenRu:'Производитель показывает тарифную матрицу, доп. работы, подписи и офлайн-рапорты.',
    useDe:'Wichtigstes Fach-Vorbild für Isas bestätigte Preislistenlogik.',
    useRu:'Пример расчёта по реальному прайс-листу Исы.',
    boundaryDe:'Kommerziell und auf Australien ausgerichtet; norwegische Regeln/Tripletex-Unterstützung nicht belegt.',
    boundaryRu:'Коммерческий продукт для Австралии; Tripletex и норвежские правила не доказаны.',
    nextTestDe:'Mit fiktiven Bohrdaten Live-Demo; niemals echte Kundentarife ohne Freigabe hochladen.',
    nextTestRu:'Проверить на вымышленных ценах, не загружать реальные без разрешения.',
    sourceType:'Hersteller',sourceUrl:'https://www.coredocket.com.au/',integrationTested:false
  },
  {
    id:'planradar',name:'PlanRadar',kind:'commercial',lenses:['market'],
    needDe:'Dokumentation mit Fotos und mobilen Formularen.',needRu:'Формы и фото на стройке.',
    provenDe:'Etablierter kommerzieller Dienst für Baustellendokumentation; konkrete ISA-Integration nicht belegt.',
    provenRu:'Коммерческий сервис строительной документации.',
    useDe:'Anregung für Felder, Medien und Arbeitsabläufe.',
    useRu:'Идеи интерфейса и фотофиксации.',
    boundaryDe:'Kein OSS; konkrete Form-/Offlinefunktionen hier noch nicht einzeln nachgewiesen.',
    boundaryRu:'Не OSS; детали мобильного офлайна ещё требуют проверки.',
    nextTestDe:'Konkrete Hersteller-Produktseite/Formulardemo prüfen.',
    nextTestRu:'Проверить демо форм и фотографии.',
    sourceType:'Hersteller',sourceUrl:'https://www.planradar.com/',integrationTested:false
  },
  {
    id:'fieldwire',name:'Fieldwire',kind:'commercial',lenses:['market'],
    needDe:'Baustellenaufgaben und schnelle Projektwahl.',needRu:'Задачи и выбор стройплощадки.',
    provenDe:'Kommerzielle Plattform für Baustellenverwaltung/Aufgaben; kein technischer ProRiv-Baustein.',
    provenRu:'Коммерческая программа для управления стройкой.',
    useDe:'Nur UX-Anregung für Projektauswahl und Status.',
    useRu:'Пример выбора объекта и задач.',
    boundaryDe:'Keine belegte Tripletex-/Bohrpreis-Integration; keine Lizenz zur Codeübernahme.',
    boundaryRu:'Нет доказанной связи Tripletex/цен на бурение, код не OSS.',
    nextTestDe:'Konkreten Aufgaben-/Projektwechsel im Demo nachvollziehen.',
    nextTestRu:'Посмотреть демо выбора проекта.',
    sourceType:'Hersteller',sourceUrl:'https://www.fieldwire.com/',integrationTested:false
  },
  {
    id:'quickbooks-time',name:'QuickBooks Time',kind:'commercial',lenses:['market','risk'],
    needDe:'GPS-/Geofence-Ausnahmen für Zeitbuchungen.',needRu:'Исключения GPS при учёте времени.',
    provenDe:'Bekannte kommerzielle Arbeitszeiterfassung mit GPS-Funktionen; genaue Ausnahme-Policy wurde nicht verifiziert.',
    provenRu:'Коммерческий учёт времени с GPS; точное поведение при ошибке не подтверждено.',
    useDe:'Vergleichshypothese: Check-in nicht blockieren, Ausnahme gesondert prüfen.',
    useRu:'Гипотеза: не блокировать работника, а проверять исключение.',
    boundaryDe:'Die alte Behauptung „QuickBooks blockiert niemals bei GPS-Fehler“ ist NICHT belegt; unser Vorschlag bleibt unabhängig davon.',
    boundaryRu:'Тезис «QuickBooks никогда не блокирует вход» не доказан.',
    nextTestDe:'GPS-Fehlerverhalten anhand offizieller Doku oder Demo verifizieren.',
    nextTestRu:'Проверить GPS-исключения в документации/демо.',
    sourceType:'Hersteller',sourceUrl:'https://quickbooks.intuit.com/time-tracking/',integrationTested:false
  },
  {
    id:'tripletex',name:'Tripletex API',kind:'api',lenses:['tech','risk','process'],
    needDe:'Stunden und Stammdaten mit bestehendem ERP austauschen.',needRu:'Передавать часы и справочники в существующую ERP.',
    provenDe:'Offizielle API-Dokumentation bestätigt interne JWT-/Session-Token-Anmeldung, separaten kommerziellen Tokenweg, Test- und Produktionsumgebung; REST-API vorhanden.',
    provenRu:'Документация API подтверждает JWT/сессионный токен для внутренней интеграции, тестовую среду и отдельный коммерческий доступ.',
    useDe:'Eigener ISA→Tripletex-Adapter statt zweites ERP; JWT für Firmenintegration ist zu prüfen.',
    useRu:'Свой адаптер ISA→Tripletex вместо второй ERP.',
    boundaryDe:'KEIN ProRiv-API-Zugang geprüft; Stunden-Endpunkt, Schreibrechte, Datenmapping und PDF/Fotos nicht durch Live-Test bestätigt. Auth ist nicht pauschal OAuth.',
    boundaryRu:'Доступ ProRiv не проверен; права на запись, поля часов и PDF/фото не протестированы. Не считать OAuth обязательным.',
    nextTestDe:'Mit Isa Testkonto und Integrationsmodul klären; Token sicher erzeugen, Teststunde schreiben/lesen, Dubletten prüfen.',
    nextTestRu:'Проверить интеграционный модуль/тестовый аккаунт, безопасный токен, часы и дубли.',
    sourceType:'Offizielle API-Dokumentation',sourceUrl:'https://developer.tripletex.no/docs/documentation/authentication-and-tokens/',integrationTested:false
  }
];

export const seniorAuditByName = (name: string): SeniorAuditItem | undefined =>
  SENIOR_SOURCE_AUDIT.find(item => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());

export const seniorAuditRelevant = (lens: AuditLens): SeniorAuditItem[] =>
  SENIOR_SOURCE_AUDIT.filter(item => item.lenses.includes(lens));
