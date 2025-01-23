import React from 'react';

export const EnneagramDescription = () => (
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
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 5l-8-4 8-4 8 4-8 4z" />
          <path
            d="M2 17l10 5 10-5M2 12l10 5 10-5v-10l-10 5 10 5z"
            fillOpacity=".3"
          />
        </svg>
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-3">
          L'Ennéagramme : Un Voyage Intérieur
        </p>
        <p className="text-gray-700 leading-relaxed w-full text-justify">
          L'Ennéagramme est un système de personnalité profond qui va au-delà des simples classifications. 
          Il révèle les motivations profondes, les mécanismes de défense et les potentiels de croissance de chaque individu. 
          Composé de 9 types distincts, l'Ennéagramme offre une carte nuancée de la personnalité humaine, 
          permettant une compréhension authentique de soi et des autres.
        </p>
      </div>
    </div>
  </div>
);

export default EnneagramDescription;
