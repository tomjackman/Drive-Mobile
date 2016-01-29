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

      // Save the setup details
      addVehicle: function(carData){

        var vehicles = localStorage.getItem('vehicleList');
        vehicles = JSON.parse(vehicles);

            var dateOfBirth = localStorage.getItem('dateOfBirth'); 
            var gender = localStorage.getItem('gender');
            var country = localStorage.getItem('country');

            $http.post('http://localhost:8080/Drive/api/addNewVehicle', { dateOfBirth: dateOfBirth, gender: gender, country: country, carData: carData}, {
            ignoreAuthModule: true}).success(function(data) {

              if(data.status.name === "CREATED")
              {
              var id = data.id;
              var newVehicle = {id: id, 'carData': carData};
          
              vehicles.push(newVehicle);
              localStorage.setItem('vehicleList', JSON.stringify(vehicles));
              localStorage.setItem('active_vehicle', id);

              localStorage.setItem('chosenManufacturer', "");
              localStorage.setItem('chosenModel', "");
              localStorage.setItem('chosenStyle', "");
              localStorage.setItem('chosenStyleId', "");
              localStorage.setItem('chosenYear', "");

              // Show the action sheet
                 var hideSheet = $ionicActionSheet.show({
                   titleText: '<i class="icon ion-ios-cloud-upload-outline"></i> Saved to the Cloud'
                      });

                 // hide the sheet after two seconds
                 $timeout(function() {
                   hideSheet();
                 }, 7000);

              }
              else
              {
                // Show the action sheet
                 var hideSheet = $ionicActionSheet.show({
                   titleText: '<i class="icon ion-ios-close-outline"></i> Invalid or Missing Data'
                      });

                 // hide the sheet after two seconds
                 $timeout(function() {
                   hideSheet();
                 }, 20000);
              }

            }
            // CANNOT REACH SERVER ERROR MESSAGE HERE
            );
      },

      setupComplete: function(){
        localStorage.setItem('setup_complete', 'true');
        window.location.href = '#/app/dashboard';
      },

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