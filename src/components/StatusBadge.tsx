import React from 'react';
import { KnowledgeStatus, KnowledgeOrigin } from '../types';

export const STATUS_CONFIG: Record<string, { label: string; dotColor: string; textColor: string; description: string }> = {
  project_known: {
    label: 'Bekannt aus Projektkontext',
    dotColor: 'bg-sky-600',
    textColor: 'text-sky-800',
    description: 'Bisherige Projektinformation – noch nicht offiziell vom Kunden abgenommen'
  },
  recommended: {
    label: 'Empfohlen',
    dotColor: 'bg-emerald-600',
    textColor: 'text-emerald-800',
    description: 'Architektur- oder Produktvorschlag unseres Teams'
  },
  open_decision: {
    label: 'Offen – fachlich zu entscheiden',
    dotColor: 'bg-rose-600',
    textColor: 'text-rose-800',
    description: 'Bedarf noch einer verbindlichen Entscheidung mit Senior oder Kunde'
  },
  technical_verify: {
    label: 'Technisch zu verifizieren',
    dotColor: 'bg-purple-600',
    textColor: 'text-purple-800',
    description: 'Muss als PoC oder API-Test gegen Tripletex/AWS geprüft werden'
  },
  externally_unverified: {
    label: 'Extern noch nicht belegt',
    dotColor: 'bg-amber-600',
    textColor: 'text-amber-800',
    description: 'Beobachtung ohne formale externe Quellenbestätigung'
  },
  // Legacy mappings:
  confirmed: {
    label: 'Bestätigt',
    dotColor: 'bg-emerald-600',
    textColor: 'text-emerald-800',
    description: 'Offiziell validiert'
  },
  finding: {
    label: 'Rechercheergebnis',
    dotColor: 'bg-sky-600',
    textColor: 'text-sky-800',
    description: 'Faktisch ermittelter Befund'
  },
  recommendation: {
    label: 'Empfohlen',
    dotColor: 'bg-emerald-600',
    textColor: 'text-emerald-800',
    description: 'Architektur- oder Produktvorschlag'
  },
  open: {
    label: 'Offen – fachlich zu entscheiden',
    dotColor: 'bg-rose-600',
    textColor: 'text-rose-800',
    description: 'Bedarf noch einer Klärung'
  },
  verify: {
    label: 'Technisch zu verifizieren',
    dotColor: 'bg-purple-600',
    textColor: 'text-purple-800',
    description: 'Muss technisch geprüft werden'
  }
};

export const ORIGIN_CONFIG: Record<KnowledgeOrigin, { label: string; textClass: string }> = {
  sketch: {
    label: 'Originalskizze des Seniors',
    textClass: 'text-slate-600 font-mono'
  },
  project_context: {
    label: 'Bisherige Projektinformationen',
    textClass: 'text-slate-600 font-medium'
  },
  event_storming: {
    label: 'Event-Storming-Entwurf',
    textClass: 'text-indigo-700 font-medium'
  },
  competitor_research: {
    label: 'Wettbewerbsrecherche',
    textClass: 'text-sky-700 font-medium'
  },
  architecture_recommendation: {
    label: 'Eigene Architektur-/Produkt-Empfehlung',
    textClass: 'text-emerald-700 font-medium'
  }
};

interface StatusBadgeProps {
  status: KnowledgeStatus;
  origin?: KnowledgeOrigin;
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
  className = '',
  showOrigin = false
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.open_decision;
  const originConf = origin ? ORIGIN_CONFIG[origin] : null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 text-xs tracking-tight ${className}`}>
      {showOrigin && originConf && (
        <>
          <span className={`text-[11px] ${originConf.textClass}`} title={`Herkunft: ${originConf.label}`}>
            {originConf.label}
          </span>
          <span className="text-slate-300 select-none">/</span>
        </>
      )}
      <span
        className={`inline-flex items-center gap-1.5 font-medium ${config.textColor}`}
        title={config.description}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`} aria-hidden="true" />
        <span>{config.label}</span>
      </span>
    </span>
  );
};
