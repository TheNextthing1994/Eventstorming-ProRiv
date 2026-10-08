import { TopicId } from '../types';

export type WorkshopRole = 'worker' | 'customer' | 'system' | 'foreman' | 'accounting';
export type WorkshopChoice = { name: string; kind: 'bestand' | 'vorbild' | 'oss' | 'option'; why: string; whyRu: string; link?: string; caveat?: string };
export type WorkshopStep = {
  id: string;
  nr: number;
  actor: WorkshopRole;
  topicId: TopicId;
  title: string;
  titleRu: string;
  customerFact: string;
  customerFactRu: string;
  recommendation: string;
  recommendationRu: string;
  openQuestion: string;
  openQuestionRu: string;
  evidence: string;
  source: string;
  choices: WorkshopChoice[];
};
export const WORKSHOP_STEPS: WorkshopStep[] = [
  {
    id: 'arrival', nr: 1, actor: 'worker', topicId: 'vremya',
    title: 'Ankunft am Einsatzort', titleRu: 'Прибытие на объект',
    customerFact: 'Der Arbeiter darf den Arbeitsbeginn erst bei tatsächlicher Ankunft am Objekt erfassen. HMS-Karten sind bereits im Baustellenumfeld im Einsatz.',
    customerFactRu: 'Рабочий должен начинать учёт только после фактического прибытия. Карты HMS уже используются на строительных объектах.',
    recommendation: 'MVP-Vorschlag: Noch keine eigene gesetzliche HMS-Anwesenheitsliste bauen. Projekt, Arbeitsbeginn/-ende und Pausen für die interne Zeiterfassung speichern; HMS-Kartennummer im Mitarbeiterprofil nur bei bestätigtem Bedarf und mit Datenschutzkonzept. Vorhandene Baustellenliste des verantwortlichen Bauherrn/Beauftragten nutzen. Einen Export/eine Schnittstelle bei realem Bedarf prüfen. Standortprüfung bleibt eine Option.',
    recommendationRu: 'Предложение для MVP: пока не создавать собственный обязательный реестр присутствующих по HMS. Для внутреннего учёта сохранять объект, начало/конец работы и перерывы; номер HMS-карты хранить лишь при подтверждённой потребности и с учётом защиты данных. Использовать существующий реестр заказчика строительства/уполномоченной компании. Экспорт или интеграцию добавить при реальной необходимости.',
    openQuestion: 'Senior + Isa klären: Arbeitet ProRiv meist als Subunternehmer, als Hauptunternehmer oder selbst als Bauherr? Wer ist rechtlich für die elektronische Baustellenliste verantwortlich, wer führt sie tatsächlich (ggf. schriftlich delegiert) und welche Systeme verlangen diese Baustellen? Danach entscheiden: HMS-Kartennummer speichern, Datenexport, Schnittstelle oder eigene Liste? Zusätzlich: Ist Ankunft gleich Arbeitsbeginn; braucht es GPS/QR?',
    openQuestionRu: 'Сеньор + Иса: ProRiv обычно субподрядчик, генподрядчик или заказчик строительства (byggherre)? Кто отвечает за электронный список присутствующих, кто его ведёт (в том числе по письменному поручению) и какую систему использует объект? Нужен ли номер HMS, экспорт, интеграция или собственный список? Отдельно уточнить GPS/QR и начало рабочего времени.',
    evidence: 'Kundengespräch RAW: HMS-Karten vorhanden, Nutzung in ISA offen. Norwegische Vorschrift Byggherreforskriften § 15: Bauherr für tägliche elektronische Übersicht verantwortlich; Führung kann schriftlich delegiert werden (Arbeidstilsynet: https://www.arbeidstilsynet.no/hms/hms-i-bygg-og-anlegg/byggherreforskriften/elektroniske-oversiktslister/). Gesetzliche Liste und Arbeitszeit sind unterschiedliche Datenzwecke; interne Zeitbuchung allein erfüllt die Listenpflicht nicht.',
    source: 'Kundengespräch RAW · Ankunft und HMS',
    choices: [
      { name: 'Expo Location', kind: 'oss', why: 'Punktuelle Standortprüfung in React Native.', whyRu: 'Проверка местоположения в React Native.', link: 'https://docs.expo.dev/versions/latest/sdk/location/' },
      { name: 'Traccar', kind: 'oss', why: 'Erweiterte GPS-/Geofence-Funktionen; für einmaligen Check-in eventuell zu groß.', whyRu: 'Расширенный GPS и геозоны; для одного чекина может быть лишним.', link: 'https://github.com/traccar/traccar' },
      { name: 'Jobbkontroll', kind: 'vorbild', why: 'QR/Geofence und Trennung von Anwesenheit und Arbeitszeit untersuchen; Produktversprechen noch zu testen.', whyRu: 'Изучить QR, геозоны и разделение присутствия и часов; функции пока не испытаны.', link: 'https://www.jobbkontroll.no/' }
    ]
  },
  {
    id: 'time', nr: 2, actor: 'worker', topicId: 'vremya',
    title: 'Zeit & Pausen', titleRu: 'Время и перерывы',
    customerFact: 'Beginn, Ende und Pausen sowie projektbezogene Stunden müssen erfasst werden; Arbeitsfortschritt kann Zeitpunkte enthalten.',
    customerFactRu: 'Нужно фиксировать начало, конец, перерывы, часы по проектам и время завершения отдельных работ.',
    recommendation: 'Eine sehr einfache Stoppuhr pro Projekt mit Pausentaste und korrigierbarem Protokoll. Keine zweite Lohnabrechnung.',
    recommendationRu: 'Простой таймер по проекту с паузой и журналом корректировок. Не создавать вторую систему зарплаты.',
    openQuestion: 'Welche Pausen sind bezahlt? Darf der Mitarbeiter vergessene Buchungen selbst korrigieren? Welche Wochenstundenregeln gelten wirklich?',
    openQuestionRu: 'Какие перерывы оплачиваются? Кто исправляет пропущенные записи? Какие действуют нормы недельных часов?',
    evidence: 'Kundengespräch §§2–4; 40-Stunden-Angabe ist kein verifizierter Rechtsgrenzwert.',
    source: 'Kundengespräch RAW · Arbeitszeit',
    choices: [
      {name:'Tripletex',kind:'bestand',why:'Bestehende Verarbeitung und Stundenkontrolle.',whyRu:'Существующая обработка и согласование часов.',link:'https://tripletex.no/'},
      {name:'Kimai',kind:'oss',why:'Projektzeiten als fertiges OSS-Referenzmodell; AGPL-Lizenz prüfen.',whyRu:'Готовая модель учёта часов; проверить AGPL.',link:'https://github.com/kimai/kimai'},
      {name:'Solidtime',kind:'oss',why:'OSS-Zeiterfassung als Alternative zum Eigenbau prüfen.',whyRu:'Проверить альтернативу собственной реализации.',link:'https://github.com/solidtime-io/solidtime'},
      {name:'SmartDok',kind:'vorbild',why:'Norwegische Baustellenzeit und Tripletex-Prozesse vergleichen.',whyRu:'Сравнить норвежские часы и процессы Tripletex.',link:'https://smartdok.no/'}
    ]
  },
  {
    id: 'work', nr: 3, actor: 'worker', topicId: 'raport',
    title: 'Bohren & Sägen erfassen', titleRu: 'Бурение и резка',
    customerFact: 'Kernbohrungen, Wand-/Boden-/Handsägen: Material, Durchmesser, Tiefe, Länge, Menge und zusätzliche Leistungen mit möglichst wenigen Texteingaben.',
    customerFactRu: 'Бурение, стенорезка, резка пола и ручная резка: материал, диаметр, глубина, длина, количество и дополнительные услуги.',
    recommendation: 'Geführte Eingabe mit passenden Feldern je Arbeitsart, auswählbare Katalogwerte und Fotos. Einen realen ProRiv-Rapport zuerst als Testformular abbilden.',
    recommendationRu: 'Пошаговая форма по типу работ, готовые значения и фотографии. Сначала проверить на реальном примере рапорта.',
    openQuestion: 'Welche Felder sind zwingend? Wie werden Helfer, Transport, Gerüst, Material und mehrere Mitarbeiter pro Rapport erfasst?',
    openQuestionRu: 'Какие поля обязательны? Как учитывать помощников, транспорт, леса, материал и нескольких рабочих?',
    evidence: 'Kundengespräch §§4 · Rapport, zusätzliche Arbeiten, Fotos.',
    source: 'Kundengespräch RAW · Rapport und Screenshots',
    choices: [
      {name:'AppSheet',kind:'bestand',why:'Heutiger Rapportprozess; laut Kunde zu viele Menüs.',whyRu:'Текущие рапорты; заказчик считает интерфейс сложным.',link:'https://www.appsheet.com/'},
      {name:'CoreDocket',kind:'vorbild',why:'Spezialisierte Rapporte für Kernbohren und Betonsägen; nicht OSS.',whyRu:'Профильные рапорты по бурению и резке; не OSS.',link:'https://www.coredocket.com.au/'},
      {name:'ODK Collect',kind:'oss',why:'Offline-Formulare, Fotos, dynamische Felder; Android-App und eigenständiges System.',whyRu:'Оффлайн-формы, фото и условные поля; отдельное Android-приложение.',link:'https://github.com/getodk/collect'},
      {name:'Expo',kind:'oss',why:'Mobile Grundlage für eine eigene stark vereinfachte ISA-Oberfläche.',whyRu:'Основа для собственного простого мобильного интерфейса.',link:'https://github.com/expo/expo'}
    ]
  },
  {
    id: 'pricing', nr: 4, actor: 'system', topicId: 'raport',
    title: 'Rapport & Preis', titleRu: 'Рапорт и цена',
    customerFact: 'Bestehende Preisliste, automatische Berechnung aus Maßen und Menge; besondere Kundenpreise und Rabatte.',
    customerFactRu: 'Существующий прайс-лист, автоматический расчёт по размерам и количеству, специальные цены и скидки клиентам.',
    recommendation: 'ProRiv-Preisregeln in einem kleinen nachvollziehbaren Preisrechner mit Preisversion; PDF aus freigegebenen Rapportspezifikationen generieren.',
    recommendationRu: 'Прозрачный расчёт по правилам ProRiv с версией прайса; формировать PDF по согласованному шаблону.',
    openQuestion: 'Welche Preisregel hat Vorrang und wann wird sie fixiert? Wer pflegt die Preisliste und darf Preise überschreiben?',
    openQuestionRu: 'Приоритет правил цены и момент фиксации? Кто меняет прайс и кому разрешена ручная корректировка?',
    evidence: 'Kundengespräch §§4 · Preisliste, Rabatte. Genaues Rechenmodell offen.',
    source: 'Kundengespräch RAW · Preis; Deep Research · OSS-Optionen',
    choices: [
      {name:'CoreDocket',kind:'vorbild',why:'Fachspezifische Preislogik; Herstellerfunktionen noch praktisch prüfen.',whyRu:'Отраслевая логика цен; требуется проверка на практике.',link:'https://www.coredocket.com.au/'},
      {name:'ERPNext',kind:'oss',why:'Preislisten-/Rabattregeln als Vorbild; als zweites ERP wahrscheinlich zu komplex.',whyRu:'Модель прайсов и скидок; второе ERP усложнит систему.',link:'https://github.com/frappe/erpnext'},
      {name:'pdfme',kind:'oss',why:'MIT-lizenzierte PDF-Vorlagen und Generierung.',whyRu:'Создание PDF по шаблонам, лицензия MIT.',link:'https://github.com/pdfme/pdfme'}
    ]
  },
  {
    id: 'send', nr: 5, actor: 'worker', topicId: 'raport',
    title: 'Rapport versenden', titleRu: 'Отправка рапорта',
    customerFact: 'Der Arbeiter selbst schickt seinen Rapport per SMS oder E-Mail an den Kunden.',
    customerFactRu: 'Рабочий сам отправляет рапорт заказчику по SMS или электронной почте.',
    recommendation: 'Rapportvorschau, Empfängerprüfung und sicherer Link. Kein ungeprüfter Pflichtschritt „Vorarbeiter genehmigt Rapport“.',
    recommendationRu: 'Предпросмотр рапорта, проверка получателя и безопасная ссылка. Не добавлять обязательное одобрение прорабом без решения.',
    openQuestion: 'Darf der Arbeiter direkt senden, wenn Preise fehlen oder Fotos noch hochgeladen werden? Wie wird die Zustellung nachgewiesen?',
    openQuestionRu: 'Может ли рабочий отправить рапорт без финальной цены или при загрузке фото? Как подтвердить доставку?',
    evidence: 'Kundengespräch §§3–4 · Arbeiter sendet direkt. Keine verpflichtende Rapportfreigabe durch Vorarbeiter beschrieben.',
    source: 'Kundengespräch RAW · Rollen und Kundenbestätigung',
    choices: [
      {name:'pdfme',kind:'oss',why:'Rapport-PDF selbst erstellen.',whyRu:'Создание PDF рапорта.',link:'https://github.com/pdfme/pdfme'},
      {name:'E-Mail/SMS',kind:'option',why:'Zustelldienst/API nötig; nicht automatisch kostenlos oder OSS.',whyRu:'Нужен сервис отправки; не обязательно бесплатный или OSS.'}
    ]
  },
  {
    id: 'customer', nr: 6, actor: 'customer', topicId: 'raport',
    title: 'Kunde antwortet', titleRu: 'Ответ заказчика',
    customerFact: 'Kunde bestätigt, lehnt ab oder kommentiert optional; Unterschrift direkt vor Ort ist ebenfalls vorgesehen.',
    customerFactRu: 'Клиент подтверждает, отклоняет, может оставить комментарий; подпись на месте также предусмотрена.',
    recommendation: 'Einfache mobil optimierte Bestätigungsseite ohne verpflichtendes Kundenkonto; Unterschrift nur wenn fachlich notwendig.',
    recommendationRu: 'Простая страница согласования без обязательного аккаунта; подпись при необходимости.',
    openQuestion: 'Wie funktioniert ein Nein, Nichtantwort oder spätes Feedback? Muss auf Kundenbestätigung vor Lohnexport gewartet werden?',
    openQuestionRu: 'Что происходит при отказе, молчании или позднем ответе? Надо ли ждать клиента до отправки часов?',
    evidence: 'Kundengespräch §§3–6 · Bestätigung und Nichtbestätigung; Abhängigkeit von Stundenexport ausdrücklich offen.',
    source: 'Kundengespräch RAW · Kundenantwort',
    choices: [
      {name:'DocuSeal',kind:'oss',why:'Selbsthostbare E-Signatur (AGPL, Bedingungen prüfen); Ablehnungslogik selbst bauen.',whyRu:'Электронная подпись (AGPL); отказ нужно реализовать отдельно.',link:'https://github.com/docusealco/docuseal'},
      {name:'Signature Pad',kind:'oss',why:'Unterschrift direkt am Bildschirm; MIT-Lizenz.',whyRu:'Подпись на экране; лицензия MIT.',link:'https://github.com/szimek/signature_pad'},
      {name:'CoreDocket',kind:'vorbild',why:'Kundenbezogener Rapportprozess als UX-Inspiration.',whyRu:'Опыт процесса рапортов и клиентов.',link:'https://www.coredocket.com.au/'}
    ]
  },
  {
    id: 'export', nr: 7, actor: 'system', topicId: 'api',
    title: 'Stunden an Tripletex', titleRu: 'Часы в Tripletex',
    customerFact: 'In ISA erfasste Projektstunden sollen per API mit Mitarbeiter- und Projektbezug nach Tripletex übertragen werden.',
    customerFactRu: 'Часы из ISA должны поступать по API в Tripletex с привязкой к сотруднику и проекту.',
    recommendation: 'Kleine Server-Integrationsschicht mit Mapping, Statusmonitor und Schutz vor doppeltem Export. API-Rechte und Datenfelder erst testen.',
    recommendationRu: 'Небольшой серверный коннектор с сопоставлением полей, статусами и защитой от дублей; права API нужно проверить.',
    openQuestion: 'Welche Tripletex-API-Felder und Berechtigungen sind vorhanden? Wie sieht der Vorarbeiter Rapport/Arbeiten beim Prüfen der Stunden?',
    openQuestionRu: 'Какие методы и разрешения есть в Tripletex? Как прораб видит работы из рапорта при сверке часов?',
    evidence: 'Kundengespräch §§4–7 · beabsichtigte API-Übergabe. Technische Machbarkeit noch nicht getestet.',
    source: 'Kundengespräch RAW · Tripletex; Deep Research · Architektur',
    choices: [
      {name:'Tripletex',kind:'bestand',why:'Bestehendes kaufmännisches System; API-Zugang mit echtem Testkonto verifizieren.',whyRu:'Текущая бухгалтерская система; проверить API в тестовой среде.',link:'https://developer.tripletex.no/'},
      {name:'Node.js + PostgreSQL',kind:'oss',why:'Eigenes Integration-Backend; Entwicklungsarbeit erforderlich.',whyRu:'Собственный интеграционный сервер; требует разработки.',link:'https://www.postgresql.org/'}
    ]
  },
  {
    id: 'approval', nr: 8, actor: 'foreman', topicId: 'users',
    title: 'Vorarbeiter prüft Stunden', titleRu: 'Прораб проверяет часы',
    customerFact: 'Vorarbeiter vergleicht die eingereichten Stunden mit dokumentierter Arbeit und prüft/genehmigt in Tripletex.',
    customerFactRu: 'Прораб сверяет часы с выполненными работами и проверяет/одобряет их в Tripletex.',
    recommendation: 'Die Prüfoberfläche nicht nochmals in ISA duplizieren; sicheren Zugriff auf benötigte Rapportinformationen klären.',
    recommendationRu: 'Не дублировать согласование в ISA; обеспечить доступ к сведениям о рапорте при проверке в Tripletex.',
    openQuestion: 'Wie werden ausgeführte Arbeiten und Fotos bei der Stundenprüfung sichtbar? Wozu benötigt der Vorarbeiter außerdem ISA-Zugang?',
    openQuestionRu: 'Где прораб видит выполненные работы и фото при сверке часов? Зачем ему дополнительный доступ к ISA?',
    evidence: 'Kundengespräch §§3–5 · ausdrücklich Tripletex, nicht ISA. Rapportpflichtfreigabe nicht bestätigt.',
    source: 'Kundengespräch RAW · Vorarbeiter',
    choices: [
      {name:'Tripletex',kind:'bestand',why:'Prüfung findet bereits hier statt.',whyRu:'Проверка часов происходит здесь.',link:'https://tripletex.no/'},
      {name:'SmartDok',kind:'vorbild',why:'Norwegische Zeiterfassungs-/ERP-Prozesse zum Vergleich.',whyRu:'Сравнить норвежские процессы времени и бухгалтерии.',link:'https://smartdok.no/'}
    ]
  },
  {
    id: 'accounting', nr: 9, actor: 'accounting', topicId: 'api',
    title: 'Buchhaltung & Lohn', titleRu: 'Бухгалтерия и зарплата',
    customerFact: 'Buchhaltung kontrolliert die Stunden und verarbeitet die Lohnauszahlung in Tripletex; kein Zugang zu ISA nötig.',
    customerFactRu: 'Бухгалтерия проверяет часы и оформляет зарплату в Tripletex; доступ к ISA не нужен.',
    recommendation: 'Tripletex bleibt das führende Lohn- und Buchhaltungssystem. Keine Payroll- oder Rechnungsfunktion in ISA neu bauen.',
    recommendationRu: 'Tripletex остаётся системой зарплаты и бухгалтерии. Не создавать вторую бухгалтерию в ISA.',
    openQuestion: 'Welche Rückmeldung über genehmigte/korrigierte Stunden muss ISA zurückbekommen?',
    openQuestionRu: 'Какие статусы согласования или исправления часов ISA должна получать обратно?',
    evidence: 'Kundengespräch §§3–5 · keine Buchhaltungsrolle in ISA.',
    source: 'Kundengespräch RAW · Buchhaltung',
    choices: [
      {name:'Tripletex',kind:'bestand',why:'Bestehende Buchhaltungs- und Lohnplattform.',whyRu:'Текущая платформа бухгалтерии и зарплаты.',link:'https://tripletex.no/'}
    ]
  }
];

export const WORKSHOP_ROLE_LABELS: Record<WorkshopRole, {de: string;ru:string}> = {
  worker:{de:'Arbeiter',ru:'Рабочий'},
  customer:{de:'Kunde',ru:'Клиент'},
  system:{de:'ISA / System',ru:'ISA / Система'},
  foreman:{de:'Vorarbeiter',ru:'Прораб'},
  accounting:{de:'Buchhaltung',ru:'Бухгалтерия'}
};
