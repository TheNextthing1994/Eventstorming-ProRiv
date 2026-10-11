# Admin-Rollen-Workshop · ProRiv (Isa's Projekt)

Stand: 11.10.2026. **Status: durchgehbarer Workshop-Entwurf; keine bestätigte Anforderung oder operative App-Funktion.**

## Öffnen

In der Anwendung **Rollen · Admin** anklicken. Direkte Route: `#/workshop/admin`. Die drei Paneele zeigen Arbeiter, Vorarbeiter und Admin; die gewählte Rolle wird groß, die anderen bleiben anklickbar. Bei kleinen Bildschirmen stehen sie untereinander.

Der Admin ist die erste vollständig ausgearbeitete Rolle. Arbeiter und Vorarbeiter verweisen auf die bestehenden Prozessschritte; ihre vollständigen Rollenabläufe sind noch nicht ausgearbeitet.

## Durchgehen

| Schritt | Thema | Route |
| --- | --- | --- |
| 1 | Ersten Admin-Zugang übernehmen, Vertretung klären | `#/workshop/admin/access` |
| 2 | Firmendaten und Tripletex-Verbindung klären | `#/workshop/admin/company` |
| 3 | Mitarbeiter einladen, Link erneut senden oder zurückziehen | `#/workshop/admin/invite` |
| 4 | Profil vervollständigen und Rechte vergeben | `#/workshop/admin/profile` |
| 5 | Kunden, Baustellen und Rapportempfänger vorbereiten | `#/workshop/admin/site` |
| 6 | Vorarbeiter und Mannschaft zuordnen | `#/workshop/admin/assignment` |
| 7 | Preisgrundlage und Sonderpreise bereitstellen | `#/workshop/admin/prices` |
| 8 | Rapportweg und Freigaben mit Isa entscheiden | `#/workshop/admin/report-policy` |
| 9 | Offene Vorgänge und Übertragungen im Blick behalten | `#/workshop/admin/monitor` |
| 10 | Stunden, Rapporte und Zuordnungen korrigieren | `#/workshop/admin/correction` |
| 11 | Baustelle abschließen, Zugang beenden, Verantwortung übergeben | `#/workshop/admin/closure` |

Jeder Schritt beschreibt Ausgangslage, Handlung, vorgeschlagene Systemreaktion, Übergabe, Fehler-/Offline-/Korrekturfälle, bisherige Grundlage und konkrete Fragen an Isa. Insgesamt gibt es 28 Fragen. Vorhandene Antworten bleiben separat sichtbar und werden nicht automatisch als entschieden markiert. Deutsch, Russisch und beide Sprachen sind unterstützt.

**Zentrale offene Frage in Schritt 8:** Schickt der Arbeiter den Rapport direkt an den Kunden oder zuerst zur Freigabe an den Vorarbeiter? Wer sendet danach? Das frühere Gespräch und der Team-Entwurf enthalten verschiedene Varianten. Stundenfreigabe in Tripletex und Kundenbestätigung bleiben getrennt zu klären.

## Antworten sichern und weitergeben

- Antwort je Frage eingeben; Status Offen / Zu prüfen / Entschieden wählen. Entschieden benötigt eine dokumentierte Antwort.
- Verantwortlichen und nächsten Schritt bei Bedarf ergänzen.
- Schritt- und Rollenwechsel innerhalb des Workshops behalten die Eingaben. **Antworten speichern** schreibt in die vorhandene browserlokale IndexedDB.
- Vor Verlassen des Workshops oder Gerätewechsel speichern und **Meeting-Protokoll** exportieren. Das Protokoll enthält auch die vollständigen Admin-Fragen, ursprüngliche Antworten und Meeting-Ergebnisse.
- JSON-Backup/Restore nutzt weiterhin `workshopNotes`. Neue Fragen verwenden stabile Schlüssel wie `role:admin:report-policy:sender`; alte Prozess- und Architekturnotizen bleiben erhalten.
- SDD-Handoff übernimmt Fragen, Quellen und Antworten, bleibt aber ein Draft. Meeting-Status ist keine formelle Kundenfreigabe.

## Quellen und Umsetzung

- `docs/TEAM_ENTWURF_ROLLEN_RAPPORT_2026-10-09.md`: unbestätigter Teamvorschlag zu Admin, Zuordnungen und Rapportweg.
- `src/data/workshopContent.ts`: bestehende Gesprächsgrundlage, Vorschläge und offene Fragen.
- Nutzerauftrag vom 11.10.2026: Rollen vollständig durchgehbar machen und die Frage des Rapportwegs ausdrücklich klären.
- Neue Details zum Admin-Lebenszyklus sind Workshop-Vorschläge; keine erfundenen Kundenzusagen.

Inhalt und IDs: `src/data/roleJourneys.ts`. Oberfläche: `src/components/RoleJourneyWorkshop.tsx`. Speicherung und Meeting-Export: bestehender `SeniorWorkshop` mit `src/utils/roleWorkshop.ts`. Keine neue Datenbank und keine operative Benutzerverwaltung werden eingeführt.

Prüfungen: TypeScript, Produktionsbuild, Rollen-/Export-/Render-Tests und bestehende SDD-Handoff-Tests. Die Vorschau in Google AI Studio muss nach Synchronisierung der neuesten `main`-Version dort separat geprüft werden.
