import { generatePersonalizedText } from "./huggingface";
import { Icons } from "../app/components/Icons";
import MindfulnessGame from "../app/components/games/MindfulnessGame";
import EmotionalIntelligenceGame from "../app/components/games/EmotionalIntelligenceGame";
import PersonalGrowthGame from "../app/components/games/PersonalGrowthGame";
import SpiritualAwakeningGame from "../app/components/games/SpiritualAwakeningGame";

export const spiritualPaths = [
  {
    id: "mindfulness",
    title: "Pleine Conscience",
    type: "1",
    icon: Icons.Mindfulness,
    color: "from-green-500 to-emerald-600",
    description: "Développez votre présence et votre conscience de l'instant.",
    details: [
      "Méditation guidée",
      "Exercices de respiration",
      "Techniques de relaxation",
    ],
    game: MindfulnessGame,
  },
  {
    id: "emotional-intelligence",
    title: "Intelligence Émotionnelle",
    type: "2",
    icon: Icons.EmotionalIntelligence,
    color: "from-blue-500 to-indigo-600",
    description: "Explorez et développez votre intelligence émotionnelle.",
    details: [
      "Exercices d'empathie",
      "Gestion des émotions",
      "Communication bienveillante",
    ],
    game: EmotionalIntelligenceGame,
  },
  {
    id: "personal-growth",
    title: "Développement Personnel",
    type: "3",
    icon: Icons.PersonalGrowth,
    color: "from-yellow-500 to-orange-600",
    description: "Progressez et transformez-vous continuellement.",
    details: [
      "Défis personnels",
      "Réflexion introspective",
      "Objectifs de croissance",
    ],
    game: PersonalGrowthGame,
  },
  {
    id: "spiritual-awakening",
    title: "Éveil Spirituel",
    type: "9",
    icon: Icons.SpiritualAwakening,
    color: "from-purple-500 to-pink-600",
    description: "Connectez-vous à votre essence profonde.",
    details: [
      "Méditation contemplative",
      "Exploration intérieure",
      "Connexion spirituelle",
    ],
    game: SpiritualAwakeningGame,
  },
];

export const generateSpiritualPath = async (
  name: string, 
  enneagramType: string, 
  lifePath: number, 
  userAnswers: string[]
): Promise<string> => {
  const spiritualPathPrompt = [
    `Générer un parcours spirituel personnalisé pour ${name}`,
    `Type Ennéagramme : ${enneagramType}`,
    `Chemin de vie : ${lifePath}`,
    `Réponses spirituelles : ${userAnswers.join("; ")}`,
    `Le parcours doit être inspirant, personnalisé et aligné avec son essence.`
  ];

  try {
    const spiritualPath = await generatePersonalizedText(
      spiritualPathPrompt.join(" "),
      { model: "gpt2" }
    );

    return spiritualPath;
  } catch (error) {
    console.error("Erreur lors de la génération du parcours spirituel", error);
    return "Parcours spirituel personnalisé non disponible.";
  }
};
