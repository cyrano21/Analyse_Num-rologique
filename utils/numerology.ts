import moment from 'moment';

const NUMEROLOGY_VALUES: { [key: string]: number } = {
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 
  'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 1, 
  'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 
  'p': 7, 'q': 8, 'r': 9, 's': 1, 't': 2, 
  'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
};

export function calculateLifePath(birthdate: string): number {
  const date = moment(birthdate);
  const day = date.date();
  const month = date.month() + 1;
  const year = date.year();

  let sum = day + month + year;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc: number, digit: string) => {
      return acc + parseInt(digit, 10);
    }, 0);
  }
  return sum;
}

export function calculateExpressionNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  for (let char of cleanName) {
    sum += NUMEROLOGY_VALUES[char] || 0;
  }
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc: number, digit: string) => {
      return acc + parseInt(digit, 10);
    }, 0);
  }
  return sum;
}

interface ZodiacSign {
  name: string;
  symbol: string;
  start: [number, number];
  end: [number, number];
}

export function getZodiacSign(birthdate: string): ZodiacSign {
  const date = moment(birthdate);
  const day = date.date();
  const month = date.month() + 1;

  const zodiacSigns: ZodiacSign[] = [
    { name: "Capricorne", symbol: "", start: [1, 1], end: [1, 19] },
    { name: "Verseau", symbol: "", start: [1, 20], end: [2, 18] },
    { name: "Poissons", symbol: "", start: [2, 19], end: [3, 20] },
    { name: "Bélier", symbol: "", start: [3, 21], end: [4, 19] },
    { name: "Taureau", symbol: "", start: [4, 20], end: [5, 20] },
    { name: "Gémeaux", symbol: "", start: [5, 21], end: [6, 20] },
    { name: "Cancer", symbol: "", start: [6, 21], end: [7, 22] },
    { name: "Lion", symbol: "", start: [7, 23], end: [8, 22] },
    { name: "Vierge", symbol: "", start: [8, 23], end: [9, 22] },
    { name: "Balance", symbol: "", start: [9, 23], end: [10, 22] },
    { name: "Scorpion", symbol: "", start: [10, 23], end: [11, 21] },
    { name: "Sagittaire", symbol: "", start: [11, 22], end: [12, 21] },
    { name: "Capricorne", symbol: "", start: [12, 22], end: [12, 31] }
  ];

  for (let sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    // Check if the date falls within the sign's range
    if (
      (month === startMonth && day >= startDay) || 
      (month === endMonth && day <= endDay) ||
      (month > startMonth && month < endMonth)
    ) {
      return sign;
    }
  }

  // Fallback if no sign is found
  return { 
    name: "Inconnu", 
    symbol: "?", 
    start: [0, 0], 
    end: [0, 0] 
  };
}
