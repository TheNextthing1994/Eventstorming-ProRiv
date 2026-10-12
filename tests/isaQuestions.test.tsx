import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ISA_TEAM_QUESTIONS, ISA_QUESTION_GROUPS, ISA_QUESTION_SOURCE } from '../src/data/isaTeamQuestions';
import { IsaQuestionCard, IsaQuestionOverview } from '../src/components/IsaQuestionsWorkshop';
import { IsaQuestionsWorkshop } from '../src/components/IsaQuestionsWorkshop';
import { IsaQuestionDepthControl } from '../src/components/IsaQuestionDepthControl';
import { ISA_QUESTION_DEPTH_PACKETS, isaDepthForQuestion, isaQuestionsAtDepth, parseIsaQuestionDepth } from '../src/data/isaQuestionDepth';
import { ISA_QUESTION_STAGES } from '../src/data/isaQuestionStages';
import { ISA_PROJECT_SOURCE_COVERAGE } from '../src/data/isaQuestionCoverage';
import { DOMAIN_EVENTS_LIST } from '../src/db/knowledgeSeed';
import { changeIsaQuestionNote, EMPTY_ISA_QUESTION_NOTE, isaCatalogMarkdown, isaGroupsForView, isaQuestionGroupId, isaQuestionsForView, isaQuestionsBackup, isaTemplateMarkdown, parseIsaQuestionsBackup, relatedIsaQuestions, selectedIsaQuestions } from '../src/utils/isaQuestions';
import { readWorkshopRoute } from '../src/utils/roleWorkshop';
import { loadIsaQuestionNotes, saveIsaQuestionNotes, exportStateAsJson, loadEntireDatabase } from '../src/db/indexedDb';
import type { IsaQuestionNotes } from '../src/types';

const first = ISA_TEAM_QUESTIONS[0];
const second = ISA_TEAM_QUESTIONS[1];

type TestElement = React.ReactElement<{ children?: React.ReactNode; [key: string]: unknown }>;
function elements(node: React.ReactNode): TestElement[] {
  const result: TestElement[] = [];
  React.Children.forEach(node, child => {
    if (!React.isValidElement<TestElement['props']>(child)) return;
    result.push(child, ...elements(child.props.children));
  });
  return result;
}
function overviewElement<P>(tree: React.ReactNode, match: (element: TestElement) => boolean): React.ReactElement<P> {
  const element = elements(tree).find(match);
  assert.ok(element, 'Expected overview control');
  return element as React.ReactElement<P>;
}

test('interview depth adds curated questions cumulatively and restores every source question at 100 percent', () => {
  assert.deepEqual(ISA_QUESTION_DEPTH_PACKETS.map(packet => packet.value), [0, 20, 40, 60, 80, 100]);
  assert.deepEqual(ISA_QUESTION_DEPTH_PACKETS.map(packet => packet.questionIds.length), [12, 32, 54, 92, 131, 155]);
  let previous = new Set<string>();
  for (const packet of ISA_QUESTION_DEPTH_PACKETS) {
    const entries = isaQuestionsAtDepth(packet.value);
    assert.equal(entries.length, new Set(entries.map(question => question.id)).size);
    const current = new Set(entries.map(question => question.id));
    for (const id of previous) assert.ok(current.has(id), `${packet.value} lost ${id}`);
    assert.ok(current.size > previous.size);
    previous = current;
  }
  assert.deepEqual(new Set(isaQuestionsAtDepth(100).map(question => question.id)), new Set(ISA_TEAM_QUESTIONS.map(question => question.id)));
  const minimum = new Set(isaQuestionsAtDepth(0).map(question => question.id));
  for (const id of ['proriv:project:presence-method', 'proriv:project:rapport-sender-policy', 'proriv:project:customer-gates', 'amruddy:team:21']) assert.ok(minimum.has(id));
  assert.ok(!minimum.has('amruddy:team:14'), 'Already evidenced MVA question does not consume the minimal meeting');
});

test('changing interview scope leaves checked questions, private comments and Isa export untouched', () => {
  const tax = ISA_TEAM_QUESTIONS.find(question => question.id === 'amruddy:roles:44')!;
  const core = isaQuestionsAtDepth(0)[0];
  let notes = changeIsaQuestionNote({}, tax.id, { includeInIsa: true, comment: 'Interne Notiz bleibt erhalten', proposal: 'Gespeicherter Vorschlag' });
  notes = changeIsaQuestionNote(notes, core.id, { includeInIsa: true });
  const before = isaQuestionsBackup(notes);
  for (const packet of ISA_QUESTION_DEPTH_PACKETS) {
    for (const view of ['all', 'team', 'roles', 'project'] as const) {
      const entries = isaQuestionsAtDepth(packet.value, view);
      assert.ok(entries.every(question => view === 'all' || question.catalog === view));
    }
    assert.equal(isaTemplateMarkdown(notes, 'ru'), isaTemplateMarkdown(parseIsaQuestionsBackup(before), 'ru'));
  }
  assert.ok(!isaQuestionsAtDepth(0).includes(tax));
  assert.ok(isaTemplateMarkdown(notes, 'ru').includes(tax.text.ru));
  assert.equal(notes[tax.id].comment, 'Interne Notiz bleibt erhalten');
  assert.equal(notes[tax.id].includeInIsa, true);
  assert.equal(isaDepthForQuestion(tax.id), 100);
});

test('stored depth accepts only the six supported values and old or malformed preferences use the minimum', () => {
  for (const value of [0, 20, 40, 60, 80, 100]) assert.equal(parseIsaQuestionDepth(String(value)), value);
  for (const value of [null, undefined, '', 'bad', '15', 101, -20, {}, NaN]) assert.equal(parseIsaQuestionDepth(value), 0);
  const invitation = 'proriv:project:invitation-channel';
  const value = isaDepthForQuestion(invitation);
  assert.ok(isaQuestionsAtDepth(value).some(question => question.id === invitation));
  assert.ok(!isaQuestionsAtDepth(0).some(question => question.id === invitation));
});

test('the depth slider is at the top of the questions page with six accessible steps and actual counts', () => {
  for (const language of ['de', 'ru'] as const) {
    const html = renderToStaticMarkup(<IsaQuestionDepthControl value={20} onChange={() => {}} hiddenSelected={2} language={language} />);
    for (const attribute of ['type="range"', 'min="0"', 'max="100"', 'step="20"', 'value="20"']) assert.ok(html.includes(attribute));
    assert.equal((html.match(/aria-pressed=/g) || []).length, 6);
    assert.ok(html.includes('32'));
    assert.ok(html.includes(language === 'de' ? 'Gesprächsumfang' : 'Объём обсуждения'));
    assert.ok(html.includes(language === 'de' ? 'gemessene Wissensabdeckung' : 'измеренный охват знаний'));
    assert.ok(html.includes(language === 'de' ? 'bleiben in eurer Isa-Vorlage' : 'остаются в вашей подборке'));
  }
  const page = renderToStaticMarkup(<IsaQuestionsWorkshop language="de" />);
  assert.ok(page.includes('id="isa-question-depth"'));
  assert.ok(page.indexOf('id="isa-question-depth"') < page.indexOf('aria-label="Fragenfortschritt"'));
  assert.ok(page.indexOf('id="isa-question-depth"') < page.indexOf('placeholder="Frage oder Stichwort'));
  assert.ok(page.includes('Minimum'));
  for (const language of ['de', 'ru'] as const) {
    const questionsPage = renderToStaticMarkup(<IsaQuestionsWorkshop language={language} />);
    assert.ok(!questionsPage.includes('aria-label="Fragenkatalog"'));
    assert.ok(!questionsPage.includes('aria-label="Список вопросов"'));
    for (const label of ['Original · Teamfragen', 'Original · Ich-Perspektiven', 'Ergänzende Projektfragen', 'Оригинал · основные', 'Оригинал · от первого лица', 'Дополнения по проекту']) assert.ok(!questionsPage.includes(label));
  }
});

test('every uploaded question survives verbatim, including both numbering sequences and valid topic groups', () => {
  const source = readFileSync(ISA_QUESTION_SOURCE.path);
  assert.equal(createHash('sha256').update(source).digest('hex'), ISA_QUESTION_SOURCE.sha256);
  const original = [...source.toString('utf8').matchAll(/^(\d+)\. (.+)\r?$/gm)].map(match => match[2].replace(/\r$/, ''));
  assert.equal(original.length, 95);
  const roles = ISA_TEAM_QUESTIONS.filter(question => question.catalog === 'roles');
  const team = ISA_TEAM_QUESTIONS.filter(question => question.catalog === 'team');
  assert.deepEqual(roles.map(question => question.text.ru), original.slice(0, 50));
  assert.deepEqual(team.map(question => question.text.ru), original.slice(50));
  assert.equal(new Set([...roles, ...team].map(question => question.id)).size, 95);
  assert.equal(new Set(ISA_TEAM_QUESTIONS.map(question => question.id)).size, ISA_TEAM_QUESTIONS.length);
  for (const question of ISA_TEAM_QUESTIONS) {
    assert.ok(question.text.de.length > 20);
    const group = ISA_QUESTION_GROUPS.find(group => group.id === question.groupId)!;
    assert.equal(question.catalog, group.catalog);
    assert.ok(question.number >= group.from && question.number <= group.to);
  }
});

test('the overall list contains every original and addition once and assigns every question to a process stage', () => {
  const all = isaQuestionsForView('all');
  assert.equal(all.length, 155);
  assert.equal(new Set(all.map(question => question.id)).size, all.length);
  assert.equal(isaQuestionsForView('team').length, 45);
  assert.equal(isaQuestionsForView('roles').length, 50);
  assert.equal(isaQuestionsForView('project').length, 60);
  assert.equal(isaGroupsForView('all').length, 14);
  for (const stage of ISA_QUESTION_STAGES) assert.ok(all.some(question => isaQuestionGroupId(question, 'all') === stage.id));
  for (const question of all) {
    assert.ok(question.text.ru.length > 20);
    assert.ok(ISA_QUESTION_STAGES.some(stage => stage.id === question.stageId));
    for (const id of question.relatedIds || []) assert.ok(all.some(other => other.id === id), `Unknown related question: ${id}`);
  }
  const catalog = isaCatalogMarkdown('bilingual');
  assert.equal((catalog.match(/^### \d+\./gm) || []).length, all.length);
  for (const question of all) {
    assert.ok(catalog.includes(question.text.de));
    assert.ok(catalog.includes(question.text.ru));
    assert.equal(catalog.split(`ID: ${question.id}\n`).length - 1, 1);
  }
});

test('existing workshop questions and every modelled event decision have an explicit coverage reference', () => {
  const ids = new Set(ISA_TEAM_QUESTIONS.map(question => question.id));
  assert.equal(new Set(ISA_PROJECT_SOURCE_COVERAGE.map(item => item.sourceKey)).size, ISA_PROJECT_SOURCE_COVERAGE.length);
  for (const source of ISA_PROJECT_SOURCE_COVERAGE) {
    assert.ok(source.questionIds.length, `Uncovered source: ${source.sourceKey}`);
    for (const id of source.questionIds) assert.ok(ids.has(id), `${source.sourceKey}: ${id}`);
  }
  for (const event of DOMAIN_EVENTS_LIST) assert.ok(ISA_PROJECT_SOURCE_COVERAGE.some(item => item.sourceKey === `event:${event.id}`));
  for (const prefix of ['admin:', 'process:', 'senior:', 'open:', 'sketch:', 'raw:', 'screenshots:', 'gate:', 'qa:', 'diagram:']) {
    assert.ok(ISA_PROJECT_SOURCE_COVERAGE.some(item => item.sourceKey.startsWith(prefix)), prefix);
  }
});

test('related perspectives remain independently selected and old backups also accept new project questions', () => {
  const role = ISA_TEAM_QUESTIONS.find(question => question.id === 'amruddy:roles:01')!;
  const hms = ISA_TEAM_QUESTIONS.find(question => question.id === 'proriv:project:hms-responsibility')!;
  let notes = changeIsaQuestionNote({}, first.id, { includeInIsa: true, comment: 'Existing note', proposal: 'Old proposal' });
  const oldBackup = isaQuestionsBackup(notes);
  assert.deepEqual(parseIsaQuestionsBackup(oldBackup), notes);
  assert.ok(relatedIsaQuestions(first).includes(role));
  assert.equal(notes[role.id], undefined);
  notes = changeIsaQuestionNote(notes, role.id, { includeInIsa: true });
  notes = changeIsaQuestionNote(notes, hms.id, { includeInIsa: true, proposal: 'HMS klären', comment: 'Nur intern' });
  assert.deepEqual(parseIsaQuestionsBackup(isaQuestionsBackup(notes)), notes);
  assert.equal(notes[first.id].comment, 'Existing note');
  const template = isaTemplateMarkdown(notes, 'ru');
  for (const question of [first, role, hms]) assert.equal(template.split(question.text.ru).length - 1, 1);
  assert.ok(template.includes('HMS klären'));
  assert.ok(!template.includes('Nur intern'));
  assert.ok(template.indexOf(first.text.ru) < template.indexOf(hms.text.ru));
});

test('the phase overview shows complete questions, known context, selections and an editable entry point', () => {
  const questions = isaQuestionsForView('all').filter(question => question.stageId === 'pricing');
  const tax = questions.find(question => question.id === 'amruddy:team:14')!;
  const notes = changeIsaQuestionNote({}, tax.id, { includeInIsa: true, comment: 'Retained draft' });
  const html = renderToStaticMarkup(<IsaQuestionOverview questions={questions} notes={notes} proposalDrafts={{}} language="de" editable onOpen={() => {}} onSelect={() => {}} onUpdate={() => {}} onDraftChange={() => {}} onDraftClose={() => {}} />);
  assert.equal((html.match(/type="checkbox"/g) || []).length, questions.length);
  assert.equal((html.match(/checked=""/g) || []).length, 1);
  assert.ok(html.includes('Preisliste nennt Preise ohne MVA'));
  assert.ok(html.includes('Notizen ansehen / bearbeiten'));
  assert.ok(html.includes('Helferregel ab Ø400'));
  const originalApproval = ISA_TEAM_QUESTIONS.find(question => question.id === 'amruddy:roles:25')!;
  const card = renderToStaticMarkup(<IsaQuestionCard question={originalApproval} note={EMPTY_ISA_QUESTION_NOTE} language="de" editable onUpdate={() => {}} onOpenQuestion={() => {}} />);
  assert.ok(card.includes('offener Teamvorschlag'));
  assert.ok(card.includes('Verwandte Fragen'));
  assert.equal(EMPTY_ISA_QUESTION_NOTE.includeInIsa, false);
  assert.equal(EMPTY_ISA_QUESTION_NOTE.proposal, '');
});

test('typing stays a draft across section changes; Finish commits once without changing comments or selections', () => {
  let notes = changeIsaQuestionNote({}, first.id, { includeInIsa: true, comment: 'Private team comment', proposal: 'Previous proposal' });
  let proposalDrafts: Record<string, string> = {};
  let writes = 0;
  const view = (questions = [first]) => IsaQuestionOverview({
    questions, notes, proposalDrafts, language: 'de', editable: true,
    onSelect: (id, includeInIsa) => { writes++; notes = changeIsaQuestionNote(notes, id, { includeInIsa }); },
    onUpdate: (id, change) => { writes++; notes = changeIsaQuestionNote(notes, id, change); },
    onDraftChange: (id, value) => { proposalDrafts = { ...proposalDrafts, [id]: value }; },
    onDraftClose: id => { delete proposalDrafts[id]; }
  });
  const opening = overviewElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(view(), element => element.type === 'button' && element.props.children === 'Bearbeiten');
  opening.props.onClick!({} as React.MouseEvent<HTMLButtonElement>);
  assert.equal(proposalDrafts[first.id], 'Previous proposal');
  assert.equal(writes, 0);
  for (const value of ['N', 'Ne', 'New team proposal']) {
    const input = overviewElement<React.InputHTMLAttributes<HTMLInputElement>>(view(), element => element.type === 'input' && element.props.type === 'text');
    input.props.onChange!({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    assert.equal(writes, 0, 'Each character only updates the draft');
    assert.equal(notes[first.id].proposal, 'Previous proposal');
    assert.ok(!isaTemplateMarkdown(notes, 'de').includes('New team proposal'));
    assert.ok(!isaQuestionsBackup(notes).includes('New team proposal'));
  }
  assert.ok(!renderToStaticMarkup(view([second])).includes('New team proposal'));
  const resumed = overviewElement<React.InputHTMLAttributes<HTMLInputElement>>(view(), element => element.type === 'input' && element.props.type === 'text');
  assert.equal(resumed.props.value, 'New team proposal', 'Parent-owned draft survives leaving and reopening its section');
  const checkbox = overviewElement<React.InputHTMLAttributes<HTMLInputElement>>(view(), element => element.type === 'input' && element.props.type === 'checkbox');
  checkbox.props.onChange!({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>);
  assert.equal(notes[first.id].proposal, 'Previous proposal', 'Saving a selection cannot save unfinished text');
  const finish = overviewElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(view(), element => element.type === 'button' && element.props.children === 'Fertig');
  finish.props.onClick!({} as React.MouseEvent<HTMLButtonElement>);
  assert.equal(writes, 2, 'One selection write and one Finish write');
  assert.equal(notes[first.id].proposal, 'New team proposal');
  assert.equal(notes[first.id].comment, 'Private team comment');
  assert.equal(notes[first.id].includeInIsa, true);
  assert.equal(notes[first.id].reviewed, true);
  assert.equal(Object.hasOwn(proposalDrafts, first.id), false);
  assert.ok(isaTemplateMarkdown(notes, 'de').includes('New team proposal'));
  assert.ok(renderToStaticMarkup(view()).includes('New team proposal'));
});

test('Enter finishes an empty proposal, composition keeps the draft open and locked editors cannot commit', () => {
  const notes = changeIsaQuestionNote({}, first.id, { comment: 'Keep comment', proposal: 'Remove this' });
  const updates: unknown[] = [];
  const closed: string[] = [];
  const props: React.ComponentProps<typeof IsaQuestionOverview> = {
    questions: [first], notes, proposalDrafts: { [first.id]: '', [second.id]: 'Other unfinished proposal' }, language: 'de', editable: true,
    onSelect: () => {}, onDraftChange: () => {}, onDraftClose: id => closed.push(id),
    onUpdate: (id, change) => updates.push({ id, change })
  };
  const input = overviewElement<React.InputHTMLAttributes<HTMLInputElement>>(IsaQuestionOverview(props), element => element.type === 'input' && element.props.type === 'text');
  let prevented = 0;
  const enter = (isComposing: boolean) => ({ key: 'Enter', nativeEvent: { isComposing }, preventDefault: () => { prevented++; } } as React.KeyboardEvent<HTMLInputElement>);
  input.props.onKeyDown!(enter(true));
  assert.equal(updates.length, 0);
  assert.equal(closed.length, 0);
  input.props.onKeyDown!(enter(false));
  assert.deepEqual(updates, [{ id: first.id, change: { proposal: '', reviewed: true } }]);
  assert.deepEqual(closed, [first.id]);
  assert.equal(prevented, 1);
  assert.equal(props.proposalDrafts[second.id], 'Other unfinished proposal');
  const locked = overviewElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(IsaQuestionOverview({ ...props, editable: false }), element => element.type === 'button' && element.props.children === 'Fertig');
  assert.equal(locked.props.disabled, true);
  locked.props.onClick!({} as React.MouseEvent<HTMLButtonElement>);
  assert.equal(updates.length, 1);
  assert.equal(closed.length, 1);
});

test('checking a question includes it for Isa; unchecking keeps its comments and review progress', () => {
  let notes = changeIsaQuestionNote({}, first.id, { comment: 'Intern besprochen', proposal: 'Ein konkreter Vorschlag' });
  assert.equal(selectedIsaQuestions(notes).length, 0);
  notes = changeIsaQuestionNote(notes, first.id, { includeInIsa: true });
  assert.equal(notes[first.id].reviewed, true);
  assert.deepEqual(selectedIsaQuestions(notes).map(question => question.id), [first.id]);
  notes = changeIsaQuestionNote(notes, first.id, { includeInIsa: false });
  assert.equal(notes[first.id].reviewed, true);
  assert.equal(notes[first.id].comment, 'Intern besprochen');
  assert.equal(notes[first.id].proposal, 'Ein konkreter Vorschlag');
  assert.equal(selectedIsaQuestions(notes).length, 0);
});

test('Isa template includes only checked questions, keeps proposals and makes comments optional', () => {
  const role = ISA_TEAM_QUESTIONS.find(question => question.catalog === 'roles' && question.number === 47)!;
  let notes = changeIsaQuestionNote({}, first.id, { includeInIsa: true, proposal: 'Наш вариант\nВторая строка', comment: 'Private discussion' });
  notes = changeIsaQuestionNote(notes, second.id, { reviewed: true, proposal: 'Nicht gewählt' });
  notes = changeIsaQuestionNote(notes, role.id, { includeInIsa: true });
  const client = isaTemplateMarkdown(notes);
  assert.ok(client.includes(first.text.ru));
  assert.ok(client.includes(role.text.ru));
  assert.ok(client.includes('Наш вариант\nВторая строка'));
  assert.ok(!client.includes(second.text.ru));
  assert.ok(!client.includes('Nicht gewählt'));
  assert.ok(!client.includes('Private discussion'));
  assert.ok(client.includes('Выбранных вопросов: 2'));
  assert.ok(isaTemplateMarkdown(notes, 'de', true).includes('Private discussion'));
  const dual = isaTemplateMarkdown(notes, 'bilingual');
  assert.ok(dual.includes(first.text.de));
  assert.ok(dual.includes(first.text.ru));
});

test('a backup restores selection, review state and multiline notes; unrelated or malformed imports are rejected', () => {
  const notes = changeIsaQuestionNote({}, first.id, { includeInIsa: true, comment: 'Zeile 1\nZeile 2', proposal: 'Предложение' });
  assert.deepEqual(parseIsaQuestionsBackup(isaQuestionsBackup(notes)), notes);
  assert.throws(() => parseIsaQuestionsBackup('{"questions":[]}'));
  const malformed = JSON.parse(isaQuestionsBackup(notes));
  malformed.notes[first.id].includeInIsa = 'true';
  assert.throws(() => parseIsaQuestionsBackup(JSON.stringify(malformed)));
  const unknown = JSON.parse(isaQuestionsBackup(notes));
  unknown.notes['amruddy:team:99'] = unknown.notes[first.id];
  assert.throws(() => parseIsaQuestionsBackup(JSON.stringify(unknown)));
});

test('question card clearly separates selection, review, comment and proposal in German and Russian', () => {
  for (const language of ['de', 'ru', 'bilingual'] as const) {
    const html = renderToStaticMarkup(<IsaQuestionCard question={first} note={EMPTY_ISA_QUESTION_NOTE} language={language} editable onUpdate={() => {}} />);
    assert.equal((html.match(/type="checkbox"/g) || []).length, 2);
    assert.equal((html.match(/<textarea/g) || []).length, 2);
    assert.ok(html.includes(language === 'ru' ? 'Включить в вопросы Исе' : 'Für Isa übernehmen'));
    assert.ok(html.includes(language === 'ru' ? 'Наше предложение Исе' : 'Unser Vorschlag an Isa'));
  }
  const locked = renderToStaticMarkup(<IsaQuestionCard question={first} note={EMPTY_ISA_QUESTION_NOTE} language="de" editable={false} onUpdate={() => {}} />);
  assert.equal((locked.match(/disabled=""/g) || []).length, 4);
  assert.equal(readWorkshopRoute('#/workshop/questions').mode, 'questions');
  assert.equal(readWorkshopRoute('#/workshop/admin').mode, 'roles');
});

test('autosave survives interrupted writes, storage failures, rapid edits and JSON export', async () => {
  const stores = new Map<string, Map<string, unknown>>();
  const storage = new Map<string, string>();
  let failLocal = false;
  let failIdb = false;
  const store = (name: string) => { if (!stores.has(name)) stores.set(name, new Map()); return stores.get(name)!; };
  const db = {
    transaction(name: string, mode: string) {
      const tx: any = { error: new Error('Simulated storage failure') };
      tx.objectStore = () => ({
        getAll() {
          const request: any = {};
          queueMicrotask(() => { request.result = [...store(name).values()]; request.onsuccess?.(); });
          return request;
        },
        put(item: any) {
          assert.equal(mode, 'readwrite');
          const request: any = {};
          setTimeout(() => {
            if (failIdb) { tx.onabort?.(); return; }
            store(name).set(item.key || item.id, structuredClone(item));
            request.onsuccess?.();
            tx.oncomplete?.();
          }, 2);
          return request;
        },
      });
      return tx;
    },
  };
  const previousWindow = (globalThis as any).window;
  const previousStorage = (globalThis as any).localStorage;
  (globalThis as any).window = { indexedDB: { open() {
    const request: any = { result: db };
    queueMicrotask(() => request.onsuccess?.());
    return request;
  } } };
  (globalThis as any).localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { if (failLocal) throw new Error('Quota exceeded'); storage.set(key, value); },
    removeItem: (key: string) => storage.delete(key),
  };
  try {
    store('settings').set('senior_workshop_notes_v1', { key: 'senior_workshop_notes_v1', value: { arrival: { answer: 'Existing meeting note' } } });
    const initial = changeIsaQuestionNote({}, first.id, { includeInIsa: true, comment: 'Initial' });
    const saving = saveIsaQuestionNotes(initial);
    assert.deepEqual(await loadIsaQuestionNotes(), initial, 'latest synchronous draft is readable before commit');
    await saving;
    let notes = initial;
    const writes: Promise<void>[] = [];
    for (const proposal of ['A', 'AB', 'ABC']) {
      notes = changeIsaQuestionNote(notes, first.id, { proposal });
      writes.push(saveIsaQuestionNotes(notes));
    }
    await Promise.all(writes);
    assert.deepEqual(await loadIsaQuestionNotes(), notes);
    failLocal = true;
    const newest = changeIsaQuestionNote(notes, first.id, { proposal: 'IDB only latest' });
    await saveIsaQuestionNotes(newest);
    assert.deepEqual(await loadIsaQuestionNotes(), newest, 'an old draft never overrides a newer IDB commit');
    const exported = JSON.parse(await exportStateAsJson());
    assert.deepEqual(exported.isaQuestionNotes, newest);
    assert.equal(exported.workshopNotes.arrival.answer, 'Existing meeting note');
    failIdb = true;
    await assert.rejects(saveIsaQuestionNotes(changeIsaQuestionNote(newest, first.id, { proposal: 'Unsaved' })));
    failLocal = false;
    const localOnly = changeIsaQuestionNote(newest, first.id, { proposal: 'Draft survives IDB failure' });
    await saveIsaQuestionNotes(localOnly);
    assert.deepEqual(await loadIsaQuestionNotes(), localOnly);
    failIdb = false;
    await saveIsaQuestionNotes(localOnly);
    assert.equal((store('settings').get('isa_team_questions_v1') as any).value.notes[first.id].proposal, localOnly[first.id].proposal);
    storage.set('isa_team_questions_draft_v1', 'not valid json');
    await assert.rejects(loadIsaQuestionNotes());
    assert.equal((await loadEntireDatabase()).workshopNotes?.arrival.answer, 'Existing meeting note');
    await assert.rejects(exportStateAsJson(), 'complete backups never silently omit a corrupt question draft');
  } finally {
    (globalThis as any).window = previousWindow;
    (globalThis as any).localStorage = previousStorage;
  }
});
