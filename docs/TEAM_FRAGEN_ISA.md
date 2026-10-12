# Team-Fragen und Isa-Vorlage · ProRiv (Isa's Projekt)

Stand: 12.10.2026. Einstieg: **Fragen für Isa / Вопросы Исе**, Route `#/workshop/questions`.

## Regler für das Gespräch

**Gesprächsumfang** steht direkt unter dem dunklen Kopfbereich und über Katalogfiltern und Suche. Standard ist **Minimum · 12 Fragen**. Den Schieber ziehen oder eine der sechs Stufen anklicken. Die Einstellung wird in diesem Browser behalten.

| Regler | Paket | Fragen insgesamt |
| --- | --- | --- |
| Minimum | Offene Entscheidungen mit dem größten Einfluss auf den Ablauf | 12 |
| 20 % | Kernablauf, Zuständigkeiten und Abrechnungsregeln | 32 |
| 40 % | Wichtige Ausnahmen und Fehlerfälle | 54 |
| 60 % | Alltag, Vorbereitung und Übergaben | 92 |
| 80 % | Vertiefung, weitere Rollen und Einführung | 131 |
| 100 % | Vollständiger Katalog | 155 |

Die Stufen sind kuratierte, aufeinander aufbauende Fragenpakete. Prozentwerte bedeuten Gesprächstiefe; sie behaupten keine gemessene Wissensabdeckung und sind keine Quote aus 155 Fragen. Das Minimum ist eine Startauswahl für das Gespräch, keine automatische Freigabe zur Umsetzung.

Die kleinste Stufe fragt nach Rechten, Stammdatenführung, Ankunftsnachweis, Pausen, Pflichtfeldern, Preispriorität, kombinierten Zuschlägen, Rapportversand, Abhängigkeiten von der Kundenantwort, Tripletex-Ausgabe, Offline-Funktionen und dem Umfang der ersten Version. Bereits belegte MVA-Fragen werden erst in der vollständigen Ansicht gezeigt.

Der Regler verändert ausschließlich die Anzeige. Ausgeblendete Haken, Teamkommentare und Vorschläge bleiben gespeichert. Die Isa-Vorlage enthält weiterhin **alle angehakten Fragen**, auch außerhalb der aktuellen Stufe; in diesem Fall zeigt der Regler einen Hinweis. Katalogfilter und Suche gelten innerhalb des gewählten Pakets. **100 %** zeigt den gesamten Bestand.

Umsetzung: `src/data/isaQuestionDepth.ts`, `src/components/IsaQuestionDepthControl.tsx` und die bestehende Fragenansicht. Die Browserpräferenz `isa_question_depth_v1` ist von den Frage-/Notizdaten getrennt.

## Für das Teamgespräch

Der **Gesamtkatalog enthält 155 Fragen**: die unveränderten 45 Teamfragen und 50 Ich-/Rollenfragen aus `Fragen Amruddy(1).txt` sowie 60 ergänzende Projektfragen. Alle sind nach 14 Abschnitten geordnet. Originalfragen werden nicht gelöscht oder umgeschrieben. Ergänzungen klären weitere konkrete Entscheidungen; bereits abgedeckte Projektfragen bekommen Quellenverweise statt zusätzlicher Kopien.

1. **Gesamtkatalog** öffnen und links einen Abschnitt wählen. Die Fragen stehen vollständig in einer lesbaren Liste. Auf schmalen Bildschirmen Abschnitt und Frage über die Auswahllisten wählen.
2. Bei der Frage **Vorschlag des Teams** oder **Bearbeiten** wählen. Deutsch, Russisch oder beide Sprachen sind über den vorhandenen Sprachschalter verfügbar.
3. Vorschlag eingeben und **Fertig** klicken; auch Enter speichert. Erst dann wird der Text gespeichert und die Frage als durchgesehen markiert. Vorhandene Teamkommentare bleiben getrennt erhalten. Gesprächsgrundlagen füllen euren Vorschlag nicht automatisch aus.
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

Haken werden beim Anklicken in diesem Browser gespeichert. Das Vorschlagsfeld hält den eingegebenen Text zunächst nur im Arbeitsspeicher; **Fertig** oder Enter übernimmt und speichert ihn. Einzelne Buchstaben lösen keine Speicherung aus. Offene Eingaben bleiben beim Wechsel zwischen Abschnitten, Reglerstufen und Isa-Vorlage erhalten. Die Vorlage und Sicherungen enthalten die übernommenen Texte; die Vorschau weist auf noch nicht übernommene Vorschläge hin. Vor einem Neuladen **Fertig** klicken.

Nach dem Übernehmen wird der neue Stand sofort im Browserspeicher gesichert; IndexedDB erhält danach geordnete Schreibvorgänge. Die bestehenden 95 IDs und Speicherkennungen bleiben erhalten. Es gibt keine Migration, die alte Kommentare oder Vorschläge zusammenführt oder überschreibt.

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
