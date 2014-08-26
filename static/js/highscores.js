angular.module('highscores', [])
.controller('highscoresController', ['$scope', '$http', function($scope, $http) {
	$http.get('http://localhost:8080/scores/high').then(function(response) {
		$scope.highscores = response.data;
	});

	$scope.username = 'JONN';
	$scope.score = Math.floor(Math.random() * 100);

	$scope.addScore = function() {
		$http.post('http://localhost:8080/scores/add', {
			username: $scope.username,
			score: $scope.score,
			time: Date.now()
		})
		.then(function(response) {
			$scope.highscores.push(response.data);
		});
	}

	$scope.removeScore = function(score) {
		$http.post('http://localhost:8080/scores/remove', {id: score._id})
		.then(function(response) {
			if(response.data) {
				$scope.highscores.splice($scope.highscores.indexOf(score), 1);
			}
		});
	}
}]);