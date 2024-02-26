import {
  AddShips,
  AddUserToRoom,
  Attack,
  FrontRequest,
  PlayerReg,
  RandomAttack,
  WebSocketWithId,
} from "../types";
import { singlePlayers } from "../db/db";
import { registrPlayer } from "../responses/registrPlayer";
import { updateRoom } from "../responses/updateRoom";
import { updateWinners } from "../responses/updateWinners";
import { createRoom } from "../responses/createRoom";
import { addUserToRoom } from "../responses/addUserToRoom";
import { createGame } from "../responses/createGame";
import { startGame } from "../responses/startGame";
import { attack, randomAttack } from "../responses/attack";

export const handleRequest = (ws: WebSocketWithId, request: FrontRequest) => {
  const isPlayWithBot = singlePlayers.find((player) => player.wsId === ws.id);
  console.log(`request: ${request.type}`);
  try {
    if (isPlayWithBot) {
      //with bot
    } else {
      switch (request.type) {
        case "reg":
          registrPlayer(ws, JSON.parse(request.data as string) as PlayerReg);
          updateRoom();
          updateWinners();
          break;
        case "create_room":
          createRoom(ws);
          updateRoom();
          break;
        case "add_user_to_room":
          addUserToRoom(
            ws,
            JSON.parse(request.data as string) as AddUserToRoom
          );
          updateRoom();
          createGame(JSON.parse(request.data as string) as AddUserToRoom);
          break;
        case "add_ships":
          startGame(ws, JSON.parse(request.data as string) as AddShips);
          break;
        case "attack":
          attack(JSON.parse(request.data as string) as Attack);
          break;
        case "randomAttack":
          randomAttack(JSON.parse(request.data as string) as RandomAttack);
          break;
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
