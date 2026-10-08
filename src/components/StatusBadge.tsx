import React from 'react';
import { KnowledgeStatus, KnowledgeOrigin, Language } from '../types';
import { STATUS_LABELS, ORIGIN_LABELS } from '../i18n/translations';

export const STATUS_STYLE: Record<string, { dotColor: string; textColor: string }> = {
  project_known: {
    dotColor: 'bg-sky-600',
    textColor: 'text-sky-800'
  },
  recommended: {
    dotColor: 'bg-emerald-600',
    textColor: 'text-emerald-800'
  },
  open_decision: {
    dotColor: 'bg-rose-600',
    textColor: 'text-rose-800'
  },
  technical_verify: {
    dotColor: 'bg-purple-600',
    textColor: 'text-purple-800'
  },
  externally_unverified: {
    dotColor: 'bg-amber-600',
    textColor: 'text-amber-800'
  },
  confirmed: {
    dotColor: 'bg-emerald-600',
    textColor: 'text-emerald-800'
  },
  finding: {
    dotColor: 'bg-sky-600',
    textColor: 'text-sky-800'
  },
  recommendation: {
    dotColor: 'bg-emerald-600',
    textColor: 'text-emerald-800'
  },
  open: {
    dotColor: 'bg-rose-600',
    textColor: 'text-rose-800'
  },
  verify: {
    dotColor: 'bg-purple-600',
    textColor: 'text-purple-800'
  }
};

export const ORIGIN_STYLE: Record<KnowledgeOrigin, string> = {
  sketch: 'text-slate-600 font-mono',
  project_context: 'text-slate-600 font-medium',
  event_storming: 'text-indigo-700 font-medium',
  competitor_research: 'text-sky-700 font-medium',
  architecture_recommendation: 'text-emerald-700 font-medium'
};

export const STATUS_CONFIG = STATUS_STYLE;

interface StatusBadgeProps {
  status: KnowledgeStatus;
  origin?: KnowledgeOrigin;
  language?: Language;
  className?: string;
  showOrigin?: boolean;
}

/**
 * Clean status indicator respecting Zero-Pill discipline:
 * Unboxed typography with accessible color-dot + clear text label.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  origin,
  language = 'ru',
  className = '',
  showOrigin = false
}) => {
  const labelsDict = STATUS_LABELS[language] || STATUS_LABELS.ru;
  const statusInfo = labelsDict[status] || labelsDict.open_decision || { label: status, desc: '' };
  const style = STATUS_STYLE[status] || STATUS_STYLE.open_decision;

  const originDict = ORIGIN_LABELS[language] || ORIGIN_LABELS.ru;
  const originLabel = origin ? originDict[origin] : null;
  const originClass = origin ? ORIGIN_STYLE[origin] : '';

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 text-xs tracking-tight ${className}`}>
      {showOrigin && originLabel && (
        <>
          <span className={`text-[11px] ${originClass}`} title={originLabel}>
            {originLabel}
          </span>
          <span className="text-slate-300 select-none">/</span>
        </>
      )}
      <span
        className={`inline-flex items-center gap-1.5 font-medium ${style.textColor}`}
        title={statusInfo.desc}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dotColor}`} aria-hidden="true" />
        <span>{statusInfo.label}</span>
      </span>
    </span>
  );
};
