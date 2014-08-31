var generateUUID = require('node-uuid'),
	database = require('./database.js'),


	SESSION_AGE = 300000,
	COOKIE = 'sessionId';

var sessions = {};

function setCookie(res, id) {
	res.cookie(COOKIE, id, {maxAge: SESSION_AGE});
}

function clearCookie(res) {
	res.clearCookie(COOKIE);
}

function createSession(res, user) {
	var sessionId = generateUUID();
	sessions[sessionId] = user;
	setCookie(res, sessionId);
}

function removeSession(req, res) {
	var sessionId = req.cookies[COOKIE];
	delete sessions[sessionId];
	clearCookie(res);
}


module.exports.middleware = function() {
	return function(req, res, next) {
		var sessionId = req.cookies[COOKIE];
		console.log('searching for session.', sessions);
		if(sessionId in sessions) {
			console.log('found in cookie');
			req.user = sessions[sessionId];
			setCookie(res, sessionId);
		
			next();
		} else {
			database.findUser({
				username: req.cookies.username,
				hash: req.cookies.hash
			},
			function(err, user) {
				if(user !== null) {
					console.log('created new');
					createSession(res, user);
					req.user = user;
				} else {
					console.log('removed session');
					removeSession(req, res);
				}
				
				next(err);
			})
		}
	}
}

module.exports.create = createSession;

module.exports.remove = removeSession;