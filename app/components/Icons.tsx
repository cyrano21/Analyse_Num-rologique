import React from 'react';

export type IconType = keyof typeof Icons;

// Icônes personnalisées SVG
export const Icons = {
  '1': () => '✔️',
  '2': () => '❤️',
  '3': () => '🏆',
  '4': () => '🎨',
  '5': () => '🔬',
  '6': () => '🛡️',
  '7': () => '🌈',
  '8': () => '💪',
  '9': () => '☮️',
  
  // Add mapping for legacy names
  Mindfulness: () => Icons['1'](),
  EmotionalIntelligence: () => Icons['2'](),
  PersonalGrowth: () => Icons['3'](),
  SpiritualAwakening: () => Icons['9'](),

  // Ajout des nouvelles icônes
  Love: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  Career: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
    </svg>
  ),
  Tarot: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-7h2v4h-2zm0-4h2v2h-2z"/>
    </svg>
  )
};
