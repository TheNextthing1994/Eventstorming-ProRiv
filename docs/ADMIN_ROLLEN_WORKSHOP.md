# Rollenkarte und Admin-Beziehungen · ProRiv (Isa's Projekt)

Stand: 11.10.2026. **Status: durchgehbarer Workshop-Entwurf; keine bestätigte Anforderung oder operative App-Funktion.**

## Öffnen

In der Anwendung **Rollenkarte** anklicken. Direkte Route: `#/workshop/roles`. Die Startseite zeigt drei Rollensymbole: Arbeiter (Helm), Vorarbeiter (Prüfbrett), Admin (Benutzerschild). Ein Klick betritt die Perspektive dieser Rolle. Sie steht in der Mitte und die Verbindungen zu den anderen Rollen werden sichtbar. Die Symbole werden nicht als kreisförmige Rollenkarten dargestellt.

Im **Admin-Blick** öffnet das Arbeiter-Symbol die Zusammenarbeit zu Einladung, Profil/Rechten, Arbeitsarten/Preisen und Zugangssperre. Das Vorarbeiter-Symbol öffnet Baustellenübergabe, Mannschaftszuordnung, Rapportweg, offene Vorgänge, Korrekturen und Abschluss. Die gewählte Verbindung zeigt auf derselben Seite einen geordneten Austausch: welche Rolle beginnt, was die andere Person tut und welcher Zustand daraus folgt. Fragen und Antworten liegen direkt bei diesem Austausch.

**Perspektive wechseln** ändert die zentrale Rolle. Ein Klick auf eine andere Rolle innerhalb eines bestehenden Blicks öffnet zunächst deren Beziehung zur zentralen Rolle. **Alle Rollen** kehrt zur Symbolübersicht zurück. Arbeiter und Vorarbeiter zeigen zusätzlich ihren gemeinsamen Rapport-/Stundenprozess. Weitere Beteiligte wie Kunde, System und Buchhaltung erscheinen bei den jeweiligen Übergaben.

Direkte Beziehung: `#/workshop/admin/interaction/invitation`. Die elf bisherigen Admin-Schritte bleiben als Quellen und Fragegruppen erhalten; es gibt keine neue Speicherung und keine duplizierten Antworten. Der vollständige Arbeiter-/Vorarbeiter-Lebenszyklus über diese Beziehungen hinaus ist weiterhin offen.

## Bisherige Admin-Quellen und weiterhin gültige Direktlinks

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

Die Rollenkarte ordnet diese Quellen Beziehungen zu. Eigene Einrichtung (Admin-Zugang / Firma & Tripletex) ist im Admin-Blick separat anwählbar. Systemreaktion, Fehler-/Offline-/Korrekturfälle und Quellen lassen sich bei der gewählten Beziehung aufklappen. Insgesamt bleiben die 28 Fragen erhalten. Vorhandene Antworten stehen separat von Meeting-Ergebnissen und werden nicht automatisch als entschieden markiert. Deutsch, Russisch und beide Sprachen sind unterstützt.

**Zentrale offene Frage in Schritt 8:** Schickt der Arbeiter den Rapport direkt an den Kunden oder zuerst zur Freigabe an den Vorarbeiter? Wer sendet danach? Das frühere Gespräch und der Team-Entwurf enthalten verschiedene Varianten. Stundenfreigabe in Tripletex und Kundenbestätigung bleiben getrennt zu klären.

## Antworten sichern und weitergeben

- Antwort je Frage eingeben; Status Offen / Zu prüfen / Entschieden wählen. Entschieden benötigt eine dokumentierte Antwort.
- Verantwortlichen und nächsten Schritt bei Bedarf ergänzen.
- Beziehungs- und Perspektivwechsel innerhalb des Workshops behalten die Eingaben. **Antworten speichern** schreibt in die vorhandene browserlokale IndexedDB.
- Vor Verlassen des Workshops oder Gerätewechsel speichern und **Meeting-Protokoll** exportieren. Das Protokoll enthält auch die vollständigen Admin-Fragen, ursprüngliche Antworten und Meeting-Ergebnisse.
- JSON-Backup/Restore nutzt weiterhin `workshopNotes`. Neue Fragen verwenden stabile Schlüssel wie `role:admin:report-policy:sender`; alte Prozess- und Architekturnotizen bleiben erhalten.
- SDD-Handoff übernimmt Fragen, Quellen und Antworten, bleibt aber ein Draft. Meeting-Status ist keine formelle Kundenfreigabe.

## Quellen und Umsetzung

- `docs/TEAM_ENTWURF_ROLLEN_RAPPORT_2026-10-09.md`: unbestätigter Teamvorschlag zu Admin, Zuordnungen und Rapportweg.
- `src/data/workshopContent.ts`: bestehende Gesprächsgrundlage, Vorschläge und offene Fragen.
- Nutzerauftrag vom 11.10.2026: Rollen vollständig durchgehbar machen und die Frage des Rapportwegs ausdrücklich klären.
- Neue Details zum Admin-Lebenszyklus sind Workshop-Vorschläge; keine erfundenen Kundenzusagen.

Fragen und IDs: `src/data/roleJourneys.ts`. Beziehungen und Aktionsfolgen: `src/data/roleInteractions.ts`. Symbolkarte und Detailansicht: `src/components/RoleJourneyWorkshop.tsx`. Speicherung und Meeting-Export: bestehender `SeniorWorkshop` mit `src/utils/roleWorkshop.ts`. Der Markdown-Export und SDD-Handoff behalten auch den Bezug der Beziehungen zu ihren ursprünglichen Fragegruppen. Keine neue Datenbank und keine operative Benutzerverwaltung werden eingeführt.

Prüfungen: TypeScript, Produktionsbuild, Rollen-/Export-/Render-Tests und bestehende SDD-Handoff-Tests. Die Vorschau in Google AI Studio muss nach Synchronisierung der neuesten `main`-Version dort separat geprüft werden.
