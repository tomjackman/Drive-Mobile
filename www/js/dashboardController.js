/**
 * This controller is responsible for the logic of the dashboard and journey recording.
 */

angular.module('starter')

.controller('dashboardController', function($cordovaBluetoothSerial, $scope, BluetoothService, $cordovaToast, $timeout, $interval, StorageService, $rootScope) {

$scope.status = "Tap to Start Journey";
$scope.recording = false;
$scope.sensorData = [];

/**
 * Checks if setup is complete before attempting to show the active vehicle
 */
$rootScope.checkDisplay = function()
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

    $rootScope.checkDisplay();

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
      // Remove data from the last journey
      journeyData = [];
      localStorage.setItem("journeyData", JSON.stringify(journeyData));
      localStorage.setItem("startTime", "");
      localStorage.setItem("endTime", "");

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

      // Turn off echo
      $cordovaBluetoothSerial.write("ATE0\r");

      // Adaptive timing mode 2
       $timeout(function()
       {
          $cordovaBluetoothSerial.write("ATAT2\r");
       },100);

      // Turn off line feeds
       $timeout(function()
       {
          $cordovaBluetoothSerial.write("ATL0\r");
       },250);

       // Turn off spaces
       $timeout(function()
       {
          $cordovaBluetoothSerial.write("ATS0\r");
       },350);

      // Write to OBD Device - Initial Search Phase
      $timeout(function()
       {
         $cordovaBluetoothSerial.write("010C1\r");
       },450);

      $timeout(function()
        {
            // Bluetooth buffer read loop - read responses from the vehicle every 70ms
            $scope.readLoop = $interval(function() {
               $scope.bluetoothRead();
            }, 50);

            // 9 Sensors to be Queried Every 9 seconds
            $scope.slotOneSensors = ["010A1\r", // Fuel Pressure
                                      "010B1\r", // Intake Manifold Absolute Pressure
                                      "01101\r", // MAF Air Flow Rate
                                      "01331\r", // Barometric Pressure
                                      "01431\r", // Absolute Load Value
                                      "01451\r", // Relative Throttle Position
                                      "014C1\r", // Commanded Throttle Atuator
                                      "015A1\r", // Relative Accelerator Pedal Position
                                      "015D1\r"] // Fuel Injection Timing
            $scope.slotOneCount = 0                                 

            // 8 Sensors to be Queried Every 8 seconds
            $scope.slotTwoSensors = ["01051\r", // Engine Coolant Temperature
                                      "010F1\r", // Intake Air Temperature
                                      "013C1\r", // Catalyst Temperature, Bank 1, Sensor 1
                                      "013D1\r", // Catalyst Temperature, Bank 2, Sensor 1
                                      "013E1\r", // Catalyst Temperature, Bank 1, Sensor 2
                                      "013F1\r", // Catalyst Temperature, Bank 2, Sensor 2
                                      "01461\r", // Ambient Air Temperature
                                      "015C1\r"] // Engine Oil Temperature

            $scope.slotTwoCount = 0

            // 4 Sensors to be Queried Every 4 seconds
            $scope.slotThreeSensors = ["01611\r", // Drivers Demand Engine Torque
                                       "01621\r", // Actual Engine Torque
                                       "01631\r", // Engine Refeence Torque
                                       "015E1\r"] // Engine Fuel Rate

            $scope.slotThreeCount = 0

            // Diagnostic Trouble Codes to be Queried Every 20 seconds
            $scope.slotFourSensors = ["03\r"] // Diagnostic Trouble Codes

            $scope.slotFourCount = 0

            // Query Loop for sensors
            $scope.querySensorLoop = $interval(function() {

              $scope.bluetoothWrite("010C1\r"); // Engine rpm

              $timeout(function()
              {
                $scope.bluetoothWrite("01041\r"); // Calculated engine load
              },100);

              $timeout(function()
              {
                $scope.bluetoothWrite("010D1\r"); // Vehicle speed
              },200);

              $timeout(function()
              {
                $scope.bluetoothWrite("01141\r"); // Oxygen Sensor 1 Voltage
              },300);

              $timeout(function()
              {
                $scope.bluetoothWrite("01151\r"); // Oxygen Sensor 2 Voltage
              },400);

              $timeout(function()
              {
                $scope.bluetoothWrite("01111\r"); // Throttle Position
              },500);

              $timeout(function()
              {
                $scope.bluetoothWrite($scope.slotOneSensors[$scope.slotOneCount]); // Slot 1
              },600);

              $timeout(function()
              {
                $scope.bluetoothWrite($scope.slotTwoSensors[$scope.slotTwoCount]); // Slot 2
              },700);

              $timeout(function()
              {
                $scope.bluetoothWrite($scope.slotThreeSensors[$scope.slotThreeCount]); // Slot 3
              },800);

              if($scope.slotFourCount === 0)
              {
                $timeout(function()
                {
                  $scope.bluetoothWrite($scope.slotFourSensors[0]); // Slot 4
                },900);
              }



              if($scope.slotOneCount === 8) // If at end of Slot 1 Sensor Array
              {
                  $scope.slotOneCount = 0 // Go back to first sensor in the list
              }
              else // Otherwise Move Onto Next Sensor In The List
              {
                $scope.slotOneCount++
              }

              if($scope.slotTwoCount === 7) // If at end of Slot 2 Sensor Array
              {
                  $scope.slotTwoCount = 0 // Go back to first sensor in the list
              }
              else // Otherwise Move Onto Next Sensor In The List
              {
                $scope.slotTwoCount++
              }

              if($scope.slotThreeCount === 3) // If at end of Slot 3 Sensor Array
              {
                  $scope.slotThreeCount = 0 // Go back to first sensor in the list
              }
              else // Otherwise Move Onto Next Sensor In The List
              {
                $scope.slotThreeCount++
              }

              if($scope.slotFourCount === 19) // If at end of Slot 4 Sensor Array
              {
                  $scope.slotFourCount = 0 // Go back to first sensor in the list
              }
              else // Otherwise Move Onto Next Sensor In The List
              {
                $scope.slotFourCount++
              }


            }, 1000);
          }
        ,10000);
    }
    else
    {   
        // Cancel all car sensor querying
        $interval.cancel($scope.querySensorLoop);
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

        // store the journey data in localstorage
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