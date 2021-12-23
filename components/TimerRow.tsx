import React, { ReactElement } from "react";
import { PastSet } from "../lib/types";
import { Timer } from "react-use-precision-timer";
import { getAverage, getTotal, toSeconds } from "../lib/utils";

interface Props {
  pastSets: PastSet[];
  stopwatch: Timer;
}

export const TimerRow = (props: Props): ReactElement => {
  return (
    <div className="mtd fdr">
      <div className="col-xs-4 align-center">
        Current: <b>{toSeconds(props.stopwatch.getElapsedRunningTime())}</b>
      </div>
      <div className="col-xs-4 align-center">
        Average: <b>{toSeconds(getAverage(props.pastSets))}</b>
      </div>
      <div className="col-xs-4 align-center">
        Total time: <b>{toSeconds(getTotal(props.pastSets))}</b>
      </div>
    </div>
  );
};
