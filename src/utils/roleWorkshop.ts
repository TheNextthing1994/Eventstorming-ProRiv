import { ROLE_JOURNEYS, journeyQuestionKey, type JourneyRoleId } from '../data/roleJourneys';
import { ROLE_INTERACTIONS } from '../data/roleInteractions';
import type { WorkshopNote, WorkshopNotes } from '../db/indexedDb';

export function readWorkshopRoute(hash: string): { mode: 'process' | 'roles'; roleId?: JourneyRoleId; stepId?: string; interactionId?: string } {
  const [, roleId, stepId, interactionId] = hash.replace(/^#\/?/, '').split('/');
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
  return { ...notes, [key]: note };
}

export function roleJourneyMarkdown(notes: WorkshopNotes): string {
  const lines = [
    '# Rollen-Workshop · ProRiv (Isa\'s Projekt)', '',
    '> Gesprächsvorbereitung. Team-Entwurf, Gesprächsgrundlage und neue Vorschläge sind keine bestätigte Spezifikation. „Entschieden“ dokumentiert ein Meeting-Ergebnis, keine formelle Kundenfreigabe.', ''
  ];
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
      }
    }
  }
  lines.push('## Rollenbeziehungen (Workshop-Vorschläge)', '', 'Die Rollenkarte ist eine Ansicht dieser vorhandenen Abläufe. Beziehungen und Aktionen sind keine bestätigten Zuständigkeiten.', '');
  for (const interaction of ROLE_INTERACTIONS) {
    lines.push('### ' + interaction.title.de + ' / ' + interaction.title.ru, '', '**Zwischen:** ' + interaction.participants.map(id => ROLE_JOURNEYS.find(r => r.id === id)!.name.de).join(' ↔ '), '**Quellablauf:** ' + (interaction.adminStepId ? 'Admin: ' + interaction.adminStepId : 'Prozess: ' + interaction.processStepId), '');
    interaction.beats.forEach((beat, i) => lines.push((i + 1) + '. **' + beat.actor + ':** ' + beat.action.de, '   ' + beat.action.ru));
    lines.push('');
  }
  return lines.join('\n');
}
