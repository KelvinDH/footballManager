export interface Team {
  id: number;
  name: string;
  fans: number;
  logo: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  attack: number;
  defense: number;
  money: number; // Novo campo para o saldo de dinheiro
}

export interface Sponsor {
  id: number;
  name: string;
  minFans: number;
  value: number;
  logo: string;
}

export interface Match {
  id: number;
  homeTeam: number;
  awayTeam: number;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
}

export const teams: Team[] = [
  { id: 1, name: "FC Estrela Azul", fans: 500000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 75, defense: 70, money: 1000000 },
  { id: 2, name: "Atlético Leão", fans: 750000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 80, defense: 75, money: 1500000 },
  { id: 3, name: "Cruzeiro do Sul FC", fans: 600000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 72, defense: 78, money: 1200000 },
  { id: 4, name: "Águia Dourada", fans: 450000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 68, defense: 72, money: 900000 },
  { id: 5, name: "Dragões Vermelhos", fans: 800000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 82, defense: 76, money: 1600000 },
  { id: 6, name: "Tigres Unidos", fans: 550000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 70, defense: 74, money: 1100000 },
  { id: 7, name: "Falcões Negros", fans: 700000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 78, defense: 73, money: 1400000 },
  { id: 8, name: "Leões da Serra", fans: 480000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 71, defense: 69, money: 960000 },
  { id: 9, name: "Panteras FC", fans: 620000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 76, defense: 72, money: 1240000 },
  { id: 10, name: "Tubarões Azuis", fans: 530000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 73, defense: 71, money: 1060000 },
  { id: 11, name: "Gorilas United", fans: 680000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 77, defense: 75, money: 1360000 },
  { id: 12, name: "Lobos da Noite", fans: 510000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 72, defense: 70, money: 1020000 },
  { id: 13, name: "Ursos Polares", fans: 590000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 74, defense: 73, money: 1180000 },
  { id: 14, name: "Raposas Vermelhas", fans: 470000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 69, defense: 71, money: 940000 },
  { id: 15, name: "Touros Furiosos", fans: 720000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 79, defense: 74, money: 1440000 },
  { id: 16, name: "Cavalos Selvagens", fans: 540000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 71, defense: 72, money: 1080000 },
  { id: 17, name: "Cobras Venenosas", fans: 630000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 75, defense: 76, money: 1260000 },
  { id: 18, name: "Rinocerontes FC", fans: 490000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 70, defense: 77, money: 980000 },
  { id: 19, name: "Crocodilos Verdes", fans: 570000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 73, defense: 75, money: 1140000 },
  { id: 20, name: "Águias Imperiais", fans: 660000, logo: "/placeholder.svg?height=100&width=100", points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, attack: 76, defense: 74, money: 1320000 },
];

export const sponsors: Sponsor[] = [
  { id: 1, name: "SuperCola", minFans: 500000, value: 1000000, logo: "/placeholder.svg?height=50&width=100" },
  { id: 2, name: "MegaBank", minFans: 700000, value: 1500000, logo: "/placeholder.svg?height=50&width=100" },
  { id: 3, name: "TechGigante", minFans: 600000, value: 1200000, logo: "/placeholder.svg?height=50&width=100" },
  { id: 4, name: "EsporteMáximo", minFans: 400000, value: 800000, logo: "/placeholder.svg?height=50&width=100" },
  { id: 5, name: "AeroVoador", minFans: 900000, value: 2000000, logo: "/placeholder.svg?height=50&width=100" },
];

export function generateMatches(): Match[] {
  const matches: Match[] = [];
  let id = 1;

  for (let round = 1; round <= 38; round++) {
    for (let i = 0; i < teams.length; i += 2) {
      const homeTeam = teams[i].id;
      const awayTeam = teams[i + 1].id;
      matches.push({
        id: id++,
        homeTeam,
        awayTeam,
        played: false,
      });
    }
  }

  return matches;
}

