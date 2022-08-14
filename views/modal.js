export const modal = {
  type: "modal",
  callback_id: "blacklist_submission",
  title: {
    type: "plain_text",
    text: "Blacklist",
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "You can add someone to the list of people you don't want to get paired with.",
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
        text: "❤️ this is completely confidential",
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
};
