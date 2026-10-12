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

// Dedicated SVG emblems for each ProRiv role:
// - Admin: ProRiv_Admin_exakt.svg (Executive governance shield, administrator profile, master access key)
// - Worker: ProRiv_Arbeiter_exakt.svg (Crossed tools, safety hard hat, shift time-tracker)
// - Foreman: ProRiv_Vorarbeiter_exakt.svg (Architectural blueprint, supervisor helmet, verified checklist)
export const ROLE_SVG_MAP: Record<JourneyRoleId, { file: string; title: string }> = {
  admin: { file: '/ProRiv_Admin_exakt.svg', title: 'Admin' },
  worker: { file: '/ProRiv_Arbeiter_exakt.svg', title: 'Arbeiter' },
  foreman: { file: '/ProRiv_Vorarbeiter_exakt.svg', title: 'Vorarbeiter' }
};

export function RolePortrait({ roleId, className = '' }: { roleId: JourneyRoleId; className?: string }) {
  const [loadError, setLoadError] = useState(false);
  const asset = ROLE_SVG_MAP[roleId];

  if (!loadError) {
    return (
      <img
        src={asset.file}
        alt={asset.title}
        data-role={roleId}
        data-asset={asset.file}
        width={120}
        height={120}
        loading="eager"
        onError={() => setLoadError(true)}
        className={`pointer-events-none select-none inline-block object-contain ${className}`}
      />
    );
  }

  if (roleId === 'admin') {
    return (
      <svg viewBox="0 0 120 120" aria-label="Admin" data-asset="/ProRiv_Admin_exakt.svg" className={className} fill="none">
        <defs>
          <linearGradient id="admin-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="admin-shield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="admin-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Background Badge */}
        <circle cx="60" cy="60" r="54" fill="url(#admin-bg)" stroke="#818cf8" strokeWidth="2.5" />
        <circle cx="60" cy="60" r="48" stroke="#4338ca" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />

        {/* Corporate Governance & Security Shield */}
        <path d="M60 20 L86 32 C86 54 75 72 60 80 C45 72 34 54 34 32 Z"
              fill="url(#admin-shield)" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />
        <path d="M60 25 L81 35 C81 53 71 68 60 74 C49 68 39 53 39 35 Z"
              fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" strokeLinejoin="round" opacity="0.6" />

        {/* Executive / Administrator Figure Inside Shield */}
        <circle cx="60" cy="40" r="9" fill="#f8fafc" stroke="#c7d2fe" strokeWidth="1.5" />
        <path d="M47 62 C47 53 53 48 60 48 C67 48 73 53 73 62 Z" fill="#e0e7ff" />
        <path d="M58 52 L62 52 L63 60 L60 65 L57 60 Z" fill="#4f46e5" />
        <path d="M55 49 L60 55 L65 49" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />

        {/* Digital Hub / System Access Key & Management Badge at bottom */}
        <circle cx="60" cy="88" r="17" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
        
        {/* Golden Master Access Key (Tripletex & System Setup) */}
        <circle cx="54" cy="88" r="5.5" stroke="url(#admin-gold)" strokeWidth="2.2" fill="#0f172a" />
        <circle cx="54" cy="88" r="2.2" fill="url(#admin-gold)" />
        <path d="M59.5 88 H73 M66.5 88 V92 M70.5 88 V92" stroke="url(#admin-gold)" strokeWidth="2.4" strokeLinecap="round" />

        {/* Authority Triple-Node atop shield */}
        <circle cx="60" cy="18" r="3" fill="url(#admin-gold)" stroke="#b45309" strokeWidth="0.8" />
        <circle cx="48" cy="22" r="2.2" fill="url(#admin-gold)" />
        <circle cx="72" cy="22" r="2.2" fill="url(#admin-gold)" />
      </svg>
    );
  }

  if (roleId === 'worker') {
    return (
      <svg viewBox="0 0 120 120" aria-label="Arbeiter" data-asset="/ProRiv_Arbeiter_exakt.svg" className={className} fill="none">
        <defs>
          <linearGradient id="worker-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#431407" />
            <stop offset="50%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="helmet-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="tool-steel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Background Badge */}
        <circle cx="60" cy="60" r="54" fill="url(#worker-bg)" stroke="#fb923c" strokeWidth="2.5" />
        <circle cx="60" cy="60" r="48" stroke="#c2410c" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />

        {/* Crossed Craftsman Tools in Background (Wrench & Hammer) */}
        {/* Tool 1: Wrench (Schraubenschlüssel) diagonal */}
        <g transform="rotate(45 60 60)">
          <rect x="56" y="24" width="8" height="72" rx="4" fill="url(#tool-steel)" stroke="#475569" strokeWidth="1" />
          <path d="M53 28 C53 23 57 19 60 19 C63 19 67 23 67 28 H64 C64 26 62 25 60 25 C58 25 56 26 56 28 Z" fill="#64748b" />
          <circle cx="60" cy="88" r="4" fill="#64748b" />
        </g>

        {/* Tool 2: Hammer (Zimmermannshammer) diagonal */}
        <g transform="rotate(-45 60 60)">
          <rect x="56" y="26" width="8" height="68" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
          <path d="M46 25 H74 V35 H46 Z" fill="url(#tool-steel)" stroke="#334155" strokeWidth="1" />
          <path d="M44 26 H46 V34 H44 Z" fill="#64748b" />
          <path d="M74 27 C78 27 82 25 84 22 C82 28 80 33 74 33 Z" fill="url(#tool-steel)" stroke="#334155" strokeWidth="0.8" />
        </g>

        {/* Construction Safety Hard Hat (Schutzhelm) */}
        <path d="M36 58 C36 41 46 32 60 32 C74 32 84 41 84 58 Z"
              fill="url(#helmet-gold)" stroke="#ca8a04" strokeWidth="2" strokeLinejoin="round" />
        <path d="M57 32 H63 V54 H57 Z" fill="#fef08a" opacity="0.9" />
        <path d="M42 54 C42 45 48 38 56 35" stroke="#fef9c3" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 58 C30 55 36 54 44 54 H76 C84 54 90 55 90 58 C90 61 84 63 76 63 H44 C36 63 30 61 30 58 Z"
              fill="#eab308" stroke="#a16207" strokeWidth="2" />
        <circle cx="60" cy="58" r="2.5" fill="#713f12" />

        {/* Time Tracking / Stempeluhr Badge at bottom (Zeiterfassung & Schichtstempel) */}
        <circle cx="60" cy="88" r="16" fill="#1e293b" stroke="#fb923c" strokeWidth="2" />
        <circle cx="60" cy="88" r="13" fill="#0f172a" />
        <line x1="60" y1="77" x2="60" y2="79" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="60" y1="97" x2="60" y2="99" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="49" y1="88" x2="51" y2="88" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="69" y1="88" x2="71" y2="88" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="60" y1="88" x2="60" y2="81" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="88" x2="67" y2="92" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="88" r="1.8" fill="#fbbf24" />
      </svg>
    );
  }

  // foreman
  return (
    <svg viewBox="0 0 120 120" aria-label="Vorarbeiter" data-asset="/ProRiv_Vorarbeiter_exakt.svg" className={className} fill="none">
      <defs>
        <linearGradient id="foreman-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="plan-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="foreman-shield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
      </defs>

      {/* Background Badge */}
      <circle cx="60" cy="60" r="54" fill="url(#foreman-bg)" stroke="#34d399" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="48" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />

      {/* Rolled Blueprint / Architectural Site Plan */}
      <g transform="rotate(-25 60 60)">
        <rect x="22" y="55" width="76" height="11" rx="4" fill="url(#plan-blue)" stroke="#38bdf8" strokeWidth="1.2" />
        <ellipse cx="23" cy="60.5" rx="3" ry="5.5" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
        <path d="M35 58 H85 M40 63 H75" stroke="#bae6fd" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
      </g>

      {/* Supervisor White Hard Hat (Bauleiter / Vorarbeiter Helm) */}
      <g transform="translate(0, -6)">
        <path d="M38 46 C38 31 47 22 60 22 C73 22 82 31 82 46 Z"
              fill="url(#foreman-shield)" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
        <path d="M57 22 H63 V42 H57 Z" fill="#10b981" />
        <circle cx="60" cy="30" r="3" fill="#047857" stroke="#ffffff" strokeWidth="0.8" />
        <path d="M43 42 C43 35 48 29 55 26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 46 C32 43 38 42 46 42 H74 C82 42 88 43 88 46 C88 49 82 51 74 51 H46 C38 51 32 49 32 46 Z"
              fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      </g>

      {/* Supervisor Clipboard (Abnahme / Bauprotokoll / Stundenprüfung) */}
      <g transform="translate(4, 0)">
        <rect x="42" y="52" width="40" height="48" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
        <rect x="52" y="48" width="20" height="8" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <circle cx="62" cy="52" r="2" fill="#334155" />
        
        {/* Document Content / Checklist lines */}
        <line x1="49" y1="62" x2="75" y2="62" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="49" y1="70" x2="68" y2="70" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="49" y1="78" x2="72" y2="78" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        
        {/* Verified Green Checkmarks */}
        <path d="M48 62 L50 64 L54 60" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 70 L50 72 L54 68" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Acceptance & Approval Seal (Abnahme-Siegel) */}
        <circle cx="72" cy="88" r="14" fill="#047857" stroke="#ffffff" strokeWidth="2" />
        <path d="M66 88 L70 92 L78 84" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
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
