import { rejects } from "../data.js";
import { userHasBlacklist, findBlacklist } from "./blacklisting.js";

const checkBlacklist = (target) =>
  userHasBlacklist(target) ? findBlacklist(target) : null;

const badMatch = (user, friend) =>
  !!checkBlacklist(user)?.includes(friend) ||
  !!checkBlacklist(friend)?.includes(user);

export const pairUp = (people) => {
  const users = [...people].sort(() => Math.random() - 0.5);
  const friends = [...people].sort(() => Math.random() - 0.5);

  const pairs = friends.map((friend) => {
    const index = users[0] !== friend ? 0 : 1;
    const user = users[index] ?? null;

    const findMatch = rejects?.filter((user) => !badMatch(user, friend));

    let newPair;

    badMatch(user, friend)
      ? rejects?.push(user, friend)
      : !!user
      ? (newPair = [user, friend])
      : !rejects?.length && !findMatch.length
      ? rejects?.push(friend)
      : (newPair = [findMatch[0], friend]);

    friends.splice(friends.indexOf(user), 1);
    users.splice(users.indexOf(friend), 1);
    users.splice(0, 1);

    if (rejects.includes(newPair?.[0]))
      rejects.splice(rejects.indexOf(newPair[0], 1));

    return newPair;
  });
  return pairs;
};
