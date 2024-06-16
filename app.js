require("dotenv").config();
const { modal } = require("./blockKits/modal");
const { pokerSession } = require("./blockKits/pokerSession");
const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
});

let sessionTopic = "";
let channelId = "";
let participants = new Map();

const fetchUsersInChannel = async (channelId, client) => {
	// Clear participants
	participants = new Map();
	try {
		const { members } = await client.conversations.members({
			channel: channelId,
		});
		// Filter from bots
		if (members.length === 0) return [];
		for (const member of members) {
			const userInfo = await client.users.info({ user: member });
			// Initially add only users who are in the huddle
			if (userInfo.user.is_bot) continue;
			if (userInfo.user.profile.huddle_state === "in_a_huddle") {
				participants.set(userInfo.user.id, {
					name: userInfo.user.name,
					image: userInfo.user.profile.image_48,
					id: userInfo.user.id,
				});
				continue;
			}
			// If no huddle is active, add all users
			participants.set(userInfo.user.id, {
				name: userInfo.user.name,
				image: userInfo.user.profile.image_48,
				id: userInfo.user.id,
			});
		}
	} catch (error) {
		console.error("Error fetching users:", error);
	}
};

app.command("/ap", async ({ ack, body, client, logger }) => {
	await ack();
	const { channel_id, trigger_id, text } = body;
	channelId = channel_id;
	try {
		if (text) {
			sessionTopic = text.trim();
		}
		await fetchUsersInChannel(channel_id, client);
		const result = await client.views.open({
			// Pass a valid trigger_id within 3 seconds of receiving it
			trigger_id: trigger_id,
			// View payload
			view: modal([...participants.keys()], sessionTopic),
		});
		logger.info(result);
	} catch (error) {
		logger.error(error);
		console.error("Error handling command", error);
	}
});

app.view("ap-start-session-modal", async ({ ack, payload, client }) => {
	await ack();
	try {
		const { state } = payload;
		if (!state) return;
		const {
			pa_input_session_topic: { pa_input_session_topic_id },
		} = state.values;
		sessionTopic = pa_input_session_topic_id.value;
		const { ts } = await client.chat.postMessage({
			channel: channelId,
			blocks: pokerSession(sessionTopic, participants),
		});
		messageTs = ts;
	} catch (error) {
		console.error("Error handling view_submission", error);
	}
});

app.action(
	{ block_id: "ap-vote-block" },
	async ({ ack, payload, context, respond }) => {
		await ack();
		// update participants
		const { value } = payload;
		const { userId } = context;

		if (!participants.has(userId)) return;

		participants.set(userId, {
			...participants.get(userId),
			vote: value,
		});

		await respond({
			replace_original: true,
			blocks: pokerSession(sessionTopic, participants),
		});
	},
);

(async () => {
	// Start your app
	await app.start(process.env.PORT || 3000);
	console.log("Slack Agile Poker app is running!");
})();
