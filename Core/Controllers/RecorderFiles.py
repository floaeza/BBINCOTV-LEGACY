from telnetlib import DO
import sys
import requests

FilesData = ' '.join(sys.argv[1:])
FilesData = FilesData.strip()
#print(FilesData)

FilesData = FilesData.split(',')

pos = 0

#for parametro in parametros:
#    print(parametro)

def DownloadFile(url, local_filename):
    #local_filename = url.split('/')[-1]
    r = requests.get(url)
    with open(local_filename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024): 
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)
    return 

file = ''
downloadFile = ''
for parametro in FilesData:
    if pos > 0:
        if pos == 1:
            file = parametro.split('/')
        downloadFile = parametro.split('/')
        DownloadFile(parametro, '/var/www/html/INFOMIR_RECORDINGS/' +downloadFile[4])
    pos += 1

payload = {'Option': 'UpdateProgramOperaPython', 'File': '/Media/'+file[3]+"/"+file[4], 'Cantidad':FilesData[0], 'OperationId':'4', 'ActiveRecording': 'false'}
Devices = requests.post('http://dev.bbincovatio.com/Core/Controllers/Recorder.php', data=payload)
#IDF = json.loads(Devices.content)
#print(IDF)