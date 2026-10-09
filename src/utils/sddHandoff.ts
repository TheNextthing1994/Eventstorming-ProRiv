/**
 * SDD-GEN workshop handoff: a reproducible snapshot, NOT an accepted spec.
 *
 * Sources: the in-app project database, original workshop process statements,
 * historical event-storming working model, and the current browser notes.
 * All original evidence remains separate from interpretations/proposals.
 *
 * Schema authority:
 * - templates/raw-project-knowledge.md
 * - templates/spec-global.md
 * - specs/accepted/SPEC-FEATURE-001-spec-lifecycle.md
 */
import { DatabaseState, SeniorQuestion, TopicId } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { DOMAIN_EVENTS_LIST, MVP_STRATEGIC_STATEMENT, SENIOR_DECISION_QUESTIONS } from '../db/knowledgeSeed';
import { WORKSHOP_STEPS } from '../data/workshopContent';
import { EVENT_STORMING_LEGACY_RULES, EVENT_STORMING_LEGACY_EXCEPTIONS } from '../data/eventStormingLegacy';
import type { WorkshopNotes } from '../db/indexedDb';

export interface SddHandoff {
  createdAt: string;
  rawKnowledge: string;
  globalDraft: string;
  stats: {
    workshopSteps: number;
    decidedWorkshopSteps: number;
    decidedArchitectureQuestions: number;
    unresolvedClientQuestions: number;
    historicalEvents: number;
    sourceRecords: number;
  };
}

const NL = '\n';
const MISSING = '[TO CONFIRM with Senior and Isa]';
const areaNames: { topic: TopicId; name: string }[] = [
  { topic: 'mobile-app', name: 'Mobile application and offline use' },
  { topic: 'users', name: 'User roles and access control' },
  { topic: 'vremya', name: 'On-site work sessions and timesheets' },
  { topic: 'raport', name: 'Work reporting, drilling and cutting measurements' },
  { topic: 'clients', name: 'Customer review, approval and communication' },
  { topic: 'api', name: 'External integrations, exports and Tripletex' }
];

function paragraph(value: string | undefined): string {
  return (value || '').trim() || '[Not recorded]';
}

function line(value: string | undefined): string {
  return paragraph(value).replace(/\r?\n/g, ' / ');
}

function entry(id: string, title: string, detail: string): string {
  return '- **[' + id + '] ' + line(title) + '** — ' + line(detail);
}

function jsonSection(name: string, record: unknown): string {
  const fence = String.fromCharCode(96).repeat(4);
  return '### ' + name + NL + NL + fence + 'json' + NL +
    JSON.stringify(record, null, 2) + NL + fence;
}

function noteStatus(note: WorkshopNotes[string] | undefined): string {
  return note?.status === 'decided' ? 'Marked decided in local workshop' :
    note?.status === 'test' ? 'Needs testing / review' : 'Open or not reviewed';
}

export function prepareSddHandoff(
  state: DatabaseState,
  liveQuestions: SeniorQuestion[],
  liveNotes: WorkshopNotes
): SddHandoff {
  const createdAt = new Date().toISOString();
  const openClient = liveQuestions.filter(q =>
    (q.needsClientClarification || !!(q.clientQuestion || q.clientQuestionRu)?.trim()) && !q.isResolved);
  const decidedSteps = WORKSHOP_STEPS.filter(step => liveNotes[step.id]?.status === 'decided');
  const decidedArchitecture = SENIOR_DECISION_QUESTIONS.filter(q =>
    liveNotes['arch:' + q.id]?.status === 'decided');
  const pendingSteps = WORKSHOP_STEPS.filter(step => liveNotes[step.id]?.status !== 'decided');
  const pendingArchitecture = SENIOR_DECISION_QUESTIONS.filter(q =>
    liveNotes['arch:' + q.id]?.status !== 'decided');

  // Raw knowledge follows the exact SDD-GEN raw template headings.
  // The supplementary inventory makes every transferred claim traceable,
  // while preserving unverified and historical entries as such.
  const raw: string[] = [
    '# Raw project knowledge',
    '',
    '**Project:** ProRiv (Isa\'s Projekt) — provisional client-specific source material.',
    '**Snapshot created (UTC):** ' + createdAt,
    '**Authority:** TEMPORARY RAW INPUT, NOT an accepted specification or a verified customer transcript.',
    '**Language:** English framing; interview/source quotations are retained verbatim in their original languages.',
    '**Evidence caution:** Historical Event Storming rules, research results and seed decisions are proposals until independently confirmed. A local "decided" selection is a meeting record, not an SDD-GEN Accepted status.',
    '**Binary media:** Original image data and attachment fileData are not embedded in this Markdown; attachment metadata and URLs are included below. Preserve original media separately.',
    '',
    'The material below must be reviewed, reconciled, then classified as incorporated, duplicate, rejected, obsolete or deferred before the temporary raw source is retired.',
    '',
    '## Client Brief',
    '',
    'Working client label: ProRiv AS / Isa\'s Projekt. Domain: concrete drilling and sawing on Norwegian construction sites (project context, needs customer confirmation).',
    'Client-approved scope, funding, deployment and compliance responsibility: ' + MISSING + '.',
    '',
    '## Business Context',
    '',
    'Interview-derived working process: worker arrival, work sessions and breaks, concrete drilling/sawing activity, reporting, customer handling and coordination with Tripletex. The exact sequence and owners require customer validation.',
    'The historical Event Storming process can conflict with newer interview findings. It is exported below explicitly as a HISTORICAL DESIGN DRAFT, not current customer authority.',
    '',
    '## Users',
    '',
    'Candidate roles (working model; unapproved): worker, foreman, office/admin, external customer.',
    'Exact permissions, approval hierarchy, use of company phones versus BYOD: ' + MISSING + '.',
    '',
    '## Ideas',
    '',
    'The following are workshop product proposals, not automatically approved requirements:',
    ...WORKSHOP_STEPS.map(s => entry('WS:' + s.id, s.title,
      'Proposed: ' + (liveNotes[s.id]?.revisedRecommendation ?? s.recommendation) +
      ' | ' + noteStatus(liveNotes[s.id]) + ' | Source: ' + s.source)),
    '',
    'Additional product recommendations from the repository are preserved verbatim in the evidence inventory; origin and knowledge status must be inspected before adoption.',
    '',
    '## Decisions',
    '',
    'Locally marked workshop decisions (NOT automatically client-accepted):',
    ...(decidedSteps.map(s => entry('WS:' + s.id, s.title,
      'Discussion result: ' + paragraph(liveNotes[s.id]?.answer) +
      ' | Owner: ' + paragraph(liveNotes[s.id]?.owner) +
      ' | Next: ' + paragraph(liveNotes[s.id]?.nextStep)))),
    ...(decidedArchitecture.map(q => entry('ARCH:' + q.id, q.question,
      'Discussion result: ' + paragraph(liveNotes['arch:' + q.id]?.answer)))),
    ...(decidedSteps.length + decidedArchitecture.length === 0 ? ['- No explicitly decided workshop entries yet.'] : []),
    '',
    'Repository decision records (include older imported/seed decisions and may NOT be client-approved):',
    ...state.decisions.map(d => entry('DEC:' + d.id, d.title,
      'Recorded status: ' + d.status + ' | Origin: ' + (d.origin || 'not recorded') +
      ' | Rationale: ' + d.rationale)),
    '',
    '## Hypotheses',
    '',
    'Original interview summaries are NOT signed customer facts. The revised versions are working interpretations, not automatic corrections of the source:',
    ...WORKSHOP_STEPS.map(s => entry('WS:' + s.id, s.title,
      'Original interpretation: ' + s.customerFact +
      ' | Current working interpretation: ' + (liveNotes[s.id]?.revisedCustomerFact ?? s.customerFact) +
      ' | Status: ' + noteStatus(liveNotes[s.id]))),
    '',
    'Historical event model, inferred business policies, technical architecture proposals and competitor observations are kept in the inventory as provisional source records.',
    '',
    '## Open Questions',
    '',
    'Workshop process questions:',
    ...WORKSHOP_STEPS.map(s => entry('WS:' + s.id, s.title,
      s.openQuestion + ' | ' + noteStatus(liveNotes[s.id]))),
    '',
    'Client questions:',
    ...liveQuestions.filter(q => q.needsClientClarification || !!(q.clientQuestion || q.clientQuestionRu)?.trim())
      .map(q => entry('Q:' + q.id, q.clientQuestion || q.question,
        'Status: ' + (q.isResolved ? 'marked resolved' : 'open') +
        ' | Discussion: ' + paragraph(q.notes) +
        ' | Origin: ' + (q.origin || 'not documented'))),
    '',
    'Additional architecture questions:',
    ...SENIOR_DECISION_QUESTIONS.map(q => entry('ARCH:' + q.id, q.question,
      'Current proposal: ' + q.currentProposal +
      ' | ' + noteStatus(liveNotes['arch:' + q.id]))),
    '',
    'Open-point register:',
    ...state.openPoints.map(p => entry('OP:' + p.id, p.question,
      'Status: ' + (p.isResolved ? 'marked resolved' : 'open') +
      ' | Clarify with: ' + p.clarifyWith +
      ' | Resolution: ' + paragraph(p.resolutionNote))),
    '',
    '## Notes To Not Forget',
    '',
    'Agreed or assigned follow-up fields as recorded in workshop notes (recorded does not mean contractually agreed):',
    ...Object.entries(liveNotes).filter(([,n]) => !!n.nextStep?.trim())
      .map(([id,n]) => entry('NOTE:' + id, n.nextStep, 'Owner: ' + paragraph(n.owner))),
    '',
    'Never infer HMS register ownership, vendor/API availability, the mandatory approval hierarchy, data-retention requirements or the validity of GPS controls from unverified notes. Check applicable law and actual client operation before changing project scope.',
    '',
    '## Source Inventory (evidence, not accepted specifications)',
    '',
    'Complete textual records from the current browser state and project code. Retained as source evidence; do not treat array membership, imported statuses, or links as verification.',
    jsonSection('Workshop source steps (verbatim historical summaries, proposals, evidence and alternatives)', WORKSHOP_STEPS),
    jsonSection('Current workshop annotations (local, editable; status does not imply SDD acceptance)', liveNotes),
    jsonSection('Senior architecture questions (proposals, not accepted)', SENIOR_DECISION_QUESTIONS),
    jsonSection('Live senior and client questions (including locally edited answers)', liveQuestions),
    jsonSection('Domain Event Storming catalogue (unapproved working model)', DOMAIN_EVENTS_LIST),
    jsonSection('Historical Event Storming business rules (not customer-verified)', EVENT_STORMING_LEGACY_RULES),
    jsonSection('Historical Event Storming exceptions (not customer-verified)', EVENT_STORMING_LEGACY_EXCEPTIONS),
    jsonSection('Original project strategic MVP working statement (not accepted)', MVP_STRATEGIC_STATEMENT),
    jsonSection('Original topic metadata / sketch descriptions', TOPIC_DEFINITIONS),
    jsonSection('Edited topic summaries', state.topics),
    jsonSection('Research findings (observe origin/status and source URLs)', state.findings),
    jsonSection('Competitor research (observe origin/status and source links)', state.competitors),
    jsonSection('Product recommendations (unapproved unless explicitly verified)', state.recommendations),
    jsonSection('Open-point register', state.openPoints),
    jsonSection('Repository decision records (imported and local; status alone is not customer approval)', state.decisions),
    jsonSection('Attachment metadata (raw fileData excluded)', state.attachments.map(({ fileData, ...metadata }) => ({
      ...metadata,
      binaryFileOmitted: !!fileData
    }))),
    jsonSection('Original hotspot coordinate layout (UI reference only)', state.hotspotSettings),
    '',
    '## Extraction checklist — NOT YET COMPLETE',
    '',
    '- [ ] Senior and client confirm business context, personas and product scope.',
    '- [ ] Resolve or explicitly defer important open questions and conflicting legacy assumptions.',
    '- [ ] Independently verify source claims, vendor capabilities and legal requirements.',
    '- [ ] Extract macro requirements to SPEC-GLOBAL-001 and functional details to feature specs.',
    '- [ ] Independently review the global draft, resolve review notes, obtain human acceptance.',
    '- [ ] Register accepted specs in specs/accepted/manifest.json and run the SDD validator.',
    '- [ ] Classify every unique raw source item before retiring this temporary raw-knowledge file.',
    ''
  ];

  // The project Global Spec deliberately uses the unmodified SDD-GEN
  // metadata/header and its six sections. The raw inventory retains details.
  // Never promote unresolved interview summaries into accepted requirements.
  const global: string[] = [
    '---',
    'id: SPEC-GLOBAL-001',
    'type: GlobalSpec',
    'status: Draft',
    'title: ProRiv AS — global project specification (review draft)',
    'parent: null',
    'depends_on: []',
    'related_specs: []',
    'work_area: specs',
    '---',
    '',
    '# ProRiv AS — global project specification',
    '',
    '> **SDD-GEN DRAFT — NOT ACCEPTED.** This draft was assembled mechanically from workshop and research source records. Its content is a proposed interpretation, not signed-off customer scope. See project-knowledge/raw/RAW_PROJECT_KNOWLEDGE_CLIENT.md for the evidence inventory, original notes, statuses and unresolved contradictions.',
    '> Snapshot (UTC): ' + createdAt,
    '',
    '## Purpose',
    '',
    'Working purpose (requires confirmation): establish a lean digital execution workflow for a Norwegian concrete-drilling and sawing business. The application should support on-site time and work reporting without replacing existing accounting/ERP systems.',
    '',
    'This statement is inferred from project summaries and proposals (not an approved client brief).',
    '',
    '## Client',
    '',
    '- Working customer: ProRiv AS (also called Isa\'s Projekt).',
    '- Domain described in the project: concrete drilling, wall/floor cutting and associated construction-site services.',
    '- Legal contracting entity, project owner, decision authority and any main-contractor/subcontractor/HMS obligations: ' + MISSING + '.',
    '- Evidence: current project workshop source records (WS:arrival, WS:time, WS:work); confirmation outstanding.',
    '',
    '## Users',
    '',
    '- Candidate: on-site workers — work-session and performed-work data entry.',
    '- Candidate: foremen — review of exceptions and time entries when authorized.',
    '- Candidate: office/administration — operational oversight, pricing and integrations.',
    '- Candidate: external customer — review of submitted work reports where applicable.',
    '- Role counts, responsibilities, access control and exact handoffs are OPEN and must be validated with Isa.',
    '- Evidence: original topic USERS, workshop steps and senior client questions.',
    '',
    '## Usage Context',
    '',
    '- Candidate usage: mobile devices on Norwegian construction sites, including locations with poor connectivity.',
    '- Proposed workflow: worksite selection/arrival, work time and breaks, field measurements and photos, work reports, customer interaction, and transfer of approved information to existing systems.',
    '- External products (including Tripletex), network support, device ownership, retention, signatures, location checks and mandatory electronic HMS lists require individual confirmation before implementation.',
    '- The historical Event Storming model is a proposal and does not override newer interview information.',
    '',
    '## Goals',
    '',
    '- **Proposed:** reduce manual work and duplicate entry for field workers and the office.',
    '- **Proposed:** reliably capture job time and concrete drilling/sawing reports, including exceptions and later corrections.',
    '- **Proposed:** keep hours and work-report approvals distinguishable when required by the validated business process.',
    '- **Proposed:** integrate with existing systems after API, data-ownership and approval requirements are verified.',
    '- **Acceptance gate:** Senior and Isa must validate which goals belong to the real MVP. No goal above is marked accepted merely by being present here.',
    '',
    '## Macro Functional Scope',
    '',
    'These are **candidate feature areas**, not approved implementation commitments:',
    ''
  ];

  for (const area of areaNames) {
    const steps = WORKSHOP_STEPS.filter(s => s.topicId === area.topic);
    const topic = TOPIC_DEFINITIONS[area.topic];
    global.push('- **' + area.name + '** (topic ' + area.topic + ') — project working area: ' +
      line(topic.shortDescription) +
      (steps.length ? '; evidence: ' + steps.map(s => 'WS:' + s.id).join(', ') : '; evidence: topic metadata only') + '.');
  }

  global.push(
    '',
    '### Workshop outcome references (not automatic spec acceptance)',
    '',
    '- Workshop process steps explicitly marked decided: ' + decidedSteps.length + ' of ' + WORKSHOP_STEPS.length + '.',
    '- Architecture questions explicitly marked decided: ' + decidedArchitecture.length + ' of ' + SENIOR_DECISION_QUESTIONS.length + '.',
    ...(decidedSteps.map(s => '- Recorded decision WS:' + s.id + ': ' +
      line(liveNotes[s.id]?.answer) + ' (local meeting status only; verify scope).')),
    ...(decidedArchitecture.map(q => '- Recorded architecture decision ARCH:' + q.id + ': ' +
      line(liveNotes['arch:' + q.id]?.answer) + ' (local meeting status only).')),
    '',
    '### Blocking open questions and proposed feature handoff',
    '',
    '- Unresolved client questions: ' + openClient.length + '. Open process steps: ' + pendingSteps.length +
      '. Open architecture questions: ' + pendingArchitecture.length + '.',
    ...openClient.slice(0,12).map(q =>
      '- OPEN [Q:' + q.id + ']: ' + line(q.clientQuestion || q.question)),
    ...(openClient.length > 12 ? ['- Additional open questions are indexed in Raw Project Knowledge.'] : []),
    '- Derive separate Feature Specs and SubFeature Specs only after requirements are clarified and this Global Spec is accepted.',
    '- Derive Technical Specs from accepted functional requirements; architecture proposals here are not implementation orders.',
    '- SDD-GEN requires independent draft review, human acceptance, registration in specs/accepted/manifest.json and validation before this document becomes authoritative.',
    '',
    '<!-- isolated-agent-review-required -->',
    ''
  );

  const stats = {
    workshopSteps: WORKSHOP_STEPS.length,
    decidedWorkshopSteps: decidedSteps.length,
    decidedArchitectureQuestions: decidedArchitecture.length,
    unresolvedClientQuestions: openClient.length,
    historicalEvents: DOMAIN_EVENTS_LIST.length,
    sourceRecords: liveQuestions.length + state.findings.length + state.competitors.length +
      state.recommendations.length + state.openPoints.length + state.decisions.length +
      state.attachments.length + WORKSHOP_STEPS.length + SENIOR_DECISION_QUESTIONS.length +
      DOMAIN_EVENTS_LIST.length + EVENT_STORMING_LEGACY_RULES.length + EVENT_STORMING_LEGACY_EXCEPTIONS.length
  };
  return {
    createdAt,
    rawKnowledge: raw.join(NL),
    globalDraft: global.join(NL),
    stats
  };
}
