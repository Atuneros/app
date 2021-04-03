$(function() {

    var empresaSeleccionada
    var precioAccion
    var nombresEmpresas = []
    var datosEstructurados = {}

    data.forEach(element => {
        nombresEmpresas.push(element["nombre"])
    })

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

    setInfoDinamica(empresaSeleccionada, precioAccion)
    

    $("#empresas").on('change', function() {
        empresaSeleccionada = $(this).val()
        precioAccion = datosEstructurados[empresaSeleccionada][datosEstructurados[empresaSeleccionada].length-1][1]

        actualizarGrafica(chart, datosEstructurados, empresaSeleccionada)
        setInfoDinamica(empresaSeleccionada, precioAccion)       
    });

    var options = {
        series: [{
            name: empresaSeleccionada,
            data: datosEstructurados[empresaSeleccionada]
        }],
        chart: {
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
            text: empresaSeleccionada,
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

function setInfoDinamica(nombreEmpresa, precioAccion){
    $("#precioAccion").text("Precio actual: " + precioAccion)
    $("#comprar").attr("name", nombreEmpresa)
    $("#vender").attr("name", nombreEmpresa)
}