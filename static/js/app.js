angular.module('app', ['highscores', 'login', 'register', 'ngRoute', 'ngCookies'])
.config(['$routeProvider', '$locationProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'templates/highscores.html',
		controller: 'highscoresController'
	})
	.when('/login', {
		templateUrl: 'templates/login.html',
		controller: 'loginController'
	})
	.when('/register', {
		templateUrl: 'templates/register.html',
		controller: 'registerController'
	})
	.otherwise({
		redirectTo: '/'
	});
}])
.factory('hashString', function() {
	return function(string) {
		var hash = 0, i, chr, len;
		if (string.length == 0) return hash;
		for (i = 0, len = string.length; i < len; i++) {
			chr   = string.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}
})
.factory('session', ['$rootScope', '$http', '$cookies',
	function($rootScope, $http, $cookies) {
		var session = {};
		
		$rootScope.$on('$locationChangeSuccess', function(event) {
			if($cookies.sessionId) {
				session.username = $cookies.username;
			}
		});

		return session;
	}
])
.run(['session', function(session){}]);