from datetime import datetime
from subprocess import call
import subprocess
Today= datetime.today().strftime('%Y-%m-%d')

generarBackup1 = subprocess.call(" wget http://10.0.3.10/BBINCO/TV2/Core/Controllers/Backups/backup_BBINCOTV_207-"+Today+".sql",shell=True);
print("Termino el back up 2")
