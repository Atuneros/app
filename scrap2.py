from bs4 import BeautifulSoup
import requests
import pymongo
import json

url = "https://www.bolsamania.com/indice/IBEX-35/noticias"
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')

articulos = soup.find_all("article")
noticias = []


for var in articulos:
    links = var.find("a")
    titulo = links.text
    href = links["href"]
    cuerpo = var.find("p")
    if cuerpo and titulo:
        noticias.append({"titulo": titulo, "link": href, "cuerpo": cuerpo.text})


client = pymongo.MongoClient("mongodb://admin:password@localhost:7070/bolsa")

db = client["bolsa"]
col = db["noticias"]

for x in range(3):
    col.insert_one(noticias[x])
