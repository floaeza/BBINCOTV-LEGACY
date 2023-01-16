import sys

parametro = ' '.join(sys.argv[1:])
parametro = parametro.strip()
print(parametro)

with open("/var/www/html/BBINCO/TV2/Core/Controllers/logInformir.txt", "r") as f:
    lines = f.readlines()
f.close()

listToStr = ''.join(map(str, lines))
parametro = parametro.split(',')

try:
    file = open("/var/www/html/BBINCO/TV2/Core/Controllers/logInformir.txt", "w")
    file.write(listToStr + parametro[0] + ' -----> ' + parametro[1] + ' | ' + parametro[2] + ' | ' + parametro[3] + ' | ' + parametro[4]+'\n')
    file.close()
except:
    file = open("/var/www/html/BBINCO/TV2/Core/Controllers/logInformir.txt", "w")
    file.write(listToStr + parametro[0] + ' | ' + parametro[1] + ' | ' + parametro[2] + ' | ' + parametro[3]+ '\n')
    file.close()