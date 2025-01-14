import { generatePersonalizedText } from './huggingface';

interface PredictionParams {
  lifePath: number;
  zodiacSign: { name: string; symbol: string };
  lifeAspect: string;
  enneagramType: string;
}

interface Prediction {
  probability: number;
  text: string;
  aiGeneratedInsight?: string;
}

interface PredictionResult {
  predictions: {
    love: Prediction;
    career: Prediction;
    health: Prediction;
    personal: Prediction;
    spiritual: Prediction;
  };
  enneagramInterpretation: string;
  compatibilities: string;
  name?: string;
  lifePath?: number;
  expressionNumber?: number;
  zodiacSign?: { name: string; symbol: string };
}

export async function generatePredictions(params: PredictionParams): Promise<PredictionResult> {
  const { lifePath, zodiacSign, lifeAspect, enneagramType } = params;

  const aspectPredictions = await Promise.all([
    generateAspectPrediction('love', lifePath, zodiacSign),
    generateAspectPrediction('career', lifePath, zodiacSign),
    generateAspectPrediction('health', lifePath, zodiacSign),
    generateAspectPrediction('personal', lifePath, zodiacSign),
    generateAspectPrediction('spiritual', lifePath, zodiacSign)
  ]);

  return {
    predictions: {
      love: aspectPredictions[0],
      career: aspectPredictions[1],
      health: aspectPredictions[2],
      personal: aspectPredictions[3],
      spiritual: aspectPredictions[4]
    },
    enneagramInterpretation: getEnneagramInterpretation(enneagramType),
    compatibilities: generateCompatibilities(lifePath, zodiacSign)
  };
}

async function generateAspectPrediction(
  aspect: string, 
  lifePath: number, 
  zodiacSign: { name: string; symbol: string }
): Promise<Prediction> {
  const probability = calculateProbability(lifePath, aspect);
  const baseText = generateBaseText(aspect, probability);
  
  try {
    const aiInsight = await generatePersonalizedText(
      `Générer une prédiction nuancée pour ${aspect} basée sur un chemin de vie ${lifePath} et un signe ${zodiacSign.name}`
    );

    return {
      probability,
      text: baseText,
      aiGeneratedInsight: aiInsight
    };
  } catch (error) {
    console.error(`Erreur lors de la génération de l'insight pour ${aspect}:`, error);
    return { probability, text: baseText };
  }
}

function calculateProbability(lifePath: number, aspect: string): number {
  // Probabilité basée sur le chemin de vie et l'aspect
  const baseProb = 50; // Point de départ
  const lifeProbModifiers: { [key: number]: { [key: string]: number } } = {
    1: { love: 10, career: 15, health: 5, personal: 10, spiritual: 5 },
    2: { love: 15, career: 5, health: 10, personal: 5, spiritual: 10 },
    // Ajouter des modificateurs pour d'autres chemins de vie
  };

  const modifier = lifeProbModifiers[lifePath]?.[aspect] || 0;
  return Math.min(Math.max(baseProb + modifier, 0), 100);
}

function generateBaseText(aspect: string, probability: number): string {
  const aspectTexts: { [key: string]: string[] } = {
    love: [
      "Une période de connexion émotionnelle profonde s'annonce.",
      "Les relations seront au cœur de vos préoccupations.",
      "L'amour et l'empathie guideront vos interactions."
    ],
    career: [
      "De nouvelles opportunités professionnelles émergent.",
      "Votre créativité sera votre principal atout.",
      "Un projet ambitieux prend forme."
    ],
    health: [
      "L'équilibre entre corps et esprit sera crucial.",
      "Une période de renouveau et de régénération s'annonce.",
      "Prenez soin de votre bien-être holistique."
    ],
    personal: [
      "Une phase de croissance personnelle se profile.",
      "Vos défis seront des opportunités de transformation.",
      "L'introspection vous apportera des insights précieux."
    ],
    spiritual: [
      "Une connexion spirituelle plus profonde se développe.",
      "L'intuition sera votre guide principal.",
      "Méditez sur vos valeurs fondamentales."
    ]
  };

  const texts = aspectTexts[aspect] || [];
  const selectedText = texts[Math.floor(Math.random() * texts.length)];
  
  return `${selectedText} (Probabilité: ${probability}%)`;
}

function getEnneagramInterpretation(type: string): string {
  const enneagramDescriptions: { [key: string]: string } = {
    '1': "Le Perfectionniste : Rationnel, idéaliste, avec un fort sens de ce qui est juste.",
    '2': "L'Altruiste : Attentionné, généreux, cherchant à aider les autres.",
    '3': "Le Battant : Adaptable, ambitieux, orienté vers le succès.",
    '4': "L'Individualiste : Créatif, sensible, à la recherche de son identité unique.",
    '5': "L'Observateur : Perspicace, innovant, isolé et analytique.",
    '6': "Le Loyal : Engagé, orienté vers la sécurité, responsable.",
    '7': "L'Enthousiaste : Spontané, versatile, optimiste.",
    '8': "Le Chef : Puissant, dominant, sûr de soi.",
    '9': "Le Médiateur : Réceptif, rassurant, complaisant."
  };

  return enneagramDescriptions[type] || "Type d'Ennéagramme non reconnu";
}

function generateCompatibilities(lifePath: number, zodiacSign: { name: string; symbol: string }): string {
  return `Compatibilités basées sur votre chemin de vie ${lifePath} et votre signe ${zodiacSign.name}. 
  Des opportunités de connexion profonde et de croissance personnelle se profilent.`;
}

export type { Prediction, PredictionResult };
