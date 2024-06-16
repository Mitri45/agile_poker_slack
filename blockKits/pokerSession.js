const fillContext = (image_url, name) => {
	return {
		type: "image",
		image_url,
		alt_text: name,
	};
};

const pokerSession = (sessionTopic, participants) => {
	const voted = [];
	const votesRevealed = [];
	const notVoted = [];

	for (const [_, { name, image, vote, id }] of participants.entries()) {
		if (vote) {
			voted.push(fillContext(image, name));
			votesRevealed.push({
				type: "rich_text_section",
				elements: [
					{
						type: "user",
						user_id: id,
						style: {
							bold: true,
						},
					},
					{
						type: "text",
						text: "           ",
					},
					{
						type: "emoji",
						name: vote === "13" ? "one" : vote,
					},
					{
						...(vote === "13"
							? {
									type: "emoji",
									name: "three",
								}
							: {
									type: "text",
									text: " ",
								}),
					},
				],
			});
		} else {
			notVoted.push(fillContext(image, name));
		}
	}
	let votedSection;
	let whoIsVotingSection;

	if (voted.length === 0) {
		votedSection = {
			type: "context",
			elements: [
				{
					type: "mrkdwn",
					text: ":grey_question:",
				},
			],
		};
		whoIsVotingSection = {
			type: "context",
			elements: notVoted,
		};
	} else {
		if (notVoted.length === 0) {
			votedSection = {
				type: "rich_text",
				elements: [
					{
						type: "rich_text_list",
						style: "bullet",
						elements: votesRevealed,
						border: 1,
					},
				],
			};
		} else {
			votedSection = {
				type: "context",
				elements: voted,
			};
			whoIsVotingSection = {
				type: "context",
				elements: notVoted,
			};
		}
	}

	const votingInProcessMessage = [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "\n",
			},
		},
		{
			type: "header",
			text: {
				type: "plain_text",
				text: `Topic is: "${sessionTopic}".  Cast your votes!`,
				emoji: true,
			},
		},
		{
			type: "divider",
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "\n",
			},
		},
		{
			type: "rich_text",
			elements: [
				{
					type: "rich_text_section",
					elements: [
						{
							type: "text",
							text: " Votes to be casted by: ",
							style: {
								bold: true,
							},
						},
						{
							type: "text",
							text: "\n",
						},
						{
							type: "text",
							text: "\n",
						},
					],
				},
			],
		},
		{
			...whoIsVotingSection,
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "\n",
			},
		},
		{
			type: "rich_text",
			elements: [
				{
					type: "rich_text_section",
					elements: [
						{
							type: "text",
							text: " Already voted:",
							style: {
								bold: true,
							},
						},
						{
							type: "text",
							text: "\n",
						},
						{
							type: "text",
							text: "\n",
						},
					],
				},
			],
		},
		{
			...votedSection,
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "\n",
			},
		},
		{
			type: "divider",
		},
		{
			type: "header",
			text: {
				type: "plain_text",
				text: "Press a button to vote",
			},
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "1",
						emoji: true,
					},
					value: "one",
					action_id: "ap_vote_action_1",
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "2",
						emoji: true,
					},
					value: "two",
					action_id: "ap_vote_action_2",
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "3",
						emoji: true,
					},
					value: "three",
					action_id: "ap_vote_action_3",
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "5",
						emoji: true,
					},
					value: "five",
					action_id: "ap_vote_action_5",
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "8",
						emoji: true,
					},
					value: "eight",
					action_id: "ap_vote_action_8",
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "13",
						emoji: true,
					},
					value: "13",
					action_id: "ap_vote_action_13",
				},
			],
			block_id: "ap-vote-block",
		},
	];
	const votingFinished = [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "\n",
			},
		},
		{
			type: "header",
			text: {
				type: "plain_text",
				text: `Estimation Results for "${sessionTopic}":`,
				emoji: true,
			},
		},
		{
			type: "divider",
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "\n",
			},
		},
		{
			...votedSection,
		},
	];
	return notVoted.length === 0 ? votingFinished : votingInProcessMessage;
};

module.exports = { pokerSession };
