import { HfInference } from '@huggingface/inference';

const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

// Créer l'instance Hugging Face uniquement si la clé est présente
const hf = apiKey ? new HfInference(apiKey) : null;

interface PersonalityAnalysis {
  emotion: string
  confidence: number
  interpretation: string
}

interface GenerationOptions {
  temperature?: number;
  maxLength?: number;
}

export async function generatePersonalizedText(prompt: string, model: string = 'gpt2') {
  try {
    if (!hf) {
      console.warn('Hugging Face API not configured. Using fallback text generation.');
      return `Texte généré basé sur : ${prompt}. 
      Veuillez configurer l'API Hugging Face pour des résultats plus précis.`;
    }

    const response = await hf.textGeneration({
      model: model,
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.2
      }
    });

    return response.generated_text || 'Aucune interprétation générée.';
  } catch (error) {
    console.error('Erreur lors de la génération de texte:', error);
    return `Erreur de génération de texte. Prompt original : ${prompt}`;
  }
}

export async function analyzePersonalityTraits(input: string): Promise<PersonalityAnalysis[]> {
  try {
    if (!hf) {
      console.warn('Hugging Face API not configured. Using fallback personality analysis.');
      return [{
        emotion: 'Neutre',
        confidence: 0.5,
        interpretation: `Analyse de personnalité basique pour ${input}. 
        Veuillez configurer l'API Hugging Face pour des résultats plus précis.`
      }];
    }

    // Emotion detection
    const emotionModel = 'cardiffnlp/twitter-roberta-base-emotion'
    const emotionResults = await hf.textClassification({
      model: emotionModel,
      inputs: input
    });

    // Personality trait analysis
    const personalityResults = await hf.textClassification({
      model: 'j-hartmann/emotion-english-distilroberta-base',
      inputs: input
    });

    return personalityResults.map((result, index) => ({
      emotion: result.label,
      confidence: result.score,
      interpretation: generateEmotionInterpretation(result.label, emotionResults[index].score)
    }));
  } catch (error) {
    console.error('Erreur lors de l\'analyse des traits de personnalité:', error);
    return [{
      emotion: 'Erreur',
      confidence: 0,
      interpretation: `Impossible d'analyser la personnalité de ${input}`
    }];
  }
}

function generateEmotionInterpretation(emotion: string, confidence: number): string {
  const interpretations: { [key: string]: string } = {
    'joy': 'Votre énergie positive et votre optimisme sont des atouts majeurs.',
    'sadness': 'Prenez soin de votre bien-être émotionnel et n\'hésitez pas à demander du soutien.',
    'anger': 'Canalisez votre passion et transformez cette énergie en motivation constructive.',
    'fear': 'Vos inquiétudes peuvent être des opportunités de croissance personnelle.',
    'surprise': 'Restez ouvert aux nouvelles expériences et opportunités inattendues.',
    'neutral': 'Vous avez une approche équilibrée et réfléchie de la vie.'
  };

  const baseInterpretation = interpretations[emotion.toLowerCase()] || 'Votre profil émotionnel est unique et complexe.';
  
  return `${baseInterpretation} (Confiance: ${(confidence * 100).toFixed(2)}%)`
}

export async function generateLifeInsights(personalData: {
  name: string, 
  birthdate: string, 
  lifeAspect: string
}): Promise<string> {
  try {
    if (!hf) {
      console.warn('Hugging Face API not configured. Using fallback life insights.');
      return `Perspectives de vie génériques pour ${personalData.name}. 
      Veuillez configurer l'API Hugging Face pour des résultats plus personnalisés.`;
    }

    const prompt = `Générer une analyse personnalisée et profonde pour ${personalData.name}, 
    né(e) le ${personalData.birthdate}, en se concentrant sur ${personalData.lifeAspect}. 
    Fournir des perspectives uniques et des conseils inspirants.`;

    const insight = await generatePersonalizedText(prompt, 'EleutherAI/gpt-neo-1.3B');
    return insight;
  } catch (error) {
    console.error('Erreur lors de la génération des perspectives de vie:', error);
    return `Impossible de générer des perspectives de vie pour ${personalData.name}`;
  }
}

async function generateIntroDescription(
  topic: 'numerologie' | 'tarot', 
  options: GenerationOptions = {}
): Promise<string> {
  const defaultOptions = {
    temperature: 0.7,
    maxLength: 500
  };
  
  const mergedOptions = { ...defaultOptions, ...options };

  const prompts = {
    numerologie: `L'Analyse Numérologique est une pratique fascinante qui explore la signification des nombres dans votre vie. 
    Chaque nombre, basé sur votre date de naissance et votre nom, raconte une histoire unique de votre personnalité, 
    de vos talents et de votre chemin de vie. Ce n'est pas de la magie, mais une méthode de découverte de soi 
    qui vous aide à mieux comprendre vos forces, vos défis et votre potentiel. 
  
    Imaginez les nombres comme des clés qui déverrouillent les mystères de votre être intérieur. 
    Chaque chiffre a une vibration, une énergie qui peut vous éclairer sur vos tendances naturelles, 
    vos capacités cachées et les opportunités qui vous attendent. 
  
    L'Analyse Numérologique n'est ni un jugement, ni une prédiction figée, mais un outil de 
    développement personnel qui vous invite à la réflexion et à la croissance. 
    C'est un voyage vers une meilleure compréhension de vous-même.`,
    
    tarot: `Le Tirage de Cartes de Tarot est bien plus qu'une simple divination. 
    C'est un miroir symbolique qui vous aide à explorer vos pensées, vos émotions et vos intuitions. 
    Chaque carte est comme une fenêtre ouverte sur votre monde intérieur, révélant des perspectives 
    que votre conscience immédiate n'aperçoit pas toujours.

    Contrairement aux idées reçues, le Tarot n'est pas une boule de cristal qui prédit l'avenir de manière absolue. 
    C'est un outil de réflexion personnelle, un guide bienveillant qui vous accompagne dans votre 
    compréhension de situations complexes. Les cartes ne décident pas de votre destin, 
    elles vous offrent des clés pour mieux le comprendre et l'orienter.

    Chaque tirage est unique, comme une conversation intuitive avec vous-même. 
    Il vous invite à la méditation, à l'introspection, et à développer votre sagesse intérieure. 
    Le Tarot est un art de l'écoute de soi, sans jugement, avec ouverture et compassion.`
  };

  if (!hf) {
    return `Introduction à ${topic} non disponible. Veuillez réessayer plus tard.`;
  }

  try {
    const result = await hf.textGeneration({
      model: 'gpt2',
      inputs: prompts[topic],
      parameters: {
        max_new_tokens: mergedOptions.maxLength,
        temperature: mergedOptions.temperature
      }
    });

    return result.generated_text || 'Génération de texte indisponible.';
  } catch (error) {
    console.error(`Erreur lors de la génération pour ${topic}:`, error);
    return `Introduction à ${topic} temporairement indisponible.`;
  }
}

export { generateIntroDescription };
