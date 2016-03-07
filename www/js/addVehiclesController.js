angular.module('starter')

.controller('addVehiclesController', function($state, $ionicLoading, $http, $scope, $ionicHistory, StorageService) {

$scope.chosenManufacturer = "";

  /**
   * This method will fetch all vehicle makes from Edmunds API
   */
  $scope.getVehicleMakes = function()
  {
    $ionicLoading.show({
      template: 'Gathering Makes...'
    });

    $http.get('http://api.edmunds.com/api/vehicle/v2/makes?fmt=json&view=basic&api_key=3nrfmnznk7f5k97ayfhvfz4y').success(function(data){
      $scope.manufacturers = data.makes;
       $ionicLoading.hide();
    });
  }

  /**
   * This method will fetch all vehicle models for a particular make from Edmunds API
   */
  $scope.getVehicleModels = function()
  {
    $ionicLoading.show({
      template: 'Gathering Models...'
    });

    var query = 'http://api.edmunds.com/api/vehicle/v2/' + localStorage.getItem('chosenManufacturer') + '/models?fmt=json&view=basic&api_key=3nrfmnznk7f5k97ayfhvfz4y';
    $http.get(query).success(function(data){
      $scope.models = data.models;

       $ionicLoading.hide();
    });
  }

  /**
   * This method will fetch all the years that a certain vehicle was made makes from Edmunds API
   */
  $scope.getVehicleYears = function()
  {
    $ionicLoading.show({
      template: 'Getting Years...'
    });

    var query = 'http://api.edmunds.com/api/vehicle/v2/' + localStorage.getItem('chosenManufacturer') + '/' + localStorage.getItem('chosenModel') + '/years?fmt=json&view=basic&api_key=3nrfmnznk7f5k97ayfhvfz4y';
    $http.get(query).success(function(data){
      $scope.years = data.years;

       $ionicLoading.hide();
    });
  }

  /**
   * This method will fetch all the styles for a certain vehicle for a particular year from Edmunds API
   */
  $scope.getVehicleStyles = function()
  {
    $ionicLoading.show({
      template: 'Getting Styles...'
    });

    var query = 'http://api.edmunds.com/api/vehicle/v2/' + localStorage.getItem('chosenManufacturer') + '/' + localStorage.getItem('chosenModel') + '/' + localStorage.getItem('chosenYear') + '/styles?fmt=json&view=full&api_key=3nrfmnznk7f5k97ayfhvfz4y';
    $http.get(query).success(function(data){
      $scope.styles = data.styles;

       $ionicLoading.hide();
    });
  }

  /**
   * This method will fetch additional data for the selected vehicle to show in the view.
   */
  $scope.getFinalVehicle = function()
  {
    $scope.manufacturer = localStorage.getItem('chosenManufacturer');
    $scope.model = localStorage.getItem('chosenModel');
    $scope.year = localStorage.getItem('chosenYear');
    $scope.style = localStorage.getItem('chosenStyle');

    $ionicLoading.show({
      template: 'Preparing...'
    });

    var query = 'https://api.edmunds.com/api/vehicle/v2/styles/' + localStorage.getItem('chosenStyleId') + '?fmt=json&api_key=3nrfmnznk7f5k97ayfhvfz4y&view=full';
    $http.get(query).success(function(data){
    $scope.vehicle = data;

      localStorage.setItem("FullVehicleData", $scope.vehicle);

       $ionicLoading.hide();
    });
  }

  /**
   * This method will store the car manufacturer and go to the model selection view
   */
  $scope.chooseManufacturer = function(make)
  {

    localStorage.setItem('chosenManufacturer', make);
    $state.go('app.addVehicleModel');
  }

  /**
   * This method will store the car model and go to the year selection view
   */
  $scope.chooseModel = function(model)
  {

    localStorage.setItem('chosenModel', model);
    $state.go('app.addVehicleYear');
  }

  /**
   * This method will store the car year and go to the style selection view
   */
   $scope.chooseYear = function(year)
  {

    localStorage.setItem('chosenYear', year);
    $state.go('app.addVehicleStyle');
  }

  /**
   * This method will store the car style and go to the final car view
   */
  $scope.chooseStyle = function(style, id, carData)
  {

    localStorage.setItem('chosenStyle', style);
    localStorage.setItem('chosenStyleId', id);
    localStorage.setItem('fullCarData', JSON.stringify(carData));
    $state.go('app.finalVehicle');
  }

  /**
   * This method will send a request to the storage service to add the vehicle.
   */
  $scope.addNewVehicle = function()
  {	

    var carData = JSON.parse(localStorage.getItem('fullCarData'));

  	StorageService.addVehicle(carData);

    // decide the routing depending if the app setup has been complete.
    if(StorageService.isSetupComplete() === true)
    {
      $state.go('app.dashboard');
      $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      disableBack: true
                    });
    }
    else
    {
      StorageService.setupComplete();
    }
  }

})