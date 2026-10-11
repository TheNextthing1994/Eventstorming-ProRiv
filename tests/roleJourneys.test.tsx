import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RoleJourneyWorkshop } from '../src/components/RoleJourneyWorkshop';
import { ADMIN_JOURNEY_STEPS, ROLE_JOURNEYS, journeyQuestionKey } from '../src/data/roleJourneys';
import { WORKSHOP_STEPS } from '../src/data/workshopContent';
import { changeWorkshopNote, readWorkshopRoute, roleJourneyMarkdown } from '../src/utils/roleWorkshop';
import type { DatabaseState, Language } from '../src/types';
import type { WorkshopNotes } from '../src/db/indexedDb';

test('existing process bookmarks survive, role deep links select a validated role and step', () => {
  assert.equal(readWorkshopRoute('#/workshop').mode, 'process');
  assert.deepEqual(readWorkshopRoute('#/workshop/admin/report-policy'), { mode: 'roles', roleId: 'admin', stepId: 'report-policy' });
  assert.deepEqual(readWorkshopRoute('#/workshop/admin/typo'), { mode: 'roles', roleId: 'admin', stepId: undefined });
  assert.equal(readWorkshopRoute('#/workshop/typo').mode, 'process');
  assert.equal(readWorkshopRoute('#/workshop/foreman').roleId, 'foreman');
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

test('the renderable walkthrough keeps all three role panels, source alternatives and bilingual content visible', () => {
  const de = render('de');
  assert.ok(de.includes('aria-expanded="true"'));
  assert.equal((de.match(/aria-expanded="false"/g) || []).length, 2);
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
  assert.ok(html.includes('aria-valuenow="0"'));
});
