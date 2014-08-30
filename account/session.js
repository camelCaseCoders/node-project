var sessions = {};

function createSession() {
	
}

module.exports.middleware = function() {
	return function(req, res, next) {
		var sessionId = req.cookies.sessionId;
		if(sessionId) {
			req.user = sessions[sessionId];

			if(sessionId in sessions) {
			}
		}
	}
}

// middleware:
// 	kollar sessionsId och hittar usern
// 	om ingen session hämtar usern från databasen
// 		gör ny session
// gör ny session