export const paused = [];
export const blacklisted = [];

export const view = {
  type: "home",
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Hi hi 🧁💛!",
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "image",
          image_url: process.env.PIC_URL,
          alt_text: "coffee",
        },
        {
          type: "mrkdwn",
          text: "Let's connect!",
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Everyone in this channel gets paired up every Monday for a cup of coffee/tea/water.
Hope you have fun with it and get to connect with people you wouldn't have spoken to otherwise! ✨`,
      },
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "pause ⏸️",
            emoji: true,
          },
          action_id: "pause",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "blacklist 🚫",
            emoji: true,
          },
          action_id: "blacklist",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "generate pairs 💀",
            emoji: true,
          },
          action_id: "generate_btn",
          style: "danger",
        },
      ],
    },
  ],
};
