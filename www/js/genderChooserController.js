angular.module('starter')

.controller('genderChooserController', function($scope, $stateParams, StorageService, $ionicHistory) {

	$scope.saveGender = function(gender)
	{
		StorageService.saveGender(gender);
	}

	$scope.next = function()
	{
		if(StorageService.isSetupComplete() === true)
		{
			location.replace("#/app/settings");
                    $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      disableBack: true
                    });
		}
		else
		{
			window.location.href = '#/app/countryChooser';
		}
	}
});