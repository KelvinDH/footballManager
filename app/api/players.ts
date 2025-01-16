import { Player } from '../data/playerData';
import { teams } from '../data/gameData';

const firstNames = [
  "João", "Pedro", "Carlos", "André", "Lucas", "Marcos", "Rafael", "Thiago", "Gabriel", "Rodrigo",
  "Felipe", "Bruno", "Gustavo", "Leandro", "Ricardo", "Diego", "Marcelo", "Fábio", "Daniel", "Vítor",
  "Miguel", "Arthur", "Davi", "Bernardo", "Heitor", "Matheus", "Enzo", "Lorenzo", "Théo", "Pietro",
  "Cauã", "Isaac", "Caio", "Vinicius", "Benjamin", "Guilherme", "Nicolas", "Paulo", "Lucca", "Benício"
];

const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes",
  "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa",
  "Rocha", "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques", "Machado", "Mendes", "Freitas",
  "Cardoso", "Ramos", "Gonçalves", "Santana", "Teixeira", "Araújo", "Pinto", "Azevedo", "Medeiros", "Correia"
];

const generatePlayersForAllTeams = (): Player[] => {
  const allPlayers: Player[] = [];
  const usedNames = new Set<string>();
  
  const getUniqueName = (): string => {
    let name;
    do {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      name = `${firstName} ${lastName}`;
    } while (usedNames.has(name));
    usedNames.add(name);
    return name;
  };

  teams.forEach(team => {
    for (let i = 0; i < 23; i++) {
      const positions = ['Goleiro', 'Zagueiro', 'Lateral', 'Meio-Campo', 'Atacante'];
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      allPlayers.push({
        id: team.id * 100 + i,
        name: getUniqueName(),
        position,
        attack: Math.floor(Math.random() * 50) + 50,
        defense: Math.floor(Math.random() * 50) + 50,
        goals: 0,
        yellowCards: 0,
        redCards: 0,
        isStarter: i < 11,
        teamId: team.id,
        price: Math.floor(Math.random() * 10000000) + 1000000,
      });
    }
  });

  return allPlayers;
};

const allPlayers = generatePlayersForAllTeams();

export const getPlayersForTeam = (teamId: number): Player[] => {
  return allPlayers.filter(player => player.teamId === teamId);
};

export const getAllPlayers = (): Player[] => {
  return allPlayers;
};

