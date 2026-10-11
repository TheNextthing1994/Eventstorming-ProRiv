# Quellenabgleich der Isa-Fragen · ProRiv (Isa's Projekt)

Stand: 11.10.2026. Ergebnis: 95 unveränderte Originalfragen plus 60 Ergänzungen, geordnet nach 14 Abschnitten. 162 frühere Fragen oder gebündelte Entscheidungspunkte werden auf konkrete Fragen dieses Katalogs abgebildet. Diese Zahl zählt Quellenbezüge, nicht zusätzliche Fragen.

## Geprüfte Grundlagen

| Quelle | Fundstelle / Kennung | Verwendung |
| --- | --- | --- |
| Fragen Amruddy(1).txt | docs/sources/Fragen_Amruddy_2026-10-11.txt | Alle 95 Originale unverändert, SHA-256 geprüft |
| Kundengespräch RAW: Разговор с клиентом.md | libfile_e93c5250daa08191b668cf178206d210 · §§3–7 | Bestehende Arbeitsweise, konkrete offene Fragen und frühere Antworten |
| Kundenanforderungen V1: Eingefügter Text.txt | libfile_78543e9de1608191982b0ec191756475 | Kundenstand, beobachtete Funktionen, offene Entscheidungen |
| Admin-Rollen-Workshop | src/data/roleJourneys.ts | 28 konkrete Fragen und bisherige Gesprächsgrundlagen |
| Prozess-Workshop | src/data/workshopContent.ts | Fragen zu Ankunft, Zeit, Leistung, Preis, Versand, Kunde und Tripletex |
| Senior-/Projektfragen und offene Punkte | src/db/defaultData.ts; src/db/knowledgeSeed.ts | Frühere Kundenfragen und 18 Ereignisentscheidungen |
| Team-Entwurf 09.10. | docs/TEAM_ENTWURF_ROLLEN_RAPPORT_2026-10-09.md | Abweichungen zum Kundengespräch; kein bestätigter Pflichtprozess |
| Historische Event-Storming-Karte | ProRiv_MVP_EventStorming.drawio · libfile_888f533e73108191b401cd4d9de0e298 | Offene Fragen extrahiert, Vorschläge gegen aktuellen Kundenstand abgeglichen |
| Event Storming KONSISTENT V2 | libfile_68178f6602d48191adf76b27453ff184 · sechs Seiten | Zeit/Rapport/Kunde/Integration getrennt; Offline und Preisregeln |
| Event Storming QA V2 | libfile_dbe0d1e85cec8191852fe51522c92415 | P0-/P1-Fragen und Korrektur von Annahmen |
| Living Process Map und Gate V0.2 | libfile_401e9bc81e7c81918f4f7ec1b8b6d949; libfile_7e4b2ea29594819197119e352d583584 | Fünf gebündelte Fragen in konkrete Einzelentscheidungen aufgeteilt |
| Alte / neuere Rapport-Screenshots: Auswertung 11.10. | libfile_99cfb8d8ec8c8191808193a1fe33f276 | Acht konkrete Rückfragen, cm-Einheiten, Kategorien und Versand mit/ohne Preis |
| Aktuelle Preisliste und Beleginventar | src/data/prorivPriceSheetEvidence.ts | Mindestwerte, Helfer, Material-, Höhen- und andere Zuschläge |
| Frühere Rechercheberichte (1)–(4) | libfile_49dd6afb82f4819189413f90c75b3560; libfile_27cf83f020ec8191b108401000104855; libfile_3d5278c1c4fc8191a0190560260b1f91; libfile_f838350978048191bb91fe2aca249b0a | Technische Möglichkeiten und Prüfpunkte; keine neuen Kundenentscheidungen daraus behauptet |
| Ergänzende Ablaufprüfung | src/data/isaProjectQuestions.ts · analysis:* | Neue Fragen zu Nachtarbeit, Preisgrenzen, Versionsbezug, Synchronisierung und Einführung |

## Regeln für die Zusammenstellung

- Originalfragen bleiben wörtlich erhalten, auch wenn sie verschiedene Perspektiven desselben Themas abdecken. Ihr wählt selbst, welche in die Isa-Vorlage kommen.
- Ein früherer Punkt, der bereits beantwortbar im Katalog steht, erhält einen Quellenverweis. Er erzeugt keine weitere Frage nur wegen anderer Formulierung.
- Ergänzungen klären konkrete zusätzliche Entscheidungen, Übergaben oder Ausnahmefälle. analysis:* kennzeichnet neue Fragen aus der Ablaufprüfung.
- Alte technische Empfehlungen sind keine Kundenantworten. Zusätzliche Rapportfreigabe, automatische GPS-/Pausen-/Lohnregeln und neue ERP-Funktionen werden nicht vorausgesetzt.
- Die bestätigte Aktualität der Preisliste wird nicht erneut grundsätzlich abgefragt. Anwendung, Preispriorität, Fixierungszeitpunkt und Vertragsausnahmen bleiben offen.
- Quellen mit technischen Tests werden mit Team/Senior geprüft. Isa liefert dafür die Betriebsanforderung beziehungsweise Zugang und Ansprechpartner; API-Verhalten ist erst nach Test bewiesen.
- Browsergespeicherte individuelle Änderungen an anderen Workshop-/Rechercheeinträgen werden durch diesen Katalog nicht überschrieben. Die Tabelle bildet die tatsächlich geprüften Quellfassungen ab.

## Abdeckung früherer Fragen

| Quelle | Frühere Frage / Entscheidung | Im Katalog | Prüfung |
| --- | --- | --- | --- |
| Admin-Rollen-Workshop · admin:access:first-admin | Isa, wer soll der erste Admin sein, und wer richtet seinen Zugang ein? | Ergänzung 1 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:access:deputy | Wer übernimmt, wenn der Admin im Urlaub ist? Soll diese Person dieselben Rechte bekommen? | Team 5 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:company:master-data | Pflegt ihr Mitarbeiter und Projekte zuerst in Tripletex oder in unserer App? Welche Einträge sollen übernommen werden? | Team 6, Rolle 38 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:company:connection-owner | Wer kann den Tripletex-Zugang für die Verbindung freigeben und einen Test mit uns durchführen? | Ergänzung 50 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:company:payroll-system | Bleiben Stundenprüfung und Lohnverarbeitung in Tripletex? Muss die Buchhaltung unsere App überhaupt öffnen? | Ergänzung 45 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:invite:inviter | Wer verschickt den ersten App-Zugang: Admin, Vorarbeiter oder Isa? Wer darf nur auf eine Baustelle zuordnen? | Ergänzung 2 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:invite:channel | Soll der Einladungslink per SMS oder E-Mail kommen? Was machen wir bei Mitarbeitern ohne E-Mail? | Ergänzung 2 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:invite:expiry | Wie lange ist der Link gültig, und wer darf eine Einladung erneut schicken oder zurückziehen? | Ergänzung 3 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:profile:required-data | Welche Angaben braucht ihr vor der ersten Schicht wirklich: Name, Telefon, Personalnummer, Sprache oder HMS-Kartennummer? Wer trägt sie ein? | Ergänzung 4, Ergänzung 60 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:profile:worker-rights | Darf jeder Arbeiter Preise sehen und Rapporte versenden, oder nur ein benannter Verantwortlicher? Darf jemand mehrere Rollen haben? | Team 4, Rolle 9 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:site:site-owner | Wer legt eine Baustelle an, und welche Angaben müssen vorhanden sein, bevor die Arbeiter sie sehen? | Team 7, Rolle 5 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:site:recipient | Wer bestimmt den Rapportempfänger? Kann eine Baustelle mehrere Ansprechpartner haben, und wer hält deren Telefonnummern aktuell? | Rolle 8, Ergänzung 35 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:site:location-policy | Soll die Baustelle eine GPS-Zone oder einen QR-Code bekommen? Wer entscheidet bei schlechtem GPS oder fehlendem Internet über eine Ausnahme? | Ergänzung 11 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:assignment:assignment-owner | Darf der Vorarbeiter seine Mannschaft selbst ändern, oder macht das immer der Admin? Kann ein Arbeiter mehrere Baustellen am Tag haben? | Rolle 6, Team 31, Team 18 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:assignment:report-owner | Braucht jede Baustelle einen benannten Rapport-Verantwortlichen? Wer übernimmt, wenn er ausfällt? | Team 10, Rolle 17, Team 5 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:prices:price-owner | Wer pflegt Preise und Rabatte heute? Soll diese Person das in der App tun oder soll die App vorhandene Preise übernehmen? | Team 17, Rolle 50 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:prices:missing-price | Darf der Rapport bei fehlendem Preis trotzdem rausgehen? Wer darf einen Sonderpreis einsetzen oder einen berechneten Preis ändern? | Ergänzung 33 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:report-policy:sender | Schickt der Arbeiter den Rapport direkt an den Kunden oder zuerst an den Vorarbeiter? Ist dessen Freigabe Pflicht, und wer drückt danach auf Senden? | Ergänzung 32 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:report-policy:customer-wait | Müssen Stunden auf Kundenbestätigung warten? Was passiert mit Stunden und Rapport, wenn der Kunde nicht antwortet oder widerspricht? | Ergänzung 44 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:report-policy:foreman-replacement | Wenn Vorarbeiterfreigabe nötig ist: Wer darf bei seiner Abwesenheit freigeben und senden? | Ergänzung 32 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:monitor:dashboard | Was musst du als Admin täglich sehen: offene Rapporte, fehlende Stunden, Baustellenstatus oder nur Fehler? Für alle Baustellen oder nur eigene? | Team 1, Rolle 24, Rolle 32, Ergänzung 37 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:monitor:alert | Wen informieren wir bei fehlender Synchronisierung oder Tripletex-Fehlern, und nach welcher Wartezeit? | Rolle 42, Team 38 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:correction:time-editor | Wer darf vergessene oder falsche Stunden ändern: Arbeiter, Vorarbeiter oder Admin? Was gilt nach Freigabe in Tripletex? | Rolle 16, Team 33, Rolle 43 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:correction:report-editor | Wer darf einen bereits gesendeten oder unterschriebenen Rapport korrigieren? Muss der Kunde die neue Version erneut bestätigen? | Rolle 23, Rolle 26, Rolle 43, Ergänzung 51 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:correction:error-owner | Wer übernimmt falsche Projektzuordnungen und fehlgeschlagene Tripletex-Übertragungen? Wer gibt den erneuten Versand frei? | Rolle 42, Rolle 43 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:closure:close-site | Wer erklärt eine Baustelle für abgeschlossen? Müssen alle Rapporte bestätigt und Stunden übertragen sein, oder dürfen offene Fälle bleiben? | Team 25, Rolle 10 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:closure:disable-user | Wer sperrt den Zugang bei Austritt oder verlorenem Handy? Was passiert mit noch nicht übertragenen Stunden und Fotos? | Rolle 3, Team 20, Ergänzung 5, Ergänzung 54 | Mit Isa klären |
| Admin-Rollen-Workshop · admin:closure:retention | Wer darf archivierte Baustellen und alte Rapporte einsehen oder wieder öffnen? Welche Aufbewahrungsregeln gelten bei euch? | Team 42, Ergänzung 52 | Mit Isa klären |
| Prozess-Workshop · process:arrival | Senior + Isa klären: Arbeitet ProRiv meist als Subunternehmer, als Hauptunternehmer oder selbst als Bauherr? Wer ist rechtlich für die elektronische Baustellenliste verantwortlich, wer führt sie tatsächlich (ggf. schriftlich delegiert) und welche Systeme verlangen diese Baustellen? Danach entscheiden: HMS-Kartennummer speichern, Datenexport, Schnittstelle oder eigene Liste? Zusätzlich: Ist Ankunft gleich Arbeitsbeginn; braucht es GPS/QR? | Ergänzung 10, Ergänzung 12 | Mit Isa klären |
| Prozess-Workshop · process:time | Welche Pausen sind bezahlt? Darf der Mitarbeiter vergessene Buchungen selbst korrigieren? Welche Wochenstundenregeln gelten wirklich? | Team 18, Team 33, Ergänzung 15, Ergänzung 16 | Mit Isa klären |
| Prozess-Workshop · process:work | Welche Felder sind zwingend? Wie werden Helfer, Transport, Gerüst, Material und mehrere Mitarbeiter pro Rapport erfasst? | Team 10, Team 11, Rolle 18, Rolle 49 | Mit Isa klären |
| Prozess-Workshop · process:pricing | Welche Preisregel hat Vorrang und wann wird sie fixiert? Wer pflegt die Preisliste und darf Preise überschreiben? | Ergänzung 24, Ergänzung 29 | Mit Isa klären |
| Prozess-Workshop · process:send | Darf der Arbeiter direkt senden, wenn Preise fehlen oder Fotos noch hochgeladen werden? Wie wird die Zustellung nachgewiesen? | Ergänzung 32, Ergänzung 33, Ergänzung 34, Ergänzung 35 | Mit Isa klären |
| Prozess-Workshop · process:customer | Wie funktioniert ein Nein, Nichtantwort oder spätes Feedback? Muss auf Kundenbestätigung vor Lohnexport gewartet werden? | Team 35, Team 36, Rolle 36, Rolle 37 | Mit Isa klären |
| Prozess-Workshop · process:export | Welche Tripletex-API-Felder und Berechtigungen sind vorhanden? Wie sieht der Vorarbeiter Rapport/Arbeiten beim Prüfen der Stunden? | Ergänzung 48 | Mit Isa klären |
| Prozess-Workshop · process:approval | Wie werden ausgeführte Arbeiten und Fotos bei der Stundenprüfung sichtbar? Wozu benötigt der Vorarbeiter außerdem ISA-Zugang? | Ergänzung 38, Ergänzung 46, Ergänzung 48 | Mit Isa klären |
| Prozess-Workshop · process:accounting | Welche Rückmeldung über genehmigte/korrigierte Stunden muss ISA zurückbekommen? | Ergänzung 18, Ergänzung 49 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-1 | Welche Berechtigungen haben Arbeiter, Vorarbeiter und Büro endgültig? | Team 4, Rolle 9 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-2 | Welche Felder sind je Arbeitsart (Kernbohren, Bodensäge, Wandsäge) verpflichtend? | Team 11, Rolle 18, Rolle 19 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-3 | Darf ein Mitarbeiter bei fehlendem oder ungenauem GPS-Signal einstempeln? | Team 20, Rolle 15, Rolle 27 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-4 | Wer darf Arbeitszeiten und Sessions nachträglich korrigieren? | Team 33, Rolle 16 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-5 | Wer darf Preise sehen und manuelle Preisänderungen (Overrides) vornehmen? | Team 4, Team 17, Rolle 9 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-6 | Welche Preisregel hat Vorrang: Standard, Kunde, Projekt oder manueller Override? | Ergänzung 24 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-7 | Ist eine Kundenunterschrift für jeden Rapport und für den Stundenexport zwingend erforderlich? | Ergänzung 41, Ergänzung 44 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-8 | Welche Daten sollen im MVP tatsächlich nach Tripletex übertragen werden? | Team 22, Rolle 39 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-9 | Welche Systeme sind für Kunden-, Projekt- und Aktivitätsstammdaten führend? | Team 6, Rolle 38, Ergänzung 47 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-10 | Wie behandeln wir Korrekturen nach bereits erfolgter Freigabe oder ERP-Export? | Team 24, Rolle 43 | Mit Isa klären |
| Senior-Entscheidungsfragen · senior:sd-11-hms-role | In welcher Rolle arbeitet ProRiv auf Baustellen (Subunternehmer / Hauptunternehmer / Bauherr)? Wer führt die elektronische HMS-Übersichtsliste, und braucht ISA dafür überhaupt eine eigene Funktion? | Ergänzung 12, Ergänzung 13 | Mit Isa klären |
| Offene Projektpunkte · open:op-vremya-hms-subcontractor | Senior / Isa: Ist ProRiv hauptsächlich Subunternehmer, Hauptunternehmer oder selbst Bauherr? Wer ist für die elektronische Übersichtsliste zuständig, wer führt sie (ggf. schriftlich delegiert), welches System wird heute genutzt und welche Daten/Schnittstellen werden von ProRiv verlangt? | Ergänzung 12 | Mit Isa klären |
| Offene Projektpunkte · open:op-users-1 | Darf der Arbeiter oder Vorarbeiter Preise in der mobilen App einsehen oder anpassen? | Team 4, Rolle 9 | Mit Isa klären |
| Offene Projektpunkte · open:op-clients-1 | Ist Tripletex das führende System für Kunden- und Projektstammdaten oder darf ISA Kunden anlegen? | Team 6, Rolle 38 | Mit Isa klären |
| Offene Projektpunkte · open:op-clients-2 | Wie gehen wir mit Noteinsätzen ohne vorab bekannte Baustellenadresse um? | Rolle 7 | Mit Isa klären |
| Offene Projektpunkte · open:op-raport-1 | Muss jeder Rapport zwingend vom Kunden digital gegengezeichnet werden, bevor Stunden abgerechnet werden? | Ergänzung 44 | Mit Isa klären |
| Offene Projektpunkte · open:op-raport-2 | Welche genauen Pflichtfelder und Fotos sind für Bohr- und Sägearbeiten zwingend erforderlich? | Team 11, Rolle 18, Rolle 19 | Mit Isa klären |
| Offene Projektpunkte · open:op-vremya-1 | Rechtliche Klärung der norwegischen Datenschutz- und Arbeitsrechtsanforderungen für Clock-In Standortdaten. | Ergänzung 14 | Team / Senior; technische Verifikation |
| Offene Projektpunkte · open:op-api-1 | Können vollständige Arbeitsrapport-PDFs und Fotos über die Tripletex-API des ProRiv-Kontos übertragen werden? | Ergänzung 48 | Team / Senior; technische Verifikation |
| Offene Projektpunkte · open:op-app-1 | Auswahl der AWS-Region für ProRiv (z. B. eu-north-1 Stockholm) und Festlegung der Backup-Aufbewahrungsfristen. | Ergänzung 58 | Team / Senior; technische Verifikation |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-mobile-app-1 | Werden von ProRiv Firmen-Smartphones gestellt (iOS oder Android) oder nutzen die Mitarbeiter eigene Geräte (BYOD)? | Team 26, Team 40, Ergänzung 59 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-mobile-app-2 | Soll der Login per Handynummer + SMS-Code erfolgen oder per E-Mail & Passwort? | Ergänzung 5 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-mobile-app-3 | Welche Vorhaltezeit für Baustellenfotos wünscht ProRiv (z. B. 2 Jahre, 5 Jahre gesetzliche Gewährleistung)? | Team 42 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-users-1 | Gibt es bei ProRiv noch weitere Rollen (z. B. Subunternehmer, externe Bauleiter des Generalunternehmers)? Müssen Vorarbeiter mehrere Baustellen parallel verwalten können? | Team 4, Rolle 24, Ergänzung 6, Ergänzung 46 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-users-2 | Wer haftet bei ProRiv für vergessene Zusatzaufwände (z. B. Bewehrungszuschlag)? Darf der Vorarbeiter Stunden des Arbeiters direkt korrigieren oder nur zur Überarbeitung zurückweisen? | Team 1, Rolle 16, Rolle 49 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-users-3 | Kommt es vor, dass erfahrene Arbeiter ohne zugewiesenen Vorarbeiter direkt auf Kleinbaustellen arbeiten? Wer übernimmt in diesem Fall die Freigabe der Stunden? | Ergänzung 9 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-users-4 | Dürfen Vorarbeiter vor Ort Regiestunden oder Zusatzpreise mit dem Bauleiter des Kunden aushandeln, oder ist das strikt dem Büro vorbehalten? | Team 17, Team 29, Rolle 20, Rolle 50 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-clients-1 | Gibt es einen festen Nummernkreis aus Tripletex, der als führende Kunden-ID in ISA synchronisiert werden muss? | Ergänzung 7 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-clients-2 | Gibt es Projekte mit mehreren separaten Bauabschnitten oder Unter-Adressen, die getrennt abgerechnet werden müssen? | Ergänzung 7 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-clients-3 | Hängen die Sicherheitsausrüstungen (z. B. Atemschutz, Staubabsaugung) direkt am Objekttyp? | Ergänzung 8 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-clients-4 | Darf auf pausierten Baustellen nachgestempelt werden, falls Nacharbeiten anfallen? | Team 32, Team 33, Ergänzung 52 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-raport-1 | Muss der Rapport zwingend am selben Tag vor Verlassen der Baustelle eingereicht werden, oder ist Sammelerfassung erlaubt? | Ergänzung 37 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-raport-2 | Dürfen Bauleiter des Generalunternehmers Einsicht in die Rohdaten nehmen, bevor das ProRiv-Büro den Rapport freigegeben hat? | Team 4, Rolle 9 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-raport-3 | Wie verfährt ProRiv, wenn der Kunde eine Woche nach Rechnungsstellung eine Bohrung reklamiert? Reicht ein Storno-Rapport? | Team 24, Rolle 43, Ergänzung 23 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-raport-4 | Reicht eine mündliche Freigabe durch den Vorarbeiter oder muss jeder Schritt digital dokumentiert sein? | Team 39 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-raport-5 | Gibt es bei ProRiv Pauschalverträge, bei denen der Kunde keinen detaillierten Einzelrapport sehen darf? | Team 34, Ergänzung 23, Ergänzung 31 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-raport-6 | Gibt es feste E-Mail-Adressen je Kunde für den Rechnungsversand, oder unterschreibt der Bauleiter vor Ort auf dem Smartphone? | Rolle 8, Rolle 33 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-raport-7 | Braucht das Büro eine Push-Benachrichtigung auf Handy/Browser, sobald ein neuer Rapport eingereicht wird? | Team 38 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-raport-8 | Sind Fotos für jede einzelne Bohrung Pflicht oder reicht ein Übersichts-Foto des fertigen Bauteils? | Team 11, Rolle 19, Ergänzung 21 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-vremya-1 | Dürfen Vorarbeiter bei ProRiv ganze Kolonnen auf einmal einstempeln (z. B. 4 Mann im Transporter)? | Ergänzung 17 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-vremya-2 | Wie handhabt ProRiv die gesetzliche 30-Minuten-Pause? Soll sie automatisch abgezogen oder aktiv gestempelt werden? | Ergänzung 15 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-vremya-3 | Reicht ProRiv die reine Punkt-Prüfung beim Start/Stopp, oder verlangen Kunden lückenlose Standort-Historie? | Ergänzung 14 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-vremya-4 | Welcher Radius soll als gültige Geozone um die Baustellenadresse gelten (z. B. 100 Meter oder 250 Meter)? | Team 19, Rolle 29 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-api-1 | Sind die Tripletex-Zugangsdaten (API-Tokens) für die Testumgebung von ProRiv bereits verfügbar? | Ergänzung 50 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-api-2 | Gibt es Baustellen (z. B. Bunker, Bergwerke), an denen Arbeiter mehrere Tage komplett ohne Internet arbeiten? | Ergänzung 53, Ergänzung 55 | Mit Isa klären |
| Senior-Skizze · konkrete Kundenfrage · sketch:q-orig-api-3 | Muss bei Auftragsabschluss eine automatische Benachrichtigung an den Kunden-Bauleiter rausgehen? | Team 25, Team 38 | Mit Isa klären |
| Event Storming · WorkSessionStarted · event:de-1 | Blockieren oder Warnung bei Geofence-Abweichung? | Team 20, Rolle 15, Rolle 27 | Mit Isa klären |
| Event Storming · ClockInExceptionRecorded · event:de-2 | Toleranzradius für Baustellen-Geofence festlegen | Team 19, Rolle 29 | Mit Isa klären |
| Event Storming · WorkSessionStopped · event:de-3 | Automatische Pausenabzüge definieren | Ergänzung 15 | Mit Isa klären |
| Event Storming · TimesheetSubmitted · event:de-4 | Frist für wöchentliche Zeiteinreichung | Ergänzung 18 | Mit Isa klären |
| Event Storming · TimesheetCorrectionRequested · event:de-5 | Darf Vorarbeiter Zeiten direkt überschreiben? | Team 33, Rolle 16 | Mit Isa klären |
| Event Storming · TimesheetApproved · event:de-6 | Zusätzliche Büro-Zweitfreigabe erforderlich? | Ergänzung 45 | Mit Isa klären |
| Event Storming · WorkReportCreated · event:de-7 | Kopplung mit aktiver WorkSession als Vorschlag | Ergänzung 38 | Mit Isa klären |
| Event Storming · WorkReportSubmitted · event:de-8 | Fotopflicht für Bohrungen oder Regiearbeiten? | Team 11, Rolle 19 | Mit Isa klären |
| Event Storming · WorkReportCorrectionRequested · event:de-9 | Wer darf Korrekturen bei abwesendem Arbeiter vornehmen? | Ergänzung 51 | Mit Isa klären |
| Event Storming · WorkReportApproved · event:de-10 | Automatische Benachrichtigung an Büro | Team 38 | Mit Isa klären |
| Event Storming · PriceSnapshotLocked · event:de-11 | Genaue Hierarchie der Preislistenregeln | Rolle 50, Ergänzung 24 | Mit Isa klären |
| Event Storming · CustomerReviewLinkSent · event:de-12 | Gültigkeitsdauer des Links (z. B. 7 oder 14 Tage) | Ergänzung 40 | Mit Isa klären |
| Event Storming · CustomerReportConfirmed · event:de-13 | Reicht einfache Bestätigung oder digitale Signatur? | Ergänzung 41 | Mit Isa klären |
| Event Storming · CustomerReportSigned · event:de-14 | Unterschrift vor Ort auf Arbeiter-Gerät vs. Web-Link | Ergänzung 41 | Mit Isa klären |
| Event Storming · CustomerReportRejected · event:de-15 | Teilfreigabe einzelner Positionen zulassen? | Ergänzung 42 | Mit Isa klären |
| Event Storming · TripletexExportQueued · event:de-16 | Sofortiger Export vs. nächtlicher Batch-Lauf | Ergänzung 44 | Mit Isa klären |
| Event Storming · TripletexExportSucceeded · event:de-17 | Welche Rückmeldedaten in ISA persistiert werden | Ergänzung 49 | Mit Isa klären |
| Event Storming · TripletexExportFailed · event:de-18 | Automatischer Retry-Intervall und Alarmierung | Rolle 42, Team 24 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.1 | Kunden und Objekte: Daten, Anlage, Status und Zuordnung. | Team 6, Team 7, Rolle 6, Ergänzung 8 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.2 | Rapport, Rechnung, Zeitbezug und Korrekturen. | Team 9, Rolle 43, Team 25, Ergänzung 36, Ergänzung 38 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.3 | Preise, Rabatte, Einheiten und Zuschläge. | Rolle 45, Rolle 47, Rolle 50, Ergänzung 30 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.4 | Kundenantwort, Signatur, Ablehnung und verspätete Antwort. | Rolle 33, Rolle 35, Rolle 36, Rolle 37, Ergänzung 18, Ergänzung 39, Ergänzung 40, Ergänzung 42, Ergänzung 43, Ergänzung 44 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.5 | Arbeitszeitregeln, Pausen und Lohnkategorien. | Team 18, Rolle 13, Ergänzung 4, Ergänzung 16, Ergänzung 17 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.6 | Ankunft, HMS, Standort und fehlende Verbindung. | Team 19, Team 20, Rolle 12, Ergänzung 10, Ergänzung 11, Ergänzung 12, Ergänzung 13 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.7 | Tripletex-Übertragung, Rückmeldungen und Korrekturen. | Team 22, Team 23, Team 24, Rolle 39, Ergänzung 45, Ergänzung 47, Ergänzung 48, Ergänzung 49 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.8 | Vorarbeiterzugang und Zugriffsrechte. | Team 4, Rolle 24, Ergänzung 46 | Mit Isa klären |
| Kundengespräch RAW · §7 · raw:7.9 | Fotoformate und weitere Dateien. | Rolle 19, Ergänzung 21 | Mit Isa klären |
| Screenshot-Auswertung · 11.10.2026 · screenshots:1 | Welche alten Masken werden heute benötigt? | Team 27 | Mit Isa klären |
| Screenshot-Auswertung · 11.10.2026 · screenshots:2 | Was bedeuteten Q.mm / L.mm und die aktuellen Maße? | Rolle 45 | Mit Isa klären |
| Screenshot-Auswertung · 11.10.2026 · screenshots:3 | Wie werden Artikel, Maße und Zuschläge eingegeben; fehlt ein Sägebeispiel? | Rolle 18, Rolle 49, Ergänzung 22, Ergänzung 27 | Mit Isa klären |
| Screenshot-Auswertung · 11.10.2026 · screenshots:4 | Wer sieht und ändert Preise und versendet mit oder ohne Preis? | Team 4, Rolle 9, Ergänzung 33 | Mit Isa klären |
| Screenshot-Auswertung · 11.10.2026 · screenshots:5 | Was bedeutet Hjelpmann/ot beziehungsweise Timberarbeid? | Ergänzung 20 | Mit Isa klären |
| Screenshot-Auswertung · 11.10.2026 · screenshots:6 | Was gehört zu Interner-Timer? | Ergänzung 20 | Mit Isa klären |
| Screenshot-Auswertung · 11.10.2026 · screenshots:7 | Woher kommen Kunde, Kontakt, Projekt und Avd.nr? | Team 6, Rolle 2, Ergänzung 7 | Mit Isa klären |
| Screenshot-Auswertung · 11.10.2026 · screenshots:8 | Wie laufen Versand, Kundenantwort und Korrektur; gibt es eine Vorarbeiterfreigabe? | Ergänzung 32 | Mit Isa klären |
| Living Process Gate V0.2 · §3 · gate:1 | Ankunft/GPS/HMS/Offline | Ergänzung 10, Ergänzung 13 | Mit Isa klären |
| Living Process Gate V0.2 · §3 · gate:2 | Zeit/Pausen | Team 18, Team 33, Ergänzung 15, Ergänzung 16 | Mit Isa klären |
| Living Process Gate V0.2 · §3 · gate:3 | Rapport/Preis/Korrekturen | Rolle 46, Rolle 47, Rolle 48, Rolle 49, Rolle 50, Ergänzung 24, Ergänzung 25, Ergänzung 26, Ergänzung 28, Ergänzung 30, Ergänzung 31 | Mit Isa klären |
| Living Process Gate V0.2 · §3 · gate:4 | Kundenantwort und blockierte Folgeprozesse | Ergänzung 43, Ergänzung 44 | Mit Isa klären |
| Living Process Gate V0.2 · §3 · gate:5 | Tripletex/Rollen | Ergänzung 45 | Mit Isa klären |
| Event Storming QA V2 · P0 · qa:p0-1 | Pflichtfelder/Fotos | Team 11, Rolle 18, Rolle 19 | Mit Isa klären |
| Event Storming QA V2 · P0 · qa:p0-2 | RA/AA und Preisversion | Ergänzung 31 | Mit Isa klären |
| Event Storming QA V2 · P0 · qa:p0-3 | Zugriffsrechte | Team 4, Rolle 9 | Mit Isa klären |
| Event Storming QA V2 · P0 · qa:p0-4 | GPS-/Offline-Ausnahmen | Team 20, Team 21 | Mit Isa klären |
| Event Storming QA V2 · P0 · qa:p0-5 | Fahrt/Pausen/Überstunden | Team 18, Rolle 13 | Mit Isa klären |
| Event Storming QA V2 · P0 · qa:p0-6 | Signaturpflicht | Ergänzung 41 | Mit Isa klären |
| Event Storming QA V2 · P1 · qa:p1-1 | Mapping und Testkonto | Ergänzung 47, Ergänzung 50 | Team / Senior; technische Verifikation |
| Event Storming QA V2 · P1 · qa:p1-2 | Übertragung, Lesebestätigung und Korrekturen | Team 24, Rolle 42, Rolle 43 | Team / Senior; technische Verifikation |
| Event Storming QA V2 · P1 · qa:p1-3 | Rapport in Tripletex | Ergänzung 48 | Team / Senior; technische Verifikation |
| Event Storming QA V2 · P1 · qa:p1-4 | GPS, Offline und Datenschutz | Team 19, Team 20, Team 21, Team 26 | Team / Senior; technische Verifikation |
| Event Storming QA V2 · P1 · qa:p1-5 | Betrieb, Region und Backups | Ergänzung 58 | Team / Senior; technische Verifikation |
| Event Storming QA V2 · P1 · qa:p1-6 | Kundenlink, Versionen und Zustellung | Ergänzung 35, Ergänzung 40 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:customer-login | Kundenlogin oder Link? | Ergänzung 39 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:site-object | Reicht Site; Projekt oder Bauabschnitt? | Ergänzung 7 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:gps-history | GPS nur am Start/Ende oder Verlauf? | Ergänzung 14 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:geofence-owner | Wer legt Geofence an? | Ergänzung 11 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:reference-times | Referenzzeiten, Herkunft und Abweichungsgrenze? | Ergänzung 56 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:offline-duration | Wie lange ohne Netz? | Ergänzung 53 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:signature-policy | Muss jeder Rapport unterschrieben werden; welches Verfahren? | Ergänzung 41 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:mvp-surcharges | Welche Zuschläge braucht das MVP? | Ergänzung 26 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:tripletex-activities | Welche Aktivitäten braucht ProRiv? | Ergänzung 47 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:pilot-kill-criteria | Was stoppt den Piloten? | Ergänzung 57 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:price-rights | Wer sieht oder ändert Preise? | Team 4, Rolle 9 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:master-data | Welche Daten sind in welchem System führend? | Team 6, Rolle 38 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:radius | Welcher Geofence-Radius? | Team 19, Rolle 29 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:travel | Wie behandeln wir Reisezeit? | Team 18, Rolle 13 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:required-fields | Welche Angaben sind Pflicht? | Team 11, Rolle 18 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:correction | Wer ändert nach Versand und Export? | Team 24, Rolle 43 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:freeze-prices | Wann wird der Preis fixiert? | Rolle 50 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:sync-timing | Echtzeit oder gesammelte Übergabe? | Team 23, Rolle 40 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:export-documents | Rapport, PDF, Fotos oder Link in Tripletex? | Team 22, Rolle 39 | Mit Isa klären |
| Historische Event-Storming-Karte · keine Prozessfreigabe · diagram:mfa | Zusätzliche Absicherung für Admin? | Ergänzung 5 | Team / Senior; technische Verifikation |
| Event Storming KONSISTENT V2 · sechs Seiten · diagramv2:clock-in | Offline-Clock-in blockieren oder vorläufig vormerken und nachprüfen? | Ergänzung 11 | Mit Isa klären |
| Event Storming KONSISTENT V2 · sechs Seiten · diagramv2:workflow | Zeit- und Rapportfreigabe, Pflichtfelder und Preisrechte? | Team 4, Team 11, Rolle 9 | Mit Isa klären |
| Event Storming KONSISTENT V2 · sechs Seiten · diagramv2:time-rules | Standortumfang, Reisezeit, Offline und Ausnahmen? | Team 18, Team 19, Team 20, Team 21 | Mit Isa klären |
| Event Storming KONSISTENT V2 · sechs Seiten · diagramv2:price-rules | RA/AA, Mindestwerte, Zuschläge und Reihenfolge? | Rolle 46, Rolle 47, Rolle 49, Rolle 50 | Mit Isa klären |
| Event Storming KONSISTENT V2 · sechs Seiten · diagramv2:customer | Bestätigung oder Signatur; Berechtigung und Fristen? | Team 12, Team 36, Rolle 35 | Mit Isa klären |
| Event Storming KONSISTENT V2 · sechs Seiten · diagramv2:tripletex | API-Felder, Schreib-/Korrekturpfade und Rapportziel? | Team 22, Team 24, Rolle 39, Rolle 43 | Team / Senior; technische Verifikation |
| Event Storming KONSISTENT V2 · sechs Seiten · diagramv2:architecture | AWS-Ausprägung, Region, Backend, Kosten und Backups? | Team 44 | Team / Senior; technische Verifikation |
