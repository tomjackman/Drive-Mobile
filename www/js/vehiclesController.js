angular.module('starter')

.controller('vehiclesController', function($scope, $state, $ionicHistory, $ionicModal, StorageService, $cordovaToast) {

  var vehicles = localStorage.getItem('vehicleList');
  $scope.vehicles = JSON.parse(vehicles);

  $scope.addVehicle = function()
  {
  	$state.go('app.addVehicleMake');
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