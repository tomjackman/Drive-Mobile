/**
 * This factory service is responsible for the local storage of entities.
 */

angular.module('starter')

.factory('StorageService', function($timeout, $ionicActionSheet, $cordovaBluetoothSerial, $http, $ionicLoading) {

  return {

      // retrieve the stored Mac Address
      getMacAddress: function(){
       return localStorage.getItem('mac_address');
      },

      // Save the gender
      saveGender: function(gender){
        localStorage.setItem('gender', gender);
      },

       // Save the birth year details
      saveDateOfBirth: function(date){
        localStorage.setItem('dateOfBirth', date);
      },

       // Save the country details
      saveCountry: function(country){
        localStorage.setItem('country', country);
      },

      // Sends the vehicle and driver data to the cloud, requests unique identifier from the cloud.
      // The vehicle is saved locally with the unique id from the cloud.
      addVehicle: function(carData){

            var dateOfBirth = localStorage.getItem('dateOfBirth'); 
            var gender = localStorage.getItem('gender');
            var country = localStorage.getItem('country');

            // REST call to add a new vehicle + driver
            $http.post('http://192.168.43.107:8080/Drive/api/addNewVehicle', { dateOfBirth: dateOfBirth, gender: gender, country: country, carData: carData}, {
            ignoreAuthModule: true}).success(function(data) {
              // Saved to the cloud successfully
              if(data.status.name === "CREATED")
              {
              // Add new vehicle to the local storage data structure
              var vehicles = localStorage.getItem('vehicleList');
              vehicles = JSON.parse(vehicles);
              var id = data.id;
              var newVehicle = {id: id, 'carData': carData};
              vehicles.push(newVehicle);
              localStorage.setItem('vehicleList', JSON.stringify(vehicles));
              localStorage.setItem('active_vehicle', id);

              // Remove the contents of the cached vehicle entity choices
              localStorage.setItem('chosenManufacturer', "");
              localStorage.setItem('chosenModel', "");
              localStorage.setItem('chosenStyle', "");
              localStorage.setItem('chosenStyleId', "");
              localStorage.setItem('chosenYear', "");

              // Popup to show user that the data was sent to the cloud sucessfully
                 var hideSheet = $ionicActionSheet.show({
                   titleText: '<i class="icon ion-ios-cloud-upload-outline"></i> Saved Vehicle to the Cloud'
                      });

                 // hide the popup after seven seconds
                 $timeout(function() {
                   hideSheet();
                 }, 7000);

              }
              else
              {
                // Popup to show user that the data sent to the cloud was invalid
                 var hideSheet = $ionicActionSheet.show({
                   titleText: '<i class="icon ion-ios-close-outline"></i> Invalid or Missing Data'
                      });

                 // hide the popup after seventy seconds
                 $timeout(function() {
                   hideSheet();
                 }, 70000);
              }

            }
            // CANNOT REACH SERVER ERROR MESSAGE HERE
            );
      },

      // Sends the journey data to the cloud.
      addJourney: function(){

        var vehicleID = localStorage.getItem("active_vehicle");
        var journeyData = JSON.parse(localStorage.getItem("journeyData"));
        var startTime = JSON.parse(localStorage.getItem("startTime"));
        var endTime = JSON.parse(localStorage.getItem("endTime"));

          // Send data to the web application
            $http.post('http://192.168.43.107:8080/Drive/api/addNewJourney', { vehicleID: vehicleID, 
              journeyData: journeyData, 
              startTime: startTime, 
              endTime: endTime}, {ignoreAuthModule: true}).success(function(data) {
              // Saved to the cloud successfully
              if(data.status.name === "CREATED")
              {

              // Remove data from localstorage
               journeyData = [];
               localStorage.setItem("journeyData", JSON.stringify(journeyData));
               localStorage.setItem("startTime", "");
               localStorage.setItem("endTime", "");

              // Popup to show user that the data was sent to the cloud sucessfully
                 var hideSheet = $ionicActionSheet.show({
                   titleText: '<i class="icon ion-ios-cloud-upload-outline"></i> Saved Journey to the Cloud'
                      });

                 // hide the popup after seven seconds
                 $timeout(function() {
                   hideSheet();
                 }, 7000);

              }
              else
              {
                // Popup to show user that the data sent to the cloud was invalid
                 var hideSheet = $ionicActionSheet.show({
                   titleText: '<i class="icon ion-ios-close-outline"></i> Invalid or Missing Data'
                      });

                 // hide the popup after seventy seconds
                 $timeout(function() {
                   hideSheet();
                 }, 70000);
              }

            }
            // CANNOT REACH SERVER ERROR MESSAGE HERE
            );
      },

      // Sets the setup complete flag to true
      setupComplete: function(){
        localStorage.setItem('setup_complete', 'true');
        $state.go('dashboard');
      },

      // Checks if the setup wizzard has been completed or not
      isSetupComplete: function(){
        if(localStorage.getItem('setup_complete') === 'true')
        {
          return true;
        }
        else
        {
          return false;
        }
      }

  };

})