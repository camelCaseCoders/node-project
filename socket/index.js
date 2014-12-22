var Level = require('../levels/level.js'),
	Score = require('../scores/score.js');

module.exports = function(io) {

	io.on('connection', function(socket) {

		socket.on('start', function(id) {
			Level.findById(id).select('grid').exec(function(err, level) {
				socket.emit('start', level);

				socket.simulation = new Simulation(level);
			});
		});


		socket.on('tick', function(tick, x, y) {

			// console.log('tick', tick, x, y);

			socket.simulation.move(x, y);
			socket.simulation.update(tick);
		});

	});

}

var gridWidth = 30, gridHeight = 25;
function Simulation(level) {
	this.player = new Player();
	this.level = new SimulationLevel(level, gridWidth, gridHeight);

	this.ticks = [];
}

Simulation.prototype = {
	tick: 0,
	update: function(tick) {
		this.tick = tick;

		this.level.update(this);

		console.log(this.tick, this.player.pos)
	},
	move: function(x, y) {
		this.player.move(x, y);
	}
};

function SimulationLevel(level, width, height) {
	this.width = width;
	this.height = height;

	this.map = new Map(this.width, this.height, level.grid);
}

SimulationLevel.prototype = {
	update: function(game) {
		game.player.update(game, this);
	}
};

function Player() {
	this.pos = Vec2.ZERO;
	this.dir = Vec2.RIGHT;
}

Player.prototype = {
	update: function(game, level) {
		this.pos = this.pos.add(this.dir);
		this.wrap(level);

		if(level.map.get(this.pos.x, this.pos.y)) {
			console.log(game.tick, 'dead');
		}
	},
	move: function(x, y) {
		var dir = new Vec2(x, y);
		if(!dir.isOppositeOf(this.dir) && !dir.isEqualTo(this.dir)) {
			this.dir = dir;
		}
	},
	wrap: function(level) {
		if(this.pos.x > level.width - 1) {
			this.pos = this.pos.setX(0);
		} else if(this.pos.x < 0) {
			this.pos = this.pos.setX(level.width - 1);
		}

		if(this.pos.y > level.height - 1) {
			this.pos = this.pos.setY(0);
		} else if(this.pos.y < 0) {
			this.pos = this.pos.setY(level.height - 1);
		}
	}
};

function Vec2(x, y) {
	this.x = x;
	this.y = y;
}

Vec2.prototype = {
	add: function(v) {
		return new Vec2(this.x + v.x, this.y + v.y);
	},
	setX: function(x) {
		return new Vec2(x, this.y);
	},
	setY: function(y) {
		return new Vec2(this.x, y);
	},
	isEqualTo: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	isOppositeOf: function(v) {
		return this.x == -v.x && this.y == -v.y;
	}
};

Vec2.ZERO = new Vec2(0, 0);
Vec2.RIGHT = new Vec2(1, 0);

function Map(width, height, grid) {
	this.width = width;
	this.height = height;

	this.map = {};

	for(var y = 0, i = 0; y < height; y++) {
		for(var x = 0; x < width; x++, i++) {
			grid[i] && this.fill(x, y);
		}
	}
}

Map.prototype = {
	hash: function(x, y) {
		return x + '|' + y;
	},
	dehash: function(hash) {
		return hash.split('|');
	},
	get: function(x, y) {
		return this.map[this.hash(x, y)];
	},
	fill: function(x, y) {
		this.map[this.hash(x, y)] = 1;
	},
	clear: function(x, y) {
		delete this.map[this.hash(x, y)];
	},
	all: function() {
		var coords = [];
		for(var hash in this.map) {
			coords.push(this.dehash(hash));
		}
		return coords;
	}
};