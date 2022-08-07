import "dotenv/config";
import bolt from "@slack/bolt";
import { rejects, pairUp } from "./functions/pairGenerator.js";
import {
  openConversation,
  welcomeMessage,
  rejectMessage,
  successMessage,
} from "./functions/slackControl.js";

const { App } = bolt;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

const CHANNEL_ID = "C03T1MPCJJD";

app.event("member_joined_channel", ({ event, client }) =>
  welcomeMessage(event, client)
);

app.event("app_home_opened", async ({ client }) => {
  try {
    const data = await client.conversations.members({
      channel: CHANNEL_ID,
    });

    const pairs = pairUp(
      data?.members
        ?.filter((user) => user !== "USLACKBOT" && user !== "U03SMPNA7FD")
        ?.map((user) => user)
    );

    pairs?.map(async (pair) => {
      if (!pair) return;
      const convo = await openConversation(client, pair?.join(","));
      await successMessage(client, convo.channel.id, pair);
    });

    rejects?.map(async (victim) => {
      if (!victim) return;
      await rejectMessage(client, victim);
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
