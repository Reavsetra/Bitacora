angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  // $scope.loginData = {};

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

  // Perform the login action when  the user submits the login form

})

.controller('BitacoraCtrl', function($scope, $http, $ionicModal,$ionicPopup, $rootScope) {
 
  // Modal para la vista de la nomenclatura de la bitácora
  $ionicModal.fromTemplateUrl('templates/infoBitacora.html', {
    scope: $scope,
    animation: 'animated' + ' ' + 'zoomIn'
  }).then(function(modal) {
    $scope.infoBitacoraModal = modal;
  });

  // Funciones que se cargarán al entrar en la vista de la BITACORA
  $scope.$on('$ionicView.enter', function() {

    // Función para que aparezca el botón de información solo en la vista de la bitácora y ejecute la aparición del modal con la nomenclatura
    $scope.$parent.addButton = function(){
      $scope.infoBitacoraModal.show();
      $scope.hideModal = function(){
        $scope.infoBitacoraModal.hide();
      };
    }
  });
  
  // Regresar el valor de addButton para que el botón de información de la nomenclatura no se muestre en otras vistas
  $scope.$on('$stateChangeStart', function() {
    $scope.$parent.addButton = null;
  })

  // llamar a una conexión PHP con base de datos para obtener los datos de las actividades por cliente de cada instalador
  $http.get('http://www.zunfeld.com/servicesApp/actividades_copy.php')
  .success(function(data){
    // alert($scope.name);
    $scope.info = data;
    console.log('información');
    console.log($scope.info);
    $scope.clientes = $scope.info.clientes;
    console.log($scope.clientes);
    $scope.actividades = $scope.info.actividades;
    console.log($scope.actividades);
  });
})
.controller('ActividadCtrl', function($scope, $http, $state, $stateParams, $ionicModal,$ionicPopup) {
  //Funcion para encontrar el index del usuario a buscar
  function encontrarIndexArray(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
        return i;
      }
    }
  };

  // Modal para la vista del chat del instalador
  $ionicModal.fromTemplateUrl('templates/chat.html', {
    scope: $scope,
    animation: 'animated' + ' ' + 'zoomIn'
  }).then(function(modal) {
    $scope.modalChat = modal;
  });

  $http.get('http://www.zunfeld.com/servicesApp/actividades_copy.php')
  .success(function(data){
    console.log("informacion");
    console.log(data.actividades);
    console.log($stateParams.id_Actividad);
    // localizar el proyecto con base al Id_Actividad dentro del array Proyectos
    var indexOfUser = encontrarIndexArray(data.actividades, 'id_Actividad', $stateParams.id_Actividad);
    console.log(indexOfUser);
    $scope.data = data.actividades[indexOfUser];
  });
})


.controller('ClientesCtrl', function($scope, $http, $state, $stateParams, $ionicModal,$ionicPopup) {
  // llamar a una conexión PHP con base de datos para obtener los datos de las actividades por cliente de cada instalador
    $http.get('js/data.json')
    .success(function(data){
      $scope.info = data;
      console.log('información');
      console.log($scope.info);
      $scope.clientes = $scope.info.clientes;
      console.log($scope.clientes);
      $scope.actividades = $scope.info.actividades;
      console.log($scope.actividades);
    });
})

//Controlador de Login
.controller('LoginCtrl', function($scope, $http, $ionicModal, $ionicPopup, $state, $rootScope){
  //Objeto que contendra los datos que introduscan en el formulario
  $scope.loginData = {};

  //Login para entrar a la Aplicacion
  $scope.doLogin = function(){
    var envio = $http.post("http://zunfeld.com/servicesApp/loginApp.php", $scope.loginData);
    envio.success(function(data){
      console.log($scope.loginData.username);
      console.log(data);
      // alert(data);
      if(data == 3){
        var alertaRegSim = $ionicPopup.alert({
            title: ' Zunfeld.com ',
            template: 'No has realizado registro de Entrada Trabajo en CHKTE'
        });
      }else if(data == 2){
        var alertaRegSim = $ionicPopup.alert({
            title: ' Zunfeld.com ',
            template: 'Usuario y/o contraseña incorecta'
        });
      }else if(data == 1){
        var alertaRegSim = $ionicPopup.alert({
          title: ' Zunfeld.com ',
          template: 'Bienvenido !'
        });
        alertaRegSim.then(function(){
          $state.go('app.dashboard');
        }); //Fin cambio de estado
      } //fin else if
    }, function(err){
        console.log("Error");
    }) //Fin de Envio de datos .success
  } //Fin de Funcion de accion del Boton
}) 