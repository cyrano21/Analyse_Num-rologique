import React, { memo, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { generatePersonalizedText } from "../../../utils/huggingface";
import { parseQuestions, defaultQuestions, spiritualPathQuestionPrompts } from "../questions";

interface SpiritualAwakeningGameProps {
  formData: any;
  gameStates: any;
  setGameStates: React.Dispatch<React.SetStateAction<any>>;
  updateGameState: (gameType: string, updates: any) => void;
  addUserAnswer: (gameType: string, answer: string) => void;
  setCurrentGameAnswer: (gameType: string, answer: string) => void;
  completeGame: (gameType: string) => void;
}

const SpiritualAwakeningGame: React.FC<SpiritualAwakeningGameProps> = memo(
  ({
    formData,
    gameStates,
    setGameStates,
    updateGameState,
    addUserAnswer,
    setCurrentGameAnswer,
    completeGame,
  }) => {
    const gameType = "spiritualAwakening";
    const { questions, userAnswers, currentAnswer, isCompleted } =
      gameStates[gameType];
    const currentQuestionIndex = userAnswers.length;
    const previousAnswerRef = useRef(currentAnswer);

    const handleCurrentAnswerChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setGameStates((prev) => ({
          ...prev,
          [gameType]: {
            ...prev[gameType],
            currentAnswer: value,
          },
        }));
      },
      [gameType, setGameStates]
    );

    const generateQuestions = useCallback(async () => {
      try {
        const newQuestions = await generatePersonalizedText(
          spiritualPathQuestionPrompts[gameType].basePrompt(formData),
          spiritualPathQuestionPrompts[gameType].aiParams
        );

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
            Jeu d'Éveil Spirituel Terminé
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
            Voyage d'Éveil Spirituel
          </h2>

          {questions[currentQuestionIndex] && (
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                {questions[currentQuestionIndex]}
              </p>
              <textarea
                value={currentAnswer}
                onChange={handleCurrentAnswerChange}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 min-h-[150px]"
                placeholder="Écrivez votre réponse ici..."
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  {currentQuestionIndex + 1 === questions.length
                    ? "Terminer"
                    : "Suivant"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default SpiritualAwakeningGame;
