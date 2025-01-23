import React from 'react';

export type PersonalAnalysis = {
  summary: string;
  insights: string[];
  recommendations: string[];
  personalStrengths: string[];
  growthAreas: string[];
};

export type GameResponses = {
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

export type GameState = {
  [K in keyof GameResponses]: {
    questions: string[];
    userAnswers: string[];
    currentAnswer: string;
    isCompleted: boolean;
    personalAnalysis?: PersonalAnalysis;
  }
};

export interface SpiritualPath {
  id: string;
  title: string;
  type: string;
  icon: () => string;
  color: string;
  description: string;
  details: string[];
  game?: React.ComponentType<{ formData: any }>;
}
