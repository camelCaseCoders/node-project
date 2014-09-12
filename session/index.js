var generateUUID = require('node-uuid'),

	SESSION_AGE = 300000,
	COOKIE = 'sessionId';

var sessions = {};

module.exports = function() {
	return function(req, res, next) {
		var sessionId = req.cookies[COOKIE];
		if(sessionId in sessions) {
			req.session = sessions[sessionId];
			setCookie(res, sessionId);
		} else {
			sessionId = generateUUID();
			req.session = sessions[sessionId] = {};
			setCookie(res, sessionId);
		}
		next();
	}
}
function setCookie(res, id) {
	res.cookie(COOKIE, id, {maxAge: SESSION_AGE});
}

// function removeSession(req, res) {
// 	var sessionId = req.cookies[COOKIE];
// 	delete sessions[sessionId];
// 	clearCookie(res);
// }

// function clearCookie(res) {
// 	res.clearCookie(COOKIE);
// }
