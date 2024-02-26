import { FrontRequest, PlayerReg, WebSocketWithId } from "../types";

import { singlePlayers } from "../db/db";
import { registrPlayer } from "../responses/registrPlayer";
import { updateRoom } from "../responses/updateRoom";
import { updateWinners } from "../responses/updateWinners";

export const handleRequest = (ws: WebSocketWithId, request: FrontRequest) => {
  const isItSimpleGame = singlePlayers.find((player) => player.wsId === ws.id);
  console.log(`Received command: ${request.type}`);
  try {
    if (isItSimpleGame) {
      //with bot
    } else {
      switch (request.type) {
        case "reg":
          registrPlayer(ws, JSON.parse(request.data as string) as PlayerReg);
          updateRoom();
          updateWinners();
          break;
      }
    }
  } catch (error) {
    console.log(`The following error occurred: ${error}`);
  }
};
