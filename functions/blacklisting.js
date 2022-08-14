import { blacklist } from "../data.js";

export const userHasBlacklist = (user) =>
  blacklist?.some((obj) => obj.hasOwnProperty(user));

export const findBlacklist = (user) =>
  blacklist?.find((obj) => obj[user])[user];

export const updateBlacklist = (user, data) =>
  (blacklist.find((obj) => obj[user])[user] = data);
