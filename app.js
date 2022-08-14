import "dotenv/config";
import bolt from "@slack/bolt";
import { rejects, paused, blacklisted } from "./data.js";

import {
  openConversation,
  refreshHome,
  welcome,
  reject,
  success,
  pairUp,
} from "./functions/index.js";

import { modal } from "./views/index.js";

const { App } = bolt;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.event("member_joined_channel", ({ event, client }) =>
  welcome(event, client)
);

app.event("app_home_opened", async ({ client, event }) => {
  await refreshHome(client, event.user);
});

app.action("pause", async ({ ack, body, client }) => {
  await ack();

  try {
    const user = body.user.id;

    paused.includes(user)
      ? paused.splice(paused.indexOf(user), 1)
      : paused.push(user);

    await refreshHome(client, user);
  } catch (error) {
    console.error(error);
  }
});

app.action("blacklist", async ({ ack, client, body }) => {
  await ack();
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: modal,
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.action("blacklist_submission", async ({ ack, body }) => {
  await ack();
});

app.action("generate_btn", async ({ client, ack }) => {
  await ack();
  const channelList = await client.conversations.list();
  const channelId = channelList.channels.filter(
    (channel) => channel.is_member
  )[0].id;

  try {
    const data = await client.conversations.members({
      channel: channelId,
    });

    const pairs = pairUp(
      data?.members
        ?.filter(
          (user) =>
            user !== "USLACKBOT" &&
            user !== "U03SMPNA7FD" &&
            !paused.includes(user)
        )
        ?.map((user) => user)
    );

    pairs?.map(async (pair) => {
      if (!pair) return;
      const convo = await openConversation(client, pair?.join(","));
      await success(client, convo.channel.id, pair);
    });

    rejects?.map(async (victim) => {
      if (!victim) return;
      await reject(client, victim);
    });

    rejects.splice(0, rejects.length);
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  await app.start();
  console.log("🧁 cupcake app is running!");
})();
