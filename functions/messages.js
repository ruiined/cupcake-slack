export const successMsg = async (client, channel, users) => {
  await client.chat.postMessage({
    channel: channel,
    text: `Hi, <@${users[0]}> and <@${users[1]}>, you've been paired up together!`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hello <@${users[0]}> & <@${users[1]}>! ✨`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "You two have been paired up this week! Please schedule some time together! 😊💛",
        },
      },
      { type: "divider" },
    ],
  });
};

export const rejectMsg = async (client, user) => {
  await client.chat.postMessage({
    channel: user,
    text: `Unfortunately, you were unlucky this week, as we couldn't find you a pair 😔 Please have a wonderful day and see you next week! 🌻💛`,
  });
};

export const welcomeMsg = async (event, client) => {
  await client.chat.postEphemeral({
    channel: event.channel,
    user: event.user,
    text: "Welcome to the channel!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Welcome, <@${event.user}>!*`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Everyone in this channel gets paired up every Monday for a cup of coffee/tea/water.",
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
};

export const pauseMsg = async (client, user, paused) => {
  const message = (await paused)
    ? `You have paused Cupcake! Hopefully we will see you again very soon 🐱🐶`
    : `Welcome back! You have just unpaused your participation in the weekly pairings. Have fun! 🍵`;

  await client.chat.postMessage({
    channel: user,
    text: message,
  });
};
