$(function() {
    
  var nombre = ""
  var nombre2 = ""
  var titulo_grafica = ""
  var empresa_selected = localStorage.getItem('empresa_selected')
  var empresa2_selected = localStorage.getItem('empresa2_selected')

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
    nombre2 = "-----NINGUNA-----"
    titulo_grafica = "Datos para " + nombre
  }
  
  //var precio = []
  var dias = []
  var datos_combinados = []
  var datos2_combinados = []
  var temp = ""
  var temp2 = ""

  procesarDatos(data)
  console.log(data[0])

  //TODO BIEN HECHO
  var nombresEmpresas = []
  data.forEach(element => {
    nombresEmpresas.push(element["nombre"])
  })
  nombresUnicos = Array.from(new Set(nombresEmpresas))
  console.log(nombresUnicos)
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
      $("#empresas2").append(new Option(nombre2))
      for(x = 0; x < 35; x++){
        $("#empresas").append(new Option(data[x]["nombre"]))
        $("#empresas2").append(new Option(data[x]["nombre"]))
      }
    }

    data.forEach((item, i) => {
      if(item.nombre == nombre || item.nombre == nombre2){

        if(item.nombre == nombre){
          if(temp = "" || temp != item.fecha){
            dias.push(item.fecha)
            fecha = item.fecha.substr(3, 2)+"/"+item.fecha.substr(0, 2)+"/"+item.fecha.substr(6, 4)+" GMT";
            datos_combinados.push([new Date(fecha), item.ultimo])
          }
          temp = item.fecha
        }else if(item.nombre == nombre2){
          if(temp2 = "" || temp2 != item.fecha){
            fecha = item.fecha.substr(3, 2)+"/"+item.fecha.substr(0, 2)+"/"+item.fecha.substr(6, 4)+" GMT";
            datos2_combinados.push([new Date(fecha), item.ultimo])
          }
          temp2 = item.fecha
        }
      }
    })
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
          }],chart: {
            id: "area-datetime",
            type: 'area',
            stacked: false,
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: true
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
          },
          xaxis: {
            type: 'datetime',
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

})
