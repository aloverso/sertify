/* eslint-disable react-hooks/exhaustive-deps */

import React, { ReactElement, useEffect, useState } from "react";
import { Button, useMediaQuery } from "@material-ui/core";
import { MediaQueries } from "../lib/MediaQueries";
import { checkSet, conjugateCard, generateDeck } from "../lib/set-helpers";
import { getCardWidth } from "../lib/layout-helpers";
import { SetCard } from "../components/SetCard";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useStopwatch } from "react-use-precision-timer";
import { TimerRow } from "../components/TimerRow";
import { PastSetsPills } from "../components/PastSetsPills";
import { SolutionAlert } from "../components/SolutionAlert";
import { Score } from "../components/Score";
import { PastSet } from "../lib/types";
import { StartPlayingButton } from "../components/StartPlayingButton";
import { StorageClient } from "../lib/StorageClient";
import dayjs from "dayjs";

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
  const [started, setStarted] = useState<boolean>(false);

  const stopwatch = useStopwatch();

  const cardWidth = getCardWidth(isLarge, isXS, isXXS);

  useEffect(() => {
    setNextThreeCards(0);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setRenderTime(new Date().getTime()), 50);
    return (): void => {
      clearTimeout(timeout);
    };
  });

  const next = (): void => {
    if (index + 3 < deck.length) {
      const newIndex = index + 3;
      setIndex(newIndex);
      setNextThreeCards(newIndex);
      stopwatch.start();
    } else {
      setCurrentCards([]);
      StorageClient.saveScore({
        sets: pastSets,
        timestamp: dayjs().toISOString(),
        type: "SERTIFY",
        hardMode: false,
      });
    }

    setTimeout(() => {
      setAlertState("NONE");
      // document.body.style = 'background-color: #1c2833;';
    }, 500);
  };

  const testSet = (acceptRejectModifier: number): void => {
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
  };

  const playAgain = (): void => {
    setWins(0);
    setLosses(0);
    setAlertState("NONE");
    // document.body.style = 'background-color: #1c2833;';
    setIndex(0);
    setPastSets([]);
    setDeck(generateDeck());
    setNextThreeCards(0);
    startGame();
  };

  const setNextThreeCards = (newIndex: number): void => {
    const shouldBeSet = Math.round(Math.random()) === 0;
    let thirdCard = conjugateCard(deck[newIndex], deck[newIndex + 1]);
    if (!shouldBeSet) {
      thirdCard = deck[newIndex + 2];
    }
    setCurrentCards([deck[newIndex], deck[newIndex + 1], thirdCard]);
  };

  const startGame = (): void => {
    setStarted(true);
    stopwatch.start();
  };

  const handleKeyDown = (keyEvent: KeyboardEvent): void => {
    if (started) {
      if (keyEvent.code === "KeyA") {
        testSet(1);
      } else if (keyEvent.code === "KeyD") {
        testSet(-1);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="container ptm bg pbxl">
      <div className="row mts">
        <a className="pull-right phs" href="/history">
          game history
        </a>
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
            <SetCard width={cardWidth} value={currentCards[0]} blank={!started ? "A" : undefined} />
            <SetCard width={cardWidth} value={currentCards[1]} blank={!started ? "B" : undefined} />
            <SetCard width={cardWidth} value={currentCards[2]} blank={!started ? "C" : undefined} />
          </div>

          <div className={`${isXS ? "" : "mhxl"} mtl fdr fjc`}>
            <div className="mrd">
              <Button
                disabled={!started}
                variant="contained"
                color="primary"
                onClick={(): void => testSet(1)}
              >
                <CheckCircleIcon className="mrs" />
                it's a set
              </Button>
              <div className="align-center">(press A)</div>
            </div>
            <div className="mld">
              <Button
                disabled={!started}
                variant="contained"
                color="secondary"
                onClick={(): void => testSet(-1)}
              >
                <CancelIcon className="mrs" />
                not a set
              </Button>
              <div className="align-center">(press D)</div>
            </div>
          </div>

          <StartPlayingButton started={started} startGameCallback={startGame} />

          <SolutionAlert alertState={alertState} />
        </>
      )}

      <TimerRow pastSets={pastSets} stopwatch={stopwatch} />
      <PastSetsPills pastSets={pastSets} />
      <Score
        showPlayAgain={started && currentCards.length === 0}
        wins={wins}
        losses={losses}
        playAgainCallback={playAgain}
      />
    </div>
  );
};

export default Index;
