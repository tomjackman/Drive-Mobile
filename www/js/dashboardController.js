angular.module('starter')

.controller('dashboardController', function($cordovaBluetoothSerial, $scope, BluetoothService, $cordovaToast, $timeout, $interval) {

$scope.status = "Tap to Record";
$scope.recording = false;
$scope.sensorData = [];

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

  $scope.setupBluetoothConnection = function()
  {
    if($scope.recording === false)
    {
    $cordovaBluetoothSerial.isEnabled().then( 
          function() {
            $cordovaBluetoothSerial.connect(localStorage.getItem('mac_address')).then(
              function() {
                $cordovaToast.show('Connected Succesfully to OBD-II Device', 'long', 'center');
                $scope.recordData(); // start recording
                $scope.updateConnectionStatus();
              },
              function() {
                  $cordovaToast.show('Cannot connect to the OBD-II device. Either the vehicle is not turned on or the device is out of range', 'long', 'center');
                  $scope.updateConnectionStatus();
              }
          );
          },
          function() {
            $cordovaBluetoothSerial.enable().then(
              function() {
                  $cordovaBluetoothSerial.connect(localStorage.getItem('mac_address')).then(
                      function() {
                        $cordovaToast.show('Connected Succesfully to OBD-II Device', 'long', 'center');
                        $scope.recordData(); // start recording
                        $scope.updateConnectionStatus();
                      },
                      function() {
                          $cordovaToast.show('Cannot connect to the OBD-II device. Either the vehicle is not turned on or the device is out of range', 'long', 'center');
                          $scope.updateConnectionStatus();
                      }
                  );
              },
              function() {
                   $cordovaToast.show('Please Enable Bluetooth', 'long', 'center');
                }
              );
            }
      );
    }
    else
    {
      $scope.recordData();
    }
  }

  $scope.recordData = function()
  {
    if($scope.recording === false)
    {
      $scope.recording = true;
      $scope.status = "Recording.. Tap to Stop.";
      $cordovaToast.show('Recording Starting in 10 Seconds.', 'short', 'center');

      // ELM327 Setup / Initilisation 

      $scope.bluetoothWrite("ATZ\r");     // Reset ELM327
      $scope.bluetoothWrite("ATSP0\r");   // Auto Select Protocol
      $scope.bluetoothWrite("ATS0\r");    // Remove spaces from responses
      $scope.bluetoothWrite("ATL0\r");    // Remove linefeeds from responses

      // Write to OBD Device - Initial Search Phase

      // Diagnostics trouble codes

      $scope.bluetoothWrite("03\r"); // Request trouble codes

      // engine sensors

      $scope.bluetoothWrite("010C\r"); // Engine rpm
      $scope.bluetoothWrite("0104\r"); // Calculated engine load
      $scope.bluetoothWrite("010D\r"); // Vehicle speed 
      $scope.bluetoothWrite("0143\r"); // Absolute load
      $scope.bluetoothWrite("0161\r"); // Demand engine torque
      $scope.bluetoothWrite("0162\r"); // Actual engine torque
      $scope.bluetoothWrite("0163\r"); // Engine reference torque

      // temperature sensors

      $scope.bluetoothWrite("0105\r"); // Engine Coolant Temperature
      $scope.bluetoothWrite("010F\r"); // Intake Air Temperature
      $scope.bluetoothWrite("013C\r"); // Catylyst Temperature, Bank 1, Sensor 1
      $scope.bluetoothWrite("013D\r"); // Catylyst Temperature, Bank 2, Sensor 1
      $scope.bluetoothWrite("013E\r"); // Catylyst Temperature, Bank 1, Sensor 2
      $scope.bluetoothWrite("013F\r"); // Catylyst Temperature, Bank 2, Sensor 2
      $scope.bluetoothWrite("0146\r"); // Ambient Air Temperature
      $scope.bluetoothWrite("015C\r"); // Engine Oil Temperature

      // throttle / pedal sensors

      $scope.bluetoothWrite("0111\r"); // Throttle position
      $scope.bluetoothWrite("0145\r"); // Relative throttle position
      $scope.bluetoothWrite("014C\r"); // Commanded throttle actuator
      $scope.bluetoothWrite("015A\r"); // Relative accelerator pedal position

      // exhaust system

      $scope.bluetoothWrite("0114\r"); // First lambda sensor
      $scope.bluetoothWrite("0115\r"); // Second lambda sensor

      // intake / fuel system sensors

      $scope.bluetoothWrite("010A\r"); // Fuel pressure
      $scope.bluetoothWrite("015D\r"); // Fuel Injection Timing
      $scope.bluetoothWrite("015E\r"); // Engine Fuel Rate
      $scope.bluetoothWrite("0133\r"); // Barometric pressure
      $scope.bluetoothWrite("010B\r"); // Intake manifold absolute pressure
      $scope.bluetoothWrite("0110\r"); // MAF air flow rate

      // Read Buffer every 100ms

      $scope.readLoop = $interval(function() {
               $scope.bluetoothRead();
            }, 100);

      $timeout(function()
        {
            // Query loop for DTC's

            $scope.exhaustSystemSensorLoop = $interval(function() {
               $scope.bluetoothWrite("03\r"); // Request trouble codes
            }, 60000);

            // Query Loop for Engine related sensors

            $scope.engineSensorLoop = $interval(function() {
              $scope.bluetoothWrite("010C\r"); // Engine rpm
              $scope.bluetoothWrite("0104\r"); // Calculated engine load
              $scope.bluetoothWrite("010D\r"); // Vehicle speed 
              $scope.bluetoothWrite("0143\r"); // Absolute load
              $scope.bluetoothWrite("0161\r"); // Demand engine torque
              $scope.bluetoothWrite("0162\r"); // Actual engine torque
              $scope.bluetoothWrite("0163\r"); // Engine reference torque
            }, 1000);
          
          // Query Loop for Temperature related sensors

          $scope.temperatureSensorLoop = $interval(function() {
              $scope.bluetoothWrite("0105\r"); // Engine Coolant Temperature
              $scope.bluetoothWrite("010F\r"); // Intake Air Temperature
              $scope.bluetoothWrite("013C\r"); // Catylyst Temperature, Bank 1, Sensor 1
              $scope.bluetoothWrite("013D\r"); // Catylyst Temperature, Bank 2, Sensor 1
              $scope.bluetoothWrite("013E\r"); // Catylyst Temperature, Bank 1, Sensor 2
              $scope.bluetoothWrite("013F\r"); // Catylyst Temperature, Bank 2, Sensor 2
              $scope.bluetoothWrite("0146\r"); // Ambient Air Temperature
              $scope.bluetoothWrite("015C\r"); // Engine Oil Temperature
            }, 10000);

          // Query Loop for Throttle / pedal sensors

            $scope.throttlePedalSensorLoop = $interval(function() {
              $scope.bluetoothWrite("0111\r"); // Throttle position
              $scope.bluetoothWrite("0145\r"); // Relative throttle position
              $scope.bluetoothWrite("014C\r"); // Commanded throttle actuator
              $scope.bluetoothWrite("015A\r"); // Relative accelerator pedal position
            }, 3000);

            // Exhaust system

            $scope.exhaustSystemSensorLoop = $interval(function() {
               $scope.bluetoothWrite("0114\r"); // First lambda sensor
               $scope.bluetoothWrite("0115\r"); // Second lambda sensor

            }, 500);

            // Intake / fuel system sensors

            $scope.intakeFuelSensorLoop = $interval(function() {
                $scope.bluetoothWrite("010A\r"); // Fuel pressure
                $scope.bluetoothWrite("015D\r"); // Fuel Injection Timing
                $scope.bluetoothWrite("015E\r"); // Engine Fuel Rate
                $scope.bluetoothWrite("0133\r"); // Barometric pressure
                $scope.bluetoothWrite("010B\r"); // Intake manifold absolute pressure
                $scope.bluetoothWrite("0110\r"); // MAF air flow rate
            }, 1000);
          }
        ,10000);
    }
    else
    {
        $interval.cancel($scope.engineSensorLoop);
        $interval.cancel($scope.temperatureSensorLoop);
        $interval.cancel($scope.throttlePedalSensorLoop);
        $interval.cancel($scope.exhaustSystemSensorLoop);
        $interval.cancel($scope.intakeFuelSensorLoop);
        $interval.cancel($scope.readLoop);

        localStorage.setItem('journeyData', JSON.stringify($scope.sensorData)); // store the data in localstorage
        $scope.sensorData = []; // New array for new recording session
        $cordovaToast.show('Recording Stopped', 'short', 'center');
        $scope.recording = false;
        $scope.status = "Tap to Record";
    }
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
			       var point = {point: data};
  			     $scope.sensorData.push(point);
          	}
          },
          function() {
              return false;
          }
      );
  }

})