angular.module('starter')

.factory('BluetoothService', function($cordovaBluetoothSerial, $ionicPopup, $ionicLoading, $cordovaToast) {


  return {

    /**
     * Checks if bluetotth has been enabled on the device
     */
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

    /**
     * Prompts the user to enable bluetooth
     */
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
 
    /*
    * Write data to the Bluetooth Device
    * The data to write to the bluetooth buffer.
    * @param data - the data to write to the bluetooth buffer
    */
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

    /*
    * Read data from the Bluetooth buffer
    */
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

    /**
     * Connect to a bluetooth device using the mac address of the device
     * @param macAddres - the device with the mac address to conenct to
     */
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

    /*
    * Disconnects from current device
    */
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

    /*
    * Reads the data from the buffer until it reaches a delimiter
    */
    readUntil: function(){
        $cordovaBluetoothSerial.readUntil('\r', function (data) {
              console.log("readUntil - " + data);
              return data;
          });
      },      // c
    /*
    * Clear removes any data from the receive buffer.
    */
    clear: function(){
        $cordovaBluetoothSerial.clear();
        console.log("buffer cleared");
      },

    /*
    * Write data from the serial port
    
    */
    available: function(){
      $cordovaBluetoothSerial.available(function (numBytes) {
        alert("There are " + numBytes + " available to read.");
      }, 
        function(){
        alert("available not working");
      });
      },
 
    /*
    * UnsubscribeRawData removes any notification added by subscribeRawData and kills the callback.
    */
    unsubscribeRawData: function(){
      $cordovaBluetoothSerial.unsubscribeRawData();
      }



  };

})
