angular.module('starter')

.controller('addVehiclesController', function($scope, $ionicHistory, StorageService) {

  $scope.add = function(manufacturer, model, year, engine_size, fuel_type)
  {	

  	StorageService.addVehicle(manufacturer, model, year, engine_size, fuel_type);

    if(StorageService.isSetupComplete() === true)
    {
      location.replace("#/app/vehicles");
                    $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      disableBack: true
                    });
    }
    else
    {
      window.location.href = '#/app/dashboard';
    }
  }

})