import { createField } from "../helpers/createField";
import { findCurrentConnection, findCurrentGame } from '../helpers/game';
import {
	AddShips,
  PlayersShipsInfo,
  Ship,
  UserGameInfo,
  WebSocketWithId,
} from "../types";
import { turn } from './turn';

const sendStartGameRequest = (
  ws: WebSocketWithId,
  playerInfo: UserGameInfo,
  playerShips: Ship[]
) => {
  const responseData = {
    type: "start_game",
    data: JSON.stringify({
      ships: playerShips,
      currentPlayerIndex: playerInfo.wsId,
    }),
    id: 0,
  };

  ws.send(JSON.stringify(responseData));
};

export const startGame = (ws: WebSocketWithId, data: AddShips) => {
  const playersShipsInfo: PlayersShipsInfo = {};
  const currentGame = findCurrentGame(data.gameId);

  const ships: Ship[] = data.ships;
  const field = createField(ships);

  const { player_1, player_2 } = currentGame;

  if (player_1.wsId === ws.id) {
    player_1.field = field;
    playersShipsInfo.player_1 = ships;
  } else {
    player_2.field = field;
    playersShipsInfo.player_2 = ships;
  }

  if (player_1.field && player_2.field) {
    console.log(`Player 1 field with id: ${player_1.wsId}`);
    console.log(player_1.field);
    console.log(`Player 2 field with id: ${player_2.wsId}`);
    console.log(player_2.field);
    if (player_1.wsId !== ws.id) {
      const connection_1 = findCurrentConnection(player_1.wsId);
      sendStartGameRequest(connection_1, player_1, playersShipsInfo.player_1!);

      const connection_2 = ws;
      sendStartGameRequest(connection_2, player_2, playersShipsInfo.player_2!);

      turn(data.gameId, player_2.wsId, connection_1, connection_2);
    } else {
      const connection_1 = ws;
      sendStartGameRequest(connection_1, player_1, playersShipsInfo.player_1!);

      const connection_2 = findCurrentConnection(player_2.wsId);
      sendStartGameRequest(connection_2, player_2, playersShipsInfo.player_2!);

      turn(data.gameId, player_1.wsId, connection_1, connection_2);
    }
  }

  console.log(`The ${currentGame}  game has been started:`);
};
