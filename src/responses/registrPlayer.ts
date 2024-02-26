import { players } from "../db/db";
import { UserData, WebSocketWithId } from "../types";
import { findPlayerByName, isPlayer } from "../helpers/findPlayer";
import { ERRORS } from "../constants";

export const registrPlayer = (
  ws: WebSocketWithId,
  { name, password }: UserData
) => {
  if (!isPlayer(name)) {
    players.push({ wsId: ws.id, name, password, wins: 0 });
  }

  const player = findPlayerByName(name);
  player.wsId = ws.id;

  let data;

  if (player.password !== password) {
    data = {
      name,
      index: player.wsId,
      error: true,
      errorText: ERRORS.invalid_pass,
    };
    console.log(`A user named ${data.name} entered an invalid password`);
  } else {
    data = {
      name,
      index: player.wsId,
      error: false,
      errorText: "",
    };

    console.log("The following user is logged in:");
    console.log(data.name);
  }

  const responseData = {
    type: "reg",
    data: JSON.stringify(data),
    id: 0,
  };

  ws.send(JSON.stringify(responseData));
};
