var generateUUID = require('node-uuid'),
	database = require('./database.js'),


	SESSION_AGE = 300000,
	COOKIE = 'sessionId';

var sessions = {};

function setCookie(res, id) {
	// console.log('Set cookie ' + COOKIE + ' to ' + id + ' for ' + SESSION_AGE + 'ms');
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
		if(sessionId in sessions) {
			// console.log('found user in cookie');
			req.user = sessions[sessionId];
			setCookie(res, sessionId);
		
			next();
		} else {
			var username = req.cookies.username,
				hash = req.cookies.userhash;

			if(!username || !hash) {
				// console.log('not logged in');
				return next();
			}

			database.findUser({
				username: username,
				hash: hash
			},
			function(err, user) {
				if(user !== null) {
					// console.log('created new session');
					createSession(res, user);
					req.user = user;
				}
				next(err);
			})
		}
	}
}

module.exports.create = createSession;

module.exports.remove = removeSession;