angular.module('starter')

.controller('obdConnectionController', function($scope, $stateParams, BluetoothService, StorageService) {

$scope.listDevices = function()
{
  $scope.search = "Searching...";

        $cordovaBluetoothSerial.discoverUnpaired().then(
          function(devices) {
             devices.forEach(function(device) {
              $scope.devices.push({id: device.id, name: device.name, address: device.address});
          })
              $scope.devices = $scope.devices;
              $scope.search = "Search Devices";
              return true;
          },
          function() {
              return false;
          }
          );
}

$scope.connectToDevice = function(mac_address)
{
  BluetoothService.connectToDevice(mac_address);
}


$scope.saveDetails = function(birthYear, gender, country, manufacturer, model, year, engine_size, fuel_type)
{
  StorageService.saveSetupDetails(birthYear, gender, country);
  StorageService.addVehicle(manufacturer, model, year, engine_size, fuel_type);
  StorageService.setupComplete();
}

});
