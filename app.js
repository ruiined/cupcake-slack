import "dotenv/config";
import bolt from "@slack/bolt";
import { rejects, pairUp } from "./functions/pairGenerator.js";
import {
  openConversation,
  welcomeMessage,
  rejectMessage,
  successMessage,
} from "./functions/slackControl.js";

import { paused, blacklisted, view } from "./functions/homeView.js";

const { App } = bolt;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

const CHANNEL_ID = "C03SWPQCP1A";

app.event("member_joined_channel", ({ event, client }) =>
  welcomeMessage(event, client)
);

app.event("app_home_opened", async ({ client, event }) => {
  await client.views.publish({
    user_id: event.user,
    view: view,
  });
});

app.action("pause", async ({ ack, body }) => {
  await ack();
  try {
    const user = body.user.id;
    paused.includes(user)
      ? paused.splice(paused.indexOf(user), 1)
      : paused.push(user);
    console.log(paused);
  } catch (error) {
    console.error(error);
  }
});

app.action("blacklist", async ({ ack, client, body }) => {
  await ack();
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        // View identifier
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Blacklist",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "You can add someone to the list of people you don't want to get paired with. Don't worry, it's completely _confidential_.",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Show currently blacklisted",
            },
          },
          {
            type: "input",
            block_id: "input_c",
            label: {
              type: "plain_text",
              text: "Add to the blacklist:",
            },
            hint: {
              type: "plain_text",
              text: "❤️ please separate with commas when adding multiple people",
              emoji: true,
            },
            element: {
              type: "plain_text_input",
              placeholder: {
                type: "plain_text",
                text: "Enter username(s)",
              },

              action_id: "dreamy_input",
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.action("generate_btn", async ({ client, ack, say }) => {
  await ack();
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
