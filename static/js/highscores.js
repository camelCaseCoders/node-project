angular.module('highscores', [])
.controller('highscoresController', ['$scope', '$http', function($scope, $http) {
	$http.get('http://localhost:8080/scores/high').then(function(response) {
		$scope.highscores = response.data;
	});

	$scope.score = Math.floor(Math.random() * 100);

	$scope.addScore = function() {
		$http.post('http://localhost:8080/scores/add', {
			score: $scope.score
		})
		.then(function(response) {
			$scope.highscores.push(response.data);
			$scope.score = Math.floor(Math.random() * 100);
		});
	}

	$scope.removeScore = function(score) {
		$http.post('http://localhost:8080/scores/remove', {
			id: score._id
		})
		.then(function(response) {
			if(response.data === 'true') {
				$scope.highscores.splice($scope.highscores.indexOf(score), 1);
			}
		});
	}
}]);