import { playerRooms } from "../db/db";
import { findPlayerById } from '../helpers/findPlayer';
import { generateId } from '../helpers/generateId';
import { WebSocketWithId } from '../types';

export const createRoom = (ws: WebSocketWithId): number => {
  const roomId = generateId();
  const player = findPlayerById(ws.id);

  playerRooms.push({ roomId, playerNames: [player.name] });

  console.log(`A room has been created with ID: ${roomId}`);
  return roomId;
};
