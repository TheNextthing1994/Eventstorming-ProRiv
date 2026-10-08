# Team-Entwurf: Rollen, Baustellenzuordnung und Rapportfreigabe (09.10.2026)

> **Status: TEAM-HYPOTHESE / NOCH NICHT VOM KUNDEN BESTÄTIGT.**
> Dies ist eine strukturierte Ableitung aus zusätzlichen russischen Teamnotizen. Sie ist **kein akzeptierter Anforderungskatalog** und ersetzt nicht das Kundeninterview.
> **Entscheidung ausstehend:** Senior und Ansprechpartner/Kunde müssen Konflikte auflösen. Bis dahin keine Änderung des bestätigten Kundenprozesses im Living Workshop.

## Teamvorschlag (Originalbedeutung, keine behauptete Kundenzusage)

**Drei interne Rollen**
1. **Admin**: registriert Mitarbeiter; erstellt Objekte/Baustellen; ordnet Vorarbeiter zu; hat Übersicht über Baustellen, Vorarbeiter und Mitarbeiterarbeiten.
2. **Vorarbeiter / прораб**: lädt Mitarbeiter auf das Objekt ein, weist Arbeiten zu und benennt einen verantwortlichen Arbeiter für die Rapporterstellung. Kann Bericht und Tätigkeiten prüfen, an Kunden weiterleiten oder dem Verantwortlichen den direkten Versand überlassen. Genehmigt nach dem Teamvorschlag Arbeiten und Stunden für die spätere Lohnverarbeitung.
3. **Arbeiter / работник**: jeder erfasst Beginn, Ende, Pausen und zeitgestempelte Arbeitsschritte. Der vom Vorarbeiter benannte **Verantwortliche** erstellt den gemeinsamen Kundenrapport.

**Beispielhafter Teamablauf (Hypothese)**
Admin erstellt Objekt / weist Vorarbeiter zu
→ Vorarbeiter lädt Arbeiter ein / verteilt Aufgaben / benennt Rapport-Verantwortlichen
→ alle erfassen ihre eigene Zeit und Tätigkeit
→ Verantwortlicher erstellt Rapport
→ Vorarbeiter prüft Rapport; Versand entweder durch Vorarbeiter oder Verantwortlichen
→ Kunde bestätigt Bericht
→ Vorarbeiter kontrolliert Rapport + Stunden und gibt die Arbeit für die Lohnverarbeitung frei
→ Buchhaltung verarbeitet Lohn.

**Anwesenheit**: Arbeitnehmer sollen Ankunft nur am realen Baustellenobjekt melden können. Wie dies bei schlechtem GPS, Offline-Betrieb, QR/HMS oder Ausnahmen erfolgt, bleibt offen.

## Abweichung zum bisherigen Kundengespräch (RAW, vorläufig)

| Thema | Bisheriger Kundenstand | Neue Team-Hypothese | Verifikation |
| --- | --- | --- | --- |
| Mitarbeiterrechte | Festangestellte dürfen alle Berichte erstellen und selbst absenden | Benannter Verantwortlicher für Bericht | Sind Berechtigungen gleich oder gibt es dynamische Baustellenrollen? |
| Rapportversand | Arbeiter sendet direkt an Kunden | Vorarbeiter oder verantwortlicher Arbeiter | Wer darf final senden, ist Genehmigung nötig? |
| Rapportprüfung | Keine obligatorische Vorarbeiter-/Bürofreigabe bestätigt | Vorarbeiter kontrolliert Rapport | Nur Plausibilitätsprüfung oder Pflicht-Gate? |
| Stundenfreigabe | Vorarbeiter prüft/genehmigt in **Tripletex** | Vorarbeiter gibt Arbeit/Stunden für Buchhaltung frei; Ort nicht spezifiziert | Tripletex bleibt Genehmigungsort oder ISA-Freigabe neu gewünscht? |
| Kunde antwortet | Bestätigen/ablehnen/kommentieren; Einfluss auf Stundenprüfung offen | Kunde bestätigt vor finaler Kontrolle/Genehmigung | Ist Antwort zwingende Voraussetzung? Was bei Ablehnung/Nichtantwort? |
| Admin | Administration für ISA noch klärungsbedürftig | Registriert Beschäftigte, Baustellen, Vorarbeiter | Muss ProRiv Admin dies in ISA oder in bestehendem System tun? |
| Aufgabenplanung | Noch keine bestätigte Pflichtzuweisung | Vorarbeiter lädt ein und verteilt Aufgaben | Reicht Projektzuweisung oder braucht es Task-Workflow? |

## Weitere Marktvorbilder aus den Teamnotizen (noch nicht technisch validiert)

- **Saby Mobile Workers** — https://saby.ru/mobile_workers — Vorbild für `Auftrag → Tätigkeit mit Geodaten → Foto-/Erledigungsbericht`. **Neu im Vergleich zu früheren ISA-Notizen.**
- **CoreDocket** — https://www.coredocket.com.au/ — bisher bekannt; konkrete Betonbohr- und Sägeformulare, Maße, Mengen und Preisberechnung als zu testendes Fachvorbild.
- **SmartDok / Tripletex** — https://www.tripletex.no/integrasjoner/smartdok/ — bisher bekannt; offizieller Integrationslink ist als neuer konkreter Belegpfad genannt. **Genauen Integrationsfluss und Genehmigungsort gesondert prüfen.**
- **Connecteam** — https://help.connecteam.com/en/articles/6609176-set-up-guide-for-cleaning-companies-operations-hub — bisher bekannt; genaue Geofence-Policy (Blockade bei schlechter Position) für ProRiv erst entscheiden.

## Klärungsliste für Senior und Kunde

1. Sind `Admin`, `Vorarbeiter`, `Arbeiter` drei **ISA-Rollen** oder nur organisatorische Rollen? Kunde ist externe Bestätigungsrolle.
2. Hat jeder Arbeiter Rapport-Recht? Was bedeutet `verantwortlicher Arbeiter` — Aufgabe oder exklusive technische Berechtigung?
3. Wer kann Rapport final absenden? Ist eine Vorarbeiterprüfung Pflicht? Wie wird delegiert?
4. Findet die Genehmigung der Stunden **ausschließlich in Tripletex** statt? Sollen Rapporte zur Prüfung verlinkt werden?
5. Ist Kundenbestätigung ein echtes Blocker-Gate für Stundenexport/Lohn oder ein eigener unabhängiger Prüfpfad?
6. Wer pflegt Mitarbeiter/Baustellen/Zuordnungen, und welches System ist das Stammdatensystem?
7. Wie genau wird die Ankunft vor Ort technisch verifiziert (GPS, QR, HMS, vorhandene Baustellenliste), inklusive Ausnahmen?

## Provenance- und Integrationsregel

- Quelle: zusätzliche Teamnotizen in russischer Sprache, vom Nutzer am 09.10.2026 in der Unterhaltung bereitgestellt.
- `certaintyState = PROPOSED_BY_TEAM`, **nicht** `CONFIRMED_BY_CUSTOMER`.
- Solange kein Abgleich mit dem Kunden vorliegt, in Prozesskarte/Architecture/Permissions **als alternative Variante** darstellen, nicht automatisch den bisherigen Kundenstand überschreiben.
- Saby und Links gehören in die Research-Schicht; Herstellerbehauptungen bleiben unbestätigt, bis externe Quellen/Testfälle verifiziert sind.
