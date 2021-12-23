import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { PastSet } from "../lib/types";
import React, { ReactElement } from "react";
import { BRIGHT_DARK, TOMATO_DARK, toSeconds } from "../lib/utils";

interface Props {
  pastSets: PastSet[];
}

export const PastSetsPills = (props: Props): ReactElement => {
  return (
    <div className="fdr fww">
      {props.pastSets.map((it) => (
        <div
          key={it.cardA + it.cardB + it.cardC}
          className="fdr fac fjc mts mrs prd"
          style={{
            borderRadius: "1rem",
            height: "1.5rem",
            backgroundColor: it.result === "SUCCESS" ? BRIGHT_DARK : TOMATO_DARK,
          }}
        >
          <div className="mrxs" style={{ marginTop: "0.4rem" }}>
            {it.result === "SUCCESS" ? <CheckCircleIcon /> : <CancelIcon />}
          </div>
          <div>{toSeconds(it.time)}</div>
        </div>
      ))}
    </div>
  );
};
