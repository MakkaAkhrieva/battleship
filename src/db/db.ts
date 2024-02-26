import { WebSocketWithId, Player, PlayerRooms, Winner, Game } from "../types";

export const botWs = {
  id: -1,
  send: () => {},
} as unknown as WebSocketWithId;

export const usersConnections: WebSocketWithId[] = [botWs];

const bot = {
  wsId: -1,
  name: "root",
  password: "root",
  wins: -1,
};

export const players: Player[] = [bot];

export const winners: Winner[] = [];

export const playerRooms: PlayerRooms[] = [];

export const currentGames: Game[] = [];

export const singlePlayers: Player[] = [];

export const removeUserConnection = (id: number) => {
  const deletingPosition = usersConnections.findIndex(
    (connection) => connection.id === id
  );
  usersConnections.splice(deletingPosition, 1);
};

export const removePlayerRoom = (id: number) => {
  const deletingPosition = playerRooms.findIndex((room) => room.roomId === id);
  playerRooms.splice(deletingPosition, 1);
};

export const removeSinglePlayer = (id: number) => {
  const deletingPosition = singlePlayers.findIndex(
    (player) => player.wsId === id
  );
  singlePlayers.splice(deletingPosition, 1);
};
