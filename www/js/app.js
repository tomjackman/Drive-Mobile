// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', ['ionic','ngCordova', 'ionic-datepicker'])

.run(function($ionicPlatform, BluetoothService, $ionicHistory, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    BluetoothService.disconnectFromDevice(); // disconnect if connected, can cause listing of devices issues
   // BluetoothService.enableBluetooth();

   // Keep screen on
    window.plugins.insomnia.keepAwake()

    // Setup local data structures on inital app start
    if(localStorage.getItem('setup_complete') === null)
    {
      localStorage.setItem('serverAddress', "http://192.168.43.180:8080");
      journeyData = [];
      localStorage.setItem('journeyData', JSON.stringify(journeyData));
      vehicleList = [];
      localStorage.setItem('vehicleList', JSON.stringify(vehicleList));
      followingList = [];
      localStorage.setItem('followingList', JSON.stringify(followingList));

      $state.go('app.obdConnection');
                    $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      disableBack: true
                    });
    }

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  // http configuration

  $ionicConfigProvider.navBar.alignTitle('center'); // align all navbar text to center
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'menuController'
  })

    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashboardController'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'settingsController'
        }
      }
    })

    .state('app.obdConnection', {
      url: '/obdConnection',
      views: {
        'menuContent': {
          templateUrl: 'templates/obdConnection.html',
          controller: 'obdConnectionController'
        }
      }
    })

    .state('app.genderChooser', {
      url: '/genderChooser',
      views: {
        'menuContent': {
          templateUrl: 'templates/genderChooser.html',
          controller: 'genderChooserController'
        }
      }
    })
    .state('app.countryChooser', {
      url: '/countryChooser',
      views: {
        'menuContent': {
          templateUrl: 'templates/countryChooser.html',
          controller: 'countryChooserController'
        }
      }
    })
    .state('app.dateOfBirthChooser', {
      url: '/dateOfBirthChooser',
      views: {
        'menuContent': {
          templateUrl: 'templates/dateOfBirthChooser.html',
          controller: 'dateOfBirthChooserController'
        }
      }
    })

    .state('app.following', {
      url: '/following',
      views: {
        'menuContent': {
          templateUrl: 'templates/following.html',
          controller: 'followingController'
        }
      }
    })

    .state('app.addVehicleMake', {
      url: '/addVehicleMake',
      views: {
        'menuContent': {
          templateUrl: 'templates/addVehicleMake.html',
          controller: 'addVehiclesController'
        }
      }
    })

    .state('app.addVehicleModel', {
      url: '/addVehicleModel',
      views: {
        'menuContent': {
          templateUrl: 'templates/addVehicleModel.html',
          controller: 'addVehiclesController'
        }
      }
    })

    .state('app.addVehicleYear', {
      url: '/addVehicleYear',
      views: {
        'menuContent': {
          templateUrl: 'templates/addVehicleYear.html',
          controller: 'addVehiclesController'
        }
      }
    })

    .state('app.addVehicleStyle', {
      url: '/addVehicleStyle',
      views: {
        'menuContent': {
          templateUrl: 'templates/addVehicleStyle.html',
          controller: 'addVehiclesController'
        }
      }
    })

    .state('app.finalVehicle', {
      url: '/finalVehicle',
      views: {
        'menuContent': {
          templateUrl: 'templates/finalVehicle.html',
          controller: 'addVehiclesController'
        }
      }
    })

    .state('app.vehicles', {
      url: '/vehicles',
      views: {
        'menuContent': {
          templateUrl: 'templates/vehicles.html',
          controller: 'vehiclesController'
        }
      }
    })

    .state('app.showVehicle', {
      url: '/vehicles/:vehicleID',
      views: {
        'menuContent': {
          templateUrl: 'templates/showVehicle.html',
          controller: 'vehiclesController'
        }
      }
    })

    .state('app.showOwnedVehicle', {
      url: '/vehicles/showOwnedVehicle/:ownedVehicleID',
      views: {
        'menuContent': {
          templateUrl: 'templates/showOwnedVehicle.html',
          controller: 'vehiclesController'
        }
      }
    })

    .state('app.showJourney', {
      url: '/vehicles/showJourney/:journeyID',
      views: {
        'menuContent': {
          templateUrl: 'templates/showJourney.html',
          controller: 'vehiclesController'
        }
      }
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});

