angular.module('starter')

.controller('settingsController', function($scope, $stateParams) {

	$scope.currentDevice = localStorage.getItem('mac_address');

	$scope.gender = localStorage.getItem('gender');

	$scope.dateOfBirth = localStorage.getItem('birthYear');

	$scope.country = localStorage.getItem('country');

});
