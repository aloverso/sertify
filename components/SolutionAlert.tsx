import React, { ReactElement } from "react";
import { Alert } from "@material-ui/lab";
import { AlertState } from "../lib/types";

interface Props {
  alertState: AlertState;
}

export const SolutionAlert = (props: Props): ReactElement => {
  return (
    <div className="ptd" style={{ visibility: props.alertState === "NONE" ? "hidden" : "visible" }}>
      <Alert severity={props.alertState === "SUCCESS" ? "success" : "error"} variant="filled">
        {props.alertState === "SUCCESS" ? "Correct!" : "Wrong!"}
      </Alert>
    </div>
  );
};
