"use client";

import SpiritualPaths from "./components/SpiritualPaths";
import NumerologyDescription from "./components/NumerologyDescription";
import EnneagramDescription from "./components/EnneagramDescription";
import EnneagramTypes, { EnneagramType } from "./components/EnneagramTypes"; 
import {
  ReactNode,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  memo,
  FormEvent,
  useCallback,
  useMemo,
} from "react";
import React from "react";
import NumerologyForm from "./components/NumerologyForm"; 
import { generateSpiritualPath } from "../utils/spiritualPaths"; 
import TarotDrawSection from "./components/TarotDrawSection"; 
import NumerologyResults from './components/NumerologyResults'; 
import { drawTarotCard, drawTarotSpread } from "../utils/cartomancy"; 
import MindfulnessGame from "./components/games/MindfulnessGame"; 

// État global pour gérer l'hydratation
const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useLayoutEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
};
import {
  calculateLifePath,
  calculateExpressionNumber,
  getZodiacSign,
} from "../utils/numerology";
import {
  generatePredictions,
  Prediction,
  PredictionResult,
} from "../utils/predictions";
import {
  analyzePersonalityTraits,
  generateLifeInsights,
  generateIntroDescription,
  analyzePersonalResponses,
  generateContextualQuestions,
  personalizeWelcome,
  generatePersonalizedText, 
} from "../utils/huggingface";
import toast from "react-hot-toast";
import {
  Icons, 
  IconType 
} from "./components/Icons";
import {
  defaultQuestions,
  spiritualPathQuestionPrompts,
  parseQuestions,
} from "./components/questions";
import Image from "next/image";

const Home = () => {
  const hasMounted = useHasMounted();
  const [gameStates, setGameStates] = useState({
    mindfulness: {
      questions: defaultQuestions.mindfulness,
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
      currentQuestionIndex: 0, // Initialiser explicitement
    },
    emotionalIntelligence: {
      questions: defaultQuestions.emotionalIntelligence,
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
      currentQuestionIndex: 0, // Initialiser explicitement
    },
    personalGrowth: {
      questions: defaultQuestions.personalGrowth,
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
      currentQuestionIndex: 0, // Initialiser explicitement
    },
    spiritualAwakening: {
      questions: defaultQuestions.spiritualAwakening,
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
      currentQuestionIndex: 0, // Initialiser explicitement
    },
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    birthtime: "",
    birthplace: "",
    gender: "male",
    email: "",
    lifeAspect: "",
    enneagramType: "3",
  });

  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [personalityTraits, setPersonalityTraits] = useState<any[]>([]);
  const [lifeInsights, setLifeInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // États pour gérer les descriptions
  const [showNumeroDescription, setShowNumeroDescription] = useState(true);

  // État pour gérer le jeu actif
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Nouveau type pour stocker les réponses de tous les jeux
  const [gameResponses, setGameResponses] = useState({
    mindfulness: {
      questions: [],
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
    },
    emotionalIntelligence: {
      questions: [],
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
    },
    personalGrowth: {
      questions: [],
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
    },
    spiritualAwakening: {
      questions: [],
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
    },
  });

  const [personalizedWelcome, setPersonalizedWelcome] = useState("");

  const [isNumerologyDetailsOpen, setIsNumerologyDetailsOpen] = useState(false);

  // Type pour les cartes de tarot
  type Card = {
    name: string;
    imageUrl: string;
    keywords: string[];
    description: string;
    reversedDescription: string;
    isReversed: boolean;
  };

  type DrawnSpread = {
    cards: Card[];
    interpretation?: string;
  };

  // États pour le tirage de cartes de tarot
  const [drawnCard, setDrawnCard] = useState<Card | null>(null);
  const [drawnSpread, setDrawnSpread] = useState<DrawnSpread | null>(null);
  const [spreadType, setSpreadType] = useState<"Single" | "ThreePast" | "Celtic">("Single");
  const [showTarotDescription, setShowTarotDescription] = useState(true);

  const updateGameState = (gameType: string, updates: any) => {
    console.log('updateGameState called', { gameType, updates });
    console.log('Current gameStates:', gameStates);
    
    setGameStates((prev) => {
      const newGameStates = {
        ...prev,
        [gameType]: {
          ...prev[gameType],
          ...updates,
        },
      };
      
      console.log('New gameStates:', newGameStates);
      return newGameStates;
    });
  };

  const setCurrentGameAnswer = useCallback(
    (gameType: string, answer: string) => {
      console.log(`Setting current answer for ${gameType}:`, answer);
      
      setGameStates(prevStates => {
        const newStates = {
          ...prevStates,
          [gameType]: {
            ...prevStates[gameType],
            currentAnswer: answer.trim() // Toujours trimmer
          }
        };
        
        console.log('Updated game states:', newStates);
        return newStates;
      });
    },
    [setGameStates]
  );

  const navigateToGame = (gameId: string) => {
    // Mapper les ID aux types de jeux
    const gameTypeMap: { [key: string]: string } = {
      mindfulness: "mindfulness",
      "emotional-intelligence": "emotionalIntelligence",
      "personal-growth": "personalGrowth",
      "spiritual-awakening": "spiritualAwakening",
    };

    const gameType = gameTypeMap[gameId];

    if (!gameType) {
      console.error(`Type de jeu inconnu pour l'ID : ${gameId}`);
      return;
    }

    // Réinitialiser le jeu spécifique
    updateGameState(gameType, {
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
    });

    // Démarrer le nouveau jeu
    startNewGame(gameType);
  };

  const addUserAnswer = (gameType: string, answer: string) => {
    console.log('addUserAnswer called', { gameType, answer });
    updateGameState(gameType, {
      userAnswers: [...gameStates[gameType].userAnswers, answer],
      currentAnswer: "", // Réinitialiser la réponse courante
    });
  };

  const completeGame = async (gameType: string) => {
    console.log(`🔍 Début de completeGame pour ${gameType}`, {
      gameStates: JSON.parse(JSON.stringify(gameStates)),
      currentGameState: JSON.parse(JSON.stringify(gameStates[gameType]))
    });

    try {
      const currentGameState = gameStates[gameType];
      const userAnswers = currentGameState.userAnswers || [];

      console.log('📋 Réponses utilisateur avant génération:', {
        gameType,
        userAnswers,
        answersCount: userAnswers.length
      });

      // Vérification des réponses
      if (!userAnswers || userAnswers.length === 0) {
        console.warn('⚠️ Aucune réponse trouvée pour générer la synthèse');
        toast.error('Veuillez répondre à toutes les questions');
        return;
      }

      // Générer la description personnalisée
      const personalDescription = await generateIntroDescription(
        `${formData.firstName || 'Utilisateur'} ${formData.lastName || ''}`
      );
      console.log('🌈 Description personnalisée générée:', personalDescription);

      // Générer l'analyse personnalisée
      const personalAnalysisPrompt = `Analyse personnelle basée sur ces réponses : ${userAnswers.join('. ')}. 
      Prénom: ${formData.firstName}. 
      Nom: ${formData.lastName}. 
      Type de jeu: ${gameType}. 
      Génère une analyse profonde et bienveillante.`;

      console.log('🤖 Prompt pour génération de texte:', personalAnalysisPrompt);

      const personalAnalysis = await generatePersonalizedText(personalAnalysisPrompt, {
        temperature: 0.7,
        maxTokens: 300
      });

      console.log('📊 Analyse personnalisée générée:', {
        length: personalAnalysis.length,
        preview: personalAnalysis.substring(0, 100) + '...',
        isAIGenerated: personalAnalysis.length > 50
      });

      // Vérification de la génération de l'analyse
      if (!personalAnalysis || personalAnalysis.trim().length < 50) {
        console.warn('⚠️ Analyse générée trop courte ou vide');
        toast.error('Impossible de générer une analyse complète');
        return;
      }

      // Mise à jour du state avec l'analyse
      updateGameState(gameType, {
        ...currentGameState,
        personalAnalysis,
        personalDescription,
        isCompleted: true
      });

      console.log('✅ Jeu terminé avec succès', {
        gameType,
        personalAnalysisLength: personalAnalysis.length
      });

      toast.success('Votre analyse personnelle est prête !');

    } catch (error) {
      console.error('❌ Erreur lors de la complétion du jeu:', error);
      toast.error('Une erreur est survenue lors de la génération de votre analyse');
    }
  };

  const EmotionalIntelligenceGame = memo(
    ({ formData }: { formData: any }) => {
      const gameType: string = "emotionalIntelligence";

      const { questions, userAnswers, currentAnswer, isCompleted } =
        gameStates[gameType];
      const currentQuestionIndex = userAnswers.length;

      const handleCurrentAnswerChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;
          updateGameState(gameType, {
            questions,
            userAnswers,
            currentAnswer: value,
            isCompleted,
          });
        },
        [gameType]
      );

      const generateQuestions = useCallback(async () => {
        try {
          const newQuestions = await generatePersonalizedText(
            spiritualPathQuestionPrompts[gameType].basePrompt(formData),
            spiritualPathQuestionPrompts[gameType].aiParams
          );

          console.log("Generated Content:", newQuestions);

          const parsedQuestions = parseQuestions(newQuestions, gameType);

          updateGameState(gameType, {
            questions: parsedQuestions,
          });
        } catch (error) {
          console.error("Erreur de génération de questions:", error);
          updateGameState(gameType, {
            questions: defaultQuestions[gameType],
          });
        }
      }, [formData, gameType]);

      const handleNextQuestion = useCallback(() => {
        if (currentAnswer.trim()) {
          addUserAnswer(gameType, currentAnswer);
          setCurrentGameAnswer(gameType, "");

          if (currentQuestionIndex + 1 >= questions.length) {
            completeGame(gameType);
          }
        } else {
          toast.error("Veuillez répondre à la question avant de continuer");
        }
      }, [currentAnswer, currentQuestionIndex, questions.length, gameType]);

      useEffect(() => {
        if (!questions.length) {
          generateQuestions();
        }
      }, [formData, generateQuestions, questions.length]);

      if (isCompleted) {
        return (
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Jeu d'Intelligence Émotionnelle Terminé
            </h3>
            <p className="text-green-600">
              Vous avez répondu à toutes les questions. Votre analyse est en
              cours de génération.
            </p>
          </div>
        );
      }

      if (!questions.length) {
        return (
          <p className="text-gray-500 text-center">
            Génération des questions...
          </p>
        );
      }

      return (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Voyage d'Intelligence Émotionnelle
            </h2>

            {questions[currentQuestionIndex] && (
              <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
                <p className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                  {questions[currentQuestionIndex]}
                </p>

                <textarea
                  value={currentAnswer}
                  onChange={handleCurrentAnswerChange}
                  placeholder={
                    currentAnswer
                      ? ""
                      : "Prenez un moment pour réfléchir et partagez vos pensées..."
                  }
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
                    ${
                      currentAnswer.trim()
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {currentQuestionIndex + 1 < questions.length
                      ? "Question Suivante"
                      : "Terminer le Voyage"}
                  </button>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="font-medium">
                      {currentQuestionIndex + 1}
                    </span>
                    <span>/</span>
                    <span>{questions.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.formData === nextProps.formData
  );

  const PersonalGrowthGame = memo(
    ({ formData }: { formData: any }) => {
      const gameType: string = "personalGrowth";

      const { questions, userAnswers, currentAnswer, isCompleted } =
        gameStates[gameType];
      const currentQuestionIndex = userAnswers.length;

      const handleCurrentAnswerChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;
          updateGameState(gameType, {
            questions,
            userAnswers,
            currentAnswer: value,
            isCompleted,
          });
        },
        [gameType]
      );

      const generateQuestions = useCallback(async () => {
        try {
          const newQuestions = await generatePersonalizedText(
            spiritualPathQuestionPrompts[gameType].basePrompt(formData),
            spiritualPathQuestionPrompts[gameType].aiParams
          );

          console.log("Generated Content:", newQuestions);

          const parsedQuestions = parseQuestions(newQuestions, gameType);

          updateGameState(gameType, {
            questions: parsedQuestions,
          });
        } catch (error) {
          console.error("Erreur de génération de questions:", error);
          updateGameState(gameType, {
            questions: defaultQuestions[gameType],
          });
        }
      }, [formData, gameType]);

      const handleNextQuestion = useCallback(() => {
        if (currentAnswer.trim()) {
          addUserAnswer(gameType, currentAnswer);
          setCurrentGameAnswer(gameType, "");

          if (currentQuestionIndex + 1 >= questions.length) {
            completeGame(gameType);
          }
        } else {
          toast.error("Veuillez répondre à la question avant de continuer");
        }
      }, [currentAnswer, currentQuestionIndex, questions.length, gameType]);

      useEffect(() => {
        if (!questions.length) {
          generateQuestions();
        }
      }, [formData, generateQuestions, questions.length]);

      if (isCompleted) {
        return (
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Jeu de Développement Personnel Terminé
            </h3>
            <p className="text-green-600">
              Vous avez répondu à toutes les questions. Votre analyse est en
              cours de génération.
            </p>
          </div>
        );
      }

      if (!questions.length) {
        return (
          <p className="text-gray-500 text-center">
            Génération des questions...
          </p>
        );
      }

      return (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-6">
              Voyage de Développement Personnel
            </h2>

            {questions[currentQuestionIndex] && (
              <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
                <p className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                  {questions[currentQuestionIndex]}
                </p>

                <textarea
                  value={currentAnswer}
                  onChange={handleCurrentAnswerChange}
                  placeholder={
                    currentAnswer
                      ? ""
                      : "Prenez un moment pour réfléchir et partagez vos pensées..."
                  }
                  className="w-full p-4 min-h-[150px] border-2 border-orange-100 rounded-xl
                  focus:ring-2 focus:ring-orange-400 focus:border-transparent
                  text-gray-700 placeholder-gray-400
                  transition-all duration-300 ease-in-out
                  resize-y"
                />

                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={handleNextQuestion}
                    disabled={!currentAnswer.trim()}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300
                    ${
                      currentAnswer.trim()
                        ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {currentQuestionIndex + 1 < questions.length
                      ? "Question Suivante"
                      : "Terminer le Voyage"}
                  </button>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="font-medium">
                      {currentQuestionIndex + 1}
                    </span>
                    <span>/</span>
                    <span>{questions.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.formData === nextProps.formData
  );

  const SpiritualAwakeningGame = memo(
    ({ formData }: { formData: any }) => {
      const gameType: string = "spiritualAwakening";

      const { questions, userAnswers, currentAnswer, isCompleted } =
        gameStates[gameType];
      const currentQuestionIndex = userAnswers.length;
      const [isLoading, setIsLoading] = useState(false);

      const handleCurrentAnswerChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;
          updateGameState(gameType, {
            questions,
            userAnswers,
            currentAnswer: value,
            isCompleted,
          });
        },
        [gameType]
      );

      const generateQuestions = useCallback(async () => {
        setIsLoading(true);
        try {
          const newQuestions = await generatePersonalizedText(
            spiritualPathQuestionPrompts[gameType].basePrompt(formData),
            spiritualPathQuestionPrompts[gameType].aiParams
          );

          console.log("Generated Content:", newQuestions);

          const parsedQuestions = parseQuestions(newQuestions, gameType);

          updateGameState(gameType, {
            questions: parsedQuestions,
          });
        } catch (error) {
          console.error("Erreur de génération de questions:", error);
          updateGameState(gameType, {
            questions: defaultQuestions[gameType],
          });
        } finally {
          setIsLoading(false);
        }
      }, [formData, gameType]);

      const handleNextQuestion = useCallback(() => {
        if (currentAnswer.trim()) {
          addUserAnswer(gameType, currentAnswer);
          setCurrentGameAnswer(gameType, "");

          if (currentQuestionIndex + 1 >= questions.length) {
            completeGame(gameType);
          }
        } else {
          toast.error("Veuillez répondre à la question avant de continuer");
        }
      }, [currentAnswer, currentQuestionIndex, questions.length, gameType]);

      useEffect(() => {
        if (!questions.length) {
          generateQuestions();
        }
      }, [formData, generateQuestions, questions.length]);

      if (isCompleted) {
        return (
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Jeu d'Éveil Spirituel Terminé
            </h3>
            <p className="text-green-600">
              Vous avez répondu à toutes les questions. Votre analyse est en
              cours de génération.
            </p>
          </div>
        );
      }

      if (!questions.length || isLoading) {
        return (
          <p className="text-gray-500 text-center">
            Génération des questions...
          </p>
        );
      }

      return (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
              Voyage d'Éveil Spirituel
            </h2>

            {questions[currentQuestionIndex] && (
              <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
                <p className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                  {questions[currentQuestionIndex]}
                </p>

                <textarea
                  value={currentAnswer}
                  onChange={handleCurrentAnswerChange}
                  placeholder={
                    currentAnswer
                      ? ""
                      : "Prenez un moment pour réfléchir et partagez vos pensées..."
                  }
                  className="w-full p-4 min-h-[150px] border-2 border-pink-100 rounded-xl
                  focus:ring-2 focus:ring-pink-400 focus:border-transparent
                  text-gray-700 placeholder-gray-400
                  transition-all duration-300 ease-in-out
                  resize-y"
                />

                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={handleNextQuestion}
                    disabled={!currentAnswer.trim()}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300
                    ${
                      currentAnswer.trim()
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {currentQuestionIndex + 1 < questions.length
                      ? "Question Suivante"
                      : "Terminer le Voyage"}
                  </button>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="font-medium">
                      {currentQuestionIndex + 1}
                    </span>
                    <span>/</span>
                    <span>{questions.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.formData === nextProps.formData
  );

  const spiritualPaths = [
    {
      id: "mindfulness",
      title: "Pleine Conscience",
      type: "1",
      icon: Icons.Mindfulness,
      color: "from-green-500 to-emerald-600",
      description:
        "Développez votre présence et votre conscience de l'instant.",
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

  const resetPredictions = () => {
    setPredictions(null);
    setPersonalityTraits([]);
    setLifeInsights("");
    setShowNumeroDescription(false);
  };

  const resetTarotDraws = () => {
    setShowTarotDescription(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const lifePath = calculateLifePath(formData.birthdate);
      const expressionNumber = calculateExpressionNumber(
        formData.firstName + " " + formData.lastName
      );
      const zodiacSign = getZodiacSign(formData.birthdate);

      // Generate predictions without cartomancy
      const generatedPredictions = await generatePredictions({
        lifePath,
        zodiacSign: zodiacSign,
        lifeAspect: formData.lifeAspect,
        enneagramType: formData.enneagramType,
        expressionNumber: expressionNumber,
        name: formData.firstName + " " + formData.lastName,
        birthDate: formData.birthdate,
        birthTime: formData.birthtime,
      });

      // Set predictions without cartomancy cards
      setPredictions({
        ...generatedPredictions,
        name: formData.firstName + " " + formData.lastName,
        lifePath,
        expressionNumber,
        zodiacSign,
      });

      // Personality and life insights
      const traits = await analyzePersonalityTraits(
        formData.firstName + " " + formData.lastName
      );
      setPersonalityTraits(traits);

      const insights = await generateLifeInsights({
        name: formData.firstName + " " + formData.lastName,
        birthdate: formData.birthdate,
        lifeAspect: formData.lifeAspect,
      });
      setLifeInsights(insights);
    } catch (error) {
      console.error("Erreur lors de la génération des prédictions:", error);
    } finally {
      setIsLoading(false);
      setShowNumeroDescription(false);
    }
  };

  const updateGameResponses = (gameType: string, newResponses: string[]) => {
    setGameResponses((prev) => ({
      ...prev,
      [gameType]: {
        ...prev[gameType],
        userAnswers: [...prev[gameType].userAnswers, ...newResponses],
      },
    }));
  };

  const startNewGame = (gameType: string) => {
    setActiveGame(gameType);

    // Utiliser les réponses précédentes du jeu si elles existent
    const previousResponses = gameResponses[gameType];

    if (previousResponses.userAnswers.length > 0) {
      // Générer des questions contextuelles basées sur les réponses précédentes
      generateContextualQuestions(
        gameType,
        previousResponses.userAnswers,
        formData.firstName + " " + formData.lastName
      ).then((content) => {
        const parsedQuestions = parseQuestions(content, gameType);
        updateGameState(gameType, {
          questions: parsedQuestions,
        });
        setCurrentGameAnswer(gameType, "");
      });
    } else {
      // Première fois pour ce jeu
      generatePersonalizedText(
        spiritualPathQuestionPrompts[gameType].basePrompt(formData),
        spiritualPathQuestionPrompts[gameType].aiParams
      ).then((content) => {
        const parsedQuestions = parseQuestions(content, gameType);
        updateGameState(gameType, {
          questions: parsedQuestions,
        });
        setCurrentGameAnswer(gameType, "");
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

  const generateMeditationGuide = async (
    userAnswers: string[]
  ): Promise<string> => {
    try {
      const meditationPrompt = [
        `Créer un guide de méditation personnalisé pour ${predictions.name}`,
        `Type Ennéagramme : ${formData.enneagramType}`,
        `Chemin de vie : ${predictions.lifePath}`,
        `La méditation doit être adaptée à sa personnalité et ses défis spécifiques.`,
      ];

      const meditationGuide = await generateMeditationGuide(meditationPrompt);

      return meditationGuide;
    } catch (error) {
      console.error("Erreur de génération du guide de méditation:", error);
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
    const [currentMeditationGuide, setCurrentMeditationGuide] = useState("");

    useEffect(() => {
      if (meditationGuide) {
        setCurrentMeditationGuide(meditationGuide);
        setIsMeditationModalOpen(true);
      }
    }, [meditationGuide]);

    // Composant de modal de méditation
    const MeditationModal = () =>
      isMeditationModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-900 p-8 rounded-xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-purple-200">
              Méditation Guidée
            </h3>
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
      ) : null;

    return { MeditationModal, openModal: () => setIsMeditationModalOpen(true) };
  };

  const startMeditation = (guide: string) => {
    // Logique pour démarrer une méditation
    console.log("Démarrage de la méditation :", guide);

    // Créer un état pour gérer la notification
    const [notification, setNotification] = useState<{
      message: string;
      type: "info" | "success" | "error";
    } | null>(null);

    // Fonction pour afficher la notification
    const showNotification = (
      message: string,
      type: "info" | "success" | "error" = "info"
    ) => {
      setNotification({ message, type });

      // Masquer la notification après 5 secondes
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    };

    // Afficher la notification de démarrage de méditation
    showNotification("Méditation en cours. Respirez profondément.", "info");

    // Composant de notification
    const Notification = () => {
      if (!notification) return null;

      const bgColorMap = {
        info: "bg-blue-500",
        success: "bg-green-500",
        error: "bg-red-500",
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

  const sharePersonalAnalysis = (personalAnalysis: any, gameType: string) => {
    // Vérifier si le navigateur supporte l'API Web Share
    if (navigator.share) {
      try {
        navigator.share({
          title: `Mon analyse personnelle - ${gameType}`,
          text: `Voici mon analyse personnelle pour le jeu ${gameType}:\n\nRésumé: ${
            personalAnalysis.summary
          }\n\nPoints forts: ${personalAnalysis.personalStrengths.join(
            ", "
          )}\n\nAxes de croissance: ${personalAnalysis.growthAreas.join(
            ", "
          )}\n\nRecommandations: ${personalAnalysis.recommendations.join(
            ", "
          )}`,
        });
      } catch (error) {
        console.error("Erreur lors du partage:", error);
        // Afficher un message à l'utilisateur si le partage échoue
        alert("Impossible de partager l'analyse pour le moment.");
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      // Copier dans le presse-papiers
      const analysisText = `Mon analyse personnelle - ${gameType}\n\nRésumé: ${
        personalAnalysis.summary
      }\n\nPoints forts: ${personalAnalysis.personalStrengths.join(
        ", "
      )}\n\nAxes de croissance: ${personalAnalysis.growthAreas.join(
        ", "
      )}\n\nRecommandations: ${personalAnalysis.recommendations.join(", ")}`;

      navigator.clipboard
        .writeText(analysisText)
        .then(() => {
          alert("Analyse copiée dans le presse-papiers !");
        })
        .catch((err) => {
          console.error("Erreur de copie:", err);
          alert("Impossible de copier l'analyse.");
        });
    }
  };

  const resetGame = (gameType: string) => {
    // Réinitialiser l'état du jeu spécifique en utilisant updateGameState
    updateGameState(gameType, {
      questions: defaultQuestions[gameType],
      userAnswers: [],
      currentAnswer: "",
      isCompleted: false,
      personalAnalysis: undefined,
    });

    // Réinitialiser le type de jeu actuel
    setActiveGame(null);
  };

  // Méthode de navigation pour les parcours spirituels
  const navigateToSpiritualPath = (id: string) => {
    // Logique de navigation vers un parcours spirituel spécifique
    console.log(`Navigating to spiritual path: ${id}`);
    // Vous pouvez ajouter ici la logique de navigation réelle
  };

  // Helper function to render icon safely
  const renderIcon = (
    icon: string | (() => React.ReactNode)
  ): React.ReactNode => {
    if (typeof icon === "function") {
      return icon();
    }
    return icon;
  };

  const handleCompleteGame = async (gameType: string) => {
    console.log('handleCompleteGame called for:', gameType);
    console.log('Current formData:', formData);
    console.log('Current predictions:', predictions);

    const userAnswers = gameStates[gameType].userAnswers;
    console.log('User answers:', userAnswers);

    // Vérifier si les prédictions existent
    if (!predictions || !predictions.name) {
      console.error('Predictions are missing or incomplete');
      toast.error('Veuillez compléter le formulaire avant de continuer');
      return;
    }

    // Générer un parcours spirituel
    const spiritualPath = await generateSpiritualPath(
      predictions.name,
      formData.enneagramType,
      predictions.lifePath,
      userAnswers
    );

    // Générer un guide de méditation
    const meditationGuide = await generateMeditationGuide([
      `Créer un guide de méditation personnalisé pour ${predictions.name}`,
      `Type Ennéagramme : ${formData.enneagramType}`,
      `Chemin de vie : ${predictions.lifePath}`,
      `Réponses spirituelles : ${userAnswers.join("; ")}`,
      `La méditation doit être adaptée à sa personnalité et ses défis spécifiques.`,
    ]);

    // Afficher le parcours spirituel et le guide de méditation
    console.log("Parcours spirituel :", spiritualPath);
    console.log("Guide de méditation :", meditationGuide);

    // Réinitialiser le jeu après avoir généré le parcours spirituel
    resetGame(gameType);
  };

  return (
    <div className="w-full px-0 sm:max-w-screen-2xl sm:mx-auto sm:px-4 py-8">
      <Image
        src="/logo.png"
        alt="Analyse Numéro Logo"
        width={200}
        height={100}
        className="mx-auto mb-6"
      />
      <div className="bg-white shadow-xl rounded-xl p-2">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Analyse Numérologique Avancée
        </h1>

        {/* Section Analyse Numérologique */}
        <div className="section numerology">
          <h2 className="text-2xl font-bold text-purple-800">
            Analyse Numérologique
          </h2>

          {/* Description qui disparaît après le premier calcul */}
          {showNumeroDescription && <NumerologyDescription />}
          {showNumeroDescription && <EnneagramDescription />}
          {showNumeroDescription && <EnneagramTypes />} 
          {/* Formulaire */}
          <NumerologyForm
            formData={formData}
            setFormData={setFormData}
            setPredictions={setPredictions}
            setPersonalityTraits={setPersonalityTraits}
            setLifeInsights={setLifeInsights}
            setIsLoading={setIsLoading}
            setShowNumeroDescription={setShowNumeroDescription}
          />

          {predictions && (
            <NumerologyResults
              predictions={predictions}
              personalityTraits={personalityTraits}
              lifeInsights={lifeInsights}
              resetPredictions={resetPredictions}
            />
          )}
        </div>

       {/* Section Tirage de Tarot */}
       <div className="mt-8 bg-purple-50 p-6 rounded-xl">

          {/* Description qui disparaît après le premier tirage */}
          {showTarotDescription && (
            <div
              className="section-description 
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
                  <svg
                    className="w-10 h-10 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM9.29 13.29c.39.39 1.02.39 1.41 0l.29-.29.29.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.41 11l.29-.29c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l.29.29-.29.29c-.39.39-.39 1.02 0 1.41z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    Votre Miroir Intérieur
                  </p>
                  <p className="text-gray-700 leading-relaxed w-full text-justify">
                    Le Tirage de Cartes de Tarot est bien plus qu'une simple
                    divination. C'est un miroir symbolique qui vous aide à
                    explorer vos pensées, vos émotions et vos intuitions. Chaque
                    carte est comme une fenêtre ouverte sur votre monde
                    intérieur, révélant des perspectives que votre conscience
                    immédiate n'aperçoit pas toujours.
                  </p>
                </div>
              </div>
            </div>
          )}

          <TarotDrawSection
            resetTarotDraws={() => {
              setDrawnCard(null);
              setDrawnSpread(null);
              setShowTarotDescription(false);
            }}
            handleDrawCard={() => {
              if (spreadType === "Single") {
                const card = drawTarotCard();
                setDrawnCard(card);
                setDrawnSpread(null);
              } else {
                const spread = drawTarotSpread(spreadType);
                setDrawnSpread(spread);
                setDrawnCard(null);
              }
              setShowTarotDescription(false);
            }}
            drawnCard={drawnCard}
            drawnSpread={drawnSpread}
            showTarotDescription={showTarotDescription}
            spreadType={spreadType}
            setSpreadType={setSpreadType}
          />
        </div>

        {/* Chemins Spirituels */}
        <div className="mt-12 bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-2xl shadow-xl">
          <SpiritualPaths navigateToGame={navigateToGame} />
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
              {activeGame === "mindfulness" && (
                <MindfulnessGame
                  formData={formData}
                  gameStates={gameStates}
                  setGameStates={setGameStates}
                  updateGameState={updateGameState}
                  addUserAnswer={addUserAnswer}
                  setCurrentGameAnswer={setCurrentGameAnswer}
                  completeGame={(gameType) => {
                    setGameStates((prev) => ({
                      ...prev,
                      [gameType]: {
                        ...prev[gameType],
                        isCompleted: true
                      }
                    }));
                  }}
                />
              )}
              {activeGame === "emotionalIntelligence" && (
                <EmotionalIntelligenceGame formData={formData} />
              )}
              {activeGame === "personalGrowth" && (
                <PersonalGrowthGame formData={formData} />
              )}
              {activeGame === "spiritualAwakening" && (
                <SpiritualAwakeningGame formData={formData} />
              )}
            </div>
            <button
              onClick={() => handleCompleteGame(activeGame)}
              className="bg-purple-700 text-white px-8 py-4 rounded-xl 
                hover:bg-purple-800 transition-colors duration-300 
                transform hover:scale-105 active:scale-95 
                shadow-md hover:shadow-xl mb-6"
            >
              Terminer le Voyage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
