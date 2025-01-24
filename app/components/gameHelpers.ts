import { defaultQuestions } from './questions';
import { 
  generatePersonalizedText, 
  generateContextualQuestions, 
  personalizeWelcome 
} from '../../utils/huggingface';
import { spiritualPathQuestionPrompts } from './questions';
import { parseQuestions } from './gameUtils';

export const generateMeditationGuide = async (userAnswers: string[]): Promise<string> => {
  try {
    const meditationPrompt = `
      Basé sur ces réponses spirituelles : ${userAnswers.join('; ')}
      Générer un guide de méditation personnalisé qui :
      - Reflète les insights spirituels de l'utilisateur
      - Propose une pratique de méditation adaptée
      - Soit concis et pratique
    `;

    const meditationGuide = await generatePersonalizedText(
      meditationPrompt, 
      { model: 'gpt2' }
    );

    return meditationGuide;
  } catch (error) {
    console.error('Erreur de génération du guide de méditation:', error);
    return `Guide de méditation standard pour votre éveil spirituel.
    1. Trouvez un endroit calme
    2. Asseyez-vous confortablement
    3. Concentrez-vous sur votre respiration
    4. Laissez vos pensées défiler sans jugement`;
  }
};

export const sharePersonalAnalysis = (personalAnalysis: any, gameType: string) => {
  if (navigator.share) {
    try {
      navigator.share({
        title: `Mon analyse personnelle - ${gameType}`,
        text: `Voici mon analyse personnelle pour le jeu ${gameType}:\n\nRésumé: ${personalAnalysis.summary}\n\nPoints forts: ${personalAnalysis.personalStrengths.join(', ')}\n\nAxes de croissance: ${personalAnalysis.growthAreas.join(', ')}\n\nRecommandations: ${personalAnalysis.recommendations.join(', ')}`
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      alert('Impossible de partager l\'analyse pour le moment.');
    }
  } else {
    const analysisText = `Mon analyse personnelle - ${gameType}\n\nRésumé: ${personalAnalysis.summary}\n\nPoints forts: ${personalAnalysis.personalStrengths.join(', ')}\n\nAxes de croissance: ${personalAnalysis.growthAreas.join(', ')}\n\nRecommandations: ${personalAnalysis.recommendations.join(', ')}`;
    
    navigator.clipboard.writeText(analysisText).then(() => {
      alert('Analyse copiée dans le presse-papiers !');
    }).catch(err => {
      console.error('Erreur de copie:', err);
      alert('Impossible de copier l\'analyse.');
    });
  }
};

export const resetGame = (
  gameType: string, 
  updateGameState: (gameType: string, updates: any) => void, 
  setActiveGame: (gameType: string | null) => void
) => {
  updateGameState(gameType, {
    questions: defaultQuestions[gameType],
    userAnswers: [],
    currentAnswer: '',
    isCompleted: false,
    personalAnalysis: undefined
  });

  setActiveGame(null);
};

export const startNewGame = (
  gameType: string, 
  formData: any, 
  gameResponses: any, 
  updateGameState: (gameType: string, updates: any) => void,
  setActiveGame: (gameType: string) => void,
  setCurrentGameAnswer: (gameType: string, answer: string) => void,
  setPersonalizedWelcome: (welcome: string) => void
) => {
  setActiveGame(gameType);
  
  const previousResponses = gameResponses[gameType];
  
  if (previousResponses.userAnswers.length > 0) {
    generateContextualQuestions(
      gameType, 
      previousResponses.userAnswers, 
      formData.firstName + ' ' + formData.lastName
    ).then(content => {
      const parsedQuestions = parseQuestions(content, gameType);
      updateGameState(gameType, { 
        questions: parsedQuestions 
      });
      setCurrentGameAnswer(gameType, '');
    });
  } else {
    generatePersonalizedText(
      spiritualPathQuestionPrompts[gameType].basePrompt(formData),
      spiritualPathQuestionPrompts[gameType].aiParams
    ).then(content => {
      const parsedQuestions = parseQuestions(content, gameType);
      updateGameState(gameType, { 
        questions: parsedQuestions 
      });
      setCurrentGameAnswer(gameType, '');
    });
  }
  
  const welcome = personalizeWelcome(
    formData.firstName, 
    gameType,
    formData.gender
  );
  setPersonalizedWelcome(welcome);
};
