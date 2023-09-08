from telnetlib import DO
import xtelnet
import time
failed = ''
succed = ''
contador = 1
with open("ipsAminos.txt", "r") as f:
    lines = f.readlines()
    f.close()

t=xtelnet.session()
   
for ips in lines:
    ip=ips
    if contador % 10 == 0:
        print('pausa')
        time.sleep(60)
    try:
        t.connect(ip.strip(), username='root',password='iptv8',p=23,timeout=8)
        output = t.execute('reboot')
        t.close()
        succed = succed + ip + '\n'
        print('Se reinicio: '+succed)
        contador = contador+1
    except:
        try:
            t.connect(ip.strip(), username='root',password='root2root',p=23,timeout=8)
            output = t.execute('reboot')
            t.close()
            succed = succed + ip + '\n'
            print('Se reinicio: '+succed)
            contador = contador+1
        except: 
            failed = failed + ip + '\n'
            print('Dispositivo no alcanzado: '+failed)
            continue

file = open("logSucces.txt", "w")
file.write(succed)
file.close()

file = open("logfailed.txt", "w")
file.write(failed)
file.close()
