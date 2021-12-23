import React, { ReactElement } from "react";
import { PastGame } from "../lib/types";
import { getAverage, getTotal, toSeconds } from "../lib/utils";
import dayjs from "dayjs";

interface Props {
  game: PastGame;
}

export const GameStat = (props: Props): ReactElement => {
  const averageTime = getAverage(props.game.sets);
  const totalTime = getTotal(props.game.sets);

  const winLossFormat = (): ReactElement => {
    const wins = props.game.sets.reduce(
      (acc, cur) => (cur.result === "SUCCESS" ? acc + 1 : acc),
      0
    );
    const losses = props.game.sets.reduce((acc, cur) => (cur.result === "FAIL" ? acc + 1 : acc), 0);

    return (
      <>
        <span className="text-bright">{wins}</span>:<span className="text-tomato">{losses}</span>
      </>
    );
  };

  const diamond = (
    <>
      (<div className="diamond" />
      <div className="diamond" />)
    </>
  );

  const gameFormat = (): string => (props.game.type === "SERTIFY" ? "sertify" : "guesser");

  return (
    <tr data-testid="game">
      <td className="text-m prl">{dayjs(props.game.timestamp).format("H:mm")}</td>
      <td className="text-m prl fdr fac">
        <span className="mrs">{gameFormat()}</span>
        {props.game.hardMode && diamond}
      </td>
      <td className="text-m prl">{winLossFormat()}</td>
      <td className="text-m prl">{toSeconds(averageTime)}</td>
      <td className="text-m">{toSeconds(totalTime)}</td>
    </tr>
  );
};
