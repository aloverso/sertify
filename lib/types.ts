export type PastSet = {
  cardA: string;
  cardB: string;
  cardC: string;
  result: "SUCCESS" | "FAIL";
  time: number;
};

export type PastGame = {
  sets: PastSet[];
  timestamp: string;
  type: "SERTIFY" | "GUESSER";
  hardMode: boolean;
};

export type AlertState = "NONE" | "SUCCESS" | "FAIL";

export type Client = {
  saveScore: (pastGame: PastGame) => void;
  getHistory: () => PastGame[];
};
