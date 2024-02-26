import { GAME } from '../constants';
import { findPlayerById } from '../helpers/findPlayer';
import { findCurrentGame } from '../helpers/game';
import { WebSocketWithId } from '../types';
import { randomAttack } from './attack';

export const turn = (
  gameId: number,
  walkingPlayerId: number,
  ...connections: WebSocketWithId[]
) => {
  const currentGame = findCurrentGame(gameId);

  if (currentGame.player_1.wsId === walkingPlayerId) {
    currentGame.player_1.turn = true;
    currentGame.player_2.turn = false;

    console.log(
      `Now is turn for ${findPlayerById(currentGame.player_1.wsId).name}`
    );
  } else {
    currentGame.player_1.turn = false;
    currentGame.player_2.turn = true;

    console.log(
      `Now is turn for ${findPlayerById(currentGame.player_2.wsId).name}`
    );
  }

  const responseData = {
    type: "turn",
    data: JSON.stringify({
      currentPlayer: walkingPlayerId,
    }),
    id: 0,
  };

  connections.forEach((connection) =>
    connection.send(JSON.stringify(responseData))
  );

  const botWs = connections.find((connection) => connection.id === GAME.ws_id_bot);

  if (botWs) {
    const bot =
      currentGame.player_1.wsId === GAME.ws_id_bot
        ? currentGame.player_1
        : currentGame.player_2;

    if (bot.turn) {
      const attackData = {
        gameId,
        indexPlayer: GAME.ws_id_bot,
      };

      setTimeout(() => randomAttack(attackData), 1500);
    }
  }
};
