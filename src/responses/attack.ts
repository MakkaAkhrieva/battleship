import { findCurrentGame, generateRandomCoords } from "../helpers/game";
import { attackHandler, identiFyAttacker } from "../helpers/attackHandlers";
import { Attack, CellCoords, RandomAttack } from "../types";

export const attack = (attackData: Attack) => {
  const currentGame = findCurrentGame(attackData.gameId);

  const { sendAttackPlayer, getAttackPlayer } = identiFyAttacker(
    currentGame,
    attackData.indexPlayer
  );

  if (sendAttackPlayer.turn) {
    const { x, y } = attackData;

    const args = {
      gameId: attackData.gameId,
      coords: { x, y },
      players: {
        sendAttackPlayer,
        getAttackPlayer,
      },
    };

    attackHandler(args);
    console.log("This user has carried out an attack:");
    console.log(sendAttackPlayer);
    console.log(`By coordinates: X - ${x}, Y - ${y}`);
  }
};

export const randomAttack = (attackData: RandomAttack) => {
  const currentGame = findCurrentGame(attackData.gameId);

  const { sendAttackPlayer, getAttackPlayer } = identiFyAttacker(
    currentGame,
    attackData.indexPlayer
  );

  if (sendAttackPlayer.turn) {
    const { x, y } = generateRandomCoords(getAttackPlayer.field!) as CellCoords;

    const args = {
      gameId: attackData.gameId,
      coords: { x, y },
      players: {
        sendAttackPlayer,
        getAttackPlayer,
      },
    };

    attackHandler(args);

    console.log("This user has carried out an random attack:");
    console.log(sendAttackPlayer);
    console.log(`By coordinates: X - ${x}, Y - ${y}`);
  }
};
