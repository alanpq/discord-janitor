const fs = require('fs');
module.exports = class {
	constructor(path) {
		this.data = {};
		this.path = path;
		if (fs.existsSync(this.path))
			this.data = JSON.parse(fs.readFileSync(this.path));
	}
	add(v, save=true) {
		if(!this.data[v.guild]) this.data[v.guild] = {};
		if(!this.data[v.author]) this.data[v.guild][v.author] = [];
		this.data[v.guild][v.author].push(v);
		if(save)
			this.save();
	};
	get(msg) {
		if(msg === undefined) return;
		return this.data[msg.guild.id][msg.author.id];
	}
	setData(data, save=true) {
		this.data = data;
		if(save)
			this.save();
	};
	save() {
		fs.writeFile(this.path, JSON.stringify(this.data), err => {
			if(err)
				console.error("ERROR saving store data to file!", err);
		});
	}
}
