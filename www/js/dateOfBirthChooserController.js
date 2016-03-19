angular.module('starter')

.controller('dateOfBirthChooserController', function($scope, $stateParams, $ionicHistory, StorageService, $state, $rootScope) {

$scope.date = JSON.parse(localStorage.getItem('dateOfBirth'));

// Change the save/next button text depending on if the setup has been completed or not
if(StorageService.isSetupComplete() === true)
{
	$scope.buttonText = "Done";
}
else
{
	$scope.buttonText = "Finish";
}

// create the date picker properties
$scope.datepickerObject = {
      titleLabel: 'Date of Birth',
      todayLabel: '', 
      setLabel: 'Done',
      setButtonType : 'button-balanced', 
      inputDate: new Date(), 
      showTodayButton: false,
      mondayFirst: true, 
      templateType: 'modal',
      modalHeaderColor: 'bar-balanced',
      modalFooterColor: 'bar-balanced',
      from: new Date(1900, 1, 1),
      to: new Date(), 
      dateFormat: 'DD-MM-YYYY', 
      closeOnSelect: false, 
      callback: function (val) { 
        $scope.saveDateOfBirth(val);
      }
    };

/**
 * This method will save the date to local storage in a certain format.
 */
$scope.saveDateOfBirth = function(date)
	{
      $scope.date = {'year': date.getFullYear(),
                       'month': date.getMonth(),
                       'dayOfMonth': date.getDate()
                      }

		StorageService.saveDateOfBirth($scope.date);
	}

/**
 * This method will decide the routing depending if the app setup has been complete.
 * If the app setup has been complete, then the used has edited the setting via the 
 * settings menu - so return to the settings menu when they hit save.
 */
$scope.next = function()
	{
    $rootScope.updateMenuDetails()
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
			$state.go('app.addVehicleMake')
		}
	}
});