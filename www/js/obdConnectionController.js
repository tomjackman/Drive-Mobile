angular.module('starter')

.controller('obdConnectionController', function($scope, $cordovaBluetoothSerial, $stateParams, BluetoothService, StorageService, $state, $ionicHistory) {

$scope.search = "Search";
$scope.devices = []

// Change the save/next button text depending on if the setup has been completed or not
if(StorageService.isSetupComplete() === true)
{
  $scope.buttonText = "Done";
}
else
{
  $scope.buttonText = "Next";
}

/**
 * This method will list the phones paired bluetooth devices.
 */
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

/**
 * This method will store the MAC address of the bluetooth device.
 * @param mac_address - The mac address to store
 */
$scope.chooseDevice = function(mac_address)
{
  localStorage.setItem('mac_address', mac_address); // store the address of the device
}

/**
 * This method will decide the routing depending if the app setup has been complete.
 * If the app setup has been complete, then the used has edited the setting via the 
 * settings menu - so return to the settings menu when they hit save.
 */
$scope.next = function()
{
  if(StorageService.isSetupComplete() === true)
    {
      $state.go('app.settings')
                    $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      disableBack: true
                    });
    }
    else
    {
      $state.go('app.genderChooser');
    }
}


});
