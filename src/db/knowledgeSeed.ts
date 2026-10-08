/**
 * Knowledge Seed for Project ISA (ProRiv AS)
 * Contains actual domain findings, event storming models, competitor benchmarking,
 * architecture decisions, and open points to clarify with the Senior.
 */

import {
  TopicId,
  TopicContent,
  SeniorQuestion,
  ResearchFinding,
  CompetitorEntry,
  ProductRecommendation,
  OpenPoint,
  Decision,
  SeniorDecisionItem,
  DomainEventItem
} from '../types';

export const SEED_VERSION = 2;

export const MVP_STRATEGIC_STATEMENT = {
  quote: "Wir bauen kein zweites Dalux und kein neues Tripletex. Wir entwickeln eine schlanke Baustellen-Ausführungsschicht für ProRiv und integrieren bestehende Systeme.",
  pilotScope: [
    "Wenige reale Mitarbeiter (Betonbohrer & Säger)",
    "Ein verantwortlicher Vorarbeiter",
    "Eine echte Baustelle (z. B. Kernbohr- & Sägeeinsatz)",
    "Begrenzte, definierte Arbeitsarten (Kernbohren, Wandsäge, Bodensäge)",
    "Plausible Zeiterfassung mit Clock-in Ausnahmebehandlung",
    "Ein vollständiger Arbeitsrapport von Erfassung bis Freigabe",
    "Prüfung der Übergabe an Tripletex (ERP-Schnittstelle)"
  ]
};

export const SENIOR_DECISION_QUESTIONS: SeniorDecisionItem[] = [
  {
    id: 'sd-1',
    number: 1,
    question: 'Welche Berechtigungen haben Arbeiter, Vorarbeiter und Büro endgültig?',
    responsiblePerson: 'Senior Software Engineer / Product Owner',
    priority: 'high',
    status: 'in_diskussion',
    currentProposal: 'Serverseitige RBAC-Matrix: Arbeiter erfassen Zeiten/Aufmaß; Vorarbeiter prüfen GPS & geben Zeiten/Rapporte separat frei; Büro steuert Stammdaten, Preise & kaufmännische Freigabe.',
    rationale: 'Ohne feste Berechtigungsmatrix können Sicherheitsregeln im Backend nicht implementiert werden. Unsichtbare Buttons im UI reichen nicht.',
    date: '2026-10-08',
    connectedTopics: ['users']
  },
  {
    id: 'sd-2',
    number: 2,
    question: 'Welche Felder sind je Arbeitsart (Kernbohren, Bodensäge, Wandsäge) verpflichtend?',
    responsiblePerson: 'Fachbereich ProRiv / Senior',
    priority: 'high',
    status: 'offen',
    currentProposal: 'Kernbohren: Durchmesser (mm), Bohrtiefe (cm), Anzahl, Ausrichtung (Wand/Decke/Überkopf). Sägen: Schnitttiefe (cm), Schnittlänge (m).',
    rationale: 'Ermöglicht saubere Eingabemasken auf der Baustelle ohne Pflichtfeld-Überlastung des Arbeiters.',
    date: '2026-10-08',
    connectedTopics: ['raport']
  },
  {
    id: 'sd-3',
    number: 3,
    question: 'Darf ein Mitarbeiter bei fehlendem oder ungenauem GPS-Signal einstempeln?',
    responsiblePerson: 'Senior Software Engineer / ProRiv GF',
    priority: 'high',
    status: 'in_diskussion',
    currentProposal: 'Ja, Einstempeln wird nicht blockiert, erzeugt jedoch ein "ClockInExceptionRecorded"-Event zur manuellen Prüfung durch den Vorarbeiter.',
    rationale: 'Baustellen in Tiefgaragen, Kellern oder Betonschächten haben oft keinen GPS-Empfang. Blockieren würde die Arbeit aufhalten.',
    date: '2026-10-08',
    connectedTopics: ['vremya']
  },
  {
    id: 'sd-4',
    number: 4,
    question: 'Wer darf Arbeitszeiten und Sessions nachträglich korrigieren?',
    responsiblePerson: 'Senior Software Engineer',
    priority: 'medium',
    status: 'offen',
    currentProposal: 'Arbeiter vor der Einreichung; nach Einreichung nur Vorarbeiter/Büro mit dokumentiertem Änderungsgrund (Audit Trail).',
    rationale: 'Verhindert unbemerkte Stundenmanipulationen und schützt die Nachvollziehbarkeit bei Lohnprüfung.',
    date: '2026-10-08',
    connectedTopics: ['vremya', 'users']
  },
  {
    id: 'sd-5',
    number: 5,
    question: 'Wer darf Preise sehen und manuelle Preisänderungen (Overrides) vornehmen?',
    responsiblePerson: 'ProRiv Geschäftsleitung',
    priority: 'high',
    status: 'offen',
    currentProposal: 'Arbeiter sehen im MVP keine Preise. Vorarbeiter optional lesend. Nur Büro darf Preise anpassen oder Overrides definieren.',
    rationale: 'Auf der Baustelle steht die technische Mengenerfassung im Vordergrund, nicht die kaufmännische Preisfindung.',
    date: '2026-10-08',
    connectedTopics: ['users', 'raport']
  },
  {
    id: 'sd-6',
    number: 6,
    question: 'Welche Preisregel hat Vorrang: Standard, Kunde, Projekt oder manueller Override?',
    responsiblePerson: 'Senior Architect / Fachbereich',
    priority: 'high',
    status: 'in_diskussion',
    currentProposal: 'Hierarchie: 1. Manueller Override (mit Begründung) > 2. Projektspezifischer Preis > 3. Kundenrahmenvertrag > 4. Standard-Preisliste.',
    rationale: 'Eindeutige Rechenreihenfolge für den PriceSnapshot vor der Freigabe.',
    date: '2026-10-08',
    connectedTopics: ['raport']
  },
  {
    id: 'sd-7',
    number: 7,
    question: 'Ist eine Kundenunterschrift für jeden Rapport und für den Stundenexport zwingend erforderlich?',
    responsiblePerson: 'ProRiv Geschäftsleitung / Senior',
    priority: 'high',
    status: 'in_diskussion',
    currentProposal: 'Nein. Kundenunterschrift und ERP-Stundenexport sind entkoppelt. Kunden erhalten SMS/Mail-Reviewlink; Stunden fließen nach Vorarbeiterfreigabe.',
    rationale: 'Bauleiter der Kunden sind oft nicht vor Ort. Ein Koppeln würde den internen Abrechnungsprozess blockieren.',
    date: '2026-10-08',
    connectedTopics: ['raport', 'api']
  },
  {
    id: 'sd-8',
    number: 8,
    question: 'Welche Daten sollen im MVP tatsächlich nach Tripletex übertragen werden?',
    responsiblePerson: 'Senior Software Engineer / ERP-Spezialist',
    priority: 'high',
    status: 'in_diskussion',
    currentProposal: 'MVP-Fokus: Freigegebene Arbeitsstunden mit Mitarbeiter-, Projekt- und Aktivitätscode (Timesheet Entry). Rapporte als PDF-Referenz.',
    rationale: 'Reduziert Integrationsrisiko. Tripletex-API-Limits für Binärdaten/Fotos müssen erst getestet werden.',
    date: '2026-10-08',
    connectedTopics: ['api']
  },
  {
    id: 'sd-9',
    number: 9,
    question: 'Welche Systeme sind für Kunden-, Projekt- und Aktivitätsstammdaten führend?',
    responsiblePerson: 'Senior Architect',
    priority: 'medium',
    status: 'in_diskussion',
    currentProposal: 'Tripletex ist Master für Kunden, Hauptprojekte und Aktivitäten. ISA führt Baustellen (Sites), Geofences und Rapportpositionen.',
    rationale: 'Vermeidet doppelte Stammdatenpflege und Stammdaten-Inkonsistenzen in der Buchhaltung.',
    date: '2026-10-08',
    connectedTopics: ['clients', 'api']
  },
  {
    id: 'sd-10',
    number: 10,
    question: 'Wie behandeln wir Korrekturen nach bereits erfolgter Freigabe oder ERP-Export?',
    responsiblePerson: 'Senior Software Engineer',
    priority: 'high',
    status: 'offen',
    currentProposal: 'Freigegebene Objekte werden nicht mutiert, sondern erzeugen eine versionierte Revision (WorkReportRevision) mit Storno-/Nachbuchungsmuster.',
    rationale: 'Auditierbarkeit und Verhinderung von asynchronen Doppelbuchungen in Tripletex.',
    date: '2026-10-08',
    connectedTopics: ['raport', 'api', 'vremya']
  }
];

export const DOMAIN_EVENTS_LIST: DomainEventItem[] = [
  {
    id: 'de-1',
    name: 'WorkSessionStarted',
    category: 'Session & Zeit',
    description: 'Arbeiter stempelt auf Baustelle ein. Zeitstempel und GPS-Messung werden erfasst.',
    command: 'StartWorkSession',
    aggregate: 'WorkSession',
    readModel: 'ActiveSessionsPerSite',
    policyOrRule: 'Plausibilitätsprüfung gegen Site-Geofence',
    openDecision: 'Blockieren oder Warnung bei Geofence-Abweichung?'
  },
  {
    id: 'de-2',
    name: 'ClockInExceptionRecorded',
    category: 'Session & Zeit',
    description: 'Ausnahme erfasst: GPS fehlt, ungenau (>100m) oder außerhalb des Geofence.',
    command: 'RecordClockInException',
    aggregate: 'WorkSession',
    readModel: 'ForemanReviewQueue',
    policyOrRule: 'Ausnahme wird dem Vorarbeiter zur manuellen Sichtung markiert',
    openDecision: 'Toleranzradius für Baustellen-Geofence festlegen'
  },
  {
    id: 'de-3',
    name: 'WorkSessionStopped',
    category: 'Session & Zeit',
    description: 'Arbeiter beendet Arbeitssitzung. Bruttozeit wird berechnet.',
    command: 'StopWorkSession',
    aggregate: 'WorkSession',
    readModel: 'DailyWorkerSessionSummary',
    policyOrRule: 'Erzeugt Vorschlag für TimesheetEntry',
    openDecision: 'Automatische Pausenabzüge definieren'
  },
  {
    id: 'de-4',
    name: 'TimesheetSubmitted',
    category: 'Session & Zeit',
    description: 'Arbeitszeiteintrag wird zur Prüfung an den Vorarbeiter eingereicht.',
    command: 'SubmitTimesheet',
    aggregate: 'TimesheetEntry',
    readModel: 'PendingTimesheetApprovals',
    policyOrRule: 'Arbeiter kann Zeit nicht mehr direkt bearbeiten',
    openDecision: 'Frist für wöchentliche Zeiteinreichung'
  },
  {
    id: 'de-5',
    name: 'TimesheetCorrectionRequested',
    category: 'Session & Zeit',
    description: 'Vorarbeiter fordert Korrektur an (z. B. unklare Reisezeit oder Abweichung).',
    command: 'RequestTimesheetCorrection',
    aggregate: 'TimesheetEntry',
    readModel: 'WorkerCorrectionTasks',
    policyOrRule: 'Status wechselt auf CorrectionRequested, Kommentar ist Pflicht',
    openDecision: 'Darf Vorarbeiter Zeiten direkt überschreiben?'
  },
  {
    id: 'de-6',
    name: 'TimesheetApproved',
    category: 'Session & Zeit',
    description: 'Vorarbeiter gibt Arbeitsstunden fachlich frei.',
    command: 'ApproveTimesheet',
    aggregate: 'TimesheetEntry',
    readModel: 'ApprovedHoursForExport',
    policyOrRule: 'Stunden sind bereit für Tripletex-Warteschlange',
    openDecision: 'Zusätzliche Büro-Zweitfreigabe erforderlich?'
  },
  {
    id: 'de-7',
    name: 'WorkReportCreated',
    category: 'Rapport & Aufmaß',
    description: 'Arbeitsrapport mit Projekt, Baustelle und Datum initialisiert.',
    command: 'CreateWorkReport',
    aggregate: 'WorkReport',
    readModel: 'DraftReportsList',
    policyOrRule: 'Eindeutige Client-generierte UUID für Offline-Fähigkeit',
    openDecision: 'Kopplung mit aktiver WorkSession als Vorschlag'
  },
  {
    id: 'de-8',
    name: 'WorkReportSubmitted',
    category: 'Rapport & Aufmaß',
    description: 'Rapport mit erfassten Bohr-/Sägemengen und Fotos eingereicht.',
    command: 'SubmitWorkReport',
    aggregate: 'WorkReport',
    readModel: 'ForemanReportReviewQueue',
    policyOrRule: 'Mindestens eine Position und Plausibilitätscheck erforderlich',
    openDecision: 'Fotopflicht für Bohrungen oder Regiearbeiten?'
  },
  {
    id: 'de-9',
    name: 'WorkReportCorrectionRequested',
    category: 'Rapport & Aufmaß',
    description: 'Vorarbeiter oder Büro beanstandet Maße oder fehlende Angaben.',
    command: 'RequestReportCorrection',
    aggregate: 'WorkReport',
    readModel: 'WorkerReportRevisions',
    policyOrRule: 'Rapport geht zurück an Ersteller mit Änderungshinweis',
    openDecision: 'Wer darf Korrekturen bei abwesendem Arbeiter vornehmen?'
  },
  {
    id: 'de-10',
    name: 'WorkReportApproved',
    category: 'Rapport & Aufmaß',
    description: 'Vorarbeiter validiert technische Richtigkeit des Rapports.',
    command: 'ApproveWorkReport',
    aggregate: 'WorkReport',
    readModel: 'ApprovedReportsOverview',
    policyOrRule: 'Gibt Rapport für Kunden-Review und Büro-Pricing frei',
    openDecision: 'Automatische Benachrichtigung an Büro'
  },
  {
    id: 'de-11',
    name: 'PriceSnapshotLocked',
    category: 'Preis & Kunde',
    description: 'Preise, Zuschläge und Rabatte werden unveränderlich fixiert.',
    command: 'LockPriceSnapshot',
    aggregate: 'WorkReport',
    readModel: 'BilledReportsList',
    policyOrRule: 'Preis darf nicht mehr dynamisch nachberechnet werden',
    openDecision: 'Genaue Hierarchie der Preislistenregeln'
  },
  {
    id: 'de-12',
    name: 'CustomerReviewLinkSent',
    category: 'Preis & Kunde',
    description: 'Zeitlich begrenzter Magic Link wird an Kundenkontakt per SMS/Mail gesendet.',
    command: 'SendCustomerReviewLink',
    aggregate: 'WorkReport',
    readModel: 'CustomerPendingReviews',
    policyOrRule: 'Token läuft nach X Tagen ab, kein permanentes Kundenkonto nötig',
    openDecision: 'Gültigkeitsdauer des Links (z. B. 7 oder 14 Tage)'
  },
  {
    id: 'de-13',
    name: 'CustomerReportConfirmed',
    category: 'Preis & Kunde',
    description: 'Kunde öffnet Link und bestätigt ausgeführte Arbeiten.',
    command: 'ConfirmReportByCustomer',
    aggregate: 'WorkReport',
    readModel: 'CustomerConfirmedReports',
    policyOrRule: 'Zeitstempel, IP und Bestätigungsflag werden dokumentiert',
    openDecision: 'Reicht einfache Bestätigung oder digitale Signatur?'
  },
  {
    id: 'de-14',
    name: 'CustomerReportSigned',
    category: 'Preis & Kunde',
    description: 'Kunde leistet digitale Unterschrift auf dem mobilen Gerät oder im Web.',
    command: 'SignReportByCustomer',
    aggregate: 'WorkReport',
    readModel: 'SignedReportsArchive',
    policyOrRule: 'Signatur-Bitmap wird gesichert in S3 abgelegt',
    openDecision: 'Unterschrift vor Ort auf Arbeiter-Gerät vs. Web-Link'
  },
  {
    id: 'de-15',
    name: 'CustomerReportRejected',
    category: 'Preis & Kunde',
    description: 'Kunde lehnt Rapport oder einzelne Mengen ab mit Begründung.',
    command: 'RejectReportByCustomer',
    aggregate: 'WorkReport',
    readModel: 'DisputedReportsQueue',
    policyOrRule: 'Warnung an Büro & Vorarbeiter; Klärungsfall eröffnet',
    openDecision: 'Teilfreigabe einzelner Positionen zulassen?'
  },
  {
    id: 'de-16',
    name: 'TripletexExportQueued',
    category: 'ERP & Tripletex',
    description: 'Freigegebener Datensatz wird in die Export-Warteschlange eingereiht.',
    command: 'QueueTripletexExport',
    aggregate: 'IntegrationJob',
    readModel: 'ExportMonitoringDashboard',
    policyOrRule: 'Idempotenz-Schlüssel wird vergeben',
    externalSystem: 'Tripletex API',
    openDecision: 'Sofortiger Export vs. nächtlicher Batch-Lauf'
  },
  {
    id: 'de-17',
    name: 'TripletexExportSucceeded',
    category: 'ERP & Tripletex',
    description: 'Tripletex bestätigt erfolgreiche Übernahme der Stunden/Daten.',
    command: 'CompleteTripletexExport',
    aggregate: 'IntegrationJob',
    readModel: 'SynchronizedRecords',
    policyOrRule: 'Externe Tripletex-ID wird auf Datensatz gespeichert',
    externalSystem: 'Tripletex API',
    openDecision: 'Welche Rückmeldedaten in ISA persistiert werden'
  },
  {
    id: 'de-18',
    name: 'TripletexExportFailed',
    category: 'ERP & Tripletex',
    description: 'Export schlägt fehl (Netzwerk, Token ungültig, Validierungsfehler).',
    command: 'FailTripletexExport',
    aggregate: 'IntegrationJob',
    readModel: 'FailedExportsAlerts',
    policyOrRule: 'Fachliche Freigabe bleibt bestehen! Retry-Mechanismus greift',
    externalSystem: 'Tripletex API',
    openDecision: 'Automatischer Retry-Intervall und Alarmierung'
  }
];

export const INITIAL_COMPETITORS: CompetitorEntry[] = [
  {
    id: 'comp-smartdok',
    topicId: 'vremya',
    additionalTopicIds: ['users', 'clients'],
    productName: 'SmartDok',
    analyzedFeature: 'Baustellenzeiterfassung, Vorarbeiter-Freigaben, Geofencing',
    investigationGoal: 'Wie löst der norwegische Marktführer Zeiterfassung und Geofences auf Baustellen?',
    observedWorkflow: 'Arbeiter stempelt via mobiler App ein; Vorarbeiter sieht Mannschaftsübersicht; Geofence validiert Einsatzort; Freigabepfad vor Lohnexport.',
    keyTakeaway: 'Vorbild für norwegische Baustellenprozesse. Getrennte Ansichten für Arbeiter und Vorarbeiter schaffen Klarheit.',
    disadvantages: 'Umfangreiches Großsystem, für reine Bohr- & Sägespezialisten oft überdimensioniert und teuer.',
    sourceOrLink: '',
    transferability: 'Sehr hoch für den Session-Ablauf und die Geofence-Plausibilisierung in ISA.',
    origin: 'competitor_research',
    status: 'externally_unverified',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'comp-finkzeit',
    topicId: 'vremya',
    additionalTopicIds: ['raport'],
    productName: 'FinkZeit',
    analyzedFeature: 'Trennung von Arbeitszeit, Auftragszeit und Tätigkeiten',
    investigationGoal: 'Wie wird Anwesenheitszeit sauber von produktiver Auftragszeit getrennt?',
    observedWorkflow: 'Einstempeln in Tagesschicht, anschließendes Zuordnen von Tätigkeiten (Bohren, Sägen, Rüstzeit, Reisetid).',
    keyTakeaway: 'Strikte Trennung von Anwesenheit (WorkSession) und Auftragsaufwand (Timesheet/Report) verhindert Abrechnungsfehler.',
    disadvantages: 'Kann zu höherem Erfassungsaufwand führen, wenn Arbeiter jeden Teilschritt einzeln erfassen müssen.',
    sourceOrLink: '',
    transferability: 'Architektonisches Leitbild für unsere Datenmodelltrennung in ISA.',
    origin: 'competitor_research',
    status: 'externally_unverified',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'comp-qbtime',
    topicId: 'vremya',
    additionalTopicIds: ['users'],
    productName: 'QuickBooks Time',
    analyzedFeature: 'GPS-Zeiterfassung und dokumentierte Ausnahmebehandlung',
    investigationGoal: 'Wie geht das System mit fehlerhaftem oder verweigertem GPS-Signal um?',
    observedWorkflow: 'Clock-in erfolgt mit Standortabgleich; bei Signalverlust oder Distanz zum Geofence wird Eintrag mit Flag markiert, aber nicht blockiert.',
    keyTakeaway: 'Niemals den Arbeiter vor Ort blockieren. Ausnahmen als Prüfaufgabe für den Vorarbeiter markieren.',
    disadvantages: 'In Europa datenschutzrechtlich sensibel bei permanentem Tracking.',
    sourceOrLink: '',
    transferability: 'Exakt dieses Ausnahmemuster (ClockInExceptionRecorded) übernehmen wir für ProRiv.',
    origin: 'competitor_research',
    status: 'externally_unverified',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'comp-dalux',
    topicId: 'mobile-app',
    additionalTopicIds: ['raport'],
    productName: 'Dalux',
    analyzedFeature: 'Offline-Baustellenarbeit, Foto-Dokumentation und Pläne',
    investigationGoal: 'Wie stabil sind Offline-Dokumentation und Medien-Uploads unter realen Baustellenbedingungen?',
    observedWorkflow: 'Lokale Speicherung von Aufgaben und Fotos auf dem Endgerät; asynchrone Warteschlange bei Wiederverbindung.',
    keyTakeaway: 'Offline-First ist für Baustellen essenziell. Uploads müssen im Hintergrund mit Fortschrittsanzeige laufen.',
    disadvantages: 'Sehr komplex, Fokus liegt auf 3D/BIM und großen Generalunternehmern.',
    sourceOrLink: '',
    transferability: 'Für ISA übernehmen wir das robuste lokale Queue-Muster (SQLite + S3 Uploads).',
    origin: 'competitor_research',
    status: 'externally_unverified',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'comp-planradar',
    topicId: 'raport',
    additionalTopicIds: ['mobile-app'],
    productName: 'PlanRadar',
    analyzedFeature: 'Strukturierte mobile Formulare und Baudokumentation',
    investigationGoal: 'Wie werden spezifische Handwerkerberichte mobil und touch-optimiert erfasst?',
    observedWorkflow: 'Vordefinierte Auswahllisten, Pflichtfelder für Maße und direkte Kamera-Anbindung mit Annotationen.',
    keyTakeaway: 'Formulare müssen extrem simpel mit großen Touch-Zielen für Handschuhe/Baustelle gestaltet sein.',
    disadvantages: 'Eigenständiges Ticketsystem, keine native Integration in norwegische Lohn- und ERP-Systeme wie Tripletex.',
    sourceOrLink: '',
    transferability: 'Gestaltung der Kernbohr- und Sägemasken in React Native.',
    origin: 'competitor_research',
    status: 'externally_unverified',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'comp-fieldwire',
    topicId: 'raport',
    additionalTopicIds: ['clients'],
    productName: 'Fieldwire',
    analyzedFeature: 'Baustellenaufgaben und schnelle Felderfassung',
    investigationGoal: 'Wie gelingt eine intuitive Projekt- und Aufgabenwahl für gewerbliche Mitarbeiter?',
    observedWorkflow: 'Schnellauswahl aus Projektliste, Zuordnung von Einsatzberichten und Statusanzeige.',
    keyTakeaway: 'Arbeiter muss mit maximal zwei Klicks sein Projekt und die Baustelle auswählen können.',
    disadvantages: 'Starker US-Fokus, wenig Bezug zu norwegischen Gewerken und Regieabrechnungen.',
    sourceOrLink: '',
    transferability: 'Führung des Arbeiters im UI: Schnellauswahl der Baustelle.',
    origin: 'competitor_research',
    status: 'externally_unverified',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'comp-tripletex',
    topicId: 'api',
    additionalTopicIds: ['clients', 'vremya'],
    productName: 'Tripletex',
    analyzedFeature: 'ERP, Projekte, Aktivitäten, Zeiterfassung und Buchhaltung',
    investigationGoal: 'Welche Schnittstellen und Datenstrukturen bietet das Zielsystem von ProRiv?',
    observedWorkflow: 'Kaufmännische Verwaltung von Kunden, Projekten und Stunden; Abrechnung und Lohnvorbereitung.',
    keyTakeaway: 'Tripletex ist das kaufmännische Nervenzentrum von ProRiv. ISA muss als Ausführungsschicht andocken, nicht konkurrieren.',
    disadvantages: 'Standard-Web/App ist nicht auf spezifische Bohr- und Sägemengen auf der Baustelle optimiert.',
    sourceOrLink: '',
    transferability: 'Kern des API-Adapters für Stunden- und Stammdatenabgleich.',
    origin: 'project_context',
    status: 'technical_verify',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  }
];

export const INITIAL_RESEARCH_FINDINGS: ResearchFinding[] = [
  // USERS
  {
    id: 'f-users-1',
    topicId: 'users',
    title: 'Rollenmodell: Arbeiter, Vorarbeiter, Büro/Admin und Kunde',
    content: 'Aus dem Projektkontext ProRiv AS kristallisieren sich 4 Hauptrollen heraus: Arbeiter (erfasst Zeiten, Bohrungen/Schnitte, Maße, Fotos); Vorarbeiter (prüft GPS-Auffälligkeiten, gibt Zeiten & Rapporte getrennt frei); Büro/Admin (Stammdaten, Preise, Tripletex-Exportüberwachung); Kunde (sieht freigegebene Rapporte via Review-Link).',
    origin: 'project_context',
    status: 'project_known',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-users-2',
    topicId: 'users',
    title: 'Fachliche Trennung: Stundenfreigabe vs. Rapportfreigabe',
    content: 'WICHTIGE ERKENNTNIS: Arbeitszeitfreigabe (für Lohn/Tripletex) und Rapportfreigabe (für Kundenabrechnung & Aufmaß) sind fachlich getrennte Prozesse. Ein Vorarbeiter kann Zeiten freigeben, während ein Rapport wegen fehlender Maßangaben noch in Korrektur ist.',
    origin: 'event_storming',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-users-3',
    topicId: 'users',
    title: 'Kundenrolle: Kein permanentes Kundenkonto im MVP nötig',
    content: 'Als schlanke Lösung erhält der Bauleiter/Kunde einen zeitlich begrenzten Magic-Link per SMS oder E-Mail. Er kann den Rapport prüfen, digital abzeichnen oder ablehnen, ohne sich in einem komplexen Portal registrieren zu müssen.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },

  // CLIENTS
  {
    id: 'f-clients-1',
    topicId: 'clients',
    title: 'Strikte Trennung: Customer → Project → Site',
    content: 'Kunde, Projekt und Baustelle (Site) dürfen im Datenmodell nicht vermischt werden. Ein Kunde hat mehrere Projekte; ein Projekt kann mehrere Baustellen/Einsatzorte haben. Nur die konkrete Baustelle (Site) besitzt GPS-Koordinaten und Geofences.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-clients-2',
    topicId: 'clients',
    title: 'Eindeutige interne IDs und separate externe Tripletex-IDs',
    content: 'Alle Entitäten in ISA verwenden eigene UUIDs. Externe Tripletex-IDs werden als separate Zuordnungsfelder gespeichert. So bleibt ISA offline-fähig und unabhängig von ERP-Migrationszyklen.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },

  // RAPORT
  {
    id: 'f-raport-1',
    topicId: 'raport',
    title: 'Gewerkespezifische Hauptarbeitsarten für ProRiv',
    content: '1. Kernbohren (Bohrdurchmesser mm, Bohrtiefe/Bauteildicke cm, Anzahl, Ausrichtung: Wand / Decke/Bodenplatte / Überkopf).\n2. Bodensäge (Schnitttiefe cm, Schnittlänge m, Anzahl).\n3. Wandsäge / Handsäge (Schnitttiefe cm, Schnittlänge m, Verfahren).',
    origin: 'project_context',
    status: 'project_known',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-raport-2',
    topicId: 'raport',
    title: 'Katalog möglicher Zusatzleistungen & Zuschläge',
    content: 'Transport, Baustelleneinrichtung / Rüsten, Hebebühne, Pilotbohrung, Hilfsarbeiter, zusätzliche Regiestunden, Trockenbohren, Granit / Asphalt, Massivholz, starke Bewehrung, Überkopfarbeiten. Pflichtfelder müssen noch mit ProRiv bestätigt werden.',
    origin: 'project_context',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-raport-3',
    topicId: 'raport',
    title: 'PriceSnapshot & Revisionslogik',
    content: 'Ein freigegebener Rapport friert alle Preise im PriceSnapshot ein. Nachträgliche Korrekturen erzeugen eine neue versionierte Revision (WorkReportRevision) mit Audit-Grund. Kein unbemerktes Überschreiben im ERP.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },

  // VREMYA
  {
    id: 'f-vremya-1',
    topicId: 'vremya',
    title: 'Zentrale Architektur-Erkenntnis: Trennung dreier Objekte',
    content: '1. WorkSession: Wann wurde tatsächlich ein- und ausgestempelt? (technische Anwesenheit).\n2. TimesheetEntry: Welche Stunden werden zur Lohnprüfung und Tripletex gemeldet? (Abrechnungszeit).\n3. WorkReport: Welche konkreten Bohr-/Sägearbeiten wurden ausgeführt? (Aufmaß/Leistung).\nDiese drei Objekte dürfen niemals zu einem einzigen Datensatz verschmolzen werden.',
    origin: 'event_storming',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-vremya-2',
    topicId: 'vremya',
    title: 'GPS-Grundsatz & Ausnahmebehandlung',
    content: 'GPS dient der Plausibilisierung beim Clock-in, nicht als automatische Lohnkürzung oder Dauerüberwachung. Bei fehlendem Signal oder Geofence-Abweichung wird der Clock-in nicht blockiert, sondern ein "ClockInExceptionRecorded"-Event zur Vorarbeiterprüfung erzeugt.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-vremya-3',
    topicId: 'vremya',
    title: 'Norwegisches Datenschutz- und Arbeitsrecht beachten',
    content: 'Mitarbeiter-Standortdaten unterliegen strengen norwegischen Datenschutz- und Arbeitsrechtsvorgaben (Datatilsynet). Permanentes Tracking ist unzulässig. Punktuelles Clock-in-GPS muss transparent und rechtlich geprüft sein.',
    origin: 'project_context',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },

  // API
  {
    id: 'f-api-1',
    topicId: 'api',
    title: 'Systemlandschaft: AppSheet (Ist) → ISA → Tripletex (ERP)',
    content: 'ProRiv nutzt aktuell AppSheet für Rapporte und Tripletex für Buchhaltung und Stunden. ISA ersetzt die AppSheet-Rapporterfassung durch eine moderne maßgeschneiderte Lösung und übergibt freigegebene Daten per Adapter an Tripletex.',
    origin: 'project_context',
    status: 'project_known',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-api-2',
    topicId: 'api',
    title: 'Integrationsarchitektur & Idempotenz',
    content: 'React Native App → Eigene Work API → PostgreSQL. Tripletex-Adapter mit idempotenten Aufrufen (Idempotency Key). Mehrfaches Senden erzeugt niemals doppelte Stundeneinträge im ERP.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-api-3',
    topicId: 'api',
    title: 'PDF-Berichte vs. Medienübergabe an Tripletex',
    content: 'Es ist noch technisch zu verifizieren, ob Tripletex vollständige Rapport-PDFs und Baustellenfotos per API aufnehmen kann. Vorläufige Empfehlung: Fotos in AWS S3 speichern und Referenz/Link an Tripletex übergeben.',
    origin: 'project_context',
    status: 'technical_verify',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },

  // MOBILE APP
  {
    id: 'f-app-1',
    topicId: 'mobile-app',
    title: 'Architekturvorgaben aus der Originalskizze: React Native, AWS Cognito, AWS S3',
    content: 'Die Originalskizze des Seniors spezifiziert ausdrücklich: React Native als Frontend, AWS Cognito für Benutzer- und Sitzungsauthentifizierung sowie AWS Storage S3 für Medien und Fotos. Diese Kerntechnologien bleiben uneingeschränkt erhalten.',
    origin: 'sketch',
    status: 'project_known',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-app-2',
    topicId: 'mobile-app',
    title: 'Offline-First mit lokaler SQLite & asynchroner Queue',
    content: 'Betonbohrer und Säger arbeiten regelmäßig in Tiefgaragen und Kellern ohne Mobilfunknetz. Alle Eingaben werden lokal in SQLite gespeichert und bei Netzrückkehr synchronisiert. Presigned URLs für direkte S3-Uploads.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'f-app-3',
    topicId: 'mobile-app',
    title: 'MVP-Grenzen: Was gehört NICHT in den ersten Release',
    content: 'Kein vollständiges Bau-ERP, keine Finanzbuchhaltung, keine BIM-3D-Viewer, kein permanentes GPS-Tracking, keine universelle Workflow-Engine, kein Flottenmanagement. Fokus rein auf: Erfassen, Freigeben, Übergeben.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  }
];

export const INITIAL_PRODUCT_RECOMMENDATIONS: ProductRecommendation[] = [
  {
    id: 'rec-users-1',
    topicId: 'users',
    title: 'Serverseitige rollenbasierte Zugriffskontrolle (RBAC)',
    description: 'Berechtigungen müssen zwingend auf Backend-Ebene validiert werden. Ausgeblendete Buttons im React-Native-Client stellen keinen Zugriffsschutz dar.',
    rationale: 'Schutz von Preisdaten und Verhinderung von unberechtigten Rapportfreigaben.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    priority: 'high',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'rec-clients-1',
    topicId: 'clients',
    title: 'Hierarchische Entitätstrennung: Customer → Project → Site',
    description: 'Saubere Datenmodellierung mit separaten UUIDs und getrennter Pflege von Baustellen-Geofences.',
    rationale: 'Kunde, Projekt und Baustelle dürfen für GPS und Tripletex nicht vermengt werden.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    priority: 'high',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'rec-raport-1',
    topicId: 'raport',
    title: 'Statuskette mit Revisionssicherheit & getrennter Kundenprüfung',
    description: 'Draft → Submitted → ForemanApproved → OfficeApproved. Bei Korrektur: Submitted → CorrectionRequested → Revised. PriceSnapshot friert Preise ein.',
    rationale: 'Verhindert unbemerkte Preisänderungen nach dem Kunden-Review.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    priority: 'high',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'rec-vremya-1',
    topicId: 'vremya',
    title: 'Punktuelles Clock-In GPS mit Ausnahmepfad statt Dauerortung',
    description: 'Kein Hintergrund-Tracking. GPS nur bei Arbeitsbeginn/Ende prüfen. Bei Abweichung: Eintrag mit Prüfflag für den Vorarbeiter.',
    rationale: 'Akkuschonend, DSGVO-konform und robust bei Kellereinsätzen.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    priority: 'high',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'rec-api-1',
    topicId: 'api',
    title: 'Entkopplung von Fachfreigabe und ERP-Exportstatus',
    description: 'Ein Rapport kann fachlich freigegeben sein, während der Tripletex-Export noch ansteht oder fehlgeschlagen ist. Fehlgeschlagener Export darf Freigabe nicht stornieren.',
    rationale: 'Verhindert Deadlocks und Inkonsistenzen bei temporären API-Ausfällen.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    priority: 'high',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'rec-app-1',
    topicId: 'mobile-app',
    title: 'Offline-First Architektur auf React Native + SQLite',
    description: 'Lokale Transaktionen auf dem Endgerät mit idempotenter Synchronisation gegen die Work API und direkten S3-Uploads.',
    rationale: 'Arbeitsfähigkeit bei unterbrochener Mobilfunkverbindung auf Betonbaustellen.',
    origin: 'architecture_recommendation',
    status: 'recommended',
    priority: 'high',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  }
];

export const INITIAL_OPEN_POINTS: OpenPoint[] = [
  {
    id: 'op-users-1',
    topicId: 'users',
    question: 'Darf der Arbeiter oder Vorarbeiter Preise in der mobilen App einsehen oder anpassen?',
    clarifyWith: 'customer',
    priority: 'high',
    isResolved: false,
    origin: 'project_context',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'op-clients-1',
    topicId: 'clients',
    question: 'Ist Tripletex das führende System für Kunden- und Projektstammdaten oder darf ISA Kunden anlegen?',
    clarifyWith: 'senior',
    priority: 'high',
    isResolved: false,
    origin: 'project_context',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'op-clients-2',
    topicId: 'clients',
    question: 'Wie gehen wir mit Noteinsätzen ohne vorab bekannte Baustellenadresse um?',
    clarifyWith: 'customer',
    priority: 'medium',
    isResolved: false,
    origin: 'project_context',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'op-raport-1',
    topicId: 'raport',
    question: 'Muss jeder Rapport zwingend vom Kunden digital gegengezeichnet werden, bevor Stunden abgerechnet werden?',
    clarifyWith: 'customer',
    priority: 'high',
    isResolved: false,
    origin: 'event_storming',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'op-raport-2',
    topicId: 'raport',
    question: 'Welche genauen Pflichtfelder und Fotos sind für Bohr- und Sägearbeiten zwingend erforderlich?',
    clarifyWith: 'customer',
    priority: 'medium',
    isResolved: false,
    origin: 'project_context',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'op-vremya-1',
    topicId: 'vremya',
    question: 'Rechtliche Klärung der norwegischen Datenschutz- und Arbeitsrechtsanforderungen für Clock-In Standortdaten.',
    clarifyWith: 'customer',
    priority: 'high',
    isResolved: false,
    origin: 'project_context',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'op-api-1',
    topicId: 'api',
    question: 'Können vollständige Arbeitsrapport-PDFs und Fotos über die Tripletex-API des ProRiv-Kontos übertragen werden?',
    clarifyWith: 'team',
    priority: 'high',
    isResolved: false,
    origin: 'project_context',
    status: 'technical_verify',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'op-app-1',
    topicId: 'mobile-app',
    question: 'Auswahl der AWS-Region für ProRiv (z. B. eu-north-1 Stockholm) und Festlegung der Backup-Aufbewahrungsfristen.',
    clarifyWith: 'senior',
    priority: 'medium',
    isResolved: false,
    origin: 'architecture_recommendation',
    status: 'open_decision',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  }
];

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'dec-1',
    topicId: 'vremya',
    title: 'Dreiteilung der Zeit- und Leistungsdatenmodelle',
    date: '2026-10-08',
    rationale: 'WorkSession (Anwesenheit/Stempeln), TimesheetEntry (Abrechnungsstunden) und WorkReport (Aufmaß/Mengen) werden als eigenständige Entitäten modelliert. Keine Vermischung in einem monolithischen Datensatz.',
    responsiblePerson: 'Senior Software Architect',
    status: 'decided',
    origin: 'event_storming',
    decisionStatus: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'dec-2',
    topicId: 'mobile-app',
    title: 'Beibehaltung der Core-Technologien aus der Originalskizze',
    date: '2026-10-08',
    rationale: 'Verbindliche Festlegung auf React Native, AWS Cognito und AWS S3 gemäß Skizze des Seniors. Keine stillschweigende Ersetzung durch Dritt-BaaS-Plattformen.',
    responsiblePerson: 'Senior Software Engineer',
    status: 'decided',
    origin: 'sketch',
    decisionStatus: 'project_known',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'dec-3',
    topicId: 'api',
    title: 'Entkopplung von Fachfreigabe und ERP-Exportstatus',
    date: '2026-10-08',
    rationale: 'Fachliche Freigaben in ISA sind unabhängig vom Netzwerk- oder Übertragungsstatus der Tripletex-Schnittstelle. Exportjobs laufen asynchron über idempotente Queues.',
    responsiblePerson: 'Lead Developer',
    status: 'decided',
    origin: 'architecture_recommendation',
    decisionStatus: 'recommended',
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z'
  }
];
