export interface Player {
  id: number;
  name: string;
  position: string;
  attack: number;
  defense: number;
  goals: number;
  yellowCards: number;
  redCards: number;
  isStarter: boolean;
  teamId: number;
  price: number;
  isSuspended: boolean;
  cardsHistory: ('yellow' | 'red')[];
}

// ... (mantenha o resto do arquivo inalterado)

