angular.module('starter')

.controller('followingController', function($scope, $stateParams, $cordovaBarcodeScanner, $http) {

	$scope.vehicles = JSON.parse(localStorage.getItem('followingList'));


/**
 * Method that adds a new follow based on vehicle ID obtained using the barcode scanner.
 */
	$scope.followVehicle = function(){

      $cordovaBarcodeScanner.scan().then(
          function (vehicleID) {
             
          	$http.post(localStorage.getItem('serverAddress') + '/Drive/api/getVehicleInfo/' + vehicleID.text).success(function(data) {

	        
	      	  var followingList = localStorage.getItem('followingList');
              followingList = JSON.parse(followingList);
              $scope.manufacturer = "";
              var newVehicle = {carData: data};
              followingList.push(newVehicle);
              localStorage.setItem('followingList', JSON.stringify(followingList));

              $scope.vehicles = JSON.parse(localStorage.getItem('followingList'));
          });

          }, 
          function (error) {
              alert("Scanning failed: " + error);
          }
       );

    } 

});
