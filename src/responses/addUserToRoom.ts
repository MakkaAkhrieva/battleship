import { playerRooms, players } from "../db/db";
import { findPlayerById } from "../helpers/findPlayer";
import { AddUserToRoom, WebSocketWithId } from "../types";

export const addUserToRoom = (
  ws: WebSocketWithId,
  { indexRoom }: AddUserToRoom
) => {
  const room = playerRooms.find((room) => room.roomId === indexRoom);

  if (!room || room.playerNames.length > 1) {
    return;
  }

  const player = players.find((player) =>
    room.playerNames.includes(player.name)
  );

  if (player?.wsId === ws.id) {
    return;
  }

  const newPlayer = findPlayerById(ws.id);
  room.playerNames.push(newPlayer.name);

  console.log(
    `The  user ${newPlayer} has been added to the room with ID: ${indexRoom}`
  );
};
