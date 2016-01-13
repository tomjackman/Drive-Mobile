angular.module('starter')

.controller('dateOfBirthChooserController', function($scope, $stateParams, $ionicHistory, StorageService) {

$scope.date = new Date();

$scope.datepickerObject = {
      titleLabel: 'Date of Birth',  //Optional
      todayLabel: '', //Optional
      setLabel: 'Done',  //Optional
      setButtonType : 'button-balanced',  //Optional
      inputDate: new Date(),  //Optional
      showTodayButton: 'true', //Optional
      mondayFirst: true,  //Optional
      templateType: 'modal', //Optional
      modalHeaderColor: 'bar-balanced', //Optional
      modalFooterColor: 'bar-balanced', //Optional
      from: new Date(1900, 1, 1), //Optional
      to: new Date(),  //Optional
      dateFormat: 'DD-MM-YYYY', //Optional
      closeOnSelect: false, //Optional
      callback: function (val) {  //Mandatory
        $scope.saveDateOfBirth(val);
      }
    };

$scope.saveDateOfBirth = function(date)
	{
		$scope.date = date;
		console.log(date.getMonth());
		StorageService.saveDateOfBirth(date);
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
			window.location.href = '#/app/dashboard';
		}
	}
});