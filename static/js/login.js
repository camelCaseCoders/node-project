angular.module('login', [])
.controller('loginController', ['$scope', '$http', '$location', 'hashString',
	function($scope, $http, $location, hash) {
		$scope.login = function() {
			$http.post('account/login', {
				username: $scope.username,
				hash: hash($scope.username + $scope.password)
			})
			.then(function(response) {
				if(response.data === 'true') {
					$location.path('/');
				} else {
					$scope.password = '';
				}
			});
		}
	}
])