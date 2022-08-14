import { rejects } from "../data.js";

export const pairUp = (people) => {
  const users = [...people].sort(() => Math.random() - 0.5);
  const friends = [...people].sort(() => Math.random() - 0.5);

  const pairs = friends.map((friend) => {
    const index = users[0] !== friend ? 0 : 1;
    const user = users[index] ?? null;
    let newPair;

    !user ? rejects?.push(friend) : (newPair = [user, friend]);
    friends.splice(friends.indexOf(user), 1);
    users.splice(users.indexOf(friend), 1);
    users.splice(0, 1);

    return newPair;
  });
  return pairs;
};
