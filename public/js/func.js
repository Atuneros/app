$(function() {

    var empresaSeleccionada
    var precioAccion
    var nombresEmpresas = []
    var datosEstructurados = {}

    console.log(cartera, acciones)
    $("#cartera").text("Cartera: "+cartera+" €")
    
    data.forEach(element => {
        nombresEmpresas.push(element["nombre"])
    })

    $("#formComprar").submit(function(e) {
        e.preventDefault() 
        $("#comprar").prop('disabled', true)

        var form = $(this)
        var url = form.attr('action')

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function(data){
                $("#cartera").text("Cartera: "+data.cartera+" €")
                acciones = data.acciones
                setInfoDinamica(empresaSeleccionada, precioAccion, data.acciones)
                $("#comprar").prop('disabled', false)
            }
        });  
    });

    $("#formVender").submit(function(e) {
        e.preventDefault() 
        $("#vender").prop('disabled', true)

        var form = $(this)
        var url = form.attr('action')

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            timeout: 3000,
            success: function(data){
                $("#cartera").text("Cartera: "+data.cartera+" €")
                acciones = data.acciones
                setInfoDinamica(empresaSeleccionada, precioAccion, data.acciones)
                $("#vender").prop('disabled', false)
            },
            error: function(err){
                $("#vender").prop('disabled', false)
                alert("No tienes acciones de esta empresa")
            }
        });  
    });

    nombresUnicosEmpresas = Array.from(new Set(nombresEmpresas))
    nombresUnicosEmpresas.sort()

    nombresUnicosEmpresas.forEach(element => {
        $("#empresas").append(new Option(element))
    })

    nombresUnicosEmpresas.forEach(nombreEmpresa => {
        datosEstructurados[nombreEmpresa] = []
        data.forEach(element => {
            if(nombreEmpresa == element["nombre"])
                datosEstructurados[nombreEmpresa].push([new Date(element["fecha"].substr(3, 2)+"/"+element["fecha"].substr(0, 2)+"/"+element["fecha"].substr(6, 4)+" GMT"), element["ultimo"]])
        })
    })

    empresaSeleccionada = nombresUnicosEmpresas[0]
    precioAccion = datosEstructurados[empresaSeleccionada][datosEstructurados[empresaSeleccionada].length-1][1]

    setInfoDinamica(empresaSeleccionada, precioAccion, acciones)

    $("#empresas").on("change", function() {
        empresaSeleccionada = $(this).val()
        precioAccion = datosEstructurados[empresaSeleccionada][datosEstructurados[empresaSeleccionada].length-1][1]

        actualizarGrafica(chart, datosEstructurados, empresaSeleccionada)
        setInfoDinamica(empresaSeleccionada, precioAccion, acciones)       
    });

    var options = {
        series: [{
            name: empresaSeleccionada,
            data: datosEstructurados[empresaSeleccionada]
        }],
        colors: ["#e84545", "#903749"],
        chart: {
            id: "area-datetime",
            type: "area",
            stacked: false,
            background: "#2b2e4a",
            fontFamily: "Open Sans, sans-serif",
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: true,
            textAnchor: "end",
            style: {
                colors: ["#903749"]
            }
        },
        title: {
            text: empresaSeleccionada,
            align: "left",
            style: {
                color: "#FFF"
            }
        },
        subtitle: {
            text: "Movimiento de precios",
            align: "left",
            style: {
                color: "#FFF"
            }
        },
        tooltip: {
            enabled: true
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: "#FFF"
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#FFF"
                }
            }
        },
        fill: {
            colors: "#903749"
        },
        stroke: {
            colors: ["#e84545"]
        }
    }
    var chart = new ApexCharts(document.querySelector("#chart"), options)
    chart.render()
})

function actualizarGrafica(chart, datos, nombreEmpresa){
    chart.updateOptions({
        series: [{
            name: nombreEmpresa,
            data: datos[nombreEmpresa]
        }],
        title: {
            text: nombreEmpresa
        }
    })
}

function setInfoDinamica(nombreEmpresa, precioAccion, acciones){
    console.log(acciones)
    $("#precioAccion").text("Precio actual: " + precioAccion)
    $(".transaccion").attr("value", nombreEmpresa)

    nombreEmpresa = nombreEmpresa.split(".").join("")
    if(!acciones[nombreEmpresa]){
        $("#numeroAcciones").text("Numero de acciones: "+0)
    }else{
        $("#numeroAcciones").text("Numero de acciones: "+acciones[nombreEmpresa])
    }
    
}