/* stylelint-disable */
/* eslint-disable */
/* stylelint-disable-next-line */
/* stylelint-disable */
import {
  calculateLifePath,
  calculateExpressionNumber,
  getLifePathDescription,
  getExpressionNumberDescription,
  getZodiacSignDescription,
  ZodiacSign
} from './numerology';
import NumeroDataLoader from './dataLoader';
const dataLoader = new NumeroDataLoader();
import { 
  analyzePersonalityTraits, 
  generateLifeInsights,
  generatePersonalizedText 
} from './huggingface'; // Importer generatePersonalizedText de huggingface



export { 
  analyzePersonalityTraits, 
  generateLifeInsights,
  generatePersonalizedText 
} from './huggingface';



export interface PredictionParams {
  lifePath: number;
  zodiacSign: ZodiacSign;
  lifeAspect: string;
  enneagramType: string;
  name: string;
  expressionNumber: number;
  birthDate: string;
  birthTime: string;
}

export interface NumerologyProfile {
  lifePath: {
    number: number;
    description: string;
    potentialChallenges: string[];
    details?: any;
  };
  expressionNumber: {
    number: number;
    description: string;
    personalStrengths: string[];
    details?: any;
  };
  zodiacSign: ZodiacSign & {
    extendedDescription?: string;
  };
  personalCycles: {
    formatifCycle: {
      number: number;
      description: string;
      keywords: string[];
    };
    productifCycle: {
      number: number;
      description: string;
      keywords: string[];
    };
    harvestCycle: {
      number: number;
      description: string;
      keywords: string[];
    };
    details?: any;
  };
  nameVibrations: {
    vowelVibration: {
      count: number;
      energy: string;
      interpretation: string;
    };
    consonantVibration: {
      count: number;
      energy: string;
      interpretation: string;
    };
    nameEnergyBalance: {
      vowels: number;
      consonants: number;
      balance: string;
    };
  };
  birthTimeInfluence: {
    number: number;
    energyType: {
      type: string;
      qualities: string[];
    };
    timeVibration: {
      number: number;
      description: string;
      potentialInfluence: string;
    };
  };
}

export interface Prediction {
  probability: number;
  text: string;
  analyseDetaille: string;
  aiGeneratedInsight: string;
  detailedPredictions?: string[];
  contextualRecommendations?: string[];
}

export interface PredictionResult {
  predictions: {
    [aspect: string]: Prediction;
  };
  numerologyProfile: NumerologyProfile;
  name: string;
  lifePath: number;
  expressionNumber: number;
  zodiacSign: ZodiacSign;
  enneagramInterpretation: string;
  Love?: Prediction;
  Career?: Prediction;
  Tarot?: Prediction;
}

// Ajout des fonctions auxiliaires

function parseDate(dateString: string): Date {
  return new Date(dateString);
}

function calculatePersonalCycles(birthDate: Date): NumerologyProfile['personalCycles'] {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const year = birthDate.getFullYear();

  return {
    formatifCycle: {
      number: month,
      description: `Cycle formatif (${month}): Période d'apprentissage et de développement personnel`,
      keywords: ['Éducation', 'Formation', 'Développement']
    },
    productifCycle: {
      number: day,
      description: `Cycle productif (${day}): Période de croissance et d'évolution`,
      keywords: ['Action', 'Réalisation', 'Progression']
    },
    harvestCycle: {
      number: year,
      description: `Cycle de la moisson (${year}): Période de récolte et de réflexion`,
      keywords: ['Bilan', 'Maturité', 'Sagesse']
    }
  };
}

function getLifePathChallenges(lifePath: number): string[] {
  const challenges = {
    1: [
      'Surmonter la tendance à l\'égocentrisme',
      'Apprendre à collaborer et à écouter',
      'Développer la patience et l\'humilité'
    ],
    4: [
      'Assouplir sa rigidité et son perfectionnisme',
      'Accepter le changement et l\'imprévu',
      'Équilibrer travail et vie personnelle'
    ],
    8: [
      'Gérer son ambition sans écraser les autres',
      'Cultiver l\'empathie et la générosité',
      'Trouver un équilibre entre pouvoir et service'
    ]
  };

  return challenges[lifePath] || [
    'Accepter ses propres limites',
    'Développer la flexibilité personnelle',
    'Apprendre de ses expériences'
  ];
}

function getExpressionNumberPotentials(expressionNumber: number): string[] {
  const potentials = {
    1: [
      'Leadership naturel',
      'Capacité d\'innovation',
      'Forte individualité'
    ],
    4: [
      'Organisation et méthode',
      'Stabilité et persévérance',
      'Sens pratique développé'
    ],
    8: [
      'Potentiel de réussite matérielle',
      'Capacité de gestion',
      'Ambition et détermination'
    ]
  };

  return potentials[expressionNumber] || [
    'Potentiel créatif unique',
    'Capacité d\'adaptation',
    'Ressources intérieures'
  ];
}

function analyzeNameVibrations(name: string): NumerologyProfile['nameVibrations'] {
  const vowels = name.toLowerCase().match(/[aeiou]/g) || [];
  const consonants = name.toLowerCase().match(/[^aeiou\s]/g) || [];

  return {
    vowelVibration: {
      count: vowels.length,
      energy: vowels.length > 3 ? 'Haute expressivité émotionnelle' : 'Expressivité modérée',
      interpretation: vowels.length > 3 
        ? 'Forte connexion intuitive et émotionnelle' 
        : 'Équilibre entre émotions et rationalité'
    },
    consonantVibration: {
      count: consonants.length,
      energy: consonants.length > 5 ? 'Dynamisme actionnel' : 'Énergie structurée',
      interpretation: consonants.length > 5
        ? 'Forte capacité d\'action et de réalisation'
        : 'Approche méthodique et réfléchie'
    },
    nameEnergyBalance: {
      vowels: vowels.length,
      consonants: consonants.length,
      balance: Math.abs(vowels.length - consonants.length) <= 1 
        ? 'Harmonie vibratoire' 
        : 'Déséquilibre énergétique à explorer'
    }
  };
}

function analyzeBirthTimeInfluence(birthTime?: string): NumerologyProfile['birthTimeInfluence'] {
  // Si pas de temps de naissance, retourner une valeur par défaut
  if (!birthTime) {
    return {
      number: 0,
      energyType: { type: 'Neutre', qualities: [] },
      timeVibration: { number: 0, description: 'Aucune influence spécifique du temps de naissance détectée.', potentialInfluence: '' }
    };
  }

  // Vérifier le format du temps
  const timeParts = birthTime.split(':').map(Number);
  
  // Gérer les formats de temps invalides
  if (timeParts.length !== 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) {
    return {
      number: 0,
      energyType: { type: 'Indéterminé', qualities: [] },
      timeVibration: { number: 0, description: 'Format de temps de naissance invalide.', potentialInfluence: '' }
    };
  }

  const [hours, minutes] = timeParts;
  const timeNumber = hours + minutes;

  const energyTypes = {
    morning: {
      number: 1,
      energyType: { type: 'Créatif', qualities: ['Nouvelle création', 'Inspiration'] },
      timeVibration: { number: 1, description: 'Énergie de nouvelle création et d\'inspiration.', potentialInfluence: 'Créativité accrue' }
    },
    afternoon: {
      number: 2,
      energyType: { type: 'Productif', qualities: ['Réalisation', 'Concrétisation'] },
      timeVibration: { number: 2, description: 'Énergie de réalisation et de concrétisation.', potentialInfluence: 'Productivité accrue' }
    },
    evening: {
      number: 3,
      energyType: { type: 'Réflexif', qualities: ['Contemplation', 'Introspection'] },
      timeVibration: { number: 3, description: 'Énergie de contemplation et d\'introspection.', potentialInfluence: 'Réflexion accrue' }
    },
    night: {
      number: 4,
      energyType: { type: 'Intuitif', qualities: ['Connexion spirituelle', 'Transformation'] },
      timeVibration: { number: 4, description: 'Énergie de connexion spirituelle et de transformation.', potentialInfluence: 'Intuition accrue' }
    }
  };

  // Déterminer le type d'énergie en fonction de l'heure
  if (hours >= 5 && hours < 12) {
    return energyTypes.morning;
  } else if (hours >= 12 && hours < 18) {
    return energyTypes.afternoon;
  } else if (hours >= 18 && hours < 22) {
    return energyTypes.evening;
  } else {
    return energyTypes.night;
  }
}

function calculateLifePathProbability(lifePath: number | string, birthDate?: string): number {
  // Convertir le chemin de vie en nombre si nécessaire
  const lifePathNumber = typeof lifePath === 'string' 
    ? parseInt(lifePath, 10)
    : lifePath;

  // Si un chemin de vie est fourni sans date de naissance, utiliser le chemin de vie
  if (!birthDate) {
    return calculateProbabilityFromLifePath(lifePathNumber);
  }

  // Sinon, utiliser ensureLifePath pour garantir un chemin de vie cohérent
  const finalLifePath = ensureLifePath(birthDate, lifePathNumber);
  return calculateProbabilityFromLifePath(finalLifePath);
}

function calculateProbabilityFromLifePath(lifePath: number): number {
  // Logique de calcul de probabilité basée sur le chemin de vie
  const probabilityMap = {
    1: 0.75,  // Chemin de vie de leader
    2: 0.65,  // Chemin de vie de coopération
    3: 0.70,  // Chemin de vie créatif
    4: 0.60,  // Chemin de vie de stabilité
    5: 0.80,  // Chemin de vie de liberté
    6: 0.72,  // Chemin de vie de responsabilité
    7: 0.68,  // Chemin de vie spirituel
    8: 0.74,  // Chemin de vie de pouvoir
    9: 0.76   // Chemin de vie humanitaire
  };

  return (probabilityMap[lifePath] || 0.5) * 100;
}

function ensureLifePath(birthDate: string, providedLifePath?: number): number {
  // Si un chemin de vie est fourni, le retourner
  if (providedLifePath !== undefined) {
    return providedLifePath;
  }
  
  // Sinon, calculer à partir de la date de naissance
  return calculateLifePath(birthDate);
}

function generateContextualRecommendations(profile: any, aspect: string): string[] {
  const aspectRecommendations = {
    'career': [
      `Exploitez votre chemin de vie ${profile.lifePath.number} pour progresser`,
      `Développez vos forces liées au nombre ${profile.expressionNumber.number}`,
      'Restez ouvert aux opportunités inattendues'
    ],
    'love': [
      'Cultivez votre sensibilité et votre écoute',
      'Soyez authentique dans vos relations',
      'Apprenez de vos expériences passées'
    ]
  };

  return aspectRecommendations[aspect] || [
    'Restez fidèle à vous-même',
    'Continuez à vous développer personnellement',
    'Soyez ouvert aux nouvelles perspectives'
  ];
}

function generatePredictionText(profile: NumerologyProfile, aspect: string): string {
  const lifePath = profile.lifePath.number;
  const zodiacSign = profile.zodiacSign.name;
  const expressionNumber = profile.expressionNumber.number;

  const predictionTemplates = {
    1: `En tant que chemin de vie ${lifePath}, votre potentiel de leadership et d'innovation est remarquable.`,
    2: `Avec un chemin de vie ${lifePath}, votre capacité de coopération et d'harmonie est votre force principale.`,
    3: `Un chemin de vie ${lifePath} révèle votre créativité et votre expression artistique exceptionnelles.`,
    // Ajoutez d'autres templates pour différents chemins de vie
  };

  const baseText = predictionTemplates[lifePath] || 
    `Votre chemin de vie ${lifePath} offre des perspectives uniques et prometteuses.`;

  return ` Prédiction pour ${aspect}
${baseText}

Votre signe ${zodiacSign} et votre nombre d'expression ${expressionNumber} 
renforcent votre potentiel unique et vos capacités personnelles.`;
}

function generateDetailedAnalysis(profile: NumerologyProfile, aspect: string): string {
  const lifePath = profile.lifePath;
  const expressionNumber = profile.expressionNumber;
  const zodiacSign = profile.zodiacSign;
  const personalCycles = profile.personalCycles;

  return ` Analyse Détaillée - ${aspect.toUpperCase()}

 Chemin de Vie (${lifePath.number})
Description : ${lifePath.description}
Défis Potentiels : 
${lifePath.potentialChallenges.map(challenge => `- ${challenge}`).join('\n')}

 Nombre d'Expression (${expressionNumber.number})
Description : ${expressionNumber.description}
Forces Personnelles :
${expressionNumber.personalStrengths.map(strength => `- ${strength}`).join('\n')}

 Signe Zodiacal (${zodiacSign.name})
Description : ${zodiacSign.extendedDescription || 'Aucune description disponible'}
Traits : ${zodiacSign.traits.join(', ')}

 Cycles Personnels
Cycle Formatif : ${personalCycles.formatifCycle.description}
Cycle Productif : ${personalCycles.productifCycle.description}
Cycle de la Moisson : ${personalCycles.harvestCycle.description}

 Recommandations pour ${aspect} :
${generateContextualRecommendations(profile, aspect).map(rec => `- ${rec}`).join('\n')}`;
}

export async function generatePredictions(params: PredictionParams): Promise<PredictionResult> {
  const { 
    lifePath, 
    zodiacSign, 
    lifeAspect, 
    enneagramType, 
    name,
    birthDate,
    birthTime 
  } = params;

  // Mapper les aspects en français
  const aspectMapping: { [key: string]: string } = {
    'career': 'carrière',
    'love': 'amour',
    'health': 'santé',
    'spirituality': 'spiritualité',
    'personal-development': 'développement-personnel'
  };

  const mappedLifeAspect = aspectMapping[lifeAspect] || lifeAspect;
  const predictionTemplate = dataLoader.getPredictionTemplate('detaille');
  
  // Générer des prédictions personnalisées basées sur le profil numérologique
  let detailedPredictions: string[] = [];
  
  // Utiliser les informations du chemin de vie
  
  // Calculer le nombre d'expression
  const expressionNumber = calculateExpressionNumber(name);

  // Récupérer les détails des templates de prédiction
  const lifePathDetails = predictionTemplate.numerologyDetails.lifePathDetails[lifePath] || 
    predictionTemplate.numerologyDetails.lifePathDetails['1'];
  
  const expressionNumberDetails = predictionTemplate.numerologyDetails.expressionNumbers[expressionNumber] || 
    predictionTemplate.numerologyDetails.expressionNumbers['1'];

  // Créer le profil numérologique
  const numerologyProfile: NumerologyProfile = {
    lifePath: {
      number: lifePath,
      description: getLifePathDescription(lifePath),
      potentialChallenges: getLifePathChallenges(lifePath),
      details: lifePathDetails
    },
    expressionNumber: {
      number: expressionNumber,
      description: getExpressionNumberDescription(expressionNumber),
      personalStrengths: getExpressionNumberPotentials(expressionNumber),
      details: expressionNumberDetails
    },
    zodiacSign: {
      ...zodiacSign,
      extendedDescription: getZodiacSignDescription(zodiacSign.name)
    },
    personalCycles: calculatePersonalCycles(parseDate(birthDate)),
    nameVibrations: analyzeNameVibrations(name),
    birthTimeInfluence: analyzeBirthTimeInfluence(birthTime)
  };
  
  const personalityTraits = await analyzePersonalityTraits(name);
  
  // Générer des prédictions spécifiques basées sur l'aspect de vie
  switch(mappedLifeAspect) {
    case 'carrière':
      detailedPredictions = [
        `Votre chemin de vie ${numerologyProfile.lifePath.number} (${numerologyProfile.lifePath.details.name}) vous offre des perspectives professionnelles uniques.`,
        ...numerologyProfile.lifePath.details.potentialCareers ? 
          [`Vos talents naturels vous prédisposent à des carrières comme : ${numerologyProfile.lifePath.details.potentialCareers.join(', ')}.`] : 
          [],
        ...numerologyProfile.expressionNumber.details.strengths ? 
          [`Vos forces principales incluent : ${numerologyProfile.expressionNumber.details.strengths.join(', ')}, qui seront des atouts majeurs dans votre parcours professionnel.`] : 
          [],
        `Vos principaux défis professionnels seront : ${
          numerologyProfile.expressionNumber.details.challenges ? 
            numerologyProfile.expressionNumber.details.challenges.join(', ') : 
            'Gérer votre potentiel et vos ambitions'
        }.`
      ];
      break;
    
    case 'amour':
      detailedPredictions = [
        `Votre chemin de vie ${numerologyProfile.lifePath.number} (${numerologyProfile.lifePath.details.name}) influence profondément vos relations.`,
        ...numerologyProfile.expressionNumber.details.personalityTraits ? 
          [`Vos traits de personnalité comme : ${numerologyProfile.expressionNumber.details.personalityTraits.join(', ')} façonnent votre approche des relations.`] : 
          [],
        `Vos défis relationnels seront : ${
          numerologyProfile.expressionNumber.details.challenges ? 
            numerologyProfile.expressionNumber.details.challenges.join(', ') : 
            'Équilibrer vos besoins personnels et ceux de votre partenaire'
        }.`
      ];
      break;
    
    case 'santé':
      detailedPredictions = [
        `Votre chemin de vie ${numerologyProfile.lifePath.number} (${numerologyProfile.lifePath.details.name}) influence votre approche du bien-être.`,
        ...numerologyProfile.lifePath.details.keyLessons ? 
          [`Vos leçons de vie principales incluent : ${numerologyProfile.lifePath.details.keyLessons.join(', ')}, essentielles pour votre équilibre.`] : 
          [],
        ...numerologyProfile.expressionNumber.details.strengths ? 
          [`Vos forces naturelles comme : ${numerologyProfile.expressionNumber.details.strengths.join(', ')} peuvent être des leviers pour votre santé.`] : 
          []
      ];
      break;
    
    default:
      detailedPredictions = [
        `Votre chemin de vie ${numerologyProfile.lifePath.number} (${numerologyProfile.lifePath.details.name}) vous guide vers la réalisation personnelle.`,
        ...numerologyProfile.lifePath.details.keyLessons ? 
          [`Vos principales leçons de vie : ${numerologyProfile.lifePath.details.keyLessons.join(', ')}.`] : 
          [],
        ...numerologyProfile.expressionNumber.details.personalityTraits ? 
          [`Vos traits distinctifs : ${numerologyProfile.expressionNumber.details.personalityTraits.join(', ')}.`] : 
          []
      ];
  }

  // Si aucune prédiction n'est générée, utiliser les prédictions génériques
  if (detailedPredictions.length === 0) {
    detailedPredictions = predictionTemplate[mappedLifeAspect]?.detailedPredictions || 
      predictionTemplate['carrière']?.detailedPredictions || 
      [];
  }

  // Calcul des probabilités
  const calculatedLifePath = calculateLifePath(birthDate);
  const probabilityFactors = [
    calculateLifePathProbability(calculatedLifePath),
    calculateZodiacProbability(zodiacSign.name),
    calculateEnneagramProbability(enneagramType),
    calculatePersonalCycleProbability(numerologyProfile.personalCycles)
  ];

  const probability = calculateWeightedProbability(probabilityFactors);

  // Génération de l'insight personnalisé
  const aiGeneratedInsight = await generatePersonalizedText(
    `Profil Numérologique Détaillé :
    - Chemin de vie : ${numerologyProfile.lifePath.description}
    - Cycle productif : ${numerologyProfile.personalCycles.productifCycle.description}
    - Traits de personnalité : ${
      personalityTraits
        .filter(trait => trait.confidence > 0.5)
        .map(trait => `${trait.trait} (Confiance: ${(trait.confidence * 100).toFixed(2)}%)`)
        .join(', ') || 'Aucun trait significatif'
    }

    Mets en valeur les forces, les opportunités de développement et les perspectives positives.
    Ton style doit être inspirant, encourageant et précis.`,
    {
      model: 'numerology-insight-model',
      temperature: 0.7,
      maxTokens: 300
    }
  );

  // Génération du texte de prédiction et de l'analyse détaillée
  const predictionText = generatePredictionText(numerologyProfile, mappedLifeAspect);
  const detailedAnalysis = generateDetailedAnalysis(numerologyProfile, mappedLifeAspect);

  // Prédiction pour l'aspect spécifique
  const aspectPrediction = {
    probability,
    text: predictionText,
    analyseDetaille: detailedAnalysis,
    aiGeneratedInsight,
    detailedPredictions,
    contextualRecommendations: generateContextualRecommendations(numerologyProfile, mappedLifeAspect)
  };

  return {
    predictions: {
      [mappedLifeAspect]: aspectPrediction
    },
    numerologyProfile,
    name,
    lifePath,
    expressionNumber,
    zodiacSign,
    enneagramInterpretation: getEnneagramInterpretation(enneagramType)
  };
}

function getEnneagramInterpretation(type: string): string {
  const interpretations = {
    '3': 'Type Accompli : Votre ambition et votre capacité de réalisation sont vos principaux atouts.',
    '8': 'Type Leader : Votre force et votre détermination vous permettent de surmonter tous les obstacles.',
    '1': 'Type Perfectionniste : Votre sens de l\'éthique et de la précision vous guident vers l\'excellence.'
  };
  return interpretations[type] || 'Interprétation générique de votre type d\'ennéagramme';
}

function calculateZodiacProbability(zodiacSign: string): number {
  const probabilityMap = {
    'Bélier': 0.7,
    'Lion': 0.8,
    'Sagittaire': 0.7
  };
  return probabilityMap[zodiacSign] || 0.5;
}

function calculateEnneagramProbability(enneagramType: string): number {
  const probabilityMap = {
    '3': 0.8,  // Accompli, orienté résultats
    '8': 0.7,  // Leader, puissant
    '1': 0.6   // Perfectionniste
  };
  return probabilityMap[enneagramType] || 0.5;
}

function calculatePersonalCycleProbability(personalCycles: any): number {
  const cycleFactors = [
    personalCycles.formatifCycle.number,
    personalCycles.productifCycle.number,
    personalCycles.harvestCycle.number
  ];
  
  const averageCycleFactor = cycleFactors.reduce((a, b) => a + b, 0) / cycleFactors.length;
  return Math.min(averageCycleFactor / 10, 0.9);
}

function calculateWeightedProbability(factors: number[]): number {
  const weightedAverage = factors.reduce((a, b) => a * b, 1);
  return Math.round(weightedAverage * 100);
}

// Ajout d'une méthode par défaut de chargement de données personnelles
function defaultLoadPersonalData(name: string): Promise<any> {
  return Promise.resolve({
    name,
    defaultDataLoaded: true,
    timestamp: new Date().toISOString(),
    fallbackSource: 'defaultLoadPersonalData'
  });
}

// Type générique pour dataLoader avec des méthodes potentielles
type FlexibleDataLoader = {
  loadPersonalData?: (name: string) => Promise<any>;
  loadProfileData?: (name: string) => Promise<any>;
  [key: string]: any;
}
