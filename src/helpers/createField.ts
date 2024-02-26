import { GAME } from "../constants";
import { GameField, Ship } from "../types";

export const createEmptyField = (): GameField =>
  Array.from({ length: GAME.field_size }, () =>
    Array(GAME.field_size).fill("empty")
  );

export const createField = (ships: Ship[]): GameField => {
  const field: GameField = createEmptyField();

  for (const ship of ships) {
    const { direction, length, position } = ship;
    const { x, y } = position;

    for (let i = 0; i < length; i = i + 1) {
      const cellX = direction ? x : x + i;
      const cellY = direction ? y + i : y;

      field[cellY][cellX] = ship.type;
    }
  }

  return field;
};
