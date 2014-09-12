angular.module('register', [])
.controller('registerController', ['$scope', '$http', '$location', 'hashString',
	function($scope, $http, $location, hash) {
		$scope.register = function() {
			$http.post('/user/register', {
				username: $scope.username,
				hash: hash($scope.username + $scope.password)
			})
			.then(function(response) {
				console.log(response);
				if(response.data === 'true') {
					$location.path('/');
				} else {
					$location.path('/login');
				}
			});
		}
	}
])