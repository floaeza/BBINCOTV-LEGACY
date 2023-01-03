from telnetlib import DO
import paramiko
import sys
# ip ='10.0.3.253'

parametro = ' '.join(sys.argv[1:])
parametro = parametro.strip()
print(parametro)

parametro = parametro.split(',')


if parametro[1] == 'register':
    client = paramiko.SSHClient()
    #client.load_system_host_keys()
    #client.load_host_keys('~/.ssh/known_hosts')
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.load_system_host_keys()
    client.connect(hostname=parametro[0], port='22', username='root',password='930920')
    
    stdin, stdout, stderr = client.exec_command("cd /ram/media/* && mkdir -p records/ && tcpsvd 0 21 ftpd -w /media")
    
    #stdin, stdout, stderr = client.exec_command("cd /ram/media/* && mkdir -p records/")

    lines = stdout.readlines()
    # stdin, stdout, stderr = client.exec_command('mkdir records/')
    # lines = stdout.readlines()

    #cd /ram/media/* && mkdir -p records/ && 

    print(lines)
    stdin.close()
    stdout.close()
    stderr.close()
    client.close()
elif parametro[1] == 'loading':
    client = paramiko.SSHClient()
    #client.load_system_host_keys()
    #client.load_host_keys('~/.ssh/known_hosts')
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.load_system_host_keys()
    client.connect(hostname=parametro[0], port='22', username='root',password='930920')
    
    #stdin, stdout, stderr = client.exec_command('httpd -p 8080 -h /media')
    
    lines = stdout.readlines()
    # stdin, stdout, stderr = client.exec_command('mkdir records/')
    # lines = stdout.readlines()
    print(lines)
    stdin.close()
    stdout.close()
    stderr.close()
    client.close()
