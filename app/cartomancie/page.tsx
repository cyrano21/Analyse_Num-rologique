'use client';

import { useState } from 'react';
import { drawTarotCard, interpretTarotCard, TarotCard, drawTarotSpread } from '../../utils/cartomancy';
import TarotDrawSection from '../components/TarotDrawSection';

export default function CartomancyPage() {
  const [drawnCard, setDrawnCard] = useState<TarotCard & { interpretation?: string } | null>(null);
  const [drawnSpread, setDrawnSpread] = useState<{
    cards: (TarotCard & { interpretation?: string })[];
    interpretation: string;
  } | null>(null);
  const [showTarotDescription, setShowTarotDescription] = useState(true);
  const [spreadType, setSpreadType] = useState<'Single' | 'ThreePast' | 'Celtic'>('Single');

  const handleDrawCard = () => {
    if (spreadType === 'Single') {
      const card = drawTarotCard();
      const interpretation = interpretTarotCard(card);
      setDrawnCard({...card, interpretation});
      setDrawnSpread(null);
      setShowTarotDescription(false);
    } else {
      const spread = drawTarotSpread(spreadType);
      const cardsWithInterpretation = spread.cards.map(card => ({
        ...card,
        interpretation: interpretTarotCard(card)
      }));
      setDrawnSpread({
        cards: cardsWithInterpretation,
        interpretation: spread.interpretation
      });
      setDrawnCard(null);
      setShowTarotDescription(false);
    }
  };

  const resetTarotDraws = () => {
    setDrawnCard(null);
    setDrawnSpread(null);
    setShowTarotDescription(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 
      selection:bg-purple-300 selection:text-purple-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text 
          bg-gradient-to-r from-purple-700 to-indigo-600 drop-shadow-lg">
          Tirage de Cartes de Tarot
        </h1>

        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-purple-100/50">
          <TarotDrawSection
            resetTarotDraws={resetTarotDraws}
            handleDrawCard={handleDrawCard}
            drawnCard={drawnCard}
            drawnSpread={drawnSpread}
            showTarotDescription={showTarotDescription}
          />
        </div>
      </div>
    </div>
  );
}
