import { Language, KnowledgeStatus, KnowledgeOrigin } from '../types';

export const UI_TEXT = {
  de: {
    appName: 'ISA Research',
    appSubtitle: 'ProRiv AS · Senior Architecture',
    home: 'Originalskizze',
    status: 'Status',
    competitors: 'Wettbewerb',
    events: 'Events',
    seniorDecisions: 'Mit Senior klären',
    search: 'Suche',
    importExport: 'Import/Export',
    presentation: 'Präsentation',
    backToSketch: '← Zurück zur Originalskizze',
    exitPresentation: 'Beenden',
    keys: 'Tasten',
    topics: 'Themen',
    sketch: 'Skizze',
    interactiveSketch: 'Interaktive Originalskizze',
    clickCircleHint: 'Klicke auf einen der 6 Kreise zur Detailanalyse',
    uploadCustomImage: 'Bild hochladen (PNG/JPG)',
    replaceImage: 'Bild ersetzen',
    calibrateHotspots: 'Hotspots kalibrieren',
    directAccess: 'Direktzugriff auf alle 6 Themenbereiche der Skizze',
    solvedQuestions: 'Fragen gelöst',
    
    // Overview
    overviewTitle: 'Recherche- und Statusübersicht',
    overviewSubtitle: 'Echtzeit-Kennzahlen, MVP-Strategie und Fortschritt über alle 6 Bereiche der Originalskizze.',
    mvpStrategyTitle: 'Strategischer Grundsatz für das MVP',
    mvpQuote: '„Wir bauen kein zweites Dalux und kein neues Tripletex. Wir entwickeln eine schlanke Baustellen-Ausführungsschicht für ProRiv und integrieren bestehende Systeme.“',
    pilotScopeTitle: 'Empfohlener erster Pilot für ProRiv AS:',
    seniorQuestionsKpi: 'Senior Fragen',
    seniorQuestionsSub: 'Originalfragen aus Skizze',
    answeredKpi: 'Beantwortet',
    clarificationRate: 'Klärungsquote',
    openPointsKpi: 'Offene Punkte',
    ofPoints: 'von Klärungsbedarfen',
    recommendationsKpi: 'Empfehlungen',
    recommendationsSub: 'Architekturvorschläge',
    decisionsKpi: 'Entscheidungen',
    decisionsSub: 'Dokumentierte Beschlüsse',
    domainOverviewTitle: 'Übersicht nach Themenbereichen',
    clickRowHint: 'Klicke auf eine Zeile für die Detailanalyse',
    colDomain: 'Bereich (Skizze)',
    colTopic: 'Thema (Deutsch / Russisch)',
    colQuestions: 'Fragen (Geklärt/Total)',
    colFindings: 'Erkenntnisse',
    colCompetitors: 'Wettbewerb',
    colRecs: 'Empfehlungen',
    colDecisions: 'Entscheidungen',
    colAction: 'Aktion',
    detailsBtn: 'Details',

    // Briefing
    briefingTitle: 'Senior-Briefing: Das Wichtigste auf einen Blick',
    briefing1: '1. Was hat der Senior gefragt?',
    briefing2: '2. Bisher herausgefunden',
    briefing3: '3. Andere Programme',
    briefing4: '4. Empfehlung für ISA',
    briefing5: '5. Noch zu klären',

    // Sections
    allSections: 'Alle Bereiche',
    secA: 'A. Übersicht',
    secB: 'B. Fragen des Seniors',
    secC: 'C. Erkenntnisse',
    secD: 'D. Wettbewerb',
    secE: 'E. Empfehlungen',
    secF: 'F. Offene Punkte',
    secG: 'G. Entscheidungen',
    secH: 'H. Quellen & Anhänge',

    // Actions
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    addQuestion: 'Frage hinzufügen',
    addFinding: 'Erkenntnis hinzufügen',
    addCompetitor: 'Wettbewerber analysieren',
    addRec: 'Empfehlung hinzufügen',
    addOpenPoint: 'Punkt hinzufügen',
    addDecision: 'Entscheidung dokumentieren',
    addAttachment: 'Quelle oder Anhang hinzufügen',
    openLink: 'Öffnen',
    download: 'Herunterladen',
    copied: 'Kopiert',
    copy: 'Kopieren',
    resolved: 'Geklärt',
    unresolved: 'Offen',
    markResolved: 'Als geklärt markieren',
    markOpen: 'Als offen markieren',
    originalQuestion: 'Originalfrage aus Skizze',
    translation: 'Übersetzung / Bedeutung',
    answer: 'Antwort / Erkenntnis',
    source: 'Quelle / Link',
    ourProposal: '1. Unser Vorschlag (Technik)',
    clientQuestion: '2. Frage an Klienten (Isa)',
    needsClientClarification: 'Klärung mit Klient (Isa) nötig',
    clientQuestionHint: 'Hier fixieren, was der Senior den Kunden (Isa) fragen muss, falls wir es noch nicht wissen.',
    filterAllQuestions: 'Alle Fragen',
    filterClientQuestions: 'Fragen an Klienten (Isa)',
    
    // Competitor Hub
    compHubTitle: 'Wettbewerbsrecherche & Benchmarking',
    compHubSubtitle: 'Systematische Untersuchung von SmartDok, FinkZeit, QuickBooks Time, Dalux, PlanRadar, Fieldwire und Tripletex für das Projekt ISA.',
    compWarning: 'Wichtiger methodischer Grundsatz: Diese Recherche dokumentiert unsere Untersuchungsrichtungen und Designinspirationen für ProRiv. Sie stellt keine vollständig extern verifizierte Feature-Matrix dar. Unbelegte Felder bleiben bewusst leer; keine erfundenen Quellen, Zitate oder Preise.',
    compSearchPlaceholder: 'Wettbewerber filtern (z. B. SmartDok, Geofence, Dalux)...',
    compOverview: 'Untersuchte Softwareprodukte im Überblick',
    compGoal: 'Untersuchte Fragestellung:',
    compWorkflow: 'Beobachteter Ablauf:',
    compTakeaway: 'Was wir für ISA lernen können:',
    compDisadvantages: 'Bekannte Nachteile / Grenzen:',
    compTransfer: 'Übertragbarkeit auf unser Produkt:',
    compSource: 'Quelle:',

    // Event Storming
    eventsTitle: 'Event Storming & Fachregeln (Domain Model)',
    eventsSubtitle: 'Zustandsübergänge, Aggregate, Commands, Policies und Ausnahmebehandlung von der Baustelle bis zum ERP-Export.',
    tabTimeline: '18 Domain Events (Lebenszyklus)',
    tabRules: '10 Fachliche Kernregeln',
    tabExceptions: 'Ausnahmefälle & Fehlerpfade',
    
    // Senior Decisions
    seniorTitle: 'Mit dem Senior Software Engineer klären',
    seniorSubtitle: 'Zentrale architektonische und fachliche Weichenstellungen vor Abschluss des MVP-Konzepts für ProRiv AS.',
    prioAll: 'Alle Fragen',
    responsible: 'Verantwortlich',
    statusLabel: 'Status',
    currentProposal: 'Aktueller Lösungsvorschlag:',
    rationale: 'Architektonische Begründung:',
    linkedToCircle: 'Verknüpft mit Kreis:',

    // Search & Modals
    searchPlaceholder: 'Suche über alle 6 Themenbereiche, Fragen, Wettbewerber (Cmd+K)...',
    searchResults: 'Suchergebnisse',
    noResults: 'Keine Ergebnisse gefunden',
    exportReport: 'Bericht exportieren',
    importContent: 'Recherche-Inhalte importieren',
    quickAccess: 'Direktzugriff',
    clickToOpen: 'Klicken zum Öffnen der Detailanalyse →'
  },

  ru: {
    appName: 'ISA Research',
    appSubtitle: 'ProRiv AS · Архитектура для Сеньора',
    home: 'Оригинальный эскиз',
    status: 'Статус',
    competitors: 'Конкуренты',
    events: 'События',
    seniorDecisions: 'Вопросы сеньору',
    search: 'Поиск',
    importExport: 'Импорт/Экспорт',
    presentation: 'Презентация',
    backToSketch: '← Назад к оригинальному эскизу',
    exitPresentation: 'Завершить',
    keys: 'Горячие клавиши',
    topics: 'Темы',
    sketch: 'Эскиз',
    interactiveSketch: 'Интерактивный эскиз сеньора',
    clickCircleHint: 'Нажмите на любой из 6 кругов для перехода к деталям',
    uploadCustomImage: 'Загрузить PNG/JPG эскиза',
    replaceImage: 'Заменить файл',
    calibrateHotspots: 'Калибровка клик-зон',
    directAccess: 'Прямой доступ ко всем 6 темам с эскиза',
    solvedQuestions: 'вопросов решено',

    // Overview
    overviewTitle: 'Обзор исследования и статуса архитектуры',
    overviewSubtitle: 'Метрики в реальном времени, стратегия MVP и прогресс по всем 6 областям оригинального эскиза.',
    mvpStrategyTitle: 'Стратегический принцип для MVP',
    mvpQuote: '«Мы не создаем второй Dalux и не переписываем Tripletex. Мы разрабатываем удобный инструмент исполнения на стройплощадке для ProRiv и бесшовно интегрируем его с существующими системами.»',
    pilotScopeTitle: 'Рекомендуемый первый пилот для ProRiv AS:',
    seniorQuestionsKpi: 'Вопросы сеньора',
    seniorQuestionsSub: 'Вопросы из эскиза',
    answeredKpi: 'Отвечено',
    clarificationRate: 'Доля решений',
    openPointsKpi: 'Открытые точки',
    ofPoints: 'требуют уточнения',
    recommendationsKpi: 'Рекомендации',
    recommendationsSub: 'Архитектурные решения',
    decisionsKpi: 'Решения',
    decisionsSub: 'Зафиксированные решения',
    domainOverviewTitle: 'Обзор по тематическим областям',
    clickRowHint: 'Нажмите на строку для детального анализа',
    colDomain: 'Круг (Эскиз)',
    colTopic: 'Тема (Русский / Немецкий)',
    colQuestions: 'Вопросы (Решено/Всего)',
    colFindings: 'Выводы',
    colCompetitors: 'Конкуренты',
    colRecs: 'Рекомендации',
    colDecisions: 'Решения',
    colAction: 'Действие',
    detailsBtn: 'Детали',

    // Briefing
    briefingTitle: 'Брифинг для сеньора: Главное за 30 секунд',
    briefing1: '1. Что спросил сеньор?',
    briefing2: '2. Что мы выяснили',
    briefing3: '3. Как делают другие',
    briefing4: '4. Рекомендация для ISA',
    briefing5: '5. Что еще открыто',

    // Sections
    allSections: 'Все разделы',
    secA: 'А. Обзор темы',
    secB: 'Б. Вопросы сеньора',
    secC: 'В. Собранные выводы',
    secD: 'Г. Конкуренты',
    secE: 'Д. Рекомендации',
    secF: 'Е. Открытые вопросы',
    secG: 'Ж. Решения',
    secH: 'З. Источники и файлы',

    // Actions
    save: 'Сохранить',
    cancel: 'Отмена',
    edit: 'Редактировать',
    delete: 'Удалить',
    addQuestion: 'Добавить вопрос',
    addFinding: 'Добавить вывод',
    addCompetitor: 'Добавить конкурента',
    addRec: 'Добавить рекомендацию',
    addOpenPoint: 'Добавить вопрос',
    addDecision: 'Зафиксировать решение',
    addAttachment: 'Прикрепить файл или ссылку',
    openLink: 'Открыть',
    download: 'Скачать',
    copied: 'Скопировано',
    copy: 'Копировать',
    resolved: 'Решено',
    unresolved: 'Открыто',
    markResolved: 'Отметить как решенный',
    markOpen: 'Отметить как открытый',
    originalQuestion: 'Вопрос из эскиза',
    translation: 'Значение и перевод',
    answer: 'Ответ / Решение',
    source: 'Источник / Ссылка',
    ourProposal: '1. Наше предложение (Техническое решение)',
    clientQuestion: '2. Вопрос клиенту (Иса)',
    needsClientClarification: 'Требуется уточнение у клиента (Иса)',
    clientQuestionHint: 'Зафиксируйте здесь, что Сеньор должен спросить у заказчика (Исы), если точные требования неизвестны.',
    filterAllQuestions: 'Все вопросы',
    filterClientQuestions: 'Вопросы клиенту (Иса)',

    // Competitor Hub
    compHubTitle: 'Анализ конкурентов и бенчмаркинг',
    compHubSubtitle: 'Систематическое исследование SmartDok, FinkZeit, QuickBooks Time, Dalux, PlanRadar, Fieldwire и Tripletex для проекта ISA.',
    compWarning: 'Важное методическое правило: Этот анализ фиксирует наши направления поиска и вдохновение для ProRiv. Это не вымышленная матрица фич. Неподтвержденные поля намеренно оставлены пустыми; мы не выдумываем цены или цитаты.',
    compSearchPlaceholder: 'Поиск по конкурентам (например, SmartDok, геозона, Dalux)...',
    compOverview: 'Исследованные программные продукты',
    compGoal: 'Исследуемый вопрос:',
    compWorkflow: 'Наблюдаемый процесс:',
    compTakeaway: 'Что берем для ISA:',
    compDisadvantages: 'Ограничения и минусы:',
    compTransfer: 'Применимость в нашем продукте:',
    compSource: 'Источник:',

    // Event Storming
    eventsTitle: 'Event Storming и бизнес-правила (Доменная модель)',
    eventsSubtitle: 'Переходы состояний, агрегаты, команды, политики и обработка исключений от стройплощадки до ERP.',
    tabTimeline: '18 Доменных событий (Жизненный цикл)',
    tabRules: '10 Ключевых бизнес-правил',
    tabExceptions: 'Исключительные ситуации и сбои',

    // Senior Decisions
    seniorTitle: 'Вопросы на согласование с Сеньором',
    seniorSubtitle: 'Ключевые архитектурные и бизнес-развилки перед финализацией концепции MVP для ProRiv AS.',
    prioAll: 'Все вопросы',
    responsible: 'Ответственный',
    statusLabel: 'Статус',
    currentProposal: 'Предлагаемое решение:',
    rationale: 'Архитектурное обоснование:',
    linkedToCircle: 'Связано с кругом:',

    // Search & Modals
    searchPlaceholder: 'Поиск по всем 6 темам, вопросам, конкурентам (Cmd+K)...',
    searchResults: 'Результаты поиска',
    noResults: 'Ничего не найдено',
    exportReport: 'Экспорт отчета',
    importContent: 'Импорт данных исследования',
    quickAccess: 'Прямой доступ',
    clickToOpen: 'Нажмите для перехода к анализу →'
  },

  bilingual: {
    appName: 'ISA Research',
    appSubtitle: 'ProRiv AS · Архитектура / Architektur',
    home: 'Skizze / Эскиз',
    status: 'Status / Статус',
    competitors: 'Wettbewerb / Конкуренты',
    events: 'Events / События',
    seniorDecisions: 'Senior / Вопросы сеньору',
    search: 'Suche / Поиск',
    importExport: 'Import / Export',
    presentation: 'Präsentation / Презентация',
    backToSketch: '← Zurück / Назад к эскизу',
    exitPresentation: 'Beenden / Выход',
    keys: 'Tasten / Клавиши',
    topics: 'Themen / Темы',
    sketch: 'Skizze / Эскиз',
    interactiveSketch: 'Interaktive Skizze / Интерактивный эскиз',
    clickCircleHint: 'Klicke auf Kreis / Нажмите на круг',
    uploadCustomImage: 'Bild hochladen / Загрузить файл',
    replaceImage: 'Bild ersetzen / Заменить',
    calibrateHotspots: 'Kalibrieren / Калибровка',
    directAccess: 'Direktzugriff / Прямой доступ (6 тем)',
    solvedQuestions: 'gelöst / решено',

    // Overview
    overviewTitle: 'Statusübersicht / Обзор архитектуры',
    overviewSubtitle: 'Kennzahlen & MVP-Strategie / Метрики и стратегия MVP по всем 6 темам.',
    mvpStrategyTitle: 'MVP-Grundsatz / Стратегический принцип',
    mvpQuote: '„Мы не создаем второй Dalux и не переписываем Tripletex. Разрабатываем легкий инструмент для ProRiv и интегрируем существующие системы.“ (Kein 2. Dalux/Tripletex)',
    pilotScopeTitle: 'Pilot ProRiv AS / Рекомендуемый пилот:',
    seniorQuestionsKpi: 'Fragen / Вопросы',
    seniorQuestionsSub: 'Aus Skizze / Из эскиза',
    answeredKpi: 'Geklärt / Отвечено',
    clarificationRate: 'Quote / Доля',
    openPointsKpi: 'Offen / Открыто',
    ofPoints: 'Klärungsbedarf / Требуют решения',
    recommendationsKpi: 'Empfehlungen / Рекомендации',
    recommendationsSub: 'Architektur / Архитектура',
    decisionsKpi: 'Entscheidungen / Решения',
    decisionsSub: 'Beschlüsse / Решения',
    domainOverviewTitle: 'Themenbereiche / Обзор по темам',
    clickRowHint: 'Details / Нажмите строку для анализа',
    colDomain: 'Kreis / Круг',
    colTopic: 'Thema / Тема',
    colQuestions: 'Fragen / Вопросы',
    colFindings: 'Befunde / Выводы',
    colCompetitors: 'Wettbewerb / Конкуренты',
    colRecs: 'Empfehlungen / Рекомендации',
    colDecisions: 'Entscheidungen / Решения',
    colAction: 'Aktion / Действие',
    detailsBtn: 'Details / Детали',

    // Briefing
    briefingTitle: 'Senior-Briefing / Брифинг для сеньора',
    briefing1: '1. Frage / Вопрос сеньора',
    briefing2: '2. Befund / Что выяснили',
    briefing3: '3. Markt / Другие программы',
    briefing4: '4. ISA-Vorschlag / Рекомендация',
    briefing5: '5. Offen / Еще открыто',

    // Sections
    allSections: 'Alle / Все разделы',
    secA: 'A. Übersicht / Обзор',
    secB: 'B. Fragen / Вопросы сеньора',
    secC: 'C. Erkenntnisse / Выводы',
    secD: 'D. Wettbewerb / Конкуренты',
    secE: 'E. Empfehlungen / Рекомендации',
    secF: 'F. Offen / Открытые вопросы',
    secG: 'G. Entscheide / Решения',
    secH: 'H. Quellen / Источники',

    // Actions
    save: 'Speichern / Сохранить',
    cancel: 'Abbrechen / Отмена',
    edit: 'Bearbeiten / Изменить',
    delete: 'Löschen / Удалить',
    addQuestion: 'Frage / Вопрос (+)',
    addFinding: 'Erkenntnis / Вывод (+)',
    addCompetitor: 'Wettbewerb / Конкурент (+)',
    addRec: 'Empfehlung / Рекомендация (+)',
    addOpenPoint: 'Punkt / Вопрос (+)',
    addDecision: 'Entscheid / Решение (+)',
    addAttachment: 'Anhang / Файл (+)',
    openLink: 'Öffnen / Открыть',
    download: 'Download / Скачать',
    copied: 'Kopiert / Скопировано',
    copy: 'Kopieren / Копировать',
    resolved: 'Geklärt / Решено',
    unresolved: 'Offen / Открыто',
    markResolved: 'Als geklärt / Отметить решенным',
    markOpen: 'Als offen / Отметить открытым',
    originalQuestion: 'Original / Оригинал вопроса',
    translation: 'Bedeutung / Значение',
    answer: 'Antwort / Ответ',
    source: 'Quelle / Источник',
    ourProposal: '1. Unser Vorschlag / Наше предложение',
    clientQuestion: '2. Frage an Klienten (Isa) / Вопрос клиенту',
    needsClientClarification: 'Klärung mit Isa nötig / Вопрос клиенту',
    clientQuestionHint: 'Hier fixieren, was der Senior den Kunden (Isa) fragen muss / Зафиксируйте вопросы для Исы.',
    filterAllQuestions: 'Alle Fragen / Все вопросы',
    filterClientQuestions: 'Fragen an Isa / Вопросы клиенту',

    // Competitor Hub
    compHubTitle: 'Wettbewerb / Анализ конкурентов',
    compHubSubtitle: 'Benchmarking SmartDok, QuickBooks Time, Dalux, Tripletex für ISA.',
    compWarning: 'Methodischer Hinweis / Методическое правило: Recherche dokumentiert Richtungen für ProRiv; keine erfundenen Feature-Listen oder Preise.',
    compSearchPlaceholder: 'Filter / Поиск (SmartDok, Dalux, Geofence)...',
    compOverview: 'Software-Produkte / Продукты',
    compGoal: 'Frage / Вопрос:',
    compWorkflow: 'Ablauf / Процесс:',
    compTakeaway: 'Für ISA / Что берем:',
    compDisadvantages: 'Grenzen / Минусы:',
    compTransfer: 'Übertragbar / Применимость:',
    compSource: 'Quelle / Источник:',

    // Event Storming
    eventsTitle: 'Event Storming & Regeln / Модель событий',
    eventsSubtitle: 'Zustände, Aggregate, Commands und ERP-Export von der Baustelle.',
    tabTimeline: '18 Events / 18 Событий',
    tabRules: '10 Regeln / 10 Правил',
    tabExceptions: 'Fehlerpfade / Исключения',

    // Senior Decisions
    seniorTitle: 'Mit Senior klären / Согласовать с Сеньором',
    seniorSubtitle: '10 Weichenstellungen vor MVP-Abschluss für ProRiv AS.',
    prioAll: 'Alle / Все',
    responsible: 'Verantwortlich / Ответственный',
    statusLabel: 'Status / Статус',
    currentProposal: 'Vorschlag / Предложение:',
    rationale: 'Begründung / Обоснование:',
    linkedToCircle: 'Kreis / Круг:',

    // Search & Modals
    searchPlaceholder: 'Suche / Поиск (Cmd+K)...',
    searchResults: 'Ergebnisse / Результаты',
    noResults: 'Keine Treffer / Ничего не найдено',
    exportReport: 'Export / Экспорт отчета',
    importContent: 'Import / Импорт данных',
    quickAccess: 'Direkt / Прямой доступ',
    clickToOpen: 'Öffnen / Перейти к анализу →'
  }
};

export const STATUS_LABELS: Record<Language, Record<string, { label: string; desc: string }>> = {
  de: {
    project_known: { label: 'Bekannt aus Projektkontext', desc: 'Bisherige Projektinformation – noch nicht offiziell vom Kunden abgenommen' },
    recommended: { label: 'Empfohlen', desc: 'Architektur- oder Produktvorschlag unseres Teams' },
    open_decision: { label: 'Offen – fachlich zu entscheiden', desc: 'Bedarf noch einer verbindlichen Entscheidung mit Senior oder Kunde' },
    technical_verify: { label: 'Technisch zu verifizieren', desc: 'Muss als PoC oder API-Test gegen Tripletex/AWS geprüft werden' },
    externally_unverified: { label: 'Extern noch nicht belegt', desc: 'Beobachtung ohne formale externe Quellenbestätigung' },
    confirmed: { label: 'Bestätigt', desc: 'Offiziell validiert' },
    finding: { label: 'Rechercheergebnis', desc: 'Faktisch ermittelter Befund' },
    recommendation: { label: 'Empfohlen', desc: 'Architektur- oder Produktvorschlag' },
    open: { label: 'Offen – fachlich zu entscheiden', desc: 'Bedarf noch einer Klärung' },
    verify: { label: 'Technisch zu verifizieren', desc: 'Muss technisch geprüft werden' }
  },
  ru: {
    project_known: { label: 'Контекст проекта ProRiv', desc: 'Информация о проекте — еще не согласована заказчиком официально' },
    recommended: { label: 'Рекомендовано', desc: 'Архитектурное или продуктовое предложение нашей команды' },
    open_decision: { label: 'Открыто — требует решения', desc: 'Требует решения с сеньором или заказчиком' },
    technical_verify: { label: 'Требует тех. проверки', desc: 'Необходимо проверить как PoC или через Tripletex API' },
    externally_unverified: { label: 'Внешне не подтверждено', desc: 'Наблюдение без внешнего документального подтверждения' },
    confirmed: { label: 'Подтверждено', desc: 'Официально валидировано' },
    finding: { label: 'Результат анализа', desc: 'Фактический вывод исследования' },
    recommendation: { label: 'Рекомендовано', desc: 'Архитектурная рекомендация' },
    open: { label: 'Открыто — требует решения', desc: 'Требует решения' },
    verify: { label: 'Требует тех. проверки', desc: 'Требует проверки' }
  },
  bilingual: {
    project_known: { label: 'Контекст проекта / Projektkontext', desc: 'Bisherige Information – noch nicht offiziell abgenommen' },
    recommended: { label: 'Рекомендовано / Empfohlen', desc: 'Architekturvorschlag / Предложение команды' },
    open_decision: { label: 'Открыто / Offen – zu entscheiden', desc: 'Требует решения с сеньором / Offene Klärung' },
    technical_verify: { label: 'Тех. проверка / Technisch zu verifizieren', desc: 'PoC / API-Test gegen Tripletex' },
    externally_unverified: { label: 'Не подтверждено / Extern unbestätigt', desc: 'Beobachtung ohne Beleg / Наблюдение' },
    confirmed: { label: 'Подтверждено / Bestätigt', desc: 'Offiziell validiert / Валидировано' },
    finding: { label: 'Вывод / Rechercheergebnis', desc: 'Faktischer Befund / Вывод' },
    recommendation: { label: 'Рекомендовано / Empfohlen', desc: 'Empfehlung / Рекомендация' },
    open: { label: 'Открыто / Offen', desc: 'Offen / Открыто' },
    verify: { label: 'Проверить / Zu verifizieren', desc: 'Zu verifizieren / Проверить' }
  }
};

export const ORIGIN_LABELS: Record<Language, Record<KnowledgeOrigin, string>> = {
  de: {
    sketch: 'Originalskizze des Seniors',
    project_context: 'Bisherige Projektinformationen',
    event_storming: 'Event-Storming-Entwurf',
    competitor_research: 'Wettbewerbsrecherche',
    architecture_recommendation: 'Eigene Architektur-/Produkt-Empfehlung'
  },
  ru: {
    sketch: 'Оригинальный эскиз сеньора',
    project_context: 'Контекст проекта ProRiv',
    event_storming: 'Модель Event Storming',
    competitor_research: 'Анализ конкурентов',
    architecture_recommendation: 'Архитектурная рекомендация'
  },
  bilingual: {
    sketch: 'Эскиз сеньора / Originalskizze',
    project_context: 'Контекст ProRiv / Projektkontext',
    event_storming: 'Event Storming / Эвент-шторминг',
    competitor_research: 'Конкуренты / Wettbewerb',
    architecture_recommendation: 'Рекомендация / Empfehlung'
  }
};

export const PILOT_SCOPE_ITEMS: Record<Language, string[]> = {
  de: [
    'Wenige reale Mitarbeiter (Betonbohrer & Säger)',
    'Ein verantwortlicher Vorarbeiter',
    'Eine echte Baustelle (z. B. Kernbohr- & Sägeeinsatz)',
    'Begrenzte, definierte Arbeitsarten (Kernbohren, Wandsäge, Bodensäge)',
    'Plausible Zeiterfassung mit Clock-in Ausnahmebehandlung',
    'Ein vollständiger Arbeitsrapport von Erfassung bis Freigabe',
    'Prüfung der Übergabe an Tripletex (ERP-Schnittstelle)'
  ],
  ru: [
    'Несколько реальных рабочих (бурильщики и пильщики)',
    'Один ответственный бригадир',
    'Один реальный строительный объект (объект ProRiv)',
    'Ограниченный набор работ (алмазное бурение, нарезка швов, стенорезка)',
    'Прозрачный учет времени с обработкой исключений по GPS',
    'Один сквозной рапорт от стройплощадки до согласования',
    'Тестирование выгрузки данных в Tripletex ERP'
  ],
  bilingual: [
    'Несколько реальных рабочих / Wenige Mitarbeiter (Betonbohrer & Säger)',
    'Один ответственный бригадир / Ein verantwortlicher Vorarbeiter',
    'Один реальный объект ProRiv / Eine echte Baustelle',
    'Ограниченный набор работ (бурение, швы, стенорезка) / Definierte Arbeitsarten',
    'Учет времени с GPS-исключениями / Zeiterfassung mit Clock-in Ausnahmebehandlung',
    'Сквозной рапорт до согласования / Vollständiger Rapport bis Freigabe',
    'Тестирование выгрузки в Tripletex / Prüfung der Übergabe an Tripletex'
  ]
};

/**
 * Universal text resolution helper
 */
export function getDualText(de?: string, ru?: string, lang: Language = 'ru'): string {
  if (lang === 'ru') return ru || de || '';
  if (lang === 'de') return de || ru || '';
  // bilingual
  if (!ru || de === ru) return de || '';
  if (!de) return ru || '';
  return `${ru} [DE: ${de}]`;
}

export function getTranslation(key: keyof typeof UI_TEXT['de'], lang: Language = 'ru'): string {
  const dict = UI_TEXT[lang] || UI_TEXT.ru;
  return dict[key] || UI_TEXT.ru[key] || UI_TEXT.de[key] || '';
}
