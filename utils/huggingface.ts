import { HfInference } from '@huggingface/inference';

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
const inference = new HfInference(HF_TOKEN);

// Analyse des traits de personnalité
export const analyzePersonalityTraits = async (name: string) => {
  try {
    const response = await inference.textGeneration({
      model: 'gpt2',
      inputs: `Analysez les traits de personnalité associés au prénom ${name}:`,
      parameters: {
        max_length: 100,
        temperature: 0.7
      }
    });
    
    return [{
      trait: response.generated_text,
      confidence: 0.8
    }];
  } catch (error) {
    console.error('Erreur lors de l\'analyse des traits:', error);
    return [];
  }
};

// Génération d'insights sur la vie
export const generateLifeInsights = async (params: {
  name: string;
  birthdate: string;
  lifeAspect: string;
}) => {
  try {
    const response = await inference.textGeneration({
      model: 'gpt2',
      inputs: `Générez des insights pour ${params.name}, né(e) le ${params.birthdate}, concernant ${params.lifeAspect}:`,
      parameters: {
        max_length: 150,
        temperature: 0.8
      }
    });
    
    return response.generated_text;
  } catch (error) {
    console.error('Erreur lors de la génération des insights:', error);
    return 'Impossible de générer des insights pour le moment.';
  }
};

// Génération de description d'introduction
export const generateIntroDescription = async (name: string) => {
  try {
    const response = await inference.textGeneration({
      model: 'gpt2',
      inputs: `Créez une introduction personnalisée pour ${name}:`,
      parameters: {
        max_length: 100,
        temperature: 0.6
      }
    });
    
    return response.generated_text;
  } catch (error) {
    console.error('Erreur lors de la génération de l\'introduction:', error);
    return 'Introduction personnalisée indisponible.';
  }
};

// Analyse des réponses personnelles
export const analyzePersonalResponses = async (responses: string[]) => {
  try {
    const combinedResponses = responses.join(' ');
    const response = await inference.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: combinedResponses
    });
    
    return response;
  } catch (error) {
    console.error('Erreur lors de l\'analyse des réponses:', error);
    return 'Analyse impossible pour le moment.';
  }
};

// Génération de questions contextuelles
export const generateContextualQuestions = async (
  gameType: string,
  previousAnswers: string[],
  name: string
) => {
  try {
    const context = `Type de jeu: ${gameType}\nRéponses précédentes: ${previousAnswers.join(', ')}\nNom: ${name}`;
    const response = await inference.textGeneration({
      model: 'gpt2',
      inputs: `Générez une question contextuelle basée sur: ${context}`,
      parameters: {
        max_length: 50,
        temperature: 0.7
      }
    });
    
    return response.generated_text;
  } catch (error) {
    console.error('Erreur lors de la génération des questions:', error);
    return 'Questions contextuelles indisponibles.';
  }
};

// Personnalisation du message de bienvenue
export const personalizeWelcome = (name: string, gameType: string, gender: string = 'male') => {
  const readyText = gender === 'female' ? 'Prête' : 'Prêt';
  return `Bienvenue ${name} dans votre parcours de ${gameType}! ${readyText} pour une expérience personnalisée ?`;
};

// Génération de texte personnalisé
export const generatePersonalizedText = async (
  prompt: string,
  model: string = 'gpt2'
) => {
  try {
    const response = await inference.textGeneration({
      model: model,
      inputs: prompt,
      parameters: {
        max_length: 100,
        temperature: 0.7
      }
    });
    
    return response.generated_text;
  } catch (error) {
    console.error('Erreur lors de la génération du texte:', error);
    return 'Génération de texte impossible pour le moment.';
  }
};
