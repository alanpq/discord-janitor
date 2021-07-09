require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

const Store = require('./store');
const data = new Store("./data.json");

const prefix = ".";

const actionParams = {
	simple: [],
	match: ["match"],
}

const actionTypes = {
	simple: () => true,
	match: (msg, action) => msg.content.indexOf(action.match) !== -1,
};

const deliverAction = (msg, action) => {
	if(!actionTypes[action.type](msg, action)) return;
	console.log(action);
	console.log(`Delivering ${action.type} action on message by user '${msg.author.id}'`);
	msg.delete();
};

const processCmd = (msg) => { // TODO: completely replace this, this sucks (commando probs)
	const raw_split = msg.content.split(" ");
	const split = [];
	let inQuotes = false;
	let total = -1;
	// pain
	for(let i = 0; i < raw_split.length; i++) {
		if(inQuotes) split[split.length-1] += " " + raw_split[i];
		else         { split.push(raw_split[i]); total++}

		if(split[total].slice(-1) === "`") {
			inQuotes = false;
			split[total] = split[total].slice(0,-1);
		}
		if(split[total][0] === "`") {
			inQuotes = true;
			split[total] = split[total].slice(1);
		}
	}
	switch(split[0]) {
		case prefix + "add":
			const args = split.slice(1); // type, author, ..., timeout
			if(args.length === 0) {
				msg.reply("No arguments specified!");
				return;
			}
			const type = args[0].toLowerCase();
			const reqs = actionParams[type];
			if(!reqs) {
				msg.reply(`Filter type not found: '${type}'`);
				return;
			}
			if(args.length != reqs.length + 3) { // + 3 as three args are always type,author,timeout
				msg.reply("Invalid argument count");
				return;
			}
			const timeout = parseInt(args[args.length-1], 10);
			if(isNaN(timeout)) {
				msg.reply("Invalid timeout");
				return;
			}
			const entry = {type: args[0], guild: msg.guild.id, author: args[1], timeout};
			console.log(entry);
			reqs.forEach((param, i) => {
				entry[param] = args[i + 2]; // +2 since first two args are always type and author
			});
			console.log(entry);
			data.add(entry);
			msg.reply(`Added entry: \`\`\`json
${JSON.stringify(entry, null, 2)}\`\`\``);
		break;
	}

}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
	if(msg.author?.id === "247440114869862401") {
		processCmd(msg);
	}
	(data.get(msg) || []).forEach(action => {
		deliverAction(msg, action);	
	});

});

client.login(process.env.TOKEN);
