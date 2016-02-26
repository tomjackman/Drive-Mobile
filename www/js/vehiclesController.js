angular.module('starter')

.controller('vehiclesController', function($scope, $state, $ionicHistory, $ionicModal, StorageService, $cordovaToast) {

  var vehicles = localStorage.getItem('vehicleList');
  $scope.vehicles = JSON.parse(vehicles);

/**
 * Change to the add vehicle view to create a new vehicle
 */
  $scope.addVehicle = function()
  {
  	$state.go('app.addVehicleMake');
  }

  /**
 * This method will set the current vehicle to be active - the car to record the car data against.
 * @param man - the car manufacturer
 * @param mod - the car model
 * @param year - the cars year
 * @param vehicle_id - the global id of the vehicle
 */
  $scope.setActive = function(man, mod, year, vehicle_id)
  {
    localStorage.setItem('active_vehicle', vehicle_id);
    $cordovaToast.show(year + " " + man + " " + mod + " is now active." , 'long', 'center');
  }

})