import React, { useState } from 'react';
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
  FileText,
  CornerDownRight
} from 'lucide-react';
import { TopicId } from '../types';

/**
 * 1. USERS: Rollen- und Berechtigungsmatrix
 */
export const RoleMatrixVisualizer: React.FC = () => {
  const permissions = [
    { action: 'Baustelle & Projekt auswählen', worker: true, foreman: true, office: true, customer: false, note: 'Arbeiter wählt eigenen Einsatzort' },
    { action: 'Arbeitszeit starten / stoppen (WorkSession)', worker: true, foreman: true, office: false, customer: false, note: 'GPS-Plausibilisierung beim Stempeln' },
    { action: 'Kernbohr- & Säge-Aufmaß erfassen', worker: true, foreman: true, office: true, customer: false, note: 'Mengen, Maße (mm, cm, m), Fotos' },
    { action: 'Rapport einreichen (WorkReportSubmitted)', worker: true, foreman: true, office: false, customer: false, note: 'Übergabe an Vorarbeiter-Prüfung' },
    { action: 'GPS-Ausnahmen prüfen & freigeben', worker: false, foreman: true, office: true, customer: false, note: 'Vorarbeiter beurteilt Standortabweichung' },
    { action: 'Arbeitsstunden freigeben (TimesheetApproved)', worker: false, foreman: true, office: true, customer: false, note: 'Stundenfreigabe für Tripletex' },
    { action: 'Rapport fachlich freigeben (WorkReportApproved)', worker: false, foreman: true, office: true, customer: false, note: 'Aufmaßprüfung für Kundenabrechnung' },
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
            <span>Vorgeschlagene Rollen- & Berechtigungsmatrix (RBAC)</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Serverseitige Autorisierungsregeln. Unbestätigte Regeln sind als Vorschlag gekennzeichnet.
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          Status: Empfohlen (Backend-RBAC)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Aktion / Geschäftsfunktion</th>
              <th className="py-2.5 px-2 text-center w-24">Arbeiter</th>
              <th className="py-2.5 px-2 text-center w-24">Vorarbeiter</th>
              <th className="py-2.5 px-2 text-center w-24">Büro / Admin</th>
              <th className="py-2.5 px-2 text-center w-24">Kunde</th>
              <th className="py-2.5 px-3">Hinweis / Regel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {permissions.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-medium text-slate-900">{p.action}</td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {p.worker ? <span className="text-emerald-700 font-bold">Ja</span> : <span className="text-slate-300">Nein</span>}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {p.foreman ? <span className="text-emerald-700 font-bold">Ja</span> : <span className="text-slate-300">Nein</span>}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {p.office ? <span className="text-emerald-700 font-bold">Ja</span> : <span className="text-slate-300">Nein</span>}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {p.customer ? <span className="text-sky-700 font-bold">Ja</span> : <span className="text-slate-300">Nein</span>}
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
export const EntityHierarchyVisualizer: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Datenmodell-Hierarchie: Customer → Project → Site</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Strikte Trennung verhindert Datenvermischung bei GPS, Tripletex und Preisregeln.
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          Status: Empfohlenes Domänenmodell
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">1. Customer (Kunde)</span>
            <span className="text-[10px] font-mono text-slate-400">Master: Tripletex</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Auftraggeber, Rechnungsempfänger, Zahlungskonditionen und Rahmenpreislisten.
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
            <span className="text-xs font-bold text-slate-900">2. Project (Projekt)</span>
            <span className="text-[10px] font-mono text-slate-400">1 : n zu Customer</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Kaufmännisches Projekt, Budget, Festpreis oder Regie, Projektleiter.
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
            <span className="text-xs font-bold text-emerald-950">3. Site (Baustelle / Einsatzort)</span>
            <span className="text-[10px] font-mono text-emerald-700">1 : n zu Project</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Physischer Ausführungsort mit Adresse, GPS-Koordinaten und optionalem Geofence.
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

      <div className="p-3 bg-slate-100/70 rounded-lg text-xs text-slate-700 flex items-center justify-between font-mono">
        <span className="font-semibold text-slate-800">Zuordnung der Arbeit:</span>
        <span>Site ──(verknüpft mit)──► WorkSession (Zeit) & WorkReport (Aufmaß)</span>
      </div>
    </div>
  );
};

/**
 * 3. RAPORT: Aufmaß-Struktur & Modell-Vorschau
 */
export const WorkReportPreviewVisualizer: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Aufmaß-Struktur & Gewerkespezifische Rapport-Vorschau</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Hauptarbeitsarten von ProRiv mit korrekten physikalischen Einheiten (ohne Scheinpreise).
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          Status: ProRiv Projektstandard
        </span>
      </div>

      {/* 3 Work Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">A. Kernbohren</span>
          <ul className="space-y-1 text-slate-600 text-[11px]">
            <li>• <strong>Durchmesser:</strong> in Millimeter (z. B. Ø 110 mm, Ø 200 mm)</li>
            <li>• <strong>Bohrtiefe:</strong> in Zentimeter (Bauteildicke)</li>
            <li>• <strong>Anzahl:</strong> Stückzahl Bohrungen</li>
            <li>• <strong>Ausrichtung:</strong> Wand, Decke/Boden oder Überkopf</li>
          </ul>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">B. Bodensäge</span>
          <ul className="space-y-1 text-slate-600 text-[11px]">
            <li>• <strong>Schnitttiefe:</strong> in Zentimeter (z. B. 15 cm, 25 cm)</li>
            <li>• <strong>Schnittlänge:</strong> in laufenden Metern (m)</li>
            <li>• <strong>Anzahl Schnitte:</strong> zur Erfassung von Teilabschnitten</li>
            <li>• <strong>Schnittvolumen / Fläche:</strong> abgeleitet</li>
          </ul>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">C. Wandsäge / Handsäge</span>
          <ul className="space-y-1 text-slate-600 text-[11px]">
            <li>• <strong>Schnitttiefe:</strong> in Zentimeter</li>
            <li>• <strong>Schnittlänge:</strong> in laufenden Metern (m)</li>
            <li>• <strong>Verfahren:</strong> Schienengeführt oder Handtrennschleifer</li>
            <li>• <strong>Bauteil:</strong> Beton, Mauerwerk, Deckenöffnung</li>
          </ul>
        </div>
      </div>

      {/* Surcharge Catalog */}
      <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200 space-y-2">
        <span className="text-xs font-bold text-slate-900 block">
          Erfasster Katalog von Zusatzleistungen & Erschwernissen (Zuschläge):
        </span>
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {[
            'Transport / Anfahrt',
            'Baustelleneinrichtung / Rüsten',
            'Hebebühne',
            'Pilotbohrung',
            'Hilfsarbeiter gestellt',
            'Zusätzliche Regiestunden',
            'Trockenbohren mit Absaugung',
            'Granit oder Asphalt',
            'Massivholz / Verbund',
            'Starke Eisenbewehrung',
            'Überkopfarbeiten'
          ].map((item, i) => (
            <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Status workflow */}
      <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200 text-xs space-y-1.5">
        <span className="font-bold text-emerald-950 block">Rapport-Lebenszyklus & Revisionssicherheit:</span>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-700">
          <span className="px-2 py-0.5 bg-white rounded border border-slate-200 font-semibold">Draft</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-white rounded border border-slate-200 font-semibold">Submitted</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-white rounded border border-slate-200 font-semibold">ForemanApproved</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-emerald-100 rounded border border-emerald-300 font-bold text-emerald-900">OfficeApproved (PriceSnapshot Locked)</span>
        </div>
        <p className="text-[11px] text-slate-600 mt-1">
          Korrekturschleife: <em>Submitted → CorrectionRequested → Revised → Submitted</em>. Nach Freigabe werden Änderungen nur über eine neue Revision (WorkReportRevision) mit Audit-Trail zugelassen.
        </p>
      </div>
    </div>
  );
};

/**
 * 4. VREMYA: Dreiteilung WorkSession != TimesheetEntry != WorkReport
 */
export const TimeTripleDivisionVisualizer: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Fundamentale Dreiteilung: WorkSession ≠ TimesheetEntry ≠ WorkReport</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Drei eigenständige Entitäten für Anwesenheit, Lohnabrechnung und Leistungsnachweis.
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          Status: Architektur-Kernregel
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-slate-900">1. WorkSession</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Was es ist:</strong> Die physische Anwesenheitszeit (Clock-in / Clock-out) an einem Einsatzort.
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200/60 space-y-0.5">
            <div>• startTimestamp / endTimestamp</div>
            <div>• clockInLocation (Lat, Long, Accuracy)</div>
            <div>• exceptionFlag (Kein GPS / Außerhalb Geofence)</div>
          </div>
          <span className="text-[10px] text-slate-400 block italic">Dient als technischer Nachweis</span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-900">2. TimesheetEntry</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Was es ist:</strong> Die abrechnungsrelevante Arbeitszeit nach Abzug von Pausen und Prüfung.
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200/60 space-y-0.5">
            <div>• workerId, projectId, activityCode</div>
            <div>• approvedHours, overtimeMultiplier</div>
            <div>• status (Submitted, Approved, Exported)</div>
          </div>
          <span className="text-[10px] text-slate-400 block italic">Fließt nach Vorarbeiterfreigabe zu Tripletex</span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-slate-900">3. WorkReport</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Was es ist:</strong> Das bauliche Aufmaß der ausgeführten Bohrungen, Schnitte und Regieleistungen.
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200/60 space-y-0.5">
            <div>• lines (Ø mm, Tiefe cm, Schnitte m)</div>
            <div>• evidence (Fotos, Kundenunterschrift)</div>
            <div>• priceSnapshot (Preise & Zuschläge)</div>
          </div>
          <span className="text-[10px] text-slate-400 block italic">Wird dem Kunden zur Prüfung vorgelegt</span>
        </div>
      </div>

      {/* Clock-in exception workflow */}
      <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-200/70 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>GPS-Ausnahmepfad beim Einstempeln: Niemals den Arbeiter blockieren</span>
        </div>
        <p className="text-[11px] text-slate-700 leading-relaxed">
          Wenn ein Betonbohrer in einem Keller oder Tiefgarage ohne GPS eincheckt, bricht die App <strong>nicht</strong> ab.
          Stattdessen wird die WorkSession mit dem Event <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">ClockInExceptionRecorded</code> versehen.
          Der Vorarbeiter sieht die Auffälligkeit in seiner Freigabeliste und entscheidet fachlich.
        </p>
      </div>
    </div>
  );
};

/**
 * 5. API: Integrationsarchitektur Tripletex <-> ISA
 */
export const ApiArchitectureVisualizer: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-700" />
            <span>Integrationsarchitektur & Datenfluss: Tripletex ↔ ISA Work API</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Klare Schnittstellentrennung, asynchrone Warteschlangen und Idempotenz.
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          Status: Empfohlener Integrationsstandard
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Inbound */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
            <span>Tripletex → ISA (Stammdatenabgleich)</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-600">
            <li>• <strong>Kunden:</strong> Stammdaten und Kontaktadressen aus ERP importieren</li>
            <li>• <strong>Projekte:</strong> Projektnummern, Bezeichnungen und Status</li>
            <li>• <strong>Aktivitäten:</strong> Tripletex-Aktivitätscodes (Boring, Saging, Reisetid)</li>
            <li>• <strong>Mitarbeiter:</strong> Benutzerkonten und Tripletex-Employee-IDs</li>
          </ul>
          <div className="text-[10px] text-slate-400 pt-1">Periodischer Abgleich oder Webhooks</div>
        </div>

        {/* Outbound */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>ISA → Tripletex (Geprüfte Ausführungsdaten)</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-600">
            <li>• <strong>Freigegebene Stunden:</strong> Mitarbeiter, Projekt, Aktivität, Stunden</li>
            <li>• <strong>Rapport-Referenz:</strong> Verlinkung des PDF-Prüfberichts in S3</li>
            <li>• <strong>Idempotenter Export:</strong> Idempotency-Key verhindert Doppelbuchungen</li>
            <li>• <strong>Fehler-Retry:</strong> Fehlgeschlagene Übertragungen verbleiben in Queue</li>
          </ul>
          <div className="text-[10px] text-slate-400 pt-1">Fachliche Freigabe ≠ Exportstatus</div>
        </div>
      </div>

      <div className="p-3 bg-slate-100/60 rounded-lg text-[11px] text-slate-600 space-y-1">
        <span className="font-semibold text-slate-800 block">Wichtiger technischer Grundsatz:</span>
        <p>
          Ein fehlgeschlagener Tripletex-API-Call (z. B. Netzwerk-Timeout) darf niemals die fachliche Vorarbeiter-Freigabe in ISA aufheben. Der Datensatz verbleibt im Zustand <code className="font-mono bg-white px-1 py-0.5 rounded">ForemanApproved</code> und geht in den Status <code className="font-mono bg-white px-1 py-0.5 rounded">TripletexExportFailed</code> zur automatischen Wiederholung.
        </p>
      </div>
    </div>
  );
};

/**
 * 6. MOBILE APP: Technische Architektur (React Native, Cognito, S3, PostgreSQL)
 */
export const MobileTechStackVisualizer: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>Vorgeschriebene Technologie-Architektur aus der Originalskizze</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            React Native, AWS Cognito und AWS Storage S3 werden verbindlich beibehalten.
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          Vorgabe der Senior-Skizze
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-emerald-50/30 rounded-lg border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>React Native</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Plattformübergreifend für iOS & Android. Offline-fähig via lokaler SQLite-Datenbank.
          </p>
          <span className="text-[10px] font-mono text-emerald-800 block">In Originalskizze</span>
        </div>

        <div className="p-3 bg-emerald-50/30 rounded-lg border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>AWS Cognito</span>
          </div>
          <p className="text-[11px] text-slate-600">
            User Pools, JWT-Token, sichere Authentifizierung und Offline-Token-Refresh.
          </p>
          <span className="text-[10px] font-mono text-emerald-800 block">In Originalskizze</span>
        </div>

        <div className="p-3 bg-emerald-50/30 rounded-lg border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Cloud className="w-4 h-4 text-emerald-700" />
            <span>AWS Storage S3</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Sichere Ablage von Baustellenfotos, Unterschriften und generierten Rapport-PDFs via Presigned URLs.
          </p>
          <span className="text-[10px] font-mono text-emerald-800 block">In Originalskizze</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Database className="w-4 h-4 text-slate-700" />
            <span>PostgreSQL (+ PostGIS)</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Relationale Work-API-Datenbank mit Geofencing-Unterstützung (AWS RDS Option).
          </p>
          <span className="text-[10px] font-mono text-slate-500 block">Ergänzende Empfehlung</span>
        </div>
      </div>

      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-900 block">MVP-Abgrenzung: Was bauen wir NICHT?</span>
          <span className="text-[11px] text-slate-500">
            Kein vollständiges Bau-ERP, keine Finanzbuchhaltung, kein 3D-BIM, kein 24/7-Hintergrund-GPS, keine universelle Workflow-Engine.
          </span>
        </div>
      </div>
    </div>
  );
};
