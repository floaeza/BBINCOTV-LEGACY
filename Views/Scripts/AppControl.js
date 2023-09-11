
var Comando = [];
var MacAddressAppControl = '00:00:00:00:00:00', activeremoteAuto = false;
var remoteAuto = null;

$(function() {
    InitialDataAppControl();
    if(STBControll[0]['CON']=="1"){
        DBAppControl();
    }
});


function InitialDataAppControl(){    
    
    if (typeof(ASTB) !== 'undefined') {
        
        MacAddressAppControl  = ASTB.GetMacAddress();
    } else if (typeof(ENTONE) !== 'undefined') {
        
        MacAddressAppControl  = ENTONE.stb.getMacAddress();
    } else if (typeof(gSTB) !== 'undefined'){
        
        MacAddressAppControl  = gSTB.GetDeviceMacAddress();
        //alert(MacAddressAppControl);
    }  
    
    $.ajax({
        type: "POST",
        url: 'Core/Controllers/Firebase.php',
        data: { 
            Option    : 'GetDeviceByMac',
            mac_address: MacAddressAppControl
        }, 
        async: false,
        success: function (response) {
            
            STBControll  = $.parseJSON(response);
            //alert(STBControll);
        }
    });
    
}

function DBAppControl(){
       
    $.ajax({
        type: "POST",
        url: 'Core/Controllers/Firebase.php',
        data: { 
            Option    : 'GetControllByMac',
            mac_address: MacAddressAppControl
        }, 
        async: false,
        success: function (response) {
            
            Comando  = $.parseJSON(response);
            
            setTimeout(DBAppControl, 1000);
        }
    });
    //alert(Comando[0]);
    ChangeAppControl()
}

function ChangeAppControl(){
       
    for(var i = 0; i < Comando.length; i++){
        
        //alert(Comando[0].MAC);
        if (Comando[i].STATUS === 'pendingServer'){
            if((Comando[i].ORDEN).split("_")[0]+"_"+(Comando[i].ORDEN).split("_")[1] == "CHANGE_CHANNEL"){
                ChannelToChange = (Comando[i].ORDEN).split("_")[2];
                Comando[i].ORDEN = "CHANGE_CHANNEL";
            }
                    
            switch(Comando[i].ORDEN){
                
                case 'REMOTE_RED':
                    
                    Red();
                    break;
    
                
                case 'REMOTE_BLUE':
                    
                    Blue();
                    break;
    
                
                case 'REMOTE_GREEN':
                    
                    Green();
                    break;
    
                
                case 'REMOTE_YELLOW':
                    
                    Yellow();
                    break;
                
                
                case 'ARROW_KEY_UP':
                    
                    if(CurrentModule === 'Tv'){
                        
                        TvUp();
                    
                    } else if(CurrentModule === 'Menu'){
                        
                        MenuUp();
                    
                    } else if(CurrentModule === 'Movies'){
                        
                        VodUp();
                    }
                    break;
                
                
                case 'ARROW_KEY_DOWN':
                    
                    if(CurrentModule === 'Tv'){
                        
                        TvDown();
                    
                    } else if(CurrentModule === 'Menu'){
                        
                        MenuDown();
                    
                    } else if(CurrentModule === 'Movies'){
                        
                        VodDown();
                    }
                    break;
    
                
                case 'ARROW_KEY_RIGHT':
                    
                    if(CurrentModule === 'Tv'){
                        
                        TvRight();
                    
                    } else if(CurrentModule === 'Menu'){
                        
                        MenuRight();
                    
                    } else if(CurrentModule === 'Movies'){
                        
                        VodRight();
                    
                    } else if(CurrentModule === 'Moods'){
                        
                        MoodsRight();
                    } 
                    break;
    
                
                case 'ARROW_KEY_LEFT':
                    
                    if(CurrentModule === 'Tv'){
                        
                        TvLeft();
                    
                    } else if(CurrentModule === 'Menu'){
                        
                        MenuLeft();
                    
                    } else if(CurrentModule === 'Movies'){
                        
                        VodLeft();
                    
                    } else if(CurrentModule === 'Moods'){
                        
                        MoodsLeft();
                    } 
                    break;
                    
                
                case 'SMALL_ARROW_UP':
                    
                    if(CurrentModule === 'Tv'){
                        
                        TvPageUp();
                    }
                    break;
                    
                
                case 'SMALL_ARROW_DOWN':
                    
                    if(CurrentModule === 'Tv'){
                        
                        TvPageDown();
                    }
                    break;
                    
            /********** CANAL +/- **********/
    
                
                case 'REMOTE_CHANNEL_UP':
                    
                    if(CurrentModule === 'Tv'){
                        
                        TvChannelUp();
                    }
                break;
                case 'REMOTE_INFO':
                    if(CurrentModule === 'Tv'){
                        TvInfo();
                    }
                break;
    
                
                case 'REMOTE_CHANNEL_DOWN':
                    
                    if(CurrentModule === 'Tv'){
                        
                        TvChannelDown();
                    }
                    break;
                case 'REMOTE_GUIDE':
                        if(CurrentModule === 'Tv'){
                            TvGuide();
                        }
                    break;
                case 'REMOTE_BACK':
                    if(CurrentModule === 'Tv'){
                        TvClose();
                    }
                    break;
                case 'REMOTE_AUTO':
                        if(CurrentModule === 'Tv'){
                            if(remoteAuto == null){
                                remoteAuto = setInterval(function(){
                                    TvChannelUp();
                                },10000);
                            } else {
                                clearInterval(remoteAuto);

                                remoteAuto = null;
                            }
                        }
                    break;
                case "CHANGE_CHANNEL":
                    var CurrentChannel   = parseInt(ChannelsJson[ChannelPosition].CHNL, 10);
                    var PositionToChange = FindChannelPosition(ChannelToChange);
                    if(ChannelToChange !== CurrentChannel){
                        LastChannelPosition = ChannelPosition;
                        ChannelPosition = PositionToChange;
                        ChannelToChange = 0;
                        SetChannel('');
                    }
                    break;
                    
            }
    
            //$.ajax({
            //    type: "POST",
            //    url: '/Core/Controllers/Firebase.php',
            //    data: { 
            //        Option    : 'DeleteControlbyMac',
            //        MacAddress: '00:1a:79:6c:cc:3e'
            //    }, 
            //    async: false,
            //    success: function (response) {
            //        
            //        Comando  = $.parseJSON(response);
            //        //alert(Comando[0].MAC);
            //    }
            //});
            var timestamp = new Date().getTime();
            var diferenciaHoraria = -7 * 60 * 60 * 1000; 
            var timestampPhoenix = timestamp + diferenciaHoraria;
            var fechaHoraPhoenix = new Date(timestampPhoenix);
            var fechaHoraMySQL = fechaHoraPhoenix.toISOString().slice(0, 19).replace('T', ' ');

            $.ajax({
                type: "POST",
                url: 'Core/Controllers/Firebase.php',
                data: { 
                    Option    : 'UpdateControlByMac',
                    executed_time: fechaHoraMySQL,
                    mac_address: MacAddressAppControl
                }
            });
        }
    }
}
