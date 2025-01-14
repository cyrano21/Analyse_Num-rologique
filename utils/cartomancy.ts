import { v4 as uuidv4 } from 'uuid';

export interface TarotCard {
  id: string;
  name: string;
  arcana: 'Major' | 'Minor';
  suit?: string; // For Minor Arcana
  number?: number; // For Minor Arcana
  keywords: string[];
  description: string;
  reversedDescription: string;
  culturalContext: string;
  imageUrl: string;
  isReversed: boolean;
}

// Major Arcana Deck
export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: uuidv4(),
    name: 'Le Fou',
    arcana: 'Major',
    keywords: ['Nouveaux départs', 'Innocence', 'Spontanéité'],
    description: 'Le Fou représente le potentiel illimité et l\'aventure. Il symbolise la liberté, l\'optimisme et le courage de commencer un nouveau voyage.',
    reversedDescription: 'Imprudence, risques inconsidérés, manque de direction ou peur du changement.',
    culturalContext: 'Dans la tradition des tarots de Marseille, le Fou est souvent représenté comme un personnage insouciant au bord d\'une falaise, symbolisant l\'aventure et le risque.',
    imageUrl: '/images/tarot/fou.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Bateleur',
    arcana: 'Major',
    keywords: ['Manifestation', 'Pouvoir', 'Créativité'],
    description: 'Le Bateleur symbolise le pouvoir de transformer les idées en réalité grâce à la volonté et aux compétences.',
    reversedDescription: 'Indique une manipulation, un manque de concentration ou des opportunités manquées.',
    culturalContext: 'Représente l\'alchimiste, le maître des arts et des illusions',
    imageUrl: '/images/tarot/bateleur.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'La Papesse',
    arcana: 'Major',
    keywords: ['Intuition', 'Mystère', 'Sagesse intérieure'],
    description: 'La Papesse représente la sagesse intuitive, la connaissance cachée et la réflexion profonde.',
    reversedDescription: 'Suggère un blocage intuitif, un manque de clarté ou une suranalyse.',
    culturalContext: 'Symbolise la sagesse féminine et la connexion avec le monde spirituel',
    imageUrl: '/images/tarot/papesse.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'L\'Impératrice',
    arcana: 'Major',
    keywords: ['Fertilité', 'Abondance', 'Création'],
    description: 'L\'Impératrice incarne la fertilité, la créativité et l\'abondance dans tous les domaines de la vie.',
    reversedDescription: 'Peut indiquer des blocages créatifs, un manque de confiance ou des difficultés à s\'épanouir.',
    culturalContext: 'Représente la puissance créatrice féminine et la nature nourricière',
    imageUrl: '/images/tarot/imperatrice.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Pape',
    arcana: 'Major',
    keywords: ['Tradition', 'Spiritualité', 'Guidance'],
    description: 'Le Pape symbolise la sagesse traditionnelle, la spiritualité et le conseil spirituel.',
    reversedDescription: 'Peut suggérer un dogmatisme excessif, un manque de flexibilité spirituelle.',
    culturalContext: 'Représente l\'autorité spirituelle et l\'enseignement traditionnel',
    imageUrl: '/images/tarot/pape.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Les Amoureux',
    arcana: 'Major',
    keywords: ['Choix', 'Harmonie', 'Relation'],
    description: 'Les Amoureux représentent les choix importants, l\'harmonie et les relations significatives.',
    reversedDescription: 'Peut indiquer des conflits intérieurs, des choix difficiles ou des déséquilibres relationnels.',
    culturalContext: 'Symbolise l\'union, le choix et l\'équilibre émotionnel',
    imageUrl: '/images/tarot/amoureux.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Pendu',
    arcana: 'Major',
    keywords: ['Perspective', 'Surrender', 'Transformation'],
    description: 'Le Pendu symbolise un changement de perspective, le lâcher-prise et la transformation personnelle.',
    reversedDescription: 'Peut suggérer une résistance au changement, un manque de flexibilité ou une stagnation.',
    culturalContext: 'Représente le sacrifice et la sagesse qui vient de l\'acceptation',
    imageUrl: '/images/tarot/pendu.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Diable',
    arcana: 'Major',
    keywords: ['Attachement', 'Illusion', 'Matérialisme'],
    description: 'Le Diable représente les attachements matériels, les illusions et les limitations auto-imposées.',
    reversedDescription: 'Peut indiquer une libération des chaînes, une prise de conscience.',
    culturalContext: 'Symbolise les tentations et les obstacles intérieurs',
    imageUrl: '/images/tarot/diable.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Monde',
    arcana: 'Major',
    keywords: ['Accomplissement', 'Complétude', 'Réalisation'],
    description: 'Le Monde symbolise l\'accomplissement, la complétude et la réalisation de soi.',
    reversedDescription: 'Peut suggérer des obstacles à la réalisation, un sentiment d\'inachèvement.',
    culturalContext: 'Représente l\'aboutissement d\'un cycle et l\'harmonie universelle',
    imageUrl: '/images/tarot/monde.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'L\'Étoile',
    arcana: 'Major',
    keywords: ['Espoir', 'Inspiration', 'Renouveau'],
    description: 'L\'Étoile apporte l\'espoir, l\'inspiration et un sentiment de renouveau spirituel.',
    reversedDescription: 'Peut indiquer un manque d\'espoir, des doutes, une perte de direction.',
    culturalContext: 'Symbolise la guidance divine et la lumière intérieure',
    imageUrl: '/images/tarot/etoile.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Soleil',
    arcana: 'Major',
    keywords: ['Joie', 'Succès', 'Clarté'],
    description: 'Le Soleil représente la joie, le succès et la clarté dans tous les aspects de la vie.',
    reversedDescription: 'Peut suggérer des doutes, un manque de confiance ou des obstacles.',
    culturalContext: 'Symbolise la lumière, la positivité et l\'épanouissement',
    imageUrl: '/images/tarot/soleil.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'La Lune',
    arcana: 'Major',
    keywords: ['Mystère', 'Intuition', 'Inconscient'],
    description: 'La Lune représente le mystère, l\'intuition et les profondeurs de l\'inconscient.',
    reversedDescription: 'Peut indiquer des illusions, des peurs cachées ou une confusion intérieure.',
    culturalContext: 'Symbolise l\'inconnu, les rêves et les mondes intérieurs',
    imageUrl: '/images/tarot/lune.webp',
    isReversed: Math.random() < 0.3,
  }
];

// Minor Arcana Placeholder (to be expanded)
export const MINOR_ARCANA: TarotCard[] = [
  {
    id: uuidv4(),
    name: 'As de Bâtons',
    arcana: 'Minor',
    suit: 'Wands',
    number: 1,
    keywords: ['Inspiration', 'Création', 'Potentiel'],
    description: 'Symbolise le début d\'un projet créatif ou d\'une nouvelle entreprise.',
    reversedDescription: 'Suggère des blocages créatifs ou un manque de motivation.',
    culturalContext: '',
    imageUrl: '/images/tarot/wands_ace.jpg',
    isReversed: Math.random() < 0.3,
  },
  // Add more Minor Arcana cards...
];

export const DEFAULT_CARD: TarotCard = {
  id: 'default',
  name: 'Carte par défaut',
  arcana: 'Major',
  keywords: ['Mystère', 'Attente'],
  description: 'Carte en attente de tirage',
  reversedDescription: 'Carte en attente de tirage',
  culturalContext: 'Carte par défaut',
  imageUrl: '/images/tarot/default_card.png',
  isReversed: false
};

export function drawTarotCard(arcanaType: 'Major' | 'Minor' | 'All' = 'Major'): TarotCard {
  let deck: TarotCard[];
  
  switch (arcanaType) {
    case 'Major':
      deck = MAJOR_ARCANA;
      break;
    case 'Minor':
      deck = MINOR_ARCANA;
      break;
    case 'All':
      deck = [...MAJOR_ARCANA, ...MINOR_ARCANA];
      break;
  }

  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck[randomIndex];

  return {
    ...card,
    isReversed: Math.random() < 0.3
  };
}

export function drawTarotSpread(spreadType: 'Single' | 'ThreePast' | 'Celtic'): { 
  cards: TarotCard[], 
  interpretation: string 
} {
  let cards: TarotCard[];
  let interpretation: string;

  switch (spreadType) {
    case 'Single':
      cards = [drawTarotCard()];
      interpretation = 'Un tirage d\'une seule carte pour une guidance rapide et directe.';
      break;
    case 'ThreePast':
      cards = [
        drawTarotCard(),
        drawTarotCard(),
        drawTarotCard()
      ];
      interpretation = 'Un tirage classique explorant le passé, le présent et le futur.';
      break;
    case 'Celtic':
      cards = Array.from({ length: 7 }, () => drawTarotCard());
      interpretation = 'Le tirage de la Croix Celtique, un spread complexe offrant une analyse approfondie.';
      break;
  }

  return { 
    cards, 
    interpretation 
  };
}

export function interpretTarotCard(card: TarotCard): string {
  return card.isReversed 
    ? `Version inversée : ${card.reversedDescription}\n\nContexte culturel : ${card.culturalContext}`
    : `${card.description}\n\nContexte culturel : ${card.culturalContext}`;
}

export function drawCards(deckType: 'tarot' | 'oracle' | 'playing'): string[] {
  const tarotDeck = MAJOR_ARCANA.map(card => card.name);
  const drawCount = deckType === 'tarot' ? 3 : 1;
  
  return Array.from({ length: drawCount }, () => {
    const randomCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    return randomCard;
  });
}

export function interpretCards(cards: string[], deckType: 'tarot' | 'oracle' | 'playing' = 'tarot'): string {
  if (deckType !== 'tarot') {
    return 'Interprétation non disponible pour ce type de deck.';
  }

  const interpretedCards = cards.map(cardName => {
    const card = MAJOR_ARCANA.find(c => c.name === cardName);
    return card ? `${card.name}: ${card.description}` : cardName;
  });

  return interpretedCards.join(' | ');
}
