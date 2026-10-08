import { TopicId, TopicMeta, SeniorQuestion } from '../types';

export const TOPIC_DEFINITIONS: Record<TopicId, TopicMeta> = {
  'mobile-app': {
    id: 'mobile-app',
    sketchTitle: 'MOBILE APP',
    sketchSubtitle: 'REACT NATIVE · AWS COGNITO · AWS STORAGE S3',
    germanTitle: 'Mobile Anwendung & Technische Architektur',
    shortDescription: 'Frontend-Architektur, Frameworks, Authentifizierung via AWS Cognito und Cloud-Storage via S3.',
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
    }
  },
  'users': {
    id: 'users',
    sketchTitle: 'USERS',
    germanTitle: 'Benutzer und Rollen',
    shortDescription: 'Benutzertypen, Verantwortlichkeiten, hierarchische Beziehungen und Rechteverwaltung (RBAC).',
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
      findingsSummary: 'Vier Rollen identifiziert: Arbeiter (Zeiten, Bohrungen/Schnitte, Fotos erfassen); Vorarbeiter (GPS-Ausnahmen prüfen, Stunden und Rapporte separat freigeben); Büro/Admin (Preise, Stammdaten, Tripletex-Überwachung); Kunde (sieht freigegebenen Rapport per Magic-Link).',
      competitorSummary: 'SmartDok und QuickBooks Time trennen Arbeiter-Erfassung und Vorarbeiter-Freigabe strikt. Arbeiter sehen in der Regel keine kaufmännischen Preise.',
      recommendationSummary: 'Serverseitiges RBAC. Ausgeblendete Buttons im UI reichen nicht. Stundenfreigabe und Rapportfreigabe müssen fachlich unabhängig bleiben.',
      openSummary: 'Darf der Arbeiter Preise sehen? Darf der Vorarbeiter Preise ändern? Wer darf freigegebene Rapporte wieder öffnen?'
    }
  },
  'clients': {
    id: 'clients',
    sketchTitle: 'KLIENTS',
    germanTitle: 'Kunden, Projekte und Baustellen',
    shortDescription: 'Kundenstammdaten, Bauobjekte, Objekttypologien und Statusmodelle im Lebenszyklus.',
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
    }
  },
  'raport': {
    id: 'raport',
    sketchTitle: 'RAPORT',
    germanTitle: 'Arbeitsrapporte',
    shortDescription: 'Erfassung, Zugriffsberechtigungen, Statusflow, Typen, Datenexport und Foto-/Dateianhänge.',
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
      findingsSummary: 'Kernarbeitsarten für ProRiv: Kernbohren (Durchmesser mm, Tiefe cm, Anzahl, Wand/Decke/Überkopf), Bodensäge (Tiefe cm, Länge m), Wandsäge. Katalog von Zusatzleistungen (Rüsten, Hebebühne, Bewehrung). Revisionssicherer PriceSnapshot bei Freigabe.',
      competitorSummary: 'PlanRadar und Dalux bieten touch-optimierte Formulare. Freigegebene Rapporte werden niemals direkt überschrieben, sondern erzeugen versionierte Revisionen.',
      recommendationSummary: 'Statuspfad: Draft → Submitted → ForemanApproved → OfficeApproved (Korrekturschleife: CorrectionRequested → Revised). Entkoppelte Kundenprüfung per zeitlich begrenztem Link. Foto-Uploads via AWS S3.',
      openSummary: 'Welche Felder und Fotos sind pro Arbeitsart zwingend erforderlich? Muss jeder Rapport vor dem Lohnexport vom Kunden unterschrieben sein?'
    }
  },
  'vremya': {
    id: 'vremya',
    sketchTitle: 'VREMYA',
    germanTitle: 'Zeiterfassung und GPS',
    shortDescription: 'Zeiterfassungslogik, Bedingungen, Markt- und Wettbewerbsvergleich sowie Notwendigkeit von Geolokalisierung.',
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
    }
  },
  'api': {
    id: 'api',
    sketchTitle: 'API, chto kuda otpravlyaem ?',
    germanTitle: 'Schnittstellen und Synchronisation',
    shortDescription: 'Schnittstellenendpunkte, Datenaustausch, Offline-/Hintergrund-Synchronisation und Nachbereitungslogik.',
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
      findingsSummary: 'AppSheet wird abgelöst. Tripletex ist das ERP-Zielsystem. Datenfluss: Tripletex liefert Kunden/Projekte/Aktivitäten; ISA sendet freigegebene Arbeitsstunden und verlinkte Rapport-PDFs. Fachliche Freigabe ist strikt getrennt vom ERP-Exportstatus.',
      competitorSummary: 'Tripletex API unterstützt projektbezogene Stundenerfassung; Binärdateien und Fotos sollten in S3 verbleiben und per URL referenziert werden.',
      recommendationSummary: 'Eigene Work API als Puffer zwischen React Native und Tripletex. Idempotente Export-Jobs (Idempotency Key) mit Retry-Muster, um doppelte Stundenbuchungen auszuschließen.',
      openSummary: 'Können vollständige Rapport-PDFs direkt in das Tripletex-Konto von ProRiv abgelegt werden oder nur Referenzen? Wie behandeln wir Stornos nach dem Export?'
    }
  }
};

export const TOPIC_ORDER: TopicId[] = ['mobile-app', 'users', 'raport', 'vremya', 'clients', 'api'];

const QUESTION_TRANSLATIONS: Record<string, string> = {
  'Skolko typov polzovoteley ?': 'Wie viele Benutzertypen / Rollen gibt es im System?',
  'Kto otvechaet za chto?': 'Wer trägt welche fachliche und betriebliche Verantwortung?',
  'Kakaya u nix vzaimosvyaz\'?': 'Welche hierarchische Beziehung und Interaktion besteht zwischen den Rollen?',
  'Kto imeet pravo na chto ?': 'Wer hat welche konkreten Zugriffs- und Bearbeitungsrechte (RBAC)?',
  'Kakie info ?': 'Welche Stammdaten und Kontaktinformationen müssen für Kunden erfasst werden?',
  'Obekti ?': 'Welche Bauobjekte, Standorte und Projekte sind den Kunden zugeordnet?',
  'Type obektov': 'Welche Objekttypologien existieren (z. B. Neubau, Sanierung, Wartung)?',
  'Statusi obektov ?': 'Welche Zustände durchläuft ein Objekt (z. B. Planung, Aktiv, Abgeschlossen)?',
  'Kak imenno sozdayom ?': 'Wie gestaltet sich der exakte Ablauf bei der Rapporterstellung?',
  'Ktom imeet dostup ?': 'Wer hat Lese-, Bearbeitungs- oder Freigabezugriff auf Rapporte?',
  'Mojno li izmenit\'?': 'Können eingereichte Rapporte nachträglich modifiziert werden (Audit Trail)?',
  'Statusi ?': 'Welche Status gibt es (z. B. Entwurf, Zur Prüfung, Freigegeben, Verrechnet)?',
  'Type?': 'Welche Rapport-Typen werden unterschieden (Regie, Pauschal, Garantie)?',
  'Kuda otpravlyaem ?': 'Wohin und an welche Schnittstellen/Empfänger wird der fertige Rapport gesendet?',
  'Kak obnovlyaetsya ?': 'Wie werden Updates und Statuswechsel synchronisiert?',
  'FOTO, kakie faili ?': 'Welche Foto- und Dateianhänge sind zulässig und wie werden sie komprimiert?',
  'Kto zapisivaet vremya ?': 'Wer erfasst die Arbeitszeit (Mitarbeiter selbst, Vorarbeiter, Polier)?',
  'Kakie uslovie ?': 'Welche Bedingungen, Arbeitszeitmodelle und Regeln gelten?',
  'Kak rabotayut drugie programmi ?': 'Wie lösen etablierte Wettbewerbsprodukte die Zeiterfassung am Bau?',
  'Geolokaciya obyazatelna ?': 'Ist GPS-Geolokalisierung bei Einstempeln zwingend oder optional?',
  'API, chto kuda otpravlyaem ?': 'Welche API-Endpunkte existieren und welche Nutzdaten werden übertragen?',
  'Nujna li synxranizaciya ?': 'Wird eine Offline-Synchronisation mit Konfliktlösung benötigt?',
  'Chto nujno obnovit kogda vse zakonchilos?': 'Welche Entitäten müssen aktualisiert werden, wenn ein Auftrag/Projekt beendet ist?',
  'MOBILE APP: Wie wird die React Native Architektur strukturiert?': 'Architektur der mobilen Anwendung in React Native mit Offline-Unterstützung.',
  'AWS COGNITO: Wie erfolgt Benutzerauthentifizierung und Session-Handling?': 'Cognito User Pools, Tokens, Offline-Auth und Multi-Faktor-Unterstützung.',
  'AWS STORAGE S3: Wie werden Uploads für Baustellenfotos und Berichte optimiert?': 'Direkter Medien-Upload zu S3 über Presigned URLs mit lokaler Queue.'
};

export function generateInitialQuestions(): SeniorQuestion[] {
  const questions: SeniorQuestion[] = [];
  const now = new Date().toISOString();

  Object.values(TOPIC_DEFINITIONS).forEach((topic) => {
    topic.sketchQuestions.forEach((qText, index) => {
      questions.push({
        id: `q-orig-${topic.id}-${index + 1}`,
        topicId: topic.id,
        question: qText,
        originalFromSketch: true,
        germanTranslation: QUESTION_TRANSLATIONS[qText] || undefined,
        answer: '',
        isResolved: false,
        origin: 'sketch',
        status: 'open_decision',
        notes: 'Originalfrage aus der Senior-Skizze. Bereit zur Beantwortung im Zuge der Recherche.',
        createdAt: now,
        updatedAt: now
      });
    });
  });

  return questions;
}
