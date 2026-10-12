import { ROLE_JOURNEYS, journeyQuestionKey, type JourneyRoleId } from '../data/roleJourneys';
import { ROLE_INTERACTIONS } from '../data/roleInteractions';
import type { WorkshopNote, WorkshopNotes } from '../db/indexedDb';
import type { IsaQuestionNotes } from '../types';
import { isaQuestionsForView } from './isaQuestions';

export function readWorkshopRoute(hash: string): { mode: 'process' | 'roles' | 'questions'; roleId?: JourneyRoleId; stepId?: string; interactionId?: string } {
  const [, roleId, stepId, interactionId] = hash.replace(/^#\/?/, '').split('/');
  if (roleId === 'questions') return { mode: 'questions' };
  if (roleId === 'roles') return { mode: 'roles', roleId: undefined, stepId: undefined };
  const role = ROLE_JOURNEYS.find(item => item.id === roleId);
  if (role && stepId === 'interaction') {
    const interaction = ROLE_INTERACTIONS.find(item => item.id === interactionId && item.participants.includes(role.id));
    return { mode: 'roles', roleId: role.id, stepId: undefined, interactionId: interaction?.id };
  }
  return {
    mode: role ? 'roles' : 'process',
    roleId: role?.id || 'admin',
    stepId: role?.steps.some(step => step.id === stepId) ? stepId : undefined
  };
}

export function changeWorkshopNote(notes: WorkshopNotes, key: string, change: Partial<WorkshopNote>): WorkshopNotes {
  const current = notes[key] || { status: 'open' as const, answer: '', owner: '', nextStep: '', updatedAt: '' };
  const note: WorkshopNote = { ...current, ...change, updatedAt: new Date().toISOString() };
  // Removing the answer reopens a recorded decision instead of leaving an
  // apparently decided but empty entry in persisted notes or exports.
  if (note.status === 'decided' && !note.answer.trim()) note.status = 'open';
  if (change.answer !== undefined && change.answer !== current.answer && change.isaConfirmed === undefined) note.isaConfirmed = false;
  if (!note.answer.trim()) note.isaConfirmed = false;
  return { ...notes, [key]: note };
}

export function roleJourneyMarkdown(notes: WorkshopNotes, sharedNotes: IsaQuestionNotes = {}): string {
  const lines = [
    '# Rollen-Workshop · ProRiv (Isa\'s Projekt)', '',
    '> Gesprächsvorbereitung. Team-Entwurf, Gesprächsgrundlage und neue Vorschläge sind keine bestätigte Spezifikation. „Entschieden“ dokumentiert ein Meeting-Ergebnis, keine formelle Kundenfreigabe.', ''
  ];
  if (Object.keys(sharedNotes).length) lines.push('## Archiv der ursprünglichen Rollenformulierungen', '', 'Die folgenden Quellformulierungen und früheren Einträge bleiben erhalten. Die aktuellen gemeinsamen Antworten stehen im Abschnitt „Gemeinsame Fragen und Antworten“.', '');
  for (const role of ROLE_JOURNEYS) {
    lines.push('## ' + role.name.de + ' / ' + role.name.ru, '', role.purpose.de, '', role.purpose.ru, '', role.boundary.de, '', role.boundary.ru, '');
    for (const [index, step] of role.steps.entries()) {
      lines.push('### ' + (index + 1) + '. ' + step.title.de + ' / ' + step.title.ru, '', '**Ausgangslage:** ' + step.situation.de, step.situation.ru, '', '**Handlung:** ' + step.action.de, step.action.ru, '', '**Systemreaktion (Vorschlag):** ' + step.system.de, step.system.ru, '', '**Übergabe:** ' + step.handover.de, step.handover.ru, '', '**Fehler / Offline / Korrektur:** ' + step.exceptions.de, step.exceptions.ru, '', '**Bisherige Grundlage:** ' + step.basis.de, step.basis.ru, '', '**Quelle:** ' + step.source, '');
      for (const question of step.questions) {
        const key = journeyQuestionKey(role.id, step.id, question.id);
        const note = notes[key];
        lines.push('#### Frage [' + key + ']', '', question.text.de, '', question.text.ru, '');
        if (question.previousAnswer) lines.push('**Vorhandene Antwort (' + (question.provenance === 'team' ? 'Teamvorschlag, unbestätigt' : 'Gesprächsgrundlage, zu bestätigen') + '):** ' + question.previousAnswer.de, question.previousAnswer.ru, '');
        lines.push('**Meeting-Status:** ' + (note?.status === 'decided' ? 'Entschieden' : note?.status === 'test' ? 'Zu prüfen' : 'Offen'), '**Besprochene Antwort:** ' + (note?.answer || '—'), '**Verantwortlich:** ' + (note?.owner || '—'), '**Nächster Schritt:** ' + (note?.nextStep || '—'), '');
        if (note?.revisedRecommendation?.trim()) lines.push('**Vorschlag an Isa:** ' + note.revisedRecommendation, '');
        lines.push('**Von Isa bestätigt:** ' + (note?.isaConfirmed && note.answer.trim() ? 'Ja – dokumentierte Antwort' : 'Nein'), '');
      }
    }
  }
  lines.push('## Rollenbeziehungen (Workshop-Vorschläge)', '', 'Die Rollenkarte ist eine Ansicht dieser vorhandenen Abläufe. Beziehungen und Aktionen sind keine bestätigten Zuständigkeiten.', '');
  for (const interaction of ROLE_INTERACTIONS) {
    lines.push('### ' + interaction.title.de + ' / ' + interaction.title.ru, '', '**Zwischen:** ' + interaction.participants.map(id => ROLE_JOURNEYS.find(r => r.id === id)!.name.de).join(' ↔ '), '**Quellablauf:** ' + (interaction.adminStepId ? 'Admin: ' + interaction.adminStepId : 'Prozess: ' + interaction.processStepId), '');
    interaction.beats.forEach((beat, i) => lines.push((i + 1) + '. **' + beat.actor + ':** ' + beat.action.de, '   ' + beat.action.ru));
    lines.push('');
  }
  const recorded = isaQuestionsForView('all').filter(q => sharedNotes[q.id] && (sharedNotes[q.id].reviewed || sharedNotes[q.id].proposal.trim() || sharedNotes[q.id].answer?.trim() || sharedNotes[q.id].comment.trim()));
  if (recorded.length) {
    lines.push('## Gemeinsame Fragen und Antworten', '', 'Diese Einträge werden von Rollenkarte und Fragenkatalog gemeinsam verwendet. Jede Frage erscheint hier einmal.', '');
    for (const q of recorded) {
      const note = sharedNotes[q.id];
      lines.push('### ' + q.title.de + ' [' + q.id + ']', '', q.text.de, '', q.text.ru, '',
        '**Vorschlag an Isa:** ' + (note.proposal || '—'), '**Besprochene Antwort:** ' + (note.answer || '—'),
        '**Von Isa bestätigt:** ' + (note.isaConfirmed ? 'Ja' : 'Nein'), '**Im Team durchgesehen:** ' + (note.reviewed ? 'Ja' : 'Nein'),
        '**Für Isa ausgewählt:** ' + (note.includeInIsa ? 'Ja' : 'Nein'), '**Teamkommentar:** ' + (note.comment || '—'),
        '**Verantwortlich:** ' + (note.owner || '—'), '**Nächster Schritt:** ' + (note.nextStep || '—'), '');
    }
  }
  return lines.join('\n');
}
