angular.module('starter')

.controller('dateOfBirthChooserController', function($scope, $stateParams, $ionicHistory, StorageService) {

$scope.date = new Date();

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
		$scope.date = date;

    var month = $scope.date.getUTCMonth() + 1; //months from 1-12
    var day = $scope.date.getUTCDate();
    var year = $scope.date.getUTCFullYear();

    var formattedDate = year + "-" + month + "-" + day;

		StorageService.saveDateOfBirth(formattedDate);
	}

/**
 * This method will decide the routing depending if the app setup has been complete.
 * If the app setup has been complete, then the used has edited the setting via the 
 * settings menu - so return to the settings menu when they hit save.
 */
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
			window.location.href = '#/app/addVehicle';
		}
	}
});