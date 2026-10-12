import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, CircleHelp, ClipboardList, GitBranch, Handshake, KeyRound, Lightbulb, ListChecks, Save, ShieldCheck } from 'lucide-react';
import { ROLE_JOURNEYS, type JourneyRoleId, type LocalizedText } from '../data/roleJourneys';
import { roleHandoffs, roleKnowledgeItems, roleKnowledgeState, type RoleBranchId, type RoleKnowledgeItem, type RoleKnowledgeState } from '../data/roleKnowledge';
import type { WorkshopNotes } from '../db/indexedDb';
import type { Language } from '../types';

interface Props {
  roleId?: JourneyRoleId;
  stepId?: string;
  interactionId?: string;
  language: Language;
  notes: WorkshopNotes;
  editable: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onNavigate: (roleId?: JourneyRoleId, stepId?: string, interactionId?: string) => void;
  onOpenProcess: (stepId: string) => void;
  onSave: () => Promise<void>;
  renderAnswerFields: (key: string, proposal?: LocalizedText) => ReactNode;
}

const branches = [
  { id: 'rights', title: { de: 'Was darf ich?', ru: 'Что мне разрешено?' }, subtitle: { de: 'Rechte und Grenzen', ru: 'Права и ограничения' }, icon: KeyRound },
  { id: 'duties', title: { de: 'Was muss ich?', ru: 'Что я обязан делать?' }, subtitle: { de: 'Pflichten und Aufgaben', ru: 'Обязанности и задачи' }, icon: ListChecks },
  { id: 'flow', title: { de: 'Mein Ablauf', ru: 'Мой путь' }, subtitle: { de: 'Vom Zugang bis zum Abschluss', ru: 'От доступа до завершения' }, icon: GitBranch },
  { id: 'handoffs', title: { de: 'Zusammenarbeit', ru: 'Взаимодействие' }, subtitle: { de: 'Wer übergibt was an wen?', ru: 'Кто, что и кому передаёт?' }, icon: Handshake },
  { id: 'questions', title: { de: 'Mit Isa klären', ru: 'Уточнить с Исой' }, subtitle: { de: 'Fragen, Vorschläge und Antworten', ru: 'Вопросы, предложения и ответы' }, icon: CircleHelp }
] as const;

function Copy({ text, language }: { text: LocalizedText; language: Language }) {
  return <>{language === 'ru' ? text.ru : text.de}{language === 'bilingual' && <span lang="ru" className="mt-1 block text-[0.9em] font-normal opacity-70">{text.ru}</span>}</>;
}

// Purpose-built vector portraits: helmet and vest, helmet and clipboard,
// office person and key. Role identity uses blue; knowledge uses traffic lights.
export function RolePortrait({ roleId, className = '' }: { roleId: JourneyRoleId; className?: string }) {
  return <svg viewBox="0 0 112 112" aria-hidden="true" className={className} fill="none">
    <path d="M56 5 99 29v49L56 104 13 78V29Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
    <g stroke="#1e3a5f" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      {roleId !== 'admin' ? <>
        <path d="M35 38a21 21 0 0 1 42 0" fill="#f8b842" />
        <path d="M50 18v18m12-18v18M31 39h50v7H31Z" fill="#f8b842" />
        <path d="M39 47v8a17 17 0 0 0 34 0v-8" fill="#fff" />
        <path d="M27 94V83c0-12 13-18 29-18s29 6 29 18v11" fill="#3b6b93" />
        <path d="m43 68 13 17 13-17M43 70v23m26-23v23" stroke="#f8b842" strokeWidth="5" />
        {roleId === 'worker'
          ? <><path d="M32 83h14m20 0h14" stroke="#fff" strokeWidth="3" /><path d="m37 95 6-12m-8-2 13 6" stroke="#1e3a5f" /></>
          : <><rect x="64" y="66" width="27" height="32" rx="4" fill="#fff" /><path d="M72 64h11v6H72Z" fill="#f8b842" /><path d="m70 81 3 3 5-6m-8 13h14" stroke="#1e3a5f" strokeWidth="2.5" /></>}
      </> : <>
        <path d="M38 37c0-12 7-18 18-18s18 6 18 18v15a18 18 0 0 1-36 0Z" fill="#fff" />
        <path d="M38 40V29c2-8 12-12 21-10 9 1 15 8 15 20L60 30l-22 10Z" fill="#315a83" />
        <path d="M27 94V83c0-13 13-19 29-19s29 6 29 19v11" fill="#3b6b93" />
        <path d="m44 67 12 15 12-15" fill="#fff" /><path d="m56 82-4 12h8Z" fill="#f8b842" />
        <path d="M88 73a8 8 0 1 0-11 7L66 91v6h7v-5h5v-5l5-5a8 8 0 0 0 5-9Z" fill="#f8b842" />
        <circle cx="83" cy="74" r="2" fill="#fff" strokeWidth="1.5" />
      </>}
    </g>
  </svg>;
}

function KnowledgeBadge({ state, language, confirmed = false }: { state: RoleKnowledgeState; language: Language; confirmed?: boolean }) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const Icon = state === 'evidenced' ? ShieldCheck : state === 'proposal' ? Lightbulb : CircleHelp;
  return <span className={'role-knowledge-badge role-state-' + state}>
    <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
    {state === 'evidenced' ? (confirmed ? t('Von Isa bestätigt', 'Подтверждено Исой') : t('Belegt · Gesprächsgrundlage', 'Есть источник · исходный разговор'))
      : state === 'proposal' ? t('Vorschlag / Teamstand', 'Предложение / позиция команды') : t('Offen · kein Vorschlag', 'Открыто · нет предложения')}
  </span>;
}

function StatusCounts({ items, notes, language }: { items: RoleKnowledgeItem[]; notes: WorkshopNotes; language: Language }) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  return <span className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[10px] font-medium">
    {(['evidenced', 'proposal', 'open'] as const).map(state => {
      const count = items.filter(item => roleKnowledgeState(item, item.noteKey ? notes[item.noteKey] : undefined) === state).length;
      return <span key={state} className={'role-count role-state-' + state}>
        <span aria-hidden="true" className="role-status-dot" />
        {count} {state === 'evidenced' ? t('belegt', 'с источником') : state === 'proposal' ? t('Vorschlag', 'предложений') : t('offen', 'открытых')}
      </span>;
    })}
  </span>;
}

export function RoleKnowledgeMap({ roleId, stepId, interactionId, language, notes, editable, saveStatus, onNavigate, onOpenProcess, onSave, renderAnswerFields }: Props) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const role = ROLE_JOURNEYS.find(item => item.id === roleId);
  const [branch, setBranch] = useState<RoleBranchId>(interactionId ? 'handoffs' : stepId ? 'flow' : 'rights');
  const detailRef = useRef<HTMLDivElement>(null);
  const detailId = React.useId();
  useEffect(() => {
    if (interactionId) setBranch('handoffs');
    else if (stepId) setBranch('flow');
  }, [interactionId, stepId]);
  const items = roleId ? roleKnowledgeItems(roleId, branch) : [];
  const handoffs = roleId ? roleHandoffs(roleId) : [];
  const selectedBranch = branches.find(item => item.id === branch)!;

  function openBranch(id: RoleBranchId) {
    if (interactionId || stepId) onNavigate(roleId);
    setBranch(id);
    requestAnimationFrame(() => {
      detailRef.current?.focus({ preventScroll: true });
      detailRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }

  if (!role) return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="px-5 pt-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700">{t('Rollenkarte', 'Карта ролей')}</p>
      <h2 className="mt-1 text-lg font-bold">{t('Welche Rolle willst du betrachten?', 'Какую роль хочешь рассмотреть?')}</h2>
    </div>
    <div className="relative h-[440px] sm:h-[420px]" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e150 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
      <svg viewBox="0 0 1000 440" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-slate-200" aria-hidden="true">
        <path d="M450 170 L280 270 M550 170 L720 270 M330 327 L670 327" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" />
      </svg>
      {([
        { id: 'admin', position: 'left-[50%] top-[27%]' },
        { id: 'worker', position: 'left-[23%] top-[73%]' },
        { id: 'foreman', position: 'left-[77%] top-[73%]' }
      ] as const).map(({ id, position }) => {
        const item = ROLE_JOURNEYS.find(entry => entry.id === id)!;
        return <button type="button" key={id}
          aria-label={t(item.name.de, item.name.ru) + t('-Perspektive öffnen', ': открыть перспективу')}
          onClick={() => onNavigate(id)}
          className={'group absolute w-[128px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-2 text-center transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600 sm:w-[160px] ' + position}>
          <RolePortrait roleId={id} className="mx-auto h-24 w-24 transition-transform motion-reduce:transition-none group-hover:scale-105 sm:h-32 sm:w-32" />
          <span className="mt-2 block text-sm font-bold sm:text-base"><Copy text={item.name} language={language} /></span>
        </button>;
      })}
      <p className="absolute left-1/2 top-[48%] w-[80%] -translate-x-1/2 text-center text-xs text-slate-500">{t('Ein Symbol anklicken. Die fünf Bereiche dieser Rolle klappen auf.', 'Нажми на символ. Откроются пять разделов этой роли.')}</p>
    </div>
  </div>;

  return <div className="space-y-4">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
        <div><p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{t('Deine Rollenperspektive', 'Твоя роль')}</p>
          <h2 className="mt-1 text-lg font-bold"><Copy text={role.name} language={language} /></h2>
          <p className="mt-1 text-xs text-slate-500">{t('Einen Ast auswählen. Die Details öffnen sich auf dieser Seite.', 'Выбери ветку. Подробности откроются на этой странице.')}</p>
        </div>
        <button type="button" onClick={() => onNavigate()} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />{t('Alle Rollen', 'Все роли')}
        </button>
      </div>
      <div className="role-map-grid" aria-label={t('Fünf Äste dieser Rolle', 'Пять ветвей этой роли')}>
        <svg className="role-map-arms" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
          {['M500 275 Q370 140 200 123', 'M500 275 Q630 140 800 123', 'M500 275 Q355 385 200 398', 'M500 275 Q645 385 800 398', 'M500 275 L500 470'].map((d, index) =>
            <path key={d} d={d} fill="none" stroke={branches[index].id === branch ? '#6366f1' : '#cbd5e1'} strokeWidth={branches[index].id === branch ? 2.8 : 1.6} pathLength="1" style={{ animationDelay: index * 65 + 'ms' }} />)}
        </svg>
        <div className="role-map-root">
          <button type="button" aria-label={t('Ausgewählte Rolle: ', 'Выбранная роль: ') + t(role.name.de, role.name.ru)}
            onClick={() => openBranch(branch)} aria-expanded="true" aria-controls={detailId}
            className="rounded-xl p-2 text-center focus-visible:outline-2 focus-visible:outline-indigo-600">
            <RolePortrait roleId={role.id} className="mx-auto h-28 w-28 sm:h-32 sm:w-32" />
            <span className="mt-2 block text-lg font-bold text-slate-900"><Copy text={role.name} language={language} /></span>
            <span className="mt-1 block text-[10px] text-slate-500">{t('5 Bereiche · eine Perspektive', '5 разделов · одна перспектива')}</span>
          </button>
        </div>
        {branches.map((item, index) => {
          const Icon = item.icon;
          const content = roleKnowledgeItems(role.id, item.id);
          return <button type="button" key={item.id} aria-pressed={item.id === branch} aria-controls={detailId}
            onClick={() => openBranch(item.id)} className={'role-map-node role-map-node-' + item.id + (item.id === branch ? ' is-active' : '')}
            style={{ animationDelay: index * 65 + 65 + 'ms' }}>
            <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><Icon aria-hidden="true" className="h-5 w-5" /></span>
            <span className="block text-sm font-bold"><Copy text={item.title} language={language} /></span>
            <span className="mb-2 mt-1 block text-[10px] text-slate-500"><Copy text={item.subtitle} language={language} /></span>
            {item.id === 'handoffs' ? <span className="text-[10px] text-amber-800">{handoffs.length} {t('Ablaufvorschläge', 'предложений процессов')}</span>
              : <StatusCounts items={content} notes={notes} language={language} />}
          </button>;
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs">
        <div className="flex flex-wrap gap-2"><KnowledgeBadge state="evidenced" language={language} /><KnowledgeBadge state="proposal" language={language} /><KnowledgeBadge state="open" language={language} /></div>
        <label className="flex items-center gap-2 text-slate-500">{t('Rolle wechseln', 'Сменить роль')}
          <select value={role.id} onChange={e => onNavigate(e.target.value as JourneyRoleId)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700">
            {ROLE_JOURNEYS.map(item => <option key={item.id} value={item.id}>{t(item.name.de, item.name.ru)}</option>)}
          </select>
        </label>
      </div>
    </div>

    <div id={detailId} ref={detailRef} tabIndex={-1} className="role-map-details rounded-2xl border border-slate-200 bg-white p-4 outline-none sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-700"><Copy text={role.name} language={language} /></p>
          <h3 className="mt-1 text-xl font-bold"><Copy text={selectedBranch.title} language={language} /></h3>
        </div>
        <span className="text-xs text-slate-500">{branch === 'handoffs' ? handoffs.length : items.length} {t('Punkte', 'пунктов')}</span>
      </div>
      {branch === 'handoffs' ? <div className="space-y-3">
        <p className="text-sm text-slate-500">{t('Die Übergaben sind Ablaufvorschläge. Klicke auf einen Austausch, um Schritte und Klärungsfragen zu sehen.', 'Передачи показаны как предложения процесса. Нажми на взаимодействие, чтобы увидеть шаги и вопросы.')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {handoffs.map(item => {
            const peer = ROLE_JOURNEYS.find(entry => item.participants.includes(entry.id) && entry.id !== role.id)!;
            return <button type="button" key={item.id} onClick={() => onNavigate(role.id, undefined, item.id)}
              aria-label={t('Zusammenarbeit ansehen: ', 'Посмотреть взаимодействие: ') + t(role.name.de, role.name.ru) + ' ↔ ' + t(peer.name.de, peer.name.ru) + ' · ' + t(item.title.de, item.title.ru)}
              aria-pressed={item.id === interactionId}
              className={'flex items-center gap-3 rounded-xl border p-3 text-left hover:border-indigo-400 ' + (item.id === interactionId ? 'border-indigo-500 bg-indigo-50' : 'border-amber-200 bg-amber-50/40')}>
              <RolePortrait roleId={peer.id} className="h-14 w-14 shrink-0" />
              <div className="min-w-0"><p className="text-[10px] text-slate-500">{t(role.name.de, role.name.ru)} ↔ {t(peer.name.de, peer.name.ru)}</p>
                <p className="mt-1 text-sm font-semibold"><Copy text={item.title} language={language} /></p>
                <span className="mt-1 block text-[10px] text-amber-800">{t('Vorschlag · mit Isa klären', 'Предложение · уточнить с Исой')}</span>
              </div>
              <ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-indigo-600" />
            </button>;
          })}
        </div>
      </div> : <div className={'space-y-3 ' + (branch === 'flow' ? 'role-flow-list' : '')}>
        {items.map((item, index) => {
          const note = item.noteKey ? notes[item.noteKey] : undefined;
          const state = roleKnowledgeState(item, note);
          return <article key={item.id} className={'role-knowledge-item role-state-' + state}>
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-sm font-bold">{branch === 'flow' && <span className="mr-2 text-indigo-700">{index + 1}.</span>}<Copy text={item.title} language={language} /></h4>
              <KnowledgeBadge state={state} language={language} confirmed={!!item.question && !!note?.isaConfirmed && !!note.answer.trim()} />
            </div>
            <p className={'text-sm leading-relaxed ' + (item.question ? 'font-semibold' : 'text-slate-700')}><Copy text={item.text} language={language} /></p>
            {item.question && item.noteKey && <div className="mt-3 space-y-3">
              {item.context && <details className="rounded-lg border border-slate-200 bg-white/80 p-2.5 text-xs text-slate-600">
                <summary className="cursor-pointer font-semibold">{t('Bisherige Grundlage · Quelle ansehen', 'Исходные сведения · посмотреть источник')}</summary>
                <p className="mt-2 leading-relaxed"><Copy text={item.context} language={language} /></p>
              </details>}
              {renderAnswerFields(item.noteKey, item.proposal)}
            </div>}
            <details className="mt-3 text-[10px] text-slate-500"><summary className="cursor-pointer font-semibold">{t('Quelle', 'Источник')}</summary><p className="mt-1 break-words leading-relaxed">{item.source}</p></details>
            {!item.question && <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {item.interactionId && <button type="button" onClick={() => onNavigate(role.id, undefined, item.interactionId)} className="font-semibold text-indigo-700 hover:underline">{t('Austausch und Fragen öffnen', 'Открыть взаимодействие и вопросы')} <ArrowRight aria-hidden="true" className="inline h-3 w-3" /></button>}
              {item.adminStepId && <button type="button" onClick={() => role.id === 'admin' ? onNavigate('admin', item.adminStepId) : openBranch('questions')} className="font-semibold text-indigo-700 hover:underline">{t('Zugehörige Fragen öffnen', 'Открыть связанные вопросы')} <ArrowRight aria-hidden="true" className="inline h-3 w-3" /></button>}
              {item.processStepId && <button type="button" onClick={() => onOpenProcess(item.processStepId!)} className="font-semibold text-indigo-700 hover:underline">{t('Prozess und Frage öffnen', 'Открыть процесс и вопрос')} <ArrowRight aria-hidden="true" className="inline h-3 w-3" /></button>}
            </div>}
          </article>;
        })}
      </div>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
        <a href="#/workshop/questions" className="flex items-center gap-1.5 font-semibold text-indigo-700 hover:underline"><ClipboardList aria-hidden="true" className="h-4 w-4" />{t('Gesamtkatalog der Fragen öffnen', 'Открыть полный каталог вопросов')}</a>
        <button type="button" disabled={!editable} onClick={onSave} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-700 disabled:opacity-40"><Save aria-hidden="true" className="h-3.5 w-3.5" />{t('Änderungen speichern', 'Сохранить изменения')}</button>
      </div>
      <p role="status" aria-live="polite" className={'mt-2 text-[11px] ' + (saveStatus === 'error' ? 'text-rose-800' : 'text-slate-500')}>
        {saveStatus === 'saving' ? t('Speichere …', 'Сохранение …') : saveStatus === 'saved' ? t('In diesem Browser gespeichert.', 'Сохранено в этом браузере.') : saveStatus === 'error' ? t('Speichern fehlgeschlagen. Eingaben über das Meeting-Protokoll sichern.', 'Ошибка сохранения. Сохраните записи через протокол встречи.') : t('Vorschläge und Antworten bearbeiten; anschließend speichern.', 'Измените предложения и ответы, затем сохраните.')}
      </p>
    </div>
  </div>;
}
