import { generatePersonalizedText } from './utils/huggingface.js';
import { parseQuestions } from './app/components/questions.ts';
import { spiritualPathQuestionPrompts } from './app/components/questions.ts';

async function testMindfulnessGameFlow() {
  console.log('🧪 Test du flux du jeu de Pleine Conscience');

  // Données simulées de formulaire
  const formData = {
    firstName: 'Jean',
    lastName: 'Dupont',
    gameType: 'mindfulness'
  };

  try {
    // Générer des questions personnalisées
    const personalizedQuestionsPrompt = spiritualPathQuestionPrompts.mindfulness.basePrompt(formData);
    console.log('🤖 Prompt de génération de questions:', personalizedQuestionsPrompt);

    const generatedQuestions = await generatePersonalizedText(
      personalizedQuestionsPrompt, 
      spiritualPathQuestionPrompts.mindfulness.aiParams
    );

    console.log('🌈 Questions générées brutes:', generatedQuestions);

    // Parser les questions
    const parsedQuestions = parseQuestions(generatedQuestions, 'mindfulness');
    console.log('✨ Questions parsées finales:', parsedQuestions);

    // Simuler les réponses
    const simulatedAnswers = [
      "La méditation m'aide à gérer mon stress quotidien",
      "Je me sens plus calme et centré après une séance",
      "J'ai du mal à maintenir une pratique régulière",
      "Ma perception du temps et de l'espace a changé",
      "Le matin, juste après mon réveil, est mon moment préféré"
    ];

    console.log('📝 Réponses simulées:', simulatedAnswers);

    // Générer une analyse personnalisée
    const personalAnalysisPrompt = `Analyse personnelle basée sur ces réponses de pleine conscience : ${simulatedAnswers.join('. ')}. 
    Prénom: ${formData.firstName}. 
    Nom: ${formData.lastName}. 
    Génère une analyse profonde et bienveillante.`;

    const personalAnalysis = await generatePersonalizedText(personalAnalysisPrompt, {
      temperature: 0.7,
      maxTokens: 300
    });

    console.log('📊 Analyse personnalisée générée:', {
      length: personalAnalysis.length,
      preview: personalAnalysis.substring(0, 200) + '...'
    });

  } catch (error) {
    console.error('❌ Erreur durant le test:', error);
  }
}

testMindfulnessGameFlow();
