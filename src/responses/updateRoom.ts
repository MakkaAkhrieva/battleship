import { playerRooms, usersConnections } from "../db/db";
import { findPlayerById, findPlayerByName } from "../helpers/findPlayer";

export const updateRoom = () => {
  const roomsWithOnePlayer = playerRooms.filter(
    (room) => room.playerNames.length === 1
  );

  let data;

  usersConnections.forEach((connection) => {
    if (roomsWithOnePlayer.length) {
      const currentPlayer = findPlayerById(connection.id);

      const availableRooms = roomsWithOnePlayer.filter(
        (room) => !room.playerNames.includes(currentPlayer.name)
      );

      if (availableRooms.length) {
        data = availableRooms.map((room) => {
          const roomUsers = room.playerNames.map((name) => ({
            name,
            index: findPlayerByName(name).wsId,
          }));
          return {
            roomId: room.roomId,
            roomUsers,
          };
        });
      } else {
        data = {
          roomId: -1,
          roomUsers: [],
        };
      }
    } else {
      data = {
        roomId: -1,
        roomUsers: [],
      };
    }
    const responseData = {
      type: "update_room",
      data: JSON.stringify(data),
      id: 0,
    };
    connection.send(JSON.stringify(responseData));
  });

  console.log("The rooms has been updated");
  console.log(data);
};
