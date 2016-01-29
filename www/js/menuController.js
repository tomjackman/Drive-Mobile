angular.module('starter')

.controller('menuController', function($scope, $cordovaBluetoothSerial, $ionicModal, BluetoothService, StorageService) {

$scope.birthYear = localStorage.getItem('dateOfBirth');
$scope.gender = localStorage.getItem('gender');
$scope.country = localStorage.getItem('country');

})