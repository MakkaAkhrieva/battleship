import { WebSocketServer } from "ws";
import { removeUserConnection, usersConnections } from "../db/db";

import { handleRequest } from "./handleRequest";
import { generateId } from "../helpers/generateId";
import { WebSocketWithId } from '../types';

const WS_PORT = 3000;

export const wsServer = new WebSocketServer({
  port: WS_PORT,
});

wsServer.on("connection", (ws: WebSocketWithId) => {
  console.log(`WebSocket connection established on the ${WS_PORT} port`);

  const id = generateId();
  ws.id = id;

  usersConnections.push(ws);

  ws.on("message", (message: string) => {
    const request = JSON.parse(message);
    handleRequest(ws, request);
  });

  ws.on("close", () => {
    console.log("Connection interrupted");
    removeUserConnection(ws.id);
  });
});
