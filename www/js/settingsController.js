angular.module('starter')

.controller('settingsController', function($scope, $stateParams) {

	$scope.currentDevice = localStorage.getItem('mac_address');

});
