import React from "react";
import { Icons } from "./Icons";

const tarotDecks = [
  {
    id: "celtic-cross",
    title: "Croix Celtique",
    icon: Icons.Tarot,
    color: "from-purple-500 to-indigo-600",
    description: "Un tirage classique pour une analyse approfondie de votre situation.",
    details: [
      "10 cartes",
      "Analyse complète",
      "Perspectives multidimensionnelles"
    ]
  },
  {
    id: "love-spread",
    title: "Tirage Amour",
    icon: Icons.Love,
    color: "from-pink-500 to-red-600",
    description: "Un tirage spécialisé pour explorer vos relations et votre vie amoureuse.",
    details: [
      "6 cartes",
      "Insights sentimentaux",
      "Guidance relationnelle"
    ]
  },
  {
    id: "career-path",
    title: "Parcours Professionnel",
    icon: Icons.Career,
    color: "from-green-500 to-teal-600",
    description: "Un tirage pour éclairer votre trajectoire professionnelle.",
    details: [
      "5 cartes",
      "Opportunités de carrière",
      "Défis et potentiels"
    ]
  },
  {
    id: "personal-growth",
    title: "Développement Personnel",
    icon: Icons.PersonalGrowth,
    color: "from-orange-500 to-yellow-600",
    description: "Un tirage pour comprendre votre évolution personnelle.",
    details: [
      "7 cartes",
      "Insights de croissance",
      "Transformation personnelle"
    ]
  }
];

const TarotSection = ({
  navigateToGame,
}: {
  navigateToGame: (id: string) => void;
}) => {
  const renderIcon = (
    icon: string | (() => React.ReactNode)
  ): React.ReactNode => {
    if (typeof icon === "function") {
      return icon();
    }
    return icon;
  };

  return (
    <div className="mt-12 bg-gradient-to-br from-violet-50 to-indigo-50 p-8 rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-purple-200 via-indigo-100 to-blue-200 rotate-45 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 mb-10 text-center tracking-tight leading-tight">
          Explorez Vos Tirages de Tarot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tarotDecks.map((deck) => (
            <div
              key={deck.id}
              className="group relative transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${deck.color} rounded-2xl opacity-50 group-hover:opacity-75 blur-lg transition-all duration-300`}
              ></div>
              <div
                className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-transparent group-hover:border-purple-300 transition-all duration-300`}
              >
                <div
                  className={`p-6 bg-gradient-to-br ${deck.color} text-white flex-shrink-0 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex items-center justify-center mb-4 h-16 relative z-10">
                    <div className="w-16 h-16 transform group-hover:scale-110 transition-transform">
                      {renderIcon(deck.icon)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2 h-12 flex items-center justify-center relative z-10">
                    {deck.title}
                  </h3>
                  <p className="text-sm opacity-90 text-center h-20 overflow-hidden relative z-10">
                    {deck.description}
                  </p>
                </div>

                <div className="p-6 bg-white flex flex-col h-full justify-between">
                  <ul className="space-y-3 mb-6">
                    {deck.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start text-gray-700 py-2 group"
                      >
                        <span className="mr-3 text-purple-500 font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          ✦
                        </span>
                        <span className="text-sm transition-all group-hover:translate-x-2 group-hover:text-purple-600">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <button
                      onClick={() => navigateToGame(deck.id)}
                      className="w-full relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <div 
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 px-6 rounded-lg
                        hover:from-purple-600 hover:to-indigo-600 
                        transform hover:-translate-y-0.5 
                        transition-all duration-300 
                        font-semibold 
                        shadow-md 
                        hover:shadow-xl
                        flex items-center justify-center
                        space-x-2"
                      >
                        <span>Commencer le Tirage</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TarotSection;
