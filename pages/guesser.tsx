/* eslint-disable react-hooks/exhaustive-deps */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Button, FormControlLabel, Switch, useMediaQuery } from "@material-ui/core";
import { MediaQueries } from "../lib/MediaQueries";
import { conjugateCard, generateDeck, shuffle } from "../lib/set-helpers";
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

const Guesser = (): ReactElement => {
  const [deck, setDeck] = useState<string[]>(generateDeck());
  const [index, setIndex] = useState<number>(0);
  const [currentCards, setCurrentCards] = useState<string[]>([]);
  const [randomCards, setRandomCards] = useState<string[]>([]);

  const isLarge = useMediaQuery(MediaQueries.desktopAndUp);
  const isXS = useMediaQuery(MediaQueries.isXS);
  const isXXS = useMediaQuery(MediaQueries.isXXS);
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [alertState, setAlertState] = useState<"NONE" | "SUCCESS" | "FAIL">("NONE");
  const [, setRenderTime] = React.useState(new Date().getTime());
  const [pastSets, setPastSets] = useState<PastSet[]>([]);
  const [hardMode, setHardMode] = useState<boolean>(false);

  const stopwatch = useStopwatch();

  const cardWidth = getCardWidth(isLarge, isXS, isXXS);

  React.useEffect(() => {
    const timeout = setTimeout(() => setRenderTime(new Date().getTime()), 50);
    return (): void => {
      clearTimeout(timeout);
    };
  });

  const replaceAt = (str: string, index: number, replacement: string): string => {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
  };

  const getRandomCardHardMode = useCallback(
    (thirdCard: string, existing?: string): string => {
      const randomProperty = Math.floor(Math.random() * 4);
      const randomUpOrDown = Math.round(Math.random()) ? -1 : 0;

      let newChar = parseInt(thirdCard.charAt(randomProperty)) + randomUpOrDown;
      if (newChar < 0) newChar = 2;
      if (newChar > 2) newChar = 0;
      const newCard = replaceAt(thirdCard, randomProperty, newChar + "");

      if (
        currentCards.includes(newCard) ||
        newCard === thirdCard ||
        (existing && existing === newCard)
      ) {
        return getRandomCardHardMode(thirdCard, existing);
      }
      setRandomCards((prev) => [...prev, newCard]);
      return newCard;
    },
    [currentCards, deck]
  );

  const getRandomCard = useCallback(
    (thirdCard: string, existing?: string): string => {
      if (hardMode) {
        return getRandomCardHardMode(thirdCard, existing);
      }

      const randomIndex = Math.floor(Math.random() * deck.length);
      if (
        currentCards.includes(deck[randomIndex]) ||
        (existing && existing === deck[randomIndex])
      ) {
        return getRandomCard(thirdCard, existing);
      }
      return deck[randomIndex];
    },
    [currentCards, deck]
  );

  const next = useCallback((): void => {
    if (index + 3 < deck.length) {
      setIndex(index + 3);
      stopwatch.start();
    } else {
      setCurrentCards([]);
    }

    setTimeout(() => {
      setAlertState("NONE");
    }, 500);
  }, [setIndex, setCurrentCards, setAlertState, deck.length, index]);

  const testSet = useCallback(
    (card: string): void => {
      if (currentCards.length === 0) return;
      setAlertState("NONE");
      const time = stopwatch.getElapsedRunningTime();
      stopwatch.stop();

      if (currentCards[2] === card) {
        setWins(wins + 1);
        setAlertState("SUCCESS");
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
    setIndex(0);
    setPastSets([]);
    setDeck(generateDeck());
  };

  useEffect(() => {
    const thirdCard = conjugateCard(deck[index], deck[index + 1]);
    setCurrentCards([deck[index], deck[index + 1], thirdCard]);
    const card1 = getRandomCard(thirdCard);
    const card2 = getRandomCard(thirdCard, card1);
    setRandomCards(shuffle([thirdCard, card1, card2]));
    stopwatch.start();
  }, [index, setCurrentCards, deck]);

  const handleKeyDown = useCallback(
    (keyEvent: KeyboardEvent): void => {
      if (keyEvent.code === "KeyA") {
        testSet(randomCards[0]);
      } else if (keyEvent.code === "KeyS") {
        testSet(randomCards[1]);
      } else if (keyEvent.code === "KeyD") {
        testSet(randomCards[2]);
      }
    },
    [testSet, randomCards]
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
        <a className="pull-right phs" href="/">
          sertify game
        </a>
      </div>

      <h1 className="text-xl">Sertify: Guess the Third</h1>
      <h2 className="text-m">The game of rapid set completion</h2>
      <p>
        As quickly as possible, given two cards, pick the card from the options that completes the
        set.
      </p>
      <FormControlLabel
        control={
          <Switch
            checked={hardMode}
            onChange={(): void => {
              setHardMode(!hardMode);
              playAgain();
            }}
            name="hardMode"
          />
        }
        label="Hard mode (makes the options more similar)"
      />

      {currentCards.length > 0 && (
        <>
          <div className="fdr fjc fac">
            Your cards:
            <SetCard width={cardWidth} value={currentCards[0]} />
            <SetCard width={cardWidth} value={currentCards[1]} />
          </div>

          <hr />

          <div className="text-l mls mtd">What's the third?</div>
          <div className="fdr fjc fac">
            <div className="fdc fac">
              <SetCard
                width={cardWidth}
                value={randomCards[0]}
                onClick={(): void => testSet(randomCards[0])}
              />
              <div className="mrd">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(): void => testSet(randomCards[0])}
                >
                  <CheckCircleIcon className="mrs" />
                  this one!
                </Button>
                <div className="align-center">(press A)</div>
              </div>
            </div>
            <div className="fdc fac">
              <SetCard
                width={cardWidth}
                value={randomCards[1]}
                onClick={(): void => testSet(randomCards[1])}
              />
              <div className="mrd">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(): void => testSet(randomCards[1])}
                >
                  <CheckCircleIcon className="mrs" />
                  it's me
                </Button>
                <div className="align-center">(press S)</div>
              </div>
            </div>
            <div className="fdc fac">
              <SetCard
                width={cardWidth}
                value={randomCards[2]}
                onClick={(): void => testSet(randomCards[2])}
              />
              <div className="mrd">
                <Button
                  variant="contained"
                  color="tertiary"
                  onClick={(): void => testSet(randomCards[2])}
                >
                  <CheckCircleIcon className="mrs" />
                  i'm the one
                </Button>
                <div className="align-center">(press D)</div>
              </div>
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
        <span>
          Average: <b>{toSeconds(getAverage())}</b>
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

export default Guesser;
