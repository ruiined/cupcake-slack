import "dotenv/config";
import bolt from "@slack/bolt";
import { modal } from "./views/index.js";
import { rejects, paused, blacklist } from "./data.js";
import {
  openConversation,
  refreshHome,
  pairUp,
  welcomeMsg,
  rejectMsg,
  successMsg,
  pauseMsg,
  userHasBlacklist,
  findBlacklist,
  updateBlacklist,
} from "./functions/index.js";
import { BlockAction } from "@slack/bolt/dist/types/actions/block-action";
const BOT_ID = "USLACKBOT";
const APP_ID = "U03SMPNA7FD";

const { App } = bolt;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: 3000,
});

app.event("member_joined_channel", ({ event, client }) =>
  welcomeMsg(event, client)
);

app.event("app_home_opened", async ({ client, event }) => {
  await refreshHome(client, event.user);
});

app.action("pause", async ({ ack, body, client }) => {
  const user = body.user.id;

  await ack();

  try {
    paused.includes(user)
      ? paused.splice(paused.indexOf(user), 1)
      : paused.push(user);

    await refreshHome(client, user);
    await pauseMsg(client, user, paused.includes(user));
  } catch (error) {
    console.error(error);
  }
});

app.action("blacklist", async ({ ack, client, body }) => {
  const user = body.user.id;

  await ack();

  try {
    await client.views.open({
      trigger_id: (<BlockAction>body).trigger_id,
      view: modal(userHasBlacklist(user) ? findBlacklist(user) : []),
    });
  } catch (error) {
    console.error(error);
  }
});

app.view("blacklist_submission", async ({ ack, body }) => {
  const user = body.user.id;
  const data = body.view.state.values.input.result.selected_users;

  await ack();

  userHasBlacklist(user)
    ? updateBlacklist(user, data)
    : blacklist.push({
        [user]: data,
      });
  console.log(blacklist);
});

app.action("generate_btn", async ({ client, ack }) => {
  await ack();

  const list = await client.conversations.list();
  const channel =
    list?.channels?.filter((channel) => channel.is_member)[0].id ?? "";

  try {
    const data = await client.conversations.members({
      channel: channel,
    });

    const pairs = pairUp(
      data?.members
        ?.filter(
          (user) => user !== BOT_ID && user !== APP_ID && !paused.includes(user)
        )
        ?.map((user) => user)
    );

    pairs?.map(async (pair) => {
      if (!pair) return;
      const convo = await openConversation(client, pair?.join(","));
      await successMsg(client, convo.channel.id, pair);
    });

    rejects?.map(async (victim) => {
      if (!victim) return;
      await rejectMsg(client, victim);
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
