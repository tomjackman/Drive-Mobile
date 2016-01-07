angular.module('starter')

.controller('menuController', function($scope, $cordovaBluetoothSerial, $ionicModal, BluetoothService, StorageService) {

$scope.birthYear = localStorage.getItem('birthYear');
$scope.gender = localStorage.getItem('gender');
$scope.country = localStorage.getItem('country');

$scope.devices = [];
$scope.search = "Search Devices";

  // Create the setup modal
  $ionicModal.fromTemplateUrl('templates/setup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;

    if(localStorage.getItem('setup_complete') === null)
    {
      $scope.modal.show();

      var vehicleList = [];
      localStorage.setItem('vehicleList', JSON.stringify(vehicleList));

    }

  });


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


$scope.saveDetails = function(birthYear, gender, country)
{
  StorageService.saveSetupDetails(birthYear, gender, country);
  StorageService.setupComplete();

  window.location.href = '#/app/dashboard';
  $scope.modal.hide();

}

})