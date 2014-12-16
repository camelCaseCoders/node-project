var generateUUID = require('node-uuid'),

	config = require('../config.json'),
	SESSION_AGE = config.sessionAge,
	COOKIE = config.sessionCookie;

var sessions = {};
module.exports = function() {
	startPoll();
	return function(req, res, next) {
		var sessionId = req.cookies[COOKIE];
		if(sessionId in sessions) {
			req.session = sessions[sessionId];
			req.session.revive();
		} else {
			sessionId = generateUUID();
			req.session = sessions[sessionId]
				= new Session(sessionId);
		}
		setCookie(res, sessionId);
		next();
	}
}
function setCookie(res, id) {
	res.cookie(COOKIE, id, {maxAge: SESSION_AGE});
}

function Session(id) {
	this.id = id;
	this.time = Date.now();
	this.user = null;
}

Session.prototype = {
	revive: function() {
		this.time = Date.now();
	}
}

function startPoll() {
	setInterval(poll, SESSION_AGE);
}
function poll() {
	console.log('sessions', Object.keys(sessions).map(function(key) {
		return sessions[key].user && sessions[key].user.username;
	}));
	var old = Date.now() - SESSION_AGE;
	for(var key in sessions) {
		if(sessions[key].time < old) {
			delete sessions[key];
		}
	}
}

// function removeSession(req, res) {
// 	var sessionId = req.cookies[COOKIE];
// 	delete sessions[sessionId];
// 	clearCookie(res);
// }

// function clearCookie(res) {
// 	res.clearCookie(COOKIE);
// }
