angular.module('starter')

.controller('obdConnectionController', function($scope, $cordovaBluetoothSerial, $stateParams, BluetoothService, StorageService) {

$scope.search = "Search";
$scope.devices = []

if(StorageService.isSetupComplete() === true)
{
  $scope.buttonText = "Done";
}
else
{
  $scope.buttonText = "Next";
}

$scope.listDevices = function()
{
  $scope.search = "Searching...";

        $cordovaBluetoothSerial.list().then(
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

$scope.next = function()
{
  if(StorageService.isSetupComplete() === true)
    {
      location.replace("#/app/settings");
                    $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      disableBack: true
                    });
    }
    else
    {
      window.location.href = '#/app/genderChooser';
    }
}


});
