import { HfInference } from '@huggingface/inference';

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
const inference = new HfInference(HF_TOKEN);

// Analyse des traits de personnalité
export const analyzePersonalityTraits = async (name: string) => {
  const traits = [
    "Vous avez une personnalité dynamique et créative.",
    "Votre nature sensible vous permet de comprendre les autres.",
    "Vous possédez une grande force intérieure.",
    "Votre intuition est particulièrement développée.",
    "Vous savez vous adapter aux situations avec flexibilité."
  ];
  
  return [{
    trait: traits[Math.floor(Math.random() * traits.length)],
    confidence: 0.8
  }];
};

// Génération d'insights sur la vie
export const generateLifeInsights = async (params: {
  name: string;
  birthdate: string;
  lifeAspect: string;
}) => {
  const insights = [
    "Votre parcours unique vous mène vers des découvertes enrichissantes.",
    "Cette période est propice à la réalisation de vos objectifs personnels.",
    "Vos expériences passées nourrissent votre développement actuel.",
    "Les influences actuelles soutiennent votre évolution personnelle.",
    "Un nouveau cycle s'ouvre, porteur d'opportunités significatives."
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
};

// Génération de description d'introduction
export const generateIntroDescription = async (name: string) => {
  const descriptions = [
    `${name}, votre parcours est unique et porteur de sens.`,
    `Bienvenue ${name} dans votre exploration personnelle.`,
    `${name}, découvrez les influences qui guident votre chemin.`,
    `Une analyse approfondie vous attend, ${name}.`,
    `${name}, préparez-vous à une découverte enrichissante.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Analyse des réponses personnelles
export const analyzePersonalResponses = async (responses: string[]) => {
  const emotions = [
    "Votre approche est positive et constructive.",
    "Vos réponses montrent une belle maturité émotionnelle.",
    "Une sensibilité équilibrée se dégage de vos réponses.",
    "Votre perspective est nuancée et réfléchie.",
    "Une belle authenticité transparaît dans vos réponses."
  ];
  
  return {
    label: emotions[Math.floor(Math.random() * emotions.length)],
    score: 0.8
  };
};

// Génération de questions contextuelles
export const generateContextualQuestions = async (
  gameType: string,
  previousAnswers: string[],
  name: string
) => {
  const questions = {
    'numerologie': [
      "Comment percevez-vous votre évolution personnelle ?",
      "Quelles sont vos aspirations les plus profondes ?",
      "Quel aspect de votre vie souhaitez-vous développer ?",
      "Que représente le succès pour vous ?",
      "Comment définiriez-vous votre équilibre idéal ?"
    ],
    'cartomancie': [
      "Quelle est votre intuition sur votre avenir proche ?",
      "Comment ressentez-vous les changements actuels ?",
      "Quel domaine de votre vie mérite plus d'attention ?",
      "Quelles sont vos attentes pour les mois à venir ?",
      "Comment abordez-vous les défis qui se présentent ?"
    ]
  };
  
  const questionSet = questions[gameType as keyof typeof questions] || questions['numerologie'];
  return questionSet[Math.floor(Math.random() * questionSet.length)];
};

// Personnalisation du message de bienvenue
export const personalizeWelcome = (name: string, gameType: string, gender: string = 'male') => {
  const readyText = gender === 'female' ? 'Prête' : 'Prêt';
  return `Bienvenue ${name} dans votre parcours de ${gameType}! ${readyText} pour une expérience personnalisée ?`;
};

// Génération de texte personnalisé
export const generatePersonalizedText = async (
  prompt: string,
  aiParams?: { temperature?: number; maxTokens?: number; model?: string }
) => {
  try {
    const temperature = aiParams?.temperature || 0.7;
    const maxTokens = aiParams?.maxTokens || 150;
    const model = aiParams?.model || 'distilgpt2';

    const response = await inference.textGeneration({
      model,
      inputs: prompt,
      parameters: {
        temperature,
        max_new_tokens: maxTokens,
      },
    });

    // Nettoyer la réponse en supprimant le prompt original
    const cleanedResponse = response.generated_text.replace(new RegExp(`^${prompt}\\s*`), '').trim();

    return cleanedResponse;
  } catch (error) {
    console.error("Erreur lors de la génération de texte personnalisé", error);
    return "Génération de texte personnalisé impossible.";
  }
};
