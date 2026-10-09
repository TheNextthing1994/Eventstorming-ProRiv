import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Download, ExternalLink, GitBranch, Layers3, Search, ShieldCheck } from 'lucide-react';
import { DatabaseState, Language, TopicId, SeniorQuestion } from '../types';
import { WORKSHOP_STEPS, WORKSHOP_ROLE_LABELS, WorkshopStep } from '../data/workshopContent';
import { SENIOR_DECISION_QUESTIONS } from '../db/knowledgeSeed';
import { loadWorkshopNotes, saveWorkshopNotes, saveQuestion, WorkshopNote, WorkshopNotes } from '../db/indexedDb';

interface WorkshopFlowViewProps {
  databaseState: DatabaseState;
  language: Language;
  onStartWorkshop: () => void;
  onSelectTopic: (topic: TopicId) => void;
  onNavigateSection: (section: string) => void;
}

const EMPTY_NOTE: WorkshopNote = { status: 'open', answer: '', owner: '', nextStep: '', updatedAt: '' };
const RESEARCH_SECTIONS: { title: string; titleRu: string; hint: string; hintRu: string; ids: string[]; topics: TopicId[] }[] = [
  { title: 'Branche & Prozesse', titleRu: 'Отрасль и процессы', hint: 'Norwegische Baustelle, Ablauf, Rollen', hintRu: 'Стройка, процессы и роли', ids: ['arrival','time','approval'], topics: ['clients','vremya','users'] },
  { title: 'Markt & Open Source', titleRu: 'Рынок и Open Source', hint: 'Vorbilder, OSS und ihre Grenzen', hintRu: 'Примеры, OSS и ограничения', ids: ['work','pricing','customer'], topics: ['raport','mobile-app'] },
  { title: 'Technik & APIs', titleRu: 'Технологии и API', hint: 'Offline, Formulare, Tripletex', hintRu: 'Офлайн, формы, Tripletex', ids: ['work','export','accounting'], topics: ['api','mobile-app'] },
  { title: 'Regeln & Risiken', titleRu: 'Правила и риски', hint: 'HMS, Datenschutz und ungeklärte Prüfungen', hintRu: 'HMS, защита данных и проверки', ids: ['arrival','send','customer'], topics: ['vremya','clients'] }
];

function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const element = document.createElement('a');
  element.href = url;
  element.download = name;
  document.body.appendChild(element);
  element.click();
  element.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function writeProtocol(notes: WorkshopNotes, questions: SeniorQuestion[]): string {
  const lines = ['# ProRiv (Isa\'s Projekt) – Senior-Gespräch', '', 'Stand: ' + new Date().toISOString(), '', 'Nur ausdrücklich als „Entschieden“ dokumentierte Punkte gelten als Gesprächsergebnis.', ''];
  for (const step of WORKSHOP_STEPS) {
    const note = notes[step.id] || EMPTY_NOTE;
    lines.push('## ' + step.nr + '. ' + step.title, '',
      '**Originalinterview – unverändert:** ' + step.customerFact, '',
      '**Aktueller Interviewstand – bearbeitbare Interpretation:** ' + (note.revisedCustomerFact ?? step.customerFact), '',
      '**Ursprünglicher Vorschlag – unverändert:** ' + step.recommendation, '',
      '**Aktueller Vorschlag – noch nicht automatisch beschlossen:** ' + (note.revisedRecommendation ?? step.recommendation), '',
      '**Offene Frage:** ' + step.openQuestion, '',
      '**Herkunft laut Projektbestand:** ' + step.source, '',
      '**Beleg-/Prüfhinweise:** ' + step.evidence, '',
      '**Gesprächsstatus:** ' + (note.status === 'decided' ? 'Entschieden' : note.status === 'test' ? 'Zu prüfen' : 'Offen'), '',
      '**Besprochene Antwort / Begründung:** ' + (note.answer || '—'), '',
      '**Verantwortlich:** ' + (note.owner || '—'), '',
      '**Nächster Schritt:** ' + (note.nextStep || '—'), '');
  }
  for (const arch of SENIOR_DECISION_QUESTIONS) {
    const note = notes['arch:' + arch.id] || EMPTY_NOTE;
    lines.push('## Architekturfrage ' + arch.number + ': ' + arch.question, '',
      '**Vorschlag, nicht beschlossen:** ' + arch.currentProposal, '',
      '**Begründung aus dem Projektbestand:** ' + arch.rationale, '',
      '**Herkunft:** Interne Architekturfragenliste; extern nicht automatisch verifiziert.', '',
      '**Gesprächsstatus:** ' + (note.status === 'decided' ? 'Entschieden' : note.status === 'test' ? 'Zu prüfen' : 'Offen'), '',
      '**Besprochene Antwort / Begründung:** ' + (note.answer || '—'), '',
      '**Verantwortlich:** ' + (note.owner || '—'), '',
      '**Nächster Schritt:** ' + (note.nextStep || '—'), '');
  }
  lines.push('## Rückfragen an Isa – aus der bestehenden Fragenliste', '');
  for (const q of questions.filter(item => item.needsClientClarification || Boolean(item.clientQuestion?.trim() || item.clientQuestionRu?.trim()))) {
    lines.push('### ' + (q.clientQuestion || q.question), '',
      '**Status:** ' + (q.isResolved ? 'Geklärt' : 'Offen'), '',
      '**Gesprächsnotiz:** ' + (q.notes || '—'), '',
      '**Herkunft im Datensatz:** ' + (q.origin || 'nicht angegeben'), '');
  }
  return lines.join('\n');
}

export const WorkshopFlowView: React.FC<WorkshopFlowViewProps> = ({ databaseState, language }) => {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const [phase, setPhase] = useState<number | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [selectedArchitecture, setSelectedArchitecture] = useState<string | null>(null);
  const [researchIndex, setResearchIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [questionsState, setQuestionsState] = useState<SeniorQuestion[]>(databaseState.questions);
  const questionsRef = useRef<SeniorQuestion[]>(databaseState.questions);
  const questionsQueue = useRef<Promise<void>>(Promise.resolve());
  const questionRev = useRef(0);
  const [questionSaveState, setQuestionSaveState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [notes, setNotes] = useState<WorkshopNotes>({});
  const notesRef = useRef<WorkshopNotes>({});
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const revision = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<'loading' | 'saving' | 'saved' | 'error'>('loading');

  useEffect(() => {
    let mounted = true;
    loadWorkshopNotes().then(found => {
      if (!mounted) return;
      notesRef.current = found;
      setNotes(found);
      setLoaded(true);
      setSaveState('saved');
    }).catch(() => {
      if (mounted) { setLoaded(false); setSaveState('error'); }
    });
    return () => { mounted = false; };
  }, []);

  const updateNote = (id: string, change: Partial<WorkshopNote>) => {
    if (!loaded) return;
    const existing = notesRef.current[id] || EMPTY_NOTE;
    if (change.status === 'decided' && !(change.answer ?? existing.answer).trim()) {
      window.alert(t('Zuerst die besprochene Antwort und Begründung eintragen.','Сначала запишите ответ и обоснование.'));
      return;
    }
    // A material change to an already decided assumption or proposal requires renewed review.
    const revisesWorkText = Object.prototype.hasOwnProperty.call(change, 'revisedCustomerFact')
      || Object.prototype.hasOwnProperty.call(change, 'revisedRecommendation');
    const status = revisesWorkText && existing.status === 'decided' && change.status === undefined ? 'test' : (change.status ?? existing.status);
    const next = { ...notesRef.current, [id]: { ...existing, ...change, status, updatedAt: new Date().toISOString() } };
    notesRef.current = next;
    setNotes(next);
    setSaveState('saving');
    const version = ++revision.current;
    // Writes are sequenced; switching steps or typing quickly cannot reverse a newer edit.
    saveQueue.current = saveQueue.current.catch(() => {}).then(() => saveWorkshopNotes(next))
      .then(() => { if (revision.current === version) setSaveState('saved'); })
      .catch(() => { if (revision.current === version) setSaveState('error'); });
  };

  const editQuestion = (id: string, change: Partial<SeniorQuestion>) => {
    const before = questionsRef.current.find(item => item.id === id);
    if (!before) return;
    if (change.isResolved === true && !before.isResolved && !(change.notes ?? before.notes ?? '').trim()) {
      window.alert(t('Bitte zuerst die Antwort oder Klärung als Notiz dokumentieren.','Сначала запишите ответ или уточнение.'));
      return;
    }
    const next: SeniorQuestion = { ...before, ...change, updatedAt: new Date().toISOString() };
    questionsRef.current = questionsRef.current.map(item => item.id === id ? next : item);
    setQuestionsState(questionsRef.current);
    setQuestionSaveState('saving');
    const v = ++questionRev.current;
    questionsQueue.current = questionsQueue.current.catch(() => {}).then(() => saveQuestion(next))
      .then(() => { if (v === questionRev.current) setQuestionSaveState('saved'); })
      .catch(() => { if (v === questionRev.current) setQuestionSaveState('error'); });
  };

  const active = WORKSHOP_STEPS.find(step => step.id === selectedStep);
  const clientQuestions = questionsState.filter(q => q.needsClientClarification || Boolean(q.clientQuestion?.trim() || q.clientQuestionRu?.trim()));
  const decided = WORKSHOP_STEPS.filter(step => notes[step.id]?.status === 'decided').length;
  const verify = WORKSHOP_STEPS.filter(step => notes[step.id]?.status === 'test').length;
  const resolvedArchitecture = SENIOR_DECISION_QUESTIONS.filter(item => notes['arch:' + item.id]?.status === 'decided');
  const openClientQuestions = clientQuestions.filter(question => !question.isResolved);
  const followUpEntries = [
    ...WORKSHOP_STEPS.map(step => ({ key: step.id, label: step.title, note: notes[step.id] })),
    ...SENIOR_DECISION_QUESTIONS.map(item => ({ key: 'arch:' + item.id, label: item.question, note: notes['arch:' + item.id] }))
  ].filter(entry => Boolean(entry.note?.nextStep?.trim()));

  const phases = [
    {title:'Kundenbedarf', ru:'Запрос клиента', q:'Was hat Isa gesagt – was ist noch unklar?', qr:'Что сказал Иса и что надо уточнить?', icon:BookOpen},
    {title:'Event Storming', ru:'Event Storming', q:'Wer macht was und in welcher Reihenfolge?', qr:'Кто что делает и в каком порядке?', icon:GitBranch},
    {title:'Deep Research', ru:'Исследование', q:'Welche Lösungen und Belege liegen vor?', qr:'Какие решения и доказательства есть?', icon:Search},
    {title:'Living Workshop', ru:'Рабочая встреча', q:'Was empfehlen wir – und warum?', qr:'Что предлагаем и почему?', icon:ShieldCheck},
    {title:'Architektur & nächste Schritte', ru:'Архитектура и следующие шаги', q:'Was ist entschieden, offen oder zu testen?', qr:'Что решено и что проверить?', icon:Layers3}
  ];

  const togglePhase = (index: number) => {
    setPhase(old => old === index ? null : index);
    setSelectedStep(null);
    setSelectedArchitecture(null);
    setDetailOpen(false);
  };
  const choose = (id: string) => {
    setSelectedArchitecture(null);
    setSelectedStep(old => old === id ? null : id);
    setDetailOpen(false);
  };
  const statusText = (status: WorkshopNote['status']) =>
    status === 'decided' ? t('Entschieden','Решено') : status === 'test' ? t('Zu prüfen','Проверить') : t('Offen','Открыто');

  const chips = (steps: WorkshopStep[]) => (
    <div className="flex flex-wrap gap-2">
      {steps.map(step => {
        const note = notes[step.id] || EMPTY_NOTE;
        const selected = selectedStep === step.id;
        return (
          <button type="button" key={step.id} onClick={() => choose(step.id)}
            aria-expanded={selected}
            className={'rounded-lg border px-3 py-2 text-left text-xs transition-colors ' +
              (selected ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400')}>
            <span className="font-semibold">{String(step.nr).padStart(2, '0')} · {t(step.title, step.titleRu)}</span>
            <span className="block text-[10px] text-slate-500 mt-1">{statusText(note.status)}</span>
          </button>
        );
      })}
    </div>
  );

  const inspector = active && (
    <div className="mt-4 rounded-xl border-2 border-emerald-200 bg-white p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap justify-between gap-2 items-start">
        <div>
          <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700">
            {t(WORKSHOP_ROLE_LABELS[active.actor].de, WORKSHOP_ROLE_LABELS[active.actor].ru)} · {t('Prozessschritt','Этап')} {active.nr}
          </p>
          <h3 className="text-base font-bold mt-1">{t(active.title, active.titleRu)}</h3>
        </div>
        <button onClick={() => setSelectedStep(null)} className="text-xs rounded-md border px-2.5 py-1.5 hover:bg-slate-50">
          {t('Schließen ×','Закрыть ×')}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <p className="font-bold text-[11px] text-slate-600 uppercase">{t('Aktueller Interviewstand · Arbeitsannahme','Текущее понимание интервью · гипотеза')}</p>
            {phase === 3 && <button type="button" disabled={!loaded} onClick={() => updateNote(active.id,{revisedCustomerFact:undefined})} className="text-[11px] underline disabled:opacity-50">{t('Original übernehmen','Вернуть оригинал')}</button>}
          </div>
          {phase === 3 ? (
            <textarea rows={5} disabled={!loaded} value={notes[active.id]?.revisedCustomerFact ?? t(active.customerFact,active.customerFactRu)}
              onChange={e => updateNote(active.id,{revisedCustomerFact:e.target.value})}
              className="mt-2 w-full border rounded-lg p-2 text-sm leading-relaxed font-normal bg-white" aria-label={t('Aktuellen Interviewstand bearbeiten','Изменить текущее понимание интервью')}/>
          ) : <p className="mt-2 text-slate-800 leading-relaxed">{notes[active.id]?.revisedCustomerFact ?? t(active.customerFact,active.customerFactRu)}</p>}
          {notes[active.id]?.revisedCustomerFact !== undefined && <p className="mt-2 text-[11px] text-amber-800">{t('Bearbeitete Interpretation – Original bleibt in den Quellen erhalten.','Редактируемое понимание — оригинал сохранён в источниках.')}</p>}
        </div>
        <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-200">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <p className="font-bold text-[11px] text-emerald-800 uppercase">{t('Aktueller Vorschlag · nicht beschlossen','Актуальное предложение · не утверждено')}</p>
            {phase === 3 && <button type="button" disabled={!loaded} onClick={() => updateNote(active.id,{revisedRecommendation:undefined})} className="text-[11px] underline disabled:opacity-50">{t('Original übernehmen','Вернуть оригинал')}</button>}
          </div>
          {phase === 3 ? (
            <textarea rows={5} disabled={!loaded} value={notes[active.id]?.revisedRecommendation ?? t(active.recommendation,active.recommendationRu)}
              onChange={e => updateNote(active.id,{revisedRecommendation:e.target.value})}
              className="mt-2 w-full border rounded-lg p-2 text-sm leading-relaxed font-normal bg-white" aria-label={t('Aktuellen Vorschlag bearbeiten','Изменить актуальное предложение')}/>
          ) : <p className="mt-2 text-slate-800 leading-relaxed">{notes[active.id]?.revisedRecommendation ?? t(active.recommendation,active.recommendationRu)}</p>}
          {notes[active.id]?.revisedRecommendation !== undefined && <p className="mt-2 text-[11px] text-amber-800">{t('Überarbeiteter Vorschlag – noch keine Freigabe.','Изменённое предложение — ещё не утверждено.')}</p>}
        </div>
      </div>
      {phase === 3 && <p className="text-xs text-slate-600">{t('Diese beiden Texte können direkt geändert werden. Die Gesprächsantwort darunter bleibt eine getrennte Notiz; sie überschreibt nichts automatisch. Eine Änderung an einem bereits entschiedenen Punkt setzt ihn auf „Zu prüfen“. Manuelle Texte werden in beiden Sprachansichten identisch angezeigt.','Эти два текста можно изменять отдельно. Заметка ниже не заменяет их автоматически. Изменение ранее принятого решения переводит статус в «Проверить». Редактированный текст одинаков в обеих языковых версиях.')}</p>}
      <div className="p-3 rounded-lg border border-amber-200 bg-amber-50">
        <p className="text-[11px] font-bold text-amber-900 uppercase">{t('Offene Klärung','Открытый вопрос')}</p>
        <p className="text-sm mt-1 leading-relaxed">{t(active.openQuestion, active.openQuestionRu)}</p>
      </div>
      <div className="border rounded-lg bg-white overflow-hidden">
        <button onClick={() => setDetailOpen(v => !v)} aria-expanded={detailOpen}
          className="flex w-full justify-between items-center text-left px-3 py-3 bg-slate-50 text-sm font-semibold">
          {t('Warum glauben wir das? Herkunft, Prüfung & Alternativen','Почему? Источники, проверка и альтернативы')}
          {detailOpen ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
        </button>
        {detailOpen && (
          <div className="p-4 text-xs leading-relaxed space-y-3">
            <div><strong>{t('Genannte interne Herkunft:','Указанный внутренний источник:')}</strong> {active.source}</div>
            <div><strong>{t('Originalinterview (unverändert):','Оригинал интервью (без изменений):')}</strong> {t(active.customerFact,active.customerFactRu)}</div>
            <div><strong>{t('Ursprünglicher Vorschlag (unverändert):','Исходное предложение (без изменений):')}</strong> {t(active.recommendation,active.recommendationRu)}</div>
            <div><strong>{t('Vorliegende Begründung und Prüfhaken:','Основания и что проверить:')}</strong> {active.evidence}</div>
            <p className="text-amber-800 bg-amber-50 border border-amber-100 p-2 rounded">
              {t('Wichtig: Eine Interview-Zusammenfassung ist kein unterschriebenes Kundenprotokoll. Herstellerlinks belegen nicht automatisch konkrete Produktfunktionen. Aussagen sind vor Entscheidung zu bestätigen.',
                'Важно: пересказ интервью не равен подписанному протоколу. Ссылка на сайт продукта не доказывает все функции. Утверждения требуют подтверждения.')}
            </p>
            <div className="font-bold">{t('Vergleich / Open-Source-Kandidaten (noch zu prüfen):','Сравнение / OSS-кандидаты (нужно проверить):')}</div>
            {active.choices.map(choice => (
              <div key={choice.name} className="rounded-lg border p-2.5">
                <span className="font-semibold">{choice.name}</span>
                <span className="text-slate-500"> · {choice.kind.toUpperCase()}</span>
                <p className="mt-1">{t(choice.why,choice.whyRu)}</p>
                {choice.link && <a href={choice.link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex gap-1 items-center text-emerald-800 underline break-all">
                  {t('Quelle / Projektseite öffnen','Открыть сайт / источник')} <ExternalLink className="h-3 w-3"/>
                </a>}
              </div>
            ))}
            {(active.evidence.match(/https?:\/\/[^\s)]+/g) || []).map(url => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block underline text-emerald-800 break-all">{url}</a>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-lg border border-slate-200 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-bold text-sm">{t('Gesprächsnotiz & Entscheidung','Заметки и решение')}</h4>
          <span aria-live="polite" className={'text-xs ' + (saveState === 'error' ? 'text-red-700' : 'text-slate-500')}>
            {saveState === 'saving' ? t('Speichert automatisch…','Автосохранение…') : saveState === 'saved' ? t('In diesem Browser gespeichert','Сохранено в этом браузере') : saveState === 'loading' ? t('Lade Notizen…','Загрузка…') : t('Speichern fehlgeschlagen – bitte exportieren','Ошибка сохранения — экспортируйте')}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['open','test','decided'] as const).map(status => (
            <button type="button" key={status} disabled={!loaded} onClick={() => updateNote(active.id, {status})}
              className={'rounded-md border px-2 py-2 text-xs font-semibold disabled:opacity-40 ' +
                ((notes[active.id]?.status || 'open') === status ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-600')}>
              {statusText(status)}
            </button>
          ))}
        </div>
        <label className="block text-xs font-semibold">{t('Besprochene Antwort / Begründung','Ответ / обоснование')}
          <textarea rows={3} disabled={!loaded} value={notes[active.id]?.answer || ''} onChange={e => updateNote(active.id,{answer:e.target.value})}
            placeholder={t('Was hat der Senior tatsächlich gesagt?','Что действительно сказал специалист?')}
            className="block w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm font-normal bg-white"/>
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-xs font-semibold">{t('Verantwortlich','Ответственный')}
            <input disabled={!loaded} value={notes[active.id]?.owner || ''} onChange={e => updateNote(active.id,{owner:e.target.value})}
              className="block mt-1 w-full border rounded-lg p-2 font-normal text-sm"/>
          </label>
          <label className="text-xs font-semibold">{t('Nächster Schritt','Следующий шаг')}
            <input disabled={!loaded} value={notes[active.id]?.nextStep || ''} onChange={e => updateNote(active.id,{nextStep:e.target.value})}
              className="block mt-1 w-full border rounded-lg p-2 font-normal text-sm"/>
          </label>
        </div>
      </div>
    </div>
  );


  const arch = SENIOR_DECISION_QUESTIONS.find(item => item.id === selectedArchitecture);
  const archKey = arch ? 'arch:' + arch.id : '';
  const archNote = (arch ? notes[archKey] : undefined) || EMPTY_NOTE;
  const architectureInspector = arch && (
    <div className="mt-3 border-2 border-emerald-200 rounded-xl p-4 space-y-3 bg-white">
      <div className="flex justify-between gap-2">
        <h4 className="font-bold text-sm">{t(arch.question,arch.questionRu || arch.question)}</h4>
        <button className="text-xs shrink-0 underline" onClick={() => setSelectedArchitecture(null)}>{t('Schließen','Закрыть')}</button>
      </div>
      <p className="text-[11px] font-semibold text-slate-500">{t('Interne Architekturfragenliste · offen bis Gesprächsbestätigung · Priorität: ','Внутренний список · требует подтверждения · приоритет: ')}{arch.priority.toUpperCase()}</p>
      <div className="grid sm:grid-cols-2 gap-2">
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
          <p className="text-xs font-bold">{t('Vorläufiger Vorschlag','Предварительное предложение')}</p>
          <p className="text-xs mt-1 leading-relaxed">{t(arch.currentProposal,arch.currentProposalRu || arch.currentProposal)}</p>
        </div>
        <div className="p-3 bg-slate-50 border rounded-lg">
          <p className="text-xs font-bold">{t('Warum schlagen wir das vor?','Почему предлагаем?')}</p>
          <p className="text-xs mt-1 leading-relaxed">{t(arch.rationale,arch.rationaleRu || arch.rationale)}</p>
          <p className="mt-2 text-[11px] text-amber-800">{t('Interne Begründung, kein externer Nachweis.','Внутреннее обоснование, не внешний источник.')}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {(['open','test','decided'] as const).map(status => (
          <button key={status} type="button" disabled={!loaded} onClick={() => updateNote(archKey,{status})}
            className={'border rounded-lg py-2 text-xs font-semibold disabled:opacity-40 ' +
              (archNote.status === status ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'border-slate-200 bg-white')}>
            {statusText(status)}
          </button>
        ))}
      </div>
      <label className="block text-xs font-semibold">{t('Gesprächsergebnis mit Begründung','Результат и обоснование')}
        <textarea rows={3} disabled={!loaded} value={archNote.answer} onChange={e => updateNote(archKey,{answer:e.target.value})}
          className="block w-full border rounded-lg p-2 text-sm font-normal mt-1" placeholder={t('Nicht als entschieden markieren, bevor eine Antwort vorliegt.','Не отмечать решённым без ответа.')}/>
      </label>
      <div className="grid sm:grid-cols-2 gap-2">
        <label className="block text-xs font-semibold">{t('Verantwortlich','Ответственный')}
          <input disabled={!loaded} value={archNote.owner} onChange={e => updateNote(archKey,{owner:e.target.value})} className="block w-full border rounded-lg p-2 text-sm font-normal mt-1"/>
        </label>
        <label className="block text-xs font-semibold">{t('Nächster Schritt','Следующий шаг')}
          <input disabled={!loaded} value={archNote.nextStep} onChange={e => updateNote(archKey,{nextStep:e.target.value})} className="block w-full border rounded-lg p-2 text-sm font-normal mt-1"/>
        </label>
      </div>
      <p className={'text-xs ' + (saveState === 'error' ? 'text-red-700' : 'text-slate-500')} aria-live="polite">
        {saveState === 'saved' ? t('In diesem Browser gespeichert','Сохранено в браузере') : saveState === 'saving' ? t('Speichert automatisch…','Автосохранение…') : saveState === 'error' ? t('Speichern fehlgeschlagen – bitte Backup exportieren','Ошибка сохранения — экспортируйте данные') : t('Notizen laden…','Загрузка…')}
      </p>
    </div>
  );

  const research = RESEARCH_SECTIONS[researchIndex];
  const researchSteps = WORKSHOP_STEPS.filter(step => research.ids.includes(step.id));
  const filteredFindings = databaseState.findings.filter(item => research.topics.includes(item.topicId) || item.additionalTopicIds?.some(id => research.topics.includes(id)));
  const filteredCompetitors = databaseState.competitors.filter(item => research.topics.includes(item.topicId) || item.additionalTopicIds?.some(id => research.topics.includes(id)));

  return (
    <section className="w-full max-w-5xl space-y-4" aria-label={t('ISA Workshop-Cockpit','Рабочая панель ISA')}>
      <header className="rounded-2xl bg-slate-900 text-white p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">{t('ProRiv (Isa\'s Projekt) · Senior-Gespräch','ProRiv (проект Исы) · Встреча')}</p>
        <h1 className="mt-1 text-xl font-bold">{t('Vom Kundenwunsch zur Architektur','От запроса клиента к архитектуре')}</h1>
        <p className="text-xs text-slate-300 mt-1">{t('Fünf Schritte. Kachel wählen, Inhalt darunter aufklappen. Quellen und Notizen bleiben hier.','Пять шагов. Выберите карточку: содержание откроется ниже. Источники и записи здесь.')}</p>
        <div className="flex flex-wrap gap-3 text-[11px] mt-3 text-slate-300">
          <span>{decided} / {WORKSHOP_STEPS.length} {t('Prozesspunkte entschieden','пунктов решено')}</span>
          <span>{verify} {t('zu prüfen','на проверке')}</span>
          <span>{clientQuestions.filter(q => !q.isResolved).length} {t('offene Fragen an Isa','вопросов Исе')}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {phases.map((item,index) => {
          const Icon = item.icon;
          const selected = phase === index;
          return <button type="button" key={index} onClick={() => togglePhase(index)} aria-expanded={selected} aria-controls="workshop-phase-content"
            className={'min-h-[146px] flex flex-col items-start text-left rounded-xl border p-3.5 transition-colors ' +
              (selected ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:border-emerald-400')}>
            <div className="flex items-center justify-between w-full"><span className="text-[11px] font-bold font-mono text-slate-500">0{index+1}</span><Icon className="h-4 w-4 text-emerald-700"/></div>
            <h2 className="text-sm font-bold mt-2">{t(item.title,item.ru)}</h2>
            <p className="text-xs text-slate-600 leading-snug mt-1 flex-1">{t(item.q,item.qr)}</p>
            <span className="text-xs font-semibold mt-3 text-emerald-800 inline-flex items-center gap-1">
              {selected ? t('Schließen','Закрыть') : t('Hier öffnen','Открыть здесь')}
              {selected ? <ChevronUp className="h-3.5 w-3.5"/> : <ChevronDown className="h-3.5 w-3.5"/>}
            </span>
          </button>;
        })}
      </div>

      {phase !== null && (
        <div id="workshop-phase-content" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
          <div className="mb-4 border-b pb-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-emerald-700">{t('Aktuelle Gesprächsphase','Текущий этап')} · 0{phase+1}</p>
            <h2 className="text-lg font-bold mt-1">{t(phases[phase].title,phases[phase].ru)}</h2>
            <p className="text-sm mt-1 text-slate-600">{t(phases[phase].q,phases[phase].qr)}</p>
          </div>

          {phase === 0 && <div className="space-y-4">
            <p className="text-sm">{t('Der bisherige Gesprächsstand ist keine endgültige Freigabe. Öffne einen Prozesspunkt, um die Aussage, ihre Herkunft und die noch offene Frage zu sehen.','Содержание интервью ещё не утверждено. Откройте пункт, чтобы увидеть источник и открытый вопрос.')}</p>
            {chips(WORKSHOP_STEPS.filter(step => !['export','approval','accounting'].includes(step.id)))}
            <div className="rounded-xl bg-slate-50 border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm">{t('Rückfragen an Isa – aus bestehender Fragenliste','Вопросы Исе – из существующего списка')} ({clientQuestions.length})</h3>
                <button className="text-xs text-emerald-800 underline" onClick={() => setShowAllQuestions(v => !v)}>
                  {showAllQuestions ? t('Weniger zeigen','Скрыть') : t('Alle zeigen','Показать все')}
                </button>
              </div>
              {(showAllQuestions ? clientQuestions : clientQuestions.slice(0,5)).map(q => (
                <div className="border-t py-2 text-xs" key={q.id}>
                  <button type="button" onClick={() => setSelectedQuestion(old => old === q.id ? null : q.id)}
                    aria-expanded={selectedQuestion === q.id} className="flex w-full text-left items-start gap-2">
                    <span className="shrink-0 text-amber-800">{q.isResolved ? '✓' : '○'}</span>
                    <span className="font-semibold flex-1">{t(q.clientQuestion || q.question, q.clientQuestionRu || q.questionRu || q.question)}</span>
                    {selectedQuestion === q.id ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                  </button>
                  <p className="text-[10px] ml-5 text-slate-500 mt-1">{t('Quelle: Projekt-Fragenliste · Herkunft: ','Источник: список вопросов · происхождение: ')}{q.origin || t('nicht dokumentiert','не указано')} · {q.isResolved ? t('geklärt','выяснено') : t('offen','открыто')}</p>
                  {selectedQuestion === q.id && <div className="mt-2 ml-5 p-3 border rounded-lg bg-white space-y-2">
                    <div className="bg-emerald-50 rounded p-2">
                      <p className="text-[11px] font-bold">{t('Bisheriger Vorschlag · nicht entschieden','Предложение · не утверждено')}</p>
                      <p className="mt-1">{t(q.answer || '—', q.answerRu || q.answer || '—')}</p>
                    </div>
                    <label className="block font-semibold">{t('Antwort / Klärung aus dem Gespräch','Ответ / уточнение в ходе встречи')}
                      <textarea rows={2} value={q.notes || ''} onChange={e => editQuestion(q.id,{notes:e.target.value})}
                        className="block border rounded-lg p-2 w-full mt-1 font-normal bg-white" placeholder={t('Was wurde tatsächlich geklärt?','Что выяснили?')}/>
                    </label>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <button type="button" onClick={() => editQuestion(q.id,{isResolved:!q.isResolved})} className="border rounded-lg px-3 py-2 font-semibold bg-slate-50">
                        {q.isResolved ? t('Wieder öffnen','Открыть снова') : t('Als geklärt markieren','Отметить как выяснено')}
                      </button>
                      <span className={'text-[11px] ' + (questionSaveState === 'error' ? 'text-red-700' : 'text-slate-500')}>
                        {questionSaveState === 'saving' ? t('Speichert…','Сохранение…') : questionSaveState === 'saved' ? t('Im Browser gespeichert','Сохранено в браузере') : t('Speichern fehlgeschlagen','Ошибка сохранения')}
                      </span>
                    </div>
                  </div>}
                </div>
              ))}
              {clientQuestions.length === 0 && <p className="text-xs text-slate-500">{t('Keine Einträge geladen.','Нет записей.')}</p>}
            </div>
          </div>}

          {phase === 1 && <div className="space-y-4">
            <p className="text-sm">{t('Ablauf laut Interview: Ankunft → Zeiten → Arbeit → Preis → Rapport → Kundenantwort. Separat: Stunden → Tripletex → Vorarbeiter → Buchhaltung. Reihenfolge und Ausnahmen mit Senior prüfen.','Путь: прибытие → часы → работа → цена → рапорт → клиент. Отдельно: Tripletex → прораб → бухгалтерия. Порядок проверить.')}</p>
            {chips(WORKSHOP_STEPS)}
          </div>}

          {phase === 2 && <div className="space-y-4">
            <p className="text-sm">{t('Vier Recherche-Perspektiven; kein Produkt und keine technische Lösung ist damit automatisch verifiziert. Die Details stammen aus der bestehenden Wissensbasis.','Четыре направления исследования. Ни один продукт не считается автоматически проверенным.')}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {RESEARCH_SECTIONS.map((item,i) => <button key={i} onClick={() => {setResearchIndex(i);setSelectedStep(null);}}
                className={'rounded-lg text-left border p-3 ' + (researchIndex===i ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300')}>
                <span className="block font-semibold text-sm">{t(item.title,item.titleRu)}</span>
                <span className="block text-xs text-slate-500 mt-1">{t(item.hint,item.hintRu)}</span>
              </button>)}
            </div>
            <h3 className="text-sm font-bold">{t(research.title,research.titleRu)} · {t('Beispiele mit Begründung','Примеры с обоснованием')}</h3>
            {chips(researchSteps)}
            <details className="rounded-lg border p-3" key={'research-'+researchIndex}>
              <summary className="cursor-pointer text-xs font-bold">{t('Weitere Erkenntnisse aus der Wissensbasis','Другие материалы из базы')} ({filteredFindings.length})</summary>
              <div className="space-y-2 mt-3">
                {filteredFindings.slice(0,12).map(item => (
                  <div key={item.id} className="text-xs border-t pt-2">
                    <p className="font-semibold">{t(item.title,item.titleRu || item.title)}</p>
                    <p className="text-slate-600 mt-1">{t(item.content,item.contentRu || item.content)}</p>
                    <p className="text-slate-500 mt-1">{t('Herkunft','Источник')}: {item.sourceName || item.origin} · {t('Status','Статус')}: {item.status}</p>
                    {item.sourceUrl && <a className="text-emerald-800 underline break-all" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceUrl}</a>}
                  </div>
                ))}
              </div>
            </details>
            <details className="rounded-lg border p-3">
              <summary className="cursor-pointer text-xs font-bold">{t('Wettbewerber-Recherche und Prüflücken','Конкуренты и открытые проверки')} ({filteredCompetitors.length})</summary>
              <div className="space-y-2 mt-3">
                {filteredCompetitors.slice(0,12).map(item => <div className="border-t text-xs pt-2" key={item.id}>
                  <p className="font-semibold">{item.productName} · {item.status}</p>
                  <p className="mt-1">{t(item.keyTakeaway,item.keyTakeawayRu || item.keyTakeaway)}</p>
                  {item.sourceOrLink ? <a href={item.sourceOrLink} target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline break-all">{item.sourceOrLink}</a> : <p className="text-amber-800">{t('Keine verlinkte Quelle hinterlegt','Нет ссылки на источник')}</p>}
                </div>)}
              </div>
            </details>
          </div>}

          {phase === 3 && <div className="space-y-4">
            <p className="text-sm">{t('Diskutiere jeweils nur eine Empfehlung. Ein Vorschlag wird erst nach begründeter Antwort als entschieden markiert. Quelle und Alternativen liegen direkt im aufgeklappten Punkt.','Обсуждайте по одному предложению. Статус «решено» требует обоснования. Источники открываются внутри пункта.')}</p>
            {chips(WORKSHOP_STEPS)}
            <details className="rounded-xl border bg-slate-50 p-3">
                          <summary className="cursor-pointer text-sm font-bold">{t('Zusätzliche Architekturfragen – öffnen bei Bedarf','Дополнительные архитектурные вопросы')} ({SENIOR_DECISION_QUESTIONS.length})</summary>
                          <p className="text-xs text-slate-500 mt-2">{t('Diese Vorschläge sind getrennte interne Fragen – keine bestätigten Beschlüsse. Antworten werden hier gemeinsam mit den Prozessnotizen gespeichert.','Это отдельные внутренние вопросы, ещё не утверждённые решения. Ответы сохраняются вместе с заметками.')}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {SENIOR_DECISION_QUESTIONS.map(item => (
                              <button key={item.id} onClick={() => {setSelectedStep(null);setSelectedArchitecture(old => old === item.id ? null : item.id);}}
                                className={'rounded-lg border p-2.5 text-left text-xs ' + (selectedArchitecture === item.id ? 'bg-emerald-50 border-emerald-600' : 'bg-white border-slate-200')}>
                                <span className="block font-semibold">{String(item.number).padStart(2,'0')} · {t(item.question,item.questionRu || item.question)}</span>
                                <span className="text-[10px] text-slate-500 mt-1 block">{statusText(notes['arch:' + item.id]?.status || 'open')}</span>
                              </button>
                            ))}
                          </div>
                          {architectureInspector}
                        </details>
          </div>}

          {phase === 4 && <div className="space-y-4">
            <p className="text-sm">{t('Dies ist die automatische Zusammenfassung der Gesprächsergebnisse aus dem Living Workshop. Hier wird nichts doppelt bearbeitet; Änderungen erfolgen in Phase 4. Nur ausdrücklich markierte Einträge gelten als entschieden.','Это автоматическая сводка решений из рабочего обсуждения. Изменения вносятся на этапе 4; без явного подтверждения решения не считаются принятыми.')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {label:t('Entschiedene Prozesspunkte','Решено по процессам'), count:decided},
                {label:t('Entschiedene Architekturfragen','Решено по архитектуре'), count:resolvedArchitecture.length},
                {label:t('Prozesspunkte zu prüfen','Процессы на проверке'), count:verify},
                {label:t('Offene Kundenfragen','Вопросы заказчику'), count:openClientQuestions.length}
              ].map(item => <div key={item.label} className="bg-slate-50 border rounded-lg p-3"><div className="text-xl font-bold">{item.count}</div><div className="text-xs text-slate-600">{item.label}</div></div>)}
            </div>
            <div className="rounded-xl border p-3 space-y-3">
              <h3 className="text-sm font-bold">{t('1. Bestätigte Gesprächsentscheidungen','1. Подтверждённые решения')}</h3>
              {decided === 0 && resolvedArchitecture.length === 0 && <p className="text-xs text-slate-500">{t('Noch keine Entscheidungen ausdrücklich bestätigt.','Пока нет подтверждённых решений.')}</p>}
              {WORKSHOP_STEPS.filter(step => notes[step.id]?.status === 'decided').map(step => {
                const note = notes[step.id];
                return <div key={step.id} className="border-t pt-2 text-xs space-y-1">
                  <p className="font-bold">{step.nr}. {t(step.title,step.titleRu)}</p>
                  <p><strong>{t('Ergebnis:','Результат:')}</strong> {note.answer}</p>
                  {note.revisedCustomerFact !== undefined && <p><strong>{t('Aktualisierter Interviewstand:','Уточнённое понимание интервью:')}</strong> {note.revisedCustomerFact}</p>}
                  <p><strong>{t('Aktueller Vorschlag:','Предложение:')}</strong> {note.revisedRecommendation ?? t(step.recommendation,step.recommendationRu)}</p>
                  <p className="text-slate-500">{t('Verantwortlich:','Ответственный:')} {note.owner || '—'} · {t('Nächster Schritt:','Следующий шаг:')} {note.nextStep || '—'}</p>
                </div>;
              })}
              {resolvedArchitecture.map(item => {
                const note = notes['arch:' + item.id];
                return <div key={item.id} className="border-t pt-2 text-xs space-y-1">
                  <p className="font-bold">{t('Architekturfrage','Архитектура')} {item.number}: {t(item.question,item.questionRu || item.question)}</p>
                  <p><strong>{t('Ergebnis:','Результат:')}</strong> {note.answer}</p>
                  <p className="text-slate-500">{t('Verantwortlich:','Ответственный:')} {note.owner || '—'} · {t('Nächster Schritt:','Следующий шаг:')} {note.nextStep || '—'}</p>
                </div>;
              })}
            </div>
            <div className="rounded-xl border p-3 space-y-2">
              <h3 className="text-sm font-bold">{t('2. Noch offen / zu prüfen','2. Открыто / на проверку')}</h3>
              {WORKSHOP_STEPS.filter(step => notes[step.id]?.status !== 'decided').map(step => {
                const note = notes[step.id] || EMPTY_NOTE;
                return <div key={step.id} className="border-t pt-2 text-xs">
                  <span className="font-semibold">{step.nr}. {t(step.title,step.titleRu)}</span> · {statusText(note.status)}
                  {note.answer && <p className="mt-1 text-slate-600">{note.answer}</p>}
                  {note.revisedCustomerFact !== undefined && <p className="mt-1 text-slate-600"><strong>{t('Bearbeiteter Interviewstand:','Уточнённое интервью:')}</strong> {note.revisedCustomerFact}</p>}
                  {note.revisedRecommendation !== undefined && <p className="mt-1 text-slate-600"><strong>{t('Bearbeiteter Vorschlag:','Новое предложение:')}</strong> {note.revisedRecommendation}</p>}
                </div>;
              })}
              {SENIOR_DECISION_QUESTIONS.filter(item => notes['arch:' + item.id]?.status !== 'decided').map(item => {
                const note = notes['arch:' + item.id] || EMPTY_NOTE;
                return <div key={item.id} className="border-t pt-2 text-xs">
                  <span className="font-semibold">{t('Architekturfrage','Архитектура')} {item.number}: {t(item.question,item.questionRu || item.question)}</span> · {statusText(note.status)}
                </div>;
              })}
            </div>
            <div className="rounded-xl border p-3 space-y-2">
              <h3 className="text-sm font-bold">{t('3. Offene Fragen an Isa','3. Вопросы к Исе')} ({openClientQuestions.length})</h3>
              {openClientQuestions.length === 0 ? <p className="text-xs text-slate-500">{t('Keine offenen Kundenfragen in der aktuellen Fragenliste.','В текущем списке нет открытых вопросов.')}</p> : openClientQuestions.map(question => <div key={question.id} className="border-t pt-2 text-xs">
                <p className="font-semibold">{t(question.clientQuestion || question.question,question.clientQuestionRu || question.questionRu || question.question)}</p>
                {question.notes && <p className="mt-1 text-slate-600">{question.notes}</p>}
              </div>)}
            </div>
            <div className="rounded-xl border p-3 space-y-2">
              <h3 className="text-sm font-bold">{t('4. Vereinbarte nächste Schritte','4. Следующие шаги')} ({followUpEntries.length})</h3>
              {followUpEntries.length === 0 ? <p className="text-xs text-slate-500">{t('Noch keine konkreten Aufgaben notiert.','Пока нет записанных задач.')}</p> : followUpEntries.map(entry => <div key={entry.key} className="border-t pt-2 text-xs">
                <p className="font-semibold">{entry.label}</p>
                <p>{entry.note?.nextStep}</p>
                <p className="text-slate-500">{t('Verantwortlich:','Ответственный:')} {entry.note?.owner || '—'}</p>
              </div>)}
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <button className="rounded-lg border bg-slate-900 text-white text-xs px-3 py-2 inline-flex items-center gap-2" onClick={() => downloadFile('ProRiv_Senior_Protokoll.md',writeProtocol(notesRef.current,questionsRef.current),'text/markdown')}>
                <Download className="h-4 w-4"/>{t('Gesprächsprotokoll exportieren','Экспорт протокола')}
              </button>
              <button className="rounded-lg border border-slate-300 bg-white text-xs px-3 py-2 inline-flex items-center gap-2" onClick={() => downloadFile('ProRiv_WorkshopNotes_Backup.json',JSON.stringify({exportedAt:new Date().toISOString(),workshopNotes:notesRef.current,questions:questionsRef.current},null,2),'application/json')}>
                <Download className="h-4 w-4"/>{t('Notizen-Backup (JSON)','Резервная копия JSON')}
              </button>
            </div>
          </div>}
          {phase !== 4 && inspector}
        </div>
      )}

      <p className="text-[11px] text-slate-500 inline-flex gap-2 items-start">
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0"/>
        {t('Die Inhalte kommen aus vorhandenen Projekt- und Recherchedaten; Änderungen an Gesprächsnotizen werden im Browser gespeichert, nicht auf GitHub oder einem Server. Für andere Geräte bitte Backup exportieren.','Данные взяты из текущей базы проекта. Заметки хранятся локально в браузере, не в GitHub. Для другого устройства экспортируйте копию.')}
      </p>
    </section>
  );
};
