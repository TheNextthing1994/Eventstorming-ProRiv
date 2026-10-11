# Team-Fragen und Isa-Vorlage · ProRiv (Isa's Projekt)

Stand: 11.10.2026. Einstieg: **Fragen für Isa / Вопросы Исе**, Route `#/workshop/questions`.

## Für das Teamgespräch

Der **Gesamtkatalog enthält 155 Fragen**: die unveränderten 45 Teamfragen und 50 Ich-/Rollenfragen aus `Fragen Amruddy(1).txt` sowie 60 ergänzende Projektfragen. Alle sind nach 14 Abschnitten geordnet. Originalfragen werden nicht gelöscht oder umgeschrieben. Ergänzungen klären weitere konkrete Entscheidungen; bereits abgedeckte Projektfragen bekommen Quellenverweise statt zusätzlicher Kopien.

1. **Gesamtkatalog** öffnen und links einen Abschnitt wählen. Die Fragen stehen vollständig in einer lesbaren Liste. Auf schmalen Bildschirmen Abschnitt und Frage über die Auswahllisten wählen.
2. **Frage öffnen · Kommentar & Vorschlag** wählen. Deutsch, Russisch oder beide Sprachen sind über den vorhandenen Sprachschalter verfügbar.
3. **Teamkommentar** und **Unser Vorschlag an Isa** notieren. Vorhandene Gesprächsgrundlagen stehen getrennt daneben und füllen eure Eingaben nicht automatisch aus.
4. **Für Isa übernehmen** anhaken. Das nimmt die Frage in die Vorlage auf und markiert sie als durchgesehen. **Durchgesehen & weiter** dokumentiert nur den Teamfortschritt.
5. **Verwandte Fragen und andere Rollenperspektiven** zeigt konkrete Verbindungen. Jede Perspektive bleibt einzeln auswählbar. Kommentare, Auswahl und Vorschläge werden beim Wechsel behalten.
6. **Isa-Vorlage ansehen** öffnen, Sprache wählen und herunterladen oder kopieren. Sie enthält ausgewählte Fragen aus allen Bereichen in der Reihenfolge der Arbeitsschritte, vorhandene Grundlagen und eure Vorschläge. Teamkommentare werden nur auf Wunsch aufgenommen.
7. **Alle Fragen herunterladen** liefert den vollständigen Lesekatalog. **Original · Teamfragen**, **Original · Ich-Perspektiven** und **Ergänzende Projektfragen** filtern denselben Bestand.

| Eingabe | Bedeutung | Isa-Vorlage |
| --- | --- | --- |
| Für Isa übernehmen | Diese Frage auswählen | Frage, vorhandene Grundlage und Vorschlag werden aufgenommen |
| Im Team durchgesehen | Im Team besprochen | Steuert den Fortschritt, keine Freigabe |
| Teamkommentar | Gesprächsnotiz, Antwort oder Gedanke | Auf Wunsch einschließen |
| Unser Vorschlag an Isa | Formulierung für Isa | Bei ausgewählten Fragen immer enthalten |

Die 14 Abschnitte umfassen Rollen/Zugang, Auftrag/Baustelle, Mannschaft, Ankunft/HMS, Arbeitszeit, Leistungen/Fotos, Preise, Rapportversand, Kundenantwort, Tripletex, Korrekturen, Abschluss, Offline-Synchronisierung und Einführung. Ereignisüberschriften sind ein Gesprächsmodell; sie erzwingen keine zusätzliche Vorarbeiterfreigabe.

## Bereits bekannt und weiterhin offen

- Laut Kundengespräch sendet der Arbeiter direkt an den Kunden. Eine zusätzliche Vorarbeiterfreigabe jedes Rapports ist ein unbestätigter Teamvorschlag. Die entsprechenden Originalfragen erhalten diesen Hinweis.
- Vorarbeiterprüfung der Stunden und Lohnverarbeitung finden nach dem Gespräch in Tripletex statt. Wofür der Vorarbeiter zusätzlich die App braucht und welche Schritte auf eine Kundenantwort warten, bleibt zu klären.
- Die Aktualität der Preisliste wurde bestätigt. Ihre konkreten Rechenregeln, Sonderverträge und Kombinationen sind damit noch nicht freigegeben.
- Preise ohne MVA und ein ausgefüllter Bohr-Rapport sind bereits belegt. Die Originalfragen werden mit dieser Grundlage gezeigt. Ein Sägebeispiel ergänzt die fehlende Arbeitsart.
- Kundenbestätigung, Ablehnung und ausbleibende Antwort sind alternative Ausgänge. Technischer Übertragungsstatus, Stundenfreigabe und Kundenantwort werden getrennt geklärt.

## Speichern und mitnehmen

Auswahl, Fortschritt und Text werden automatisch in diesem Browser gespeichert. Der jüngste Entwurf wird sofort gesichert; IndexedDB erhält danach geordnete Schreibvorgänge. Die bestehenden 95 IDs und Speicherkennungen bleiben erhalten. Es gibt keine Migration, die alte Kommentare oder Vorschläge zusammenführt oder überschreibt.

**Sicherung herunterladen** enthält Auswahl, Fortschritt, Kommentare und Vorschläge aus allen Bereichen. Auf einem anderen Gerät **Sicherung laden**, Umfang prüfen und übernehmen. Die Wiederherstellung ersetzt nur den Fragenstand. Die vollständige JSON-Sicherung enthält weiterhin den optionalen Eintrag `isaQuestionNotes`; alte globale Sicherungen ohne diesen Eintrag löschen ihn nicht. Die App synchronisiert Teamnotizen nicht automatisch zwischen Geräten.

## Quellen und Umsetzung

- Vollständige Leseliste: [ISA_GESAMTFRAGEN.md](ISA_GESAMTFRAGEN.md).
- Abgleich mit früheren Fragen: [ISA_FRAGEN_QUELLENABGLEICH.md](ISA_FRAGEN_QUELLENABGLEICH.md).
- Unverändertes Original: `docs/sources/Fragen_Amruddy_2026-10-11.txt`; alle 95 nummerierten russischen Fragen.
- Stabile Original-IDs: `amruddy:team:01`–`:45` und `amruddy:roles:01`–`:50`. Ergänzungen: `proriv:project:*`.
- Originaltexte: `src/data/isaTeamQuestions.ts`, Lesefassung: `src/data/isaQuestionTranslations.ts`.
- Ergänzungen: `src/data/isaProjectQuestions.ts`; Phasen: `src/data/isaQuestionStages.ts`; Quellenabgleich: `src/data/isaQuestionCoverage.ts`.
- Oberfläche/Export: `src/components/IsaQuestionsWorkshop.tsx`, `src/utils/isaQuestions.ts`.
- Speicherung: Settings-Store `isa_team_questions_v1`, Browserentwurf `isa_team_questions_draft_v1` mit Revisionsvergleich.

## Prüfung

`npm run test:questions` prüft Originalintegrität, Vollständigkeit/Erreichbarkeit, Quellen-/Ereignisabdeckung, unabhängige Auswahl verwandter Fragen, alte und neue Sicherungen, Export, Übersicht und Speicherfehler. TypeScript und Produktionsbuild gehören zum Repository-Workflow.

Google AI Studio muss mit dem aktuellen `main` synchronisiert oder erneut importiert werden. Die tatsächliche Ansicht dort ist separat im Browser zu prüfen.
