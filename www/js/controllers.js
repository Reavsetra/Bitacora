angular.module('starter.controllers', ['ngCordova', 'ngStorage'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $ionicPopup,$localStorage) {
  //Obtener los datos del usuario que se logeó
  var nombre = localStorage.getItem("userName");
  $scope.loginStorage = nombre;

  // llamar a una conexión PHP con base de datos para obtener los datos de las actividades por cliente de cada instalador
  $scope.direccion = 'http://www.zunfeld.com/servicesApp/actividades_copy.php?nombre=' + $scope.loginStorage;
  //$scope.direccion = 'js/data.json';

  $scope.URLEnvioChat = 'http://www.zunfeld.com/servicesApp/envioChat.php';
})

.controller('BitacoraCtrl', function($scope, $http, $ionicModal,$ionicPopup, $rootScope,$localStorage, $ionicLoading) {
  
  $http.get($scope.direccion)
  .success(function(data){
    $ionicLoading.hide();
    $scope.info = data;
    $scope.clientes = $scope.info.clientes;
    $scope.actividades = $scope.info.actividades;
  });


  // Modal para la vista de la nomenclatura de la bitácora
  $ionicModal.fromTemplateUrl('templates/infoBitacora.html', {
    scope: $scope,
    animation: 'animated' + ' ' + 'zoomIn'
  }).then(function(modal) {
    $scope.infoBitacoraModal = modal;
  });

  // Funciones que se cargarán al entrar en la vista de la BITACORA
  $scope.$on('$ionicView.enter', function() {
    //Traer Username del usuario que se logeo
    var nombre = localStorage.getItem("userName");
    $scope.loginStorage = nombre;

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

  $scope.recargarDatos = function(){
    //actualizamos los datos del servidor
    $http.get($scope.direccion)
    .success(function(data){
      $scope.info = data;
      $scope.clientes = $scope.info.clientes;
      $scope.actividades = $scope.info.actividades;

      //lanzamos valor para que se detenga el spiner
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
})

.controller('ActividadCtrl', function($scope, $http, $state, $stateParams, $ionicModal, $ionicPopup, $ionicLoading, $ionicScrollDelegate,$ionicActionSheet,$timeout) {

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

  $ionicLoading.show();
  $http.get($scope.direccion)
  .success(function(data){
    //Cerrar el Loading
    $ionicLoading.hide();

    // localizar el proyecto con base al Id_Actividad dentro del array Proyectos
    var indexOfUser = encontrarIndexArray(data.actividades, 'id_Actividad', $stateParams.id_Actividad);
    $scope.data = data.actividades[indexOfUser];
  });

  //Abrir el chat de cada tarea
  $scope.openTarea = function(id) {
    //tomar el Id de bitacora
    $scope.selectedId = id;
    //instanciar variable de nuevo chat
    $scope.newChat = {};
    $scope.newChat.chat = '';

    //mostrar el modal del chat
    $scope.modalChat.show();

    //Posisionar el Scroll a mostar el último elemento agregado
    $ionicScrollDelegate.scrollBottom(true);

    //Encontrar el index de la tarea con base al id de bitacora
    var indexOfTarea = encontrarIndexArray($scope.data.tareas, 'id_Bitacora', $scope.selectedId);

    //Obtener la información de los chats de la actividad seleccionada
    $scope.conversacion = $scope.data.tareas[indexOfTarea].chat;


    //Enviar nuevo mensaje de chat
    $scope.sendData = function(){

      $ionicLoading.show();

      //funcion para obtener la hora de forma normal
      $scope.obtHoraPrint = function(){
        var fechaHora = new Date();
        var horas = fechaHora.getHours();
        var minutos = fechaHora.getMinutes();
        var segundos = fechaHora.getSeconds();
        var mer = '';
        if(horas>=12){ mer = 'pm'}
          else { mer = 'am'}
        if(horas > 12){ horas = horas - 12};
        if(horas < 10) { horas = '0' + horas; };
        if(minutos < 10) { minutos = '0' + minutos; };
        if(segundos < 10) { segundos = '0' + segundos; };
        return horas+':'+minutos+':'+segundos+mer;
        $timeout(this, 1000);
      };

      //funcion para obtener la fecha
      $scope.obtFecha = function(){
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var ano = fecha.getFullYear();

        // Condicionales para mostrar la fecha con un 0
        if (dia<10){ dia = '0' + dia; };
        if (mes<10){ mes = '0' + mes; }; 

        return ano + '-' + mes + '-' + dia;
        $timeout(this, 1000);
      };

      console.log($scope.newChat.chat);
      //Igualar datos del nuevo chat al Objeto newChat
      $scope.newChat.userName = $scope.loginStorage;
      $scope.newChat.idBitacora = $scope.data.tareas[indexOfTarea].id_Actividad;
      $scope.newChat.idDBitacora = $scope.data.tareas[indexOfTarea].id_Bitacora;
      $scope.newChat.fechaHora  = $scope.obtFecha() + ' ' + $scope.obtHoraPrint();

      

      console.log("informacion");
      console.log($scope.data.tareas[indexOfTarea].id_Bitacora);

      $http.post($scope.URLEnvioChat, $scope.newChat).success(
        function(data){

          $scope.response = data;
          console.log($scope.response);

          //Actualizar los datos del chat
          $http.get($scope.direccion)
          .success(
            function(data){ 
              console.log(data);
              //Encontrar el index de la tarea con base al id de bitacora
              var indexOfUser = encontrarIndexArray(data.actividades, 'id_Actividad', $scope.newChat.idBitacora);

              console.log('obtener');
              console.log(data.actividades[indexOfUser].tareas[indexOfTarea].chat);
              //$scope.conversacion = data.tareas[indexOfTarea].chat;
              $scope.conversacion = data.actividades[indexOfUser].tareas[indexOfTarea].chat;
              $scope.newChat.chat = '';
              //Posisionar el Scroll a mostar el último elemento agregado
              $ionicScrollDelegate.scrollBottom(true);
              $ionicLoading.hide();
            }
          )
        }
      )
    };
  }
})

.controller('ChatCtrl', function($scope, $http){
})

.controller('ClientesCtrl', function($scope, $http, $state, $stateParams, $ionicModal,$ionicPopup) {



  // llamar a una conexión PHP con base de datos para obtener los datos de las actividades por cliente de cada instalador
  $http.get('http://www.zunfeld.com/servicesApp/actividades_copy.php')
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
.controller('LoginCtrl', function($scope, $http, $ionicModal, $ionicPopup, $state, $rootScope, $localStorage, $ionicLoading){
  //Objeto que contendra los datos que introduscan en el formulario
  $scope.loginData = {};
  var storage = localStorage;

  //Login para entrar a la Aplicacion
  $scope.doLogin = function(){
    $ionicLoading.show();
    var envio = $http.post("http://zunfeld.com/servicesApp/loginApp.php", $scope.loginData);
    envio.success(function(data){
      console.log($scope.loginData.username);
      console.log(data);
      // alert(data);
      if(data == 3){
        $ionicLoading.hide();
        var alertaRegSim = $ionicPopup.alert({
            title: ' Zunfeld.com ',
            template: 'No has realizado registro de Entrada Trabajo en CHKTE'
        });
      }else if(data == 2){
        $ionicLoading.hide();
        var alertaRegSim = $ionicPopup.alert({
            title: ' Zunfeld.com ',
            template: 'Usuario y/o contraseña incorecta'
        });
      }else if(data == 1){
        $ionicLoading.hide();
        storage.setItem("userName", $scope.loginData.username);
        console.log('Valor guardado '  + $scope.loginData.username);
        var alertaRegSim = $ionicPopup.alert({
          title: ' Zunfeld.com ',
          template: '¡ Bienvenido !'
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