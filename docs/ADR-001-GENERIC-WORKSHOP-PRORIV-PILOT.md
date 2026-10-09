# ADR-001 – Wiederverwendbare Workshop-Engine; ProRiv (Isa's Projekt) als Pilot

**Stand:** 2026-10-09
**Status:** Architekturentscheidung / Umsetzungsziel; noch **kein implementiertes Multi-Projekt-Feature**.
**Geltungsbereich:** Research Navigator und Senior-Workshop, nicht die operative Mitarbeiter-App.

## Entscheidung

Die bestehende Anwendung wird langfristig ein **projektübergreifendes Werkzeug für Discovery, Event Storming, Prozessklärung, Entscheidungsprotokolle und SDD-Handoff**. **ProRiv (Isa's Projekt)** ist die erste reale Projektinstanz. Die Senior-Workshop-Oberfläche bleibt vor dem unmittelbar bevorstehenden Gespräch funktional unverändert.

Quellen/Behauptungen, ungeprüfte Recherchen, Empfehlungen, Workshop-Antworten und bestätigte Entscheidungen werden separat geführt. Ein im Workshop als „Entschieden“ markierter Eintrag ist **nicht automatisch** eine akzeptierte Spezifikation oder formelle Kundenzusage.

## Ist-Zustand (main, 2026-10-09)

- React/Vite/TypeScript mit Senior-Workshop, Event Storming, Recherche, Präsentation und Export.
- `src/data/workshopContent.ts` enthält neun ProRiv-spezifische Prozessschritte als Codekonstanten.
- `src/db/defaultData.ts`, `src/db/knowledgeSeed.ts` und `src/types/index.ts` enthalten kundenspezifische Themen, Typen und Vorgaben.
- `src/db/indexedDb.ts` nutzt `arch_research_navigator_db` ohne echte `projectId`-Isolierung.
- `src/utils/sddHandoff.ts` generiert spezifisch beschriftete ProRiv-Artefakte.
- Workshop-Notizen sind browserlokal; kein automatischer geräteübergreifender Abgleich.
- Das Repository ist **öffentlich**; keine nicht freigegebenen Rohinterviews, Preise, Fotos, Personaldaten oder sonstige sensible Kundendaten committen.

## Zielarchitektur – inkrementell, nicht als parallele neue App

1. **Generische Engine:** Workshop/Canvas, Living Process Map, Fragen, Evidenz, Entscheidungslogik, Status, Suche, Import/Export und versionierter SDD-Handoff.
2. **Projekt-Bundle:** `projectId`, Name, Sprachen, Rollen, Prozessschritte, Domänenbegriffe, Fragen, Referenzen und projektbezogene Exportvorlagen. Erstes Bundle `proriv`, Label **ProRiv (Isa's Projekt)**.
3. **Projektgebundene Daten:** Notizen, Entscheidungen, Anhänge und Exporte immer mit eindeutiger `projectId`. Projekt-Isolierung erfolgt in der Datenzugriffsschicht, nicht nur durch einen UI-Filter.
4. **Governance:** Evidence/Origin, Empfehlung, offener Punkt, bestätigte Entscheidung und SDD-Akzeptanz bleiben unterscheidbar; nie stillschweigend hochstufen.
5. **Datenschutz:** Kundenspezifische Rohdaten in privaten Speichern/Repos; öffentliches Repo nur für freigegebenen Inhalt und Software.

Als spätere Struktur denkbar: `src/core/`, `src/projects/proriv/` und ein projektsensitiver Repository-/Export-Layer. Bestehende Komponenten zuerst wiederverwenden.

## Etappen

### 0 – vor dem Senior-Gespräch

- Main-Branch, `#/workshop`, neun Prozessschritte, Zweisprachigkeit, Speichern und Exporte funktionsfähig **belassen**.
- **Vor und nach dem Gespräch** Meeting-Protokoll als Markdown und vollständiges Recherche-Backup als JSON exportieren; gleiche Browser-Instanz / gleicher Ursprung für lokale Notizen.
- Architekturentscheidung dokumentieren, aber **keine** DB-Migration, kein neues Projektmenü und keinen UI-Refactor vor dem Termin.

### 1 – nach dem Gespräch

- Datenbackup und Regressionstests für Notizen und Handoff; projektbezogenes Manifest/Bundle einführen.
- Hartkodierte ProRiv-Inhalte und Typen schrittweise in das Bundle überführen, ohne ihre Bedeutung zu verändern.
- Workshop und Exporte über aktives Projekt auflösen; storage mit `projectId` und migrations-/backup-sicherem Keying versehen.
- Legacy-JSON-Import und browserlokale Bestandsdaten nachweisbar korrekt übernehmen.

### 2 – zweite Instanz als Gegenprobe

- Ein neutrales Testprojekt mit anderen Rollen, Schritten und Fragen einrichten.
- Wechsel beider Projekte, getrennte IDs/Notizen/Attachments und getrennte Exporte nachweisen.
- Erst **danach** Branding/Repo-Name generalisieren; alte Routen und Verweise erhalten.

## Fertig nur wenn

- ProRiv-Senior-Workshop funktional unverändert nutzbar.
- Migration/Backup/Restore ohne Datenverlust getestet.
- Gleiche Step-IDs in zwei Projekten kollidieren nicht; keine Cross-Project-Lese-/Schreib-/Exportpfade.
- Quellen- und Entscheidungsstatus bleiben im SDD-Handoff unterscheidbar.
- Keine vertraulichen Kundendaten in öffentlichen Commits.

## Bewusster Ausschluss

Kein Multi-Tenant-SaaS, Billing, Rollenverwaltung, zweiter CRM-/ERP-Stack oder vollständige neue Engine als Voraussetzung. Das Repo bleibt zunächst ein Discovery-/Workshop-Werkzeug und nicht die operative ProRiv-Arbeiter-App.