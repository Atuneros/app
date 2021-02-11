$(function() {

  var nombre = ""
  var nombre2 = ""
  var titulo_grafica = ""
  var empresa_selected = localStorage.getItem('empresa_selected')
  var empresa2_selected = localStorage.getItem('empresa2_selected')
  var dia_selected = localStorage.getItem('dia_selected')

  if (empresa_selected) {
    nombre = empresa_selected
  }else{
    nombre = "ACCIONA"
  }

  if (empresa2_selected) {
    nombre2 = empresa2_selected
    if(empresa2_selected != "-----NINGUNA-----"){
      titulo_grafica = "Comparación de " + nombre + " y " + nombre2
    }else{
      titulo_grafica = "Datos para " + nombre
    }
  }else{
    titulo_grafica = "Datos para " + nombre
  }

  $.get("http://localhost:3000/loadData", function(data){
    procesarDatos(data)
  })

  //var precio = []
  var dias = []
  var datos_combinados = []
  var datos2_combinados = []
  var temp = ""
  var temp2 = ""

  function procesarDatos(data){
    if(empresa_selected || empresa2_selected){

      if(empresa_selected){
        $("#empresas").append(new Option(empresa_selected))
      }
      if(empresa2_selected){
        $("#empresas2").append(new Option(empresa2_selected))
        if(empresa2_selected != "-----NINGUNA-----")
          $("#empresas2").append(new Option("-----NINGUNA-----"))
      }
      
      for(x = 0; x < 35; x++){
        if(data[x]["nombre"] != empresa_selected){
          $("#empresas").append(new Option(data[x]["nombre"]))
        }
        if(data[x]["nombre"] != empresa2_selected){
          $("#empresas2").append(new Option(data[x]["nombre"]))
        }
      }

    }else{
      for(x = 0; x < 35; x++){
        $("#empresas").append(new Option(data[x]["nombre"]));
        $("#empresas2").append(new Option(data[x]["nombre"]));
      }
    }

    data.forEach((item, i) => {
      if(item.nombre == nombre || item.nombre == nombre2){

        if(item.nombre == nombre){
          if(temp = "" || temp != item.fecha){
            dias.push(item.fecha)
            //precio.push(item.ultimo)
            datos_combinados.push({x:item.fecha, y:item.ultimo})
          }
          temp = item.fecha
        }else if(item.nombre == nombre2){
          if(temp2 = "" || temp2 != item.fecha){
            datos2_combinados.push({x:item.fecha, y:item.ultimo})
          }
          temp2 = item.fecha
        }
      }
    })

    console.log(datos_combinados)
    console.log(datos2_combinados)

    $("#dias").append(new Option("Todos los días"))
    for(x = 0; x < dias.length; x++){
      $("#dias").append(new Option(dias[x]))
    }

    var options = {
            series: [{
            name: nombre,
            data: datos_combinados
          },{
            name: nombre2,
            data: datos2_combinados
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
            curve: 'smooth'
          },
          title: {
            text: titulo_grafica,
            align: 'left'
          },
          subtitle: {
            text: 'Movimiento de precios',
            align: 'left'
          },
          legend: {
            horizontalAlign: 'left'
          }
          }

    var chart = new ApexCharts(document.querySelector("#chart"), options)

    chart.render()
  }

  $("#empresas").on('change', function() {
    localStorage.setItem('empresa_selected', $(this).val())
    localStorage.setItem('empresa2_selected', $("#empresas2").val())
    localStorage.setItem('dia_selected', $("#dias").val())
    location.reload()
  });

  $("#empresas2").on('change', function() {
    localStorage.setItem('empresa_selected', $("#empresas").val())
    localStorage.setItem('empresa2_selected', $(this).val())
    localStorage.setItem('dia_selected', $("#dias").val())
    location.reload()
  })

  $("#dias").on('change', function() {
    localStorage.setItem('empresa_selected', $("#empresas").val())
    localStorage.setItem('empresa2_selected', $("#empresas2").val())
    localStorage.setItem('dia_selected', $(this).val())
    location.reload()
  })

})
