angular.module('starter')

.controller('menuController', function($scope, $cordovaBluetoothSerial, $ionicModal, BluetoothService, StorageService) {

// current settings values to show in the menu

$scope.birthYear = localStorage.getItem('dateOfBirth');
$scope.gender = localStorage.getItem('gender');
$scope.country = localStorage.getItem('country');

})