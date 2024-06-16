const modal = (users, sessionTopic = "") => {
	return {
		type: "modal",
		title: {
			type: "plain_text",
			text: "Agile Poker",
			emoji: true,
		},
		submit: {
			type: "plain_text",
			text: "Start session",
			emoji: true,
		},
		close: {
			type: "plain_text",
			text: "Cancel",
			emoji: true,
		},
		blocks: [
			{
				type: "divider",
			},
			{
				type: "input",
				element: {
					type: "plain_text_input",
					action_id: "pa_input_session_topic_id",
					initial_value: sessionTopic,
				},
				label: {
					type: "plain_text",
					text: "Session topic",
					emoji: true,
				},
				block_id: "pa_input_session_topic",
			},
			{
				type: "input",
				element: {
					type: "multi_users_select",
					placeholder: {
						type: "plain_text",
						text: "Select users",
						emoji: true,
					},
					action_id: "pa_input_participants_action",
					initial_users: users,
				},
				label: {
					type: "plain_text",
					text: "Participants",
					emoji: true,
				},
				block_id: "pa_input_participants",
			},
		],
		callback_id: "ap-start-session-modal",
	};
};

module.exports = { modal };
