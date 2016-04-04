angular.module('starter')

.controller('vehiclesController', function($http, $scope, $state, $ionicHistory, StorageService, $cordovaToast, $rootScope, $stateParams, $ionicLoading) {

  var vehicles = localStorage.getItem('vehicleList');
  $scope.vehicles = JSON.parse(vehicles);

/**
 * Change to the add vehicle view to create a new vehicle
 */
  $scope.addVehicle = function()
  {
  	$state.go('app.addVehicleMake');
  }

  /**
 * This method will set the current vehicle to be active - the car to record the car data against.
 * @param man - the car manufacturer
 * @param mod - the car model
 * @param year - the cars year
 * @param vehicle_id - the global id of the vehicle
 */
  $scope.setActive = function(man, mod, year, vehicle_id)
  {
    localStorage.setItem('active_vehicle', vehicle_id);
    $rootScope.checkDisplay();
    $cordovaToast.show(year + " " + man + " " + mod + " is now active." , 'long', 'center');
  }

  /**
   * Get vehicle information for the chosen vehicle.
   */
  $scope.showFollowedVehicle = function()
  {
    $scope.showVehicleInformation = false;
    $scope.showStatistics = false;
    $scope.showJourneys = false;
    $scope.vehicle = StorageService.getFollowedVehicle($stateParams.vehicleID);
  }

  /**
  * Get vehicle statistics for the chosen vehicle.
  * @param vehicleID - the global id of the vehicle
  */
  $scope.getVehicleStatistics = function(vehicleID)
  {
      $http.post(localStorage.getItem('serverAddress') + '/Drive/api/getVehicleStatistics/' + vehicleID).success(function(data) {
      $scope.overallStatistics = data;
      });
  }

  /**
  * Get vehicle journeys for the chosen vehicle.
  * @param vehicleID - the global id of the vehicle
  */
  $scope.getVehicleJourneys = function(vehicleID)
  {
      $ionicLoading.show({
        template: 'Getting Journeys...'
      });

      $http.post(localStorage.getItem('serverAddress') + '/Drive/api/getVehicleJourneys/' + vehicleID).success(function(data) {
      $scope.journeys = data;

      for (var i = 0; i <  $scope.journeys.length; i++) {
        $scope.journeys[i].startHour = new Date($scope.journeys[i].startTime.toLocaleString()).getHours();
        $scope.journeys[i].startTime = $scope.formatDate($scope.journeys[i].startTime);
        $scope.journeys[i].endTime = $scope.formatDate($scope.journeys[i].endTime);
      }

      $ionicLoading.hide();

      });
  }

  /**
  * Get the journey data for a given journey.
  * @param journeyID - the id of the journey
  */
  $scope.getJourneyData = function()
  {
      $ionicLoading.show({
        template: 'Getting Journey Data...'
      });

      $http.post(localStorage.getItem('serverAddress') + '/Drive/api/getJourneyData/' + $stateParams.journeyID).success(function(data) {
      $scope.journeyData = data;
      })

      $ionicLoading.hide();
  }

  /**
  * Format dates
  * @param date - the date to format
  */
  $scope.formatDate = function(date)
  {
      var newDate = date.toLocaleString();
      newDate = new Date(newDate);

      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

     var day = newDate.getDate();
     var month = monthNames[newDate.getMonth()];
     var year = newDate.getFullYear();
     var hours = newDate.getHours();
     var minutes = newDate.getMinutes();
     var seconds = newDate.getSeconds();

     var formattedDate = hours + ":" + minutes + ":" + seconds + " (" + day + " " + month + " " + year + ")";
     return formattedDate;
  }

  /**
  * Method that shows a vehicle.
  */
  $scope.showOwnedVehicle = function()
  {
    $scope.showVehicleInformation = false;
    $scope.showStatistics = false;
    $scope.showJourneys = false;
    $scope.vehicle = StorageService.getOwnedVehicle($stateParams.ownedVehicleID);
  }

})