/**
 * This factory service is responsible for the local storage of entities.
 */

angular.module('starter')

.factory('StorageService', function($timeout, $ionicPopup, $cordovaBluetoothSerial, $http, $ionicLoading, $state, $rootScope, $ionicHistory) {

  return {

      /**
     * This method will retrieve the stored Mac Address
     */
      getMacAddress: function(){
       return localStorage.getItem('mac_address');
      },

    /**
     * This method will save the gender
     */
      saveGender: function(gender){
        localStorage.setItem('gender', gender);
      },

    /**
     * This method will save the birth year details
     */
      saveDateOfBirth: function(date){
        localStorage.setItem('dateOfBirth', JSON.stringify(date));
      },

      /**
     * This method will save the country details
     */
      saveCountry: function(country){
        localStorage.setItem('country', country);
      },

    /**
     * This method sends the vehicle and driver data to the cloud, requests unique identifier from the cloud.
     * The vehicle is saved locally with the unique id from the cloud.
     */
      addVehicle: function(carData){

            var dateOfBirth = JSON.parse(localStorage.getItem('dateOfBirth')); 
            var gender = localStorage.getItem('gender');
            var country = localStorage.getItem('country');

            // REST call to add a new vehicle + driver
            $http.post(localStorage.getItem('serverAddress') + '/Drive/api/addNewVehicle', {dateOfBirth: dateOfBirth, gender: gender, country: country, carData: carData}, {
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

              // update the active vehicle on the dashboard
              $rootScope.checkDisplay();

              // Remove the contents of the cached vehicle entity choices
              localStorage.setItem('chosenManufacturer', "");
              localStorage.setItem('chosenModel', "");
              localStorage.setItem('chosenStyle', "");
              localStorage.setItem('chosenStyleId', "");
              localStorage.setItem('chosenYear', "");

              // car added
               var alertPopup = $ionicPopup.alert({
                 title: 'Vehicle Added',
                 template: '<div align="center"><img ng-src="img/logo-dark.png" height="150" width="150"></div>'
               });

              }
              else
              {
                // could not add car
                var alertPopup = $ionicPopup.alert({
                 title: 'Could Not Add Vehicle',
                 template: '<div align="center"><img ng-src="img/logo-dark.png" height="150" width="150"></div>'
               });

              }

            },
            // Cannot contact server
              function() {
                  var alertPopup = $ionicPopup.alert({
                 title: 'Could Not Contact Server',
                 template: '<div align="center"><img ng-src="img/logo-dark.png" height="150" width="150"></div>'
               });
              }
            );
      },

     /**
     * This method sends the journey data to the cloud.
     */
      addJourney: function(){

        var vehicleID = localStorage.getItem("active_vehicle");
        var journeyData = JSON.parse(localStorage.getItem("journeyData"));
        var startTime = JSON.parse(localStorage.getItem("startTime"));
        var endTime = JSON.parse(localStorage.getItem("endTime"));

          // Send data to the web application
            $http.post(localStorage.getItem('serverAddress') + '/Drive/api/addNewJourney', { vehicleID: vehicleID, 
              journeyData: journeyData, 
              startTime: startTime, 
              endTime: endTime}, {ignoreAuthModule: true}).success(function(data) {
              // Saved to the cloud successfully
              if(data.status.name === "CREATED")
              {
              // journey added
              var alertPopup = $ionicPopup.alert({
                 title: 'Journey Added',
                 template: '<div align="center"><img ng-src="img/logo-dark.png" height="150" width="150"></div>'
               });

              }
              else
              {
                // Cannot add journey
                var alertPopup = $ionicPopup.alert({
                 title: 'Could Not Add Journey',
                 template: '<div align="center"><img ng-src="img/logo-dark.png" height="150" width="150"></div>'
               });
              }

            },
            // Cannot contact server
              function() {
                  var alertPopup = $ionicPopup.alert({
                 title: 'Could Not Contact Server',
                 template: '<div align="center"><img ng-src="img/logo-dark.png" height="150" width="150"></div>'
               });
              }

            );
      },

    /**
     * This method sets the setup complete flag to true meaning the initial setup has been carried out
     */
      setupComplete: function(){
        localStorage.setItem('setup_complete', 'true');
        $state.go('app.dashboard');
        $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      disableBack: true
                    });

      },

    /**
     * This method retrieves the vehicle information for a followed vehicle
     */
      getFollowedVehicle: function(vehicleIdentifier){
        var vehicles = localStorage.getItem('followingList');
        vehicles = JSON.parse(vehicles);

        for (var i = 0; i < vehicles.length; i++) {
          if(vehicles[i].carData.identifier === vehicleIdentifier)
          {
            return vehicles[i];
          }
        }
      },

      /**
     * This method retrieves the vehicle information for an owned vehicle
     */
      getOwnedVehicle: function(vehicleIdentifier){
        var vehicles = localStorage.getItem('vehicleList');
        vehicles = JSON.parse(vehicles);

        for (var i = 0; i < vehicles.length; i++) {
          if(vehicles[i].id === vehicleIdentifier)
          {
            return vehicles[i];
          }
        }
      },

      /**
     * This method returns the state of the setup completion
     */
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