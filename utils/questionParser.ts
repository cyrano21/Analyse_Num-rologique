import { defaultQuestions } from './questions';

export function parseQuestions(rawQuestions: string, gameType: string): string[] {
  try {
    // Tentative de parsing des questions générées
    const parsedQuestions = rawQuestions
      .split('\n')
      .filter(q => q.trim().length > 10)  // Filtrer les questions trop courtes
      .map(q => q.replace(/^\d+\.\s*/, '').trim());  // Supprimer les numéros de liste

    // Si parsing réussi, retourner les questions
    if (parsedQuestions.length > 0) {
      return parsedQuestions;
    }
  } catch (error) {
    console.error('Erreur de parsing des questions:', error);
  }

  // Retourner les questions par défaut si parsing échoue
  return defaultQuestions[gameType as keyof typeof defaultQuestions] || [];
}
