import React from 'react';

export const NumerologyDescription = () => (
  <div
    className="section-description 
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
        <svg
          className="w-10 h-10 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM9.29 13.29c.39.39 1.02.39 1.41 0l.29-.29.29.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.41 11l.29-.29c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L12 9.59l-.29-.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l.29.29-.29.29c-.39.39-.39 1.02 0 1.41z"
          />
        </svg>
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-3">
          Découvrez la Magie des Nombres
        </p>
        <p className="text-gray-700 leading-relaxed w-full text-justify">
          L'Analyse Numérologique est une pratique fascinante qui explore la signification des nombres dans votre vie. 
          Chaque nombre, basé sur votre date de naissance et votre nom, raconte une histoire unique de votre personnalité, 
          de vos talents et de votre chemin de vie. Ce n'est pas de la magie, mais une méthode de découverte de soi 
          qui vous aide à mieux comprendre vos forces, vos défis et votre potentiel.
        </p>
      </div>
    </div>
  </div>
);

export default NumerologyDescription;
