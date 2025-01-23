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
    description: 'Le Fou incarne l\'esprit aventureux et l\'innocence pure. Il représente le potentiel illimité de l\'âme humaine, prête à sauter dans l\'inconnu sans peur. Ce personnage symbolise la liberté totale, l\'ouverture d\'esprit et le courage de s\'aventurer sur des chemins non tracés. Il nous rappelle que chaque nouveau voyage commence par un pas audacieux, sans garantie mais avec une confiance intrinsèque en la vie.',
    reversedDescription: 'Lorsque retourné, le Fou peut signaler une imprudence excessive, une naïveté dangereuse ou une fuite devant les responsabilités. Il suggère un manque de discernement, une tendance à prendre des risques inconsidérés ou une difficulté à s\'engager dans un chemin constructif.',
    culturalContext: 'Dans la tradition des tarots de Marseille, le Fou est souvent représenté comme un personnage insouciant au bord d\'une falaise, symbolisant l\'aventure et le risque.',
    imageUrl: '/images/tarot/fou.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Bateleur',
    arcana: 'Major',
    keywords: ['Manifestation', 'Pouvoir', 'Créativité'],
    description: 'Le Bateleur représente le pouvoir alchimique de transformation et de manifestation. Il incarne l\'artiste de la vie, capable de manipuler les énergies et les ressources avec une maestria subtile. Symbolisant la volonté consciente et la créativité pure, il nous rappelle que nous sommes les architectes de notre propre réalité, capables de transformer les idées en actions concrètes.',
    reversedDescription: 'En position inversée, le Bateleur peut révéler une manipulation déloyale, un manque de concentration, ou des talents gaspillés. Il suggère une difficulté à canaliser ses énergies, à utiliser ses compétences de manière constructive, ou une tendance à la dispersion.',
    culturalContext: 'Dans les traditions ésotériques, il représente l\'alchimiste, le jongleur cosmique qui comprend l\'art de l\'illusion et de la transformation.',
    imageUrl: '/images/tarot/bateleur.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'La Papesse',
    arcana: 'Major',
    keywords: ['Intuition', 'Mystère', 'Sagesse intérieure'],
    description: 'La Papesse incarne la sagesse féminine intuitive, le savoir caché et la connexion profonde avec les mondes intérieurs. Elle représente la connaissance qui va au-delà de la logique rationnelle, invitant à écouter la voix subtile de l\'intuition. Symbole de la sagesse secrète, elle nous rappelle que les plus grandes vérités se trouvent souvent dans le silence et la réflexion intérieure.',
    reversedDescription: 'En position inversée, la Papesse peut révéler un blocage intuitif, une suranalyse paralysante, ou une déconnexion avec sa sagesse intérieure. Elle peut signaler un manque de clarté, une difficulté à faire confiance à ses intuitions ou une tendance à ignorer les messages subtils de l\'inconscient.',
    culturalContext: 'Dans les traditions ésotériques, elle symbolise la sagesse féminine, la connaissance mystique et le pouvoir de la contemplation.',
    imageUrl: '/images/tarot/papesse.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'L\'Impératrice',
    arcana: 'Major',
    keywords: ['Fertilité', 'Abondance', 'Création'],
    description: 'L\'Impératrice est l\'archétype de la création fertile, de l\'abondance et de la manifestation. Elle représente la puissance créatrice féminine, la capacité de donner vie, de nourrir et de faire croître. Au-delà de la maternité physique, elle symbolise la fertilité dans tous les domaines : projets, relations, croissance personnelle. Elle incarne la connexion avec la nature, l\'intuition créatrice et la capacité de transformer les idées en réalité concrète.',
    reversedDescription: 'En position inversée, l\'Impératrice peut indiquer des blocages créatifs, un manque de confiance en soi, des difficultés à s\'épanouir ou à faire fructifier ses talents. Elle peut suggérer une surprotection, une dépendance excessive ou une incapacité à laisser les choses se développer naturellement.',
    culturalContext: 'Dans les mythologies anciennes, elle est souvent associée aux déesses de la fertilité et de la terre, symbolisant le pouvoir générateur de vie.',
    imageUrl: '/images/tarot/imperatrice.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Pape',
    arcana: 'Major',
    keywords: ['Tradition', 'Spiritualité', 'Guidance'],
    description: 'Le Pape symbolise la sagesse spirituelle ancrée dans la tradition, mais transcendant les dogmes rigides. Il représente le pont entre le monde matériel et le royaume spirituel, offrant une guidance qui combine connaissance ancestrale et compréhension profonde. Cette carte invite à l\'apprentissage, au respect des traditions tout en cultivant une compréhension personnelle et évolutive de la spiritualité.',
    reversedDescription: 'En position inversée, le Pape peut indiquer un dogmatisme excessif, un manque de flexibilité spirituelle, ou une adhésion aveugle à des systèmes de croyances limitants. Il suggère une résistance au changement spirituel ou une interprétation trop rigide des enseignements.',
    culturalContext: 'Inspiré des traditions ésotériques où le guide spirituel représente un pont entre la connaissance terrestre et la sagesse divine.',
    imageUrl: '/images/tarot/pape.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Les Amoureux',
    arcana: 'Major',
    keywords: ['Choix', 'Harmonie', 'Relation'],
    description: 'Les Amoureux transcendent la simple notion de romance, symbolisant les choix profonds de l\'âme et l\'harmonie intérieure. Cette carte représente l\'alignement entre le cœur et la raison, l\'intégration des aspects masculin et féminin, et la capacité de faire des choix qui résonnent avec notre vérité profonde. Elle invite à l\'authenticité, à l\'équilibre et à la connexion consciente.',
    reversedDescription: 'En position inversée, les Amoureux peuvent révéler des conflits intérieurs, des choix difficiles, ou des déséquilibres relationnels. Ils suggèrent une disharmonie entre les désirs personnels, une difficulté à faire des choix alignés ou une confusion émotionnelle.',
    culturalContext: 'Dans les traditions symboliques, représente l\'union des contraires et l\'harmonie cosmique au-delà des dualismes.',
    imageUrl: '/images/tarot/amoureux.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Pendu',
    arcana: 'Major',
    keywords: ['Perspective', 'Surrender', 'Transformation'],
    description: 'Le Pendu symbolise la sagesse profonde qui naît de l\'immobilité et du lâcher-prise. Suspendu la tête en bas, il représente un changement radical de perspective, où l\'on comprend que la véritable force réside dans l\'acceptation et non dans la résistance. Cette carte invite à la méditation, à l\'introspection et à la transformation personnelle par le sacrifice volontaire de ce qui ne sert plus.',
    reversedDescription: 'En position inversée, le Pendu peut indiquer une résistance au changement, un blocage émotionnel, ou une incapacité à voir au-delà des schémas habituels. Il suggère une stagnation causée par la peur de lâcher prise ou de remettre en question ses certitudes.',
    culturalContext: 'Représente le sacrifice et la sagesse qui vient de l\'acceptation, inspiré par des traditions mystiques où l\'immobilité est vue comme une forme de contemplation profonde.',
    imageUrl: '/images/tarot/pendu.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Diable',
    arcana: 'Major',
    keywords: ['Attachement', 'Illusion', 'Matérialisme'],
    description: 'Le Diable représente les forces inconscientes qui nous enchaînent, les illusions matérielles et les attachements qui limitent notre croissance spirituelle. Il n\'est pas un symbole de mal absolu, mais un miroir révélateur de nos peurs, désirs et conditionnements. Cette carte invite à une prise de conscience profonde, à reconnaître nos chaînes intérieures et à trouver la liberté par la compréhension de soi.',
    reversedDescription: 'En position inversée, le Diable peut signifier une libération progressive des schémas limitants, une prise de conscience des mécanismes intérieurs qui nous emprisonnent. Il suggère un processus de guérison, de désidentification et de récupération de son pouvoir personnel.',
    culturalContext: 'Dans les traditions symboliques, représente les forces obscures de l\'inconscient et le potentiel de transformation par la conscience.',
    imageUrl: '/images/tarot/diable.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Monde',
    arcana: 'Major',
    keywords: ['Accomplissement', 'Complétude', 'Réalisation'],
    description: 'Le Monde symbolise l\'accomplissement ultime, la complétude et l\'intégration de toutes les expériences de vie. C\'est le point culminant du voyage spirituel, où tous les cycles sont bouclés et où l\'âme atteint un état d\'harmonie et de sagesse. Cette carte célèbre la victoire intérieure, la reconnaissance de soi et la danse cosmique de l\'existence.',
    reversedDescription: 'En position inversée, le Monde peut indiquer un sentiment d\'inachèvement, des obstacles persistants à la réalisation personnelle, ou une difficulté à intégrer pleinement les leçons de vie. Il suggère un besoin de patience et de travail intérieur pour atteindre la complétude.',
    culturalContext: 'Dans les traditions mystiques, représente le cycle de l\'évolution spirituelle et l\'unité avec le cosmos.',
    imageUrl: '/images/tarot/monde.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'L\'Étoile',
    arcana: 'Major',
    keywords: ['Espoir', 'Inspiration', 'Renouveau'],
    description: 'L\'Étoile est le symbole de l\'espoir régénérateur, de l\'inspiration divine et du renouveau spirituel. Après les épreuves symbolisées par les cartes précédentes, elle représente un moment de grâce, de guérison et de reconnexion avec sa source intérieure. Cette carte invite à la confiance, à l\'ouverture et à l\'acceptation bienveillante de la guidance cosmique.',
    reversedDescription: 'En position inversée, l\'Étoile peut révéler un manque d\'espoir, des doutes profonds, une perte de direction spirituelle ou une difficulté à faire confiance au processus de la vie. Elle suggère un besoin de recentrage et de reconnexion avec sa lumière intérieure.',
    culturalContext: 'Dans les traditions symboliques, représente la lumière de la conscience qui guide l\'âme à travers les périodes obscures.',
    imageUrl: '/images/tarot/etoile.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'Le Soleil',
    arcana: 'Major',
    keywords: ['Joie', 'Succès', 'Clarté'],
    description: 'Le Soleil incarne la lumière de la conscience, la joie pure et la clarté radieuse. Il représente un moment de triomphe intérieur, où les obstacles s\'effacent devant la puissance de l\'optimisme et de l\'authenticité. Cette carte célèbre la victoire de la lumière sur l\'obscurité, l\'épanouissement personnel et la connexion joyeuse avec sa vérité profonde.',
    reversedDescription: 'En position inversée, le Soleil peut indiquer des doutes persistants, un manque de confiance en soi, ou des obstacles qui semblent obscurcir la vision. Il suggère un besoin de retrouver sa force intérieure et de cultiver une perspective positive.',
    culturalContext: 'Dans les traditions symboliques, représente la force vitale, la conscience illuminée et le principe créateur.',
    imageUrl: '/images/tarot/soleil.webp',
    isReversed: Math.random() < 0.3,
  },
  {
    id: uuidv4(),
    name: 'La Lune',
    arcana: 'Major',
    keywords: ['Mystère', 'Intuition', 'Inconscient'],
    description: 'La Lune est le royaume des mystères profonds, des mondes invisibles et de l\'intuition subtile. Elle représente les royaumes de l\'inconscient, les paysages émotionnels cachés et les vérités qui se trouvent au-delà de la perception rationnelle. Cette carte invite à explorer les profondeurs de l\'âme, à faire confiance à l\'intuition et à naviguer à travers les illusions et les ombres.',
    reversedDescription: 'En position inversée, la Lune peut révéler des illusions tenaces, des peurs inconscientes non résolues, ou une confusion émotionnelle. Elle suggère un besoin de clarification intérieure et de confrontation avec ses zones d\'ombre.',
    culturalContext: 'Dans les traditions mystiques, symbolise le monde des rêves, les cycles cachés et la sagesse intuitive féminine.',
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

export function interpretTarotCard(card: TarotCard): string {
  const baseInterpretation = card.isReversed 
    ? card.reversedDescription 
    : card.description;

  const lifeAreas = [
    'Carrière et Ambitions',
    'Relations Personnelles',
    'Développement Spirituel',
    'Santé et Bien-être',
    'Croissance Personnelle'
  ];

  const actionRecommendations = [
    'Réfléchissez profondément à vos motivations actuelles.',
    'Soyez ouvert aux nouvelles perspectives.',
    'Prenez du recul et analysez la situation objectivement.',
    'Faites confiance à votre intuition.',
    'Restez flexible et adaptable.'
  ];

  const randomLifeArea = lifeAreas[Math.floor(Math.random() * lifeAreas.length)];
  const randomRecommendation = actionRecommendations[Math.floor(Math.random() * actionRecommendations.length)];

  return `
 Interprétation de ${card.name} ${card.isReversed ? '(Carte Inversée)' : ''}

Signification Générale:
${baseInterpretation}

Domaine de Vie Impacté: ${randomLifeArea}

Recommandation d'Action:
${randomRecommendation}

Mots-Clés:
${card.keywords.map(keyword => `• ${keyword}`).join('\n')}

Contexte Culturel:
${card.culturalContext}

Réflexion Personnelle:
Prenez un moment pour méditer sur comment cette carte résonne avec votre parcours actuel.
`;
}

function drawThreeUniqueCards(): TarotCard[] {
  const drawnCards: TarotCard[] = [];
  const availableCards = [...MAJOR_ARCANA];

  while (drawnCards.length < 3 && availableCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const card = availableCards[randomIndex];
    
    // Randomly decide if the card is reversed
    card.isReversed = Math.random() < 0.3;
    
    drawnCards.push(card);
    availableCards.splice(randomIndex, 1);
  }

  return drawnCards;
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
      interpretation = `
🔮 Tirage d'Une Carte - Guidance Instantanée

Cette carte offre un aperçu rapide et direct de votre situation actuelle. 
Elle vous invite à réfléchir sur un aspect spécifique de votre vie qui nécessite votre attention immédiate.

Conseils pour l'Interprétation:
• Observez vos premières réactions
• Notez les émotions et pensées qui émergent
• Considérez comment cette carte s'aligne avec votre parcours actuel
`;
      break;

    case 'ThreePast':
      let pastCard = drawTarotCard('Major');
      let presentCard = drawTarotCard('Major');
      let futureCard = drawTarotCard('Major');

      // Ensure cards are unique
      while (presentCard.name === pastCard.name) {
        presentCard = drawTarotCard('Major');
      }
      while (futureCard.name === pastCard.name || futureCard.name === presentCard.name) {
        futureCard = drawTarotCard('Major');
      }

      cards = [pastCard, presentCard, futureCard];
      interpretation = createThreeCardNarrative(cards);
      break;

    case 'Celtic':
      cards = [
        drawTarotCard('Major'), // Central
        drawTarotCard('Major'), // Immediate
        drawTarotCard('Major'), // Challenges
        drawTarotCard('Major'), // Past
        drawTarotCard('Major'), // Future
        drawTarotCard('Major'), // External
        drawTarotCard('Major')  // Outcome
      ];
      interpretation = createCelticCrossNarrative(cards);
      break;
  }

  return { cards, interpretation };
}

export function createThreeCardNarrative(cards: TarotCard[]): string {
  if (cards.length !== 3) {
    throw new Error('Three Card Narrative requires exactly 3 cards (Past, Present, Future)');
  }

  const [past, present, future] = cards;

  const narrativeStructure = [
    {
      condition: () => true,
      narrative: `
🔮 Lecture des Trois Temps - Voyage Spirituel

PASSÉ : ${past.name}
${past.description}

PRÉSENT : ${present.name}
${present.description}

FUTUR : ${future.name}
${future.description}

Transformation des Obstacles :
• Comment les énergies du passé influencent-elles votre présent ?
• Quels schémas cherchez-vous à transcender ?
• Comment pouvez-vous aligner vos intentions futures ?

Flux Énergétique :
1. Passé : ${past.keywords.join(', ')}
2. Présent : ${present.keywords.join(', ')}
3. Futur : ${future.keywords.join(', ')}

Questions de Réflexion Profonde :
1. Quels motifs récurrents voyez-vous entre ces cartes ?
2. Comment vos défis actuels sont-ils connectés à vos expériences passées ?
3. Quelles ressources intérieures pouvez-vous mobiliser pour naviguer ces énergies ?

Conseil Principal :
Chaque carte est un miroir de votre réalité intérieure. Ne les considérez pas isolément, mais comme un dialogue dynamique et interconnecté.

Invitation à la Transformation :
Laissez ce tirage être un guide, pas une prophétie. Votre libre arbitre et votre conscience sont les véritables outils de votre évolution.
`
    }
  ];

  // Trouver le premier modèle de narration qui correspond
  const matchedNarrative = narrativeStructure.find(template => 
    template.condition()
  );

  return matchedNarrative ? matchedNarrative.narrative : narrativeStructure[0].narrative;
}

export function createCelticCrossNarrative(cards: TarotCard[]): string {
  // Assuming 7 cards in the Celtic Cross spread
  const [central, immediate, challenges, past, future, external, outcome] = cards;

  const narrativeStructure = [
    {
      condition: () => true, // Default narrative
      narrative: `
🔮 Exploration Multidimensionnelle de Votre Parcours 🔮

Structure Profonde du Tirage :

1. Situation Centrale (${central.name}) :
${central.description}
Cette carte représente le cœur de votre questionnement actuel. Elle révèle l'essence de votre défi ou aspiration principale.

2. Influences Immédiates (${immediate.name}) :
${immediate.description}
Les énergies qui agissent directement sur votre situation, créant un contexte immédiat et dynamique.

3. Défis et Obstacles (${challenges.name}) :
${challenges.description}
Les barrières internes ou externes qui vous empêchent de progresser. Comprendre ces obstacles est la clé de leur transformation.

4. Fondations Passées (${past.name}) :
${past.description}
Les racines de votre situation actuelle. Comment vos expériences précédentes façonnent-elles votre présent ?

5. Potentiel Futur (${future.name}) :
${future.description}
Les possibilités émergentes et les directions potentielles de votre parcours.

6. Influences Externes (${external.name}) :
${external.description}
Les facteurs environnementaux, sociaux ou relationnels qui impactent votre situation.

7. Résultat Potentiel (${outcome.name}) :
${outcome.description}
La résolution possible ou la transformation ultime de votre situation actuelle.

🌟 Analyse Intégrée 🌟

Dynamique Globale :
• Connexion Centrale : Comment la carte centrale (${central.name}) interagit-elle avec les influences immédiates et les défis ?
• Transformation des Obstacles : La carte des défis (${challenges.name}) offre-t-elle une opportunité de croissance ?
• Flux Énergétique : Observez le mouvement des énergies du passé vers le futur.

Questions de Réflexion Profonde :
1. Quels schémas récurrents voyez-vous entre ces cartes ?
2. Comment vos défis actuels sont-ils connectés à vos expériences passées ?
3. Quelles ressources intérieures pouvez-vous mobiliser pour naviguer ces énergies ?

Conseil Principal :
Chaque carte est un miroir de votre réalité intérieure. Ne les considérez pas isolément, mais comme un dialogue dynamique et interconnecté.

Invitation à la Transformation :
Laissez ce tirage être un guide, pas une prophétie. Votre libre arbitre et votre conscience sont les véritables outils de votre évolution.
`
    }
  ];

  // Trouver le premier modèle de narration qui correspond
  const matchedNarrative = narrativeStructure.find(template => 
    template.condition()
  );

  return matchedNarrative ? matchedNarrative.narrative : narrativeStructure[0].narrative;
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
