export interface GameState {
  questions: string[];
  userAnswers: string[];
  currentAnswer: string;
  isCompleted: boolean;
}

export interface GameResponses {
  mindfulness: GameState;
  emotionalIntelligence: GameState;
  personalGrowth: GameState;
  spiritualAwakening: GameState;
}

// État initial des jeux
export const gameStates: GameResponses = {
  mindfulness: {
    questions: [],
    userAnswers: [],
    currentAnswer: '',
    isCompleted: false
  },
  emotionalIntelligence: {
    questions: [],
    userAnswers: [],
    currentAnswer: '',
    isCompleted: false
  },
  personalGrowth: {
    questions: [],
    userAnswers: [],
    currentAnswer: '',
    isCompleted: false
  },
  spiritualAwakening: {
    questions: [],
    userAnswers: [],
    currentAnswer: '',
    isCompleted: false
  }
};
