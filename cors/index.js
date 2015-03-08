module.exports = function() {
	return function(req, res, next) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Requested-With');

		if (req.method != 'OPTIONS') return next();

   		res.status(204).end();
   	};
};