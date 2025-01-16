'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Team, Sponsor, Match, teams, sponsors, generateMatches } from '../data/gameData';
import { Player } from '../data/playerData';
import { getPlayersForTeam, getAllPlayers } from '../api/players';

interface GameContextType {
  allTeams: Team[];
  matches: Match[];
  currentRound: number;
  players: Player[];
  selectedTeam?: Team;
  selectedSponsor?: Sponsor;
  setSelectedTeam: (team?: Team) => void;
  setSelectedSponsor: (sponsor?: Sponsor) => void;
  startNewSeason: () => void;
  playNextRound: () => void;
  playMatch: (matchId: number) => Promise<Match | undefined>;
  isCurrentRoundComplete: () => boolean;
  registerUser: (username: string) => Promise<void>;
  loginUser: (username: string) => Promise<boolean>;
  logoutUser: () => void;
  loadGame: () => Promise<void>;
  saveGame: () => Promise<void>;
  updatePlayer: (player: Player) => void;
  buyPlayer: (player: Player) => boolean;
  selectedTactic: string;
  setSelectedTactic: (tactic: string) => void;
  user: string | null;
  loadSavedGame: (username: string) => Promise<boolean>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameContextType>(() => {
    const allTeams = teams.map(team => ({ ...team, points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }));
    
    return {
      allTeams,
      matches: generateMatches(),
      currentRound: 1,
      players: [],
      selectedTeam: undefined,
      selectedSponsor: undefined,
      selectedTactic: '4-4-2',
      user: null,
      setSelectedTeam: () => {},
      setSelectedSponsor: () => {},
      startNewSeason: () => {},
      playNextRound: () => {},
      playMatch: async () => undefined,
      isCurrentRoundComplete: () => false,
      registerUser: async () => {},
      loginUser: async () => false,
      logoutUser: () => {},
      loadGame: async () => {},
      saveGame: async () => {},
      updatePlayer: () => {},
      buyPlayer: () => false,
      setSelectedTactic: () => {},
      loadSavedGame: async () => false,
    };
  });

  const setSelectedTeam = useCallback((team?: Team) => {
    setState(prevState => {
      const updatedTeam = team ? prevState.allTeams.find(t => t.id === team.id) || team : undefined;
      return {
        ...prevState,
        selectedTeam: updatedTeam,
        players: updatedTeam ? getPlayersForTeam(updatedTeam.id) : []
      };
    });
  }, []);

  const setSelectedSponsor = useCallback((sponsor?: Sponsor) => {
    setState(prevState => ({ ...prevState, selectedSponsor: sponsor }));
  }, []);

  const startNewSeason = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      matches: generateMatches(),
      currentRound: 1,
      allTeams: teams.map(team => ({ ...team, points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 })),
      players: prevState.selectedTeam ? getPlayersForTeam(prevState.selectedTeam.id).map(player => ({
        ...player,
        goals: 0,
        yellowCards: 0,
        redCards: 0,
        cardsHistory: []
      })) : []
    }));
  }, []);

  const isCurrentRoundComplete = useCallback(() => {
    const currentRoundMatches = state.matches.filter(
      match => Math.floor((match.id - 1) / 10) + 1 === state.currentRound
    );
    return currentRoundMatches.every(match => match.played);
  }, [state.matches, state.currentRound]);

  const playNextRound = useCallback(() => {
    setState(prevState => {
      if (isCurrentRoundComplete()) {
        const newRound = prevState.currentRound + 1;
        console.log(`Advancing to round ${newRound}`);
        return {
          ...prevState,
          currentRound: newRound,
          matches: prevState.matches.map(match => {
            if (Math.floor((match.id - 1) / 10) + 1 === newRound) {
              return { ...match, played: false, homeScore: undefined, awayScore: undefined };
            }
            return match;
          })
        };
      }
      return prevState;
    });
  }, [isCurrentRoundComplete]);

  const playMatch = useCallback(async (matchId: number): Promise<Match | undefined> => {
    return new Promise((resolve) => {
      try {
        setState(prevState => {
          console.log("Starting playMatch for matchId:", matchId);
          const matchIndex = prevState.matches.findIndex(match => match.id === matchId && !match.played);
          if (matchIndex === -1) {
            console.error(`Match ${matchId} not found or already played`);
            resolve(undefined);
            return prevState;
          }

          const match = prevState.matches[matchIndex];
          const homeTeam = prevState.allTeams.find(team => team.id === match.homeTeam);
          const awayTeam = prevState.allTeams.find(team => team.id === match.awayTeam);

          if (!homeTeam || !awayTeam) {
            console.error(`Teams not found for match ${matchId}`);
            resolve(undefined);
            return prevState;
          }

          const homeTeamPlayers = getPlayersForTeam(homeTeam.id);
          const awayTeamPlayers = getPlayersForTeam(awayTeam.id);

          const homeAttackStrength = homeTeam.attack * (Math.random() * 0.4 + 0.8);
          const awayAttackStrength = awayTeam.attack * (Math.random() * 0.4 + 0.8);
          const homeDefenseStrength = homeTeam.defense * (Math.random() * 0.4 + 0.8);
          const awayDefenseStrength = awayTeam.defense * (Math.random() * 0.4 + 0.8);

          const homeScore = Math.max(0, Math.floor((homeAttackStrength - awayDefenseStrength) / 10));
          const awayScore = Math.max(0, Math.floor((awayAttackStrength - homeDefenseStrength) / 10));

          const generateGoalsAndCards = (team: Team, score: number, players: Player[]) => {
            if (players.length === 0) {
              console.error(`No players found for team ${team.name}. Team ID: ${team.id}`);
              return { scorers: [], yellowCards: [], redCards: [] };
            }

            const starters = players.filter(p => p.isStarter && !p.isSuspended);
            if (starters.length === 0) {
              console.error(`No available starters for team ${team.name}`);
              return { scorers: [], yellowCards: [], redCards: [] };
            }

            const scorers: Player[] = [];
            const yellowCards: Player[] = [];
            const redCards: Player[] = [];

            for (let i = 0; i < score; i++) {
              const scorer = starters[Math.floor(Math.random() * starters.length)];
              scorers.push(scorer);
            }

            // Adicionar cartões amarelos aleatoriamente apenas para titulares
            const yellowCardCount = Math.floor(Math.random() * 3) + 1; // 1 a 3 cartões amarelos por jogo
            for (let i = 0; i < yellowCardCount; i++) {
              const player = starters[Math.floor(Math.random() * starters.length)];
              if (!yellowCards.includes(player)) {
                yellowCards.push(player);
              }
            }

            // Adicionar cartões vermelhos aleatoriamente apenas para titulares (mais raro)
            if (Math.random() < 0.1) { // 10% de chance de ter um cartão vermelho
              const player = starters[Math.floor(Math.random() * starters.length)];
              if (!redCards.includes(player)) {
                redCards.push(player);
              }
            }

            return { scorers, yellowCards, redCards };
          };

          const homeTeamStats = generateGoalsAndCards(homeTeam, homeScore, homeTeamPlayers);
          const awayTeamStats = generateGoalsAndCards(awayTeam, awayScore, awayTeamPlayers);

          const updatedMatch: Match = {
            ...match,
            homeScore,
            awayScore,
            played: true,
            homeTeamStats,
            awayTeamStats,
          };

          const updateTeamAndPlayerStats = (team: Team, isHomeTeam: boolean, score: number, opponentScore: number, stats: any) => {
            if (!team || !stats) {
              console.error('Invalid team or stats data');
              return { newTeam: team, updatedPlayers: [] };
            }

            const newTeam = { ...team };
            newTeam.goalsFor += score;
            newTeam.goalsAgainst += opponentScore;

            if (score > opponentScore) {
              newTeam.points += 3;
              newTeam.wins += 1;
              newTeam.money += Math.floor(newTeam.money * 0.05);
              newTeam.fans += Math.floor(newTeam.fans * 0.02);
            } else if (score === opponentScore) {
              newTeam.points += 1;
              newTeam.draws += 1;
              newTeam.money += Math.floor(newTeam.money * 0.01);
              newTeam.fans += Math.floor(newTeam.fans * 0.005);
            } else {
              newTeam.losses += 1;
              newTeam.money -= Math.floor(newTeam.money * 0.01);
              newTeam.fans -= Math.floor(newTeam.fans * 0.005);
            }

            const updatedPlayers = getPlayersForTeam(team.id).map(player => {
              const playerGoals = stats.scorers.filter((s: Player) => s.id === player.id).length;
              const playerYellowCards = stats.yellowCards.filter((c: Player) => c.id === player.id).length;
              const playerRedCards = stats.redCards.filter((c: Player) => c.id === player.id).length;

              const newYellowCards = player.yellowCards + playerYellowCards;
              const newRedCards = player.redCards + playerRedCards;

              return {
                ...player,
                goals: player.goals + playerGoals,
                yellowCards: newYellowCards,
                redCards: newRedCards,
                cardsHistory: [
                  ...player.cardsHistory || [],
                  ...Array(playerYellowCards).fill('yellow'),
                  ...Array(playerRedCards).fill('red')
                ],
                isSuspended: newYellowCards >= 3 || newRedCards > 0,
              };
            });

            return { newTeam, updatedPlayers };
          };

          const { newTeam: newHomeTeam, updatedPlayers: homeUpdatedPlayers } = updateTeamAndPlayerStats(homeTeam, true, homeScore, awayScore, homeTeamStats);
          const { newTeam: newAwayTeam, updatedPlayers: awayUpdatedPlayers } = updateTeamAndPlayerStats(awayTeam, false, awayScore, homeScore, awayTeamStats);

          if (!newHomeTeam || !newAwayTeam) {
            throw new Error('Failed to update team stats');
          }

          const updatedAllTeams = prevState.allTeams.map(team =>
            team.id === homeTeam.id ? newHomeTeam :
            team.id === awayTeam.id ? newAwayTeam :
            team
          );

          const updatedMatches = [...prevState.matches];
          updatedMatches[matchIndex] = updatedMatch;

          // Update only the players of the selected team in the state
          const updatedStatePlayers = prevState.selectedTeam 
            ? prevState.players.map(player => {
                const updatedPlayer = [...homeUpdatedPlayers, ...awayUpdatedPlayers].find(p => p.id === player.id);
                return updatedPlayer || player;
              })
            : prevState.players;

          console.log("Updated match:", updatedMatch);
          resolve(updatedMatch);
          return {
            ...prevState,
            matches: updatedMatches,
            allTeams: updatedAllTeams,
            players: updatedStatePlayers,
          };
        });
      } catch (error) {
        console.error('Error in playMatch:', error);
        resolve(undefined);
      }
    });
  }, []);

  const registerUser = useCallback(async (username: string) => {
    setState(prevState => ({ ...prevState, user: username }));
  }, []);

  const loadSavedGame = useCallback(async (username: string) => {
    const savedGame = localStorage.getItem(`savedGame_${username}`);
    if (savedGame) {
      const parsedGame = JSON.parse(savedGame);
      setState(prevState => ({
        ...prevState,
        ...parsedGame,
        user: username
      }));
      console.log("Jogo carregado com sucesso para o usuário:", username);
      return true;
    }
    console.log("Nenhum jogo salvo encontrado para o usuário:", username);
    return false;
  }, []);

  const loginUser = useCallback(async (username: string) => {
    console.log("Tentando fazer login do usuário:", username);
    const gameLoaded = await loadSavedGame(username);
    if (gameLoaded) {
      console.log("Jogo carregado com sucesso, definindo o usuário:", username);
      setState(prevState => ({ ...prevState, user: username }));
    } else {
      console.log("Nenhum jogo salvo encontrado, apenas definindo o usuário:", username);
      setState(prevState => ({ ...prevState, user: username }));
    }
    return gameLoaded;
  }, [loadSavedGame]);

  const logoutUser = useCallback(() => {
    setState(prevState => ({ ...prevState, user: null, selectedTeam: undefined, selectedSponsor: undefined }));
  }, []);

  const loadGame = useCallback(async () => {
    console.log("Loading game...");
    // Implement game loading logic here
  }, []);

  const saveGame = useCallback(() => {
    if (state.user) {
      const gameState = {
        selectedTeam: state.selectedTeam,
        selectedSponsor: state.selectedSponsor,
        allTeams: state.allTeams,
        matches: state.matches,
        currentRound: state.currentRound,
        players: state.players,
        selectedTactic: state.selectedTactic,
      };
      localStorage.setItem(`savedGame_${state.user}`, JSON.stringify(gameState));
      console.log("Jogo salvo com sucesso para o usuário:", state.user);
    } else {
      console.error("Tentativa de salvar o jogo sem um usuário logado");
    }
  }, [state]);

  const updatePlayer = useCallback((player: Player) => {
    setState(prevState => {
      const updatedPlayers = prevState.players.map(p => p.id === player.id ? player : p);
      return { ...prevState, players: updatedPlayers };
    });
  }, []);

  const buyPlayer = useCallback((player: Player): boolean => {
    if (state.selectedTeam && state.selectedTeam.money >= player.price) {
      setState(prevState => ({
        ...prevState,
        selectedTeam: {
          ...prevState.selectedTeam!,
          money: prevState.selectedTeam!.money - player.price
        },
        players: [...prevState.players, player]
      }));
      return true;
    }
    return false;
  }, [state.selectedTeam, state.players]);

  const setSelectedTactic = useCallback((tactic: string) => {
    setState(prevState => ({ ...prevState, selectedTactic: tactic }));
  }, []);

  const contextValue = {
    ...state,
    setSelectedTeam,
    setSelectedSponsor,
    startNewSeason,
    playNextRound,
    playMatch,
    isCurrentRoundComplete,
    registerUser,
    loginUser,
    logoutUser,
    loadGame,
    saveGame,
    updatePlayer,
    buyPlayer,
    setSelectedTactic,
    loadSavedGame,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { GameContext };

