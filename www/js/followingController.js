angular.module('starter')

.controller('followingController', function($scope, $stateParams, $cordovaBarcodeScanner, $http) {

	$scope.vehicles = JSON.parse(localStorage.getItem('followingList'));

	$scope.followVehicle = function(){

      $cordovaBarcodeScanner.scan().then(
          function (vehicleID) {
             
          	$http.get(localStorage.getItem('serverAddress') + '/Drive/vehicle/show/' + vehicleID.text + '.json').success(function(data) {

	        
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
