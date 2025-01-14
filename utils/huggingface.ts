import { HfInference } from '@huggingface/inference';


const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

// Créer l'instance Hugging Face uniquement si la clé est présente
const hf = apiKey ? new HfInference(apiKey) : null;

interface PersonalityAnalysis {
  emotion: string
  confidence: number
  interpretation: string
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
