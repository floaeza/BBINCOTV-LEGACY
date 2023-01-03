
from email.mime import multipart
import os
from pathlib import Path
from selectors import EpollSelector
import sys
from bs4 import BeautifulSoup
# import urllib.request
import urllib.request as urllib2
import pymysql
import re
from pyffmpeg import FFmpeg

cookies = dict(language='us')
intento1 = 0
intento2 = 0
while True:
    os.system('clear')
    if intento1 < 3:
        type = input("Insert 1 to add a serie, 2 for a movie or 3 for generate thumbnail: ")
        type = int(type)
    else:
        type = input("Bro, are u stupid?, insert 1 to add a serie, 2 for a movie or 3 for generate thumbnail: ")
        type = int(type)
    if type== 1 or type == 2 or type == 3:
        break
    else:
        intento1+=1

while True:
    os.system('clear')
    if type == 1:
        add = input("Insert 1 to add a new serie or 2 for episodes of a serie: ")
        add = int(add)
        if add == 1:
            add ="SerieNueva"
            break
        elif add == 2:
            add ="SerieExistente"
            break
        else:
            add = ""
    elif type == 2: 
        break
    elif type == 3:
        break
            

while True:
    os.system('clear')
    print(type)
    link = input("Insert the link of the content: ")
    if type == 1 or type == 2:
        try:
            opener = urllib2.build_opener()
            opener.addheaders = [('User-agent', 'Mozilla/5.0')]
            datos = opener.open(link.strip()).read()
            # datos = urllib.request.urlopen(link.strip()).read().decode()
            break
        except:
            print("Could not read link: ", link)
    if type == 3:
        contenido = os.listdir(link)
        temporadas = []
        for fichero in contenido:
            if os.path.isdir(os.path.join(link, fichero)):
                temporadas.append(link + "/" + fichero)
        for temporada in temporadas:
            files = os.listdir(temporada)
            arch = []
            for file in files:
                if os.path.isfile(os.path.join(temporada, file)) and file.endswith('.mkv'):
                    arch.append(temporada + "/" + file)
            for capitulo in arch:
                img_output_path = Path(temporada + "/" + os.path.basename(capitulo).split('.')[0]+".png").absolute()
                src_video_path = Path(capitulo).absolute() 
                command = f"yes | ffmpeg -i \"{src_video_path}\" -filter:v scale=480:-1 -ss 00:03:00.000 -vframes 1 \"{img_output_path}\""
                os.system(command)
        break
        
        
        

if type == 1:
    if add == "SerieNueva":
        existe=False
        opener = urllib2.build_opener()
        opener.addheaders = [('User-agent', 'Mozilla/5.0')]
        opener.addheaders.append(('Cookie', 'lc-main=en_US'))
        datos = opener.open(link.strip()).read()
        #datos = urllib.request.urlopen(link.strip()).read().decode()
        soup =  BeautifulSoup(datos, 'html.parser',)
        # print(soup.prettify())
        title = soup.find("h1", {"data-testid": "hero-title-block__title"})
        title = title.text

        connection = pymysql.connect(user='root', passwd='Bbinco1.0', host='10.0.3.10', database='BBINCOTV_207',autocommit=True)
        cursor = connection.cursor()
        query = ("SELECT nombre_serie, id_series, folder_serie FROM vod_series")
        #try:
        cursor.execute(query)
        result = list(cursor.fetchall())
        for res in result:
            if title == res[0]:
                print(title+ " Ya existe!")
                existe = True
                break
                
        if existe == False:
            folder = str(int(result[-1][2][1:])+1)
            for i in range(len(folder),5):
                folder = "0" + folder

            desc = soup.find("span", {"data-testid": "plot-l"})
            desc = desc.text
            calificacion = soup.find("span", {"class": "sc-7ab21ed2-1 jGRxWM"})
            calificacion = calificacion.text
            
            
            meta = soup.find("ul", {"data-testid": "hero-title-block__metadata"})
            metadata = meta.findAll("li", {"class": "ipc-inline-list__item"})
        
            year = metadata[1].a.text.split("–")[0]

            clasificacion = metadata[len(metadata)-2].a.text
        
            print("Title: "+title)
            print("Description: " + desc)
            print("Year: " + year)
            print("Rating: " + calificacion)
            print("Class: " +clasificacion)
            connection = pymysql.connect(user='root', passwd='Bbinco1.0', host='10.0.3.10', database='BBINCOTV_207',autocommit=True)
            cursor = connection.cursor()
            query = ("INSERT INTO vod_series (nombre_serie, descripcion_serie, year, calificacion, clasificacion, numero_temporadas, nombre_poster, folder_serie, show_in_banner) VALUES (\""+title+"\", \""+desc+"\", " + year + ", \"" + calificacion + "\", \""+clasificacion+ "\", 1, \"poster.png\",\"S"+ folder +"\" , 0)")
            #try:
            cursor.execute(query)
            connection.commit()
            cursor.close()
            connection.close()
            result = list(cursor.fetchall())
        
            print(result)
    else:
        existe=False
        first = True
        while True:
            # datos = urllib.request.urlopen(link.strip()).read().decode()
            opener = urllib2.build_opener()
            opener.addheaders = [('User-agent', 'Mozilla/5.0')]
            opener.addheaders.append(('Cookie', 'lc-main=en_US'))
            datos = opener.open(link.strip()).read()

            soup =  BeautifulSoup(datos, 'html.parser')

            if first == True:
                first = False
               
                serie = soup.find("a", {"data-testid": "hero-title-block__series-link"})   
                serie = serie.text
                connection = pymysql.connect(user='root', passwd='Bbinco1.0', host='10.0.3.10', database='BBINCOTV_207',autocommit=True)
                cursor = connection.cursor()
                query = ("SELECT nombre_serie, id_series, folder_serie FROM vod_series")
                cursor.execute(query)
                result = list(cursor.fetchall())
                for res in result:
                    if serie == res[0]:
                        print(serie+ " Ya existe!")
                        existe = True
                        id_serie = res[1]
                        break
                if existe == False:
                    print("Please add this serie to your database.")
                    break
            
            title = soup.find("h1", {"data-testid": "hero-title-block__title"})
            title = title.text

            desc = soup.find("span", {"data-testid": "plot-l"})
            desc = desc.text

            episode = soup.find("div", {"data-testid": "hero-subnav-bar-season-episode-numbers-section"})
            episode = episode.text.split(".")[1]
            episode = episode[1:]
            season = soup.find("div", {"data-testid": "hero-subnav-bar-season-episode-numbers-section"})
            season = season.text.split(".")[0]
            season = season[1:]
            connection = pymysql.connect(user='root', passwd='Bbinco1.0', host='10.0.3.10', database='BBINCOTV_207',autocommit=True)
            cursor = connection.cursor()
            query = ("SELECT id_serie, numero_capitulo, temporada FROM vod_series_capitulos")
            cursor.execute(query)
            result = list(cursor.fetchall())                     

            ex = False
            for res in result:
                if int(id_serie) == int(res[0]) and int(episode) == int(res[1]) and int(season) == int(res[2]):
                    print("DENTRO DEL IF " +str(res[0]) + " " +str(res[1]) + "  " + str(res[2]))   
                    ex = True                 
                    break
            if ex ==True:
                link = soup.find("a", {"title": "Next episode"})
                if link is None:
                    break
                link = "https://www.imdb.com"+link['href']
                continue

            score = soup.find("div", {"data-testid": "hero-rating-bar__aggregate-rating__score"})
            score = score.text.split("/")[0]

            meta = soup.find("ul", {"data-testid": "hero-title-block__metadata"})
            metadata = meta.findAll("li", {"class": "ipc-inline-list__item"}) 
            
            try:
                clasificacion = metadata[1].a.text
            except:
                clasificacion = "TV-MA"
                
            duracion = soup.find("li", {"data-testid": "title-techspec_runtime"})
            duracion = duracion.find("div", {"class": "ipc-metadata-list-item__content-container"})
            
            duracion = duracion.text
            if "hour" in duracion:
                duracion = duracion.replace("hours", "h")
                duracion = duracion.replace("hour", "h")
                if "minute" in duracion:
                    duracion = duracion.replace("minutes", "m")
                    duracion = duracion.replace("minute", "m")
                    duracion = duracion.split(" ")
                    hours = duracion[0]+duracion[1]
                    minutes = duracion[2]+duracion[3]
                    duracion_capitulo = hours + " " + minutes
                    duracion_minutos = (int(duracion[0])*60)+int(duracion[2])
                else:
                    duracion = duracion.replace("minutes", "m")
                    duracion = duracion.replace("minute", "m")
                    duracion = duracion.split(" ")
                    hours = duracion[0]+duracion[1]
                    minutes = "0m"
                    duracion_capitulo = hours + " " + minutes
                    duracion_minutos = (int(duracion[0])*60)
            else:
                duracion = duracion.replace("minutes", "m")
                duracion = duracion.replace("minute", "m")
                duracion = duracion.split(" ")
                minutes = duracion[0]+duracion[1]
                duracion_capitulo = "0h" + " " + minutes
                duracion_minutos = int(duracion[0])
            
            print("E" +episode + "  " + "S"+season + " Añadido")
            connection = pymysql.connect(user='root', passwd='Bbinco1.0', host='10.0.3.10', database='BBINCOTV_207',autocommit=True)
            cursor = connection.cursor()
            query = ("INSERT INTO vod_series_capitulos (temporada, id_serie, nombre_capitulo, numero_capitulo, descripcion_capitulo, duracion_minutos, duracion_capitulo, calificacion) VALUES ("+str(season)+", "+str(id_serie)+", \"" + title + "\", " + str(episode) + ", \""+desc+ "\", \""+ str(duracion_minutos)+"\" , \""+ duracion_capitulo +"\",\""+ score+"\")")
            #try:
            cursor.execute(query)
            connection.commit()
            cursor.close()
            connection.close()
            link = soup.find("a", {"title": "Next episode"})
            concon = True
            if link is None:
                break
            link = "https://www.imdb.com"+link['href']            
            