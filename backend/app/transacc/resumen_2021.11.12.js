'use strict';



angular.module('myApp.transaccResumen', ['ngRoute'])



//enrutamiento a resumen de una transaccion, se busca por su id

.config(['$routeProvider', function($routeProvider,) {

  $routeProvider.when('/transacc/:id_transaccion', {

    templateUrl: 'transacc/resumen.html',

    controller: 'ctrlTransaccionResumen'

  });

}])





//enrutamiento a resumen pagos destino de transaccción

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/transacc/destino', {

    templateUrl: 'transacc/destino.html',

    controller: 'ctrlTransaccionPagosDestino'

  });

}])



.controller('ctrlTransaccionResumen', ['$scope', '$http', '$routeParams', '$filter', function($scope, $http, $routeParams, $filter) {

  var ctrl = this;

  $scope.data = [];

  //para mostrar mensajes

  $scope.showError = false;

  $scope.mostrarExito = false;

  $scope.showErrorNotFound = false;

  $scope.showForm = true;



  //datos de transacción

  $scope.id_transaccion = $routeParams.id_transaccion;

  console.log('id_transaccion: ' + $scope.id_transaccion);





  //captura parametro - id de transacción

  $scope.capturarParametro = function(){

    console.log('controlador-transaccResumen- capturarParametro. inicio');

    $scope.id_transaccion = $routeParams.id_transaccion;

    console.log('id_transaccion: ' + $scope.id_transaccion);

    //TODO. validar parametro, que sea numerico entero

    console.log('controlador-transaccResumen- capturarParametro. fin');

  }





  //funcion para OBTENER DATOS DE transaccion, y los guarda en variable json

  $scope.getDataResumen = function() {

    console.log('controlador-getDataResumen. inicio');

    //TODO. agregar uso de parametro

    $http.get("./transacc/resumen_get.php?id=" + $scope.id_transaccion)

    .then(function (response) {

      console.log('controlador-getDataResumen. then');

      var data = response.data.records;

      if (data[0] != null){

      console.log('controlador-getDataResumen. SI trajo datos');

      $scope.data = data[0];

      $scope.showForm = true;

    }

    else{

      console.log('controlador-getDataResumen. NO trajo datos');

      $scope.showForm = false;

      $scope.msg = "Transaccion con id: " + $scope.id_transaccion + " no encontrada";

      $scope.showErrorNotFound = true;

    }

      console.log('controlador-getDataResumen- getDataResumen. then. end');

  },

  function(data, status) {

    console.error('Error en llamada a busqueda dato: ', status, data);

    $scope.msg = "Error consultando datos";

    $scope.showError = true;

    $scope.showForm = false;

    });   //TODO: gestionar error, cuando no se traigan los datos del usuario, mostrar mensaje en vista

  };





//formatear valores de campo date_created

$scope.formatDateCreated = function (data){

  // Obteniendo todas las claves del JSON

  var json = angular.copy(data);

  for (var clave in json){

    // Controlando que json realmente tenga esa propiedad

    if (json.hasOwnProperty(clave)) {

      // Mostrando en pantalla la clave junto a su valor

      console.log('fecha: ' + json[clave].date_created);

      console.log('fecha formateada: ' + formatDate(json[clave].date_created));

      json[clave].date_created = formatDate(json[clave].date_created);

    }

  }

  return json;

};



  //funcion para convertir una fecha en texto a tipo date

  //parametro:

  //stringDate, en formato de ejemplo: 2021-08-17 08:28:37

  $scope.convertToDate = function (stringDate){

    var dateOut = new Date(stringDate);

    dateOut.setDate(dateOut.getDate());

    console.info('convertToDate: ' + dateOut);

    return dateOut;

  };



  //funcion para calcular diferencia entre dos fechas

  //parametro2:

  //stringDate1, en formato de ejemplo: 2021-08-17 08:28:37

  //stringDate2, en formato de ejemplo: 2021-08-17 08:28:37

  $scope.testDiffDates = function (){

    var date1 = new Date("2021-08-17 08:28:37");

    var date2 = new Date("2021-08-18 08:28:37");

    let dif = $filter('amDifference')(date1, date2, 'days');

    dateDif.setDate(dif.getDate());

    console.info('date1: ' + date1);

    console.info('date2: ' + date2);

    console.info('dateDif: ' + dateDif);

    return dateDif;

  };



  







 //funcion para OBTENER DATOS DE transaccion, y los guarda en variable json

 $scope.getDataPagosDestino = function() {

   console.log('controlador -resumen- getDataPagosDestino. start');



   //TODO. agregar uso de parametro

   $http.get("./transacc/destino_transacc.php?id=" + $scope.id_transaccion)

   .then(function (response) {

     if (response.data.records){

       $scope.resultados_destino = response.data.records;

       console.log('resultados_destino: ' + JSON.stringify($scope.resultados_destino));

       $scope.resultados_destino = $scope.formatDateCreated($scope.resultados_destino);

       console.log('controlador -resumen- getDataPagosDestino. data_destino = ');

       console.log($scope.resultados_destino);



      //sumar los pagos realizados

      $scope.pago_pendiente = 0.00;

      var total_pagado = 0.00;

      var total_destino = 0.00;

      for(var i = 0; i < $scope.resultados_destino.length; i++) {

          var fila = $scope.resultados_destino[i];

          total_destino += (fila.monto && fila.monto > 0) ? parseFloat(fila.monto) : 0;

          //verifica si este pago fue realizado

          if (fila.check_realizado >= 1) //1 es pagado, 2 es confirmado

            total_pagado += parseFloat(fila.monto);

          console.log('monto en posicion ' + i + '= ' + fila.monto);

      }

      console.log('total pagado destino:' + total_pagado);

      $scope.total_pagado = total_pagado;

      $scope.pago_pendiente = total_destino - $scope.total_pagado;



      $scope.destino_showForm = true;

   }

   else{

     $scope.destino_showForm = false;

     $scope.msg = "Info no encontrada: Pagos a destino con id transaccion: " + $scope.id_transaccion;

     $scope.destino_showErrorNotFound = true;

   }

 },

 function(data, status) {

   console.error('Error en llamada a busqueda dato: ', status, data);

   $scope.msg = "Error consultando datos";

   $scope.destino_showError = true;

   $scope.destino_showForm = false;

   });   //TODO: gestionar error, cuando no se traigan los datos del usuario, mostrar mensaje en vista

  console.log('controlador -resumen- getDataPagosDestino. fin');

 };





//funcion llamada al inicio

$scope.init_function = function(){

  console.log('controlador -transacc/resumen- init_function. start');



  //test diff dates

  //$scope.testDiffDates();



  //$scope.cargarPaises();

  $scope.capturarParametro();

  if($scope.id_transaccion == 'new'){

    console.log('Opcion: NEW');

    $scope.reset();

  }else{

    $scope.getDataResumen();

    $scope.getDataPagosDestino();

    //+$scope.getDataPagosOrigen();

  }

  console.log('controlador -transacc/resumen- init_function. end');

}



  /*funcion para actualizar transacción, pagos en destino*/

  $scope.updatePagoDestino = function($tipo) {

    console.log('calc- funcion:updatePagoDestino. inicio');

    console.log('$scope.dataSave');

    console.log($scope.dataSave);

    var update = '';
    //debugger;
    if ($tipo == 5){ //marcar como pago realizado
      update = './transacc/update_transaccion5.php';
    }
    else if ($tipo == 6){
      update = './transacc/update_transaccion6.php';
    }

    $http.post(update, JSON.stringify($scope.dataSave))

    .then(function (response) {

      //debugger;

      //+$scope.showErrorNotFound = false;

      if (response.data){

        var dataResp = response.data.records[0];

        if(dataResp.resultado != null)

          if(dataResp.resultado == 'EXITO'){

            $scope.msg = "Pago destino actualizado con Exito!";

            //$scope.data.id_transaccion = dataResp.resultado.id_trans;

            //console.info('transaccion.id: ' + $scope.transaccion.id);

            //+$scope.mostrarExito = true;

            //+$scope.showError = false;

            return true;

          }else if(dataResp.resultado == 'ERROR'){

            $scope.msg = '\n' + data.mensaje;

            //+$scope.showError = true;

            //+$scope.mostrarExito = false;

            return false;

          }

        }

      }, function (response) {
        $scope.msg = "Ups. Hubo un error al intentar registrar la Informacion: Service not Exists (" + $update + ")";
        $scope.statusval = response.status;
        $scope.statustext = response.statusText;
          //$scope.headers = response.headers();
          $scope.mostrarError = true;
          $scope.mostrarExito = false;

        });

    console.log('-transacc/resumen- funcion:updatePagoDestino. fin');

  };//updatePagoDestino




  //prepara datos para marcar pago destino como pagado
  $scope.marcarPagoDestino = function($id_pago_destino) {
    console.info('Se va a actualizar el pago en destino con id:' + $id_pago_destino);
    var $d = {};
    //*debugger;
    //$d.id_transaccion  = $scope.data.id_transaccion;
    $d.id_pago_destino = $id_pago_destino;
    //TODO. add field usuario_login_operador_pagador
    $scope.dataSave  = $d;
    var exito = $scope.updatePagoDestino(5);

    if (!exito){
      //reload page to show changes
      window.location.reload();
    }
    else{
      alert('No se pudo registrar el pago. Por favor vuelve a intentar.')
    }
  }

  //prepara datos para marcar pago destino como confirmado
  $scope.confirmarPagoDestino = function($id_pago_destino) {
    console.info('Se va a actualizar el pago en destino con id:' + $id_pago_destino);
    var $d = {};
    //*debugger;
    //$d.id_transaccion  = $scope.data.id_transaccion;
    $d.id_pago_destino = $id_pago_destino;
    //TODO. add field usuario_login_operador_pagador
    $scope.dataSave  = $d;
    var exito = $scope.updatePagoDestino(6);

    if (exito){
      //TODO. :
      //if ya se pago todo el saldo del envio en moneda destino
      //entonces: actualizar transaccion, marcando estatus='FIN', estatus_PD='OK'
      //TODO. tambien se deberia comprobar que se recibio todo el pago en origen, aunque hay que considerar cuando se hacen remesas a credito 
    }

    //reload page to show changes
    window.location.reload();
  }


  ////*debugger;

  console.log('controlador-transacc/resumen. inicio');
  //funcion llamada al abrir la pantalla
  $scope.init_function();
  console.log('controlador -transacc/resumen- fin');


}]

)

//directiva para mostrar mensaje de confirmacion, en un boton o enlace
.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Estás seguro de esta acción?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
}]);

