/* eslint-disable react-hooks/exhaustive-deps */

import React, { ReactElement, useEffect, useState } from "react";
import { PastGame } from "../lib/types";
import { yearMonthDayFormat } from "../lib/utils";
import dayjs from "dayjs";
import { GameStat } from "../components/GameStat";
import { StorageClient } from "../lib/StorageClient";

const History = (): ReactElement => {
  const [groupedGames, setGroupedGames] = useState<Record<string, PastGame[]>>({});

  useEffect(() => {
    const pastGames = StorageClient.getHistory();

    const groupByDate = (games: PastGame[]): Record<string, PastGame[]> => {
      return games.reduce<Record<string, PastGame[]>>(
        (acc: Record<string, PastGame[]>, game: PastGame): Record<string, PastGame[]> => {
          if (acc[yearMonthDayFormat(game.timestamp)]) {
            acc[yearMonthDayFormat(game.timestamp)].push(game);
          } else {
            acc[yearMonthDayFormat(game.timestamp)] = [game];
          }
          return acc;
        },
        {}
      );
    };

    setGroupedGames(groupByDate(pastGames));
  }, []);

  const dayOfWeekFormat = (timestamp: string): string => {
    return dayjs(timestamp).format("ddd, MMM D YYYY");
  };

  return (
    <div className="container ptm bg pbxl">
      <div className="row mts">
        <a className="pull-right phs" href="/guesser">
          guess the third game
        </a>
        <a className="pull-right phs" href="/">
          sertify game
        </a>
      </div>

      <h1 className="text-xl mbl">Your history</h1>
      {Object.keys(groupedGames)
        .sort()
        .reverse()
        .map((date) => (
          <div className="col-sm-8 col-sm-offset-2 mbxl" key={date} data-testid="day">
            <h3 className="text-l">{dayOfWeekFormat(date)}</h3>
            <hr />
            <table className="mtm">
              <thead>
                <tr>
                  <th>time</th>
                  <th>game</th>
                  <th>
                    {" "}
                    <span className="text-bright">wins</span>:
                    <span className="text-tomato">losses</span>
                  </th>
                  <th>avg time</th>
                  <th>total time</th>
                </tr>
              </thead>
              <tbody>
                {groupedGames[date]
                  .sort((a, b) => {
                    if (a.timestamp < b.timestamp) {
                      return 1;
                    }
                    if (a.timestamp > b.timestamp) {
                      return -1;
                    }
                    return 0;
                  })
                  .map((game, i) => (
                    <GameStat game={game} key={i} />
                  ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default History;
