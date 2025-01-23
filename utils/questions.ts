// Types de jeux et leurs questions par défaut
export const spiritualPathQuestionPrompts = {
  mindfulness: {
    basePrompt: (formData: any) => `Générez des questions de pleine conscience personnalisées pour ${formData.firstName}, en se concentrant sur sa croissance personnelle et sa conscience de soi.`,
    aiModel: 'gpt2',
    temperature: 0.7,
    maxLength: 150
  },
  emotionalIntelligence: {
    basePrompt: (formData: any) => `Créez des questions d'intelligence émotionnelle adaptées à ${formData.firstName}, qui l'aideront à comprendre et à gérer ses émotions.`,
    aiModel: 'gpt2',
    temperature: 0.7,
    maxLength: 150
  },
  personalGrowth: {
    basePrompt: (formData: any) => `Proposez des questions de développement personnel pour ${formData.firstName} qui stimuleront sa réflexion et sa croissance.`,
    aiModel: 'gpt2',
    temperature: 0.7,
    maxLength: 150
  },
  spiritualAwakening: {
    basePrompt: (formData: any) => `Générez des questions d'éveil spirituel personnalisées pour ${formData.firstName}, qui l'aideront à explorer sa connexion intérieure.`,
    aiModel: 'gpt2',
    temperature: 0.7,
    maxLength: 150
  }
};

// Questions par défaut si la génération IA échoue
export const defaultQuestions = {
  mindfulness: [
    "Décrivez un moment récent où vous avez été totalement présent.",
    "Quels sont vos principaux obstacles à la pleine conscience ?",
    "Comment la méditation pourrait-elle vous aider dans votre vie quotidienne ?"
  ],
  emotionalIntelligence: [
    "Comment réagissez-vous habituellement face au stress ?",
    "Pouvez-vous identifier et nommer vos émotions actuelles ?",
    "Quand avez-vous dernièrement fait preuve d'empathie envers quelqu'un ?"
  ],
  personalGrowth: [
    "Quels sont vos objectifs personnels pour les 6 prochains mois ?",
    "Quelles sont vos principales forces et faiblesses ?",
    "Comment définiriez-vous votre parcours de développement personnel ?"
  ],
  spiritualAwakening: [
    "Qu'est-ce qui vous connecte le plus à votre dimension spirituelle ?",
    "Avez-vous déjà vécu un moment de profonde connexion intérieure ?",
    "Comment comprenez-vous votre chemin spirituel actuellement ?"
  ]
};
