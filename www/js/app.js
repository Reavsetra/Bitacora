// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic' , 'starter.controllers'])

.run(function($ionicPlatform, $http) {
  $ionicPlatform.ready(function() {
    $window.location.reload(true);
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });


//Objeto con la definicion de los headers del
  //request HTTp, vamos a enviarle JSON al servidor
  //y vamos a recibir Json del servidor.
  //Al objeto $http, le establecemos sus propiedades
  //por defecto para que utilice los headers que 
  //definimos arriba
  var defaultHTTPHeaders = {
    'Content-Type' : 'application/json',
    'Accept' : 'application/json'
  };

  $http.defaults.headers.post = defaultHTTPHeaders;

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html'
        }
      }
    })

  .state('app.bitacora', {
    url: '/bitacora',
    views: {
      'menuContent': {
        templateUrl: 'templates/bitacora.html',
        controller: 'BitacoraCtrl'
      }
    }
  })

  .state('app.clientes', {
    url: '/clientes',
    views: {
      'menuContent': {
        templateUrl: 'templates/clientes.html',
        controller: 'ClientesCtrl'
      }
    }
  })

  .state('app.actividad', {
    url: '/actividad/:id_Actividad',
    views: {
      'menuContent': {
        templateUrl: 'templates/actividad.html',
        controller: 'ActividadCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
