import React, { ReactElement } from "react";
import { PastSet } from "../lib/types";
import { Timer } from "react-use-precision-timer";
import { toSeconds } from "../lib/utils";

interface Props {
  pastSets: PastSet[];
  stopwatch: Timer;
}

export const TimerRow = (props: Props): ReactElement => {
  const getAverage = (): number => {
    if (props.pastSets.length === 0) return 0;
    const totalTime = props.pastSets.reduce((acc, cur) => acc + cur.time, 0);
    return totalTime / props.pastSets.length;
  };

  return (
    <div className="mtd fdr">
      <div className="col-xs-4 align-center">
        Current: <b>{toSeconds(props.stopwatch.getElapsedRunningTime())}</b>
      </div>
      <div className="col-xs-4 align-center">
        Average: <b>{toSeconds(getAverage())}</b>
      </div>
      <div className="col-xs-4 align-center">
        Total time: <b>{toSeconds(props.pastSets.reduce((acc, cur) => acc + cur.time, 0))}</b>
      </div>
    </div>
  );
};
