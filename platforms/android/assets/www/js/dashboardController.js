angular.module('starter')

.controller('dashboardController', function($scope, BluetoothService, $cordovaBluetoothSerial, $timeout, $interval) {


  $scope.recording = 'false';

  $scope.connectToBluetooth = function()
  {
  	BluetoothService.connectToDevice(localStorage.getItem('mac_address'));
  }


  $scope.selectProtocol = function()
  {
  	$scope.bluetoothWrite("ATSP0\r");
  	$scope.bluetoothWrite("ATS0\r");
  	$scope.bluetoothWrite("ATL0\r");
  }

  $scope.rpm = function()
  {
  	$scope.bluetoothWrite("010C\r");
  	$timeout(function()
  	{
  	 		$interval(function() {
  	 			$scope.bluetoothWrite("010C\r");
  	 			$scope.bluetoothRead();
  	 		}, 1000);
  	 	}
  	,10000);
  }


  $scope.bluetoothWrite = function(data)
  {
        $cordovaBluetoothSerial.write(data);

  }

  $scope.bluetoothRead = function()
  {
  	$cordovaBluetoothSerial.readUntil('\r').then(
          function(data) {
          	if(data.charAt(0) === '4')
          	{
			  var point = {id: data}
        	  var journeyData = localStorage.getItem('journeyData');
  			  journeyData = JSON.parse(journeyData);

  			  journeyData.push(point);
        	  localStorage.setItem('journeyData', JSON.stringify(journeyData));

          	}
          },
          function() {
              return false;
          }
      );
  }

 

  $scope.getActiveVehicle = function()
{
  var vehicles = localStorage.getItem('vehicleList');
  vehicles = JSON.parse(vehicles);

  for(var i = 0; i < vehicles.length; i++)
  {
    if(vehicles[i].id === localStorage.getItem('active_vehicle'))
    {
      $scope.vehicle = vehicles[i];
    }
  }
}

$scope.getActiveVehicle();

})