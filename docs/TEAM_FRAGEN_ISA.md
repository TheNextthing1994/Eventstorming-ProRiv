# Team-Fragen und Isa-Vorlage · ProRiv (Isa's Projekt)

Stand: 11.10.2026. Einstieg: **Fragen für Isa / Вопросы Исе** in der Navigation, direkte Route `#/workshop/questions`.

## Für das Teamgespräch

1. Den Katalog **Teamgespräch · 45 Fragen** öffnen. Themen links wählen; auf schmalen Bildschirmen Thema und Frage über die Auswahllisten wechseln.
2. Jede Frage lesen und besprechen. Deutsch, Russisch oder beide Sprachen sind über den bestehenden Sprachschalter verfügbar.
3. Bei Bedarf einen **Teamkommentar** und **Unser Vorschlag an Isa** eingeben. Es gibt keine vorgeschriebenen oder automatisch bestätigten Antworten.
4. **Für Isa übernehmen** anhaken, wenn diese Frage mit Isa besprochen werden soll. Der Haken nimmt die Frage in die Vorlage auf und markiert sie als durchgesehen. **Durchgesehen & weiter** dokumentiert nur den Teamfortschritt.
5. Zusätzliche Details stehen unter **Rollen-Vertiefung · 50 Fragen**. Beide Fassungen stammen aus derselben Datei und enthalten Überschneidungen. Sie bleiben getrennt auswählbar; die Vorlage berücksichtigt angehakte Fragen aus beiden Katalogen.
6. **Isa-Vorlage ansehen** öffnen. Sprache wählen, bei Bedarf Teamkommentare mit aufnehmen, anschließend Vorlage herunterladen oder Text kopieren. Die Vorschläge zu ausgewählten Fragen stehen immer dabei. Für Isas Antworten bleiben Felder frei.

| Eingabe | Bedeutung | Isa-Vorlage |
| --- | --- | --- |
| Für Isa übernehmen | Diese Frage auswählen | Frage und vorhandener Vorschlag werden aufgenommen |
| Im Team durchgesehen | Im Team besprochen | Steuert den Fortschritt, keine Freigabe |
| Teamkommentar | Gesprächsnotiz, bisherige Antwort oder Gedanke | Auf Wunsch einschließen; standardmäßig nicht enthalten |
| Unser Vorschlag an Isa | Formulierung, die Isa vorgelegt werden soll | Bei ausgewählten Fragen immer enthalten |

Die Vorlage entsteht aus den ausgewählten Originalfragen und euren Eingaben, nach Themen geordnet. Sie fasst keine unbekannten Antworten zusammen und erklärt Vorschläge nicht zu Entscheidungen. Die Spracheinstellung ändert Fragen und Beschriftungen; eure frei eingegebenen Notizen werden unverändert übernommen.

## Speichern und mitnehmen

Auswahl, Fortschritt und Text werden automatisch in diesem Browser gespeichert. Der jüngste Entwurf wird sofort gesichert; die vorhandene IndexedDB erhält anschließend geordnete Schreibvorgänge. Schreibfehler werden angezeigt, wenn keiner der beiden Browserspeicher erfolgreich war.

**Sicherung herunterladen** enthält Auswahl, Fortschritt, Kommentare und Vorschläge. Auf einem anderen Gerät oder Browser **Sicherung laden** wählen, den angezeigten Umfang prüfen und übernehmen. Die Wiederherstellung ersetzt nur den Stand dieses Fragenbereichs; andere Workshop- und Rechercheeinträge bleiben unberührt. Vor einer Wiederherstellung kann der aktuelle Stand gesichert werden.

Die bestehende vollständige JSON-Sicherung enthält den neuen optionalen Eintrag `isaQuestionNotes`. Alte JSON-Sicherungen ohne diesen Eintrag löschen den Fragenstand nicht. Diese App synchronisiert Teamnotizen nicht zwischen Geräten oder Personen.

## Quellen und Umsetzung

- Quelle: die vom Nutzer hochgeladene `Fragen Amruddy(1).txt`. Unveränderte Kopie: `docs/sources/Fragen_Amruddy_2026-10-11.txt`.
- Alle 95 nummerierten russischen Fragen bleiben wörtlich erhalten: 50 Rollenfragen sowie 28 kompakte Fragen plus deren Fortsetzung 29–45. Gesprächszeitstempel und Zwischenmeldungen gehören nicht zu den Fragen.
- Die deutsche Fassung ist eine Lesefassung. Die Herkunft einzelner Fragen bleibt durch Katalog und ursprüngliche Nummer nachvollziehbar.
- Daten und Gruppen: `src/data/isaTeamQuestions.ts`; Übersetzungen: `src/data/isaQuestionTranslations.ts`.
- Stabile Kennungen: `amruddy:team:01` bis `amruddy:team:45` und `amruddy:roles:01` bis `amruddy:roles:50`.
- Oberfläche: `src/components/IsaQuestionsWorkshop.tsx`; Auswahl, Sicherung und Vorlage: `src/utils/isaQuestions.ts`.
- Speicherung: vorhandener Settings-Store mit `isa_team_questions_v1`; unmittelbarer Browserentwurf mit `isa_team_questions_draft_v1`. Revisionsvergleich verhindert, dass ein älterer Entwurf eine neuere erfolgreiche Speicherung verdrängt.

## Prüfung

`npm run test:questions` prüft die Vollständigkeit gegenüber der Originaldatei, Auswahl und Abwahl, Export aus beiden Katalogen, optionale Kommentare, Sicherung/Wiederherstellung, Beschriftungen und Speicherverhalten bei schnellen Änderungen oder Speicherfehlern. TypeScript, vorhandene Repository-Checks und Produktionsbuild gehören zum Workflow.

Eine Browserprüfung im tatsächlichen Google-AI-Studio-Projekt ist separat erforderlich. Dort den aktuellen `main`-Stand synchronisieren oder erneut importieren und **Fragen für Isa** öffnen.
