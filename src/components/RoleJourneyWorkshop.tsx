import React from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleHelp, ClipboardList, HardHat, ShieldCheck, Users, Save, ExternalLink } from 'lucide-react';
import { ROLE_JOURNEYS, journeyQuestionKey, type JourneyRoleId, type LocalizedText } from '../data/roleJourneys';
import { WORKSHOP_STEPS } from '../data/workshopContent';
import type { DatabaseState, Language, TopicId } from '../types';
import type { WorkshopNote, WorkshopNotes } from '../db/indexedDb';

interface Props {
  language: Language;
  roleId: JourneyRoleId;
  stepId?: string;
  notes: WorkshopNotes;
  databaseState: DatabaseState;
  loaded: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onNavigate: (role: JourneyRoleId, stepId?: string) => void;
  onOpenProcess: (stepId: string) => void;
  onSelectTopic: (topic: TopicId) => void;
  onUpdateNote: (key: string, change: Partial<WorkshopNote>) => void;
  onSave: () => Promise<void>;
}

function Copy({ text, language }: { text: LocalizedText; language: Language }) {
  return <>{language === 'ru' ? text.ru : text.de}{language === 'bilingual' && <span lang="ru" className="mt-1 block text-[0.9em] font-normal opacity-70">{text.ru}</span>}</>;
}

const icons = { worker: HardHat, foreman: Users, admin: ShieldCheck };
const blankNote: WorkshopNote = { status: 'open', answer: '', owner: '', nextStep: '', updatedAt: '' };

export function RoleJourneyWorkshop({ language, roleId, stepId, notes, databaseState, loaded, saveStatus, onNavigate, onOpenProcess, onSelectTopic, onUpdateNote, onSave }: Props) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const editable = loaded && saveStatus !== 'saving';
  const role = ROLE_JOURNEYS.find(item => item.id === roleId)!;
  const selected = role.steps.find(step => step.id === stepId) || role.steps[0];
  const index = selected ? role.steps.indexOf(selected) : 0;
  const questions = role.steps.flatMap(step => step.questions.map(q => journeyQuestionKey(role.id, step.id, q.id)));
  const decided = questions.filter(key => notes[key]?.status === 'decided').length;
  const selectedKeys = selected?.questions.map(q => journeyQuestionKey(role.id, selected.id, q.id)) || [];
  const selectedDone = selectedKeys.length > 0 && selectedKeys.every(key => notes[key]?.status === 'decided');
  const originalQuestions = databaseState.questions.filter(q => q.topicId === selected?.topicId);

  return (
    <section aria-label={t('Rollen-Workshop', 'Разбор ролей')} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{t('Eine Rolle von Anfang bis Ende durchgehen', 'Пройти одну роль от начала до конца')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('Rolle anklicken → Schritt wählen → Fragen mit Isa beantworten.', 'Нажмите на роль → выберите шаг → ответьте на вопросы с Исой.')}</p>
        </div>
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-900">{t('Admin: erster vollständiger Entwurf', 'Администратор: первый полный черновик')}</span>
      </div>

      <div className="flex flex-col xl:flex-row items-stretch gap-3">
        {ROLE_JOURNEYS.map(item => {
          const active = item.id === roleId;
          const Icon = icons[item.id];
          return (
            <section key={item.id} style={{ flex: active ? '6 1 0%' : '1 1 0%' }} className={`min-w-0 rounded-2xl border transition-[flex] motion-reduce:transition-none duration-300 overflow-hidden ${active ? 'bg-white border-emerald-700 shadow-sm' : 'bg-slate-100/70 border-slate-200'}`}>
              <button type="button" aria-expanded={active} aria-controls={'role-panel-' + item.id} onClick={() => { if (!active) onNavigate(item.id); }}
                className={`w-full text-left p-4 flex flex-col gap-3 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-emerald-600 ${active ? 'bg-slate-900 text-white' : 'hover:bg-slate-200/60 text-slate-800'}`}>
                <div className="flex items-center justify-between gap-2 w-full">
                  <Icon aria-hidden="true" className={`w-6 h-6 shrink-0 ${active ? 'text-emerald-300' : 'text-slate-500'}`} />
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${active ? 'text-emerald-300' : 'text-slate-500'}`}>{item.steps.length ? t('11 Schritte', '11 шагов') : t('Verknüpfter Ablauf', 'Связанный процесс')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold"><Copy text={item.name} language={language} /></h3>
                  <p className={`mt-1 text-xs leading-relaxed ${active ? 'text-slate-300' : 'text-slate-600'}`}><Copy text={item.purpose} language={language} /></p>
                </div>
                {!active && <span className="text-xs font-semibold mt-auto text-emerald-800">{t('Rolle öffnen', 'Открыть роль')} <ArrowRight className="inline w-3.5 h-3.5" /></span>}
              </button>
              {active && (
                <div id={'role-panel-' + item.id} className="p-4 md:p-5 space-y-4">
                  <p className="text-xs leading-relaxed text-slate-600 border-l-2 border-emerald-600 pl-3"><Copy text={role.boundary} language={language} /></p>

                  {!selected ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">{t('Im bestehenden Workshop durchgehen', 'Разобрать в существующей мастерской')}</h4>
                      {role.processStepIds.map(id => {
                        const process = WORKSHOP_STEPS.find(step => step.id === id)!;
                        return <button key={id} onClick={() => onOpenProcess(id)} className="w-full flex items-start gap-3 p-3 rounded-xl text-left border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300">
                          <span className="text-xs font-mono text-slate-500">{String(process.nr).padStart(2, '0')}</span>
                          <div className="min-w-0 flex-1"><div className="text-sm font-semibold"><Copy language={language} text={{ de: process.title, ru: process.titleRu }} /></div><p className="mt-1 text-xs text-slate-600"><Copy language={language} text={{ de: process.customerFact, ru: process.customerFactRu }} /></p></div>
                          <ArrowRight className="w-4 h-4 shrink-0 text-slate-500" />
                        </button>;
                      })}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-emerald-800">{decided} / {questions.length} {t('Fragen besprochen und entschieden', 'вопросов обсуждено и решено')}</span>
                        <span className="text-slate-500 tabular-nums">{index + 1} / {role.steps.length}</span>
                      </div>
                      <div role="progressbar" aria-label={t('Entschiedene Fragen', 'Решённые вопросы')} aria-valuenow={decided} aria-valuemin={0} aria-valuemax={questions.length} className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div style={{ width: `${questions.length ? decided / questions.length * 100 : 0}%` }} className="h-full rounded-full bg-emerald-600" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-[175px_minmax(0,1fr)] gap-4 items-start">
                        <nav aria-label={t('Admin-Schritte', 'Шаги администратора')} className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                          {role.steps.map((step, i) => {
                            const isSelected = selected.id === step.id;
                            const done = step.questions.every(q => notes[journeyQuestionKey(role.id, step.id, q.id)]?.status === 'decided');
                            return <button type="button" key={step.id} onClick={() => onNavigate(roleId, step.id)} aria-current={isSelected ? 'step' : undefined}
                              className={`shrink-0 min-w-[155px] md:min-w-0 w-auto md:w-full text-left rounded-xl p-2.5 border ${isSelected ? 'bg-emerald-50 border-emerald-600' : 'bg-slate-50 border-slate-200 hover:border-slate-400'}`}>
                              <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500"><span>{String(i + 1).padStart(2, '0')} · {t(step.phase.de, step.phase.ru)}</span>{done && <Check className="w-3.5 h-3.5 text-emerald-700" />}</div>
                              <div className="mt-1 text-xs font-semibold leading-snug"><Copy text={step.title} language={language} /></div>
                            </button>;
                          })}
                        </nav>
                        <article aria-labelledby="role-step-heading" className="min-w-0 space-y-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                              <span>{String(index + 1).padStart(2, '0')} · {t(selected.phase.de, selected.phase.ru)}</span>
                              <span className={`rounded-full px-2 py-0.5 ${selectedDone ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{selectedDone ? t('Im Meeting entschieden', 'Решено на встрече') : t('Mit Isa klären', 'Уточнить с Исой')}</span>
                            </div>
                            <h4 id="role-step-heading" className="mt-2 text-xl font-bold tracking-tight"><Copy text={selected.title} language={language} /></h4>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600"><Copy text={selected.situation} language={language} /></p>
                          </div>

                          <div className="space-y-3 rounded-xl border border-slate-200 p-3.5">
                            <div><h5 className="text-xs font-bold text-slate-900 mb-1">{t('Was macht der Admin?', 'Что делает администратор?')}</h5><p className="text-sm leading-relaxed text-slate-700"><Copy text={selected.action} language={language} /></p></div>
                            <div className="border-t border-slate-100 pt-3"><h5 className="text-xs font-bold text-slate-900 mb-1">{t('Was passiert im System? · Vorschlag', 'Что происходит в системе? · Предложение')}</h5><p className="text-sm leading-relaxed text-slate-700"><Copy text={selected.system} language={language} /></p></div>
                            <div className="border-t border-slate-100 pt-3"><h5 className="text-xs font-bold text-slate-900 mb-1">{t('Wer übernimmt als Nächstes?', 'Кто принимает следующий шаг?')}</h5><p className="text-sm leading-relaxed text-slate-700"><Copy text={selected.handover} language={language} /></p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selected.targetRole && <button onClick={() => onNavigate(selected.targetRole!)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-2 hover:bg-emerald-100">{t('Übergabe ansehen', 'Посмотреть передачу')}: {t(ROLE_JOURNEYS.find(r => r.id === selected.targetRole)!.name.de, ROLE_JOURNEYS.find(r => r.id === selected.targetRole)!.name.ru)} <ArrowRight className="w-3.5 h-3.5" /></button>}
                                {selected.processStepId && <button onClick={() => onOpenProcess(selected.processStepId!)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 bg-sky-50 rounded-lg px-2.5 py-2 hover:bg-sky-100">{t('Verbundener Prozess', 'Связанный процесс')} <ExternalLink className="w-3.5 h-3.5" /></button>}
                              </div>
                            </div>
                          </div>

                          {selected.id === 'report-policy' && <div className="grid sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-3 rounded-xl border border-sky-200 bg-sky-50"><strong>{t('Gesprächsgrundlage', 'По исходному разговору')}</strong><p className="mt-2">{t('Arbeiter → Kunde', 'Рабочий → Клиент')}</p></div>
                            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50"><strong>{t('Teamvorschlag · unbestätigt', 'Предложение команды · не подтверждено')}</strong><p className="mt-2">{t('Arbeiter → Vorarbeiter → Kunde', 'Рабочий → Прораб → Клиент')}</p></div>
                          </div>}

                          <div className="rounded-xl bg-rose-50/60 border border-rose-200 p-3.5"><h5 className="text-xs font-bold text-rose-950 mb-1">{t('Fehler · Offline · Korrekturen', 'Ошибки · Без связи · Исправления')}</h5><p className="text-xs leading-relaxed text-rose-900"><Copy text={selected.exceptions} language={language} /></p></div>

                          <details className="rounded-xl border border-slate-200 p-3 text-xs text-slate-600"><summary className="cursor-pointer font-semibold text-slate-700">{t('Bisherige Grundlage und Quelle', 'Исходные данные и источник')}</summary><p className="mt-2 leading-relaxed"><Copy text={selected.basis} language={language} /></p><p className="mt-2 text-[10px] text-slate-500 break-words">{selected.source}</p></details>

                          <section aria-label={t('Fragen an Isa', 'Вопросы Исе')} className="space-y-3">
                            <h5 className="flex items-center gap-2 text-sm font-bold"><CircleHelp className="w-4 h-4 text-amber-700" />{t('Diese Fragen Isa stellen', 'Задать Исе эти вопросы')} <span className="text-slate-400 font-normal">({selected.questions.length})</span></h5>
                            {selected.questions.map((question, qi) => {
                              const key = journeyQuestionKey(roleId, selected.id, question.id);
                              const note = notes[key] || blankNote;
                              return <div key={key} className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 space-y-3">
                                <p className="text-sm font-semibold leading-relaxed text-slate-900"><span className="text-amber-700 mr-1">{qi + 1}.</span><Copy text={question.text} language={language} /></p>
                                {question.previousAnswer && <div className="text-xs rounded-lg bg-white/80 p-2.5 border border-slate-200"><strong className="text-slate-600">{question.provenance === 'team' ? t('Vorhandener Teamvorschlag · Isa muss bestätigen', 'Предложение команды · Иса должен подтвердить') : t('Vorhandene Gesprächsgrundlage · nochmals bestätigen', 'По исходному разговору · подтвердить снова')}</strong><p className="mt-1 leading-relaxed text-slate-600"><Copy text={question.previousAnswer} language={language} /></p></div>}
                                <label className="block text-xs font-semibold text-slate-600">{t('Antwort von Isa / Ergebnis', 'Ответ Исы / результат')}
                                  <textarea disabled={!editable} rows={2} value={note.answer} onChange={e => onUpdateNote(key, { answer: e.target.value })} placeholder={t('Hier die tatsächliche Antwort festhalten …', 'Запишите фактический ответ …')} className="mt-1 w-full rounded-lg bg-white border border-slate-300 p-2.5 text-sm font-normal resize-y disabled:opacity-50" />
                                </label>
                                <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('Status der Frage', 'Статус вопроса')}>
                                  {(['open', 'test', 'decided'] as const).map(status => <button key={status} type="button" disabled={!editable || (status === 'decided' && !note.answer.trim())} aria-pressed={note.status === status} onClick={() => onUpdateNote(key, { status })} className={`rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40 ${note.status === status ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>{status === 'open' ? t('Offen', 'Открыто') : status === 'test' ? t('Zu prüfen', 'Проверить') : t('Entschieden', 'Решено')}</button>)}
                                </div>
                                <details className="text-xs text-slate-600"><summary className="cursor-pointer font-semibold">{t('Verantwortlicher und nächster Schritt', 'Ответственный и следующий шаг')}</summary><div className="grid sm:grid-cols-2 gap-2 mt-2">
                                  <label>{t('Verantwortlich', 'Ответственный')}<input disabled={!editable} value={note.owner} onChange={e => onUpdateNote(key, { owner: e.target.value })} className="mt-1 p-2 rounded-lg w-full bg-white border border-slate-300" /></label>
                                  <label>{t('Nächster Schritt', 'Следующий шаг')}<input disabled={!editable} value={note.nextStep} onChange={e => onUpdateNote(key, { nextStep: e.target.value })} className="mt-1 p-2 rounded-lg w-full bg-white border border-slate-300" /></label>
                                </div></details>
                              </div>;
                            })}
                          </section>

                          {originalQuestions.length > 0 && <details className="rounded-xl border border-slate-200 p-3 text-xs"><summary className="font-semibold cursor-pointer flex items-center justify-between gap-2"><span><ClipboardList className="inline w-3.5 h-3.5 mr-1" />{t('Vorhandene Senior-Fragen zu diesem Thema', 'Исходные вопросы сеньора по этой теме')} ({originalQuestions.length})</span><ChevronDown className="w-3.5 h-3.5" /></summary><div className="mt-3 space-y-3">{originalQuestions.map(q => <div key={q.id} className="border-t border-slate-100 pt-2"><p className="font-semibold"><Copy language={language} text={{ de: q.question, ru: q.questionRu || q.question }} /></p><p className="mt-1 text-slate-600"><span className="font-semibold">{t('Bisherige Antwort / Vorschlag: ', 'Прежний ответ / предложение: ')}</span><Copy language={language} text={{ de: q.answer || 'Noch keine Antwort', ru: q.answerRu || q.answer || 'Ответа пока нет' }} /></p></div>)}<button onClick={() => onSelectTopic(selected.topicId)} className="text-emerald-800 font-semibold">{t('Im Recherchebereich öffnen', 'Открыть в разделе исследований')} →</button></div></details>}

                          <div className="sticky bottom-3 rounded-xl border border-slate-200 bg-white/95 shadow-sm p-3 flex flex-wrap items-center justify-between gap-2">
                            <button type="button" onClick={() => onNavigate(roleId, role.steps[index - 1].id)} disabled={index === 0} className="rounded-lg border border-slate-200 p-2 text-xs font-semibold disabled:opacity-30 hover:bg-slate-50"><ArrowLeft className="inline w-3.5 h-3.5 mr-1" />{t('Zurück', 'Назад')}</button>
                            <button type="button" disabled={!editable} onClick={onSave} className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 text-xs font-semibold disabled:opacity-50"><Save className="inline w-3.5 h-3.5 mr-1.5" />{t('Antworten speichern', 'Сохранить ответы')}</button>
                            <button type="button" onClick={() => onNavigate(roleId, role.steps[index + 1].id)} disabled={index === role.steps.length - 1} className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white p-2 text-xs font-semibold disabled:opacity-30">{t('Weiter', 'Дальше')}<ArrowRight className="inline w-3.5 h-3.5 ml-1" /></button>
                          </div>
                          <p role="status" aria-live="polite" className={`text-xs ${saveStatus === 'error' ? 'text-rose-800' : 'text-slate-500'}`}>{saveStatus === 'saving' ? t('Speichere …', 'Сохранение …') : saveStatus === 'saved' ? t('Antworten in diesem Browser gespeichert.', 'Ответы сохранены в этом браузере.') : saveStatus === 'error' ? t('Laden oder Speichern fehlgeschlagen. Antworten über das Meeting-Protokoll sichern; bei Ladefehler ist Bearbeiten gesperrt.', 'Ошибка загрузки или сохранения. Сохраните ответы через протокол; при ошибке загрузки редактирование заблокировано.') : t('Schrittwechsel behält Eingaben. Für dauerhafte Ablage „Antworten speichern“ klicken. Vor Gerätewechsel Protokoll exportieren.', 'Переход между шагами сохраняет введённое. Нажмите «Сохранить ответы». Перед сменой устройства экспортируйте протокол.')}</p>
                        </article>
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
