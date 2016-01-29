angular.module('starter')

.factory('StorageService', function($cordovaBluetoothSerial, $http, $ionicLoading) {

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

            $ionicLoading.show({
              template: 'Generating Global ID...'
            });

            var dateOfBirth = localStorage.getItem('dateOfBirth'); 
            var gender = localStorage.getItem('gender');
            var country = localStorage.getItem('country');

            $http.post('http://localhost:8080/Drive/api/addNewVehicle', { dateOfBirth: dateOfBirth, gender: gender, country: country, carData: carData}, {
            ignoreAuthModule: true}).success(function(data) {

            var id = data.id;

            var newVehicle = {id: id, 'carData': carData};
        
            vehicles.push(newVehicle);
            localStorage.setItem('vehicleList', JSON.stringify(vehicles));
            localStorage.setItem('active_vehicle', id);

            // DELETE ALL CHOSEN * LOCAL STORAGE VARIABLES

            $ionicLoading.hide();
            });
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