'use client';

import { useState } from 'react';
import { drawTarotCard, interpretTarotCard, TarotCard, drawTarotSpread } from '../../utils/cartomancy';

export default function CartomancyPage() {
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [spreadType, setSpreadType] = useState<'Single' | 'ThreePast' | 'Celtic'>('Single');
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [spreadInterpretation, setSpreadInterpretation] = useState<string>('');

  const handleDrawCard = () => {
    if (spreadType === 'Single') {
      const card = drawTarotCard();
      setDrawnCard(card);
      setDrawnCards([card]);
    } else {
      const spread = drawTarotSpread(spreadType);
      setDrawnCards(spread.cards);
      setSpreadInterpretation(spread.interpretation);
      setDrawnCard(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <h1 className="text-4xl font-bold text-center mb-12 text-purple-900">
        Tirage de Cartes de Tarot
      </h1>

      <div className="flex flex-col items-center space-y-8">
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setSpreadType('Single')} 
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              spreadType === 'Single' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
            }`}
          >
            Carte Unique
          </button>
          <button 
            onClick={() => setSpreadType('ThreePast')} 
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              spreadType === 'ThreePast' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
            }`}
          >
            Passé, Présent, Futur
          </button>
          <button 
            onClick={() => setSpreadType('Celtic')} 
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              spreadType === 'Celtic' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
            }`}
          >
            Tirage Celtique
          </button>
        </div>

        <button 
          onClick={handleDrawCard}
          className="bg-purple-700 text-white px-8 py-4 rounded-xl 
            hover:bg-purple-800 transition-colors duration-300 
            transform hover:scale-105 active:scale-95 
            shadow-md hover:shadow-xl"
        >
          Tirer {spreadType === 'Single' ? 'une Carte' : 'les Cartes'}
        </button>

        {drawnCard && (
          <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full animate-fade-in">
            <h2 className={`text-2xl font-bold mb-4 ${drawnCard.isReversed ? 'text-red-600' : 'text-green-600'}`}>
              {drawnCard.name} {drawnCard.isReversed ? '(Inversé)' : ''}
            </h2>
            
            <div className="mb-6">
              <img 
                src={drawnCard.imageUrl} 
                alt={drawnCard.name} 
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
            
            <div className="text-gray-700">
              <p className="font-semibold mb-2">Mots-clés : {drawnCard.keywords.join(', ')}</p>
              <p className="mb-4">{interpretTarotCard(drawnCard)}</p>
            </div>
          </div>
        )}

        {drawnCards.length > 1 && (
          <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-4xl w-full animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
              {spreadType === 'ThreePast' ? 'Passé, Présent, Futur' : 'Tirage de la Croix Celtique'}
            </h2>
            
            <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
              {drawnCards.map((card, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className={`w-full h-40 object-cover rounded-lg shadow-md 
                      ${card.isReversed ? 'transform rotate-180' : ''}`}
                  />
                  <p className={`mt-2 text-sm text-center ${card.isReversed ? 'text-red-600' : 'text-green-600'}`}>
                    {card.name} {card.isReversed ? '(Inv)' : ''}
                  </p>
                </div>
              ))}
            </div>

            {spreadInterpretation && (
              <div className="mt-8 p-6 bg-purple-50 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-purple-900">Interprétation</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{spreadInterpretation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
