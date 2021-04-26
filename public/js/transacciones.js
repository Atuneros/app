var total = 0
for (x in data){
    var date = new Date(data[x].createdAt)
    var horas = date.getHours()
    var minutos = date.getMinutes()
    if(String(horas).length < 2){
        horas = String(0) + String(horas)
    }
    if(String(minutos).length < 2){
        minutos = String(0) + String(minutos)
    }
    var simbolo = ""
    if(data[x].movimiento.toLowerCase() == "venta"){
        total += data[x].valor*data[x].acciones
    }else{
        simbolo = "-"
        total -= data[x].valor*data[x].acciones
    }
    $("#transacciones tr:last").after("<tr><td>"+data[x].empresa+"</td><hr><td class='derecha'>"+data[x].acciones+"</td><td class='derecha'>"+data[x].valor+"</td><td class='derecha'>"+data[x].movimiento+"</td><td class='derecha'>"+date.getDate()+"-" + (date.getMonth()+1) + "-"+date.getFullYear()+" "+horas+":"+minutos+"</td><td class='derecha'>"+simbolo+(data[x].acciones*data[x].valor).toFixed(2)+"</td></tr>")

}
$("#cartera").text("Cartera: "+total.toFixed(2)+" €")