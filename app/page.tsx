'use client';

import { useState, FormEvent, useEffect } from 'react';
import { calculateLifePath, calculateExpressionNumber, getZodiacSign } from '../utils/numerology';
import { generatePredictions, Prediction, PredictionResult } from '../utils/predictions';
import { drawTarotCard, drawTarotSpread, MAJOR_ARCANA, DEFAULT_CARD, TarotCard } from '../utils/cartomancy';
import { analyzePersonalityTraits, generateLifeInsights } from '../utils/huggingface';

export default function Home() {
  const [formData, setFormData] = useState({
    name: 'NKENG HIAG LOUIS OLIVIER',
    birthdate: '1985-04-13',
    birthtime: '15:00',
    birthplace: 'song-loulou',
    gender: 'male',
    email: 'louiscyrano@gmail.com',
    lifeAspect: 'love',
    enneagram: '3'
  });

  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [personalityTraits, setPersonalityTraits] = useState<any[]>([]);
  const [lifeInsights, setLifeInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Cartomancy state
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [drawnSpread, setDrawnSpread] = useState<{ cards: TarotCard[], interpretation: string } | null>(null);
  const [spreadType, setSpreadType] = useState<'Single' | 'ThreePast' | 'Celtic'>('Single');

  const resetPredictions = () => {
    setPredictions(null);
    setPersonalityTraits([]);
    setLifeInsights('');
  };

  const resetTarotDraws = () => {
    setDrawnCard(null);
    setDrawnSpread(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const lifePath = calculateLifePath(formData.birthdate);
      const expressionNumber = calculateExpressionNumber(formData.name);
      const zodiacSign = getZodiacSign(formData.birthdate);

      // Generate predictions without cartomancy
      const generatedPredictions = await generatePredictions({
        lifePath,
        zodiacSign,
        lifeAspect: 'general',
        enneagramType: formData.enneagram
      });

      // Set predictions without cartomancy cards
      setPredictions({
        ...generatedPredictions,
        name: formData.name,
        lifePath,
        expressionNumber,
        zodiacSign
      });

      // Personality and life insights
      const traits = await analyzePersonalityTraits(formData.name);
      setPersonalityTraits(traits);

      const insights = await generateLifeInsights({
        name: formData.name,
        birthdate: formData.birthdate,
        lifeAspect: formData.lifeAspect
      });
      setLifeInsights(insights);

    } catch (error) {
      console.error('Erreur lors de la génération des prédictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawCard = () => {
    if (spreadType === 'Single') {
      const card = drawTarotCard();
      setDrawnCard(card);
      setDrawnSpread(null);
    } else {
      const spread = drawTarotSpread(spreadType);
      setDrawnSpread(spread);
      setDrawnCard(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Analyse Numérologique Avancée
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nom complet
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required 
                />
              </label>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Date de naissance
                <input 
                  type="date" 
                  value={formData.birthdate}
                  onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required 
                />
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Heure de naissance
                <input 
                  type="time" 
                  value={formData.birthtime}
                  onChange={(e) => setFormData({...formData, birthtime: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </label>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Aspect de vie
                <select 
                  value={formData.lifeAspect}
                  onChange={(e) => setFormData({...formData, lifeAspect: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                >
                  <option value="love">Amour et Relations</option>
                  <option value="career">Carrière et Finances</option>
                  <option value="health">Santé et Bien-être</option>
                  <option value="personal">Développement Personnel</option>
                  <option value="spiritual">Spiritualité</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Type d'Ennéagramme
                <select 
                  value={formData.enneagram}
                  onChange={(e) => setFormData({...formData, enneagram: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                >
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(type => (
                    <option key={type} value={type}>Type {type}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="text-center">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 disabled:opacity-50"
            >
              {isLoading ? 'Génération en cours...' : 'Obtenir mon analyse'}
            </button>
          </div>
        </form>

        {predictions && (
          <div className="mt-12 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-800">
                Résultats pour {predictions.name}
              </h2>
              <button 
                onClick={resetPredictions}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
            <section className="bg-blue-50 p-6 rounded-xl">
              <p className="font-semibold">Chemin de vie : {predictions.lifePath}</p>
              <p className="text-gray-600">Votre essence numerologique</p>
            </section>
            <section className="bg-blue-50 p-6 rounded-xl">
              <p className="font-semibold">Nombre d'expression : {predictions.expressionNumber}</p>
              <p className="text-gray-600">Votre potentiel intrinsèque</p>
            </section>
            <section className="bg-blue-50 p-6 rounded-xl">
              <p className="font-semibold">Signe solaire : {predictions.zodiacSign.name} {predictions.zodiacSign.symbol}</p>
              <p className="text-gray-600">Votre identité astrologique</p>
            </section>

            {personalityTraits.length > 0 && (
              <section className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-purple-800">
                  Analyse des Traits de Personnalité
                </h3>
                {personalityTraits.map((trait, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-semibold">{trait.emotion}</p>
                    <p className="text-gray-600">{trait.interpretation}</p>
                  </div>
                ))}
              </section>
            )}

            {lifeInsights && (
              <section className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-green-800">
                  Perspectives de Vie Personnalisées
                </h3>
                <p className="text-gray-700">{lifeInsights}</p>
              </section>
            )}

            <section className="bg-orange-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-orange-800">
                Prédictions Détaillées
              </h3>
              {Object.entries(predictions.predictions).map(([aspect, prediction]) => (
                <div key={aspect} className="bg-white p-3 rounded-md shadow-sm">
                  <h3 className="font-semibold text-lg capitalize mb-2">{aspect}</h3>
                  <p>{prediction.text}</p>
                  {prediction.aiGeneratedInsight && (
                    <p className="text-sm text-gray-600 mt-2">
                      Insight IA : {prediction.aiGeneratedInsight}
                    </p>
                  )}
                </div>
              ))}
            </section>
          </div>
        )}
      </div>

      {/* Cartomancy Section */}
      <div className="mt-8 bg-purple-50 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800">Tirage de Cartes de Tarot</h2>
          {(drawnCard || drawnSpread) && (
            <button 
              onClick={resetTarotDraws}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
        
        {/* Spread Type Selection */}
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setSpreadType('Single')} 
            className={`px-6 py-3 rounded-lg transition-all ${
              spreadType === 'Single' 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
            }`}
          >
            Carte Unique
          </button>
          <button 
            onClick={() => setSpreadType('ThreePast')} 
            className={`px-6 py-3 rounded-lg transition-all ${
              spreadType === 'ThreePast' 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
            }`}
          >
            Passé, Présent, Futur
          </button>
          <button 
            onClick={() => setSpreadType('Celtic')} 
            className={`px-6 py-3 rounded-lg transition-all ${
              spreadType === 'Celtic' 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
            }`}
          >
            Tirage Celtique
          </button>
        </div>

        {/* Draw Card Button */}
        <button 
          onClick={handleDrawCard}
          className="bg-purple-700 text-white px-8 py-4 rounded-xl 
            hover:bg-purple-800 transition-colors duration-300 
            transform hover:scale-105 active:scale-95 
            shadow-md hover:shadow-xl mb-6"
        >
          Tirer {spreadType === 'Single' ? 'une Carte' : 'les Cartes'}
        </button>

        {/* Single Card Display */}
        {drawnCard && (
          <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full animate-fade-in">
            <h2 className={`text-2xl font-bold mb-4 ${drawnCard.isReversed ? 'text-red-600' : 'text-green-600'}`}>
              {drawnCard.name} {drawnCard.isReversed && '(Inversé)'}
            </h2>
            
            <div className="mb-6">
              <img 
                src={drawnCard.imageUrl} 
                alt={drawnCard.name} 
                className={`w-full h-80 object-cover rounded-xl shadow-lg ${drawnCard.isReversed ? 'transform rotate-180' : ''}`}
                onError={(e) => {
                  console.error('Image load error:', e);
                  console.error('Image source:', drawnCard.imageUrl);
                }}
              />
            </div>
            
            <div className="text-gray-700">
              <p className="font-semibold mb-2">Mots-clés : {drawnCard.keywords.join(', ')}</p>
              <p className="mb-4">{drawnCard.isReversed ? drawnCard.reversedDescription : drawnCard.description}</p>
            </div>
          </div>
        )}

        {/* Spread Display */}
        {drawnSpread && (
          <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-4xl w-full animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
              {spreadType === 'ThreePast' ? 'Passé, Présent, Futur' : 'Tirage de la Croix Celtique'}
            </h2>
            
            <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
              {drawnSpread.cards.map((card, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className={`w-full h-40 object-cover rounded-lg shadow-md 
                      ${card.isReversed ? 'transform rotate-180' : ''}`}
                    onError={(e) => {
                      console.error(`Spread Card ${index} Image load error:`, e);
                      console.error(`Spread Card ${index} Image source:`, card.imageUrl);
                    }}
                  />
                  <p className={`mt-2 text-sm text-center ${card.isReversed ? 'text-red-600' : 'text-green-600'}`}>
                    {card.name} {card.isReversed && '(Inv)'}
                  </p>
                </div>
              ))}
            </div>

            {drawnSpread.interpretation && (
              <div className="mt-8 p-6 bg-purple-50 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-purple-900">Interprétation</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{drawnSpread.interpretation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}