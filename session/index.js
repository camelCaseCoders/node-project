//Not used

var generateUUID = require('node-uuid'),

	config = require('../config.json'),
	SESSION_AGE = config.sessionAge,
	POLL_TIME = config.sessionPollTime,
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
				= new Session(sessionId, req.ip);
		}
		setCookie(res, sessionId);
		next();
	}
}
function setCookie(res, id) {
	res.cookie(COOKIE, id, {maxAge: SESSION_AGE});
}


function Session(id, ip) {
	this.id = id;
	this.ip = ip;

	this.time = Date.now();
	this.user = null;
}

Session.prototype = {
	revive: function() {
		this.time = Date.now();
	}
}

function startPoll() {
	setInterval(poll, POLL_TIME);
}
function poll() {
	console.log('sessions', Object.keys(sessions).map(function(key) {
		var session = sessions[key];
		return {ip: session.ip, user: session.user&&session.user.username};
	}));
	var expired = Date.now() - SESSION_AGE;
	for(var key in sessions) {
		if(sessions[key].time < expired) {
			delete sessions[key];
		}
	}
}