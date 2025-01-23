'use client';

import React, { useState } from 'react';
import { Prediction, PredictionResult } from '../../utils/predictions';

type NumerologyResultsProps = {
  predictions: PredictionResult;
  personalityTraits: any[];
  lifeInsights: string;
  resetPredictions: () => void;
};

const NumerologyResults: React.FC<NumerologyResultsProps> = ({
  predictions,
  personalityTraits,
  lifeInsights,
  resetPredictions
}) => {
  const [isNumerologyDetailsOpen, setIsNumerologyDetailsOpen] = useState(false);

  return (
    <div className="mt-12 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">
          Résultats pour {predictions.name}
        </h2>
        <button
          onClick={resetPredictions}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Réinitialiser
        </button>
      </div>
      <section className="bg-blue-50 p-6 rounded-xl">
        <p className="font-semibold">
          Chemin de vie : {predictions.lifePath}
        </p>
        <p className="text-gray-600">Votre essence numerologique</p>
      </section>
      <section className="bg-blue-50 p-6 rounded-xl">
        <p className="font-semibold">
          Nombre d'expression : {predictions.expressionNumber}
        </p>
        <p className="text-gray-600">Votre potentiel intrinsèque</p>
      </section>
      <section className="bg-blue-50 p-6 rounded-xl">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-xl">
                Signe solaire : {predictions.zodiacSign.name}{" "}
                {predictions.zodiacSign.symbol}
              </p>
              <p className="text-gray-600 mb-4">
                Votre identité astrologique
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-800 mb-2">
                Caractéristiques
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {predictions.zodiacSign?.traits?.map((trait, index) => (
                  <li key={index} className="text-gray-700">
                    {trait}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-800 mb-2">
                Informations
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Élément :</span>{" "}
                  {predictions.zodiacSign?.element}
                </p>
                <p>
                  <span className="font-medium">Qualité :</span>{" "}
                  {predictions.zodiacSign?.quality}
                </p>
                <p>
                  <span className="font-medium">
                    Planète gouvernante :
                  </span>{" "}
                  {predictions.zodiacSign?.rulingPlanet}
                </p>
                <p>
                  <span className="font-medium">Période :</span>{" "}
                  {predictions.zodiacSign?.dates}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {personalityTraits.length > 0 && (
        <section className="bg-purple-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4 text-purple-800">
            Analyse des Traits de Personnalité
          </h3>
          {personalityTraits.map((trait, index) => (
            <div key={index} className="mb-3">
              <p className="font-semibold">{trait.emotion}</p>
              <p className="text-gray-700">{trait.interpretation}</p>
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
        {Object.entries(predictions.predictions).map(
          ([aspect, prediction]: [string, Prediction]) => (
            <div
              key={aspect}
              className="bg-white p-3 rounded-md shadow-sm"
            >
              <h3 className="font-semibold text-lg capitalize mb-2">
                {aspect}
              </h3>
              <p>{prediction.text}</p>
              {prediction.detailedPredictions && (
                <ul className="list-disc list-inside mt-2">
                  {prediction.detailedPredictions.map(
                    (detail, index) => (
                      <li key={index} className="text-gray-700">
                        {detail}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          )
        )}
      </section>

      <div className="mt-4 p-4 bg-white/10 rounded-lg shadow-lg">
        <div className="accordion border rounded-lg overflow-hidden">
          <div className="accordion-item">
            <button
              className="w-full text-left p-4 bg-purple-100 hover:bg-purple-200 transition-colors flex justify-between items-center"
              onClick={() =>
                setIsNumerologyDetailsOpen(!isNumerologyDetailsOpen)
              }
            >
              <h3 className="text-2xl font-bold text-purple-800">
                Profil Numérologique Détaillé
              </h3>
              <span className="text-xl">
                {isNumerologyDetailsOpen ? "▲" : "▼"}
              </span>
            </button>

            {isNumerologyDetailsOpen && (
              <div className="p-4 bg-white/10 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chemin de Vie */}
                  <div className="bg-purple-50 p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold text-lg text-purple-700">
                      Chemin de Vie
                    </h4>
                    <p className="text-gray-700">
                      Numéro : {predictions.lifePath}
                    </p>
                    <p className="text-gray-700">
                      Description :{" "}
                      {
                        predictions.numerologyProfile.lifePath
                          .description
                      }
                    </p>
                    <div>
                      <h5 className="font-medium mt-2 text-purple-600">
                        Défis Potentiels :
                      </h5>
                      <ul className="list-disc pl-5 text-gray-700">
                        {predictions.numerologyProfile.lifePath.potentialChallenges.map(
                          (challenge, index) => (
                            <li key={index}>{challenge}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Nombre d'Expression */}
                  <div className="bg-purple-50 p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold text-lg text-purple-700">
                      Nombre d'Expression
                    </h4>
                    <p className="text-gray-700">
                      Numéro : {predictions.expressionNumber}
                    </p>
                    <p className="text-gray-700">
                      Description :{" "}
                      {
                        predictions.numerologyProfile.expressionNumber
                          .description
                      }
                    </p>
                    <div>
                      <h5 className="font-medium mt-2 text-purple-600">
                        Forces Personnelles :
                      </h5>
                      <ul className="list-disc pl-5 text-gray-700">
                        {predictions.numerologyProfile.expressionNumber.personalStrengths.map(
                          (strength, index) => (
                            <li key={index}>{strength}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Cycles Personnels */}
                  <div className="bg-purple-50 p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold text-lg text-purple-700">
                      Cycles Personnels
                    </h4>
                    <div>
                      <h5 className="font-medium text-purple-600">
                        Cycle Formatif
                      </h5>
                      <p className="text-gray-700">
                        {
                          predictions.numerologyProfile.personalCycles
                            .formatifCycle.description
                        }
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mt-2 text-purple-600">
                        Cycle Productif
                      </h5>
                      <p className="text-gray-700">
                        {
                          predictions.numerologyProfile.personalCycles
                            .productifCycle.description
                        }
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mt-2 text-purple-600">
                        Cycle de la Moisson
                      </h5>
                      <p className="text-gray-700">
                        {
                          predictions.numerologyProfile.personalCycles
                            .harvestCycle.description
                        }
                      </p>
                    </div>
                  </div>

                  {/* Vibrations du Nom */}
                  <div className="bg-purple-50 p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold text-lg text-purple-700">
                      Vibrations du Nom
                    </h4>
                    <div>
                      <h5 className="font-medium text-purple-600">
                        Vibration des Voyelles
                      </h5>
                      <p className="text-gray-700">
                        Nombre :{" "}
                        {
                          predictions.numerologyProfile.nameVibrations
                            .vowelVibration.count
                        }
                      </p>
                      <p className="text-gray-700">
                        Énergie :{" "}
                        {
                          predictions.numerologyProfile.nameVibrations
                            .vowelVibration.energy
                        }
                      </p>
                      <p className="text-gray-700">
                        Interprétation :{" "}
                        {
                          predictions.numerologyProfile.nameVibrations
                            .vowelVibration.interpretation
                        }
                      </p>
                    </div>
                    <div className="mt-2">
                      <h5 className="font-medium text-purple-600">
                        Vibration des Consonnes
                      </h5>
                      <p className="text-gray-700">
                        Nombre :{" "}
                        {
                          predictions.numerologyProfile.nameVibrations
                            .consonantVibration.count
                        }
                      </p>
                      <p className="text-gray-700">
                        Énergie :{" "}
                        {
                          predictions.numerologyProfile.nameVibrations
                            .consonantVibration.energy
                        }
                      </p>
                      <p className="text-gray-700">
                        Interprétation :{" "}
                        {
                          predictions.numerologyProfile.nameVibrations
                            .consonantVibration.interpretation
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumerologyResults;
