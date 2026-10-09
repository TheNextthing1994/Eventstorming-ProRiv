/**
 * Compatibility alias for old AI Studio imports.
 *
 * The previous 6-topic presentation duplicated research cards, labeled
 * unverified technical suggestions as "Ergebnis / Antwort", and showed
 * unconfirmed approvals. The shared GuidedPresentation replaces it.
 *
 * Keep this exported component while older snapshots may still import it.
 */
import React from 'react';
import { DatabaseState, Language, TopicId } from '../types';
import { GuidedPresentation } from './GuidedPresentation';

interface PresentationModeProps {
  initialTopicId?: TopicId;
  databaseState: DatabaseState;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onExit: () => void;
  onNavigateHome: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  databaseState, language, onLanguageChange, onExit
}) => (
  <GuidedPresentation
    databaseState={databaseState}
    language={language}
    onLanguageChange={onLanguageChange}
    onExit={onExit}
  />
);
