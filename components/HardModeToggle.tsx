import React, { ReactElement } from "react";
import { FormControlLabel, Switch } from "@material-ui/core";

interface Props {
  hardMode: boolean;
  setHardMode: (hardMode: boolean) => void;
  resetCallback: () => void;
}

export const HardModeToggle = (props: Props): ReactElement => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={props.hardMode}
          onChange={(): void => {
            if (props.hardMode === false) {
              document.body.style = "background-color: #331c1c;";
            } else {
              document.body.style = "background-color: #1c2833;";
            }
            props.setHardMode(!props.hardMode);
            props.resetCallback();
          }}
          name="hardMode"
        />
      }
      label="Hard mode (options are more similar)"
    />
  );
};
