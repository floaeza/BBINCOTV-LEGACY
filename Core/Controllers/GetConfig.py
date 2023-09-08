from telnetlib import DO
import xtelnet
import json
import requests
with open("/var/www/html/Core/Controllers/locaciones.txt", "r") as f:
    lines = f.readlines()
f.close()


t=xtelnet.session()


for locaciones in lines:
    locaciones=locaciones.strip()
    payload = {'Option': 'InsertLocation', 'codigo_locacion': locaciones, 'descripcion_locacion': '', 'codigo_miembro': locaciones, 'epg': '1', 'menu': '1', 'mensajes': '0', 'id_paquete': '1', 'id_proyecto': '1', 'id_modulo': '2'}
    loc = requests.post('http://dev.bbincovatio.com/Core/Controllers/Location.php', data=payload)
    #IDF = json.loads(loc.content)
    #print(IDF)
    

 







