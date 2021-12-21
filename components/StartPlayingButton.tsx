import { Button } from "@material-ui/core";
import React, { ReactElement } from "react";

interface Props {
  started: boolean;
  startGameCallback: () => void;
}

export const StartPlayingButton = (props: Props): ReactElement => {
  return props.started ? (
    <></>
  ) : (
    <div className="align-center mtl">
      <Button size="large" variant="contained" color="primary" onClick={props.startGameCallback}>
        start playing
      </Button>
    </div>
  );
};
