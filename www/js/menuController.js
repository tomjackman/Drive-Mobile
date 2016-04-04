angular.module('starter')

.controller('menuController', function($scope, $cordovaBluetoothSerial, $ionicModal, BluetoothService, StorageService, $rootScope, $cordovaToast) {

 var vehicles = localStorage.getItem('vehicleList');
 $scope.vehicles = JSON.parse(vehicles);

// current settings values to show in the menu
$rootScope.updateMenuDetails = function()
{
	$scope.birthYear = JSON.parse(localStorage.getItem('dateOfBirth'));
	$scope.gender = localStorage.getItem('gender');
	$scope.country = localStorage.getItem('country');
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
    $rootScope.checkDisplay();
    $cordovaToast.show(year + " " + man + " " + mod + " is now active." , 'long', 'center');
  }

$rootScope.updateMenuDetails();

})