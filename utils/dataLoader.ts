/* eslint-disable */
/* stylelint-disable */
/* stylelint-disable-next-line */
let fs;
/* stylelint-disable-next-line */
let path;
if (typeof window === 'undefined') {
  fs = require('fs');
  path = require('path');
}

import lifePaths from '../data/lifePaths.json';

import expressionNumbers from '../data/expressionNumbers.json';
import zodiacSigns from '../data/zodiacSigns.json';
import aspects from '../data/aspects.json';
import predictions from '../data/predictions.json';

/* stylelint-enable */
/* eslint-enable */

export interface DataLoader {
  getLifePath: (number: number) => any;
  getExpressionNumber: (number: number) => any;
  getZodiacSign: (sign: string) => any;
  getAspect: (aspect: string) => any;
  getCombination: (type: string, keys: string[]) => any;
  getPredictionTemplate: (type: string) => any;
  getProbabilityModifiers: () => any;
  extractNumerologyData: (filePath: string) => any;
}

class NumeroDataLoader implements DataLoader {
  private lifePaths: any;
  private expressionNumbers: any;
  private zodiacSigns: any;
  private aspects: any;
  private predictions: any;

  constructor() {
    this.lifePaths = lifePaths;
    this.expressionNumbers = expressionNumbers;
    this.zodiacSigns = zodiacSigns;
    this.aspects = aspects;
    this.predictions = predictions;
  }

  getLifePath(number: number) {
    return this.lifePaths[number];
  }

  getExpressionNumber(number: number) {
    return this.expressionNumbers[number];
  }

  getZodiacSign(sign: string) {
    return this.zodiacSigns[sign];
  }

  getAspect(aspect: string) {
    return this.aspects[aspect];
  }

  getCombination(type: string, keys: string[]) {
    // Implémentation générique de récupération de combinaison
    return keys.map(key => this[type][key]);
  }

  getPredictionTemplate(templateType: string = 'detaille'): any {
    try {
      const predictions = JSON.parse(JSON.stringify(this.predictions));
      
      // Ensure numerologyDetails is always returned
      if (templateType === 'detaille') {
        return {
          ...predictions,
          numerologyDetails: predictions.numerologyDetails || {
            expressionNumbers: {},
            lifePathDetails: {},
            personalCyclesInterpretation: {}
          }
        };
      }
      
      return predictions[templateType] || {};
    } catch (error) {
      console.error('Error loading prediction template:', error);
      return {
        numerologyDetails: {
          expressionNumbers: {},
          lifePathDetails: {},
          personalCyclesInterpretation: {}
        }
      };
    }
  }

  getProbabilityModifiers() {
    // Retourne des modificateurs de probabilité si nécessaire
    return {
      lifePath: 1.2,
      zodiac: 1.1,
      personalCycle: 1.3
    };
  }

  extractNumerologyData(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Extract relevant data from the content
    const data = {
      definition: this.extractSection(content, 'Définition', 'Que peut-on attendre de la numérologie ?'),
      expectations: this.extractSection(content, 'Que peut-on attendre de la numérologie ?', 'Les limites de la numérologie'),
      limits: this.extractSection(content, 'Les limites de la numérologie', 'La numérologie peut-elle aider à guérir ?'),
      healing: this.extractSection(content, 'La numérologie peut-elle aider à guérir ?', 'La numérologie peut-elle prévoir les événements ?'),
      events: this.extractSection(content, 'La numérologie peut-elle prévoir les événements ?', 'Comment traiter les modifications de notre état civil ?'),
      civilStatus: this.extractSection(content, 'Comment traiter les modifications de notre état civil ?', 'La numérologie peut-elle nous aider dans nos entreprises ?'),
      business: this.extractSection(content, 'La numérologie peut-elle nous aider dans nos entreprises ?', 'Quelles sont les différences entre le thème humaine et automatique ?'),
      humanVsAuto: this.extractSection(content, 'Quelles sont les différences entre le thème humaine et automatique ?', 'Les nombres peuvent-ils nous apporter de la chance ?'),
      luck: this.extractSection(content, 'Les nombres peuvent-ils nous apporter de la chance ?', 'Les nombres peuvent-il être utile pour offrir un cadeau ?'),
      gifts: this.extractSection(content, 'Les nombres peuvent-il être utile pour offrir un cadeau ?', 'Principes'),
      principles: this.extractSection(content, 'Principes', 'L’unité et les intéractions entre les nombres'),
      interactions: this.extractSection(content, 'L’unité et les intéractions entre les nombres', 'La réincarnation et les karmas'),
      reincarnation: this.extractSection(content, 'La réincarnation et les karmas', 'Le destin'),
      destiny: this.extractSection(content, 'Le destin', 'Le libre-arbitre'),
      freeWill: this.extractSection(content, 'Le libre-arbitre', 'La philosophie du milieu'),
      philosophy: this.extractSection(content, 'La philosophie du milieu', 'Etat civil'),
      civilState: this.extractSection(content, 'Etat civil', 'L’inclusion ou évaluateur ou étoile de Vénus'),
      inclusion: this.extractSection(content, 'L’inclusion ou évaluateur ou étoile de Vénus', 'Le prénom usuel ou nombre actif'),
      activeName: this.extractSection(content, 'Le prénom usuel ou nombre actif', 'Paramètres de notre personnalité'),
      personality: this.extractSection(content, 'Paramètres de notre personnalité', 'Le deuxième prénom'),
      secondName: this.extractSection(content, 'Le deuxième prénom', 'Le troisième prénom'),
      thirdName: this.extractSection(content, 'Le troisième prénom', 'Le quatrième prénom'),
      fourthName: this.extractSection(content, 'Le quatrième prénom', 'Le nom de famille ou nombre héréditaire'),
      familyName: this.extractSection(content, 'Le nom de famille ou nombre héréditaire', 'Les voyelles ou l’élan spirituel ou l\'intérieur'),
      vowels: this.extractSection(content, 'Les voyelles ou l\'élan spirituel ou l\'intérieur', 'Les consonnes ou le moi intime ou l\'extérieur'),
      consonants: this.extractSection(content, 'Les consonnes ou le moi intime ou l\'extérieur', 'Toutes les lettres de l\'état civil ou l\'expression'),
      expression: this.extractSection(content, 'Toutes les lettres de l\'état civil ou l\'expression', 'Les lettres'),
      letters: this.extractSection(content, 'Les lettres', 'Date de naissance'),
      birthDate: this.extractSection(content, 'Date de naissance', 'Le chemin de vie (la destinée)'),
      lifePath: this.extractSection(content, 'Le chemin de vie (la destinée)', 'L\'ascendant du chemin de vie'),
      ascendant: this.extractSection(content, 'L\'ascendant du chemin de vie', 'Les défis du chemin de vie'),
      challenges: this.extractSection(content, 'Les défis du chemin de vie', 'Cycles de vie ou climat psychologique évolutif'),
      lifeCycles: this.extractSection(content, 'Cycles de vie ou climat psychologique évolutif', 'Réalisations de vie ou environnement évolutif concret.'),
      lifeAchievements: this.extractSection(content, 'Réalisations de vie ou environnement évolutif concret.', 'L\'année personnelle'),
      personalYear: this.extractSection(content, 'L\'année personnelle', 'L\'ascendant de l\'année personnelle ou le cycle-anniversaire.'),
      yearAscendant: this.extractSection(content, 'L\'ascendant de l\'année personnelle ou le cycle-anniversaire.', 'Les cycles annuels'),
      annualCycles: this.extractSection(content, 'Les cycles annuels', 'Les réalisations annuelles'),
      annualAchievements: this.extractSection(content, 'Les réalisations annuelles', 'Les défis de l\'année personnelles'),
      annualChallenges: this.extractSection(content, 'Les défis de l\'année personnelles', 'Les domaines personnels annuels'),
      annualDomains: this.extractSection(content, 'Les domaines personnels annuels', 'L\'année universelle'),
      universalYear: this.extractSection(content, 'L\'année universelle', 'Le cycle de transition de l\'année ou magi'),
      transitionCycle: this.extractSection(content, 'Le cycle de transition de l\'année ou magi', 'Le mois personnel'),
      personalMonth: this.extractSection(content, 'Le mois personnel', 'Les astro-numéro-cycles ou astro-cycles mensuels'),
      astroCycles: this.extractSection(content, 'Les astro-numéro-cycles ou astro-cycles mensuels', 'Paramètres de notre année'),
      yearParameters: this.extractSection(content, 'Paramètres de notre année', 'Paramètres de notre excursion'),
      excursionParameters: this.extractSection(content, 'Paramètres de notre excursion', 'Plan pratique de l\'année'),
      practicalPlan: this.extractSection(content, 'Plan pratique de l\'année', 'Application'),
      application: this.extractSection(content, 'Application', 'Les 3 niveaux pratiques'),
      practicalLevels: this.extractSection(content, 'Les 3 niveaux pratiques', 'Plan symbolique intégré'),
      symbolicPlan: this.extractSection(content, 'Plan symbolique intégré', 'Le symbolique des nombres'),
      numberSymbolism: this.extractSection(content, 'Le symbolique des nombres', 'Le symbolique des lettres'),
      letterSymbolism: this.extractSection(content, 'Le symbolique des lettres', 'Table des matières')
    };
    return data;
  }

  public extractSection(content: string, start: string, end: string): string {
    const startIndex = content.indexOf(start);
    const endIndex = content.indexOf(end);
    if (startIndex !== -1 && endIndex !== -1) {
      return content.substring(startIndex + start.length, endIndex).trim();
    }
    return '';
  }

  // Méthode de chargement de données personnelles
  async loadPersonalData(name: string) {
    // Implémentation factice, à remplacer par une vraie logique de chargement
    return {
      name,
      personalTraits: ['Créatif', 'Intuitif'],
      numerologyInsights: 'Potentiel élevé de développement personnel'
    };
  }
}

export default NumeroDataLoader;
