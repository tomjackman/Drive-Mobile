angular.module('starter')

.controller('settingsController', function($scope, $stateParams) {

	// current settings values to show in the view

	$scope.currentDevice = localStorage.getItem('mac_address');

	$scope.gender = localStorage.getItem('gender');

	$scope.date = JSON.parse(localStorage.getItem('dateOfBirth'));

	$scope.country = localStorage.getItem('country');

});
