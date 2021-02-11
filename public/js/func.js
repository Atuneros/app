$(function() {

  var nombre = ""
  var empresa_selected = localStorage.getItem('empresa_selected');
  var dia_selected = localStorage.getItem('dia_selected');

  if (empresa_selected) {
    nombre = empresa_selected
  }else{
    nombre = "ACCIONA"
  }

  $.get("http://localhost:3000/loadData", function(data){
    procesarDatos(data)
  });

  //var precio = []
  var dias = []
  var datos_combinados = []
  var temp = ""
  var temp2 = ""

  function procesarDatos(data){
    if(empresa_selected){
      $("#empresas").append(new Option(empresa_selected));
      for(x = 0; x < 35; x++){
        if(data[x]["nombre"] != empresa_selected)
        $("#empresas").append(new Option(data[x]["nombre"]));
      }
    }else{
      for(x = 0; x < 35; x++){
        $("#empresas").append(new Option(data[x]["nombre"]));
      }
    }

    data.forEach((item, i) => {
      if(item.nombre == nombre){
        if(temp = "" || temp != item.fecha){
          dias.push(item.fecha)
          //precio.push(item.ultimo)
          datos_combinados.push({x:item.fecha, y:item.ultimo})
        }
        temp = item.fecha
      }
    });

    $("#dias").append(new Option("Todos los días"));
    for(x = 0; x < dias.length; x++){
      $("#dias").append(new Option(dias[x]));
    }

    var options = {
            series: [{
            name: nombre,
            data: datos_combinados,
          }],
            chart: {
            type: 'area',
            stacked: false,
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight'
          },
          title: {
            text: 'Datos para ' + nombre,
            align: 'left'
          },
          subtitle: {
            text: 'Movimiento de precios',
            align: 'left'
          },
          legend: {
            horizontalAlign: 'left'
          }
          };

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
  }

  $("#empresas").on('change', function() {
    localStorage.setItem('empresa_selected', $(this).val());
    localStorage.setItem('dia_selected', $("#dias").val());
    location.reload()
  });

  $("#dias").on('change', function() {
    localStorage.setItem('empresa_selected', $("#empresas").val());
    localStorage.setItem('dia_selected', $(this).val());
    location.reload()
  });

});
