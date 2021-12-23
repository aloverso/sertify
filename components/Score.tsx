import React, { ReactElement } from "react";
import { Button } from "@material-ui/core";

interface Props {
  wins: number;
  losses: number;
  showPlayAgain: boolean;
  playAgainCallback: () => void;
}

export const Score = (props: Props): ReactElement => {
  return (
    <div className="align-center mtl">
      <div className="text-l text-bright">Wins: {props.wins}</div>
      <div className="text-l text-tomato">Losses: {props.losses}</div>
      {props.showPlayAgain && (
        <div className="mtl">
          <Button onClick={props.playAgainCallback} variant="contained" color="primary">
            Play again
          </Button>
        </div>
      )}
    </div>
  );
};
