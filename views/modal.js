export const modal = (blacklisted) => {
  const view = {
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
          text: "Is there someone you would rather not get paired with?",
        },
      },
      {
        type: "input",
        block_id: "input",
        optional: true,
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
          type: "multi_users_select",
          initial_users: blacklisted,
          placeholder: {
            type: "plain_text",
            text: "Select users",
          },
          action_id: "result",
        },
      },
    ],
    submit: {
      type: "plain_text",
      text: "Submit",
    },
  };
  return view;
};
