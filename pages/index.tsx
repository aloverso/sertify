/* eslint-disable react-hooks/exhaustive-deps */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Button, useMediaQuery } from "@material-ui/core";
import { MediaQueries } from "../lib/MediaQueries";
import { checkSet, conjugateCard, generateDeck } from "../lib/set-helpers";
import { getCardWidth } from "../lib/layout-helpers";
import { SetCard } from "../components/SetCard";
import { Alert } from "@material-ui/lab";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useStopwatch } from "react-use-precision-timer";

type PastSet = {
  cardA: string;
  cardB: string;
  cardC: string;
  result: "SUCCESS" | "FAIL";
  time: number;
};

const Index = (): ReactElement => {
  const [deck, setDeck] = useState<string[]>(generateDeck());
  const [index, setIndex] = useState<number>(0);
  const [currentCards, setCurrentCards] = useState<string[]>([]);
  const isLarge = useMediaQuery(MediaQueries.desktopAndUp);
  const isXS = useMediaQuery(MediaQueries.isXS);
  const isXXS = useMediaQuery(MediaQueries.isXXS);
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [alertState, setAlertState] = useState<"NONE" | "SUCCESS" | "FAIL">("NONE");
  const [, setRenderTime] = React.useState(new Date().getTime());
  const [pastSets, setPastSets] = useState<PastSet[]>([]);

  const stopwatch = useStopwatch();

  const cardWidth = getCardWidth(isLarge, isXS, isXXS);

  React.useEffect(() => {
    const timeout = setTimeout(() => setRenderTime(new Date().getTime()), 50);
    return (): void => {
      clearTimeout(timeout);
    };
  });

  const next = useCallback((): void => {
    if (index + 3 < deck.length) {
      setIndex(index + 3);
      stopwatch.start();
    } else {
      setCurrentCards([]);
    }

    setTimeout(() => {
      setAlertState("NONE");
      // document.body.style = 'background-color: #1c2833;';
    }, 500);
  }, [setIndex, setCurrentCards, setAlertState, deck.length, index]);

  const testSet = useCallback(
    (acceptRejectModifier: number): void => {
      if (currentCards.length === 0) return;
      setAlertState("NONE");
      const time = stopwatch.getElapsedRunningTime();
      stopwatch.stop();

      if (
        acceptRejectModifier *
          (checkSet(currentCards[0], currentCards[1], currentCards[2]) ? 1 : -1) >
        0
      ) {
        setWins(wins + 1);
        setAlertState("SUCCESS");
        // document.body.style = 'background-color: green;';
        setPastSets((prev) => [
          ...prev,
          {
            cardA: currentCards[0],
            cardB: currentCards[1],
            cardC: currentCards[2],
            result: "SUCCESS",
            time: time,
          },
        ]);
      } else {
        setLosses(losses + 1);
        setAlertState("FAIL");
        // document.body.style = 'background-color: #B22222;';
        setPastSets((prev) => [
          ...prev,
          {
            cardA: currentCards[0],
            cardB: currentCards[1],
            cardC: currentCards[2],
            result: "FAIL",
            time: time,
          },
        ]);
      }

      next();
    },
    [currentCards, setAlertState, setWins, setLosses, next, losses, wins]
  );

  const playAgain = (): void => {
    setWins(0);
    setLosses(0);
    setAlertState("NONE");
    // document.body.style = 'background-color: #1c2833;';
    setIndex(0);
    setPastSets([]);
    setDeck(generateDeck());
  };

  useEffect(() => {
    const shouldBeSet = Math.round(Math.random()) === 0;
    let thirdCard = conjugateCard(deck[index], deck[index + 1]);
    if (!shouldBeSet) {
      thirdCard = deck[index + 2];
    }
    setCurrentCards([deck[index], deck[index + 1], thirdCard]);
    stopwatch.start();
  }, [index, setCurrentCards, deck]);

  const handleKeyDown = useCallback(
    (keyEvent: KeyboardEvent): void => {
      if (keyEvent.code === "KeyA") {
        testSet(1);
      } else if (keyEvent.code === "KeyD") {
        testSet(-1);
      }
    },
    [testSet]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const getAverage = (): number => {
    if (pastSets.length === 0) return 0;
    const totalTime = pastSets.reduce((acc, cur) => acc + cur.time, 0);
    return totalTime / pastSets.length;
  };

  const toSeconds = (num: number): string => {
    return `${(num / 1000).toFixed(2)}s`;
  };

  return (
    <div className="container ptm bg pbxl">
      <div className="row mts">
        <a className="pull-right phs" href="/guesser">
          guess the third game
        </a>
      </div>

      <h1 className="text-xl">Sertify</h1>
      <h2 className="text-m">The game of rapid set-validation</h2>
      <p>
        As quickly as possible, go through set cards deciding if each random group of 3 is a set or
        not.
      </p>
      {currentCards.length > 0 && (
        <>
          <div className="fdr fjc">
            <SetCard width={cardWidth} value={currentCards[0]} />
            <SetCard width={cardWidth} value={currentCards[1]} />
            <SetCard width={cardWidth} value={currentCards[2]} />
          </div>

          <div className={`${isXS ? "" : "mhxl"} mtl fdr fjc`}>
            <div className="mrd">
              <Button variant="contained" color="primary" onClick={(): void => testSet(1)}>
                <CheckCircleIcon className="mrs" />
                it's a set
              </Button>
              <div className="align-center">(press A)</div>
            </div>
            <div className="mld">
              <Button variant="contained" color="secondary" onClick={(): void => testSet(-1)}>
                <CancelIcon className="mrs" />
                not a set
              </Button>
              <div className="align-center">(press D)</div>
            </div>
          </div>

          <div className="ptd" style={{ visibility: alertState === "NONE" ? "hidden" : "visible" }}>
            <Alert severity={alertState === "SUCCESS" ? "success" : "error"} variant="filled">
              {alertState === "SUCCESS" ? "Correct!" : "Wrong!"}
            </Alert>
          </div>
        </>
      )}

      <div className="mtd">
        <span className="mrl">
          Current Time: <b>{toSeconds(stopwatch.getElapsedRunningTime())}</b>
        </span>
        <span className="mrl">
          Average: <b>{toSeconds(getAverage())}</b>
        </span>
        <span className="mrl">
          Total time: <b>{toSeconds(pastSets.reduce((acc, cur) => acc + cur.time, 0))}</b>
        </span>
      </div>

      <div className="fdr fww">
        {pastSets.map((it) => (
          <div
            key={it.cardA + it.cardB + it.cardC}
            className="fdr fac fjc mts mrs prd"
            style={{
              borderRadius: "1rem",
              height: "1.5rem",
              backgroundColor: it.result === "SUCCESS" ? "green" : "#B22222",
            }}
          >
            <div className="mts mrxs">
              {it.result === "SUCCESS" ? <CheckCircleIcon /> : <CancelIcon />}
            </div>
            <div>{toSeconds(it.time)}</div>
          </div>
        ))}
      </div>

      <div className="align-center mtl">
        <div className="text-l">Wins: {wins}</div>
        <div className="text-l">Losses: {losses}</div>
        {currentCards.length === 0 && (
          <div className="mtl">
            <Button onClick={playAgain} variant="contained" color="primary">
              Play again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
