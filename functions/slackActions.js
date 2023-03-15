import { home } from "../views/index.js";

export const openConversation = (client, users) =>
  client.conversations.open({
    users: users,
  });

export const refreshHome = (client, user) =>
  client.views.publish({
    user_id: user,
    view: home(user),
  });
