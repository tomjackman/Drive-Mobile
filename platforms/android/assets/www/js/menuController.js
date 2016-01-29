angular.module('starter')

.controller('menuController', function($scope, $cordovaBluetoothSerial, $ionicModal, BluetoothService, StorageService) {

$scope.birthYear = localStorage.getItem('birthYear');
$scope.gender = localStorage.getItem('gender');
$scope.country = localStorage.getItem('country');

})