angular.module('starter')

.factory('StorageService', function($cordovaBluetoothSerial) {

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
      addVehicle: function(car_manufacturer, car_model, car_year, car_engine_size, car_fuel_type){

        function generateId(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }

        var generateId = generateId(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

        var vehicles = localStorage.getItem('vehicleList');
        vehicles = JSON.parse(vehicles);

        var newVehicle = {id: generateId, 'car_manufacturer': car_manufacturer, 'car_model': car_model, 'car_year': car_year, 'car_engine_size': car_engine_size, 'car_fuel_type': car_fuel_type}
        
        vehicles.push(newVehicle);
        localStorage.setItem('vehicleList', JSON.stringify(vehicles));
        localStorage.setItem('active_vehicle', generateId);

      },

      setupComplete: function(){
        localStorage.setItem('setup_complete', 'true');
        window.location.href = '#/app/dashboard';
        window.location.href = '#/app/vehicles';
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