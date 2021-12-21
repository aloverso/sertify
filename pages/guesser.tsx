/* eslint-disable react-hooks/exhaustive-deps */

import React, { ReactElement, useEffect, useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import { MediaQueries } from "../lib/MediaQueries";
import { conjugateCard, generateDeck, shuffle } from "../lib/set-helpers";
import { getCardWidth } from "../lib/layout-helpers";
import { SetCard } from "../components/SetCard";
import { useStopwatch } from "react-use-precision-timer";
import { TimerRow } from "../components/TimerRow";
import { AlertState, PastSet } from "../lib/types";
import { replaceAt } from "../lib/utils";
import { PastSetsPills } from "../components/PastSetsPills";
import { Score } from "../components/Score";
import { SolutionAlert } from "../components/SolutionAlert";
import { HardModeToggle } from "../components/HardModeToggle";
import { StartPlayingButton } from "../components/StartPlayingButton";

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
  const [alertState, setAlertState] = useState<AlertState>("NONE");
  const [, setRenderTime] = React.useState(new Date().getTime());
  const [pastSets, setPastSets] = useState<PastSet[]>([]);
  const [hardMode, setHardMode] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);

  const stopwatch = useStopwatch();

  const cardWidth = getCardWidth(isLarge, isXS, isXXS);

  useEffect(() => {
    const timeout = setTimeout(() => setRenderTime(new Date().getTime()), 50);
    return (): void => {
      clearTimeout(timeout);
    };
  });

  useEffect(() => {
    setNextThreeCards(0);
  }, []);

  const getRandomCardHardMode = (thirdCard: string, existing?: string): string => {
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
  };

  const getRandomCard = (thirdCard: string, existing?: string): string => {
    if (hardMode) {
      return getRandomCardHardMode(thirdCard, existing);
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    if (currentCards.includes(deck[randomIndex]) || (existing && existing === deck[randomIndex])) {
      return getRandomCard(thirdCard, existing);
    }
    return deck[randomIndex];
  };

  const next = (): void => {
    if (index + 3 < deck.length) {
      const newIndex = index + 3;
      setIndex(newIndex);
      setNextThreeCards(newIndex);
      stopwatch.start();
    } else {
      setCurrentCards([]);
    }

    setTimeout(() => {
      setAlertState("NONE");
    }, 500);
  };

  const testSet = (card: string): void => {
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
  };

  const playAgain = (): void => {
    setWins(0);
    setLosses(0);
    setAlertState("NONE");
    setIndex(0);
    setPastSets([]);
    setDeck(generateDeck());
  };

  const setNextThreeCards = (newIndex: number): void => {
    const thirdCard = conjugateCard(deck[newIndex], deck[newIndex + 1]);
    setCurrentCards([deck[newIndex], deck[newIndex + 1], thirdCard]);
    const card1 = getRandomCard(thirdCard);
    const card2 = getRandomCard(thirdCard, card1);
    setRandomCards(shuffle([thirdCard, card1, card2]));
  };

  const startGame = (): void => {
    setStarted(true);
    stopwatch.start();
  };

  const handleKeyDown = (keyEvent: KeyboardEvent): void => {
    if (started) {
      if (keyEvent.code === "KeyA") {
        testSet(randomCards[0]);
      } else if (keyEvent.code === "KeyS") {
        testSet(randomCards[1]);
      } else if (keyEvent.code === "KeyD") {
        testSet(randomCards[2]);
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
      <HardModeToggle hardMode={hardMode} setHardMode={setHardMode} resetCallback={playAgain} />

      {currentCards.length > 0 && (
        <>
          <div className="fdr fjc fac">
            <SetCard width={cardWidth} value={currentCards[0]} blank={!started ? "1" : undefined} />
            <SetCard width={cardWidth} value={currentCards[1]} blank={!started ? "2" : undefined} />
            <SetCard width={cardWidth} value={currentCards[1]} blank={"?"} />
          </div>

          <hr />

          <div className="text-l mtd">What's the third?</div>
          <div className="fdr fjc fac">
            <div className="fdc fac fjc">
              <SetCard
                width={cardWidth}
                value={randomCards[0]}
                onClick={(): void => (started ? testSet(randomCards[0]) : undefined)}
                blank={!started ? "A" : undefined}
              />
              <div className="align-center">(press A)</div>
            </div>
            <div className="fdc fac fjc">
              <SetCard
                width={cardWidth}
                value={randomCards[1]}
                onClick={(): void => (started ? testSet(randomCards[1]) : undefined)}
                blank={!started ? "S" : undefined}
              />
              <div className="align-center">(press S)</div>
            </div>
            <div className="fdc fac fjc">
              <SetCard
                width={cardWidth}
                value={randomCards[2]}
                onClick={(): void => (started ? testSet(randomCards[2]) : undefined)}
                blank={!started ? "D" : undefined}
              />
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

export default Guesser;
