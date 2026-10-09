import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareSddHandoff } from '../src/utils/sddHandoff';
import type { DatabaseState, SeniorQuestion, TopicId } from '../src/types';
import type { WorkshopNotes } from '../src/db/indexedDb';

const topicIds: TopicId[] = ['users','clients','raport','vremya','api','mobile-app'];
const state = {
  topics: Object.fromEntries(topicIds.map(id => [id,{id,summary:'',updatedAt:''}])),
  questions: [],
  findings: [{
    id:'finding-1',topicId:'vremya',title:'Example research',content:'NOT independently verified',
    origin:'competitor_research',status:'externally_unverified',sourceUrl:'https://example.org',createdAt:'',updatedAt:''
  }],
  competitors: [],
  recommendations: [],
  openPoints: [],
  decisions: [],
  attachments: [{
    id:'att-1',topicId:'vremya',title:'Big evidence file',type:'file',
    fileData:'VERY-LARGE-SECRET-BINARY-BLOB',createdAt:''
  }],
  hotspotSettings: Object.fromEntries(topicIds.map(id => [id,{x:50,y:50,radius:8}])),
  customImage: 'DATA-IMAGE-DO-NOT-COPY'
} as DatabaseState;

const question: SeniorQuestion = {
  id:'q-example',topicId:'vremya',question:'Who is responsible?',
  clientQuestion:'Which entity operates the electronic list?',
  isResolved:false,createdAt:'',updatedAt:'',origin:'project_context'
};

const notes: WorkshopNotes = {
  arrival: {
    status:'decided',
    answer:'The Senior accepted the limited-scope recommendation for further review',
    revisedCustomerFact:'Updated interview interpretation recorded during meeting',
    revisedRecommendation:'Use the existing electronic HMS presence list; do not build another one',
    owner:'Isa',
    nextStep:'Confirm responsible site operator with customer',
    updatedAt:'2026-10-09T00:00:00.000Z'
  }
};

test('handoff follows SDD-GEN draft and raw templates without auto-acceptance', () => {
  const output = prepareSddHandoff(state,[question],notes);
  assert.match(output.globalDraft,/id: SPEC-GLOBAL-001/);
  assert.match(output.globalDraft,/type: GlobalSpec/);
  assert.match(output.globalDraft,/status: Draft/);
  assert.doesNotMatch(output.globalDraft,/status: Accepted/);
  assert.match(output.globalDraft,/<!-- isolated-agent-review-required -->/);
  for (const heading of ['Purpose','Client','Users','Usage Context','Goals','Macro Functional Scope'])
    assert.ok(output.globalDraft.includes('## '+heading),heading);
  for (const heading of ['Client Brief','Business Context','Users','Ideas','Decisions','Hypotheses','Open Questions','Notes To Not Forget'])
    assert.ok(output.rawKnowledge.includes('## '+heading),heading);
  assert.equal(output.stats.decidedWorkshopSteps,1);
  assert.equal(output.stats.unresolvedClientQuestions,1);
});

test('preserves original evidence separately from revised facts, notes and proposals', () => {
  const output = prepareSddHandoff(state,[question],notes);
  assert.ok(output.rawKnowledge.includes('Updated interview interpretation recorded during meeting'));
  assert.ok(output.rawKnowledge.includes('The Senior accepted the limited-scope recommendation'));
  assert.ok(output.rawKnowledge.includes('Confirm responsible site operator with customer'));
  assert.ok(output.rawKnowledge.includes('Use the existing electronic HMS presence list'));
  assert.ok(output.rawKnowledge.includes('Kundengespräch RAW'));
  assert.ok(output.globalDraft.includes('Recorded decision WS:arrival'));
  assert.ok(output.globalDraft.includes('OPEN [Q:q-example]'));
  assert.ok(output.rawKnowledge.includes('NOT independently verified'));
  assert.ok(output.rawKnowledge.includes('HISTORICAL DESIGN DRAFT'));
  assert.ok(output.rawKnowledge.includes('historical') || output.rawKnowledge.includes('Historical'));
});

test('does not include binary attachments or oversized images in markdown exports', () => {
  const output = prepareSddHandoff(state,[question],notes);
  assert.doesNotMatch(output.rawKnowledge,/VERY-LARGE-SECRET-BINARY-BLOB/);
  assert.doesNotMatch(output.rawKnowledge,/DATA-IMAGE-DO-NOT-COPY/);
  assert.match(output.rawKnowledge,/"binaryFileOmitted": true/);
});
