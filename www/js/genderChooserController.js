angular.module('starter')

.controller('genderChooserController', function($scope, $stateParams, StorageService, $ionicHistory, $state, $rootScope) {

// Change the save/next button text depending on if the setup has been completed or not
	if(StorageService.isSetupComplete() === true)
		{
			$scope.buttonText = "Done";
		}
	else
		{
			$scope.buttonText = "Next";
		}

/**
 * This method will save the gender to localstorage.
 */
	$scope.saveGender = function(gender)
	{
		StorageService.saveGender(gender);
	}


/**
 * This method will decide the routing depending if the app setup has been complete.
 * If the app setup has been complete, then the used has edited the setting via the 
 * settings menu - so return to the settings menu when they hit save.
 */
	$scope.next = function()
	{
		$rootScope.updateMenuDetails();
		if(StorageService.isSetupComplete() === true)
		{
			$state.go('app.settings')
                    $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      disableBack: true
                    });
		}
		else
		{
			$state.go('app.countryChooser')
		}
	}
});