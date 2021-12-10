from bs4 import BeautifulSoup
import requests
import pymongo
import json

url = 'https://www.bolsamadrid.es/esp/aspx/Mercados/Precios.aspx?indice=ESI100000000&punto=indice'
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')

tabla = soup.find(id='ctl00_Contenido_tblAcciones')
filas = tabla.findAll('tr')

empresasDict = {}
hora = {}

for row in filas[1:]:
    datos_html = row.find_all("td")
    datos_fila = list(map(lambda data: data.text, datos_html))

    nombre = datos_fila[0]
    fecha = datos_fila[7]
    hora[str(nombre)] = datos_fila[8]

    empresasDict[str(nombre)] = {
        "nombre": nombre,
        "fecha": fecha,
        "hora": str(hora[str(nombre)]),
        "ultimo": float(datos_fila[1].replace(",", ".")),
        "%dif": float(datos_fila[2].replace(",", ".")),
        "max": float(datos_fila[3].replace(",", ".")),
        "min": float(datos_fila[4].replace(",", ".")),
        "volumen": int(datos_fila[5].replace(".", "")),
        "efectivo": float(datos_fila[6].replace(".", "").replace(",", "."))
    }



client = pymongo.MongoClient("mongodb://admin:password@localhost:7070/bolsa")

db = client["bolsa"]
col = db["empresas"]
col2 = db["datos"]

for key in empresasDict:
    col.insert_one(empresasDict[key])
    col2.insert_one(empresasDict[key])
