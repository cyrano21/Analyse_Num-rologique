import { HfInference } from '@huggingface/inference';

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

console.warn(`🚨 Hugging Face API Token Status:
  - HUGGINGFACE_API_TOKEN: ${HF_TOKEN ? 'Set ✅' : 'Not Set ❌'}
  - Token preview: ${HF_TOKEN ? HF_TOKEN.substring(0, 6) + '...' : 'N/A'}
`);

const inference = new HfInference(HF_TOKEN);

// Analyse des traits de personnalité
export const analyzePersonalityTraits = async (name) => {
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
export const generateLifeInsights = async (params) => {
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
export const generateIntroDescription = async (name) => {
  const descriptions = [
    `${name}, votre parcours est unique et porteur de sens.`,
    `Bienvenue ${name} dans votre exploration personnelle.`,
    `${name}, découvrez les influences qui guident votre chemin.`,
    `Une analyse approfondie vous attend, ${name}.`,
    `${name}, préparez-vous à une découverte enrichissante.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Génération de questions contextuelles
export const generateContextualQuestions = async (gameType, previousAnswers, name) => {
  // Implémentation similaire à la version TypeScript
  return [];
};

// Personnalisation du message de bienvenue
export const personalizeWelcome = async (name, gameType, gender = 'male') => {
  // Implémentation similaire à la version TypeScript
  return `Bienvenue, ${name}!`;
};

// Génération de texte personnalisé
export const generatePersonalizedText = async (prompt, aiParams = {}) => {
  const {
    temperature = 0.7,
    maxTokens = 150
  } = aiParams;

  // Predefined responses for different themes
  const responses = {
    "personal growth": [
      "La croissance personnelle est un voyage intérieur de transformation continue. Chaque pas vous rapproche d'une version plus accomplie de vous-même.",
      "Grandir, c'est accepter ses imperfections tout en cultivant ses potentialités. Votre développement personnel est un art, pas une destination.",
      "L'évolution personnelle naît de la conscience et de l'intention. Chaque jour est une opportunité de devenir la meilleure version de vous-même."
    ],
    "overcoming challenges": [
      "La résilience n'est pas l'absence de difficultés, mais la capacité de les traverser avec courage et détermination.",
      "Vos défis sont des professeurs déguisés. Chaque obstacle surmonté vous rend plus fort et plus sage.",
      "La force ne se mesure pas à l'absence de chutes, mais à la volonté de se relever à chaque fois."
    ],
    "self-discovery": [
      "Se découvrir, c'est entreprendre le voyage le plus important : celui de la compréhension de soi-même.",
      "L'auto-découverte est un processus continu d'apprentissage, de remise en question et de transformation.",
      "Votre identité est un puzzle dynamique. Chaque expérience ajoute une nouvelle pièce à votre compréhension."
    ]
  };

  try {
    // Determine the theme of the prompt
    const theme = 
      prompt.toLowerCase().includes("personal growth") ? "personal growth" :
      prompt.toLowerCase().includes("overcoming challenges") ? "overcoming challenges" :
      prompt.toLowerCase().includes("self-discovery") ? "self-discovery" :
      "personal growth";  // Default theme

    // Select a random response from the appropriate theme
    const selectedResponse = responses[theme][Math.floor(Math.random() * responses[theme].length)];

    console.log(`🌟 Generated Response Theme: ${theme}`);
    return selectedResponse;

  } catch (error) {
    console.error("❌ Error during text generation:", error);
    return "La vie est un voyage de découverte et de croissance personnelle.";
  }
};
