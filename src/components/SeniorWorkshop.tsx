import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ClipboardList, Download, ExternalLink, GitBranch, Lightbulb, MapPinned, MessageCircleQuestion, Save, ShieldCheck, X } from 'lucide-react';
import { DatabaseState, Language, TopicId } from '../types';
import { DOMAIN_EVENTS_LIST } from '../db/knowledgeSeed';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { loadWorkshopNotes, saveWorkshopNotes, WorkshopNote, WorkshopNotes } from '../db/indexedDb';
import { WORKSHOP_ROLE_LABELS, WORKSHOP_STEPS, WorkshopStep } from '../data/workshopContent';

interface SeniorWorkshopProps {
  databaseState: DatabaseState;
  language: Language;
  onNavigateHome: () => void;
  onSelectTopic: (topicId: TopicId) => void;
  onNavigateSection: (section: string) => void;
}

const phases = [
  { title: 'Auf der Baustelle', titleRu: 'На объекте', ids: ['arrival', 'time', 'work'] },
  { title: 'Rapport vorbereiten', titleRu: 'Создание рапорта', ids: ['pricing', 'send'] },
  { title: 'Kundenantwort', titleRu: 'Ответ клиента', ids: ['customer'] },
  { title: 'Tripletex & Buchhaltung', titleRu: 'Tripletex и бухгалтерия', ids: ['export', 'approval', 'accounting'] }
];

function isRelevantToTopic<T extends {topicId: TopicId; additionalTopicIds?: TopicId[]}>(item: T, topicId: TopicId) {
  return item.topicId === topicId || Boolean(item.additionalTopicIds?.includes(topicId));
}

function createMarkdown(notes: WorkshopNotes) {
  const now = new Date().toLocaleString('de-AT');
  let markdown = '# ISA / ProRiv – Senior-Workshop-Protokoll\n\nStand: ' + now + '\n\n';
  markdown += '> Grundlage: Kundengespräch RAW, Deep Research und bestehende GitHub-Recherche. Vorschläge sind nicht automatisch freigegeben.\n\n';
  for (const step of WORKSHOP_STEPS) {
    const note = notes[step.id];
    markdown += '## ' + step.nr + '. ' + step.title + '\n\n';
    markdown += '**Kundenaussage (Gesprächsnotiz):** ' + step.customerFact + '\n\n';
    markdown += '**Vorschlag:** ' + step.recommendation + '\n\n';
    markdown += '**Offene Frage:** ' + step.openQuestion + '\n\n';
    markdown += '**Ergebnis:** ' + (note?.status === 'decided' ? 'Entschieden' : note?.status === 'test' ? 'Zu prüfen' : 'Offen') + '\n\n';
    markdown += '**Besprochene Antwort:** ' + (note?.answer || '—') + '\n\n';
    markdown += '**Verantwortlich:** ' + (note?.owner || '—') + '\n\n';
    markdown += '**Nächster Schritt:** ' + (note?.nextStep || '—') + '\n\n';
    markdown += '**Quelle:** ' + step.source + '\n\n';
  }
  return markdown;
}

function downloadText(filename: string, text: string, mime: string) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const SeniorWorkshop: React.FC<SeniorWorkshopProps> = ({
  databaseState, language, onNavigateHome, onSelectTopic, onNavigateSection
}) => {
  const ru = language === 'ru';
  const dual = language === 'bilingual';
  const t = (de: string, russian: string) => ru ? russian : de;
  const [selectedId, setSelectedId] = useState(() => {
    try {
      const stored = sessionStorage.getItem('isa_workshop_last_step');
      return WORKSHOP_STEPS.some(step => step.id === stored) ? stored! : 'arrival';
    } catch { return 'arrival'; }
  });
  useEffect(() => {
    try { sessionStorage.setItem('isa_workshop_last_step', selectedId); } catch { /* in-memory view still works */ }
  }, [selectedId]);
  const [deepOpen, setDeepOpen] = useState(false);
  const [notes, setNotes] = useState<WorkshopNotes>({});
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    let alive = true;
    loadWorkshopNotes().then(current => { if (alive) { setNotes(current); setLoaded(true); } })
      .catch(() => { if (alive) { setLoaded(true); setSaveStatus('error'); } });
    return () => { alive = false; };
  }, []);

  const selected = WORKSHOP_STEPS.find(s => s.id === selectedId) || WORKSHOP_STEPS[0];
  const selectedIndex = WORKSHOP_STEPS.findIndex(s => s.id === selected.id);
  const currentNote: WorkshopNote = notes[selected.id] || {
    status: 'open', answer: '', owner: '', nextStep: '', updatedAt: ''
  };
  const updateNote = (change: Partial<WorkshopNote>) => {
    if (!loaded) return;
    setSaveStatus('idle');
    setNotes(prev => ({
      ...prev,
      [selected.id]: { ...(prev[selected.id] || currentNote), ...change, updatedAt: new Date().toISOString() }
    }));
  };
  const saveNote = async () => {
    if (!loaded) return;
    if (currentNote.status === 'decided' && !currentNote.answer.trim()) {
      alert(t('Für „Entschieden“ zuerst die besprochene Antwort dokumentieren.', 'Для статуса «Решено» сначала запишите согласованный ответ.'));
      return;
    }
    setSaveStatus('saving');
    try {
      await saveWorkshopNotes(notes);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Workshop save failed', err);
      setSaveStatus('error');
    }
  };

  const topicQuestions = databaseState.questions.filter(q => q.topicId === selected.topicId);
  const findings = databaseState.findings.filter(f => isRelevantToTopic(f, selected.topicId));
  const competitors = databaseState.competitors.filter(f => isRelevantToTopic(f, selected.topicId));
  const recommendations = databaseState.recommendations.filter(f => isRelevantToTopic(f, selected.topicId));
  const openPoints = databaseState.openPoints.filter(f => isRelevantToTopic(f, selected.topicId));
  const decisions = databaseState.decisions.filter(f => isRelevantToTopic(f, selected.topicId));
  const topicCategory = selected.topicId === 'vremya' ? 'Session & Zeit' :
    selected.topicId === 'api' ? 'ERP & Tripletex' : selected.topicId === 'raport' ? 'Rapport & Aufmaß' : undefined;
  const relatedEvents = DOMAIN_EVENTS_LIST.filter(e => topicCategory && e.category === topicCategory);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 text-slate-900">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 py-5 space-y-4">
        {/* Quiet workshop header: the senior should understand the purpose in seconds. */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-start gap-3">
            <button onClick={onNavigateHome} className="mt-1 p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-100" title={t('Zur Originalskizze','К оригинальному эскизу')}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-emerald-800 uppercase">
                <MapPinned className="w-4 h-4" />
                {t('Senior-Meeting · ISA / ProRiv', 'Встреча с сеньором · ISA / ProRiv')}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
                {t('So arbeitet ProRiv – vom Einsatz bis Tripletex', 'Как работает ProRiv — от объекта до Tripletex')}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {t('Schritt auswählen · Kundenwunsch verstehen · Lösung prüfen · Entscheidung festhalten', 'Выберите шаг · поймите запрос · оцените решение · зафиксируйте решение')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => downloadText('ISA_Senior_Meeting_'+new Date().toISOString().slice(0,10)+'.md', createMarkdown(notes), 'text/markdown')}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100">
              <Download className="w-4 h-4" />{t('Meeting-Protokoll', 'Протокол встречи')}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)] gap-4 items-start">
          {/* L0: Overview stays on screen when the inspector changes. */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-bold text-base">{t('Prozesslandkarte', 'Карта процесса')}</h2>
                <p className="text-xs text-slate-500">{t('Neun Schritte · sechs Rollen · keine operative App', 'Девять шагов · шесть ролей · это не рабочее приложение')}</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-3 py-1">
                {t('Gesprächsgrundlage – kein genehmigter Soll-Prozess', 'Основа для обсуждения, не утверждённый процесс')}
              </span>
            </div>

            {phases.map((phase, pi) => (
              <div key={phase.title} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-slate-600 bg-slate-100">{pi+1}</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">{t(phase.title, phase.titleRu)}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-0 sm:pl-9">
                  {phase.ids.map(id => {
                    const step = WORKSHOP_STEPS.find(s => s.id === id)!;
                    const active = selected.id === id;
                    const note = notes[id];
                    return (
                      <button key={step.id} onClick={() => { setSelectedId(step.id); setDeepOpen(false); setSaveStatus('idle'); }}
                        className={`text-left rounded-xl p-3 border transition-all min-h-[93px] ${active ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-500/40 shadow-sm' : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300'}`}>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">{String(step.nr).padStart(2,'0')} · {t(WORKSHOP_ROLE_LABELS[step.actor].de, WORKSHOP_ROLE_LABELS[step.actor].ru)}</span>
                          {note?.status === 'decided' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                          {note?.status === 'test' && <MessageCircleQuestion className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <div className="font-semibold text-sm mt-1 leading-snug">{t(step.title,step.titleRu)}</div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t(step.customerFact,step.customerFactRu)}</p>
                      </button>
                    );
                  })}
                </div>
                {pi < 2 && <div className="flex justify-center mt-2 text-slate-300"><ArrowRight className="w-4 h-4 rotate-90" /></div>}
                {pi === 1 && <div className="my-3 px-3 py-2 bg-sky-50 border border-sky-100 text-[11px] text-sky-950 rounded-lg text-center">
                  {t('Ab hier zwei getrennte Stränge: Kundenantwort und Stundenverarbeitung in Tripletex. Keine zwingende Reihenfolge bestätigt.',
                     'Далее два отдельных пути: ответ клиента и обработка часов в Tripletex. Обязательный порядок не подтверждён.')}
                </div>}
              </div>
            ))}
            <div className="flex items-start gap-2 p-3 bg-sky-50 rounded-lg text-xs text-sky-900">
              <GitBranch className="w-4 h-4 shrink-0" />
              <p>{t('Wichtig: Kundenantwort und Tripletex-Stundenprüfung sind separate Vorgänge. Ob eine Reihenfolge verpflichtend ist, muss ProRiv klären.', 'Важно: ответ клиента и проверка часов в Tripletex — отдельные процессы. Обязательная зависимость не подтверждена.')}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button onClick={() => { setSelectedId(WORKSHOP_STEPS[Math.max(0,selectedIndex-1)].id); setDeepOpen(false); }} disabled={selectedIndex===0}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 disabled:opacity-30 hover:bg-slate-50">← {t('Zurück','Назад')}</button>
              <span className="text-xs text-slate-400 tabular-nums">{selectedIndex+1} / {WORKSHOP_STEPS.length}</span>
              <button onClick={() => { setSelectedId(WORKSHOP_STEPS[Math.min(WORKSHOP_STEPS.length-1,selectedIndex+1)].id); setDeepOpen(false); }} disabled={selectedIndex===WORKSHOP_STEPS.length-1}
                className="text-xs bg-slate-900 text-white rounded-lg px-3 py-2 disabled:opacity-30 hover:bg-slate-800">{t('Weiter','Дальше')} →</button>
            </div>
          </section>

          {/* L1: context lens; editable meeting record persists in IndexedDB. */}
          <aside className="xl:sticky xl:top-5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-5 bg-slate-900 text-white">
              <p className="uppercase tracking-wider text-[10px] font-semibold text-emerald-300">{String(selected.nr).padStart(2,'0')} · {t(WORKSHOP_ROLE_LABELS[selected.actor].de,WORKSHOP_ROLE_LABELS[selected.actor].ru)}</p>
              <h2 className="text-xl font-bold mt-1">{t(selected.title,selected.titleRu)}</h2>
              <p className="text-xs text-slate-300 mt-1">{t('Thema der Seniorskizze', 'Раздел эскиза')}: {TOPIC_DEFINITIONS[selected.topicId].sketchTitle}</p>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider"><ClipboardList className="w-4 h-4" />{t('Was der Kunde beschrieben hat', 'Что сказал заказчик')}</div>
                <p className="text-sm leading-relaxed">{t(selected.customerFact,selected.customerFactRu)}</p>
                {dual && <p className="text-xs text-slate-500 border-l-2 border-slate-200 pl-2">{selected.customerFactRu}</p>}
                <p className="text-[11px] text-slate-400">{selected.source}</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider"><Lightbulb className="w-4 h-4" />{t('Unser Vorschlag – nicht beschlossen', 'Наше предложение — не утверждено')}</div>
                <p className="text-sm leading-relaxed">{t(selected.recommendation,selected.recommendationRu)}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950"><MessageCircleQuestion className="w-4 h-4" />{t('Mit Senior klären', 'Обсудить с сеньором')}</div>
                <p className="text-sm text-amber-950">{t(selected.openQuestion,selected.openQuestionRu)}</p>
              </div>

              <details className="group border border-slate-200 rounded-lg">
                <summary className="flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-slate-700 cursor-pointer list-none">
                  <span><BookOpen className="inline w-3.5 h-3.5 mr-1.5" />{t('Welche Tools kommen infrage?', 'Какие инструменты подходят?')} ({selected.choices.length})</span>
                  <ChevronDown className="w-4 h-4 group-open:rotate-180" />
                </summary>
                <div className="border-t border-slate-100 p-3 space-y-3">
                  {selected.choices.map(choice => (
                    <div key={choice.name} className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{choice.name}</span>
                        <span className="text-[10px] uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{choice.kind === 'bestand' ? t('Bestand','Есть') : choice.kind === 'vorbild' ? t('Vorbild','Пример') : choice.kind === 'oss' ? 'OSS' : t('Dienst','Сервис')}</span>
                        {choice.link && <a href={choice.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-700" title="Projekt öffnen"><ExternalLink className="w-3.5 h-3.5" /></a>}
                      </div>
                      <p className="text-xs text-slate-600">{t(choice.why,choice.whyRu)}</p>
                    </div>
                  ))}
                </div>
              </details>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-600">{t('Meeting-Ergebnis festhalten', 'Зафиксировать результат')}</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['open','test','decided'] as const).map(status => (
                    <button key={status} disabled={!loaded || (status === 'decided' && !currentNote.answer.trim())}
                      onClick={() => updateNote({status})}
                      className={`text-[11px] py-2 px-1 rounded border transition-all disabled:opacity-40 ${currentNote.status===status ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {status==='open'?t('Offen','Открыто'):status==='test'?t('Zu prüfen','Проверить'):t('Entschieden','Решено')}
                    </button>
                  ))}
                </div>
                <label className="block text-[11px] font-semibold text-slate-600">{t('Antwort / Begründung', 'Ответ / обоснование')}
                  <textarea value={currentNote.answer} onChange={e=>updateNote({answer:e.target.value})} rows={2} disabled={!loaded}
                    placeholder={t('Was wurde tatsächlich vereinbart?', 'О чём договорились?')} className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-xs resize-y font-normal disabled:opacity-40" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="block text-[11px] font-semibold text-slate-600">{t('Verantwortlich', 'Ответственный')}
                    <input value={currentNote.owner} onChange={e=>updateNote({owner:e.target.value})} disabled={!loaded}
                      className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs font-normal" placeholder="Senior / Isa / ..." />
                  </label>
                  <label className="block text-[11px] font-semibold text-slate-600">{t('Nächster Schritt', 'Следующий шаг')}
                    <input value={currentNote.nextStep} onChange={e=>updateNote({nextStep:e.target.value})} disabled={!loaded}
                      className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs font-normal" placeholder={t('API prüfen, Kunden fragen ...','API, вопрос клиенту ...')} />
                  </label>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs ${saveStatus==='error'?'text-rose-700':'text-slate-500'}`}>
                    {saveStatus==='saving'?t('Speichere...','Сохранение...'):saveStatus==='saved'?t('In diesem Browser gespeichert','Сохранено в браузере'):saveStatus==='error'?t('Speichern fehlgeschlagen','Ошибка сохранения'):t('Lokal gespeichert nach Klick','Локально после нажатия')}
                  </span>
                  <button disabled={!loaded || saveStatus==='saving'} onClick={saveNote} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-lg text-xs text-white font-semibold">
                    <Save className="w-3.5 h-3.5" />{t('Speichern','Сохранить')}
                  </button>
                </div>
              </div>
              <button onClick={()=>setDeepOpen(x=>!x)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50">
                <span><BookOpen className="w-4 h-4 inline mr-2" />{t('Tiefenrecherche & Event Storming', 'Исследование и Event Storming')}</span>
                {deepOpen?<X className="w-4 h-4" />:<ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </aside>
        </div>

        {/* L2: connected live knowledge is preserved, never duplicated into a new data store. */}
        {deepOpen && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold">{t('Vollständige Recherche zum ausgewählten Thema', 'Полное исследование по выбранной теме')}</h2>
                <p className="text-xs text-slate-500">{TOPIC_DEFINITIONS[selected.topicId].sketchTitle} · {t('Bestandsdaten, keine neue Parallel-Datenbank', 'Существующие данные, без второй базы')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>onSelectTopic(selected.topicId)} className="rounded-lg px-3 py-2 border border-slate-200 text-xs font-semibold hover:bg-slate-50">{t('Alle Datensätze öffnen','Открыть все записи')} ↗</button>
                <button onClick={()=>onNavigateSection('event-storming')} className="rounded-lg px-3 py-2 border border-slate-200 text-xs font-semibold hover:bg-slate-50">Event Storming ↗</button>
                <button onClick={()=>onNavigateSection('competitors')} className="rounded-lg px-3 py-2 border border-slate-200 text-xs font-semibold hover:bg-slate-50">{t('Wettbewerber','Конкуренты')} ↗</button>
                <a href="https://github.com/TheNextthing1994/Eventstorming-ProRiv/blob/main/docs/DEEP_RESEARCH_2026-10-08_RAW.md" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-2 border border-slate-200 text-xs font-semibold hover:bg-slate-50">{t('Deep Research (Original, ungeprüft)', 'Deep Research (оригинал, не проверен)')} ↗</a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {[
                [t('Senior-Fragen','Вопросы'),topicQuestions.length],
                [t('Erkenntnisse','Выводы'),findings.length],
                [t('Wettbewerber','Конкуренты'),competitors.length],
                [t('Empfehlungen','Рекомендации'),recommendations.length],
                [t('Offene Punkte','Открытые вопросы'),openPoints.filter(p=>!p.isResolved).length],
                [t('Entscheidungen','Решения'),decisions.length]
              ].map(([label,value])=><div key={String(label)} className="bg-slate-50 rounded-lg p-3"><div className="text-xl font-bold">{value}</div><div className="text-xs text-slate-500">{label}</div></div>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-bold text-sm">{t('Originalfragen des Seniors','Исходные вопросы сеньора')}</h3>
                {topicQuestions.map(q=><div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="font-semibold">{ru?(q.questionRu || q.question):q.question}</div>
                  <div className="text-slate-600">{ru?(q.answerRu || q.answer):q.answer || t('Noch keine Antwort','Нет ответа')}</div>
                  {q.clientQuestion && <div className="text-amber-800">{t('An Kunden: ','Клиенту: ')}{ru?(q.clientQuestionRu||q.clientQuestion):q.clientQuestion}</div>}
                </div>)}
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-sm">{t('Recherche-Erkenntnisse','Результаты исследования')}</h3>
                {findings.slice(0,12).map(f=><div key={f.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="font-semibold">{ru?(f.titleRu||f.title):f.title}</div>
                  <div className="text-slate-600">{ru?(f.contentRu||f.content):f.content}</div>
                  <div className="text-[10px] text-slate-400">{f.status} · {f.sourceName||t('Quelle noch zu belegen','Источник не указан')}</div>
                </div>)}
                {findings.length>12 && <button onClick={()=>onSelectTopic(selected.topicId)} className="text-emerald-800 font-semibold text-xs">{t('Weitere Erkenntnisse im Archiv ansehen','Другие выводы в архиве')} →</button>}
              </div>
            </div>
            {relatedEvents.length>0 && <details className="border border-slate-200 rounded-xl p-4">
              <summary className="font-semibold text-sm cursor-pointer">{t('Domain Events und Regeln des bestehenden Entwurfs','События и правила текущего проекта')} ({relatedEvents.length})</summary>
              <p className="text-xs text-amber-800 mt-2">{t('Hinweis: Einige alte Event-Storming-Regeln enthalten noch unbestätigte Vorarbeiter-Rapportfreigaben. Diese bitte als historische Vorschläge lesen.', 'Внимание: часть старых правил содержит неподтверждённое одобрение рапорта прорабом. Это только прежние предложения.')}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                {relatedEvents.map(e=><div key={e.id} className="bg-slate-50 rounded-lg p-3 text-xs"><strong>{e.name}</strong><p className="mt-1 text-slate-600">{ru?(e.descriptionRu||e.description):e.description}</p></div>)}
              </div>
            </details>}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 inline mr-2" />{t('Beleglage: Kundengespräch ist vorläufiges RAW, Deep Research enthält Schätzungen. Praktische API-/Funktionsprüfungen sind noch durchzuführen. Keine automatisch als beschlossen markierten Vorschläge.', 'Основание: разговор с клиентом — черновой RAW, Deep Research содержит оценки. API и функции ещё требуют проверки. Предложения не являются решениями.')}
              <p className="mt-1">{selected.evidence}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
