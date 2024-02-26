import { winners, usersConnections } from "../db/db";

export const updateWinners = () => {
  const winnersData = winners.map((winner) => ({
    name: winner.name,
    wins: winner.wins,
  }));

  const responseData = {
    type: "update_winners",
    data: JSON.stringify(winnersData),
    id: 0,
  };

  usersConnections.forEach((connection) => {
    connection.send(JSON.stringify(responseData));
  });

  console.log("The winners have been updated:");
  console.log(winners);
};
