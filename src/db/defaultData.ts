import { TopicId, TopicMeta, SeniorQuestion } from '../types';

export const TOPIC_DEFINITIONS: Record<TopicId, TopicMeta> = {
  'mobile-app': {
    id: 'mobile-app',
    sketchTitle: 'MOBILE APP',
    sketchSubtitle: 'REACT NATIVE · AWS COGNITO · AWS STORAGE S3',
    germanTitle: 'Mobile Anwendung & Technische Architektur',
    russianTitle: 'Мобильное приложение и техническая архитектура',
    shortDescription: 'Frontend-Architektur, Frameworks, Authentifizierung via AWS Cognito und Cloud-Storage via S3.',
    russianDescription: 'Архитектура фронтенда, React Native, авторизация через AWS Cognito и хранение файлов в S3.',
    colorType: 'green',
    defaultHotspot: {
      x: 47.6,
      y: 18.0,
      radius: 13.5
    },
    sketchQuestions: [
      'MOBILE APP: Wie wird die React Native Architektur strukturiert?',
      'AWS COGNITO: Wie erfolgt Benutzerauthentifizierung und Session-Handling?',
      'AWS STORAGE S3: Wie werden Uploads für Baustellenfotos und Berichte optimiert?'
    ],
    briefing: {
      seniorAsked: 'Welche mobile Technologie setzen wir ein und wie binden wir AWS Cognito und AWS S3 sauber ein?',
      findingsSummary: 'React Native deckt iOS und Android für Baustellenmitarbeiter ab. AWS Cognito sichert Token- und Session-Handling. AWS S3 nimmt Baustellenfotos und signierte Rapport-PDFs über Presigned URLs auf.',
      competitorSummary: 'Dalux und SmartDok zeigen: Eine Offline-First-Architektur mit lokaler SQLite und Hintergrund-Uploads ist für Baustellen in Betonkellern zwingend erforderlich.',
      recommendationSummary: 'React Native + lokale SQLite-Queue + AWS Cognito + AWS S3 + Eigene Work API auf PostgreSQL. Klare MVP-Grenzen (kein ERP, kein BIM, kein 24/7-Tracking).',
      openSummary: 'AWS-Region für ProRiv (z. B. Stockholm eu-north-1) und Backup-/Aufbewahrungsfristen festlegen.'
    },
    briefingRu: {
      seniorAsked: 'Какой мобильный стек используем и как правильно подключить AWS Cognito и S3?',
      findingsSummary: 'React Native закрывает iOS и Android для рабочих на стройке. AWS Cognito обеспечивает JWT-токены и сессии. AWS S3 хранит фото и подписанные PDF через Presigned URLs.',
      competitorSummary: 'Опыт Dalux и SmartDok подтверждает: Offline-First архитектура с локальной базой SQLite критически необходима при работе в бетонных подвалах без связи.',
      recommendationSummary: 'Стек: React Native + SQLite (очередь оффлайн-действий) + AWS Cognito + AWS S3 + собственный бэкенд Work API на PostgreSQL. Четкие границы MVP (без тяжелого ERP и BIM).',
      openSummary: 'Выбрать регион AWS для ProRiv (например, Стокгольм eu-north-1) и правила хранения резервных копий.'
    }
  },
  'users': {
    id: 'users',
    sketchTitle: 'USERS',
    germanTitle: 'Benutzer und Rollen',
    russianTitle: 'Пользователи и роли',
    shortDescription: 'Benutzertypen, Verantwortlichkeiten, hierarchische Beziehungen und Rechteverwaltung (RBAC).',
    russianDescription: 'Типы пользователей, зоны ответственности, взаимосвязи и модель прав доступа (RBAC).',
    colorType: 'red',
    defaultHotspot: {
      x: 22.8,
      y: 39.5,
      radius: 13.5
    },
    sketchQuestions: [
      'Skolko typov polzovoteley ?',
      'Kto otvechaet za chto?',
      'Kakaya u nix vzaimosvyaz\'?',
      'Kto imeet pravo na chto ?'
    ],
    briefing: {
      seniorAsked: 'Wie viele Rollen brauchen wir, wer trägt welche Verantwortung und wer darf was im System tun?',
      findingsSummary: 'Kundengespräch: Arbeiter erfasst Zeit und Rapport und sendet Rapport selbst an Kunden; Kunde bestätigt, lehnt ab oder kommentiert; Vorarbeiter prüft Stunden in Tripletex; Buchhaltung arbeitet ausschließlich in Tripletex. Aufgaben des Vorarbeiters in ISA noch offen.',
      competitorSummary: 'SmartDok und QuickBooks Time trennen Arbeiter-Erfassung und Vorarbeiter-Freigabe strikt. Arbeiter sehen in der Regel keine kaufmännischen Preise.',
      recommendationSummary: 'Serverseitiges RBAC. Ausgeblendete Buttons im UI reichen nicht. Stundenfreigabe und Rapportfreigabe müssen fachlich unabhängig bleiben.',
      openSummary: 'Darf der Arbeiter Preise sehen? Darf der Vorarbeiter Preise ändern? Wer darf freigegebene Rapporte wieder öffnen?'
    },
    briefingRu: {
      seniorAsked: 'Сколько типов пользователей нужно, кто за что отвечает и у кого какие права?',
      findingsSummary: 'Согласно разговору: рабочий фиксирует время, делает и сам отправляет рапорт клиенту; клиент подтверждает, отклоняет или комментирует; прораб проверяет часы в Tripletex; бухгалтерия работает только в Tripletex. Доступ прораба к ISA ещё нужно уточнить.',
      competitorSummary: 'SmartDok и QuickBooks Time четко разделяют ввод рабочим и проверку бригадиром. Рабочие, как правило, не видят коммерческие цены.',
      recommendationSummary: 'Бэкенд-валидация RBAC на уровне API (скрывать кнопки в UI недостаточно). Согласование часов и согласование рапорта должны быть независимы.',
      openSummary: 'Видит ли рабочий цены? Имеет ли бригадир право менять тарифы? Кто может открывать уже утвержденный рапорт?'
    }
  },
  'clients': {
    id: 'clients',
    sketchTitle: 'KLIENTS',
    germanTitle: 'Kunden, Projekte und Baustellen',
    russianTitle: 'Клиенты, проекты и объекты',
    shortDescription: 'Kundenstammdaten, Bauobjekte, Objekttypologien und Statusmodelle im Lebenszyklus.',
    russianDescription: 'Данные клиентов, строительные объекты, типы объектов и статусы жизненного цикла.',
    colorType: 'red',
    defaultHotspot: {
      x: 21.0,
      y: 73.8,
      radius: 13.5
    },
    sketchQuestions: [
      'Kakie info ?',
      'Obekti ?',
      'Type obektov',
      'Statusi obektov ?'
    ],
    briefing: {
      seniorAsked: 'Welche Kundenstammdaten, Bauobjekte und Objekttypen benötigen wir und welche Status durchlaufen sie?',
      findingsSummary: 'Kritische Erkenntnis: Kunde, Projekt und Baustelle (Site) dürfen nicht dasselbe Objekt sein! Ein Kunde hat mehrere Projekte; ein Projekt hat mehrere Baustellen. Nur die Baustelle hat Geokoordinaten und Geofences.',
      competitorSummary: 'Fieldwire und Tripletex modellieren Kunden und Projekte separat. Tripletex führt Projekt-Nummern; Baustellen mit Geofence müssen in ISA verwaltet werden.',
      recommendationSummary: 'Hierarchisches Modell: Customer → Project → Site → WorkSession / WorkReport. Eigene ISA-UUIDs mit externer Tripletex-ID-Referenz.',
      openSummary: 'Ist Tripletex Master für alle Kunden- und Projektdaten? Wie behandeln wir Notfalleinsätze ohne vorab angelegte Adresse?'
    },
    briefingRu: {
      seniorAsked: 'Какая информация нужна по клиентам, объектам и их статусам?',
      findingsSummary: 'Ключевой вывод: Клиент, Проект и Объект (Site) — это разные сущности! У одного клиента несколько проектов; в проекте несколько объектов/строек. Только у конкретного объекта есть GPS и геозона.',
      competitorSummary: 'Fieldwire и Tripletex разделяют клиента и проект. Tripletex ведет номера проектов, а объекты и геозоны ведутся внутри ISA.',
      recommendationSummary: 'Иерархическая модель: Customer → Project → Site → WorkSession / WorkReport. Внутренние UUID в ISA и внешние ID Tripletex.',
      openSummary: 'Является ли Tripletex мастер-системой для клиентов и проектов? Как обрабатывать срочные выезды без готового адреса?'
    }
  },
  'raport': {
    id: 'raport',
    sketchTitle: 'RAPORT',
    germanTitle: 'Arbeitsrapporte',
    russianTitle: 'Рабочие рапорты',
    shortDescription: 'Erfassung, Zugriffsberechtigungen, Statusflow, Typen, Datenexport und Foto-/Dateianhänge.',
    russianDescription: 'Создание рапорта, права доступа, статусы, типы работ, фото и отправка данных.',
    colorType: 'red',
    defaultHotspot: {
      x: 48.8,
      y: 56.5,
      radius: 13.5
    },
    sketchQuestions: [
      'Kak imenno sozdayom ?',
      'Ktom imeet dostup ?',
      'Mojno li izmenit\'?',
      'Statusi ?',
      'Type?',
      'Kuda otpravlyaem ?',
      'Kak obnovlyaetsya ?',
      'FOTO, kakie faili ?'
    ],
    briefing: {
      seniorAsked: 'Wie genau wird ein Rapport erstellt, wer hat Zugriff, welche Typen/Status gibt es und wie laufen Aktualisierungen und Dateianhänge?',
      findingsSummary: 'Kernarbeitsarten für ProRiv: Kernbohren (Durchmesser mm, Tiefe cm, Anzahl, Wand/Decke/Überkopf), Bodensäge (Tiefe cm, Länge m), Wandsäge. Echter Rapport: Merarbeid bei Kernbohrungen, Lift/Gerüst, Helferarbeit, Rüsten/Transport (vier Zeilen). Separates norwegisches Preisblatt belegt weitere Zusatzkosten und Zuschläge; Preisstand laut Nutzer am 09.10.2026 als aktuelle Preise von Isa bestätigt; vollständige Abdeckung des Katalogs und Anwendung im Einzelfall noch zu klären. PriceSnapshot ist ein unbestätigter Architekturvorschlag.',
      competitorSummary: 'PlanRadar und Dalux bieten touch-optimierte Formulare. Freigegebene Rapporte werden niemals direkt überschrieben, sondern erzeugen versionierte Revisionen.',
      recommendationSummary: 'Vorschlag: Arbeiter erstellt Rapport → sendet an Kunden → Kunde bestätigt, kommentiert oder lehnt ab. Ein obligatorisches ForemanApproved/OfficeApproved für Rapporte ist NICHT vom Kunden beschrieben. Korrekturen und Preisversionierung getrennt klären.',
      openSummary: 'Welche Felder und Fotos sind pro Arbeitsart zwingend erforderlich? Muss jeder Rapport vor dem Lohnexport vom Kunden unterschrieben sein?'
    },
    briefingRu: {
      seniorAsked: 'Как создается рапорт, кто имеет доступ, можно ли менять, какие типы, статусы и фото?',
      findingsSummary: 'Специфика ProRiv: Алмазное бурение (диаметр мм, глубина см, количество, положение: стена/пол/потолок), нарезка швов пола (глубина см, метры), стенорезка. Реальный рапорт: дополнительная работа при бурении, подъёмник/леса, помощник, подготовка/транспорт (четыре строки). Отдельный норвежский прайс-лист показывает другие надбавки и услуги; пользователь 09.10.2026 подтвердил, что цены Исы действующие; полноту каталога и отдельные расчётные случаи ещё уточнить. PriceSnapshot — неподтверждённый архитектурный вариант.',
      competitorSummary: 'PlanRadar и Dalux используют формы под пальцы на объекте. Утвержденные рапорты никогда не перезаписываются "на лету", а создают версионированную ревизию.',
      recommendationSummary: 'Предложение: рабочий создаёт рапорт → сам отправляет клиенту → клиент подтверждает, комментирует или отклоняет. Обязательное утверждение прорабом/офисом клиент НЕ подтверждал. Исправления и версии цен надо уточнить.',
      openSummary: 'Какие поля обязательны для каждой операции? Обязательна ли подпись клиента для экспорта часов в зарплату?'
    }
  },
  'vremya': {
    id: 'vremya',
    sketchTitle: 'VREMYA',
    germanTitle: 'Zeiterfassung und GPS',
    russianTitle: 'Учет времени и GPS',
    shortDescription: 'Zeiterfassungslogik, Bedingungen, Markt- und Wettbewerbsvergleich sowie Notwendigkeit von Geolokalisierung.',
    russianDescription: 'Логика фиксации времени, условия, анализ программ и необходимость GPS.',
    colorType: 'red',
    defaultHotspot: {
      x: 73.2,
      y: 34.0,
      radius: 13.5
    },
    sketchQuestions: [
      'Kto zapisivaet vremya ?',
      'Kakie uslovie ?',
      'Kak rabotayut drugie programmi ?',
      'Geolokaciya obyazatelna ?'
    ],
    briefing: {
      seniorAsked: 'Wer erfasst die Arbeitszeit, unter welchen Bedingungen, wie lösen Wettbewerber das und ist GPS verpflichtend?',
      findingsSummary: 'Grundsatz: GPS dient als Plausibilitätsnachweis beim Clock-in, nicht als automatischer Lohnabzug oder 24/7-Tracking. Dreiteilung von WorkSession (Stempeln), TimesheetEntry (Abrechnung) und WorkReport (Aufmaß).',
      competitorSummary: 'QuickBooks Time und SmartDok nutzen Geofences als Warnung oder Prüfhinweis, blockieren den Arbeiter vor Ort aber nicht, wenn in Tiefgaragen das GPS-Signal fehlt.',
      recommendationSummary: 'Punktuelles GPS beim Einstempeln. Bei fehlendem GPS oder Geofence-Abweichung: "ClockInExceptionRecorded" zur Prüfung durch den Vorarbeiter. Einhaltung des norwegischen Datenschutz- und Arbeitsrechts.',
      openSummary: 'Darf der Vorarbeiter Zeiten direkt korrigieren? Welche Tripletex-Aktivitätscodes (Boring, Saging, Reisetid) sind exakt zu mappen?'
    },
    briefingRu: {
      seniorAsked: 'Кто записывает время, какие условия, как работают другие системы и обязателен ли GPS?',
      findingsSummary: 'Принцип: GPS — это подтверждение присутствия при входе, а не слежка 24/7 и не повод автоматически резать часы. Разделение: WorkSession (отметка), TimesheetEntry (оплата), WorkReport (выполненный объем).',
      competitorSummary: 'QuickBooks Time и SmartDok фиксируют геозону как проверку, но не блокируют рабочего, если в подвале пропал спутник.',
      recommendationSummary: 'Фиксация координат только в момент старта/финиша. При неточности GPS: событие ClockInExceptionRecorded для проверки бригадиром. Строгое соответствие норвежскому праву (Datatilsynet).',
      openSummary: 'Может ли бригадир править часы напрямую? Какие коды Tripletex (бурение, пила, дорога) использовать?'
    }
  },
  'api': {
    id: 'api',
    sketchTitle: 'API, chto kuda otpravlyaem ?',
    germanTitle: 'Schnittstellen und Synchronisation',
    russianTitle: 'API и синхронизация',
    shortDescription: 'Schnittstellenendpunkte, Datenaustausch, Offline-/Hintergrund-Synchronisation und Nachbereitungslogik.',
    russianDescription: 'Эндпоинты, передача данных, синхронизация и обновление состояния.',
    colorType: 'red',
    defaultHotspot: {
      x: 77.2,
      y: 67.5,
      radius: 13.5
    },
    sketchQuestions: [
      'API, chto kuda otpravlyaem ?',
      'Nujna li synxranizaciya ?',
      'Chto nujno obnovit kogda vse zakonchilos?'
    ],
    briefing: {
      seniorAsked: 'Welche APIs und Endpunkte brauchen wir, was senden wir wohin, brauchen wir Sync und was wird nach Abschluss aktualisiert?',
      findingsSummary: 'Ist: AppSheet für Rapporte, Tripletex für Zeitprüfung/Buchhaltung. Ziel: ISA erfasst Stunden und soll sie projekt- und mitarbeiterbezogen via API nach Tripletex senden. Rückrichtung, API-Rechte und PDF-Transfer sind noch NICHT verifiziert. Vorarbeiter genehmigt Stunden in Tripletex.',
      competitorSummary: 'Tripletex API unterstützt projektbezogene Stundenerfassung; Binärdateien und Fotos sollten in S3 verbleiben und per URL referenziert werden.',
      recommendationSummary: 'Eigene Work API als Puffer zwischen React Native und Tripletex. Idempotente Export-Jobs (Idempotency Key) mit Retry-Muster, um doppelte Stundenbuchungen auszuschließen.',
      openSummary: 'Können vollständige Rapport-PDFs direkt in das Tripletex-Konto von ProRiv abgelegt werden oder nur Referenzen? Wie behandeln wir Stornos nach dem Export?'
    },
    briefingRu: {
      seniorAsked: 'API, что куда отправляем, нужна ли синхронизация и что обновлять по завершении?',
      findingsSummary: 'Сейчас: AppSheet для рапортов, Tripletex для проверки часов и бухгалтерии. Цель: ISA передаёт часы с проектом и сотрудником через API. Обратный обмен, права API и PDF-передача не подтверждены. Прораб согласует часы в Tripletex.',
      competitorSummary: 'API Tripletex принимает учет рабочего времени по проектам; тяжелые фото и файлы остаются в S3 и передаются ссылками.',
      recommendationSummary: 'Собственный Work API бэкенд как прослойка. Идемпотентные выгрузки (Idempotency Key) с повторными попытками (Retry), исключающие дублирование часов в ERP.',
      openSummary: 'Принимает ли конкретный тариф Tripletex ProRiv файлы PDF напрямую или только ссылки? Как оформлять сторно после экспорта?'
    }
  }
};

export const TOPIC_ORDER: TopicId[] = ['mobile-app', 'users', 'raport', 'vremya', 'clients', 'api'];

interface QuestionSeedMeta {
  de: string;
  ru: string;
  proposalDe?: string;
  proposalRu?: string;
  clientQuestionDe?: string;
  clientQuestionRu?: string;
  needsClientClarification?: boolean;
}

const QUESTION_TRANSLATIONS: Record<string, QuestionSeedMeta> = {
  'Skolko typov polzovoteley ?': {
    de: 'Wie viele Benutzertypen / Rollen gibt es im System?',
    ru: 'Сколько типов пользователей / ролей нам необходимо в системе?',
    proposalDe: 'Administrator (Büro): Vollzugriff auf Preise, Stammdaten, Kunden & Tripletex-Export\nVorarbeiter (Prorab): prüft Stunden in Tripletex; Aufgaben in ISA noch klären\nArbeiter: Zeiterfassung (Clock-in/out), Bohr- & Säge-Aufmaße, Fotoupload\nKunde: Nur passiver Lese- & Signierzugriff über zeitlich begrenzten Magic-Link',
    proposalRu: 'Администратор (Офис): полный доступ к тарифам, клиентам и выгрузке в Tripletex\nБригадир (Прораб): проверяет часы в Tripletex; функции в ISA пока не определены\nРабочий: чекин времени, замеры бурения и резки, загрузка фото\nКлиент: только просмотр и подпись рапорта по разовой ссылке',
    clientQuestionDe: 'Gibt es bei ProRiv noch weitere Rollen (z. B. Subunternehmer, externe Bauleiter des Generalunternehmers)? Müssen Vorarbeiter mehrere Baustellen parallel verwalten können?',
    clientQuestionRu: 'Есть ли у ProRiv дополнительные роли (субподрядчики, внешние технадзоры)? Ведет ли один прораб несколько объектов одновременно?',
    needsClientClarification: true
  },
  'Kto otvechaet za chto?': {
    de: 'Wer trägt welche fachliche und betriebliche Verantwortung?',
    ru: 'Кто отвечает за какие задачи и процессы?',
    proposalDe: 'Arbeiter: Genaue technische Mengenerfassung (mm, cm, m) & Baustellenfotos vor Ort.\nVorarbeiter: Fachliche Vollständigkeit & Standortplausibilität vor Abnahme.\nBüro: Finale kaufmännische Prüfung, Lohnübertrag an Tripletex und Rechnungsstellung.',
    proposalRu: 'Рабочий = точные технические замеры бурения/резки и фото на объекте.\nБригадир = полнота работ и проверка GPS-отклонений до сдачи.\nОфис = финансовая проверка, передача табеля в Tripletex и выставление счета клиенту.',
    clientQuestionDe: 'Wer haftet bei ProRiv für vergessene Zusatzaufwände (z. B. Bewehrungszuschlag)? Darf der Vorarbeiter Stunden des Arbeiters direkt korrigieren oder nur zur Überarbeitung zurückweisen?',
    clientQuestionRu: 'Кто в ProRiv отвечает за пропущенные доплаты (например, резка арматуры)? Может ли прораб сам исправить часы рабочего или обязан вернуть на доработку?',
    needsClientClarification: true
  },
  'Kakaya u nix vzaimosvyaz\'?': {
    de: 'Welche hierarchische Beziehung und Interaktion besteht zwischen den Rollen?',
    ru: 'Какая между ними иерархия и взаимосвязь при передаче данных?',
    proposalDe: 'Laut Kundengespräch: Arbeiter erfasst Zeit und Rapport -> Arbeiter sendet Rapport direkt an Kunden -> Kunde antwortet. Arbeitsstunden gelangen nach Tripletex -> Vorarbeiter prüft sie DORT -> Buchhaltung arbeitet DORT. Ob Kundenantwort den Stundenexport blockiert, ist OFFEN.',
    proposalRu: 'Каскадная цепочка: Офис назначает объект -> Прораб распределяет людей -> Рабочий фиксирует смену и замеры -> Прораб утверждает -> Офис закрывает. Заказчик вне контура приложения.',
    clientQuestionDe: 'Kommt es vor, dass erfahrene Arbeiter ohne zugewiesenen Vorarbeiter direkt auf Kleinbaustellen arbeiten? Wer übernimmt in diesem Fall die Freigabe der Stunden?',
    clientQuestionRu: 'Бывают ли у ProRiv мелкие выезды, где рабочий работает один без прораба? Кто в этом случае согласует его смену?',
    needsClientClarification: true
  },
  'Kto imeet pravo na chto ?': {
    de: 'Wer hat welche konkreten Zugriffs- und Bearbeitungsrechte (RBAC)?',
    ru: 'Кто имеет право на какие конкретные действия (матрица RBAC)?',
    proposalDe: 'Serverseitige RBAC-Matrix: Arbeiter sehen NIEMALS Preise oder Stundensätze. Vorarbeiter sehen technische Mengen und Sollzeiten. Nur das Büro hat Einblick in Margen, Verrechnungssätze und ERP-IDs.',
    proposalRu: 'Серверный RBAC: Рабочие НИКОГДА не видят коммерческие цены и ставки. Бригадиры видят объемы и нормы времени. Только офис видит расценки, маржу и ERP-номера.',
    clientQuestionDe: 'Dürfen Vorarbeiter vor Ort Regiestunden oder Zusatzpreise mit dem Bauleiter des Kunden aushandeln, oder ist das strikt dem Büro vorbehalten?',
    clientQuestionRu: 'Имеет ли прораб право согласовывать с заказчиком на объекте дополнительные платные часы или это делает только офис?',
    needsClientClarification: true
  },
  'Kakie info ?': {
    de: 'Welche Stammdaten und Kontaktinformationen müssen für Kunden erfasst werden?',
    ru: 'Какая информация и реквизиты нужны по клиентам?',
    proposalDe: 'Kundenname, Organisationsnummer, Rechnungsadresse, E-Mail für Rapporte, Ansprechpartner vor Ort mit Mobiltelefonnummer für Notfälle.',
    proposalRu: 'Название, ИНН компании, юридический адрес, email для отправки рапортов, контакты прораба на объекте.',
    clientQuestionDe: 'Gibt es einen festen Nummernkreis aus Tripletex, der als führende Kunden-ID in ISA synchronisiert werden muss?',
    clientQuestionRu: 'Используется ли номер клиента из Tripletex как главный ключ в ISA?',
    needsClientClarification: true
  },
  'Obekti ?': {
    de: 'Welche Bauobjekte, Standorte und Projekte sind den Kunden zugeordnet?',
    ru: 'Какие строительные объекты, адреса и площадки ведутся?',
    proposalDe: 'Strikte Trennung: Kunde (Firma) -> Projekt (z. B. Großbauvorhaben) -> Baustelle / Site (konkrete Adresse mit GPS-Geofence).',
    proposalRu: 'Четкое разделение: Клиент (Фирма) -> Проект (Договор) -> Объект / Площадка (конкретный адрес с GPS-геозоной).',
    clientQuestionDe: 'Gibt es Projekte mit mehreren separaten Bauabschnitten oder Unter-Adressen, die getrennt abgerechnet werden müssen?',
    clientQuestionRu: 'Бывают ли у одного объекта несколько очередей/адресов с разной бухгалтерией?',
    needsClientClarification: true
  },
  'Type obektov': {
    de: 'Welche Objekttypologien existieren (z. B. Neubau, Sanierung, Wartung)?',
    ru: 'Какие типы объектов различаем (новостройка, реконструкция, спецобъект)?',
    proposalDe: 'Typen: Hochbau / Neubau, Umbau / Sanierung, Infrastruktur (Brücken, Tunnel), Industrie / Gewerbe.',
    proposalRu: 'Типы: Новое строительство, Реконструкция / демонтаж, Инфраструктура (мосты, туннели), Промышленный объект.',
    clientQuestionDe: 'Hängen die Sicherheitsausrüstungen (z. B. Atemschutz, Staubabsaugung) direkt am Objekttyp?',
    clientQuestionRu: 'Зависят ли требования безопасности (СИЗ, пылеудаление) от типа объекта?',
    needsClientClarification: false
  },
  'Statusi obektov ?': {
    de: 'Welche Zustände durchläuft ein Objekt (z. B. Planung, Aktiv, Abgeschlossen)?',
    ru: 'Какие статусы проходит объект (в работе, завершен, архив)?',
    proposalDe: 'Statusfolge: Vorbereitung -> Aktiv (Zeiterfassung erlaubt) -> Pausiert -> Fertiggestellt -> Abgerechnet / Archiviert.',
    proposalRu: 'Статусы: Подготовка -> Активен (чекин разрешен) -> Приостановлен -> Завершен -> Закрыт в архиве.',
    clientQuestionDe: 'Darf auf pausierten Baustellen nachgestempelt werden, falls Nacharbeiten anfallen?',
    clientQuestionRu: 'Можно ли вносить доработки на объекте, если он временно приостановлен?',
    needsClientClarification: false
  },
  'Kak imenno sozdayom ?': {
    de: 'Wie gestaltet sich der exakte Ablauf bei der Rapporterstellung?',
    ru: 'Как именно рабочий создает рапорт на стройплощадке?',
    proposalDe: 'Mobile App Touch-Flow: 1. Baustelle wählen -> 2. Arbeitsart (Bohren/Sägen) wählen -> 3. Maße (Durchmesser, Tiefe, Meter) eingeben -> 4. Vorher/Nachher-Fotos aufnehmen -> 5. Zur Freigabe absenden.',
    proposalRu: 'Пошаговый сценарий: 1. Выбрать объект -> 2. Выбрать операцию (бурение/резка) -> 3. Ввести замеры (мм, см, м) -> 4. Сделать фото до/после -> 5. Отправить на согласование.',
    clientQuestionDe: 'Muss der Rapport zwingend am selben Tag vor Verlassen der Baustelle eingereicht werden, oder ist Sammelerfassung erlaubt?',
    clientQuestionRu: 'Обязательно ли отправлять рапорт в день работ до ухода со стройки или допускается заполнение позже?',
    needsClientClarification: true
  },
  'Ktom imeet dostup ?': {
    de: 'Wer hat Lese-, Bearbeitungs- oder Freigabezugriff auf Rapporte?',
    ru: 'Кто имеет доступ к просмотру, редактированию и согласованию рапортов?',
    proposalDe: 'Kundengespräch: Mitarbeiter erstellen und senden ihre Rapporte selbst an Kunden. Der Vorarbeiter prüft STUNDEN in Tripletex. Ob und durch wen die Rapporte vor Versand geprüft werden, ist nicht bestätigt.',
    proposalRu: 'Автор (рабочий) редактирует до отправки. Прораб проверяет и утверждает. Офис проверяет цены. Клиент смотрит по ссылке.',
    clientQuestionDe: 'Dürfen Bauleiter des Generalunternehmers Einsicht in die Rohdaten nehmen, bevor das ProRiv-Büro den Rapport freigegeben hat?',
    clientQuestionRu: 'Может ли заказчик видеть черновик рапорта до утверждения офисом ProRiv?',
    needsClientClarification: true
  },
  'Mojno li izmenit\'?': {
    de: 'Können eingereichte Rapporte nachträglich modifiziert werden (Audit Trail)?',
    ru: 'Можно ли изменить уже отправленный или согласованный рапорт?',
    proposalDe: 'Nein, nach Freigabe unveränderlich (immutabel). Korrekturen erzeugen eine neue Version (Revision 2) mit Pflichtbegründung, um Nachvollziehbarkeit zu sichern.',
    proposalRu: 'Нет, после согласования запись неизменна. Корректировка создает новую ревизию с обязательным указанием причины аудита.',
    clientQuestionDe: 'Wie verfährt ProRiv, wenn der Kunde eine Woche nach Rechnungsstellung eine Bohrung reklamiert? Reicht ein Storno-Rapport?',
    clientQuestionRu: 'Как оформляется рекламация клиента после выставления счета? Нужен ли отдельный сторно-рапорт?',
    needsClientClarification: true
  },
  'Statusi ?': {
    de: 'Welche Status gibt es (z. B. Entwurf, Zur Prüfung, Freigegeben, Verrechnet)?',
    ru: 'Какие статусы рапорта (Черновик, На проверке, Согласован бригадиром, Офис)?',
    proposalDe: 'Entwurf (Rapport) -> vom Arbeiter versendet -> Kundenantwort (bestätigt/abgelehnt). Separat: Zeit erfasst -> Tripletex-Übertragung -> dortige Vorarbeiterprüfung. Andere Freigabeschritte offen.',
    proposalRu: 'Черновик -> Отправлен -> Утвержден прорабом -> Утвержден офисом -> Выгружен в Tripletex (или Требует правок).',
    clientQuestionDe: 'Reicht eine mündliche Freigabe durch den Vorarbeiter oder muss jeder Schritt digital dokumentiert sein?',
    clientQuestionRu: 'Достаточно ли цифровой отметки прораба в приложении для бухгалтерии?',
    needsClientClarification: false
  },
  'Type?': {
    de: 'Welche Rapport-Typen werden unterschieden (Regie, Pauschal, Garantie)?',
    ru: 'Какие типы рапортов (почасовые, фиксированные, гарантийные)?',
    proposalDe: 'Typ 1: Regie / Aufmaß (Abrechnung nach m/cm/Stk). Typ 2: Stundenlohn / Regiestunden. Typ 3: Pauschalauftrag. Typ 4: Mängelbeseitigung / Gewährleistung.',
    proposalRu: 'Тип 1: Сдельный по замерам (м, см, шт). Тип 2: Почасовые допработы. Тип 3: Фиксированная цена. Тип 4: Гарантийные работы.',
    clientQuestionDe: 'Gibt es bei ProRiv Pauschalverträge, bei denen der Kunde keinen detaillierten Einzelrapport sehen darf?',
    clientQuestionRu: 'Бывают ли договоры с фиксированной ценой, где клиенту не нужно видеть подробный замер каждой дырки?',
    needsClientClarification: true
  },
  'Kuda otpravlyaem ?': {
    de: 'Wohin und an welche Schnittstellen/Empfänger wird der fertige Rapport gesendet?',
    ru: 'Куда отправляем готовый рапорт (клиенту на подпись, в офис, в ERP)?',
    proposalDe: '1. Per SMS/E-Mail-Magic-Link an Kunden zur Signatur. 2. Als PDF in den AWS S3 Speicher. 3. Zeilen und Stunden als Buchung in Tripletex.',
    proposalRu: '1. Клиенту по SMS/email на подпись. 2. PDF-файл в защищенное хранилище AWS S3. 3. Подтвержденные часы в Tripletex ERP.',
    clientQuestionDe: 'Gibt es feste E-Mail-Adressen je Kunde für den Rechnungsversand, oder unterschreibt der Bauleiter vor Ort auf dem Smartphone?',
    clientQuestionRu: 'Подписывает ли клиент на объекте пальцем на экране или согласовывает по email?',
    needsClientClarification: true
  },
  'Kak obnovlyaetsya ?': {
    de: 'Wie werden Updates und Statuswechsel synchronisiert?',
    ru: 'Как обновляется статус рапорта и синхронизируются правки?',
    proposalDe: 'WebSocket / Server-Sent Events für Echtzeit-Statusanzeige im Büro-Dashboard; lokaler Polling-Fallback in der mobilen App.',
    proposalRu: 'События WebSocket / SSE для мгновенного обновления в офисе и фоновая очередь в мобильном приложении.',
    clientQuestionDe: 'Braucht das Büro eine Push-Benachrichtigung auf Handy/Browser, sobald ein neuer Rapport eingereicht wird?',
    clientQuestionRu: 'Нужны ли офису моментальные push-уведомления о каждом новом рапорте?',
    needsClientClarification: false
  },
  'FOTO, kakie faili ?': {
    de: 'Welche Foto- und Dateianhänge sind zulässig und wie werden sie komprimiert?',
    ru: 'ФОТО, какие файлы принимаем, сжатие и загрузка в S3?',
    proposalDe: 'JPEG/WebP-Kompression auf max. 1600px Breite direkt auf dem Endgerät vor dem Upload. Direkter Upload zu AWS S3 via Presigned URL.',
    proposalRu: 'Сжатие фото в JPEG/WebP до 1600px прямо на телефоне перед отправкой. Загрузка напрямую в AWS S3 по Presigned URLs.',
    clientQuestionDe: 'Sind Fotos für jede einzelne Bohrung Pflicht oder reicht ein Übersichts-Foto des fertigen Bauteils?',
    clientQuestionRu: 'Обязательно ли фото каждого отверстия или достаточно общего фото участка?',
    needsClientClarification: true
  },
  'Kto zapisivaet vremya ?': {
    de: 'Wer erfasst die Arbeitszeit (Mitarbeiter selbst, Vorarbeiter, Polier)?',
    ru: 'Кто записывает рабочее время (рабочий сам, бригадир)?',
    proposalDe: 'Standard: Jeder Arbeiter stempelt eigenständig auf seinem Smartphone. Ausnahme: Vorarbeiter kann Stellvertreter-Stempelung für sein Team durchführen.',
    proposalRu: 'Основной путь: Рабочий чекинится сам со своего телефона. Резерв: Бригадир может отметить за коллегу, если у того сел телефон.',
    clientQuestionDe: 'Dürfen Vorarbeiter bei ProRiv ganze Kolonnen auf einmal einstempeln (z. B. 4 Mann im Transporter)?',
    clientQuestionRu: 'Может ли бригадир чекинить сразу всю бригаду (например, экипаж из 4 человек в машине)?',
    needsClientClarification: true
  },
  'Kakie uslovie ?': {
    de: 'Welche Bedingungen, Arbeitszeitmodelle und Regeln gelten?',
    ru: 'Какие условия фиксации времени (геозона, старт/стоп, перерывы)?',
    proposalDe: 'Clock-in nur mit ausgewählter Baustelle. Pausenregelung: Entweder manuelle Pausentaste oder automatischer Abzug nach 6 Stunden Arbeitszeit.',
    proposalRu: 'Чекин только с выбором объекта. Перерывы: либо кнопка "Пауза", либо автоматический вычет 30 минут после 6 часов смены.',
    clientQuestionDe: 'Wie handhabt ProRiv die gesetzliche 30-Minuten-Pause? Soll sie automatisch abgezogen oder aktiv gestempelt werden?',
    clientQuestionRu: 'Как списываются обеденные 30 минут в ProRiv: автоматически или по нажатию кнопки паузы?',
    needsClientClarification: true
  },
  'Kak rabotayut drugie programmi ?': {
    de: 'Wie lösen etablierte Wettbewerbsprodukte die Zeiterfassung am Bau?',
    ru: 'Как работают другие системы (SmartDok, QuickBooks Time, FinkZeit)?',
    proposalDe: 'SmartDok & FinkZeit: Baustellen-GPS-Prüfung beim Start/Stopp. Kein permanentes 24/7 Tracking, um Batterie und Datenschutz zu schonen.',
    proposalRu: 'SmartDok и QuickBooks Time: фиксация GPS только в момент старта и финиша смены. Без постоянного трекинга 24/7.',
    clientQuestionDe: 'Reicht ProRiv die reine Punkt-Prüfung beim Start/Stopp, oder verlangen Kunden lückenlose Standort-Historie?',
    clientQuestionRu: 'Достаточно ли ProRiv фиксации GPS только на старте и финише смены?',
    needsClientClarification: true
  },
  'Geolokaciya obyazatelna ?': {
    de: 'Ist GPS-Geolokalisierung bei Einstempeln zwingend oder optional?',
    ru: 'Геолокация обязательна или опциональна (и как быть в подвалах без GPS)?',
    proposalDe: 'Standortabfrage ist obligatorisch, blockiert den Arbeiter jedoch bei schlechtem Empfang nicht. Bei Abweichung > 150m wird eine gelbe Warnung für den Vorarbeiter erzeugt.',
    proposalRu: 'Запрос координат обязателен, но не блокирует чекин при слабом сигнале в подвале. При несовпадении с объектом создается исключение для прораба.',
    clientQuestionDe: 'Welcher Radius soll als gültige Geozone um die Baustellenadresse gelten (z. B. 100 Meter oder 250 Meter)?',
    clientQuestionRu: 'Какой радиус геозоны считать допустимым для строек ProRiv (например, 100 метров или 250 метров)?',
    needsClientClarification: true
  },
  'API, chto kuda otpravlyaem ?': {
    de: 'Welche API-Endpunkte existieren und welche Nutzdaten werden übertragen?',
    ru: 'API, что куда отправляем (какие эндпоинты в Tripletex и наш Work API)?',
    proposalDe: 'Architekturvorschlag: ISA API verwaltet Sitzungen, Leistungen, Fotos und Versionen. Tripletex-Export von Stunden ist gewünscht; genaue API-Felder, Berechtigungen und PDF-Anhänge müssen noch geprüft werden.',
    proposalRu: 'Наш Work API: хранит смены, замеры, фото и ревизии. Tripletex API: принимает утвержденные часы и ссылки на рапорты.',
    clientQuestionDe: 'Sind die Tripletex-Zugangsdaten (API-Tokens) für die Testumgebung von ProRiv bereits verfügbar?',
    clientQuestionRu: 'Готовы ли тестовые API-токены Tripletex компании ProRiv для интеграции?',
    needsClientClarification: true
  },
  'Nujna li synxranizaciya ?': {
    de: 'Wird eine Offline-Synchronisation mit Konfliktlösung benötigt?',
    ru: 'Нужна ли оффлайн-синхронизация и как разрешать конфликты?',
    proposalDe: 'Ja, unverzichtbar! SQLite-Queue auf dem Smartphone speichert lokale Aktionen mit Client-UUIDs. Synchronisation erfolgt automatisch bei Wiederverbindung.',
    proposalRu: 'Да, обязательно! Локальная очередь SQLite с клиентскими UUID. Синхронизация запускается автоматически при появлении сети.',
    clientQuestionDe: 'Gibt es Baustellen (z. B. Bunker, Bergwerke), an denen Arbeiter mehrere Tage komplett ohne Internet arbeiten?',
    clientQuestionRu: 'Бывают ли объекты, где бригада работает без связи несколько дней подряд?',
    needsClientClarification: true
  },
  'Chto nujno obnovit kogda vse zakonchilos?': {
    de: 'Welche Entitäten müssen aktualisiert werden, wenn ein Auftrag/Projekt beendet ist?',
    ru: 'Что нужно обновить в базе и ERP, когда смена или объект закрыты?',
    proposalDe: '1. WorkSession beenden. 2. Rapport auf "Submitted" setzen. 3. Baustellenstatus auf "Freigabebereit". 4. Tripletex-Sync-Queue anstoßen.',
    proposalRu: '1. Закрыть смену WorkSession. 2. Перевести рапорт в Submitted. 3. Статус выезда "Готов к проверке". 4. Поставить экспорт в очередь Tripletex.',
    clientQuestionDe: 'Muss bei Auftragsabschluss eine automatische Benachrichtigung an den Kunden-Bauleiter rausgehen?',
    clientQuestionRu: 'Нужно ли автоматически отправлять уведомление заказчику по окончании всех работ?',
    needsClientClarification: false
  },
  'MOBILE APP: Wie wird die React Native Architektur strukturiert?': {
    de: 'Architektur der mobilen Anwendung in React Native mit Offline-Unterstützung.',
    ru: 'Архитектура мобильного приложения React Native с поддержкой оффлайн-режима.',
    proposalDe: 'React Native (TypeScript) + WatermelonDB/SQLite für Offline-First + TanStack Query für API-Caching + Zustand für State Management.',
    proposalRu: 'Стек: React Native (TypeScript) + SQLite/WatermelonDB для оффлайн-режима + TanStack Query + Zustand.',
    clientQuestionDe: 'Werden von ProRiv Firmen-Smartphones gestellt (iOS oder Android) oder nutzen die Mitarbeiter eigene Geräte (BYOD)?',
    clientQuestionRu: 'Выдает ли ProRiv рабочие телефоны (iOS/Android) или рабочие используют личные устройства?',
    needsClientClarification: true
  },
  'AWS COGNITO: Wie erfolgt Benutzerauthentifizierung und Session-Handling?': {
    de: 'Cognito User Pools, Tokens, Offline-Auth und Multi-Faktor-Unterstützung.',
    ru: 'AWS Cognito: аутентификация через User Pools, JWT-токены и оффлайн-сессии.',
    proposalDe: 'AWS Cognito User Pool mit JWT-Tokens (Access/Refresh Token). Offline-fähige Session-Verlängerung mit verschlüsseltem SecureStore.',
    proposalRu: 'AWS Cognito с JWT-токенами и зашифрованным локальным SecureStore для работы без постоянного перелогинивания.',
    clientQuestionDe: 'Soll der Login per Handynummer + SMS-Code erfolgen oder per E-Mail & Passwort?',
    clientQuestionRu: 'Как рабочим удобнее входить в систему: по номеру телефона (SMS-код) или по паролю?',
    needsClientClarification: true
  },
  'AWS STORAGE S3: Wie werden Uploads für Baustellenfotos und Berichte optimiert?': {
    de: 'Direkter Medien-Upload zu S3 über Presigned URLs mit lokaler Queue.',
    ru: 'AWS S3: прямая загрузка фото и отчетов через Presigned URLs с оффлайн-очередью.',
    proposalDe: 'Direkte S3-Uploads über Presigned URLs ohne Umweg über den App-Server. Lokale Hintergrund-Warteschlange für schlechte Verbindungen.',
    proposalRu: 'Прямая отправка в AWS S3 через Presigned URLs минуя сервер приложений с фоновой очередью докачки.',
    clientQuestionDe: 'Welche Vorhaltezeit für Baustellenfotos wünscht ProRiv (z. B. 2 Jahre, 5 Jahre gesetzliche Gewährleistung)?',
    clientQuestionRu: 'Какой срок хранения фотоматериалов требуется для ProRiv (2 года или 5 лет гарантийного срока)?',
    needsClientClarification: true
  }
};

export function generateInitialQuestions(): SeniorQuestion[] {
  const questions: SeniorQuestion[] = [];
  const now = new Date().toISOString();

  Object.values(TOPIC_DEFINITIONS).forEach((topic) => {
    topic.sketchQuestions.forEach((qText, index) => {
      const trans = QUESTION_TRANSLATIONS[qText];
      questions.push({
        id: `q-orig-${topic.id}-${index + 1}`,
        topicId: topic.id,
        question: qText,
        questionRu: trans?.ru || qText,
        originalFromSketch: true,
        germanTranslation: trans?.de || qText,
        russianTranslation: trans?.ru || qText,
        answer: trans?.proposalDe || '',
        answerRu: trans?.proposalRu || '',
        clientQuestion: trans?.clientQuestionDe || '',
        clientQuestionRu: trans?.clientQuestionRu || '',
        needsClientClarification: trans?.needsClientClarification || false,
        isResolved: false,
        origin: 'sketch',
        status: 'open_decision',
        notes: 'Originalfrage aus der Senior-Skizze mit vorbereitetem Lösungsvorschlag und Kundenfrage.',
        createdAt: now,
        updatedAt: now
      });
    });
  });

  return questions;
}
