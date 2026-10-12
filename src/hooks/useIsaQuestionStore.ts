import { useEffect, useRef, useState } from 'react';
import { loadIsaQuestionNotes, loadWorkshopNotes, saveIsaQuestionNotes, type WorkshopNotes } from '../db/indexedDb';
import type { IsaQuestionNote, IsaQuestionNotes } from '../types';
import { changeIsaQuestionNote, EMPTY_ISA_QUESTION_NOTE } from '../utils/isaQuestions';

export type IsaQuestionDrafts = Record<string, IsaQuestionNote>;
export function useIsaQuestionStore(refreshKey?: unknown) {
  const [notes, setNotes] = useState<IsaQuestionNotes>({});
  const notesRef = useRef<IsaQuestionNotes>({});
  const [legacyNotes, setLegacyNotes] = useState<WorkshopNotes>({});
  const [drafts, setDrafts] = useState<IsaQuestionDrafts>({});
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'loading' | 'saving' | 'saved' | 'error'>('loading');
  const revision = useRef(0);
  useEffect(() => {
    let alive = true;
    ++revision.current;
    setLoaded(false); setLoadError(false); setSaveStatus('loading');
    Promise.all([loadIsaQuestionNotes(), loadWorkshopNotes()]).then(([current, legacy]) => {
      if (!alive) return;
      notesRef.current = current; setNotes(current); setLegacyNotes(legacy); setDrafts({});
      setLoaded(true); setSaveStatus('saved');
    }).catch(() => { if (alive) { setLoadError(true); setSaveStatus('error'); } });
    return () => { alive = false; };
  }, [refreshKey]);
  const persist = async (next: IsaQuestionNotes, restoring = false) => {
    if (!loaded && !restoring) return false;
    const edit = ++revision.current;
    notesRef.current = next; setNotes(next); setSaveStatus('saving');
    try {
      await saveIsaQuestionNotes(next);
      if (revision.current === edit) setSaveStatus('saved');
      return true;
    } catch {
      if (revision.current === edit) setSaveStatus('error');
      return false;
    }
  };
  const update = (id: string, change: Partial<IsaQuestionNote>) => {
    if (loaded) void persist(changeIsaQuestionNote(notesRef.current, id, change));
  };
  const changeDraft = (id: string, change: Partial<IsaQuestionNote>) => {
    if (!loaded) return;
    setDrafts(current => {
      const previous = current[id] || notesRef.current[id] || EMPTY_ISA_QUESTION_NOTE;
      return { ...current, [id]: { ...previous, ...change,
        ...(change.answer !== undefined && change.answer !== (previous.answer ?? '') ? { isaConfirmed: false } : {}) } };
    });
  };
  const closeDraft = (id: string) => setDrafts(current => {
    const next = { ...current }; delete next[id]; return next;
  });
  const finishDraft = async (id: string) => {
    const draft = drafts[id];
    if (!loaded || !draft) return;
    const next = changeIsaQuestionNote(notesRef.current, id, draftFields(draft));
    if (await persist(next)) setDrafts(current => {
      if (current[id] !== draft) return current;
      const remaining = { ...current }; delete remaining[id]; return remaining;
    });
  };
  const saveAll = async () => {
    if (!loaded) return;
    const snapshot = drafts;
    let next = notesRef.current;
    for (const [id, draft] of Object.entries(snapshot)) next = changeIsaQuestionNote(next, id, draftFields(draft));
    if (await persist(next)) setDrafts(current => Object.fromEntries(Object.entries(current).filter(([id, draft]) => snapshot[id] !== draft)));
  };
  const restore = (next: IsaQuestionNotes) => {
    setDrafts({}); setLoadError(false); setLoaded(true); void persist(next, true);
  };
  return { notes, notesRef, legacyNotes, drafts, loaded, loadError, saveStatus, persist, update, changeDraft, closeDraft, finishDraft, saveAll, restore };
}

export function draftFields(draft: IsaQuestionNote): Partial<IsaQuestionNote> {
  return { proposal: draft.proposal, comment: draft.comment, answer: draft.answer ?? '',
    isaConfirmed: draft.isaConfirmed ?? false, status: draft.status ?? 'test', owner: draft.owner ?? '', nextStep: draft.nextStep ?? '', reviewed: true };
}
