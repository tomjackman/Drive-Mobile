/**
 * This controller is responsible for the logic of the dashboard and journey recording.
 */

angular.module('starter')

.controller('dashboardController', function($cordovaBluetoothSerial, $scope, BluetoothService, $cordovaToast, $timeout, $interval, StorageService) {

$scope.status = "Tap to Start";
$scope.recording = false;
$scope.sensorData = [];

/**
 * Checks if setup is complete before attempting to show the active vehicle
 */
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

/**
 * Gets the car data for the current active vehicle which will be shown on the dashboard
 */
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

/**
 * Writes data to the bluetooth buffer
 * @param data - the data to send over bluetooth
 */
  $scope.bluetoothWrite = function(data)
  {
        $cordovaBluetoothSerial.write(data);
  }

/**
 * Reads from the bluetooth buffer
 */
  $scope.bluetoothRead = function()
  {
    $cordovaBluetoothSerial.readUntil('\r').then(
          function(data) {

            console.log(data);

            // Only keep alphanumeric characters
            data  = data.replace(/[^A-Z0-9]/ig, ""); 

            // Beginning with 4 indicates a response from the vehicle
            if(data.charAt(0) === '4')  
            {
             $scope.sensorData.push(data);
            }
          },
          function() {
              return false;
          }
      );
  }

/**
 * This method will start/stop a journey depending if a journey is already in progress or not
 * This will also setup the bluetooth connection between the phone and the bluetooth Interface to the car.
 * Handling for different bluetooth states have been taken into consideration.
 */
  $scope.changeRecordingStatus = function()
  {
    if($scope.recording === false)
    {
    $cordovaBluetoothSerial.isEnabled().then( 
          function() {
            // Bluetooth is enabled, check if bluetooth is connected to the device
            $cordovaBluetoothSerial.isConnected().then(
              function() {
                $scope.recordData(); // Already connected to the device so start recording journey data.
              },
              function() {
                  $scope.connectToBluetooth();  // Bluetooth is enabled, then connect to the device and start recording
              }
          ); 
          },
          function() {
            // Bluetooth is disable, then prompt the user to enable bluetooth
            $cordovaBluetoothSerial.enable().then( 
              function() {
                  $scope.connectToBluetooth(); // User enabled bluetooth, then connect to the device and start recording
              },
              function() {
                   $cordovaToast.show('Please Enable Bluetooth', 'long', 'center'); // user chose not to enable bluetooth
                }
              );
            }
      );
    }
    else
    {
      $scope.recordData();  // start recording journey data
    }
  }

/**
 * This method will attempt to connect to the bluetooth device.
 */
  $scope.connectToBluetooth = function()
  {
    $cordovaBluetoothSerial.connect(localStorage.getItem('mac_address')).then(
              function() {
                $cordovaToast.show('Connected Succesfully to OBD-II Device', 'long', 'center'); // connect to device successfully.
                $scope.recordData(); // start recording journey data.
              },
              function() {
                // cannot connect to device
                  $cordovaToast.show('Cannot connect to the OBD-II device. Either the vehicle is not turned on or the device is out of range', 'long', 'center');
              }
          );
  }


  /**
   * Responsible for recording data from a vehicle.
   * Creates timed intervals to query/get data from the cars sensors
   */

  $scope.recordData = function()
  {
    if($scope.recording === false)
    {
      $scope.recording = true;
      $scope.status = "Recording.. Tap to Stop.";
      $cordovaToast.show('Recording Starting in 10 Seconds.', 'short', 'center');

      // Get the journey start time
      var newStartTime = new Date();
      var startTime = {'year': newStartTime.getFullYear(),
                       'month': newStartTime.getMonth(),
                       'dayOfMonth': newStartTime.getDate(),
                       'hourOfDay': newStartTime.getHours(),
                       'minute': newStartTime.getMinutes(),
                       'second': newStartTime.getSeconds()
                      }


        // store the date in localstorage
        localStorage.setItem('startTime', JSON.stringify(startTime));  

      // Clear bluetooth buffer
      $cordovaBluetoothSerial.clear();

      // Write to OBD Device - Initial Search Phase
      //$scope.bluetoothWrite("ATSP0\r"); 

      // engine related sensors
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

       // Clear bluetooth buffer
      $cordovaBluetoothSerial.clear();

      // Bluetooth buffer read loop - call to read sensor value returned from car
      $scope.readLoop = $interval(function() {
               $scope.bluetoothRead();
            }, 100);
     
      $timeout(function()
        {

            // Query loop for DTC's
            $scope.troubleCodesLoop = $interval(function() {
              // $scope.bluetoothWrite("03\r"); // Request trouble codes
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
        // Cancel all car sensor querying
        $interval.cancel($scope.troubleCodesLoop);
        $interval.cancel($scope.engineSensorLoop);
        $interval.cancel($scope.temperatureSensorLoop);
        $interval.cancel($scope.throttlePedalSensorLoop);
        $interval.cancel($scope.exhaustSystemSensorLoop);
        $interval.cancel($scope.intakeFuelSensorLoop);
        $interval.cancel($scope.readLoop);


      // Get the journey end time
      var newEndTime = new Date();
      var endTime = {'year': newEndTime.getFullYear(),
                       'month': newEndTime.getMonth(),
                       'dayOfMonth': newEndTime.getDate(),
                       'hourOfDay': newEndTime.getHours(),
                       'minute': newEndTime.getMinutes(),
                       'second': newEndTime.getSeconds()
                      }


        // store the date in localstorage
        localStorage.setItem('endTime', JSON.stringify(endTime));

        // store the data in localstorage
        localStorage.setItem('journeyData', JSON.stringify($scope.sensorData));

        
        // New array for new recording session
        $scope.sensorData = []; 
        $cordovaToast.show('Recording Stopped', 'short', 'center');
        $scope.recording = false;
        $scope.status = "Tap to Record";

        // Reset ELM327
        $scope.bluetoothWrite("ATZ\r");     
        $cordovaBluetoothSerial.clear();

        // send the data to the cloud.
        StorageService.addJourney();
    }
  }

})