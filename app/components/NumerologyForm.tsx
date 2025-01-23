import React, { FormEvent, useState } from "react";
import {
  calculateLifePath,
  calculateExpressionNumber,
  getZodiacSign,
} from "../../utils/numerology";
import { 
  generatePredictions,
  analyzePersonalityTraits,
  generateLifeInsights 
} from "../../utils/predictions";
import { 
  generatePersonalizedText 
} from "../../utils/huggingface";
import { Icons } from "./Icons";

interface NumerologyFormProps {
  formData: any;
  setFormData: (data: any) => void;
  setPredictions: (predictions: any) => void;
  setPersonalityTraits: (traits: any[]) => void;
  setLifeInsights: (insights: string) => void;
  setIsLoading: (loading: boolean) => void;
  setShowNumeroDescription: (show: boolean) => void;
}

const enneagramTypes = [
  { type: '1', label: 'Type 1 : Le Réformateur', icon: Icons['1'] },
  { type: '2', label: 'Type 2 : L\'Assistant', icon: Icons['2'] },
  { type: '3', label: 'Type 3 : L\'Accompli', icon: Icons['3'] },
  { type: '4', label: 'Type 4 : L\'Individualiste', icon: Icons['4'] },
  { type: '5', label: 'Type 5 : L\'Investigateur', icon: Icons['5'] },
  { type: '6', label: 'Type 6 : Le Loyaliste', icon: Icons['6'] },
  { type: '7', label: 'Type 7 : L\'Enthousiaste', icon: Icons['7'] },
  { type: '8', label: 'Type 8 : Le Protecteur', icon: Icons['8'] },
  { type: '9', label: 'Type 9 : Le Médiateur', icon: Icons['9'] }
];

const NumerologyForm: React.FC<NumerologyFormProps> = ({
  formData,
  setFormData,
  setPredictions,
  setPersonalityTraits,
  setLifeInsights,
  setIsLoading: setParentIsLoading,
  setShowNumeroDescription,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnneagramDropdownOpen, setIsEnneagramDropdownOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setParentIsLoading(true);

    try {
      const lifePath = calculateLifePath(formData.birthdate);
      const expressionNumber = calculateExpressionNumber(
        formData.firstName + " " + formData.lastName
      );
      const zodiacSign = getZodiacSign(formData.birthdate);

      // Generate predictions without cartomancy
      const generatedPredictions = await generatePredictions({
        lifePath,
        zodiacSign: zodiacSign,
        lifeAspect: formData.lifeAspect,
        enneagramType: formData.enneagramType,
        expressionNumber: expressionNumber,
        name: formData.firstName + " " + formData.lastName,
        birthDate: formData.birthdate,
        birthTime: formData.birthtime,
      });

      // Analyse des traits de personnalité
      const analyzedPersonalityTraits = await analyzePersonalityTraits(
        formData.firstName + " " + formData.lastName
      );
      setPersonalityTraits(analyzedPersonalityTraits);

      // Insights de vie
      const lifeInsights = await generateLifeInsights({
        name: formData.firstName + " " + formData.lastName,
        birthdate: formData.birthdate,
        lifeAspect: formData.lifeAspect,
      });
      setLifeInsights(lifeInsights);

      // Mise à jour des prédictions
      setPredictions(generatedPredictions);
      setShowNumeroDescription(true);
    } catch (error) {
      console.error("Erreur lors de la génération des prédictions :", error);
    } finally {
      setIsLoading(false);
      setParentIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Prénom
            <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              required
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Nom de famille
            <input
              type="text"
              name="lastName"
              placeholder="Nom de famille"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              required
            />
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Date de naissance
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) =>
                setFormData({ ...formData, birthdate: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              required
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Heure de naissance
            <input
              type="time"
              value={formData.birthtime}
              onChange={(e) =>
                setFormData({ ...formData, birthtime: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Aspect de vie
            <select
              value={formData.lifeAspect}
              onChange={(e) =>
                setFormData({ ...formData, lifeAspect: e.target.value })
              }
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
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Genre
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Adresse e-mail
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Type d'Ennéagramme
            <div className="relative">
              <div 
                onClick={() => setIsEnneagramDropdownOpen(!isEnneagramDropdownOpen)}
                className="appearance-none w-full bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-3 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                  text-gray-700 font-medium transition-all duration-300 ease-in-out
                  flex items-center justify-between cursor-pointer"
              >
                {formData.enneagramType 
                  ? `${Icons[formData.enneagramType]()} ${enneagramTypes.find(t => t.type === formData.enneagramType)?.label}`
                  : "Sélectionnez un type"}
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
              {isEnneagramDropdownOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                  {enneagramTypes.map((type) => (
                    <li 
                      key={type.type}
                      onClick={() => {
                        setFormData({ ...formData, enneagramType: type.type });
                        setIsEnneagramDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-purple-100 cursor-pointer flex items-center"
                    >
                      <span className="mr-2">{Icons[type.type]()}</span> {type.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 
          transform hover:scale-110 active:scale-95 
          shadow-md hover:shadow-xl mb-6"
        >
          {isLoading ? "Génération en cours..." : "Obtenir mon analyse"}
        </button>
      </div>
    </form>
  );
};

export default NumerologyForm;
