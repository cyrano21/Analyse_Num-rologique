import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { generatePersonalizedText } from "../../../utils/huggingface";
import {
  parseQuestions,
  defaultQuestions,
  spiritualPathQuestionPrompts,
} from "../questions";
import { useRouter } from "next/navigation";

interface MindfulnessGameProps {
  formData: any;
  gameStates: any;
  setGameStates: React.Dispatch<React.SetStateAction<any>>;
  updateGameState: (gameType: string, updates: any) => void;
  addUserAnswer: (gameType: string, answer: string) => void;
  setCurrentGameAnswer: (gameType: string, answer: string) => void;
  completeGame: (gameType: string) => void;
}

const MindfulnessGame: React.FC<MindfulnessGameProps> = memo(
  ({
    formData,
    gameStates,
    setGameStates,
    updateGameState,
    addUserAnswer,
    setCurrentGameAnswer,
    completeGame,
  }) => {
    console.log("MindfulnessGame props:", {
      formData,
      gameStates,
      setGameStates,
      updateGameState,
      addUserAnswer,
      setCurrentGameAnswer,
      completeGame,
    });

    const gameType = "mindfulness";
    const currentGameState = gameStates[gameType];

    const questions = useMemo(
      () => currentGameState.questions || defaultQuestions.mindfulness,
      [currentGameState.questions]
    );

    const [localState, setLocalState] = useState({
      currentQuestionIndex: currentGameState.currentQuestionIndex || 0,
      currentAnswer: currentGameState.currentAnswer || "",
      userAnswers: currentGameState.userAnswers || [],
      isCompleted: currentGameState.isCompleted || false,
    });

    const { currentQuestionIndex, currentAnswer, userAnswers, isCompleted } =
      localState;

    useEffect(() => {
      console.log("MindfulnessGame Component State:", {
        questions: questions.length,
        currentQuestionIndex,
        currentAnswer,
        userAnswers,
        isCompleted,
      });
    }, [currentQuestionIndex, currentAnswer, userAnswers, isCompleted]);

    const handleCurrentAnswerChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newAnswer = e.target.value;
        console.log("Current answer changing:", newAnswer);

        // Mettre à jour l'état local
        setLocalState((prev) => ({
          ...prev,
          currentAnswer: newAnswer,
        }));
      },
      []
    );

    const textareaPlaceholder = currentAnswer
      ? ""
      : "Écrivez votre réponse ici...";

    useEffect(() => {
      console.log("Textarea state:", {
        currentAnswer,
        placeholder: textareaPlaceholder,
      });
    }, [currentAnswer, textareaPlaceholder]);

    const generateQuestions = useCallback(async () => {
      try {
        console.log('🎲 MindfulnessGame - Initialisation des questions');
        console.log('🔢 Nombre de questions attendues:', questions);
        console.log('📊 Questions par défaut:', defaultQuestions.mindfulness);

        const personalizedQuestionsPrompt = spiritualPathQuestionPrompts[gameType].basePrompt(formData);
        console.log('🤖 Prompt de génération de questions:', personalizedQuestionsPrompt);

        const generatedQuestions = await generatePersonalizedText(
          personalizedQuestionsPrompt, 
          spiritualPathQuestionPrompts[gameType].aiParams
        );

        console.log('🌈 Questions générées brutes:', generatedQuestions);

        // Parser les questions générées
        const parsedQuestions = parseQuestions(generatedQuestions, gameType);
        console.log('✨ Questions parsées finales:', parsedQuestions);

        // Mettre à jour l'état avec les questions parsées
        if (parsedQuestions.length > 0) {
          updateGameState(gameType, {
            questions: parsedQuestions,
          });
        } else {
          console.warn('⚠️ Aucune question générée, utilisation des questions par défaut');
          updateGameState(gameType, {
            questions: defaultQuestions[gameType],
          });
        }
      } catch (error) {
        console.error('❌ Erreur lors de la génération des questions:', error);
        
        // Fallback aux questions par défaut en cas d'erreur
        updateGameState(gameType, {
          questions: defaultQuestions[gameType],
        });
      }
    }, [formData, gameType]);

    const handleNextQuestion = useCallback(async () => {
      console.log("handleNextQuestion - Début", {
        currentAnswer,
        currentQuestionIndex,
        questionsLength: questions.length,
        userAnswers,
      });

      if (!currentAnswer.trim()) {
        toast.error("Veuillez répondre à la question");
        return;
      }

      const newUserAnswers = [...userAnswers, currentAnswer.trim()];
      const newQuestionIndex = currentQuestionIndex + 1;

      console.log("handleNextQuestion - Avant mise à jour", {
        newUserAnswers,
        newQuestionIndex,
      });

      setLocalState((prev) => {
        const updatedState = {
          ...prev,
          userAnswers: newUserAnswers,
          currentAnswer: "",
          currentQuestionIndex: newQuestionIndex,
        };

        console.log("handleNextQuestion - État local mis à jour", updatedState);
        return updatedState;
      });

      // Mettre à jour le state global
      addUserAnswer(gameType, currentAnswer.trim());
      setCurrentGameAnswer(gameType, "");

      // Si c'est la dernière question, compléter le jeu
      if (newQuestionIndex === questions.length) {
        console.log(
          "Toutes les questions ont été répondues, appel de completeGame",
          {
            gameType,
            userAnswers: newUserAnswers,
          }
        );
        completeGame(gameType);
      }
    }, [
      currentAnswer,
      currentQuestionIndex,
      questions.length,
      userAnswers,
      addUserAnswer,
      setCurrentGameAnswer,
      completeGame,
    ]);

    useEffect(() => {
      if (!questions.length) {
        generateQuestions();
      }
    }, [formData, generateQuestions, questions.length]);

    useEffect(() => {
      if (currentQuestionIndex < questions.length) {
        // Réinitialiser la réponse courante à chaque nouvelle question
        setLocalState((prev) => ({
          ...prev,
          currentAnswer: "",
        }));
      }
    }, [currentQuestionIndex, questions.length]);

    useEffect(() => {
      console.log("Current game state:", {
        currentAnswer,
        currentQuestionIndex,
        questionsLength: questions.length,
      });
    }, [currentAnswer, currentQuestionIndex, questions.length]);

    const router = useRouter();

    if (isCompleted) {
      console.log(
        "🔍 Rendering personal analysis:",
        currentGameState.personalAnalysis
      );

      console.log("📊 Analyse Détaillée:", {
        gameType,
        isAnalysisPresent: !!currentGameState.personalAnalysis,
        analysisLength: currentGameState.personalAnalysis?.length,
        userAnswers: currentGameState.userAnswers,
        formData
      });

      // Vérification de la présence et de la validité de l'analyse
      const isValidAnalysis = 
        currentGameState.personalAnalysis && 
        currentGameState.personalAnalysis.trim().length > 50;

      const handleResetGame = () => {
        setLocalState({
          currentQuestionIndex: 0,
          currentAnswer: "",
          userAnswers: [],
          isCompleted: false,
        });
        updateGameState(gameType, {
          currentQuestionIndex: 0,
          currentAnswer: "",
          userAnswers: [],
          isCompleted: false,
          personalAnalysis: undefined,
        });
      };

      return (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          {isValidAnalysis ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-green-800">
                Votre Analyse Personnelle
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {currentGameState.personalAnalysis}
              </p>
            </div>
          ) : (
            <div className="text-yellow-600">
              <p>
                Désolé, l'analyse n'a pas pu être générée. Veuillez réessayer.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <p>Détails de débogage :</p>
                <pre>{JSON.stringify({
                  personalAnalysis: currentGameState.personalAnalysis,
                  userAnswers: currentGameState.userAnswers,
                  gameType
                }, null, 2)}</pre>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retour à l'accueil
          </button>
          <button
            onClick={handleResetGame}
            className="mt-6 ml-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      );
    }

    if (!questions.length) {
      return (
        <p className="text-gray-500 text-center">Génération des questions...</p>
      );
    }

    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Voyage de Pleine Conscience
          </h2>

          {questions[currentQuestionIndex] && (
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                {questions[currentQuestionIndex]}
              </p>
              <textarea
                value={currentAnswer}
                onChange={handleCurrentAnswerChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                rows={4}
                placeholder={textareaPlaceholder}
              />
              <div className="flex justify-end mt-4">
                <div className="flex items-center space-x-2 mr-4 text-gray-600">
                  <span className="font-medium">
                    {currentQuestionIndex + 1}
                  </span>
                  <span>/</span>
                  <span>5</span>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  {currentQuestionIndex + 1 === 5 ? "Terminer" : "Suivant"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MindfulnessGame;
