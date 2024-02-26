import { httpServer } from "./src/http_server/index";
import dotenv from "dotenv";
import "./src/ws/ws";

dotenv.config();

export const HTTP_PORT = parseInt(process.env.PORT || "8181");

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
