#!/usr/bin/env python
# -*- coding: ascii -*-
from datetime import datetime
from datetime import timedelta
import pathlib
from bs4 import BeautifulSoup
import urllib.request
import json
import psutil
import requests
from os import listdir
from os.path import isfile, isdir
import os, fnmatch
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage

iplocal = '10.0.3.9'
today = datetime.today()
today = today
listDays = ["", "", "", "", "", "", "","", "", "", ""]

cred = credentials.Certificate('/var/www/config/soportes-bbinco-5f32cdb2f0a4.json')
firebase_admin.initialize_app(cred, { 'storageBucket': 'soportes-bbinco.appspot.com' })
bucket = storage.bucket()
db = firestore.client()
Guidesdb = db.collection(u'VDM').document(u'Guias')

payload = {'Option': 'GetIdentifier'}
Identifier = requests.post('http://'+iplocal+'/BBINCO/TV1/Core/Controllers/PY.php', data=payload)
IDF = json.loads(Identifier.content)
IDF = IDF[0]


def find(pattern, path):
    result = []
    for root, dirs, files in os.walk(path):
        for name in files:
            if fnmatch.fnmatch(name, pattern):
                result.append(os.path.join(root, name))
    return result
def ls1(path):    
    return [obj for obj in listdir(path) if isfile(path + obj)]

files = ls1('/var/www/html/BBINCO/TV1/Core/Controllers/Epg/' + IDF['IDF']+'/')

DaysToDelete = datetime.strptime(today.strftime('%Y%m%d'),'%Y%m%d')
DaysToDelete = DaysToDelete - timedelta(days=1)
#print(files)
for i in range(10):
    DaysToDelete = DaysToDelete - timedelta(days=1)
    #print(archivo)
    for archivo in files:
        if ('epg_'+DaysToDelete.strftime('%Y%m%d')+'_') in str(archivo):
            file_path = '/var/www/html/BBINCO/TV1/Core/Controllers/Epg/'+IDF['IDF']+'/'+archivo
            os.unlink(file_path)
            print(archivo)
        else:
            continue
for n in range(7):
    listDays[n] = today.strftime("%Y-%m-%d")
    today = today + timedelta(days=1)

####Numero de paquetes + 1#########
payload = {'Option': 'GetAllPackages'}
Pack = requests.post('http://'+iplocal+'/BBINCO/TV1/Core/Controllers/Packages.php', data=payload)
Packages = json.loads(Pack.content)

def start(day, pos):
    try:
        dataProgram = {}
        day = datetime.strptime(day, '%Y-%m-%d')
        print("Empezo")
        
        payload = {'Option': 'GetVersion'}
        Version = requests.post('http://'+iplocal+'/BBINCO/TV1/Core/Controllers/PY.php', data=payload)
        Ver = json.loads(Version.content)
        Ver = Ver[0]
        
        payload = {'Option': 'GetOffsetZone'}
        Zone = requests.post('http://'+iplocal+'/BBINCO/TV1/Core/Controllers/PY.php', data=payload)
        OffSetZone = json.loads(Zone.content)
        OffSetZone = OffSetZone[0]

        payload = {'Option': 'GetGatoTime'}
        GTime = requests.post('http://'+iplocal+'/BBINCO/TV1/Core/Controllers/PY.php', data=payload)
        GatoTime = json.loads(GTime.content)
        GatoTime = GatoTime[0]
        for Package in Packages:
            contadorCanal = 0
            data = {}
            data["C_Length"]=0

            #######################################################################################################
            ############################################ CANAL DIGITAL ############################################
            #######################################################################################################


            payload = {'Option': 'GetModulesBypackage', 'PackageID': int(Package["id_paquete"])}
            x = requests.post('http://'+iplocal+'/BBINCO/TV1/Core/Controllers/PY.php', data=payload)
            channels = json.loads(x.content)
            for channel in channels:
                dataProgradm = {}
                dataProgradm['0'] = []
                dataProgradm['0'].append({
                    "STTN": channel['STTN'],
                    "DBKY": '',
                    "TTLE": channel['NAME'],
                    "DSCR": '',
                    "DRTN": 24,
                    "MNTS": 1440,
                    'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                    "STRH": "00:00",
                    "FNLH": "24:00",
                    "TVRT": '',
                    "STRS": '',
                    "EPSD": ''
                })
                data[str(contadorCanal)] = []
                data[str(contadorCanal)].append({
                    'PSCN': channel['PSCN'],
                    'ADIO': channel['ADIO'],
                    'PRGM': channel['PRGM'],
                    'SRCE': channel['SRCE'],
                    'QLTY': channel['QLTY'],
                    'PORT': channel['PORT'],
                    'CHNL': channel['CHNL'],
                    'STTN': channel['STTN'],
                    'NAME': channel['NAME'],
                    'INDC': channel['INDC'],
                    'LOGO': channel['LOGO'],
                    'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                    'PROGRAMS': dataProgradm,
                    'P_Length': 1
                })
                contadorCanal = contadorCanal + 1
                dataProgram.clear()


            #######################################################################################################
            ############################################# PROGAMACION #############################################
            #######################################################################################################
            payload = {'Option': 'GetChannelsInfoBypackage', 'PackageID': int(Package["id_paquete"])}
            x = requests.post('http://'+iplocal+'/BBINCO/TV1/Core/Controllers/PY.php', data=payload)
            channels = json.loads(x.content)
            #print(channels)
            Guidesdb.update({
                'archivo': 'epg_'+day.strftime("%Y%m%d") + '_' + str(Package["id_paquete"]) + '.json'
            })
            a = 0
            for channel in channels:
                a = a + 1
                os.system("clear") 
                print(os.getpid())
                print("Generando: ", 'epg_'+day.strftime("%Y%m%d") + '_' + str(Package["id_paquete"]) + '.json       ',"{:.2f}".format((a*100)/len(channels)), " %")
                print(channel['NAME'])
                
                #if int("{:.0f}".format((a*100)/len(channels))) % 2 == 0:
                #    Guidesdb.update({
                #        'porcentajeGenerado': "{:.2f}".format((a*100)/len(channels))
                #    })
                #print("Archivos restantes: ", (paquetes-ids)*(len(listDays)-pos))
                #print(channel)
                
                if 'GATO' in channel['STTN']:
                    dataProgramGato = {}
                    print('GATO TV')
                    P_Length = 0
                    try:
                        raw_html = urllib.request.urlopen('https://www.gatotv.com/canal/' + channel['NAME'] + day.strftime(
                            "%Y-%m-%d")).read().decode()
                        raw_html.encode('utf-8')
                        soup = BeautifulSoup(raw_html, 'html.parser')

                        prueba = soup.find('table', class_='tbl_EPG')

                        lista1 = prueba.find_all('tr', class_=['tbl_EPG_row', 'tbl_EPG_row_selected','tbl_EPG_rowAlternate'])
                        parttwo = False
                        lista = []
                        dif = GatoTime['Time']
                        if int(dif)!=0:
                            parttwo = True

                        horainicio = datetime.strptime("0"+dif+":00","%H:%M")
                        primero = True
                        for list in lista1:
                            try:
                                emicion = list.find_all('time')
                                inicio = datetime.strptime(emicion[0]['datetime'], "%H:%M")
                                fin = datetime.strptime(emicion[1]['datetime'], "%H:%M")
                                if (fin > horainicio) or primero == False:
                                    if primero:
                                        inicio = horainicio
                                        primero = False

                                    title1 = list.find('span')
                                    title1 = title1.get_text()
                                    tds = list.find_all('td')
                                    if fin >= datetime.strptime("01:00","%H:%M") and lista1.index(list) == len(lista1)-1:
                                        fin = datetime.strptime("00:59","%H:%M")
                                        parttwo = False
                                    if lista1.index(list) == len(lista1)-1 and parttwo == False:
                                        fin = datetime.strptime("24:00", "%H:%M")
                                    inicio = inicio - timedelta(hours=int(dif))
                                    fin = fin - timedelta(hours=int(dif))
                                    dur = fin - inicio
                                    if len(tds) == 3 and (inicio.strftime("%H:%M") != fin.strftime("%H:%M")):
                                        lista.append({
                                            'inicio': inicio.strftime("%H:%M"),
                                            'fin': fin.strftime("%H:%M"),
                                            'durh': float("{:.2f}".format((int(dur.seconds)/60)/60)),
                                            'durm': (int(dur.seconds)/60),
                                            'title': title1,
                                            'desc' : ''
                                        })
                                    elif len(tds) == 4 and (inicio.strftime("%H:%M") != fin.strftime("%H:%M")):
                                        desc = tds[3].get_text().split('\n\n\n')
                                        lista.append({
                                            'inicio': inicio.strftime("%H:%M"),
                                            'fin' : fin.strftime("%H:%M"),
                                            'durh' : float("{:.2f}".format((int(dur.seconds) / 60) / 60)),
                                            'durm' : (int(dur.seconds) / 60),
                                            'title' : title1,
                                            'desc' : desc[2]
                                        })
                                else:
                                    continue
                            except:
                                break
                        if int(dif)!=0 and parttwo == True:
                            tom = day + timedelta(days=1)
                            raw_html = urllib.request.urlopen('https://www.gatotv.com/canal/' + channel['NAME'] + tom.strftime(
                            "%Y-%m-%d")).read().decode()
                            raw_html.encode('utf-8')
                            soup = BeautifulSoup(raw_html, 'html.parser')

                            prueba = soup.find('table', class_='tbl_EPG')
                            brea = False
                            lista1 = prueba.find_all('tr', class_=['tbl_EPG_row', 'tbl_EPG_row_selected', 'tbl_EPG_rowAlternate'])
                            primero = True
                            for list in lista1:
                                if brea:
                                    break
                                emicion = list.find_all('time')
                                inicio = datetime.strptime(emicion[0]['datetime'], "%H:%M")
                                fin = datetime.strptime(emicion[1]['datetime'], "%H:%M")
                                if inicio == (datetime.strptime(lista[-1]['inicio'], "%H:%M") + timedelta(hours=int(dif))) and fin == (datetime.strptime(lista[-1]['fin'], "%H:%M") + timedelta(hours=int(dif))):
                                    continue
                                if primero:
                                    inicio = datetime.strptime(lista[-1]['fin'], "%H:%M")+ timedelta(hours=int(dif))
                                    primero = False
                                if fin > horainicio:
                                    fin = horainicio
                                    brea = True
                                title1 = list.find('span')
                                title1 = title1.get_text()
                                tds = list.find_all('td')
                                inicio = inicio - timedelta(hours=int(dif))
                                fin = fin - timedelta(hours=int(dif))
                                dur = fin - inicio
                                print("entre")
                                if len(tds) == 3 and (inicio.strftime("%H:%M") != fin.strftime("%H:%M")):
                                    lista.append({
                                        'inicio': inicio.strftime("%H:%M"),
                                        'fin': fin.strftime("%H:%M"),
                                        'durh': float("{:.2f}".format((int(dur.seconds)/60)/60)),
                                        'durm': (int(dur.seconds)/60),
                                        'title': title1,
                                        'desc' : ''
                                    })
                                elif len(tds) == 4 and (inicio.strftime("%H:%M") != fin.strftime("%H:%M")):
                                    desc = tds[3].get_text().split('\n\n\n')
                                    lista.append({
                                        'inicio': inicio.strftime("%H:%M"),
                                        'fin' : fin.strftime("%H:%M"),
                                        'durh' : float("{:.2f}".format((int(dur.seconds) / 60) / 60)),
                                        'durm' : (int(dur.seconds) / 60),
                                        'title' : title1,
                                        'desc' : desc[2]
                                    })
                        for li in range(len(lista)):
                            dataProgramGato[str(li)] = []
                            dataProgramGato[str(li)].append({
                                "STTN": channel['STTN'],
                                "DBKY": '',
                                "TTLE": lista[li]['title'].replace("\"", "\'"),
                                "DSCR": lista[li]['desc'].replace("\"", "\'"),
                                "DRTN": lista[li]['durh'],
                                "MNTS": lista[li]['durm'],
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                "STRH": lista[li]['inicio'],
                                "FNLH": lista[li]['fin'],
                                "TVRT": '',
                                "STRS": '',
                                "EPSD": ''
                            })
                            P_Length += 1
                    except:
                        print(channel['NAME'] + "   No encontrado (GATO)")

                    if dataProgramGato != {}:
                        data[str(contadorCanal)] = []
                        data[str(contadorCanal)].append({
                            'PSCN': channel['PSCN'],
                            'ADIO': channel['ADIO'],
                            'PRGM': channel['PRGM'],
                            'SRCE': channel['SRCE'],
                            'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD' ,
                            'PORT': channel['PORT'],
                            'CHNL': channel['CHNL'],
                            'STTN': channel['STTN'],
                            'NAME': channel['NACH'],
                            'INDC': channel['INDC'],
                            'LOGO': channel['LOGO'],
                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                            'PROGRAMS': dataProgramGato,
                            'P_Length': P_Length
                        })
                    else:
                        dataProgradm = {}
                        dataProgradm['0'] = []
                        dataProgradm['0'].append({
                            "STTN": channel['STTN'],
                            "DBKY": '',
                            "TTLE": channel['NACH'],
                            "DSCR": '',
                            "DRTN": 24,
                            "MNTS": 1440,
                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                            "STRH": "00:00",
                            "FNLH": "24:00",
                            "TVRT": '',
                            "STRS": '',
                            "EPSD": ''
                        })
                        data[str(contadorCanal)] = []
                        data[str(contadorCanal)].append({
                            'PSCN': channel['PSCN'],
                            'ADIO': channel['ADIO'],
                            'PRGM': channel['PRGM'],
                            'SRCE': channel['SRCE'],
                            'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                            'PORT': channel['PORT'],
                            'CHNL': channel['CHNL'],
                            'STTN': channel['STTN'],
                            'NAME': channel['NACH'],
                            'INDC': channel['INDC'],
                            'LOGO': channel['LOGO'],
                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                            'PROGRAMS': dataProgradm,
                            'P_Length': 1
                        })
                    contadorCanal = contadorCanal + 1
                else:
                    ##############  TV PASSPORT ##############
                    if 'PASS' in channel['STTN']:
                        dataProgramPass = {}
                        P_Length = 0
                        dur=0
                        PASS = False
                        print('TV PASS')
                        daytwo = day - timedelta(days=1)
                        raw_html = urllib.request.urlopen(
                            'https://www.tvpassport.com/tv-listings/stations/' + channel['NAME'] + day.strftime(
                                "%Y-%m-%d")).read().decode()
                        raw_html.encode('utf-8')
                        soup = BeautifulSoup(raw_html, 'html.parser')

                        #################   UN DIA ATRAS    #################
                        raw_html2 = urllib.request.urlopen(
                            'https://www.tvpassport.com/tv-listings/stations/' + channel['NAME'] + daytwo.strftime(
                                "%Y-%m-%d")).read().decode()
                        raw_html2.encode('utf-8')
                        soup2 = BeautifulSoup(raw_html2, 'html.parser')
                        #################   UN DIA ATRAS    #################
                        
                        ## AJUSTAR GUIA  (VALORES NEGATIVOS PARA ADELANTAR Y POSITIVOS PARA ATRASAR) ## 
                        if channel['INDC']=='NBCE' or channel['INDC']=='CBSE':
                            ajustarHora = -1
                        else:
                            ajustarHora = 0;
                        try:
                            conta = 0
                            for i in range(1, 100):
                            

                                table = soup2.find(id="itemheader" + str(i))

                                if table == None:
                                    break
                                ini = datetime.strptime(table['data-listdatetime'], '%Y-%m-%d %H:%M:%S')
                                end = datetime.strptime(table['data-listdatetime'], '%Y-%m-%d %H:%M:%S') + timedelta(minutes=int(table['data-duration']))
                                                            
                                ini = ini + timedelta(hours=ajustarHora)   
                                end = end + timedelta(hours=ajustarHora) 

                                inimin = (int(ini.hour)*60)+int(ini.minute)
                                endmin = (int(end.hour)*60)+int(end.minute)
                                
                                if end <= datetime.strptime(day.strftime("%Y-%m-%d")+' 00:00:00', '%Y-%m-%d %H:%M:%S'):
                                    continue
                                if ini < datetime.strptime(day.strftime("%Y-%m-%d")+' 00:00:00', '%Y-%m-%d %H:%M:%S'):
                                    ini = datetime.strptime(day.strftime("%Y-%m-%d")+' 00:00:00', '%Y-%m-%d %H:%M:%S')

                                inimin = (int(ini.hour)*60)+int(ini.minute)
                                endmin = (int(end.hour)*60)+int(end.minute)

                                if inimin <= endmin:
                                    dur = endmin - inimin
                                else:
                                    dur = endmin - inimin
                                    dur = dur + 1440
                                
                                titles = ""
                                if table['data-showname'] == "Movie":
                                    titles = table['data-episodetitle']
                                else:
                                    titles = table['data-showname']

                                dataProgramPass[str(conta)] = []
                                dataProgramPass[str(conta)].append({
                                    "STTN": channel['STTN'],
                                    "DBKY": '',
                                    "TTLE": titles.replace("\"", "\'"),
                                    "DSCR": table['data-description'].replace("\"", "\'"),
                                    "DRTN": float("{:.2f}".format(dur / 60)),
                                    "MNTS": dur,
                                    'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                    "STRH": ini.strftime("%H:%M"),
                                    "FNLH": end.strftime("%H:%M"),
                                    "TVRT": table['data-rating'],
                                    "STRS": '',
                                    "EPSD": table['data-episodetitle'].replace("\"", "\'")
                                })
                                P_Length += 1
                                conta += 1
                            PASS = True
                        except:
                            print(channel['STTN'], '    No Encontrado (PASS1)')

                        if PASS:
                            try:
                                for i in range(1, 100):
                                    
                                    table = soup.find(id="itemheader" + str(i))
                                    if table == None:
                                        break
                                    ini = datetime.strptime(table['data-listdatetime'], '%Y-%m-%d %H:%M:%S')
                                    end = datetime.strptime(table['data-listdatetime'], '%Y-%m-%d %H:%M:%S') + timedelta(minutes=int(table['data-duration']))
                                    
                                    ini = ini + timedelta(hours=ajustarHora)
                                    end = end + timedelta(hours=ajustarHora)

                                    if ini > datetime.strptime(day.strftime("%Y-%m-%d")+' 23:59:59', '%Y-%m-%d %H:%M:%S'):
                                        break
                                    
                                    inimin = (int(ini.hour)*60)+int(ini.minute)
                                    endmin = (int(end.hour)*60)+int(end.minute)

                                    if end > datetime.strptime(day.strftime("%Y-%m-%d")+' 23:59:59', '%Y-%m-%d %H:%M:%S'):
                                        end = datetime.strptime(day.strftime("%Y-%m-%d")+' 23:59:59', '%Y-%m-%d %H:%M:%S')
                                        endmin = (int(end.hour)*60)+int(end.minute)

                                    if inimin <= endmin:
                                        dur = endmin - inimin
                                    else:
                                        dur = endmin - inimin
                                        dur = dur + 1440


                                    titles = ""
                                    if table['data-showname'] == "Movie":
                                        titles = table['data-episodetitle']
                                    else:
                                        titles = table['data-showname']

                                    dataProgramPass[str(conta)] = []
                                    dataProgramPass[str(conta)].append({
                                        "STTN": channel['STTN'],
                                        "DBKY": '',
                                        "TTLE": titles.replace("\"", "\'"),
                                        "DSCR": table['data-description'].replace("\"", "\'"),
                                        "DRTN": float("{:.2f}".format(dur / 60)),
                                        "MNTS": dur,
                                        'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                        "STRH": ini.strftime("%H:%M"),
                                        "FNLH": end.strftime("%H:%M"),
                                        "TVRT": table['data-rating'],
                                        "STRS": '',
                                        "EPSD": table['data-episodetitle'].replace("\"", "\'")
                                    })
                                    P_Length += 1
                                    conta += 1
                            except:
                                print(channel['STTN'], '    No Encontrado (PASS2)')

                        if dataProgramPass != {} and PASS:
                            data[str(contadorCanal)] = []
                            data[str(contadorCanal)].append({
                                'PSCN': channel['PSCN'],
                                'ADIO': channel['ADIO'],
                                'PRGM': channel['PRGM'],
                                'SRCE': channel['SRCE'],
                                'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                                'PORT': channel['PORT'],
                                'CHNL': channel['CHNL'],
                                'STTN': channel['STTN'],
                                'NAME': channel['NACH'],
                                'INDC': channel['INDC'],
                                'LOGO': channel['LOGO'],
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                'PROGRAMS': dataProgramPass,
                                'P_Length': P_Length
                            })
                        else:
                            if PASS:
                                dataProgramPass[str(conta)] = []
                                dataProgramPass[str(conta)].append({
                                    "STTN": channel['STTN'],
                                    "DBKY": '',
                                    "TTLE": table['data-showname'].replace("\"", "\'"),
                                    "DSCR": table['data-description'].replace("\"", "\'"),
                                    "DRTN": float("{:.2f}".format(dur / 60)),
                                    "MNTS": dur,
                                    'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                    "STRH": dataProgramPass[str(conta-1):"STRH"],
                                    "FNLH": '24:00',
                                    "TVRT": table['data-rating'],
                                    "STRS": '',
                                    "EPSD": table['data-episodetitle'].replace("\"", "\'")
                                })
                            else:
                                dataProgradm = {}
                                dataProgradm['0'] = []
                                dataProgradm['0'].append({
                                    "STTN": channel['STTN'],
                                    "DBKY": '',
                                    "TTLE": channel['NACH'].replace("\"", "\'"),
                                    "DSCR": '',
                                    "DRTN": 24,
                                    "MNTS": 1440,
                                    'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                    "STRH": "00:00",
                                    "FNLH": "24:00",
                                    "TVRT": '',
                                    "STRS": '',
                                    "EPSD": ''
                                })
                                data[str(contadorCanal)] = []
                                data[str(contadorCanal)].append({
                                    'PSCN': channel['PSCN'],
                                    'ADIO': channel['ADIO'],
                                    'PRGM': channel['PRGM'],
                                    'SRCE': channel['SRCE'],
                                    'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                                    'PORT': channel['PORT'],
                                    'CHNL': channel['CHNL'],
                                    'STTN': channel['STTN'],
                                    'NAME': channel['NACH'],
                                    'INDC': channel['INDC'],
                                    'LOGO': channel['LOGO'],
                                    'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                    'PROGRAMS': dataProgradm,
                                    'P_Length': 1
                                })
                        contadorCanal = contadorCanal + 1
                    else:
                        if 'VIDEO' in channel['STTN'] or 'AUDIO' in channel['STTN'] or 'LOCAL' in channel[
                            'STTN'] or 'CONTENT' in channel['STTN']:
                            print('VIDEO/AUDIO/LOCAL/CONTENT')
                            dataProgradm = {}
                            dataProgradm['0'] = []
                            dataProgradm['0'].append({
                                "STTN": channel['STTN'],
                                "DBKY": '',
                                "TTLE": channel['NACH'],
                                "DSCR": '',
                                "DRTN": 24,
                                "MNTS": 1440,
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                "STRH": "00:00",
                                "FNLH": "24:00",
                                "TVRT": '',
                                "STRS": '',
                                "EPSD": ''
                            })
                            data[str(contadorCanal)] = []
                            data[str(contadorCanal)].append({
                                'PSCN': channel['PSCN'],
                                'ADIO': channel['ADIO'],
                                'PRGM': channel['PRGM'],
                                'SRCE': channel['SRCE'],
                                'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                                'PORT': channel['PORT'],
                                'CHNL': channel['CHNL'],
                                'STTN': channel['STTN'],
                                'NAME': channel['NACH'],
                                'INDC': channel['INDC'],
                                'LOGO': channel['LOGO'],
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                'PROGRAMS': dataProgradm,
                                'P_Length': 1
                            })
                            contadorCanal = contadorCanal + 1
                            dataProgram.clear()
                        else:
                            print('TRIBIUNE     ', channel['STTN'])
                            TRITRI = False
                            dataProgramTri = {}
                            contadorPrograma = 0
                            deleteline(channel['STTN'], day)
                            statrec = open("/var/www/html/mnt/nv/epg/statrec.txt", "r", errors="ignore", encoding='ascii')
                            skedrec = open("/var/www/html/mnt/nv/epg/skedrec_copia.txt", "r", errors="ignore", encoding='ascii')
                            progrec = open("/var/www/html/mnt/nv/epg/progrec.txt", "r", errors="ignore", encoding='ascii')
                            lineasSkedrec = skedrec.readlines()
                            lineasProgrec = progrec.readlines()
                            statrec.close()
                            skedrec.close()
                            progrec.close()
                            dataProgram = {}
                            if channel['STTN'] == '10244' or channel['STTN'] == '16619' or channel['STTN'] == '10242' or channel['STTN'] == '12508':
                                off = '-9'
                            else:
                                off = OffSetZone['OZN']

                            for lineaSkedrec in lineasSkedrec:
                                listSkedrec = lineaSkedrec.split('|')

                                hinicio = datetime.strptime((listSkedrec[2] + " " + listSkedrec[3][0] + listSkedrec[3][1] + ":" + listSkedrec[3][2] + listSkedrec[3][3]), '%Y%m%d %H:%M')
                                duracion = datetime.strptime(listSkedrec[4][0] + listSkedrec[4][1]+':'+listSkedrec[4][2] + listSkedrec[4][3], '%H:%M')
                                
                                duracionh = duracion.strftime('%H')
                                duracionm = duracion.strftime('%M')
                                
                                hfin = hinicio + timedelta(hours=int(duracionh), minutes=int(duracionm))
                                hfin = hfin + timedelta(hours=int(off))
                                hinicio = hinicio + timedelta(hours=int(off))
                                ahora = datetime.strptime((day.strftime("%Y%m%d") + " 00:00"), '%Y%m%d %H:%M')
                                
                                duration = (int(duracionh) * 60) + int(duracionm)
                                durationh = duration/60
                                
                                if listSkedrec[0] == channel['STTN'] \
                                        and hinicio < (ahora + timedelta(hours=23, minutes=59)) \
                                        and (hfin > ahora):
                                    if hinicio < ahora:
                                        hinicio = ahora
                                    if hfin > (ahora + timedelta(hours=23, minutes=59)):
                                        hfin = ahora + timedelta(hours=23, minutes=59)

                                    inimin = (int(hinicio.hour) * 60) + int(hinicio.minute)
                                    finmin = (int(hfin.hour) * 60) + int(hfin.minute)

                                    duration = finmin - inimin
                                    durationh = duration/60

                                    for linea2 in lineasProgrec:
                                        listProgrec = linea2.split('|')
                                        if listProgrec[0] == listSkedrec[1]:
                                            TRITRI = True
                                            dataProgramTri[str(contadorPrograma)] = []
                                            dataProgramTri[str(contadorPrograma)].append({
                                                "STTN": channel['STTN'],
                                                "DBKY": listProgrec[0],
                                                "TTLE": (listProgrec[1].replace("\"", "\'") + "*") if listSkedrec[30] != '' else listProgrec[1].replace("\"", "\'"),
                                                "DSCR": listProgrec[159].replace("\"", "\'"),
                                                "DRTN": float("{:.2f}".format(durationh)),
                                                "MNTS": duration,
                                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                                "STRH": hinicio.strftime("%H:%M"),
                                                "FNLH": hfin.strftime("%H:%M"),
                                                "TVRT": '',
                                                "STRS": listProgrec[145],
                                                "EPSD": listProgrec[156].replace("\"", "\'")
                                            })

                                            contadorPrograma += 1
                                            break
                            if TRITRI == False:
                                dataProgramTri[str(contadorPrograma)] = []
                                dataProgramTri[str(contadorPrograma)].append({
                                    "STTN": channel['STTN'],
                                    "DBKY": '',
                                    "TTLE": channel['NACH'].replace("\"", "\'"),
                                    "DSCR": '',
                                    "DRTN": 24,
                                    "MNTS": 1440,
                                    'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                    "STRH": "00:00",
                                    "FNLH": "24:00",
                                    "TVRT": '',
                                    "STRS": '',
                                    "EPSD": ''
                                })
                                contadorPrograma += 1
                            data[str(contadorCanal)] = []
                            data[str(contadorCanal)].append({
                                'PSCN': channel['PSCN'],
                                'ADIO': channel['ADIO'],
                                'PRGM': channel['PRGM'],
                                'SRCE': channel['SRCE'],
                                'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                                'PORT': channel['PORT'],
                                'CHNL': channel['CHNL'],
                                'STTN': channel['STTN'],
                                'NAME': channel['NACH'],
                                'INDC': channel['INDC'],
                                'LOGO': channel['LOGO'],
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                'PROGRAMS': dataProgramTri,
                                'P_Length' : contadorPrograma
                            })
                            contadorCanal = contadorCanal + 1

            data["C_Length"] = contadorCanal
            with open('/var/www/html/BBINCO/TV1/Core/Controllers/Epg/'+IDF['IDF']+'/epg_'+day.strftime("%Y%m%d") + '_' + str(Package["id_paquete"]) + '.json', 'w', encoding='ascii') as file:
                json.dump(data, file, indent=4)

            with open('/var/www/html/BBINCO/TV1/Core/Controllers/Epg/'+IDF['IDF']+'/epg_'+day.strftime("%Y%m%d") + '_' + str(Package["id_paquete"]) + '.json', 'r') as file:
                filedata = file.read()

            filedata = filedata.replace('[', '').replace(']', '')
            with open('/var/www/html/BBINCO/TV1/Core/Controllers/Epg/'+IDF['IDF']+'/epg_'+day.strftime("%Y%m%d") + '_' + str(Package["id_paquete"]) + '.json', 'w') as file:
                file.write(filedata)
                print('/var/www/html/BBINCO/TV1/Core/Controllers/Epg/'+IDF['IDF']+'/epg_'+day.strftime("%Y%m%d") + '_' + str(Package["id_paquete"]) + '.json ', 'CREADO')

            data.clear()
    except:
        print()

def deleteline(slinea, day):
    with open("/var/www/html/mnt/nv/epg/skedrec.txt", "r", encoding='ascii') as f:
        lines = f.readlines()
    f.close()
    with open("/var/www/html/mnt/nv/epg/skedrec_copia.txt", "w", encoding='ascii') as f:
        for line in lines:
            borrar = line.split('|')
            if borrar[0] == slinea:
                f.write(line)
    f.close()
for pos in range(len(listDays)):
    start(listDays[pos], pos)

Guidesdb.update({
    'archivo': ''
})
Guidesdb.update({
    'generar': 'False'
})
Guidesdb.update({
    'porcentajeGenerado': '0'
})
def CheckDaysGuide():
    today = datetime.now().strftime('%Y%m%d')
    today = datetime.strptime(today, '%Y%m%d')
    
    files = sorted(find('*.json', '/var/www/html/BBINCO/TV1/Core/Controllers/Epg/VDM/'))
    
    firstday = str(files[0]).split("/")[-1].split("_")[1]
    firstday = datetime.strptime(firstday, '%Y%m%d')

    lastday = str(files[-1]).split("/")[-1].split("_")[1]
    lastday = datetime.strptime(lastday, '%Y%m%d')
    days = lastday - today
    
    Guidesdb.update({
        'dias': str(days.days)
    })
    Guidesdb.update({
        'ultimo': str(lastday.strftime('%Y%m%d'))
    })
    Guidesdb.update({
        'primero': str(firstday.strftime('%Y%m%d'))
    })
CheckDaysGuide()

files = ls1('/var/www/html/BBINCO/TV1/Core/Controllers/Epg/' + IDF['IDF']+'/')
for archivo in files:
    if archivo != "VDM.zip":
        bucket = storage.bucket()
        blob = bucket.blob('VDM/' + archivo)
        blob.upload_from_filename('/var/www/html/BBINCO/TV1/Core/Controllers/Epg/' + IDF['IDF']+'/'+archivo)