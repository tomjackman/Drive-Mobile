angular.module('starter')

.controller('genderChooserController', function($scope, $stateParams, StorageService) {

	$scope.saveGender = function(gender)
	{
		StorageService.saveGender(gender);
	}

	$scope.next = function()
	{
		if(StorageService.isSetupComplete() === true)
		{
			window.location.href = '#/app/settings';
		}
		else
		{
			window.location.href = '#/app/countryChooser';
		}
	}

});