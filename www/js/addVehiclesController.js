angular.module('starter')

.controller('addVehiclesController', function($state, $ionicLoading, $http, $scope, $ionicHistory, StorageService) {

$scope.chosenManufacturer = "";

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

  $scope.chooseManufacturer = function(make)
  {

    localStorage.setItem('chosenManufacturer', make);
    $state.go('app.addVehicleModel');
  }

  $scope.chooseModel = function(model)
  {

    localStorage.setItem('chosenModel', model);
    $state.go('app.addVehicleYear');
  }

   $scope.chooseYear = function(year)
  {

    localStorage.setItem('chosenYear', year);
    $state.go('app.addVehicleStyle');
  }

  $scope.chooseStyle = function(style, id, carData)
  {

    localStorage.setItem('chosenStyle', style);
    localStorage.setItem('chosenStyleId', id);
    localStorage.setItem('fullCarData', JSON.stringify(carData));
    $state.go('app.finalVehicle');
  }

  $scope.addNewVehicle = function()
  {	

    var carData = JSON.parse(localStorage.getItem('fullCarData'));

  	StorageService.addVehicle(carData);

    if(StorageService.isSetupComplete() === true)
    {
      $state.go('app.vehicles');
    }
    else
    {
      $state.go('app.dashboard');
    }
  }

})