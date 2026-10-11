import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ISA_TEAM_QUESTIONS, ISA_QUESTION_GROUPS, ISA_QUESTION_SOURCE } from '../src/data/isaTeamQuestions';
import { IsaQuestionCard } from '../src/components/IsaQuestionsWorkshop';
import { changeIsaQuestionNote, EMPTY_ISA_QUESTION_NOTE, isaQuestionsBackup, isaTemplateMarkdown, parseIsaQuestionsBackup, selectedIsaQuestions } from '../src/utils/isaQuestions';
import { readWorkshopRoute } from '../src/utils/roleWorkshop';
import { loadIsaQuestionNotes, saveIsaQuestionNotes, exportStateAsJson, loadEntireDatabase } from '../src/db/indexedDb';

const first = ISA_TEAM_QUESTIONS[0];
const second = ISA_TEAM_QUESTIONS[1];

test('every uploaded question survives verbatim, including both numbering sequences and valid topic groups', () => {
  const source = readFileSync(ISA_QUESTION_SOURCE.path);
  assert.equal(createHash('sha256').update(source).digest('hex'), ISA_QUESTION_SOURCE.sha256);
  const original = [...source.toString('utf8').matchAll(/^(\d+)\. (.+)\r?$/gm)].map(match => match[2].replace(/\r$/, ''));
  assert.equal(original.length, 95);
  const roles = ISA_TEAM_QUESTIONS.filter(question => question.catalog === 'roles');
  const team = ISA_TEAM_QUESTIONS.filter(question => question.catalog === 'team');
  assert.deepEqual(roles.map(question => question.text.ru), original.slice(0, 50));
  assert.deepEqual(team.map(question => question.text.ru), original.slice(50));
  assert.equal(new Set(ISA_TEAM_QUESTIONS.map(question => question.id)).size, 95);
  for (const question of ISA_TEAM_QUESTIONS) {
    assert.ok(question.text.de.length > 20);
    const group = ISA_QUESTION_GROUPS.find(group => group.id === question.groupId)!;
    assert.equal(question.catalog, group.catalog);
    assert.ok(question.number >= group.from && question.number <= group.to);
  }
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

test('Isa template includes only checked questions across both catalogs, keeps proposals and makes comments optional', () => {
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
