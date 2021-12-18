export const getCardWidth = (isLarge: boolean, isXS: boolean, isXXS: boolean): number => {
  let gameWidth = 600;
  if (isXXS) {
    gameWidth = 250;
  } else if (isXS) {
    gameWidth = 300;
  } else if (!isXS && !isLarge) {
    gameWidth = 400;
  }

  const lineSpacing = 0;
  const gamePadding = 8;

  const cols = 3;

  const cardHeight = Math.floor((gameWidth - 2 * gamePadding - lineSpacing) / cols);
  return Math.round(cardHeight * 1.6);
};
