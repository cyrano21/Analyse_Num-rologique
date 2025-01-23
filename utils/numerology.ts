export function calculateLifePath(birthdate: string): number {
  // Format attendu: YYYY-MM-DD
  const numbers = birthdate.split('-').join('').split('').map(Number);
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return reduceToSingleDigit(sum);
}

export function calculateExpressionNumber(name: string): number {
  const letterValues: { [key: string]: number } = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
  };

  const sum = name.toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('')
    .reduce((acc, letter) => acc + (letterValues[letter] || 0), 0);

  return reduceToSingleDigit(sum);
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  dates: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  traits: string[];
}

export function getZodiacSign(birthdate: string): ZodiacSign {
  // Format attendu: YYYY-MM-DD
  const date = new Date(birthdate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const signs = [
    {
      name: 'Capricorne', symbol: '♑', start: [1, 1], end: [1, 19],
      dates: "22 décembre - 19 janvier", element: "Terre", quality: "Cardinal",
      rulingPlanet: "Saturne", traits: ["Ambitieux", "Pragmatique", "Discipliné"]
    },
    {
      name: 'Verseau', symbol: '♒', start: [1, 20], end: [2, 18],
      dates: "20 janvier - 18 février", element: "Air", quality: "Fixe",
      rulingPlanet: "Uranus", traits: ["Innovant", "Indépendant", "Humanitaire"]
    },
    {
      name: 'Poissons', symbol: '♓', start: [2, 19], end: [3, 20],
      dates: "19 février - 20 mars", element: "Eau", quality: "Mutable",
      rulingPlanet: "Neptune", traits: ["Empathique", "Rêveur", "Artiste"]
    },
    {
      name: 'Bélier', symbol: '♈', start: [3, 21], end: [4, 19],
      dates: "21 mars - 19 avril", element: "Feu", quality: "Cardinal",
      rulingPlanet: "Mars", traits: ["Courageux", "Déterminé", "Confiant"]
    },
    {
      name: 'Taureau', symbol: '♉', start: [4, 20], end: [5, 20],
      dates: "20 avril - 20 mai", element: "Terre", quality: "Fixe",
      rulingPlanet: "Vénus", traits: ["Fiable", "Pratique", "Patient"]
    },
    {
      name: 'Gémeaux', symbol: '♊', start: [5, 21], end: [6, 20],
      dates: "21 mai - 20 juin", element: "Air", quality: "Mutable",
      rulingPlanet: "Mercure", traits: ["Adaptable", "Curieux", "Communicatif"]
    },
    {
      name: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22],
      dates: "21 juin - 22 juillet", element: "Eau", quality: "Cardinal",
      rulingPlanet: "Lune", traits: ["Émotionnel", "Protecteur", "Intuitif"]
    },
    {
      name: 'Lion', symbol: '♌', start: [7, 23], end: [8, 22],
      dates: "23 juillet - 22 août", element: "Feu", quality: "Fixe",
      rulingPlanet: "Soleil", traits: ["Charismatique", "Créatif", "Généreux"]
    },
    {
      name: 'Vierge', symbol: '♍', start: [8, 23], end: [9, 22],
      dates: "23 août - 22 septembre", element: "Terre", quality: "Mutable",
      rulingPlanet: "Mercure", traits: ["Analytique", "Pratique", "Diligent"]
    },
    {
      name: 'Balance', symbol: '♎', start: [9, 23], end: [10, 22],
      dates: "23 septembre - 22 octobre", element: "Air", quality: "Cardinal",
      rulingPlanet: "Vénus", traits: ["Diplomate", "Équilibré", "Sociable"]
    },
    {
      name: 'Scorpion', symbol: '♏', start: [10, 23], end: [11, 21],
      dates: "23 octobre - 21 novembre", element: "Eau", quality: "Fixe",
      rulingPlanet: "Pluton", traits: ["Passionné", "Déterminé", "Mystérieux"]
    },
    {
      name: 'Sagittaire', symbol: '♐', start: [11, 22], end: [12, 21],
      dates: "22 novembre - 21 décembre", element: "Feu", quality: "Mutable",
      rulingPlanet: "Jupiter", traits: ["Optimiste", "Aventurier", "Philosophe"]
    },
    {
      name: 'Capricorne', symbol: '♑', start: [12, 22], end: [12, 31],
      dates: "22 décembre - 19 janvier", element: "Terre", quality: "Cardinal",
      rulingPlanet: "Saturne", traits: ["Ambitieux", "Pragmatique", "Discipliné"]
    }
  ];

  for (const sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign;
    }
  }

  return {
    name: 'Inconnu',
    symbol: '?',
    dates: '',
    element: '',
    quality: '',
    rulingPlanet: '',
    traits: []
  };
}

function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return num;
}

export interface NumerologyProfile {
  lifePath: number;
  expressionNumber: number;
  zodiacSign: ZodiacSign;
}

export function getLifePathDescription(lifePath: number): string {
  const descriptions = {
    1: `Le Chemin de Vie 1 représente le leadership et l'indépendance. En tant que pionnier naturel, vous êtes destiné à ouvrir de nouvelles voies. Votre essence est caractérisée par l'originalité, l'ambition et une forte capacité à diriger. Vous excellez dans l'innovation et l'initiative.`,
    
    2: `Le Chemin de Vie 2 incarne la coopération et la diplomatie. Votre essence est celle du médiateur et du pacificateur. Doté d'une grande sensibilité et d'intuition, vous excellez dans les relations et le travail d'équipe. L'harmonie et l'équilibre sont vos forces.`,
    
    3: `Le Chemin de Vie 3 représente l'expression créative et la joie de vivre. Votre essence est artistique et communicative. Naturellement optimiste et expressif, vous avez un don pour inspirer les autres. La créativité et l'expression personnelle sont vos atouts majeurs.`,
    
    4: `Le Chemin de Vie 4 symbolise la stabilité et la construction. Votre essence est celle du bâtisseur et de l'organisateur. Méthodique et travailleur, vous excellez dans l'établissement de bases solides. La fiabilité et la persévérance sont vos qualités fondamentales.`,
    
    5: `Le Chemin de Vie 5 incarne la liberté et le changement. Votre essence est aventurière et adaptable. Vous êtes naturellement curieux et polyvalent, toujours prêt à explorer de nouveaux horizons. La versatilité et l'adaptabilité sont vos forces principales.`,
    
    6: `Le Chemin de Vie 6 représente l'harmonie et la responsabilité. Votre essence est nurturante et protectrice. Vous avez un don naturel pour prendre soin des autres et créer de la beauté. La compassion et le sens des responsabilités sont vos qualités dominantes.`,
    
    7: `Le Chemin de Vie 7 symbolise la recherche spirituelle et l'analyse. Votre essence est celle du chercheur et du penseur. Profondément analytique et intuitif, vous excellez dans la quête de connaissance. La sagesse et la perspicacité sont vos atouts majeurs.`,
    
    8: `Le Chemin de Vie 8 incarne le pouvoir et l'abondance. Votre essence est celle du dirigeant et du manifesteur. Vous avez un talent naturel pour les affaires et l'organisation. L'autorité et la maîtrise matérielle sont vos forces principales.`,
    
    9: `Le Chemin de Vie 9 représente l'humanitaire et l'accomplissement. Votre essence est compassionnelle et universelle. Vous avez une grande capacité à servir l'humanité. La sagesse et l'altruisme sont vos qualités fondamentales.`
  };

  return descriptions[lifePath] || "Chemin de vie non reconnu";
}

export function getExpressionNumberDescription(expressionNumber: number): string {
  const descriptions = {
    1: `Votre Nombre d'Expression 1 révèle un potentiel de leader et d'innovateur. Vous possédez une forte individualité et une capacité naturelle à initier de nouveaux projets. Votre potentiel intrinsèque est orienté vers l'originalité et l'indépendance.`,
    
    2: `Votre Nombre d'Expression 2 indique un talent naturel pour la collaboration et la diplomatie. Votre potentiel intrinsèque réside dans votre capacité à créer l'harmonie et à travailler en équipe. La sensibilité et l'adaptabilité sont vos dons naturels.`,
    
    3: `Votre Nombre d'Expression 3 dévoile un potentiel créatif exceptionnel. Vous avez un don naturel pour l'expression artistique et la communication. Votre potentiel intrinsèque s'exprime à travers la créativité et le partage des idées.`,
    
    4: `Votre Nombre d'Expression 4 révèle un talent naturel pour l'organisation et la construction. Votre potentiel intrinsèque se manifeste dans votre capacité à créer des structures solides et durables. La fiabilité et la précision sont vos forces naturelles.`,
    
    5: `Votre Nombre d'Expression 5 indique un potentiel d'adaptabilité et de polyvalence remarquable. Vous possédez une capacité naturelle à embrasser le changement et à communiquer. Votre potentiel intrinsèque est orienté vers l'exploration et la liberté.`,
    
    6: `Votre Nombre d'Expression 6 dévoile un talent naturel pour l'harmonie et le soin des autres. Votre potentiel intrinsèque s'exprime dans la création de beauté et l'établissement de relations harmonieuses. La responsabilité et la créativité sont vos dons.`,
    
    7: `Votre Nombre d'Expression 7 révèle un potentiel intellectuel et spirituel profond. Vous possédez une capacité naturelle pour l'analyse et la recherche. Votre potentiel intrinsèque est orienté vers la quête de connaissances et la compréhension.`,
    
    8: `Votre Nombre d'Expression 8 indique un potentiel remarquable pour la réussite matérielle et l'organisation. Votre potentiel intrinsèque se manifeste dans votre capacité à gérer et à créer l'abondance. Le leadership et l'efficacité sont vos forces.`,
    
    9: `Votre Nombre d'Expression 9 dévoile un potentiel humanitaire et universel. Vous avez un don naturel pour inspirer et aider les autres. Votre potentiel intrinsèque s'exprime à travers la compassion et la sagesse.`
  };

  return descriptions[expressionNumber] || "Nombre d'expression non reconnu";
}

export function getZodiacSignDescription(zodiacSign: string): string {
  const descriptions = {
    'Bélier': `Votre signe solaire Bélier définit votre identité astrologique comme celle d'un pionnier dynamique et courageux. Premier signe du zodiaque, il vous confère une nature entreprenante et passionnée. Dirigé par Mars, vous êtes naturellement porté vers l'action et les nouveaux défis.`,
    
    'Taureau': `Votre signe solaire Taureau forme une identité astrologique stable et déterminée. Gouverné par Vénus, vous êtes naturellement attiré par la beauté et le confort. Votre force réside dans votre persévérance et votre sens pratique.`,
    
    'Gémeaux': `Votre signe solaire Gémeaux façonne une identité astrologique versatile et communicative. Sous l'influence de Mercure, vous possédez une grande curiosité intellectuelle et une adaptabilité remarquable. Votre force est dans votre capacité à apprendre et à communiquer.`,
    
    'Cancer': `Votre signe solaire Cancer crée une identité astrologique intuitive et protectrice. Gouverné par la Lune, vous êtes profondément émotif et attentif aux besoins des autres. Votre force réside dans votre sensibilité et votre capacité à nourrir.`,
    
    'Lion': `Votre signe solaire Lion forge une identité astrologique charismatique et créative. Dirigé par le Soleil, vous rayonnez naturellement et inspirez les autres. Votre force est dans votre capacité à diriger et à exprimer votre créativité.`,
    
    'Vierge': `Votre signe solaire Vierge définit une identité astrologique analytique et méthodique. Sous l'influence de Mercure, vous excellez dans l'analyse et l'organisation. Votre force réside dans votre précision et votre sens du service.`,
    
    'Balance': `Votre signe solaire Balance compose une identité astrologique diplomatique et harmonieuse. Gouvernée par Vénus, vous recherchez naturellement l'équilibre et la justice. Votre force est dans votre capacité à créer l'harmonie et à maintenir des relations.`,
    
    'Scorpion': `Votre signe solaire Scorpion forme une identité astrologique intense et perspicace. Dirigé par Pluton, vous possédez une grande profondeur émotionnelle et un pouvoir de transformation. Votre force réside dans votre capacité à régénérer et à percer les mystères.`,
    
    'Sagittaire': `Votre signe solaire Sagittaire crée une identité astrologique optimiste et aventureuse. Sous l'influence de Jupiter, vous êtes naturellement philosophe et exploratateur. Votre force est dans votre vision élargie et votre quête de vérité.`,
    
    'Capricorne': `Votre signe solaire Capricorne forge une identité astrologique ambitieuse et disciplinée. Gouverné par Saturne, vous excellez dans la construction et l'organisation. Votre force réside dans votre persévérance et votre sens des responsabilités.`,
    
    'Verseau': `Votre signe solaire Verseau définit une identité astrologique innovante et humanitaire. Dirigé par Uranus, vous êtes naturellement tourné vers le futur et l'originalité. Votre force est dans votre capacité à innover et à rassembler.`,
    
    'Poissons': `Votre signe solaire Poissons compose une identité astrologique intuitive et compassionnelle. Sous l'influence de Neptune, vous possédez une grande sensibilité et une créativité unique. Votre force réside dans votre intuition et votre capacité à comprendre les autres.`
  };

  return descriptions[zodiacSign] || "Signe astrologique non reconnu";
}

export function getPersonalityTraits(profile: NumerologyProfile): string {
  const lifePath = getLifePathDescription(profile.lifePath);
  const expression = getExpressionNumberDescription(profile.expressionNumber);
  const zodiac = getZodiacSignDescription(profile.zodiacSign.name);

  return `Analyse des Traits de Personnalité :

${lifePath}

${expression}

${zodiac}

Cette combinaison unique de votre Chemin de Vie ${profile.lifePath}, votre Nombre d'Expression ${profile.expressionNumber} et votre signe ${profile.zodiacSign.name} crée une personnalité riche et multidimensionnelle. Chacun de ces aspects contribue à votre développement personnel et à votre potentiel de réalisation.`;
}
