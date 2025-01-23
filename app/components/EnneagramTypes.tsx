import React from 'react';
import { Icons } from './Icons';

export interface EnneagramType {
  type: string;
  label: string;
  description: string;
  color: string;
  icon: string | (() => React.ReactNode);
}

const enneagramTypes: EnneagramType[] = [
  {
    type: "1",
    label: "Type 1 : Le Réformateur",
    icon: Icons['1'],
    color: "bg-red-100 text-red-800",
    description: "Perfectionniste, organisé, avec un fort sens moral et éthique. Recherche la qualité et l'amélioration constante."
  },
  {
    type: "2",
    label: "Type 2 : L'Assistant",
    icon: Icons['2'],
    color: "bg-pink-100 text-pink-800",
    description: "Chaleureux, empathique, toujours prêt à aider les autres. Cherche à être aimé et apprécié."
  },
  {
    type: "3",
    label: "Type 3 : L'Accompli",
    icon: Icons['3'],
    color: "bg-yellow-100 text-yellow-800",
    description: "Ambitieux, dynamique, orienté vers le succès et la performance. Cherche toujours à performer et se valoriser."
  },
  {
    type: "4",
    label: "Type 4 : L'Individualiste",
    icon: Icons['4'],
    color: "bg-purple-100 text-purple-800",
    description: "Créatif, émotionnel, à la recherche de sens et d'authenticité. Recherche la profondeur émotionnelle et l'expression de soi."
  },
  {
    type: "5",
    label: "Type 5 : L'Investigateur",
    icon: Icons['5'],
    color: "bg-blue-100 text-blue-800",
    description: "Analytique, curieux, en quête de connaissances et de compréhension. Cherche à comprendre et à accumuler des connaissances."
  },
  {
    type: "6",
    label: "Type 6 : Le Loyaliste",
    icon: Icons['6'],
    color: "bg-green-100 text-green-800",
    description: "Responsable, engagé, cherchant la sécurité et la stabilité. Recherche la sécurité et la stabilité."
  },
  {
    type: "7",
    label: "Type 7 : L'Enthousiaste",
    icon: Icons['7'],
    color: "bg-orange-100 text-orange-800",
    description: "Optimiste, spontané, aventureux. Cherche l'expérience et évite la souffrance."
  },
  {
    type: "8",
    label: "Type 8 : Le Protecteur",
    icon: Icons['8'],
    color: "bg-red-200 text-red-900",
    description: "Puissant, décidé, direct. Cherche le contrôle et protège les vulnérables."
  },
  {
    type: "9",
    label: "Type 9 : Le Médiateur",
    icon: Icons['9'],
    color: "bg-gray-100 text-gray-800",
    description: "Pacifique, harmonieux, acceptant. Cherche l'unité et évite les conflits."
  }
];

export const EnneagramTypes = () => (
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
    <div className="flex items-start space-x-4 mb-4">
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
          Découvrez les Types d'Ennéagramme
        </p>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-4">
      {enneagramTypes.map((type) => (
        <div
          key={type.type}
          className={`${type.color} rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300`}
        >
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">
              {typeof type.icon === "function" ? type.icon() : <img src={type.icon} alt={type.label} />}
            </span>
            <h4 className="text-lg font-semibold">{type.label}</h4>
          </div>
          <p className="text-sm">{type.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default EnneagramTypes;
