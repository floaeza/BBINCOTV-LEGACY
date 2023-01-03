<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <link rel="stylesheet" href="[@GeneralStyles]" type="text/css">
        <link rel='icon' href='./Media/General/icon.png'>
        <script src="[@Jquery]"></script>
        <script src="[@Hcap]"></script>
    </head>

    <body>
        <div class="GeneralBox BackgroundSolid">
            <div class="ContainerIndex" style="background-image: url('[@IndexLogo]') ">
                <br>
                <div id="CenterText"><h1>[@Step]</h1></div> 
                <h2 id="DebugText"></h2>
            </div>
        </div>
    </body>
</html>
<script>
    /* Carga inicial */
    window.addEventListener('load',SetDataInitial,false);
    
    /* Valida la informacion despues de las posibles cargas por cada tipo de dispositivo */
    setTimeout(GetInfoDevice,3000);

    /* Variables generales */
    var Option      = '[@Option]',
        MacAddress  = '00:00:00:00:00:00',
        IpAddress   = '0.0.0.0',
        Firmware    = 'Developer',
        Model       = 'Test',
        Hdd         = 'N',
        Vendor      = 'Generic',
       KamaiModels = { 49: '500x', 102: '7XM' },
        xhr;
/*******************************************************************************
 *  AMINO
 ******************************************************************************/
    function AminoDeviceInitial(){
         if(typeof(ASTB) !== 'undefined'){
            MacAddress  = ASTB.GetMacAddress();
            IpAddress   = ASTB.GetConfig('DHCPC.IPADDR');
            Firmware    = ASTB.GetSoftwareVersion();
            Model       = ASTB.GetConfig('SYSTEM.STB_MODEL');
            Hdd         = ASTB.GetConfig('SYSTEM.INTERNAL_HDD_PRESENT');
            Vendor      = 'Amino';

            var Spool = parseInt(ASTB.GetConfig('SETTINGS.PLT_SPOOLTIME'));

            if(Spool < 1000) {
                ASTB.SetConfig('snake', 'SETTINGS.PLT_START_DELAY', '1');
                ASTB.SetConfig('snake', 'SETTINGS.PLT_SPOOLTIME', '1440');
                ASTB.CommitConfig();

                ASTB.Reboot();
            }
            //alert();
            GetInfoDevice();

        } else {
            KamaiDeviceInitial();
        }
    }
        
/*******************************************************************************
 *  LG
 ******************************************************************************/  
    function LgDeviceInitial(){ 
        //hcap.channel.stopCurrentChannel({ /* vacio*/ });
        
        /* Detenemos el canal actual */
        hcap.channel.stopCurrentChannel({
            'onSuccess' : function() {
                console.log('onSuccess');
            }, 
            'onFailure' : function(f) {
                console.log('onFailure : errorMessage = ' + f.errorMessage);
            }
        });
        
        /* Modelo */  
        var GetModel = {
            'key' : 'model_name',
            'onSuccess' : function(response_model) {
                Model = response_model.value;
            }
        };
        hcap.property.getProperty(GetModel);

        /* Firmware */
        var GetFirmware = {
            'key' : 'platform_version',
            'onSuccess' : function(response_version) {
                Firmware = response_version.value;
            }
        };
        
        hcap.property.getProperty(GetFirmware);

        /* Macaddress, Ip, Vendor, Hdd */
        var GetNetwork = {
            'index' : 1,
            'onSuccess' : function(response_device) {
                MacAddress  = response_device.mac;
                Hdd         = 'N';
                Vendor      = 'Lg';
            }
        };

        hcap.network.getNetworkDevice(GetNetwork);
        
        hcap.network.getNetworkInformation({
            'onSuccess' : function(s) {
                IpAddress = s.ip_address;
            }
        });
        
        var Year  = '', Month = '', Day   = '', Min   = '', Hour  = '', Sec   = '';
        
        xhr = $.ajax({
            type: 'POST',
            url: '[@Time]',
            async : false,
            success: function (response) {
                var Today = $.parseJSON(response);
                    Year  = Today.Year;
                    Month = Today.Month;
                    Day   = Today.Day;
                    Min   = Today.Hours;
                    Hour  = Today.Minutes;
                    Sec   = Today.Seconds;
                    
                var ActualDate = {
                    'year'   : parseInt(Year,10), 
                    'month'  : parseInt(Month,10),
                    'day'    : parseInt(Day,10),
                    'hour'   : parseInt(Min,10),
                    'minute' : parseInt(Hour,10),
                    'second' : parseInt(Sec,10),
                    'gmtOffsetInMinute' : -600,
                    'isDaylightSaving'  : false
                };

                hcap.time.setLocalTime(ActualDate);
            }
        });
        xhr = null;
        
    }

/*******************************************************************************
 *  Kamai
 ******************************************************************************/
    function KamaiDeviceInitial(){
         if(typeof(ENTONE) !== 'undefined'){
            MacAddress  = ENTONE.stb.getMacAddress();
            IpAddress   = ENTONE.stb.getIPAddress();
            Firmware    = ENTONE.stb.getSoftwareVersion();
            //KamaiModels con valor de ENTONE.stb.getHardwareModel() evita tener que hacer comparaciones y solamente 
            //se tiene que agregar en el JSON los siguientes modelos de Kamai que sean incorporados
            Model       = KamaiModels[ENTONE.stb.getHardwareModel()]; // En Integer (49 para Kamai 500x)
            Hdd         = 'N';
            Vendor      = 'Kamai';

            if(Model === '7XM') {
                Hdd         = 'Y';
            }
            GetInfoDevice();
        } else {
            InfomirDeviceInitial();
        }
    }
    
/*******************************************************************************
 *  Infomir
 ******************************************************************************/
    function InfomirDeviceInitial(){
        if(typeof(gSTB) !== 'undefined'){
            storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
            USB = storageInfo.result || [];
            MacAddress  = gSTB.GetDeviceMacAddress();
            Firmware    = gSTB.GetDeviceImageDesc();
            Model       = gSTB.GetDeviceModel();
            Hdd         = (Model == 'MAG424' || Model == 'MAG524' || MacAddress == '00:1a:79:6d:d0:7a' || MacAddress == '00:1a:79:6d:d1:03' || MacAddress == '00:1a:79:6d:d1:a3' || MacAddress == '00:1a:79:6d:c6:ff' || MacAddress == '00:1a:79:6d:d0:7a' || MacAddress == '00:1a:79:72:cb:f7' || MacAddress == '00:1a:79:72:4a:9d' || MacAddress == '00:1a:79:72:cb:99' || MacAddress == '00:1a:79:74:b7:66' || MacAddress == '00:1a:79:72:c7:13' || MacAddress == '00:1a:79:72:cc:79' || MacAddress == '00:1a:79:72:cb:de' || MacAddress == '00:1a:79:72:cb:e7' || MacAddress == '00:1a:79:70:06:f1' || MacAddress == '00:1a:79:6d:c7:c1') && (USB.length !== 0)?'Y':'N';
            Vendor      = gSTB.GetDeviceVendor();
            IpAddress   = gSTB.RDir('IPAddress');
            
            if (Model == 'MAG424' || Model == 'MAG524' || MacAddress == '00:1a:79:6d:d0:7a' || MacAddress == '00:1a:79:6d:d1:03' || MacAddress == '00:1a:79:6d:d1:a3' || MacAddress == '00:1a:79:6d:c6:ff' || MacAddress == '00:1a:79:6d:d0:7a' || MacAddress == '00:1a:79:72:cb:f7' || MacAddress == '00:1a:79:72:4a:9d' || MacAddress == '00:1a:79:72:cb:99' || MacAddress == '00:1a:79:74:b7:66' || MacAddress == '00:1a:79:72:c7:13' || MacAddress == '00:1a:79:72:cc:79' || MacAddress == '00:1a:79:72:cb:de' || MacAddress == '00:1a:79:72:cb:e7' || MacAddress == '00:1a:79:70:06:f1' || MacAddress == '00:1a:79:6d:c7:c1') {
                $.ajax({
                        type: "POST",
                        url: '/BBINCO/TV1/Core/Controllers/Packages.php',
                        data: { 
                           Option    : 'InitialConfigurationInfomir',
                           IpAddress : IpAddress,
                        }, 
                        async: false,
                        success: function (response) {
                        
                        }
                    }); 
            }
            var CheckTime = gSTB.GetEnv('{ "varList":["timezone_conf"] }');
            if(typeof(CheckTime) === 'undefined'){
                gSTB.SetEnv('{ "timezone_conf":"America/Mazatlan" }');
                //gSTB.ExecAction('reboot');
            } else {
                var X = CheckTime.split('timezone_conf').pop().split('}')[0]; 
                X = X.replace('"','');
                X = X.replace(':','');
                if(X !== '"America/Mazatlan"'){
                    gSTB.SetEnv('{ "timezone_conf":"America/Mazatlan" }');
                    document.getElementById('DebugText').innerHTML = X;
                    //gSTB.ExecAction('reboot');
                }
            }
            GetInfoDevice();
        } else {
            LgDeviceInitial();
        }
    }


/*******************************************************************************
 *  Obtiene los datos de los dispositivos por marca en el siguiente orden:
 *  1 - Amino 
 *  2 - Kamai
 *  3 - Infomir
 *  4 - Lg
 ******************************************************************************/
    function SetDataInitial() {
        AminoDeviceInitial();
    }
    
/*******************************************************************************
 * Obtiene informacion del dispositivo
 ******************************************************************************/
    function GetInfoDevice(){
        xhr = $.ajax({
            type: 'POST',
            url: '[@Index]',
            data: { 
                Option      : Option,
                MacAddress  : MacAddress,
                IpAddress   : IpAddress,
                Firmware    : Firmware,
                Model       : Model,
                Hdd         : Hdd,
                Vendor      : Vendor
            },
            success: function (response) {
                
                var Data = $.parseJSON(response);

                console.log(Data);

                if(Data['Option'] === 'RELOAD'){
                    var DeviceInfo = ' Mac: '+MacAddress+' Ip: '+IpAddress+' <br> Firmware: '+Firmware+' Model: '+Model+' Vendor : '+Vendor;
                    document.getElementById('DebugText').innerHTML = DeviceInfo;
                    
                    if(typeof(ASTB) !== 'undefined'){
                        location.href= Data['ModuleUrl']+'?MacAddress='+MacAddress+'&ModuleId='+Data['ModuleId']+'&CurrentModule='+Data['ModuleName'];
                        
                    }else{
                        window.location.href = Data['ModuleUrl']+'?MacAddress='+MacAddress+'&ModuleId='+Data['ModuleId']+'&CurrentModule='+Data['ModuleName'];
                        //window.location.href = 'http://10.0.3.9//BBINCO/Admin/Views/Boards/DRIFT.html';
                    }
                    
                } else if(Data['Option'] === 'LICENSE'){
                    //
                } else {
                    if(typeof(ASTB) !== 'undefined'){
                        location.href='index.php?Option='+Data['Option'];
                    }else{
                        window.location.href = 'index.php?Option='+Data['Option'];
                        //window.location.href = 'http://10.0.3.9//BBINCO/Admin/Views/Boards/DRIFT.html';
                    }
                }
            }
        });
        xhr = null;
    }
</script>