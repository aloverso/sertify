import React, { ReactElement } from "react";
import { Button } from "@material-ui/core";

interface Props {
  wins: number;
  losses: number;
  currentCards: string[];
  playAgainCallback: () => void;
}

export const Score = (props: Props): ReactElement => {
  return (
    <div className="align-center mtl">
      <div className="text-l">Wins: {props.wins}</div>
      <div className="text-l">Losses: {props.losses}</div>
      {props.currentCards.length === 0 && (
        <div className="mtl">
          <Button onClick={props.playAgainCallback} variant="contained" color="primary">
            Play again
          </Button>
        </div>
      )}
    </div>
  );
};
