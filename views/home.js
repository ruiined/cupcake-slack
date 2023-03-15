import { paused } from "../data.js";
export const home = (user) => {
  const onPause = paused.includes(user);
  const view = {
    type: "home",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `Welcome to cupcake`,
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
        type: "section",
        text: {
          type: "mrkdwn",
          text: onPause
            ? "Hey, you are currently *not* getting paired up as you have opted out for the time being. You are always welcome back, just hit the _'unpause'_ button below! 😊"
            : "You have some options below.",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: onPause ? "unpause ▶️" : "pause ⏸️",
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
  return view;
};
