# Etappenfragen für Isa festlegen

> **Aktualisierung 16.10.2026:** Die neue [kanonische Beschreibung der Rollen und Prozesse](PRORIV_CANON_ROLES_PROCESSES_2026-10-16.md) beantwortet mehrere dieser ursprünglich offenen Fragen (u. a. GPS-Distanz statt Geofence, e-mail-basierte Kundenantwort, Einzelrapporte und optionales Zusammenführen, Schichtbeginn, manuelle Korrekturen, Admin-Abschluss). Die Etappenfragen bleiben als historischer Fragekatalog und zur Ermittlung des tatsächlichen Umfangs bestehen. Vor einer neuen Kundenbefragung bitte gegen den Kanon abgleichen; eine per Browser lokal gespeicherte Antwort ist dadurch nicht automatisch geändert.


Stand: 12.10.2026. Einstieg: **Team-Fragen → Etappen vorbereiten**, Route `#/workshop/questions/etappen`.

Die Ansicht zeigt die 14 vorhandenen Etappen und 17 Einstiegsfragen zur Abgrenzung des Arbeitsumfangs. Acht Fragen verwenden bereits vorhandene Katalogeinträge. Neun Fragen ergänzen ausdrücklich den Umfang der ersten Version; sie fragen nach dem ersten Start, nicht nach weiteren Detailregeln. Die bisherigen 157 Fragen einschließlich der 95 Originale bleiben erhalten. Der vollständige Bestand umfasst jetzt 166 Fragen.

## Im Team vorbereiten

1. Eine Etappe wählen und die Frage durchgehen. Der Hinweis zur Aufwandsschätzung zeigt, welche Arbeit von der Antwort abhängt.
2. Den Haken bei der Frage setzen, wenn ihr sie Isa stellen wollt. Die Zahl an jeder Etappe zeigt die ausgewählten Fragen.
3. Im direkt sichtbaren Feld **Teamvorschlag für Isa** festhalten, was ihr für die erste Version vorschlagt und was später folgen kann.
4. **Fertig** speichert. Bis dahin bleibt der Text ein Entwurf. Entwürfe bleiben beim Wechsel zwischen Etappen und Katalog erhalten. Vor Neuladen oder Verlassen der Fragenansicht speichern.
5. **Weitere vorhandene Fragen zu dieser Etappe** aufklappen, wenn zusätzliche Fragen benötigt werden. Bereits ausgewählte Detailfragen stehen direkt unter den Einstiegsfragen.
6. **Isa-Vorlage ansehen** enthält alle ausgewählten Fragen und gespeicherten Vorschläge, geordnet nach Etappen. Auswahl und Notizen aus dem Katalog werden ebenfalls berücksichtigt. Kommentare bleiben standardmäßig intern.

Die Auswahl bedeutet „Diese Frage stellen wir Isa“, keine Bestätigung durch Isa. Die Etappenansicht verwendet denselben Speicher und dieselben IDs wie Katalog und Rollenkarte. Eine ausgewählte Frage erscheint im Export einmal. Der Gesprächsumfang des vollständigen Katalogs blendet keine Etappen-Einstiegsfrage aus.

## Einstiegsfragen je Etappe

### 01 · Rollen, Einladung und Zugang

Für die Aufwandsschätzung: Einladung und Benutzerverwaltung.

- Wer verschickt den App-Zugang: Admin oder Vorarbeiter? Soll die Einladung per SMS oder E-Mail kommen, auch bei Mitarbeitern ohne E-Mail?
  - ID: `proriv:project:invitation-channel`

### 02 · Auftrag, Kunde und Baustelle

Für die Aufwandsschätzung: Datenübernahme oder eigene Verwaltungsformulare.

- Woher kommen Kunden, Mitarbeiter und Baustellen: Eingabe in unserer App, Import aus Tripletex oder Übernahme aus anderen Quellen?
  - ID: `amruddy:team:06`

### 03 · Mannschaft und Aufgaben

Für die Aufwandsschätzung: Baustellenzuordnung oder zusätzliche Aufgabenplanung.

- Was erhält ein zugewiesener Arbeiter: Zugang zur gesamten Baustelle oder einen konkreten Auftrag mit Umfang und Termin?
  - ID: `amruddy:team:08`

### 04 · Ankunft, Standort und HMS

Für die Aufwandsschätzung: Standortfunktionen und Anbindung des vorhandenen HMS-Verfahrens.

- Reicht die Standortprüfung beim Start und Ende, oder braucht ihr einen Verlauf während der Arbeit? Wofür wird dieser Verlauf gebraucht, wer sieht ihn und wer klärt die Zulässigkeit auf Kundenseite?
  - ID: `proriv:project:gps-scope`
- Was muss unsere App für das vorhandene HMS-Verfahren tatsächlich liefern: Kartennummer speichern, Karte lesen, Anwesenheit übergeben oder gar nichts? Wer zeigt uns den heutigen Ablauf und die geforderte Schnittstelle?
  - ID: `proriv:project:hms-app-scope`

### 05 · Arbeitszeit und Pausen

Für die Aufwandsschätzung: Zeitarten und Zuordnung der Stunden.

- Welche Zeiten werden getrennt erfasst: Arbeit, Vorbereitung, Warten, Fahrt und Pausen?
  - ID: `amruddy:team:18`

### 06 · Leistungen, Zusatzarbeit und Fotos

Für die Aufwandsschätzung: Anzahl und Umfang der Rapportformulare.

- Welche Arbeitsarten müssen zum ersten Einsatz vollständig erfasst werden können: Kernbohren, Wandsägen, Bodensägen und Handsägen?
  - ID: `proriv:project:scope-work-types`

### 07 · Preise und Abrechnungsart

Für die Aufwandsschätzung: Umfang der automatischen Preisberechnung.

- Muss zum ersten Start die gesamte Preisberechnung einschließlich Vertragspreisen, Rabatten und Zuschlägen automatisch funktionieren, oder dürfen Sonderfälle zunächst manuell ergänzt werden?
  - ID: `proriv:project:scope-price-engine`

### 08 · Rapport erstellen und versenden

Für die Aufwandsschätzung: Versandkanäle und Zustellungsprüfung.

- Müssen SMS und E-Mail beide zum ersten Start funktionieren, oder reicht zunächst ein Versandkanal für Rapporte?
  - ID: `proriv:project:scope-rapport-channels`

### 09 · Kundenantwort und Unterschrift

Für die Aufwandsschätzung: Kundenansicht und Unterschriftsfunktion.

- Braucht ihr zum ersten Start sowohl Bestätigen und Ablehnen über einen Link als auch die Unterschrift vor Ort, oder zunächst eines dieser Verfahren?
  - ID: `proriv:project:scope-customer-confirmation`

### 10 · Tripletex, Stundenprüfung und Buchhaltung

Für die Aufwandsschätzung: Umfang und Richtung des Datenaustauschs mit Tripletex.

- Müssen wir zum ersten Start nur Arbeitsstunden nach Tripletex übertragen oder zusätzlich Rapporte und Dokumente?
  - ID: `proriv:project:scope-tripletex-payload`
- Welche Rückmeldungen sollen in unserer App erscheinen: Stunden empfangen, geprüft, korrigiert oder abgelehnt? Wer muss Änderungen oder Kommentare aus Tripletex sehen und darauf reagieren?
  - ID: `proriv:project:tripletex-feedback`

### 11 · Fehler, Änderungen und Stornierung

Für die Aufwandsschätzung: Versionen und erneute Kundenbestätigung.

- Muss die erste Version bereits gesendete oder unterschriebene Rapporte korrigieren und erneut zur Kundenbestätigung verschicken können?
  - ID: `proriv:project:scope-report-versions`

### 12 · Abschluss und Archiv

Für die Aufwandsschätzung: Abschlussverwaltung oder Übernahme des Abschlussstatus.

- Soll die Baustelle in unserer App abgeschlossen werden, oder übernehmen wir ihren Abschlussstatus aus Tripletex?
  - ID: `proriv:project:scope-site-closure`

### 13 · Ohne Netz und Synchronisierung

Für die Aufwandsschätzung: Speicherung auf dem Gerät und spätere Übertragung.

- Was muss ohne Internet möglich sein: Zeiten erfassen, Mengen eingeben, fotografieren und einen Rapport vorbereiten?
  - ID: `amruddy:team:21`

### 14 · Einführung, Betrieb und Abnahme

Für die Aufwandsschätzung: Geräte, Testumfang und Einführung.

- Starten wir mit einer Mannschaft auf wenigen Baustellen oder sofort im ganzen Unternehmen?
  - ID: `proriv:project:scope-pilot-rollout`
- Müssen Android und iPhone gleichzeitig zum ersten Start bereit sein, oder können wir zunächst mit einer Plattform beginnen?
  - ID: `proriv:project:scope-first-platforms`

## Daten und Prüfung

- Zuordnung und vorhandene Fragen: `src/data/isaStagePlanning.ts`.
- Oberfläche: `src/components/IsaStagePlanning.tsx`.
- Neun neue Fragen: `scope-*` am Ende von `src/data/isaProjectQuestions.ts`; alte Nummern und IDs bleiben unverändert.
- Speicherung, Vorlage und Sicherung verwenden die vorhandene Fragenlogik. Es wird kein zweiter Notizbestand eingeführt.
- Verhaltensprüfungen überprüfen Etappenzuordnung, Auswahl, Entwürfe, Erhalt vorhandener Antworten und Kommentare sowie Export und Wiederherstellung.
