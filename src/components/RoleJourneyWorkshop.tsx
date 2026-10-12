import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ChevronDown, ClipboardCheck, CircleHelp, HardHat, KeyRound, Laptop2, Network, PlugZap, Save, ShieldUser, UserRound, Calculator } from 'lucide-react';
import { ADMIN_JOURNEY_STEPS, ROLE_JOURNEYS, type JourneyRoleId, type LocalizedText } from '../data/roleJourneys';
import { ROLE_INTERACTIONS, interactionForAdminStep, interactionsBetween, interactionSource, type InteractionActor, type RoleInteraction } from '../data/roleInteractions';
import type { DatabaseState, Language, TopicId } from '../types';
import type { WorkshopNote, WorkshopNotes } from '../db/indexedDb';
import { RoleKnowledgeMap, RolePortrait } from './RoleKnowledgeMap';
import { roleQuestions } from '../data/roleKnowledge';
import { ISA_TEAM_QUESTIONS } from '../data/isaTeamQuestions';
import { catalogQuestionsForRoleSource } from '../data/roleQuestionLinks';
import { useIsaQuestionStore } from '../hooks/useIsaQuestionStore';
import { isaNoteAsWorkshopNote, legacyEntriesForQuestion, relatedEntriesForQuestion } from '../utils/isaRoleQuestions';
import { IsaQuestionAnswerFields, downloadIsaQuestionsBackup } from './IsaSharedQuestion';

interface Props {
  language: Language;
  roleId?: JourneyRoleId;
  stepId?: string;
  interactionId?: string;
  notes: WorkshopNotes;
  databaseState: DatabaseState;
  loaded: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onNavigate: (role?: JourneyRoleId, stepId?: string, interactionId?: string) => void;
  onOpenProcess: (stepId: string) => void;
  onSelectTopic: (topic: TopicId) => void;
  onUpdateNote: (key: string, change: Partial<WorkshopNote>) => void;
  onSave: () => Promise<void>;
}

function Copy({ text, language }: { text: LocalizedText; language: Language }) {
  return <>{language === 'ru' ? text.ru : text.de}{language === 'bilingual' && <span lang="ru" className="mt-1 block text-[0.9em] font-normal opacity-65">{text.ru}</span>}</>;
}
const actorIcons = { worker: HardHat, foreman: ClipboardCheck, admin: ShieldUser, system: Laptop2, customer: UserRound, accounting: Calculator };
const actorLabels: Record<InteractionActor, LocalizedText> = {
  worker: { de: 'Arbeiter', ru: 'Рабочий' }, foreman: { de: 'Vorarbeiter', ru: 'Прораб' }, admin: { de: 'Admin', ru: 'Администратор' },
  system: { de: 'System', ru: 'Система' }, customer: { de: 'Kunde', ru: 'Клиент' }, accounting: { de: 'Buchhaltung', ru: 'Бухгалтерия' }
};
export function RoleJourneyWorkshop({ language, roleId, stepId, interactionId, notes, databaseState, loaded, saveStatus, onNavigate, onOpenProcess, onSelectTopic, onUpdateNote, onSave }: Props) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  React.useEffect(() => {
    if (interactionId || stepId) document.getElementById('role-exchange-details')?.scrollIntoView({ block: 'start' });
  }, [interactionId, stepId]);
  const role = ROLE_JOURNEYS.find(item => item.id === roleId);
  const interaction = ROLE_INTERACTIONS.find(item => item.id === interactionId && roleId && item.participants.includes(roleId)) || (roleId === 'admin' && stepId ? interactionForAdminStep(stepId) : undefined);
  const ownStep = roleId === 'admin' && stepId && !interaction ? ADMIN_JOURNEY_STEPS.find(step => step.id === stepId) : undefined;
  const { adminStep, processStep } = interaction ? interactionSource(interaction) : { adminStep: ownStep, processStep: undefined };
  const otherRoleId = interaction?.participants.find(id => id !== roleId);
  const otherRole = ROLE_JOURNEYS.find(item => item.id === otherRoleId);
  const related = roleId && otherRoleId ? interactionsBetween(roleId, otherRoleId) : [];
  const store = useIsaQuestionStore(databaseState);
  const sharedNotes = Object.fromEntries(Object.entries(store.notes).map(([id, note]) => [id, isaNoteAsWorkshopNote(note)]));
  const sharedSaveStatus = store.saveStatus === 'loading' ? 'idle' : store.saveStatus;
  const editable = loaded && store.loaded && sharedSaveStatus !== 'saving';
  const allQuestionKeys = roleId ? roleQuestions(roleId).map(item => item.noteKey!).filter(Boolean) : [];
  const decided = allQuestionKeys.filter(key => store.notes[key]?.reviewed).length;
  const detailQuestions = [...new Map((adminStep ? adminStep.questions.flatMap(q => catalogQuestionsForRoleSource(`admin:${adminStep.id}:${q.id}`)) : processStep ? catalogQuestionsForRoleSource('process:' + processStep.id) : []).map(q => [q.id, q])).values()];
  const fields = (id: string) => {
    const question = ISA_TEAM_QUESTIONS.find(q => q.id === id)!;
    return <IsaQuestionAnswerFields note={store.notes[id]} draft={store.drafts[id]} language={language} editable={editable}
      onUpdate={change => store.update(id, change)} onDraftChange={change => store.changeDraft(id, change)} onFinish={() => void store.finishDraft(id)} onClose={() => store.closeDraft(id)}
      legacyEntries={legacyEntriesForQuestion(id, { ...store.legacyNotes, ...notes })} relatedEntries={relatedEntriesForQuestion(question, store.notes)} />;
  };
  const sourceTopic = adminStep?.topicId || processStep?.topicId;
  const originalQuestions = databaseState.questions.filter(q => q.topicId === sourceTopic);

  return <section aria-label={t('Interaktive Rollenkarte', 'Интерактивная карта ролей')} className="space-y-6">
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-3">
        {role && <p role="status" className="text-xs text-slate-500">{store.loadError ? t('Fragen konnten nicht geladen werden. Bitte erneut laden.', 'Не удалось загрузить вопросы. Обновите страницу.') : t('Gleiche Fragen und Antworten wie im Fragenkatalog. Mit „Fertig“ speichern.', 'Те же вопросы и ответы, что в каталоге. Сохраняйте кнопкой «Готово».')}{store.loadError && <button type="button" onClick={() => window.location.reload()} className="ml-2 underline font-semibold">{t('Erneut laden', 'Обновить')}</button>}{store.saveStatus === 'error' && store.loaded && <span className="text-rose-800"> {t('Speichern fehlgeschlagen.', 'Ошибка сохранения.')} <button type="button" onClick={() => void store.persist(store.notesRef.current)} className="ml-2 font-semibold underline">{t('Erneut speichern', 'Сохранить ещё раз')}</button><button type="button" onClick={() => downloadIsaQuestionsBackup(store.notesRef.current)} className="ml-2 font-semibold underline">{t('Sicherung herunterladen', 'Скачать резервную копию')}</button></span>}</p>}
        <RoleKnowledgeMap key={roleId || 'overview'} roleId={roleId} stepId={stepId} interactionId={interaction?.id}
          language={language} notes={sharedNotes} editable={editable} saveStatus={sharedSaveStatus}
          onNavigate={onNavigate} onOpenProcess={onOpenProcess} onSave={store.saveAll}
          renderAnswerFields={fields} />
        {role && <div className="px-1 flex items-center justify-between gap-3 text-[11px] text-slate-500"><span>{t('Gesprächsgrundlage und Vorschläge · Isa muss Zuständigkeiten bestätigen.', 'Исходные сведения и предложения · Иса должен подтвердить обязанности.')}</span><span className="shrink-0 tabular-nums">{decided} / {allQuestionKeys.length} {t('durchgesehen', 'обсудили')}</span></div>}
      </div>

      {role && (interaction || ownStep) && <aside id="role-exchange-details" style={{ scrollMarginTop: 24 }} aria-label={t('Ausgewählte Zusammenarbeit', 'Выбранное взаимодействие')} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {!interaction && !ownStep ? (
          <div className="p-6 sm:p-8 min-h-[260px] flex flex-col justify-center text-center">
            <Network className="w-10 h-10 mx-auto text-emerald-700" />
            <h3 className="mt-4 text-lg font-bold">{t('Zusammenarbeit mit ', 'Взаимодействие с ролью «') + t(role.name.de, role.name.ru) + (language === 'ru' ? '»' : '')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-xl mx-auto">{t('Wähle oben im Rollenblock ein Partnersymbol oder eine Verbindung. Hier unten erscheint der konkrete Austausch: wer beginnt, was die andere Person macht und was noch zu klären ist.', 'Выбери выше в блоке роли символ партнёра или связь. Ниже появится конкретное взаимодействие: кто начинает, что делает другой участник и что ещё нужно уточнить.')}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {ROLE_JOURNEYS.filter(p => p.id !== role.id).map(peer => {
                const links = interactionsBetween(role.id, peer.id);
                if (links.length === 0) return null;
                return (
                  <div key={peer.id} className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-600 px-1">{t(role.name.de, role.name.ru)} ↔ {t(peer.name.de, peer.name.ru)}:</span>
                    {links.map(l => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => onNavigate(role.id, undefined, l.id)}
                        className="text-xs font-medium bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 transition-colors shadow-2xs"
                      >
                        {t(l.title.de, l.title.ru)}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : <>
          <div className="bg-slate-900 text-white p-5 sm:p-6"><p className="text-[10px] uppercase tracking-widest text-emerald-300 font-semibold">{otherRole ? t(role.name.de, role.name.ru) + ' ↔ ' + t(otherRole.name.de, otherRole.name.ru) : t('Aufgabenvorschlag · Admin', 'Предложение задачи · Администратор')}</p><h3 className="mt-2 text-xl font-bold"><Copy language={language} text={interaction?.title || ownStep!.title} /></h3></div>
          <div className="p-4 sm:p-6 space-y-4">
            {related.length > 1 && <nav aria-label={t('Abläufe dieser Verbindung', 'Процессы этой связи')} className="flex flex-wrap gap-1.5">{related.map(item => <button type="button" key={item.id} aria-pressed={item.id === interaction?.id} onClick={() => onNavigate(roleId, undefined, item.id)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${item.id === interaction?.id ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{t(item.title.de, item.title.ru)}</button>)}</nav>}

            {interaction ? <ol aria-label={t('So interagieren die Rollen', 'Так взаимодействуют роли')} className="space-y-2.5">{interaction.beats.map((beat, index) => {
              const Icon = actorIcons[beat.actor];
              const isMainRole = beat.actor === 'worker' || beat.actor === 'foreman' || beat.actor === 'admin';
              return <li key={index}><div className={`flex items-start gap-3 rounded-xl border p-3.5 ${beat.actor === roleId ? 'bg-indigo-50/60 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>{isMainRole ? <RolePortrait roleId={beat.actor as JourneyRoleId} className="mt-0.5 w-6 h-6 shrink-0 rounded-full" /> : <Icon aria-hidden="true" className="mt-0.5 w-5 h-5 shrink-0 text-slate-500" />}<div><div className="text-xs font-bold text-slate-700"><span className="text-slate-400 mr-1.5">{index + 1}.</span>{t(actorLabels[beat.actor].de, actorLabels[beat.actor].ru)}</div><p className="mt-1 text-sm leading-relaxed"><Copy text={beat.action} language={language} /></p></div></div>{index < interaction.beats.length - 1 && <ArrowDown aria-hidden="true" className="w-3.5 h-3.5 mx-auto my-1 text-slate-300" />}</li>;
            })}</ol> : <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200"><p className="text-sm text-slate-500 leading-relaxed"><Copy text={ownStep!.situation} language={language} /></p><p className="text-sm leading-relaxed"><Copy text={ownStep!.action} language={language} /></p></div>}

            {adminStep?.id === 'report-policy' && <div className="space-y-2 rounded-xl bg-amber-50 border border-amber-200 p-3"><p className="text-xs font-bold text-amber-900">{t('Zwei Varianten · Isa entscheidet', 'Два варианта · решает Иса')}</p><div className="text-xs space-y-2"><p><strong>{t('Gespräch: ', 'Разговор: ')}</strong>{t('Arbeiter → Kunde', 'Рабочий → Клиент')}</p><p><strong>{t('Teamvorschlag: ', 'Предложение команды: ')}</strong>{t('Arbeiter → Vorarbeiter → Kunde', 'Рабочий → Прораб → Клиент')}</p></div></div>}

            {adminStep && <details className="text-xs rounded-xl border border-slate-200 p-3"><summary className="font-semibold cursor-pointer">{t('Systemreaktion, Fehler und Offline-Fälle', 'Реакция системы, ошибки и работа без связи')}</summary><div className="mt-3 space-y-3 text-slate-600"><div><strong>{t('System · Vorschlag', 'Система · предложение')}</strong><p className="mt-1 leading-relaxed"><Copy text={adminStep.system} language={language} /></p></div><div><strong>{t('Fehler / Offline / Korrektur', 'Ошибки / без связи / исправления')}</strong><p className="mt-1 leading-relaxed"><Copy text={adminStep.exceptions} language={language} /></p></div><div><strong>{t('Weitere Übergabe', 'Следующая передача')}</strong><p className="mt-1 leading-relaxed"><Copy text={adminStep.handover} language={language} /></p></div></div></details>}

            <details open className="rounded-xl border border-amber-200 bg-amber-50/30 p-3.5"><summary className="flex items-center justify-between gap-2 font-bold text-sm cursor-pointer list-none"><span><CircleHelp className="inline w-4 h-4 mr-1.5 text-amber-700" />{t('Mit Isa klären', 'Уточнить с Исой')} ({detailQuestions.length})</span><ChevronDown className="w-4 h-4" /></summary><div className="mt-3 space-y-4">
              {detailQuestions.map((q, index) => <div key={q.id} className="space-y-2.5 border-t border-amber-100 pt-3"><p className="text-sm font-semibold leading-relaxed"><span className="mr-1 text-amber-700">{index + 1}.</span><Copy text={q.text} language={language} /></p>{fields(q.id)}</div>)}
            </div></details>

            <details className="rounded-xl border border-slate-200 p-3 text-xs text-slate-500"><summary className="font-semibold text-slate-600 cursor-pointer">{t('Grundlage und vorhandene Fragen', 'Исходные сведения и вопросы')}</summary><div className="mt-2 space-y-2"><p className="leading-relaxed"><Copy text={adminStep?.basis || { de: processStep!.customerFact, ru: processStep!.customerFactRu }} language={language} /></p><p className="break-words text-[10px]">{adminStep?.source || processStep?.source}</p>{originalQuestions.map(q => <div key={q.id} className="border-t border-slate-100 pt-2"><p className="font-semibold"><Copy language={language} text={{ de: q.question, ru: q.questionRu || q.question }} /></p><p className="mt-1"><Copy language={language} text={{ de: q.answer || 'Noch keine Antwort', ru: q.answerRu || q.answer || 'Ответа пока нет' }} /></p></div>)}</div></details>

            <div className="border-t border-slate-100 pt-3 pb-2 flex flex-wrap justify-between items-center gap-2"><button type="button" onClick={() => onNavigate(roleId)} className="text-xs text-slate-600 px-2 py-2 hover:bg-slate-50 rounded-lg"><ArrowLeft className="inline w-3.5 h-3.5 mr-1" />{t('Zur Rollenansicht', 'К виду роли')}</button><button type="button" disabled={!editable} onClick={store.saveAll} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-3.5 py-2 text-xs font-semibold disabled:opacity-40 shadow-xs"><Save className="inline w-3.5 h-3.5 mr-1.5" />{t('Antworten speichern', 'Сохранить ответы')}</button></div>
            <p role="status" aria-live="polite" className={`text-[11px] ${sharedSaveStatus === 'error' ? 'text-rose-800' : 'text-slate-400'}`}>{sharedSaveStatus === 'saving' ? t('Speichere …', 'Сохранение …') : sharedSaveStatus === 'saved' ? t('In diesem Browser gespeichert.', 'Сохранено в этом браузере.') : sharedSaveStatus === 'error' ? t('Speichern fehlgeschlagen. Antworten über das Meeting-Protokoll sichern.', 'Ошибка сохранения. Сохраните ответы через протокол.') : t('Mit „Fertig“ speichern. Dieselbe Antwort steht auch im Fragenkatalog.', 'Сохраните кнопкой «Готово». Этот же ответ виден в каталоге вопросов.')}</p>
            <div className="flex flex-wrap gap-2 text-xs">{processStep && <button onClick={() => onOpenProcess(processStep.id)} className="text-slate-500 hover:text-emerald-800">{t('Vollständigen Prozess ansehen', 'Посмотреть полный процесс')} <ArrowRight className="inline w-3 h-3" /></button>}{sourceTopic && <button onClick={() => onSelectTopic(sourceTopic)} className="text-slate-500 hover:text-emerald-800">{t('Recherche öffnen · Antworten vorher speichern', 'Открыть исследование · сначала сохранить ответы')} <ArrowRight className="inline w-3 h-3" /></button>}</div>
          </div>
        </>}
      </aside>}
    </div>
  </section>;
}
