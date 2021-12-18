import React, { ReactElement } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useMediaQuery } from "@material-ui/core";
import { MediaQueries } from "../lib/MediaQueries";

const useStyles = makeStyles((theme) => ({
  symbol: {
    margin: 3,
  },
  card: {
    boxSizing: "border-box",
    background: "#fff",
    border: `1px solid ${theme.palette.text.primary}`,
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: "#fff",
    transition: "box-shadow 0.15s",
  },
  clickable: {
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 0px 5px 3px #bbb",
    },
  },
  active: {
    boxShadow: "0px 0px 5px 3px #4b9e9e !important",
  },
}));

const SHAPES = ["squiggle", "oval", "diamond"];
const SHADES = ["filled", "outline", "striped"];

const SetCardTheme = {
  purple: "#800080",
  green: "#008002",
  red: "#ff0101",
};

interface SymbolProps {
  color: number;
  shape: number;
  shade: number;
  size: number;
}

const Symbol = (props: SymbolProps): ReactElement => {
  const classes = useStyles();

  const COLORS = [SetCardTheme.purple, SetCardTheme.green, SetCardTheme.red];

  const color = COLORS[props.color];
  const shape = SHAPES[props.shape];
  const shade = SHADES[props.shade];

  return (
    <svg
      className={classes.symbol}
      width={props.size}
      height={2 * props.size}
      viewBox="0 0 200 400"
      style={{ transition: "width 0.5s, height 0.5s" }}
    >
      <use
        href={"#" + shape}
        fill={shade === "outline" ? "transparent" : color}
        mask={shade === "striped" ? "url(#mask-stripe)" : ""}
      />
      <use href={"#" + shape} stroke={color} fill="none" strokeWidth={18} />
    </svg>
  );
};

interface Props {
  width: number;
  value: string;
  onClick?: () => void;
  blank?: boolean;
}

export const SetCard = (props: Props): ReactElement => {
  const classes = useStyles();
  const isXXS = useMediaQuery(MediaQueries.isXXS);

  const height = Math.round(props.width / 1.6);
  const margin = Math.round(props.width * 0.035);
  const contentWidth = props.width - 2 * margin;
  const contentHeight = height - 2 * margin;

  const color = props.value.charCodeAt(0) - 48;
  const shape = props.value.charCodeAt(1) - 48;
  const shade = props.value.charCodeAt(2) - 48;
  const number = props.value.charCodeAt(3) - 48;

  return (
    <div
      className={clsx(classes.card, {})}
      style={{
        width: contentWidth,
        height: contentHeight,
        margin: margin,
        borderRadius: margin,
        background: props.blank ? "rgba(255,255,255,0.1)" : "#fff",
        transition: "width 0.5s, height 0.5s",
        cursor: props.onClick ? "pointer" : "unset",
        border: "none",
      }}
      onClick={props.onClick}
      onKeyDown={props.onClick}
      role={props.onClick ? "button" : undefined}
    >
      {props.blank && (
        <div style={{ color: "#8E9499", fontWeight: "bold", fontSize: isXXS ? "3rem" : "5rem" }}>
          ?
        </div>
      )}
      {!props.blank &&
        [...Array(number + 1)].map((_, i) => (
          <Symbol
            key={i}
            color={color}
            shape={shape}
            shade={shade}
            size={Math.round(contentHeight * 0.36)}
          />
        ))}
    </div>
  );
};
