import { useState, useEffect, useRef } from 'react';
import type { IsaQuestionNote, IsaQuestionNotes, WorkshopNotes } from '../types';
import { loadIsaQuestionNotes, loadWorkshopNotes, saveIsaQuestionNotes } from '../db/indexedDb';
import { changeIsaQuestionNote, EMPTY_ISA_QUESTION_NOTE } from '../utils/isaQuestions';

export type IsaQuestionDrafts = Record<string, IsaQuestionNote>;

export function draftFields(draft: IsaQuestionNote): Partial<IsaQuestionNote> {
  return {
    proposal: draft.proposal,
    answer: draft.answer,
    isaConfirmed: draft.isaConfirmed,
    owner: draft.owner,
    nextStep: draft.nextStep,
    status: draft.status,
    reviewed: true,
  };
}

export function useIsaQuestionStore(refreshKey?: unknown) {
  const [notes, setNotes] = useState<IsaQuestionNotes>({});
  const [legacyNotes, setLegacyNotes] = useState<WorkshopNotes>({});
  const [drafts, setDrafts] = useState<IsaQuestionDrafts>({});
  const notesRef = useRef<IsaQuestionNotes>({});
  const revision = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'loading' | 'saving' | 'saved' | 'error'>('loading');

  useEffect(() => {
    let alive = true;
    ++revision.current;
    setLoaded(false);
    setLoadError(false);
    setSaveStatus('loading');
    Promise.all([loadIsaQuestionNotes(), loadWorkshopNotes()]).then(([current, legacy]) => {
      if (!alive) return;
      notesRef.current = current;
      setNotes(current);
      setLegacyNotes(legacy);
      setDrafts({});
      setLoaded(true);
      setSaveStatus('saved');
    }).catch(() => {
      if (alive) {
        setLoadError(true);
        setSaveStatus('error');
      }
    });
    return () => { alive = false; };
  }, [refreshKey]);

  const persist = async (next: IsaQuestionNotes) => {
    const edit = ++revision.current;
    notesRef.current = next;
    setNotes(next);
    setSaveStatus('saving');
    try {
      await saveIsaQuestionNotes(next);
      if (revision.current === edit) setSaveStatus('saved');
    } catch {
      if (revision.current === edit) setSaveStatus('error');
    }
  };

  const update = (id: string, change: Partial<IsaQuestionNote>) => {
    if (loaded) void persist(changeIsaQuestionNote(notesRef.current, id, change));
  };

  const changeDraft = (id: string, change: Partial<IsaQuestionNote>) => {
    if (!loaded) return;
    setDrafts(current => {
      const base = current[id] || notesRef.current[id] || EMPTY_ISA_QUESTION_NOTE;
      return { ...current, [id]: { ...base, ...change } };
    });
  };

  const closeDraft = (id: string) => {
    setDrafts(current => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const finishDraft = async (id: string) => {
    if (!loaded) return;
    const draft = drafts[id];
    if (!draft) return;
    const next = changeIsaQuestionNote(notesRef.current, id, draftFields(draft));
    closeDraft(id);
    await persist(next);
  };

  const restore = (restored: IsaQuestionNotes) => {
    setDrafts({});
    setLoadError(false);
    setLoaded(true);
    void persist(restored);
  };

  return {
    notes,
    notesRef,
    legacyNotes,
    drafts,
    loaded,
    loadError,
    saveStatus,
    persist,
    update,
    changeDraft,
    closeDraft,
    finishDraft,
    restore,
  };
}
