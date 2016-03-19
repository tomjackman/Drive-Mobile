angular.module('starter')

.controller('menuController', function($scope, $cordovaBluetoothSerial, $ionicModal, BluetoothService, StorageService, $rootScope) {

// current settings values to show in the menu
$rootScope.updateMenuDetails = function()
{
	$scope.birthYear = JSON.parse(localStorage.getItem('dateOfBirth'));
	$scope.gender = localStorage.getItem('gender');
	$scope.country = localStorage.getItem('country');
}

$rootScope.updateMenuDetails();

})