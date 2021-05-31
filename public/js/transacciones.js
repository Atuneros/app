let datos_grafica = []
for (x in data){
    var date = new Date(data[x].createdAt)
    var horas = date.getHours()
    var minutos = date.getMinutes()
    var temp

    if(String(horas).length < 2){
        horas = String(0) + String(horas)
    }
    if(String(minutos).length < 2){
        minutos = String(0) + String(minutos)
    }
    var simbolo = ""
    var clase = "verde"
    if(data[x].movimiento.toLowerCase() == "compra"){
        simbolo = "-"
        clase = "rojo"
        temp = -Math.abs(data[x].acciones*data[x].valor)
    }else{
        temp = Math.abs(data[x].acciones*data[x].valor)
    }
    datos_grafica.push((temp).toFixed(2))
    $("#transacciones tr:last").after("<tr><td>"+data[x].empresa+"</td><hr><td class='derecha'>"+data[x].acciones+"</td><td class='derecha'>"+data[x].valor+"</td><td class='derecha'>"+data[x].movimiento+"</td><td class='derecha'>"+date.getDate()+"-" + (date.getMonth()+1) + "-"+date.getFullYear()+" "+horas+":"+minutos+"</td><td class='derecha "+clase+"'>"+simbolo+(data[x].acciones*data[x].valor).toFixed(2)+"</td></tr>")

}
console.log(datos_grafica)
$("#cartera").text("Cartera: "+cartera.toFixed(2)+" €")

var options = {
    series: [{
        name: "Cartera",
        data: datos_grafica
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
        text: "Movimiento cartera",
        align: "left",
        style: {
            color: "#FFF"
        }
    },
    subtitle: {
        align: "left",
        style: {
            color: "#FFF"
        }
    },
    tooltip: {
        enabled: false
    },
    xaxis: {
        labels: {
            show: false,
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

$("#link").submit(function( event ) {
    $("#loading_img").css("visibility", "visible")
});