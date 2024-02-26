import { players } from "../db/db";
import { Player } from "../types";

export const findPlayerByName = (name: string): Player =>
  players.find((player) => player.name === name) as Player;

export const findPlayerById = (id: number): Player =>
  players.find((player) => player.wsId === id) as Player;

export const isPlayer = (name: string): boolean => {
  return Boolean(players.find((player) => player.name === name));
};
