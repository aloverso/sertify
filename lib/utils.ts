export const replaceAt = (str: string, index: number, replacement: string): string => {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};

export const toSeconds = (num: number): string => {
  return `${(num / 1000).toFixed(2)}s`;
};
