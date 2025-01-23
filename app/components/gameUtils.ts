import { defaultQuestions, spiritualPathQuestionPrompts } from './questions';

export const parseQuestions = (content: string | string[], gameType: string) => {
  const contentString = Array.isArray(content) 
    ? content.join('\n') 
    : content;

  console.log('Parsing content:', contentString);
  
  const lines = contentString.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const isValidQuestion = (line: string) => {
    return (
      line.length > 20 &&
      line.endsWith('?') &&
      !line.includes(':') &&
      !line.toLowerCase().includes('génère') &&
      !line.toLowerCase().includes('format de réponse') &&
      !line.toLowerCase().includes('les questions doivent')
    );
  };
  
  const questions = lines
    .filter(isValidQuestion)
    .slice(0, 5);
  
  console.log('Parsed Questions:', questions);
  
  return questions.length > 0 ? questions : defaultQuestions[gameType];
};

export const generatePersonalizedQuestions = (gameType: keyof typeof spiritualPathQuestionPrompts, formData: any) => {
  const prompt = spiritualPathQuestionPrompts[gameType].basePrompt(formData);
  // Ici, vous pourriez intégrer un appel à une API d'IA pour générer les questions
  console.log('Generated Prompt:', prompt);
  return prompt;
};

export const evaluateGameProgress = (userAnswers: string[], totalQuestions: number) => {
  const completionPercentage = (userAnswers.length / totalQuestions) * 100;
  
  if (completionPercentage < 25) return 'Début';
  if (completionPercentage < 50) return 'En cours';
  if (completionPercentage < 75) return 'Presque terminé';
  return 'Terminé';
};

export const calculateGameScore = (userAnswers: string[]) => {
  // Un exemple simple de calcul de score
  return userAnswers.reduce((score, answer) => {
    // Vous pouvez implémenter une logique plus complexe ici
    return score + (answer.length > 10 ? 10 : 5);
  }, 0);
};
