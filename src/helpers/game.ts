import { GAME } from "../constants";
import { currentGames, usersConnections } from "../db/db";
import {
  AdjacentCell,
  CellCoords,
  Game,
  GameCell,
  GameField,
  WebSocketWithId,
} from "../types";

export const findCurrentGame = (id: number): Game =>
  currentGames.find((game) => game.id === id) as Game;

export const findCurrentConnection = (id: number): WebSocketWithId =>
  usersConnections.find(
    (connection) => connection.id === id
  ) as WebSocketWithId;

export const checkNearCells = (
  cell: GameCell,
  field: GameField,
  { x, y }: CellCoords
): GameCell => {
  if (cell === "medium") {
    if (getAdjacentCells(field, { x, y }, "medium").length) {
      return "shot";
    }
    return "killed";
  } else if (cell === "large") {
    if (getAdjacentCells(field, { x, y }, "large").length) {
      return "shot";
    } else {
      const shotCells: AdjacentCell[] = getAdjacentCells(
        field,
        { x, y },
        "shot"
      );

      if (shotCells.length === GAME.big_ship - GAME.cell) {
        return "killed";
      } else {
        const { x, y } = shotCells[0];

        const shotCellsForCell = getAdjacentCells(field, { x, y }, "shot");

        return shotCellsForCell.length ? "killed" : "shot";
      }
    }
  } else {
    if (getAdjacentCells(field, { x, y }, "huge").length) {
      return "shot";
    } else {
      const shotCells: AdjacentCell[] = getAdjacentCells(
        field,
        { x, y },
        "shot"
      );

      if (shotCells.length === GAME.max_cell) {
        const shotCellsForCell = shotCells.filter(
          (cell) =>
            getAdjacentCells(field, { x: cell.x, y: cell.y }, "shot").length
        );

        return shotCellsForCell.length ? "killed" : "shot";
      } else {
        const { x, y } = shotCells[0];
        const shotCellsForCell = getAdjacentCells(field, { x, y }, "shot");

        if (shotCellsForCell.length) {
          const { x, y } = shotCellsForCell[0] as AdjacentCell;
          const shotCells = getAdjacentCells(field, { x, y }, "shot");
          return shotCells.length > 1 ? "killed" : "shot";
        } else {
          return "shot";
        }
      }
    }
  }
};

export const getAdjacentCells = (
  field: GameField,
  { x, y }: CellCoords,
  condition: string,
  noFilter?: boolean
): AdjacentCell[] => {
  const numRows = field.length;
  const numCols = field[0].length;

  const neighbors: AdjacentCell[] = [];

  if (x > 0) {
    neighbors.push({ status: field[y][x - 1], x: x - 1, y });
  }

  if (x < numCols - 1) {
    neighbors.push({ status: field[y][x + 1], x: x + 1, y });
  }

  if (y > 0) {
    neighbors.push({ status: field[y - 1][x], x, y: y - 1 });
  }

  if (y < numRows - 1) {
    neighbors.push({ status: field[y + 1][x], x, y: y + 1 });
  }

  return noFilter
    ? neighbors
    : neighbors.filter((cell) => cell.status === condition);
};

export const checkIsItSimpleGame = (gameId: number) => {
  const currentGame = findCurrentGame(gameId);
  return currentGame.player_1.wsId === -1 || currentGame.player_2.wsId === -1;
};

export const checkIsGameEnd = (field: GameField): boolean => {
  const ships = ["small", "medium", "large", "huge"];

  return (
    field.filter((rows) => rows.filter((cell) => ships.includes(cell)).length)
      .length === 0
  );
};


export const generateRandomCoords = (field: GameField): CellCoords => {
  const markedCells = ["miss", "killed", "shot"];

  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);

  if (!markedCells.includes(field[y]?.[x])) {
    return { x, y };
  }
  return generateRandomCoords(field);
};
