export const defaultQuestions = {
  mindfulness: [
    "Qu'est-ce qui vous a amené à explorer la pleine conscience ?",
    "Comment vous sentez-vous après une séance de méditation ?",
    "Quels sont les défis que vous rencontrez dans votre pratique de la pleine conscience ?",
    "Comment la pleine conscience a-t-elle transformé votre perception du quotidien ?",
    "Quels moments de votre journée vous semblent les plus propices à la pratique de la pleine conscience ?"
  ],
  emotionalIntelligence: [
    "Comment gérez-vous vos émotions dans des situations stressantes ?",
    "Quelles sont les émotions que vous trouvez les plus difficiles à exprimer ?",
    "Comment réagissez-vous lorsque quelqu'un vous critique ?",
  ],
  personalGrowth: [
    "Quels sont vos objectifs personnels pour cette année ?",
    "Comment mesurez-vous votre progression personnelle ?",
    "Quels sont les livres ou ressources qui vous ont le plus aidé dans votre développement personnel ?",
  ],
  spiritualAwakening: [
    "Qu'est-ce qui vous a conduit à explorer l'éveil spirituel ?",
    "Comment décririez-vous votre connexion spirituelle ?",
    "Quels sont les rituels ou pratiques spirituelles que vous suivez régulièrement ?",
  ],
};

export const spiritualPathQuestionPrompts = {
  mindfulness: {
    basePrompt: (formData: any) => `Générer des questions de pleine conscience pour ${formData.firstName} ${formData.lastName}.`,
    aiParams: { temperature: 0.7, maxTokens: 150 },
  },
  emotionalIntelligence: {
    basePrompt: (formData: any) => `Générer des questions d'intelligence émotionnelle pour ${formData.firstName} ${formData.lastName}.`,
    aiParams: { temperature: 0.7, maxTokens: 150 },
  },
  personalGrowth: {
    basePrompt: (formData: any) => `Générer des questions de développement personnel pour ${formData.firstName} ${formData.lastName}.`,
    aiParams: { temperature: 0.7, maxTokens: 150 },
  },
  spiritualAwakening: {
    basePrompt: (formData: any) => `Générer des questions d'éveil spirituel pour ${formData.firstName} ${formData.lastName}.`,
    aiParams: { temperature: 0.7, maxTokens: 150 },
  },
};

export const parseQuestions = (content: string | string[], gameType: string) => {
  console.log('🔍 Début du parsing des questions');
  console.log('Type de jeu:', gameType);
  console.log('Contenu initial:', content);

  const contentString = Array.isArray(content) 
    ? content.join('\n') 
    : content;

  console.log('📋 Contenu transformé:', contentString);
  
  const lines = contentString.split(/\n|\r\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  console.log('🧐 Lignes après nettoyage:', lines);

  const isValidQuestion = (line: string) => {
    const checks = [
      line.length > 10,
      (line.endsWith('?') || line.includes('?')),
      !line.toLowerCase().includes('génère'),
      !line.toLowerCase().includes('format de réponse'),
      !line.toLowerCase().includes('les questions doivent')
    ];

    const isValid = checks.every(check => check);
    
    if (!isValid) {
      console.log('❌ Question invalide:', line);
      console.log('Raisons:', checks);
    }

    return isValid;
  };
  
  const questions = lines
    .filter(isValidQuestion)
    .map(q => q.replace(/^\d+\.\s*/, '')); // Supprimer les numéros de ligne
  
  console.log('✅ Questions parsées:', questions);
  
  // Si aucune question valide n'est trouvée, retourner les questions par défaut
  const finalQuestions = questions.length > 0 
    ? questions.slice(0, 5) 
    : defaultQuestions[gameType].slice(0, 5);

  console.log('🏁 Questions finales:', finalQuestions);
  
  return finalQuestions;
};
