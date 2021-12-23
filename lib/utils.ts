import { PastSet } from "./types";
import dayjs from "dayjs";

export const replaceAt = (str: string, index: number, replacement: string): string => {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};

export const toSeconds = (num: number): string => {
  return `${(num / 1000).toFixed(2)}s`;
};

export const getAverage = (pastSets: PastSet[]): number => {
  if (pastSets.length === 0) return 0;
  const totalTime = pastSets.reduce((acc, cur) => acc + cur.time, 0);
  return totalTime / pastSets.length;
};

export const getTotal = (pastSets: PastSet[]): number => {
  return pastSets.reduce((acc, cur) => acc + cur.time, 0);
};

export const yearMonthDayFormat = (timestamp: string): string => {
  return dayjs(timestamp).format("YYYY-MM-DD");
};

export const PRIMARY = "#4252ae";
export const RED = "#B22222";
export const BRIGHT = "#00bfff";
export const TOMATO = "#ff6347";
export const BRIGHT_DARK = "#008AB8";
export const TOMATO_DARK = "#e75a40";
