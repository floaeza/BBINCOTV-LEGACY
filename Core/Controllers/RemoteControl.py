import threading
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time
import requests
import json
from datetime import date
from datetime import datetime

# Use a service account
cred = credentials.Certificate('/var/www/config/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()
stbDic = []
# users_ref = db.collection(u'PaquetesVPL')
# docs = users_ref.stream()
payload = {'Option': 'GetIdentifier'}
Identifier = requests.post('http://10.0.3.9/BBINCO/TV1/Core/Controllers/PY.php', data=payload)
#Identifier = requests.post('http://bbinco.fortiddns.com:669/BBINCO/TV1/Core/Controllers/PY.php', data=payload)
IDF = json.loads(Identifier.content)
IDF = IDF[0]

#identificador = IDF['IDF']
identificador = 'VDM'
print(identificador)
numPaquetes = 0

today = date.today()
fechajson = today.strftime('%Y%m%d')
jsons = []

for i in range(0,numPaquetes):
    js = jsons[i]
    channels = js['C_Length']
    paquetes = {}
    for j in range(0, channels):
        paquetes.update({str(j):js[str(j)]['CHNL']+"|"+js[str(j)]['INDC']+"|"+js[str(j)]['LOGO']})
        
delete_done = threading.Event()

def on_snapshot(col_snapshot, changes, read_time):
    for change in changes:
        if change.type.name == 'ADDED':
            
            stbs = db.collection(identificador).document(f'{change.document.id}')
            stbb = stbs.get()
            stb = stbb.to_dict()
            if stb['status'] == 'pending':
                payload = {'Option': 'InsertControl', 'mac_address': stb['mac_address'], 'guest':stb['guest'], 'IDGuest':stb['IDGuest'], 'orden':stb['order'], 'status':'pendingServer'}
                var = requests.post('http://10.0.3.9/BBINCO/TV1/Core/Controllers/Firebase.php', data=payload)
                update = db.collection(identificador).document(f'{change.document.id}')
                update.update({u'status': 'pendingServer'})
                
        elif change.type.name == 'MODIFIED':
            continue
        elif change.type.name == 'REMOVED':
            delete_done.set()

col_query = db.collection(identificador)

query_watch = col_query.on_snapshot(on_snapshot)

while True:
    now = datetime.now()
    #print(now.hour)
    if now.hour == 00 and now.minute == 30 and now.second == 00:
        delet = db.collection(identificador)
        delete = delet.where(u'status', u'==', u'executed')
        for dele in delete.get():
            dele.reference.delete()

    if now.minute == 20 and now.second == 00:
        delet = db.collection(identificador)
        delete = delet.where(u'status', u'==', u'executed')
        for dele in delete.get():
            dele.reference.delete()
    time.sleep(1)