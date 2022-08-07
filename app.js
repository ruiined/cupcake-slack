require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

const channelId = "C03T1MPCJJD";

const rejects = [];

const pairUp = (users) => {
  const friends = [...users].sort(() => Math.random() - 0.5);
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

app.event("member_joined_channel", async ({ event, client }) => {
  await client.chat.postEphemeral({
    channel: event.channel,
    user: event.user,
    text: "Welcome to the channel!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Welcome, <@${event.user}>!`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Everyone in this channel gets paired up every Monday for a cup of coffee/tea/water 🍵",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Hope you have fun with it and get to connect with people you wouldn't have spoken to otherwise! 🧁✨",
        },
      },
    ],
  });
});

const openConversation = (client, users) =>
  client.conversations.open({
    users: users,
  });

const successfullyPairedMessage = (client, channel, users) => {
  client.chat.postMessage({
    channel: channel,
    text: `Hi <@${users[0]}> + <@${users[1]}>!`,
    // blocks: [
    //   {
    //     type: "section",
    //     text: {
    //       type: "mrkdwn",
    //       text: `Yo yo yo yo`,
    //     },
    //   },
    // ],
  });
};

app.event("app_home_opened", async ({ event, client }) => {
  try {
    const data = await client.conversations.members({
      channel: channelId,
    });

    const pairs = pairUp(
      data?.members
        ?.filter((user) => user !== "USLACKBOT" && user !== "U03SMPNA7FD")
        ?.map((user) => user)
    );
    // + rejects

    pairs?.map(async (pair) => {
      if (!pair) return;
      const convo = await openConversation(client, pair?.join(","));
      successfullyPairedMessage(client, convo.channel.id, pair);
    });
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("🧁 cupcake app is running!");
})();
