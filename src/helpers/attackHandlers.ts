import {
  DefinedAttackers,
  Game,
  Params,
  ShipType,
  UserGameInfo,
} from "../types";
import { removeSinglePlayer, winners } from "../db/db";
import { updateWinners } from "../responses/updateWinners";
import { notifyHitShipCell } from "./notifyHitShipCell";
import { GAME } from "../constants";
import {
  checkIsGameEnd,
  checkIsItSimpleGame,
  findCurrentConnection,
  findCurrentGame,
} from "./game";
import { turn } from "../responses/turn";
import { findPlayerById } from "./findPlayer";
import { getCellStatus } from "./getCellStatus";
import { updateField } from "./updateField";

export const identiFyAttacker = (
  game: Game,
  indexPlayer: number
): DefinedAttackers => {
  let sendAttackPlayer: UserGameInfo;
  let getAttackPlayer: UserGameInfo;

  game.player_1.wsId === indexPlayer
    ? (function () {
        sendAttackPlayer = game.player_1;
        getAttackPlayer = game.player_2;
      })()
    : (function () {
        sendAttackPlayer = game.player_2;
        getAttackPlayer = game.player_1;
      })();

  return { sendAttackPlayer, getAttackPlayer };
};

export const attackHandler = ({ gameId, coords, players }: Params) => {
  const { x, y } = coords;
  const { sendAttackPlayer, getAttackPlayer } = players;

  const shottingCell = getAttackPlayer.field![y][x];

  const cellStatus = getCellStatus(shottingCell, getAttackPlayer.field!, {
    x,
    y,
  });

  updateField(cellStatus, getAttackPlayer.field!, { x, y });

  const isGameEnd = checkIsGameEnd(getAttackPlayer.field!);

  const type = isGameEnd ? "finish" : "attack";
  const data = isGameEnd
    ? {
        winPlayer: sendAttackPlayer.wsId,
      }
    : {
        position: {
          x,
          y,
        },
        currentPlayer: sendAttackPlayer.wsId,
        status: cellStatus,
      };

  const responseData = {
    type,
    data: JSON.stringify(data),
    id: 0,
  };

  const connection1 = findCurrentConnection(sendAttackPlayer.wsId);
  const connection2 = findCurrentConnection(getAttackPlayer.wsId);

  connection1.send(JSON.stringify(responseData));
  connection2.send(JSON.stringify(responseData));

  if (cellStatus === "killed") {
    notifyHitShipCell(
      getAttackPlayer.field!,
      { x, y },
      shottingCell as ShipType,
      sendAttackPlayer.wsId,
      connection1,
      connection2
    );
  }

  if (isGameEnd) {
    const winner = winners.find(
      (winner) => winner.wsId === sendAttackPlayer.wsId
    );
    if (winner) {
      winner.wins += 1;
    } else {
      const winner = findPlayerById(sendAttackPlayer.wsId);
      winner.wins += 1;

      winners.push({ wsId: winner.wsId, name: winner.name, wins: winner.wins });
    }

    updateWinners();
    const isItSimpleGame = checkIsItSimpleGame(gameId);

    if (isItSimpleGame) {
      const currentGame = findCurrentGame(gameId);
      const simplePlayer =
        currentGame.player_1.wsId === GAME.ws_id_bot
          ? currentGame.player_2
          : currentGame.player_1;

      removeSinglePlayer(simplePlayer.wsId);
    }
  } else {
    if (cellStatus === "killed" || cellStatus === "shot") {
      turn(gameId, sendAttackPlayer.wsId, connection1, connection2);
    } else {
      turn(gameId, getAttackPlayer.wsId, connection1, connection2);
    }
  }
};
