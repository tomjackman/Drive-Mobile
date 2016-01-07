angular.module('starter')

.controller('vehiclesController', function($scope, $ionicModal, StorageService, $cordovaToast) {

  var vehicles = localStorage.getItem('vehicleList');
  $scope.vehicles = JSON.parse(vehicles);

  // Create the new vehicle modal
  $ionicModal.fromTemplateUrl('templates/addVehicle.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.addVehicle = function()
  {
  	$scope.modal.show();
  }

  $scope.close = function()
  {
    $scope.modal.hide();
  }

  $scope.setActive = function(man, mod, year, vehicle_id)
  {
    localStorage.setItem('active_vehicle', vehicle_id);

    $cordovaToast.show(year + " " + man + " " + mod + " is now active." , 'long', 'center');
  }

  $scope.add = function(manufacturer, model, year, engine_size, fuel_type)
  {	
  	StorageService.addVehicle(manufacturer, model, year, engine_size, fuel_type);

  	$scope.modal.hide();

    var vehicles = localStorage.getItem('vehicleList');
    $scope.vehicles = JSON.parse(vehicles);
  }

})