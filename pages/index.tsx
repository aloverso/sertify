import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Button, useMediaQuery } from "@material-ui/core";
import { MediaQueries } from "../lib/MediaQueries";
import { checkSet, conjugateCard, generateDeck } from "../lib/set-helpers";
import { getCardWidth } from "../lib/layout-helpers";
import { SetCard } from "../components/SetCard";
import { Alert } from "@material-ui/lab";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

// type PastSet = {
//   cardA: string;
//   cardB: string;
//   cardC: string;
//   result: 'SUCCESS' | 'FAIL';
//   time: number;
// }

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
  // const [pastSets, setPastSets] = useState<PastSet[]>([])

  const cardWidth = getCardWidth(isLarge, isXS, isXXS);

  const next = useCallback((): void => {
    if (index + 3 < deck.length) {
      setIndex(index + 3);
    } else {
      setCurrentCards([]);
    }

    setTimeout(() => {
      setAlertState("NONE");
    }, 500);
  }, [setIndex, setCurrentCards, setAlertState, deck.length, index]);

  const testAccept = useCallback((): void => {
    if (currentCards.length === 0) return;
    setAlertState("NONE");

    if (checkSet(currentCards[0], currentCards[1], currentCards[2])) {
      setWins(wins + 1);
      setAlertState("SUCCESS");
    } else {
      setLosses(losses + 1);
      setAlertState("FAIL");
    }

    next();
  }, [currentCards, setAlertState, setWins, setLosses, next, losses, wins]);

  const testReject = useCallback((): void => {
    if (currentCards.length === 0) return;

    setAlertState("NONE");

    if (!checkSet(currentCards[0], currentCards[1], currentCards[2])) {
      setWins(wins + 1);
      setAlertState("SUCCESS");
    } else {
      setLosses(losses + 1);
      setAlertState("FAIL");
    }
    next();
  }, [currentCards, setAlertState, setWins, setLosses, next, losses, wins]);

  const playAgain = (): void => {
    setWins(0);
    setLosses(0);
    setAlertState("NONE");
    setIndex(0);
    setDeck(generateDeck());
  };

  useEffect(() => {
    const shouldBeSet = Math.round(Math.random()) === 0;
    let thirdCard = conjugateCard(deck[index], deck[index + 1]);
    if (!shouldBeSet) {
      thirdCard = deck[index + 2];
    }
    setCurrentCards([deck[index], deck[index + 1], thirdCard]);
  }, [index, setCurrentCards, deck]);

  const handleKeyDown = useCallback(
    (keyEvent: KeyboardEvent): void => {
      if (keyEvent.code === "KeyA") {
        testAccept();
      } else if (keyEvent.code === "KeyD") {
        testReject();
      }
    },
    [testAccept, testReject]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="container ptm">
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
              <Button variant="contained" color="primary" onClick={testAccept}>
                <CheckCircleIcon className="mrs" />
                it's a set
              </Button>
              <div className="align-center">(press A)</div>
            </div>
            <div className="mld">
              <Button variant="contained" color="secondary" onClick={testReject}>
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
