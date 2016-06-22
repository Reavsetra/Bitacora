angular.module('starter.controllers', ['ngStorage'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicModal, $ionicPopup, $http, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.login = function() {
    $scope.login.hide();
  };
  
  // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
})

.controller('MenuCtrl', function($scope,$state) {
   $scope.menu = {};
   var storage = localStorage;
    storage.getItem("UserName", $scope.loginData.username);
    console.log($scope.loginData.username);
})

.controller('BitacoraCtrl', function($scope) {
  $scope.actividades = [
    {
      cliente: 'Zunfeld Digital',
      sucursal: 'Observatorio',
      proyecto: 'Cámaras IP',
      fecha: '2016-05-11 17:54:07',
    },
    {
      cliente: 'Zunfeld Digital',
      sucursal: 'Observatorio',
      proyecto: 'Redes',
      fecha: '2016-05-11 17:54:07',
    },
    {
      cliente: 'Zunfeld Digital',
      sucursal: 'Observatorio',
      proyecto: 'Automatización',
      fecha: '2016-05-11 17:54:07',
    }
  ];

  $scope.playlists = [
    { 
      

      title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams, $ionicModal, $ionicPopup, $http) {
})

.controller('LoginCtrl', function($scope,$http, $ionicModal, $ionicPopup, $state, $localStorage, $rootScope){
  //Objeto que contendra los datos que introduscan en el formulario
  $scope.loginData = {};
  //Login para entrar a la Aplicacion
  $scope.doLogin = function(){
    // console.log("Datos de Logeo");
    // console.log($scope.loginData.username);
    // console.log($scope.loginData.password);
      var storage = localStorage;
        storage.setItem("UserName", $scope.loginData.username);
        storage.setItem("Password", $scope.loginData.password);
        console.log('Valor guardado '  + $scope.loginData.username);


    var envio = $http.post("http://zunfeld.com/servicesApp/loginApp.php", $scope.loginData);
    envio.success(function(data){
      console.log(data);
      if(data == '1'){
        var alertaRegSim = $ionicPopup.alert({
            title: ' Zunfeld.com ',
            template: 'Datos incorrectos'
        });
      }else if(data == '2'){
        $scope.loginData = {};
        var alertaRegSim = $ionicPopup.alert({
          title: ' Zunfeld.com ',
          template: 'Bienvenido !'
        });
        alertaRegSim.then(function(){
          $state.go('app.menu', reload=true);
        }); //Fin cambio de estado
      } //fin else if
    }, function(err){
        console.log("Error");
    }) //Fin de Envio de datos .success
  } //Fin de Funcion de accion del Boton
}) //FIn de Controlador
