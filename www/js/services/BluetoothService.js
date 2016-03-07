angular.module('starter')

.factory('BluetoothService', function($cordovaBluetoothSerial, $ionicPopup, $ionicLoading, $cordovaToast) {


  return {

    // Checks if bluetotth has been enabled on the device
    isEnabled: function() {
      $cordovaBluetoothSerial.isEnabled().then(
          function() {
              return true;
          },
          function() {
              return false;
          }
      );
    },

    // prompts the user to enable bluetooth
    enableBluetooth: function() {
      $cordovaBluetoothSerial.enable().then(
        function() {
            return true; // This initiate a system popup to prompt the user
        },
        function() {
            return false;
          }
        );
        },

         // connect to a bluetooth device using the mac address of the device
    connectToDevice: function(macAddress){
        $cordovaBluetoothSerial.connect(macAddress).then(
          function() {

            $cordovaToast.show('Connected Succesfully to OBD-II Device', 'long', 'center');
            localStorage.setItem('mac_address', macAddress); // store the address of the device
            return true; // can connect
          },
          function() {

              $cordovaToast.show('Cannot connect to the OBD-II device. Either the vehicle is not turned on or the device is out of range', 'long', 'center');


               return false; // can't connect
          }
      );
      },

      // disconnects from current device
    disconnectFromDevice: function() {
      $cordovaBluetoothSerial.disconnect().then(
        function() {
            return true; // disconnect from device
        },
        function() {
            return false;
          }
        );
        },

    // write data to the serial port
    write: function(data){
        $cordovaBluetoothSerial.write(data).then(
          function() {
              return true; // can write
          },
          function() {
              return false; // can't write
          }
      );
      },

    // write data from the serial port
    read: function(){
        $cordovaBluetoothSerial.read().then(
          function(data) {
            console.log("read - " + data);
            return data;
          },
          function() {
              return false; // can't write
          }
      );
      },

    // readUntil reads the data from the buffer until it reaches a delimiter
    readUntil: function(){
        $cordovaBluetoothSerial.readUntil('\r', function (data) {
              console.log("readUntil - " + data);
              return data;
          });
      },

      // clear removes any data from the receive buffer.
    clear: function(){
        $cordovaBluetoothSerial.clear();
        console.log("buffer cleared");
      },

    // write data from the serial port
    available: function(){
      $cordovaBluetoothSerial.available(function (numBytes) {
        alert("There are " + numBytes + " available to read.");
      }, 
        function(){
        alert("available not working");
      });
      },

    //  registers a callback that is called when data is received
    subscribeRawData: function(){
      $cordovaBluetoothSerial.subscribeRawData(function (data) {
        var bytes = new Uint8Array(data);
        console.log(bytes); 
      }, 
        function(){
        alert("subscribeRawData not working");
      });
      },

      // readUntil reads the data from the buffer until it reaches a delimiter
    subscribe: function(){
        $cordovaBluetoothSerial.subscribe('\r', function (data) {
              alert("readUntil - " + data);
              return data;
          });
      },

    //  unsubscribeRawData removes any notification added by subscribeRawData and kills the callback.
    unsubscribeRawData: function(){
      $cordovaBluetoothSerial.unsubscribeRawData();
      }



  };

})
