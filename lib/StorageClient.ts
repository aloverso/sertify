import { Client, PastGame } from "./types";

const saveScore = (pastGame: PastGame): void => {
  const gameHistory: PastGame[] = JSON.parse(
    window.localStorage.getItem("sertify-history") || "[]"
  );
  gameHistory.push(pastGame);
  localStorage.setItem("sertify-history", JSON.stringify(gameHistory));
};

const getHistory = (): PastGame[] => {
  return JSON.parse(window.localStorage.getItem("sertify-history") || "[]");
};

export const StorageClient: Client = {
  saveScore,
  getHistory,
};
