var acciones
$(function() {

    var empresaSeleccionada
    var empresaSeleccionada2
    var precioAccion
    var nombresEmpresas = []
    var datosEstructurados = {}

    $("#cartera").text("Cartera: "+cartera.toFixed(2)+" €")

    data[0].forEach(element => {
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
            timeout: 3000,
            success: function(data){
                $("#cartera").text("Cartera: "+data.cartera.toFixed(2)+" €")
                acciones = data.acciones
                setInfoDinamica(empresaSeleccionada, precioAccion, data.acciones, datosEstructurados)
                $("#comprar").prop("disabled", false)
            },
            error: function(err){
                $("#comprar").prop("disabled", false)
                alert("Indica un número correcto de acciones")
            }
        })
    })

    $("#formVender").submit(function(e) {
        e.preventDefault() 
        $("#vender").prop("disabled", true)

        var form = $(this)
        var url = form.attr("action")

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            timeout: 3000,
            success: function(data){
                $("#cartera").text("Cartera: "+data.cartera.toFixed(2)+" €")
                acciones = data.acciones
                setInfoDinamica(empresaSeleccionada, precioAccion, data.acciones, datosEstructurados)
                $("#vender").prop("disabled", false)
            },
            error: function(err){
                $("#vender").prop("disabled", false)
                alert("No tienes suficientes acciones de esta empresa")
            }
        })  
    })

    nombresUnicosEmpresas = Array.from(new Set(nombresEmpresas))
    nombresUnicosEmpresas.sort()

    nombresUnicosEmpresas.forEach(element => {
        $("#empresas").append(new Option(element))
        $("#empresas2").append(new Option(element))
    })

    nombresUnicosEmpresas.forEach(nombreEmpresa => {
        datosEstructurados[nombreEmpresa] = []
        data[0].forEach(element => {
            if(nombreEmpresa == element["nombre"])
                datosEstructurados[nombreEmpresa].push([new Date(element["fecha"].substr(3, 2)+"/"+element["fecha"].substr(0, 2)+"/"+element["fecha"].substr(6, 4)+" GMT"), element["ultimo"]])
        })
    })
    empresaSeleccionada = nombresUnicosEmpresas[0]
    empresaSeleccionada2 = nombresUnicosEmpresas[0]
    
    precioAccion = datosEstructurados[empresaSeleccionada][datosEstructurados[empresaSeleccionada].length-1][1]
    setInfoDinamica(empresaSeleccionada, precioAccion, acciones, datosEstructurados)
    compararDias(datosEstructurados, empresaSeleccionada)
    setNoticias(data[1])

    $("#empresas").on("change", function() {
        empresaSeleccionada = $(this).val()
        precioAccion = datosEstructurados[empresaSeleccionada][datosEstructurados[empresaSeleccionada].length-1][1]
        compararDias(datosEstructurados, empresaSeleccionada)
        actualizarGrafica(chart, datosEstructurados, empresaSeleccionada, empresaSeleccionada2)
        setInfoDinamica(empresaSeleccionada, precioAccion, acciones, datosEstructurados)       
    });

    $("#empresas2").on("change", function() {
        empresaSeleccionada2 = $(this).val()     
        actualizarGrafica(chart, datosEstructurados, empresaSeleccionada, empresaSeleccionada2)
    });

    $("#empresas2").hide()

    $("#comparar").click(function(){
        if($("#empresas2").is(":visible")){
            
            chart.updateOptions({
                series: [{
                    name: empresaSeleccionada,
                    data: datosEstructurados[empresaSeleccionada]
                }],
                title: {
                    text: empresaSeleccionada
                }
            })
            $("#comparar").text("Comparar")
            $("#empresas2").hide("slow", function(){
            })
        }else{
            chart.updateOptions({
                series: [{
                    name: empresaSeleccionada,
                    data: datosEstructurados[empresaSeleccionada]
                },{
                    name: empresaSeleccionada2,
                    data: datosEstructurados[empresaSeleccionada2]
                }],
                title: {
                    text: "Comparativa " + empresaSeleccionada + " con " + empresaSeleccionada2
                }
            })
            $("#comparar").text("Dejar de comparar")
            $("#empresas2").show("slow", function(){
            })
            
        }
    })

    var options = {
        series: [{
            name: empresaSeleccionada,
            data: datosEstructurados[empresaSeleccionada]
        }],
        colors: ["#e84545", "#ff7a00"],
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
                colors: ["#903749", "#e84545"]
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
            colors: ["#903749", "#ff7a00"]
        },
        stroke: {
            colors: ["#e84545", "#ff7a00"]
        },
        legend: {
            labels: {
                useSeriesColors: true
            }
        }
    }
    var chart = new ApexCharts(document.querySelector("#chart"), options)
    chart.render()
})

function actualizarGrafica(chart, datos, nombreEmpresa, nombreEmpresa2){
    if($("#empresas2").is(":visible")){
        chart.updateOptions({
            series: [{
                name: nombreEmpresa,
                data: datos[nombreEmpresa]
            },{
                name: nombreEmpresa2,
                data: datos[nombreEmpresa2]
            }],
            title: {
                text: "Comparativa " + nombreEmpresa + " con " + nombreEmpresa2
            }
        })
    }else{
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
}

function setInfoDinamica(nombreEmpresa, precioAccion, acciones, datosEstructurados){
    $("#numeroAcciones").html("<tr><th class='izquierda'>Empresa</th><th>Acciones</th><th class='derecha'>%</th></tr>")
    $("#precioAccion").text("Precio actual: " + precioAccion)
    $(".transaccion").attr("value", nombreEmpresa)
    $(".valorTransaccion").attr("value", precioAccion)
    for (x in datosEstructurados){
        var diferencia = ((datosEstructurados[x][datosEstructurados[x].length-1][1]-datosEstructurados[x][datosEstructurados[x].length-2][1])/datosEstructurados[x][datosEstructurados[x].length-2][1]*100).toFixed(2)
        var tdDiferencia
        if(diferencia>0){
            tdDiferencia = "<td class='derecha verde'>"+diferencia+"</td>"
        }else{
            tdDiferencia = "<td class='derecha rojo'>"+diferencia+"</td>"
        }
        
        var flag = false
        var nombre = x.split(".").join("")
        for (y in acciones){
            console.log
            if (nombre == y){
                flag = true
            }
        }

        

        if(flag){
            $("#numeroAcciones").append("<tr><td class='izquierda'>"+nombre+"</td><td class='centro'>"+acciones[nombre]+"</td>"+tdDiferencia+"</tr>")
        }else{
            $("#numeroAcciones").append("<tr><td class='izquierda'>"+nombre+"</td><td class='centro'>"+0+"</td>"+tdDiferencia+"</tr>")
        }
    } 
}

function setNoticias(data){
    for (x in data){
        $("#news").append("<div><a target='_blank' href='"+data[x].link+"'>"+data[x].titulo+"</a><p>"+data[x].cuerpo+"</p>")
    }
}

function compararDias(datosEstructurados, empresaSeleccionada){
    var diferencia = datosEstructurados[empresaSeleccionada][datosEstructurados[empresaSeleccionada].length-1][1]-datosEstructurados[empresaSeleccionada][datosEstructurados[empresaSeleccionada].length-2][1]
    if(diferencia > 0){
        $("#imgComprar").css("opacity", "0")
        $("#imgVender").css("opacity", "1")
    }else{
        $("#imgVender").css("opacity", "0")
        $("#imgComprar").css("opacity", "1")
    }
}