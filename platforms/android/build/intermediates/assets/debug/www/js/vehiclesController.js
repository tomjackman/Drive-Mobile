angular.module('starter')

.controller('vehiclesController', function($scope, $ionicHistory, $ionicModal, StorageService, $cordovaToast) {

  var vehicles = localStorage.getItem('vehicleList');
  $scope.vehicles = JSON.parse(vehicles);

  $scope.addVehicle = function()
  {
  	window.location.href = '#/app/addVehicle';
  }

  $scope.delete = function(id)
  {
    StorageService.deleteVehicle(id);
    $cordovaToast.show("Deleted" , 'long', 'center');
  }

  $scope.setActive = function(man, mod, year, vehicle_id)
  {
    localStorage.setItem('active_vehicle', vehicle_id);
    $cordovaToast.show(year + " " + man + " " + mod + " is now active." , 'long', 'center');
  }

})