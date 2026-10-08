# ISA / ProRiv – Senior Workshop (Research Navigator)

**Purpose:** A meeting-ready, bilingual (German/Russian) research and decision surface. **This repository is not the operational ProRiv employee application.**

## Current UI (October 2026)

1. **Original sketch:** The senior engineer's 6 circles remain the orientation anchor. Click **Senior-Workshop starten / Открыть мастерскую** for the actual meeting.
2. **Living Workshop:** Nine customer-grounded business process steps. Click one step for the context inspector. Customer statement, recommendation and open question are kept separate.
3. **Depth on demand:** Each step links to original senior questions, findings, OSS/commercial references, and the existing Event Storming research. No research categories have been deleted.
4. **Meeting notes:** Status **Offen / Zu prüfen / Entschieden**, actual answer, owner and next step. Click **Speichern**. Notes are stored locally in the same browser in IndexedDB.
5. **Export:** Use **Meeting-Protokoll** to download a Markdown copy. Also use **Recherche → Import / Export** to back up the full research database as JSON.
6. **Legacy research:** Old TopicDetailView, EventStormingHub, CompetitorHub and SeniorDecisionsHub remain under **Recherche**. Some historical design hypotheses are superseded and must not be interpreted as client approval.

## What the client actually described (conversation RAW; not an accepted spec)

- The worker records on-site arrival, start/end/pause and times per project.
- The worker records core-drilling/concrete-sawing quantities, photos, extras and prepares a priced work report.
- The **worker sends the report directly to the client** by SMS/email. The client may confirm, decline, comment or sign on site.
- Project hours should be transferred via API into **Tripletex**. The **foreman checks and approves hours in Tripletex**; the accounting team also works in Tripletex.
- Using the HMS card for the new app and the exact GPS/QR/attendance strategy are open.
- It is **not established** that a foreman must formally approve every report in ISA.
- Whether a client response is mandatory before payroll hours transfer remains open.
- Existing price tables, customer discounts, exact work quantities and legal work-hour limits need client/regulatory clarification.

This customer-interview knowledge comes from the supplied Russian-language RAW document. **Do not publish the original interview transcript, screenshots, prices or customer-specific files to a public GitHub repository without explicit consent.** This repository currently contains distilled workshop statements instead.

## OSS investigation

Source: user-supplied Deep Research report (8 October 2026). Research estimates and untested API details are **not implementation proofs**.

- **ODK Collect**: offline form prototype for reports (Apache-2.0).
- **Expo/React Native + SQLite**: proposed small mobile app and offline data store (Expo MIT; SQLite public domain).
- **ERPNext**: pricing rules/discounts reference, but adopting another ERP risks complexity (GPLv3).
- **Kimai / Solidtime**: OSS timesheet implementations, check AGPL obligations for deployment.
- **Traccar**: geolocation/server option only if point-in-time Expo Location is insufficient (Apache-2.0).
- **DocuSeal / Signature Pad**: signature tooling, license and suitability to verify.
- **pdfme**: PDF generator (MIT).
- **SmartDok, Jobbkontroll, CoreDocket, Connecteam, Dalux, PlanRadar, Fieldwire**: proprietary functional references; not OSS components.
- **Tripletex** and **AppSheet**: existing customer systems, not competitors to re-create.
- Senior's initial sketch names **React Native, AWS Cognito, AWS S3**; other stack suggestions are recommendations, not confirmed decisions.

Provenance of all tool/OSS examples is per workshop step in `src/data/workshopContent.ts`.

## Local preview

```sh
npm install
npm run dev
```

Then click `Senior-Workshop` or open the hash route `#/workshop`.

Quality checks:

```sh
npm run lint
npm run build
```

## Google AI Studio

This project lives on branch `main`. If your AI Studio Build project is already linked/imported from GitHub, **refresh or re-import/synchronize the repository's latest main branch**; GitHub edits are not guaranteed to appear automatically in an existing Studio preview. Open the Studio preview and use the original sketch's workshop button.

## Known limitations

- Meeting notes are **browser-local**, not shared across devices, browsers or AI Studio preview origins. Export before switching devices.
- The original sketch image is browser-uploaded, not bundled by default. Use the existing upload control if necessary.
- This is a source-code update; a deployment/test in the actual Google AI Studio environment must still be verified.
- Historical seed data remains for transparency and old locally saved records are not rewritten. The Workshop follows the newer customer interview where they conflict.
