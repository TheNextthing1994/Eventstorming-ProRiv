import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Download, ExternalLink, GitBranch, Layers3, Search, ShieldCheck } from 'lucide-react';
import { DatabaseState, Language, TopicId } from '../types';
import { WORKSHOP_STEPS, WORKSHOP_ROLE_LABELS, WorkshopStep } from '../data/workshopContent';
import { loadWorkshopNotes, saveWorkshopNotes, WorkshopNote, WorkshopNotes } from '../db/indexedDb';

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

function writeProtocol(notes: WorkshopNotes): string {
  const lines = ['# ProRiv (Isa\'s Projekt) – Senior-Gespräch', '', 'Stand: ' + new Date().toISOString(), '', 'Nur ausdrücklich als „Entschieden“ dokumentierte Punkte gelten als Gesprächsergebnis.', ''];
  for (const step of WORKSHOP_STEPS) {
    const note = notes[step.id] || EMPTY_NOTE;
    lines.push('## ' + step.nr + '. ' + step.title, '',
      '**Bisheriger Interviewstand, noch zu prüfen:** ' + step.customerFact, '',
      '**Unser Vorschlag, nicht beschlossen:** ' + step.recommendation, '',
      '**Offene Frage:** ' + step.openQuestion, '',
      '**Herkunft laut Projektbestand:** ' + step.source, '',
      '**Beleg-/Prüfhinweise:** ' + step.evidence, '',
      '**Gesprächsstatus:** ' + (note.status === 'decided' ? 'Entschieden' : note.status === 'test' ? 'Zu prüfen' : 'Offen'), '',
      '**Besprochene Antwort / Begründung:** ' + (note.answer || '—'), '',
      '**Verantwortlich:** ' + (note.owner || '—'), '',
      '**Nächster Schritt:** ' + (note.nextStep || '—'), '');
  }
  return lines.join('\n');
}

export const WorkshopFlowView: React.FC<WorkshopFlowViewProps> = ({ databaseState, language }) => {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const [phase, setPhase] = useState<number | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [researchIndex, setResearchIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
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
    const next = { ...notesRef.current, [id]: { ...existing, ...change, updatedAt: new Date().toISOString() } };
    notesRef.current = next;
    setNotes(next);
    setSaveState('saving');
    const version = ++revision.current;
    // Writes are sequenced; switching steps or typing quickly cannot reverse a newer edit.
    saveQueue.current = saveQueue.current.catch(() => {}).then(() => saveWorkshopNotes(next))
      .then(() => { if (revision.current === version) setSaveState('saved'); })
      .catch(() => { if (revision.current === version) setSaveState('error'); });
  };

  const active = WORKSHOP_STEPS.find(step => step.id === selectedStep);
  const clientQuestions = databaseState.questions.filter(q => q.needsClientClarification || Boolean(q.clientQuestion?.trim() || q.clientQuestionRu?.trim()));
  const decided = WORKSHOP_STEPS.filter(step => notes[step.id]?.status === 'decided').length;
  const verify = WORKSHOP_STEPS.filter(step => notes[step.id]?.status === 'test').length;

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
    setDetailOpen(false);
  };
  const choose = (id: string) => {
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
          <p className="font-bold text-[11px] text-slate-600 uppercase">{t('Interviewstand · nicht freigegeben','Из интервью · не утверждено')}</p>
          <p className="mt-2 text-slate-800 leading-relaxed">{t(active.customerFact,active.customerFactRu)}</p>
        </div>
        <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-200">
          <p className="font-bold text-[11px] text-emerald-800 uppercase">{t('Unser Vorschlag · nicht beschlossen','Наше предложение · не утверждено')}</p>
          <p className="mt-2 text-slate-800 leading-relaxed">{t(active.recommendation,active.recommendationRu)}</p>
        </div>
      </div>
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
                  <div className="flex items-start gap-2"><span className="shrink-0 text-amber-800">{q.isResolved ? '✓' : '○'}</span>
                    <p>{t(q.clientQuestion || q.question, q.clientQuestionRu || q.questionRu || q.question)}</p></div>
                  <p className="text-[10px] ml-5 text-slate-500 mt-1">{t('Quelle: Projekt-Fragenliste · Status: ','Источник: список вопросов · статус: ')}{q.isResolved ? t('geklärt','выяснено') : t('offen','открыто')}</p>
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
          </div>}

          {phase === 4 && <div className="space-y-4">
            <p className="text-sm">{t('Das sind Gesprächsstatus, keine automatisch genehmigten Architekturentscheidungen. Öffne einen Punkt, trage Ergebnis, Verantwortlichen und nächsten Schritt ein. Änderungen werden direkt in diesem Browser gespeichert.','Это статусы обсуждения, не автоматическое одобрение архитектуры. Укажите решение, ответственного и следующий шаг. Записи хранятся в браузере.')}</p>
            {chips(WORKSHOP_STEPS)}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <button className="rounded-lg border bg-slate-900 text-white text-xs px-3 py-2 inline-flex items-center gap-2" onClick={() => downloadFile('ProRiv_Senior_Protokoll.md',writeProtocol(notesRef.current),'text/markdown')}>
                <Download className="h-4 w-4"/>{t('Gesprächsprotokoll exportieren','Экспорт протокола')}
              </button>
              <button className="rounded-lg border border-slate-300 bg-white text-xs px-3 py-2 inline-flex items-center gap-2" onClick={() => downloadFile('ProRiv_WorkshopNotes_Backup.json',JSON.stringify({exportedAt:new Date().toISOString(),workshopNotes:notesRef.current},null,2),'application/json')}>
                <Download className="h-4 w-4"/>{t('Notizen-Backup (JSON)','Резервная копия JSON')}
              </button>
            </div>
          </div>}
          {inspector}
        </div>
      )}

      <p className="text-[11px] text-slate-500 inline-flex gap-2 items-start">
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0"/>
        {t('Die Inhalte kommen aus vorhandenen Projekt- und Recherchedaten; Änderungen an Gesprächsnotizen werden im Browser gespeichert, nicht auf GitHub oder einem Server. Für andere Geräte bitte Backup exportieren.','Данные взяты из текущей базы проекта. Заметки хранятся локально в браузере, не в GitHub. Для другого устройства экспортируйте копию.')}
      </p>
    </section>
  );
};
