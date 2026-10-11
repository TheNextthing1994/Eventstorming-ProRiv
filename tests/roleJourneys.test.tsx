import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RoleJourneyWorkshop } from '../src/components/RoleJourneyWorkshop';
import { ADMIN_JOURNEY_STEPS, ROLE_JOURNEYS, journeyQuestionKey } from '../src/data/roleJourneys';
import { WORKSHOP_STEPS } from '../src/data/workshopContent';
import { ROLE_INTERACTIONS, interactionsBetween, interactionForAdminStep } from '../src/data/roleInteractions';
import { changeWorkshopNote, readWorkshopRoute, roleJourneyMarkdown } from '../src/utils/roleWorkshop';
import type { DatabaseState, Language } from '../src/types';
import type { WorkshopNotes } from '../src/db/indexedDb';
import { roleKnowledgeItems, roleKnowledgeState, roleQuestions, roleRights } from '../src/data/roleKnowledge';

test('existing process bookmarks survive, role deep links select a validated role and step', () => {
  assert.equal(readWorkshopRoute('#/workshop').mode, 'process');
  assert.deepEqual(readWorkshopRoute('#/workshop/admin/report-policy'), { mode: 'roles', roleId: 'admin', stepId: 'report-policy' });
  assert.deepEqual(readWorkshopRoute('#/workshop/admin/typo'), { mode: 'roles', roleId: 'admin', stepId: undefined });
  assert.equal(readWorkshopRoute('#/workshop/typo').mode, 'process');
  assert.equal(readWorkshopRoute('#/workshop/foreman').roleId, 'foreman');
  assert.equal(readWorkshopRoute('#/workshop/roles').roleId, undefined);
  assert.equal(readWorkshopRoute('#/workshop/roles').mode, 'roles');
  assert.equal(readWorkshopRoute('#/workshop/admin/interaction/invitation').interactionId, 'invitation');
  assert.equal(readWorkshopRoute('#/workshop/worker/interaction/site-handover').interactionId, undefined);
});

test('editing role answers preserves legacy notes and prevents empty decisions', () => {
  const legacy = { status: 'decided' as const, answer: 'Existing meeting outcome', owner: 'Senior', nextStep: 'Verify', updatedAt: 'old' };
  const notes: WorkshopNotes = { arrival: legacy, 'arch:original': legacy };
  const key = journeyQuestionKey('admin', 'report-policy', 'sender');
  const answered = changeWorkshopNote(notes, key, { answer: 'Isa chooses direct worker dispatch', status: 'decided' });
  assert.equal(answered.arrival, legacy);
  assert.equal(answered['arch:original'], legacy);
  assert.equal(notes[key], undefined);
  assert.equal(answered[key].status, 'decided');
  const reopened = changeWorkshopNote(answered, key, { answer: '  ' });
  assert.equal(reopened[key].status, 'open');
  assert.equal(answered[key].answer, 'Isa chooses direct worker dispatch');
});

test('all admin questions have unique storage keys and transitions reference existing roles/processes', () => {
  const keys = ADMIN_JOURNEY_STEPS.flatMap(step => step.questions.map(q => journeyQuestionKey('admin', step.id, q.id)));
  assert.equal(new Set(keys).size, keys.length);
  for (const step of ADMIN_JOURNEY_STEPS) {
    if (step.targetRole) assert.ok(ROLE_JOURNEYS.some(role => role.id === step.targetRole));
    if (step.processStepId) assert.ok(WORKSHOP_STEPS.some(process => process.id === step.processStepId));
  }
});

test('meeting export retains conflicting source answers, Russian questions and actual meeting outcomes separately', () => {
  const key = journeyQuestionKey('admin', 'report-policy', 'sender');
  const notes = changeWorkshopNote({}, key, { answer: 'Isa: foreman reviews first', status: 'decided', owner: 'Isa', nextStep: 'Confirm with Senior' });
  const exported = roleJourneyMarkdown(notes);
  assert.ok(exported.includes('Gespräch: Arbeiter sendet direkt.'));
  assert.ok(exported.includes('Team-Entwurf: Vorarbeiter prüft'));
  assert.ok(exported.includes('Рабочий отправляет рапорт прямо клиенту'));
  assert.ok(exported.includes('Isa: foreman reviews first'));
  assert.ok(exported.includes('**Nächster Schritt:** Confirm with Senior'));
  assert.ok(exported.includes('keine formelle Kundenfreigabe'));
  assert.ok(exported.includes('**Meeting-Status:** Offen'));
});

function render(language: Language, notes: WorkshopNotes = {}, stepId = 'report-policy', loaded = true) {
  return renderToStaticMarkup(<RoleJourneyWorkshop
    language={language} roleId="admin" stepId={stepId} notes={notes}
    databaseState={{ questions: [] } as unknown as DatabaseState} loaded={loaded} saveStatus="idle"
    onNavigate={() => {}} onOpenProcess={() => {}} onSelectTopic={() => {}}
    onUpdateNote={() => {}} onSave={async () => {}}
  />);
}

test('the role map keeps the selected perspective and shows source alternatives in both languages', () => {
  const de = render('de');
  assert.ok(de.includes('Ausgewählte Rolle: Admin'));
  assert.ok(de.includes('Zusammenarbeit ansehen: Admin ↔ Arbeiter'));
  assert.ok(de.includes('Zusammenarbeit ansehen: Admin ↔ Vorarbeiter'));
  assert.ok(de.includes('Arbeiter → Kunde'));
  assert.ok(de.includes('Arbeiter → Vorarbeiter → Kunde'));
  const ru = render('ru');
  assert.ok(ru.includes('Рабочий → Клиент'));
  assert.ok(ru.includes('Рабочий → Прораб → Клиент'));
  const dual = render('bilingual');
  assert.ok(dual.includes('Schickt der Arbeiter den Rapport direkt'));
  assert.ok(dual.includes('Рабочий отправляет рапорт прямо клиенту'));
});

test('a failed or pending load leaves answer fields disabled and seed answers never count as decisions', () => {
  const html = render('de', {}, 'report-policy', false);
  assert.ok(html.includes('<textarea disabled=""'));
  assert.ok(html.includes('0 / 28'));
});

test('every relation resolves to existing notes; changing perspective reuses the same underlying source', () => {
  for (const relation of ROLE_INTERACTIONS) {
    assert.equal(relation.participants.length, 2);
    assert.notEqual(relation.participants[0], relation.participants[1]);
    if (relation.adminStepId) assert.ok(ADMIN_JOURNEY_STEPS.some(step => step.id === relation.adminStepId));
    if (relation.processStepId) assert.ok(WORKSHOP_STEPS.some(step => step.id === relation.processStepId));
    assert.ok(interactionsBetween(...relation.participants).includes(relation));
    assert.ok(interactionsBetween(relation.participants[1], relation.participants[0]).includes(relation));
  }
  const reachable = new Set(ROLE_INTERACTIONS.map(r => r.adminStepId));
  for (const step of ADMIN_JOURNEY_STEPS) assert.ok(['access', 'company'].includes(step.id) || reachable.has(step.id), step.id);
  assert.equal(interactionForAdminStep('invite')?.id, 'invitation');
});

test('the initial page shows three role symbols and does not open a questionnaire before a role or relationship is selected', () => {
  const html = renderToStaticMarkup(<RoleJourneyWorkshop
    language="de" notes={{}} databaseState={{ questions: [] } as unknown as DatabaseState}
    loaded saveStatus="idle" onNavigate={() => {}} onOpenProcess={() => {}} onSelectTopic={() => {}}
    onUpdateNote={() => {}} onSave={async () => {}}
  />);
  assert.ok(html.includes('Admin-Perspektive öffnen'));
  assert.ok(html.includes('Arbeiter-Perspektive öffnen'));
  assert.ok(html.includes('Vorarbeiter-Perspektive öffnen'));
  assert.ok(!html.includes('<textarea'));
});

test('worker perspective opens the foreman exchange with the original report policy answer', () => {
  const key = journeyQuestionKey('admin', 'report-policy', 'sender');
  const notes = changeWorkshopNote({}, key, { answer: 'Existing answer from the admin view', status: 'test' });
  const html = renderToStaticMarkup(<RoleJourneyWorkshop
    language="de" roleId="worker" interactionId="rapport-handover" notes={notes}
    databaseState={{ questions: [] } as unknown as DatabaseState} loaded saveStatus="idle"
    onNavigate={() => {}} onOpenProcess={() => {}} onSelectTopic={() => {}}
    onUpdateNote={() => {}} onSave={async () => {}}
  />);
  assert.ok(html.includes('Arbeiter ↔ Vorarbeiter'));
  assert.ok(html.includes('Existing answer from the admin view'));
  assert.ok(html.includes('Arbeiter → Kunde'));
  assert.ok(html.includes('Arbeiter → Vorarbeiter → Kunde'));
});

test('role branches retain canonical notes and keep disputed dispatch out of green facts', () => {
  for (const role of ROLE_JOURNEYS) {
    for (const branch of ['rights', 'duties', 'flow', 'questions'] as const) {
      const items = roleKnowledgeItems(role.id, branch);
      assert.ok(items.length > 0);
      assert.equal(new Set(items.map(item => item.id)).size, items.length);
      for (const item of items) assert.ok(item.source.trim());
    }
  }
  assert.equal(roleQuestions('admin').length, 28);
  const senderKey = journeyQuestionKey('admin', 'report-policy', 'sender');
  const workerSender = roleQuestions('worker').find(item => item.noteKey === senderKey);
  const foremanSender = roleQuestions('foreman').find(item => item.noteKey === senderKey);
  assert.ok(workerSender && foremanSender);
  assert.equal(roleKnowledgeState(workerSender), 'open');
  assert.equal(roleKnowledgeItems('worker', 'flow').find(item => item.processStepId === 'send')?.state, 'open');
  assert.ok(!roleRights('admin').some(item => item.state === 'evidenced'));
});

test('a team decision cannot become green without explicit Isa confirmation; editing revokes confirmation', () => {
  const item = roleQuestions('worker').find(item => item.noteKey === journeyQuestionKey('admin', 'report-policy', 'sender'))!;
  const key = item.noteKey!;
  const decided = changeWorkshopNote({}, key, { status: 'decided', answer: 'Team prefers foreman review' });
  assert.equal(roleKnowledgeState(item, decided[key]), 'proposal');
  const confirmed = changeWorkshopNote(decided, key, { answer: 'Isa confirms direct worker dispatch', isaConfirmed: true });
  assert.equal(roleKnowledgeState(item, confirmed[key]), 'evidenced');
  const edited = changeWorkshopNote(confirmed, key, { answer: 'Changed wording and route' });
  assert.equal(edited[key].isaConfirmed, false);
  assert.equal(roleKnowledgeState(item, edited[key]), 'proposal');
  const emptied = changeWorkshopNote(confirmed, key, { answer: '  ', isaConfirmed: true });
  assert.equal(emptied[key].isaConfirmed, false);
  assert.equal(roleKnowledgeState(item, emptied[key]), 'open');
});

test('clearing a source proposal reopens the point and exports preserve the edited proposal and client confirmation', () => {
  const item = roleQuestions('admin').find(item => item.proposal)!;
  const key = item.noteKey!;
  assert.equal(roleKnowledgeState(item), 'proposal');
  const cleared = changeWorkshopNote({}, key, { revisedRecommendation: ' ' });
  assert.equal(roleKnowledgeState(item, cleared[key]), 'open');
  const recorded = changeWorkshopNote(cleared, key, { revisedRecommendation: 'Our edited team proposal', answer: 'Isa agrees', isaConfirmed: true });
  const markdown = roleJourneyMarkdown(recorded);
  assert.ok(markdown.includes('**Vorschlag an Isa:** Our edited team proposal'));
  assert.ok(markdown.includes('**Von Isa bestätigt:** Ja'));
  assert.ok(markdown.includes('**Besprochene Antwort:** Isa agrees'));
});
