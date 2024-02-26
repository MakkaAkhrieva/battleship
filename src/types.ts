import { WebSocket } from "ws";

export interface WebSocketWithId extends WebSocket {
  id: number;
}

export interface UserData {
  name: string;
  password: string;
}

export interface Params {
  gameId: number;
  coords: CellCoords;
  players: DefinedAttackers;
}

export type Player = {
  wsId: number;
  name: string;
  password: string;
  wins: number;
};

export type PlayerRooms = {
  roomId: number;
  playerNames: string[];
};

export type Winner = {
  wsId: number;
  name: string;
  wins: number;
};

export type Game = {
  id: number;
  player_1: UserGameInfo;
  player_2: UserGameInfo;
};

export type GameField = GameCell[][];

export type GameCell =
  | "miss"
  | "killed"
  | "shot"
  | "empty"
  | "small"
  | "medium"
  | "large"
  | "huge";

export type Ship = {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
};

type Position = {
  x: number;
  y: number;
};

export type ShipType = "small" | "medium" | "large" | "huge";

export type PlayersShipsInfo = {
  player_1?: Ship[];
  player_2?: Ship[];
};

export type CellCoords = {
  x: number;
  y: number;
};

export type AdjacentCell = {
  status: GameCell;
  x: number;
  y: number;
};

export type AddShips = {
  gameId: number;
  ships: [
    {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: "small" | "medium" | "large" | "huge";
    }
  ];
  indexPlayer: number;
};

export type Attack = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type RandomAttack = {
  gameId: number;
  indexPlayer: number;
};

export type DefinedAttackers = {
  sendAttackPlayer: UserGameInfo;
  getAttackPlayer: UserGameInfo;
};

export type UserGameInfo = {
  wsId: number;
  turn: boolean;
  field?: GameField;
};

export type FrontRequest = {
  type: string;
  data: RequestData;
  id: 0;
};

export type RequestData =
  | PlayerReg
  | CreateRoom
  | AddUserToRoom
  | AddShips
  | Attack
  | RandomAttack;

export type PlayerReg = {
  name: string;
  password: string;
};

export type CreateRoom = string;

export type AddUserToRoom = {
  indexRoom: number;
};
