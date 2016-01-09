angular.module('starter')

.controller('dashboardController', function($scope, BluetoothService, $cordovaToast, $cordovaBluetoothSerial, $timeout, $interval) {



$scope.checkDisplay = function()
{
    if(localStorage.getItem('setup_complete') === null)
    {
      $scope.show = false;
    }
    else
    {
      $scope.showActiveVehicle();
      $scope.show = true;
    }
  }



  $scope.showActiveVehicle = function()
  {
      $scope.vehicles = localStorage.getItem('vehicleList');
      $scope.vehicles = JSON.parse($scope.vehicles);

      for(var i = 0; i < $scope.vehicles.length; i++)
      {
        if($scope.vehicles[i].id === localStorage.getItem('active_vehicle'))
        {
          $scope.vehicle = $scope.vehicles[i];
        }
      }
    }

    $scope.checkDisplay();

  $scope.connectToBluetooth = function()
  {
  	BluetoothService.connectToDevice(localStorage.getItem('mac_address'));
  }

// CONNECT TO OBD / SEARCHING PHASE
// When connection to OBD Device is made. Select protocols and query all sensors immediately.
// THis means that when the user starts recording the data, the recording will start straight
// away rather than having to wait for the searching phase to end.


  $scope.selectProtocol = function()
  {
  	$scope.bluetoothWrite("ATSP0\r");
  	$scope.bluetoothWrite("ATS0\r");
  	$scope.bluetoothWrite("ATL0\r");
  }

  $scope.recordData = function()
  {

    $cordovaToast.show('Recording Started', 'long', 'center');

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

})