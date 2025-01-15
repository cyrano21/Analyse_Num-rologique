"use client";

import React, { useState, useEffect, memo, FormEvent, useCallback, useMemo } from 'react';
import { calculateLifePath, calculateExpressionNumber, getZodiacSign } from '../utils/numerology';
import { generatePredictions, Prediction, PredictionResult } from '../utils/predictions';
import { drawTarotCard, drawTarotSpread, MAJOR_ARCANA, DEFAULT_CARD, TarotCard } from '../utils/cartomancy';
import { analyzePersonalityTraits, generateLifeInsights, generateIntroDescription, analyzePersonalResponses, generateContextualQuestions, personalizeWelcome } from '../utils/huggingface';
import { generatePersonalizedText } from '../utils/huggingface';
import toast from 'react-hot-toast';

// Importer le type Prediction si ce n'est pas déjà fait
// import { Prediction } from '../utils/predictions';

const enneagramTypes = [
  {
    type: '1',
    label: 'Type 1 : Le Réformateur',
    description: 'Perfectionniste, organisé, avec un fort sens moral et éthique.',
    color: 'bg-red-100 text-red-800',
    icon: '✔️'
  },
  {
    type: '2',
    label: 'Type 2 : L\'Assistant',
    description: 'Chaleureux, empathique, toujours prêt à aider les autres.',
    color: 'bg-pink-100 text-pink-800',
    icon: '❤️'
  },
  {
    type: '3',
    label: 'Type 3 : L\'Accompli',
    description: 'Ambitieux, dynamique, orienté vers le succès et la performance.',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🏆'
  },
  {
    type: '4',
    label: 'Type 4 : L\'Individualiste',
    description: 'Créatif, émotionnel, à la recherche de sens et d\'authenticité.',
    color: 'bg-purple-100 text-purple-800',
    icon: '🎨'
  },
  {
    type: '5',
    label: 'Type 5 : L\'Investigateur',
    description: 'Analytique, curieux, en quête de connaissances et de compréhension.',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔬'
  },
  {
    type: '6',
    label: 'Type 6 : Le Loyaliste',
    description: 'Responsable, engagé, cherchant la sécurité et la stabilité.',
    color: 'bg-green-100 text-green-800',
    icon: '🛡️'
  },
  {
    type: '7',
    label: 'Type 7 : L\'Enthousiaste',
    description: 'Optimiste, aventureux, à la recherche de nouvelles expériences.',
    color: 'bg-orange-100 text-orange-800',
    icon: '🌈'
  },
  {
    type: '8',
    label: 'Type 8 : Le Leader',
    description: 'Puissant, protecteur, avec un fort désir de contrôle et de justice.',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '💪'
  },
  {
    type: '9',
    label: 'Type 9 : Le Médiateur',
    description: 'Pacifique, conciliant, en harmonie avec son environnement.',
    color: 'bg-teal-100 text-teal-800',
    icon: '☮️'
  }
];

// Icônes personnalisées SVG
const Icons = {
  Mindfulness: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zM9.29 13.29c.39.39 1.02.39 1.41 0l.29-.29.29.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.41 11l.29-.29c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L12 9.59l-.29-.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l.29.29-.29.29c-.39.39-.39 1.02 0 1.41z"/>
    </svg>
  ),
  EmotionalIntelligence: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  PersonalGrowth: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
    </svg>
  ),
  SpiritualAwakening: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
  )
};

const defaultQuestions = {
  mindfulness: [
    "Comment pouvez-vous intégrer la pleine conscience dans votre routine quotidienne ?",
    "Quels sont les moments de la journée où vous ressentez le plus de stress, et comment pourriez-vous y appliquer la méditation ?",
    "Décrivez une situation récente où être présent aurait pu améliorer votre expérience.",
    "Quels sont vos obstacles personnels à la pratique de la pleine conscience ?",
    "Comment la pleine conscience pourrait-elle vous aider à mieux comprendre vos émotions ?"
  ],
  emotionalIntelligence: [
    "Pouvez-vous identifier et nommer précisément l'émotion que vous ressentez actuellement ?",
    "Racontez une situation récente où vos émotions ont influencé votre prise de décision.",
    "Comment réagissez-vous habituellement face à des émotions difficiles ?",
    "Quels sont vos déclencheurs émotionnels les plus fréquents ?",
    "Comment pourriez-vous développer plus d'empathie envers vous-même et les autres ?"
  ],
  personalGrowth: [
    "Quels sont vos trois principaux objectifs de développement personnel pour les prochains six mois ?",
    "Identifiez un schéma de pensée limitant que vous souhaitez transformer.",
    "Décrivez une compétence que vous aimeriez développer et pourquoi.",
    "Quels sont les défis qui vous font le plus grandir personnellement ?",
    "Comment votre parcours personnel a-t-il façonné vos aspirations actuelles ?"
  ],
  spiritualAwakening: [
    "Qu'est-ce qui vous connecte le plus profondément à votre essence spirituelle ?",
    "Décrivez un moment où vous avez ressenti une connexion significative avec quelque chose de plus grand que vous-même.",
    "Quels sont les pratiques ou rituels qui nourrissent votre âme ?",
    "Comment définiriez-vous votre chemin spirituel personnel ?",
    "Quelles sont les croyances qui vous limitent dans votre évolution spirituelle ?"
  ]
};

type PersonalAnalysis = {
  summary: string;
  insights: string[];
  recommendations: string[];  // Préciser explicitement comme un tableau de chaînes
  personalStrengths: string[];
  growthAreas: string[];
};

type GameResponses = {
  mindfulness: {
    questions: string[];
    userAnswers: string[];
    currentAnswer: string;
    isCompleted: boolean;
    personalAnalysis?: PersonalAnalysis;
  },
  emotionalIntelligence: {
    questions: string[];
    userAnswers: string[];
    currentAnswer: string;
    isCompleted: boolean;
    personalAnalysis?: PersonalAnalysis;
  },
  personalGrowth: {
    questions: string[];
    userAnswers: string[];
    currentAnswer: string;
    isCompleted: boolean;
    personalAnalysis?: PersonalAnalysis;
  },
  spiritualAwakening: {
    questions: string[];
    userAnswers: string[];
    currentAnswer: string;
    isCompleted: boolean;
    personalAnalysis?: PersonalAnalysis;
  }
};

const spiritualPathQuestionPrompts = {
  mindfulness: {
    basePrompt: (formData: any) => {
      const enneagramType = formData.enneagramType || 3; // Valeur par défaut
      console.log('Mindfulness Prompt - Ennéagram Type:', enneagramType);
      console.log('Full FormData:', formData);
      
      return `
      Génère 5 questions de pleine conscience profondément personnalisées et uniques pour un individu de type Ennéagramme ${enneagramType}. 
      Les questions doivent :
      - Être totalement originales et jamais posées précédemment
      - Favoriser la conscience de soi et la présence
      - Tenir compte du nom : ${formData.firstName} ${formData.lastName}
      - Encourager une réflexion introspective profonde
      - Utiliser un langage bienveillant et non-jugeant
      - Proposer des perspectives nouvelles à chaque génération

      Format de réponse attendu :
      1. Question 1 (texte de la question)
      2. Question 2 (texte de la question)
      3. Question 3 (texte de la question)
      4. Question 4 (texte de la question)
      5. Question 5 (texte de la question)

      Chaque question doit être unique, stimulante et adaptée à la personnalité de l'utilisateur.
    `;
    },
    aiParams: 'gpt2' // Modèle par défaut
  },
  emotionalIntelligence: {
    basePrompt: (formData: any) => {
      const enneagramType = formData.enneagramType || 3;
      console.log('Emotional Intelligence Prompt - Ennéagram Type:', enneagramType);
      
      return `
      Génère 5 questions d'intelligence émotionnelle profondément personnalisées et uniques pour un individu de type Ennéagramme ${enneagramType}. 
      Les questions doivent :
      - Être totalement originales et jamais posées précédemment
      - Explorer la complexité émotionnelle
      - Tenir compte du nom : ${formData.firstName} ${formData.lastName}
      - Stimuler l'empathie et la compréhension de soi
      - Utiliser un langage délicat et encourageant
      - Proposer des perspectives émotionnelles inédites

      Format de réponse attendu :
      1. Question 1 (texte de la question)
      2. Question 2 (texte de la question)
      3. Question 3 (texte de la question)
      4. Question 4 (texte de la question)
      5. Question 5 (texte de la question)

      Chaque question doit révéler des couches profondes de l'intelligence émotionnelle.
    `;
    },
    aiParams: 'gpt2' // Modèle par défaut
  },
  personalGrowth: {
    basePrompt: (formData: any) => {
      const enneagramType = formData.enneagramType || 3;
      console.log('Personal Growth Prompt - Ennéagram Type:', enneagramType);
      
      return `
      Génère 5 questions de développement personnel profondément personnalisées et uniques pour un individu de type Ennéagramme ${enneagramType}. 
      Les questions doivent :
      - Être totalement originales et jamais posées précédemment
      - Stimuler la croissance personnelle
      - Tenir compte du nom : ${formData.firstName} ${formData.lastName}
      - Défier les schémas de pensée actuels
      - Utiliser un langage motivant et transformateur
      - Proposer des perspectives de développement inédites

      Format de réponse attendu :
      1. Question 1 (texte de la question)
      2. Question 2 (texte de la question)
      3. Question 3 (texte de la question)
      4. Question 4 (texte de la question)
      5. Question 5 (texte de la question)

      Chaque question doit être un catalyseur de transformation personnelle.
    `;
    },
    aiParams: 'gpt2' // Modèle par défaut
  },
  spiritualAwakening: {
    basePrompt: (formData: any) => {
      const enneagramType = formData.enneagramType || 3;
      console.log('Spiritual Awakening Prompt - Ennéagram Type:', enneagramType);
      
      return `
      Génère 5 questions d'éveil spirituel profondément personnalisées et uniques pour un individu de type Ennéagramme ${enneagramType}. 
      Les questions doivent :
      - Être totalement originales et jamais posées précédemment
      - Favoriser la connexion spirituelle
      - Tenir compte du nom : ${formData.firstName} ${formData.lastName}
      - Encourager l'introspection transcendantale
      - Utiliser un langage poétique et inspirant
      - Proposer des perspectives spirituelles inédites

      Format de réponse attendu :
      1. Question 1 (texte de la question)
      2. Question 2 (texte de la question)
      3. Question 3 (texte de la question)
      4. Question 4 (texte de la question)
      5. Question 5 (texte de la question)

      Chaque question doit être un portail vers une compréhension plus profonde de soi.
    `;
    },
    aiParams: 'gpt2' // Modèle par défaut
  }
};

const parseQuestions = (content: string | string[], gameType: string) => {
  // Convertir en chaîne si c'est un tableau
  const contentString = Array.isArray(content) 
    ? content.join('\n') 
    : content;

  console.log('Parsing content:', contentString);
  
  // Séparer le contenu en lignes
  const lines = contentString.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  // Critères stricts pour identifier une vraie question
  const isValidQuestion = (line: string) => {
    // Critères de validation d'une question
    return (
      line.length > 20 &&  // Longueur minimale
      line.endsWith('?') &&  // Se termine par un point d'interrogation
      !line.includes(':') && // Ne contient pas de deux-points
      !line.toLowerCase().includes('génère') &&
      !line.toLowerCase().includes('format de réponse') &&
      !line.toLowerCase().includes('les questions doivent')
    );
  };
  
  // Filtrer et nettoyer les questions
  const questions = lines
    .filter(isValidQuestion)
    .slice(0, 5); // Limiter à 5 questions maximum
  
  console.log('Parsed Questions:', questions);
  
  // Utiliser les questions par défaut si aucune question valide n'est trouvée
  return questions.length > 0 ? questions : defaultQuestions[gameType];
};

type GameState = {
  [K in keyof GameResponses]: {
    questions: string[];
    userAnswers: string[];
    currentAnswer: string;
    isCompleted: boolean;
    personalAnalysis?: PersonalAnalysis;
  }
};

const Home = () => {
  const [gameStates, setGameStates] = useState<GameState>({
    mindfulness: {
      questions: defaultQuestions.mindfulness,
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    },
    emotionalIntelligence: {
      questions: defaultQuestions.emotionalIntelligence,
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    },
    personalGrowth: {
      questions: defaultQuestions.personalGrowth,
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    },
    spiritualAwakening: {
      questions: defaultQuestions.spiritualAwakening,
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    }
  });

  const [formData, setFormData] = useState({
    firstName: 'LOUIS OLIVIER',
    lastName: 'NKENG HIAG',
    birthdate: '1985-04-13',
    birthtime: '15:00',
    birthplace: 'song-loulou',
    gender: 'male',
    email: 'louiscyrano@gmail.com',
    lifeAspect: 'love',
    enneagramType: '3'
  });

  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [personalityTraits, setPersonalityTraits] = useState<any[]>([]);
  const [lifeInsights, setLifeInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Cartomancy state
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [drawnSpread, setDrawnSpread] = useState<{ cards: TarotCard[], interpretation: string } | null>(null);
  const [spreadType, setSpreadType] = useState<'Single' | 'ThreePast' | 'Celtic'>('Single');

  // États pour gérer les descriptions
  const [showNumeroDescription, setShowNumeroDescription] = useState(true);
  const [showTarotDescription, setShowTarotDescription] = useState(true);

  // État pour gérer le jeu actif
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Nouveau type pour stocker les réponses de tous les jeux
  const [gameResponses, setGameResponses] = useState<GameResponses>({
    mindfulness: {
      questions: [],
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    },
    emotionalIntelligence: {
      questions: [],
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    },
    personalGrowth: {
      questions: [],
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    },
    spiritualAwakening: {
      questions: [],
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    }
  });

  const [personalizedWelcome, setPersonalizedWelcome] = useState('');

  const updateGameState = (
    gameType: keyof GameResponses, 
    updates: Partial<GameState[keyof GameResponses]>
  ) => {
    setGameStates(prev => {
      const newState = {
        ...prev,
        [gameType]: {
          ...prev[gameType],
          ...updates
        }
      };
      
      // Ajouter un log de débogage
      console.log(`Updating ${gameType} game state:`, {
        oldState: prev[gameType],
        updates,
        newState: newState[gameType]
      });
      
      return newState;
    });
  };

  const setCurrentGameAnswer = (
    gameType: keyof GameResponses, 
    answer: string
  ) => {
    // Utiliser une fonction de mise à jour qui garantit la mise à jour
    setGameStates(prev => {
      // Vérifier si la réponse a vraiment changé
      if (prev[gameType].currentAnswer === answer) {
        return prev;
      }
      
      return {
        ...prev,
        [gameType]: {
          ...prev[gameType],
          currentAnswer: answer
        }
      };
    });
  };

  const navigateToGame = (gameId: string) => {
    // Mapper les ID aux types de jeux
    const gameTypeMap: { [key: string]: keyof GameResponses } = {
      'mindfulness': 'mindfulness',
      'emotional-intelligence': 'emotionalIntelligence',
      'personal-growth': 'personalGrowth',
      'spiritual-awakening': 'spiritualAwakening'
    };

    const gameType = gameTypeMap[gameId];

    if (!gameType) {
      console.error(`Type de jeu inconnu pour l'ID : ${gameId}`);
      return;
    }

    // Réinitialiser le jeu spécifique
    updateGameState(gameType, {
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false
    });

    // Démarrer le nouveau jeu
    startNewGame(gameType);
  };

  const addUserAnswer = (
    gameType: keyof GameResponses, 
    answer: string
  ) => {
    updateGameState(gameType, {
      userAnswers: [
        ...gameStates[gameType].userAnswers, 
        answer
      ]
    });
  };

  const completeGame = (gameType: keyof GameResponses) => {
    updateGameState(gameType, {
      isCompleted: true
    });
  };

  const MindfulnessGame = memo(({ formData }: { formData: any }) => {
    const gameType: keyof GameResponses = 'mindfulness';
    
    const { questions, userAnswers, currentAnswer, isCompleted } = gameStates[gameType];
    const currentQuestionIndex = userAnswers.length;

    const handleCurrentAnswerChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      updateGameState(gameType, {
        questions,
        userAnswers,
        currentAnswer: value,
        isCompleted
      });
    }, [gameType, questions, userAnswers, isCompleted]);

    const generateQuestions = useCallback(async () => {
      try {
        const newQuestions = await generatePersonalizedText(
          spiritualPathQuestionPrompts[gameType].basePrompt(formData),
          spiritualPathQuestionPrompts[gameType].aiParams
        );
        
        console.log('Generated Content:', newQuestions);
        
        const parsedQuestions = parseQuestions(newQuestions, gameType);
        
        updateGameState(gameType, { 
          questions: parsedQuestions 
        });
      } catch (error) {
        console.error('Erreur de génération de questions:', error);
        updateGameState(gameType, { 
          questions: defaultQuestions[gameType] 
        });
      }
    }, [formData, gameType]);

    const handleNextQuestion = useCallback(() => {
      // Vérifier si une réponse existe avant de passer à la question suivante
      if (currentAnswer.trim()) {
        // Ajouter la réponse actuelle
        addUserAnswer(gameType, currentAnswer);
        
        // Réinitialiser la réponse courante
        setCurrentGameAnswer(gameType, '');
        
        // Vérifier si toutes les questions ont été répondues
        if (currentQuestionIndex + 1 >= questions.length) {
          completeGame(gameType);
        }
      } else {
        // Optionnel : afficher un message d'erreur si pas de réponse
        toast.error('Veuillez répondre à la question avant de continuer');
      }
    }, [currentAnswer, currentQuestionIndex, questions.length, gameType]);

    useEffect(() => {
      if (!questions.length) {
        generateQuestions();
      }
    }, [formData, generateQuestions, questions.length]);

    // Gérer le cas où toutes les questions sont terminées
    if (isCompleted) {
      return (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Jeu de Pleine Conscience Terminé
          </h3>
          <p className="text-green-600">
            Vous avez répondu à toutes les questions. Votre analyse est en cours de génération.
          </p>
        </div>
      );
    }

    // Afficher un message de chargement si les questions ne sont pas encore générées
    if (!questions.length) {
      return <p className="text-gray-500 text-center">Génération des questions...</p>;
    }

    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Voyage de Pleine Conscience
          </h2>
          
          {questions[currentQuestionIndex] && (
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
              <p className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                {questions[currentQuestionIndex]}
              </p>
              
              <textarea 
                value={currentAnswer}
                onChange={handleCurrentAnswerChange}
                placeholder="Prenez un moment pour réfléchir et partagez vos pensées..."
                className="w-full p-4 min-h-[150px] border-2 border-purple-100 rounded-xl
                  focus:ring-2 focus:ring-purple-400 focus:border-transparent
                  text-gray-700 placeholder-gray-400
                  transition-all duration-300 ease-in-out
                  resize-y"
              />
              
              <div className="flex justify-between items-center mt-6">
                <button 
                  onClick={handleNextQuestion}
                  disabled={!currentAnswer.trim()}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300
                    ${currentAnswer.trim() 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  {currentQuestionIndex + 1 < questions.length ? 'Question Suivante' : 'Terminer le Voyage'}
                </button>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">{currentQuestionIndex + 1}</span>
                  <span>/</span>
                  <span>{questions.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, (prevProps, nextProps) => prevProps.formData === nextProps.formData);

  const EmotionalIntelligenceGame = memo(({ formData }: { formData: any }) => {
    const gameType: keyof GameResponses = 'emotionalIntelligence';
    
    const { questions, userAnswers, currentAnswer, isCompleted } = gameStates[gameType];
    const currentQuestionIndex = userAnswers.length;

    const generateQuestions = useCallback(async () => {
      try {
        const newQuestions = await generatePersonalizedText(
          spiritualPathQuestionPrompts[gameType].basePrompt(formData),
          spiritualPathQuestionPrompts[gameType].aiParams
        );
        
        console.log('Generated Content:', newQuestions);
        
        const parsedQuestions = parseQuestions(newQuestions, gameType);
        
        updateGameState(gameType, { 
          questions: parsedQuestions 
        });
      } catch (error) {
        console.error('Erreur de génération de questions:', error);
        updateGameState(gameType, { 
          questions: defaultQuestions[gameType] 
        });
      }
    }, [formData, gameType]);

    const handleCurrentAnswerChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      // Utiliser un debounce léger pour réduire les re-renders
      setCurrentGameAnswer(gameType, value);
    }, [gameType]);

    const handleNextQuestion = useCallback(() => {
      // Vérifier si une réponse existe avant de passer à la question suivante
      if (currentAnswer.trim()) {
        // Ajouter la réponse actuelle
        addUserAnswer(gameType, currentAnswer);
        
        // Réinitialiser la réponse courante
        setCurrentGameAnswer(gameType, '');
        
        // Vérifier si toutes les questions ont été répondues
        if (currentQuestionIndex + 1 >= questions.length) {
          completeGame(gameType);
        }
      } else {
        // Optionnel : afficher un message d'erreur si pas de réponse
        toast.error('Veuillez répondre à la question avant de continuer');
      }
    }, [currentAnswer, currentQuestionIndex, questions.length, gameType]);

    useEffect(() => {
      if (!questions.length) {
        generateQuestions();
      }
    }, [formData, generateQuestions, questions.length]);

    // Gérer le cas où toutes les questions sont terminées
    if (isCompleted) {
      return (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Jeu d'Intelligence Émotionnelle Terminé
          </h3>
          <p className="text-green-600">
            Vous avez répondu à toutes les questions. Votre analyse est en cours de génération.
          </p>
        </div>
      );
    }

    // Afficher un message de chargement si les questions ne sont pas encore générées
    if (!questions.length) {
      return <p className="text-gray-500 text-center">Génération des questions...</p>;
    }

    return (
      <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Jeu d'Intelligence Émotionnelle</h2>
        
        {questions[currentQuestionIndex] && (
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <p className="text-xl font-bold text-indigo-800 mb-4 leading-relaxed">
              {questions[currentQuestionIndex]}
            </p>
            <textarea 
              value={currentAnswer}
              onChange={handleCurrentAnswerChange}
              placeholder="Écrivez votre réponse ici..."
              className="w-full p-4 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                text-gray-700 placeholder-gray-400 
                transition-all duration-300 ease-in-out 
                resize-y min-h-[150px]"
            />
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ease-in-out 
                  ${currentAnswer.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {currentQuestionIndex + 1 < questions.length ? 'Question Suivante' : 'Terminer'}
              </button>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });

  const PersonalGrowthGame = memo(({ formData }: { formData: any }) => {
    const gameType: keyof GameResponses = 'personalGrowth';
    
    const { questions, userAnswers, currentAnswer, isCompleted } = gameStates[gameType];
    const currentQuestionIndex = userAnswers.length;

    const generateQuestions = useCallback(async () => {
      try {
        const newQuestions = await generatePersonalizedText(
          spiritualPathQuestionPrompts[gameType].basePrompt(formData),
          spiritualPathQuestionPrompts[gameType].aiParams
        );
        
        console.log('Generated Content:', newQuestions);
        
        const parsedQuestions = parseQuestions(newQuestions, gameType);
        
        updateGameState(gameType, { 
          questions: parsedQuestions 
        });
      } catch (error) {
        console.error('Erreur de génération de questions:', error);
        updateGameState(gameType, { 
          questions: defaultQuestions[gameType] 
        });
      }
    }, [formData, gameType]);

    const handleCurrentAnswerChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      // Utiliser un debounce léger pour réduire les re-renders
      setCurrentGameAnswer(gameType, value);
    }, [gameType]);

    const handleNextQuestion = useCallback(() => {
      // Vérifier si une réponse existe avant de passer à la question suivante
      if (currentAnswer.trim()) {
        // Ajouter la réponse actuelle
        addUserAnswer(gameType, currentAnswer);
        
        // Réinitialiser la réponse courante
        setCurrentGameAnswer(gameType, '');
        
        // Vérifier si toutes les questions ont été répondues
        if (currentQuestionIndex + 1 >= questions.length) {
          completeGame(gameType);
        }
      } else {
        // Optionnel : afficher un message d'erreur si pas de réponse
        toast.error('Veuillez répondre à la question avant de continuer');
      }
    }, [currentAnswer, currentQuestionIndex, questions.length, gameType]);

    useEffect(() => {
      if (!questions.length) {
        generateQuestions();
      }
    }, [formData, generateQuestions, questions.length]);

    // Gérer le cas où toutes les questions sont terminées
    if (isCompleted) {
      return (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Jeu de Croissance Personnelle Terminé
          </h3>
          <p className="text-green-600">
            Vous avez répondu à toutes les questions. Votre analyse est en cours de génération.
          </p>
        </div>
      );
    }

    // Afficher un message de chargement si les questions ne sont pas encore générées
    if (!questions.length) {
      return <p className="text-gray-500 text-center">Génération des questions...</p>;
    }

    return (
      <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Jeu de Croissance Personnelle</h2>
        
        {questions[currentQuestionIndex] && (
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <p className="text-xl font-bold text-indigo-800 mb-4 leading-relaxed">
              {questions[currentQuestionIndex]}
            </p>
            <textarea 
              value={currentAnswer}
              onChange={handleCurrentAnswerChange}
              placeholder="Écrivez votre réponse ici..."
              className="w-full p-4 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                text-gray-700 placeholder-gray-400 
                transition-all duration-300 ease-in-out 
                resize-y min-h-[150px]"
            />
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ease-in-out 
                  ${currentAnswer.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {currentQuestionIndex + 1 < questions.length ? 'Question Suivante' : 'Terminer'}
              </button>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });

  const SpiritualAwakeningGame = memo(({ formData }: { formData: any }) => {
    const gameType: keyof GameResponses = 'spiritualAwakening';
    
    const { questions, userAnswers, currentAnswer, isCompleted } = gameStates[gameType];
    const currentQuestionIndex = userAnswers.length;

    const generateQuestions = useCallback(async () => {
      try {
        const newQuestions = await generatePersonalizedText(
          spiritualPathQuestionPrompts[gameType].basePrompt(formData),
          spiritualPathQuestionPrompts[gameType].aiParams
        );
        
        console.log('Generated Content:', newQuestions);
        
        const parsedQuestions = parseQuestions(newQuestions, gameType);
        
        updateGameState(gameType, { 
          questions: parsedQuestions 
        });
      } catch (error) {
        console.error('Erreur de génération de questions:', error);
        updateGameState(gameType, { 
          questions: defaultQuestions[gameType] 
        });
      }
    }, [formData, gameType]);

    const handleCurrentAnswerChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      // Utiliser un debounce léger pour réduire les re-renders
      setCurrentGameAnswer(gameType, value);
    }, [gameType]);

    const handleNextQuestion = useCallback(() => {
      // Vérifier si une réponse existe avant de passer à la question suivante
      if (currentAnswer.trim()) {
        // Ajouter la réponse actuelle
        addUserAnswer(gameType, currentAnswer);
        
        // Réinitialiser la réponse courante
        setCurrentGameAnswer(gameType, '');
        
        // Vérifier si toutes les questions ont été répondues
        if (currentQuestionIndex + 1 >= questions.length) {
          completeGame(gameType);
        }
      } else {
        // Optionnel : afficher un message d'erreur si pas de réponse
        toast.error('Veuillez répondre à la question avant de continuer');
      }
    }, [currentAnswer, currentQuestionIndex, questions.length, gameType]);

    useEffect(() => {
      if (!questions.length) {
        generateQuestions();
      }
    }, [formData, generateQuestions, questions.length]);

    // Gérer le cas où toutes les questions sont terminées
    if (isCompleted) {
      return (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Jeu d'Éveil Spirituel Terminé
          </h3>
          <p className="text-green-600">
            Vous avez répondu à toutes les questions. Votre analyse est en cours de génération.
          </p>
        </div>
      );
    }

    // Afficher un message de chargement si les questions ne sont pas encore générées
    if (!questions.length) {
      return <p className="text-gray-500 text-center">Génération des questions...</p>;
    }

    return (
      <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Jeu d'Éveil Spirituel</h2>
        
        {questions[currentQuestionIndex] && (
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <p className="text-xl font-bold text-indigo-800 mb-4 leading-relaxed">
              {questions[currentQuestionIndex]}
            </p>
            <textarea 
              value={currentAnswer}
              onChange={handleCurrentAnswerChange}
              placeholder="Écrivez votre réponse ici..."
              className="w-full p-4 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                text-gray-700 placeholder-gray-400 
                transition-all duration-300 ease-in-out 
                resize-y min-h-[150px]"
            />
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ease-in-out 
                  ${currentAnswer.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {currentQuestionIndex + 1 < questions.length ? 'Question Suivante' : 'Terminer'}
              </button>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });

  const spiritualPaths = [
    {
      id: 'mindfulness',
      title: 'Pleine Conscience',
      icon: Icons.Mindfulness,
      color: 'from-green-500 to-emerald-600',
      description: 'Développez votre présence et votre conscience de l\'instant.',
      details: [
        'Méditation guidée',
        'Exercices de respiration',
        'Techniques de relaxation'
      ],
      game: MindfulnessGame
    },
    {
      id: 'emotional-intelligence',
      title: 'Intelligence Émotionnelle',
      icon: Icons.EmotionalIntelligence,
      color: 'from-blue-500 to-indigo-600',
      description: 'Explorez et développez votre intelligence émotionnelle.',
      details: [
        'Exercices d\'empathie',
        'Gestion des émotions',
        'Communication bienveillante'
      ],
      game: EmotionalIntelligenceGame
    },
    {
      id: 'personal-growth',
      title: 'Développement Personnel',
      icon: Icons.PersonalGrowth,
      color: 'from-yellow-500 to-orange-600',
      description: 'Progressez et transformez-vous continuellement.',
      details: [
        'Défis personnels',
        'Réflexion introspective',
        'Objectifs de croissance'
      ],
      game: PersonalGrowthGame
    },
    {
      id: 'spiritual-awakening',
      title: 'Éveil Spirituel',
      icon: Icons.SpiritualAwakening,
      color: 'from-purple-500 to-pink-600',
      description: 'Connectez-vous à votre essence profonde.',
      details: [
        'Méditation contemplative',
        'Exploration intérieure',
        'Connexion spirituelle'
      ],
      game: SpiritualAwakeningGame
    }
  ];

  const resetPredictions = () => {
    setPredictions(null);
    setPersonalityTraits([]);
    setLifeInsights('');
    setShowNumeroDescription(false);
  };

  const resetTarotDraws = () => {
    setDrawnCard(null);
    setDrawnSpread(null);
    setShowTarotDescription(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const lifePath = calculateLifePath(formData.birthdate);
      const expressionNumber = calculateExpressionNumber(formData.firstName + ' ' + formData.lastName);
      const zodiacSign = getZodiacSign(formData.birthdate);

      // Generate predictions without cartomancy
      const generatedPredictions = await generatePredictions({
        lifePath,
        zodiacSign,
        lifeAspect: 'general',
        enneagramType: formData.enneagramType
      });

      // Set predictions without cartomancy cards
      setPredictions({
        ...generatedPredictions,
        name: formData.firstName + ' ' + formData.lastName,
        lifePath,
        expressionNumber,
        zodiacSign
      });

      // Personality and life insights
      const traits = await analyzePersonalityTraits(formData.firstName + ' ' + formData.lastName);
      setPersonalityTraits(traits);

      const insights = await generateLifeInsights({
        name: formData.firstName + ' ' + formData.lastName,
        birthdate: formData.birthdate,
        lifeAspect: formData.lifeAspect
      });
      setLifeInsights(insights);

    } catch (error) {
      console.error('Erreur lors de la génération des prédictions:', error);
    } finally {
      setIsLoading(false);
      setShowNumeroDescription(false);
    }
  };

  const handleDrawCard = () => {
    if (spreadType === 'Single') {
      const card = drawTarotCard();
      setDrawnCard(card);
      setDrawnSpread(null);
    } else {
      const spread = drawTarotSpread(spreadType);
      setDrawnSpread(spread);
      setDrawnCard(null);
    }
    setShowTarotDescription(false);
  };

  const updateGameResponses = (gameType: keyof GameResponses, newResponses: string[]) => {
    setGameResponses(prev => ({
      ...prev,
      [gameType]: {
        ...prev[gameType],
        userAnswers: [...prev[gameType].userAnswers, ...newResponses]
      }
    }));
  };

  const startNewGame = (gameType: keyof GameResponses) => {
    setActiveGame(gameType);
    
    // Utiliser les réponses précédentes du jeu si elles existent
    const previousResponses = gameResponses[gameType];
    
    if (previousResponses.userAnswers.length > 0) {
      // Générer des questions contextuelles basées sur les réponses précédentes
      generateContextualQuestions(
        gameType, 
        previousResponses.userAnswers, 
        formData.firstName + ' ' + formData.lastName
      ).then(content => {
        const parsedQuestions = parseQuestions(content, gameType);
        updateGameState(gameType, { 
          questions: parsedQuestions 
        });
        setCurrentGameAnswer(gameType, '');
      });
    } else {
      // Première fois pour ce jeu
      generatePersonalizedText(
        spiritualPathQuestionPrompts[gameType].basePrompt(formData),
        spiritualPathQuestionPrompts[gameType].aiParams
      ).then(content => {
        const parsedQuestions = parseQuestions(content, gameType);
        updateGameState(gameType, { 
          questions: parsedQuestions 
        });
        setCurrentGameAnswer(gameType, '');
      });
    }
    
    // Générer un message de bienvenue personnalisé
    const welcome = personalizeWelcome(
      formData.firstName, 
      gameType,
      formData.gender // Ajout du paramètre gender
    );
    setPersonalizedWelcome(welcome);
  };

  const generateMeditationGuide = async (userAnswers: string[]): Promise<string> => {
    try {
      const meditationPrompt = `
        Basé sur ces réponses spirituelles : ${userAnswers.join('; ')}
        Générer un guide de méditation personnalisé qui :
        - Reflète les insights spirituels de l'utilisateur
        - Propose une pratique de méditation adaptée
        - Soit concis et pratique
      `;

      const meditationGuide = await generatePersonalizedText(
        meditationPrompt, 
        'gpt2'
      );

      return meditationGuide;
    } catch (error) {
      console.error('Erreur de génération du guide de méditation:', error);
      return `Guide de méditation standard pour votre éveil spirituel.
      1. Trouvez un endroit calme
      2. Asseyez-vous confortablement
      3. Concentrez-vous sur votre respiration
      4. Laissez vos pensées défiler sans jugement`;
    }
  };

  const openMeditationModal = (meditationGuide: string) => {
    // Créer un état pour gérer la modal de méditation
    const [isMeditationModalOpen, setIsMeditationModalOpen] = useState(false);
    const [currentMeditationGuide, setCurrentMeditationGuide] = useState('');

    useEffect(() => {
      if (meditationGuide) {
        setCurrentMeditationGuide(meditationGuide);
        setIsMeditationModalOpen(true);
      }
    }, [meditationGuide]);

    // Composant de modal de méditation
    const MeditationModal = () => (
      isMeditationModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-900 p-8 rounded-xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-purple-200 mb-4">Méditation Guidée</h3>
            <p className="text-purple-100 mb-6">{currentMeditationGuide}</p>
            <div className="flex justify-between">
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                onClick={() => {
                  // Commencer la méditation (pourrait lancer un audio ou un timer)
                  startMeditation(currentMeditationGuide);
                }}
              >
                Commencer
              </button>
              <button 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                onClick={() => setIsMeditationModalOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null
    );

    return { MeditationModal, openModal: () => setIsMeditationModalOpen(true) };
  };

  const startMeditation = (guide: string) => {
    // Logique pour démarrer une méditation
    console.log('Démarrage de la méditation :', guide);
    
    // Créer un état pour gérer la notification
    const [notification, setNotification] = useState<{
      message: string;
      type: 'info' | 'success' | 'error';
    } | null>(null);

    // Fonction pour afficher la notification
    const showNotification = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
      setNotification({ message, type });
      
      // Masquer la notification après 5 secondes
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    };

    // Afficher la notification de démarrage de méditation
    showNotification('Méditation en cours. Respirez profondément.', 'info');

    // Composant de notification
    const Notification = () => {
      if (!notification) return null;

      const bgColorMap = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        error: 'bg-red-500'
      };

      return (
        <div 
          className={`fixed top-4 right-4 ${bgColorMap[notification.type]} 
          text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`}
        >
          {notification.message}
        </div>
      );
    };

    // Retourner le composant de notification pour pouvoir l'intégrer dans le rendu principal
    return { Notification, showNotification };
  };

  const sharePersonalAnalysis = (personalAnalysis: PersonalAnalysis, gameType: keyof GameResponses) => {
    // Vérifier si le navigateur supporte l'API Web Share
    if (navigator.share) {
      try {
        navigator.share({
          title: `Mon analyse personnelle - ${gameType}`,
          text: `Voici mon analyse personnelle pour le jeu ${gameType}:\n\nRésumé: ${personalAnalysis.summary}\n\nPoints forts: ${personalAnalysis.personalStrengths.join(', ')}\n\nAxes de croissance: ${personalAnalysis.growthAreas.join(', ')}\n\nRecommandations: ${personalAnalysis.recommendations.join(', ')}`
        });
      } catch (error) {
        console.error('Erreur lors du partage:', error);
        // Afficher un message à l'utilisateur si le partage échoue
        alert('Impossible de partager l\'analyse pour le moment.');
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      // Copier dans le presse-papiers
      const analysisText = `Mon analyse personnelle - ${gameType}\n\nRésumé: ${personalAnalysis.summary}\n\nPoints forts: ${personalAnalysis.personalStrengths.join(', ')}\n\nAxes de croissance: ${personalAnalysis.growthAreas.join(', ')}\n\nRecommandations: ${personalAnalysis.recommendations.join(', ')}`;
      
      navigator.clipboard.writeText(analysisText).then(() => {
        alert('Analyse copiée dans le presse-papiers !');
      }).catch(err => {
        console.error('Erreur de copie:', err);
        alert('Impossible de copier l\'analyse.');
      });
    }
  };

  const resetGame = (gameType: keyof GameResponses) => {
    // Réinitialiser l'état du jeu spécifique en utilisant updateGameState
    updateGameState(gameType, {
      questions: defaultQuestions[gameType],
      userAnswers: [],
      currentAnswer: '',
      isCompleted: false,
      personalAnalysis: undefined
    });

    // Réinitialiser le type de jeu actuel
    setActiveGame(null);
  };

  return (
    <div className="w-full container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Analyse Numérologique Avancée
        </h1>
        
        {/* Section Analyse Numérologique */}
        <div className="section numerology">
          <h2 className="text-2xl font-bold text-purple-800">Analyse Numérologique</h2>
          
          {/* Description qui disparaît après le premier calcul */}
          {showNumeroDescription && (
            <div className="section-description 
              bg-gradient-to-r from-blue-50 to-purple-50 
              border-l-4 border-blue-500 
              p-6 
              rounded-xl 
              shadow-md 
              mb-6 
              animate-fade-in 
              hover:shadow-lg 
              transition-all 
              duration-300 
              ease-in-out"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    Découvrez la Magie des Nombres
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    L'Analyse Numérologique est une pratique fascinante qui explore la signification des nombres dans votre vie. 
                    Chaque nombre, basé sur votre date de naissance et votre nom, raconte une histoire unique de votre personnalité, 
                    de vos talents et de votre chemin de vie. Ce n'est pas de la magie, mais une méthode de découverte de soi 
                    qui vous aide à mieux comprendre vos forces, vos défis et votre potentiel.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Prénom
                  <input 
                    type="text" 
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    required 
                  />
                </label>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nom de famille
                  <input 
                    type="text" 
                    name="lastName"
                    placeholder="Nom de famille"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    required 
                  />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Date de naissance
                  <input 
                    type="date" 
                    value={formData.birthdate}
                    onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    required 
                  />
                </label>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Heure de naissance
                  <input 
                    type="time" 
                    value={formData.birthtime}
                    onChange={(e) => setFormData({...formData, birthtime: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                </label>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Aspect de vie
                  <select 
                    value={formData.lifeAspect}
                    onChange={(e) => setFormData({...formData, lifeAspect: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  >
                    <option value="love">Amour et Relations</option>
                    <option value="career">Carrière et Finances</option>
                    <option value="health">Santé et Bien-être</option>
                    <option value="personal">Développement Personnel</option>
                    <option value="spiritual">Spiritualité</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Genre
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  >
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Adresse e-mail
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                </label>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Type d'Ennéagramme
                  <div className="relative">
                    <select 
                      value={formData.enneagramType}
                      onChange={(e) => setFormData({...formData, enneagramType: e.target.value})}
                      className="appearance-none w-full bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-3 
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                        text-gray-700 font-medium transition-all duration-300 ease-in-out"
                    >
                      {enneagramTypes.map(type => (
                        <option 
                          key={type.type} 
                          value={type.type} 
                          className={`${type.color} font-semibold`}
                          title={type.description}
                        >
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Description dynamique */}
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg shadow-sm transition-all duration-300 ease-in-out">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {enneagramTypes.find(t => t.type === formData.enneagramType)?.icon}
                      </span>
                      <p className="text-sm text-gray-700">
                        {enneagramTypes.find(t => t.type === formData.enneagramType)?.description}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      L'Ennéagramme : Un système de personnalité qui révèle vos motivations profondes et vos mécanismes de défense.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 disabled:opacity-50"
              >
                {isLoading ? 'Génération en cours...' : 'Obtenir mon analyse'}
              </button>
            </div>
          </form>

          {predictions && (
            <div className="mt-12 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-800">
                  Résultats pour {predictions.name}
                </h2>
                <button 
                  onClick={resetPredictions}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
              <section className="bg-blue-50 p-6 rounded-xl">
                <p className="font-semibold">Chemin de vie : {predictions.lifePath}</p>
                <p className="text-gray-600">Votre essence numerologique</p>
              </section>
              <section className="bg-blue-50 p-6 rounded-xl">
                <p className="font-semibold">Nombre d'expression : {predictions.expressionNumber}</p>
                <p className="text-gray-600">Votre potentiel intrinsèque</p>
              </section>
              <section className="bg-blue-50 p-6 rounded-xl">
                <p className="font-semibold">Signe solaire : {predictions.zodiacSign.name} {predictions.zodiacSign.symbol}</p>
                <p className="text-gray-600">Votre identité astrologique</p>
              </section>

              {personalityTraits.length > 0 && (
                <section className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">
                    Analyse des Traits de Personnalité
                  </h3>
                  {personalityTraits.map((trait, index) => (
                    <div key={index} className="mb-3">
                      <p className="font-semibold">{trait.emotion}</p>
                      <p className="text-gray-700">{trait.interpretation}</p>
                    </div>
                  ))}
                </section>
              )}

              {lifeInsights && (
                <section className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    Perspectives de Vie Personnalisées
                  </h3>
                  <p className="text-gray-700">{lifeInsights}</p>
                </section>
              )}

              <section className="bg-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-orange-800">
                  Prédictions Détaillées
                </h3>
                {Object.entries(predictions.predictions).map(([aspect, prediction]: [string, Prediction]) => (
                  <div key={aspect} className="bg-white p-3 rounded-md shadow-sm">
                    <h3 className="font-semibold text-lg capitalize mb-2">{aspect}</h3>
                    <p>{prediction.text}</p>
                    {prediction.aiGeneratedInsight && (
                      <p className="text-sm text-gray-600 mt-2">
                        Insight IA : {prediction.aiGeneratedInsight}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            </div>
          )}
        </div>

        {/* Section Tirage de Tarot */}
        <div className="mt-8 bg-purple-50 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-800">Tirage de Cartes de Tarot</h2>
            {(drawnCard || drawnSpread) && (
              <button 
                onClick={resetTarotDraws}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
          
          {/* Description qui disparaît après le premier tirage */}
          {showTarotDescription && (
            <div className="section-description 
              bg-gradient-to-r from-purple-50 to-pink-50 
              border-l-4 border-purple-500 
              p-6 
              rounded-xl 
              shadow-md 
              mb-6 
              animate-fade-in 
              hover:shadow-lg 
              transition-all 
              duration-300 
              ease-in-out"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM9.29 13.29c.39.39 1.02.39 1.41 0l.29-.29.29.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.41 11l.29-.29c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L12 9.59l-.29-.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l.29.29-.29.29c-.39.39-.39 1.02 0 1.41z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    Votre Miroir Intérieur
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Le Tirage de Cartes de Tarot est bien plus qu'une simple divination. 
                    C'est un miroir symbolique qui vous aide à explorer vos pensées, vos émotions et vos intuitions. 
                    Chaque carte est comme une fenêtre ouverte sur votre monde intérieur, révélant des perspectives 
                    que votre conscience immédiate n'aperçoit pas toujours.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Spread Type Selection */}
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setSpreadType('Single')} 
              className={`px-6 py-3 rounded-lg transition-all ${
                spreadType === 'Single' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Carte Unique
            </button>
            <button 
              onClick={() => setSpreadType('ThreePast')} 
              className={`px-6 py-3 rounded-lg transition-all ${
                spreadType === 'ThreePast' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Passé, Présent, Futur
            </button>
            <button 
              onClick={() => setSpreadType('Celtic')} 
              className={`px-6 py-3 rounded-lg transition-all ${
                spreadType === 'Celtic' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Tirage Celtique
            </button>
          </div>

          {/* Draw Card Button */}
          <button 
            onClick={handleDrawCard}
            className="bg-purple-700 text-white px-8 py-4 rounded-xl 
              hover:bg-purple-800 transition-colors duration-300 
              transform hover:scale-105 active:scale-95 
              shadow-md hover:shadow-xl mb-6"
          >
            Tirer {spreadType === 'Single' ? 'une Carte' : 'les Cartes'}
          </button>

          {/* Single Card Display */}
          {drawnCard && (
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full animate-fade-in">
              <h2 className={`text-2xl font-bold mb-4 ${drawnCard.isReversed ? 'text-red-600' : 'text-green-600'}`}>
                {drawnCard.name} {drawnCard.isReversed && '(Inversé)'}
              </h2>
　　 　　 　 <div className="mb-6">
                <img 
                  src={drawnCard.imageUrl} 
                  alt={drawnCard.name} 
                  className={`w-full h-80 object-cover rounded-xl shadow-lg ${drawnCard.isReversed ? 'transform rotate-180' : ''}`}
                  onError={(e) => {
                    console.error('Image load error:', e);
                    console.error('Image source:', drawnCard.imageUrl);
                  }}
                />
              </div>
　　 　　 　 <div className="text-gray-700">
                <p className="font-semibold mb-2">Mots-clés : {drawnCard.keywords.join(', ')}</p>
                <p className="mb-4">{drawnCard.isReversed ? drawnCard.reversedDescription : drawnCard.description}</p>
              </div>
            </div>
          )}

          {/* Spread Display */}
          {drawnSpread && (
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-4xl w-full animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
                {spreadType === 'ThreePast' ? 'Passé, Présent, Futur' : 'Tirage de la Croix Celtique'}
              </h2>
　　 　　 　 <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                {drawnSpread.cards.map((card, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img 
                      src={card.imageUrl} 
                      alt={card.name} 
                      className={`w-full h-40 object-cover rounded-lg shadow-md 
                        ${card.isReversed ? 'transform rotate-180' : ''}`}
                      onError={(e) => {
                        console.error(`Spread Card ${index} Image load error:`, e);
                        console.error(`Spread Card ${index} Image source:`, card.imageUrl);
                      }}
                    />
                    <p className={`mt-2 text-sm text-center ${card.isReversed ? 'text-red-600' : 'text-green-600'}`}>
                      {card.name} {card.isReversed && '(Inv)'}
                    </p>
                  </div>
                ))}
              </div>

              {drawnSpread.interpretation && (
                <div className="mt-8 p-6 bg-purple-50 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 text-purple-900">Interprétation</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{drawnSpread.interpretation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chemins Spirituels */}
        <div className="mt-12 bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 mb-8 text-center">
            Chemins Spirituels
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {spiritualPaths.map(path => (
              <div key={path.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden
                  flex flex-col h-[600px]" // Augmenté la hauteur de 500px à 600px
              >
                <div className={`p-6 bg-gradient-to-br ${path.color} text-white flex-shrink-0`}>
                  <div className="flex items-center justify-center mb-4 h-16">
                    <div className="w-12 h-12">
                      {path.icon()}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 h-8 flex items-center justify-center">
                    {path.title}
                  </h3>
                  <p className="text-sm opacity-90 text-center h-20 overflow-hidden">
                    {path.description}
                  </p>
                </div>
                
                <div className="p-6 bg-white flex flex-col h-full justify-between"> {/* Ajout de h-full */}
                  <ul className="space-y-2 mb-6"> {/* Augmenté mb-4 à mb-6 */}
                    {path.details.map(detail => (
                      <li key={detail} className="flex items-start text-gray-700 py-2">
                        <span className="mr-2 text-orange-500 font-bold">•</span>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4"> {/* Conteneur pour le bouton */}
                    <button 
                      onClick={() => navigateToGame(path.id)}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-lg
                        hover:from-orange-600 hover:to-pink-600 transform hover:-translate-y-0.5 
                        transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                    >
                      Commencer le Voyage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jeu actif */}
        {activeGame && (
          <div className="mt-12 bg-white shadow-2xl rounded-2xl overflow-hidden">
            {personalizedWelcome && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold text-center animate-fade-in">
                  {personalizedWelcome}
                </h2>
              </div>
            )}
            
            <div className="p-8">
              {React.createElement(
                spiritualPaths.find(path => path.id === activeGame)?.game, 
                { formData }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;