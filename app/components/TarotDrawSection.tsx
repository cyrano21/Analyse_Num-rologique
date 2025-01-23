import React, { useState } from "react";
import { drawTarotCard, drawTarotSpread } from "../../utils/cartomancy";

type SpreadType = "Single" | "ThreePast" | "Celtic";

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

type TarotDrawSectionProps = {
  resetTarotDraws: () => void;
  handleDrawCard: () => void;
  drawnCard?: Card | null;
  drawnSpread?: DrawnSpread | null;
  showTarotDescription: boolean;
  spreadType?: SpreadType;
  setSpreadType?: (type: SpreadType) => void;
};

const TarotDrawSection: React.FC<TarotDrawSectionProps> = ({
  resetTarotDraws,
  handleDrawCard,
  drawnCard,
  drawnSpread,
  showTarotDescription,
  spreadType: propSpreadType,
  setSpreadType: propSetSpreadType
}) => {
  const [localSpreadType, setLocalSpreadType] = useState<SpreadType>("Single");
  const spreadType = propSpreadType ?? localSpreadType;
  const setSpreadType = propSetSpreadType ?? setLocalSpreadType;

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-3xl 
      shadow-2xl border border-purple-100/50 selection:bg-purple-300 selection:text-purple-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text 
          bg-gradient-to-r from-purple-700 to-indigo-600 drop-shadow-lg">
          Tirage de Cartes de Tarot
        </h2>
        {(drawnCard || drawnSpread) && (
          <button
            onClick={resetTarotDraws}
            className="group relative px-6 py-3 overflow-hidden rounded-full 
              bg-red-500 text-white 
              hover:bg-red-600 transition-all duration-300 
              transform hover:scale-105 active:scale-95 
              shadow-xl hover:shadow-2xl"
          >
            <span className="relative z-10">Réinitialiser</span>
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </button>
        )}
      </div>

      {showTarotDescription && (
        <div
          className="section-description 
          bg-white/80 backdrop-blur-lg
          border border-purple-100/50
          p-6 
          rounded-3xl 
          shadow-xl
          mb-6 
          animate-fade-in 
          hover:shadow-2xl 
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

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6 
        bg-purple-100 p-2 rounded-full shadow-inner">
        {["Single", "ThreePast", "Celtic"].map((type) => (
          <button
            key={type}
            onClick={() => setSpreadType && setSpreadType(type as SpreadType)}
            className={`px-6 py-3 rounded-full transition-all duration-300 
              ${
                spreadType === type
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-transparent text-purple-800 hover:bg-purple-200 hover:scale-105"
              }`}
          >
            {type === "Single"
              ? "Carte Unique"
              : type === "ThreePast"
              ? "Passé, Présent, Futur"
              : "Tirage Celtique"}
          </button>
        ))}
      </div>

      <button
        onClick={handleDrawCard}
        className="group relative px-10 py-4 overflow-hidden rounded-full 
          bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
          hover:from-purple-700 hover:to-indigo-700 
          transition-all duration-300 
          transform hover:scale-105 active:scale-95 
          shadow-xl hover:shadow-2xl mb-6"
      >
        <span className="relative z-10">
          Tirer {spreadType === "Single" ? "une Carte" : "les Cartes"}
        </span>
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity"></span>
      </button>

      {/* Single Card Display */}
      {drawnCard && (
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 max-w-md w-full 
          animate-fade-in border border-purple-100 hover:border-purple-300 transition-all">
          <h2
            className={`text-2xl font-bold mb-4 ${
              drawnCard.isReversed ? "text-red-600" : "text-green-600"
            }`}
          >
            {drawnCard.name} {drawnCard.isReversed && "(Inversé)"}
          </h2>
          <div className="mb-6">
            <img
              src={drawnCard.imageUrl}
              alt={drawnCard.name}
              className={`w-full h-80 object-cover rounded-xl shadow-lg ${
                drawnCard.isReversed ? "transform rotate-180" : ""
              }`}
              onError={(e) => {
                console.error("Image load error:", e);
                console.error("Image source:", drawnCard.imageUrl);
              }}
            />
          </div>
          <div className="text-gray-700">
            <p className="font-semibold mb-2">
              Mots-clés : {drawnCard.keywords.join(", ")}
            </p>
            <p className="mb-4">
              {drawnCard.isReversed
                ? drawnCard.reversedDescription
                : drawnCard.description}
            </p>
          </div>
        </div>
      )}

      {/* Spread Display */}
      {drawnSpread && (
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 max-w-4xl w-full 
          animate-fade-in border border-purple-100 hover:border-purple-300 transition-all">
          <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
            {spreadType === "ThreePast"
              ? "Passé, Présent, Futur"
              : "Tirage de la Croix Celtique"}
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
            {drawnSpread.cards.map((card, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className={`w-full h-40 object-cover rounded-lg shadow-md 
                    ${card.isReversed ? "transform rotate-180" : ""}`}
                  onError={(e) => {
                    console.error(
                      `Spread Card ${index} Image load error:`,
                      e
                    );
                    console.error(
                      `Spread Card ${index} Image source:`,
                      card.imageUrl
                    );
                  }}
                />
                <p className="mt-2 text-xs text-center">
                  {card.name} {card.isReversed && "(Inversé)"}
                </p>
              </div>
            ))}
          </div>
          {drawnSpread.interpretation && (
            <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200 shadow-md">
              <div className="flex items-center mb-3">
                <svg 
                  className="w-8 h-8 mr-3 text-purple-600" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm5.684 7.444l-6.789 6.789a1 1 0 01-1.414 0l-3.211-3.211a1 1 0 111.414-1.414l2.504 2.504 6.082-6.082a1 1 0 011.414 1.414z"/>
                </svg>
                <h3 className="text-xl font-bold text-purple-800">
                  Interprétation du Tirage
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap 
                bg-white p-4 rounded-lg 
                border border-purple-100 
                shadow-inner
                transition-all duration-300 
                hover:shadow-lg">
                {drawnSpread.interpretation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TarotDrawSection;
