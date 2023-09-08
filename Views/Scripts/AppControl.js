
var Comando = [];
var MacAddressAppControl = '00:00:00:00:00:00', activeremoteAuto = false;
var remoteAuto = null;
function InitialDataAppControl(){    
    // @ts-ignore
    if (typeof(ASTB) !== 'undefined') {
        // @ts-ignore
        MacAddressAppControl  = ASTB.GetMacAddress();
    } else if (typeof(ENTONE) !== 'undefined') {
        // @ts-ignore
        MacAddressAppControl  = ENTONE.stb.getMacAddress();
    } else if (typeof(gSTB) !== 'undefined'){
        // @ts-ignore
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
            // @ts-ignore
            STBControll  = $.parseJSON(response);
            //alert(STBControll);
        }
    });
    
}

function DBAppControl(){
    // @ts-ignore   
    $.ajax({
        type: "POST",
        url: 'Core/Controllers/Firebase.php',
        data: { 
            Option    : 'GetControllByMac',
            mac_address: MacAddressAppControl
        }, 
        async: false,
        success: function (response) {
            // @ts-ignore
            Comando  = $.parseJSON(response);
            
            setTimeout(DBAppControl, 1000);
        }
    });
    //alert(Comando[0]);
    ChangeAppControl()
}

function ChangeAppControl(){
       
    for(var i = 0; i < Comando.length; i++){
        // @ts-ignore
        //alert(Comando[0].MAC);
        if (Comando[i].STATUS === 'pendingServer'){
            // @ts-ignorealert(Comado[i].ORDEN)
            if((Comando[i].ORDEN).split("_")[0]+"_"+(Comando[i].ORDEN).split("_")[1] == "CHANGE_CHANNEL"){
                ChannelToChange = (Comando[i].ORDEN).split("_")[2];
                Comando[i].ORDEN = "CHANGE_CHANNEL";
            }
                    
            switch(Comando[i].ORDEN){
                // @ts-ignore
                case 'REMOTE_RED':
                    // @ts-ignore
                    Red();
                    break;
    
                // @ts-ignore
                case 'REMOTE_BLUE':
                    // @ts-ignore
                    Blue();
                    break;
    
                // @ts-ignore
                case 'REMOTE_GREEN':
                    // @ts-ignore
                    Green();
                    break;
    
                // @ts-ignore
                case 'REMOTE_YELLOW':
                    // @ts-ignore
                    Yellow();
                    break;
                
                // @ts-ignore
                case 'ARROW_KEY_UP':
                    // @ts-ignore
                    if(CurrentModule === 'Tv'){
                        // @ts-ignore
                        TvUp();
                    // @ts-ignore
                    } else if(CurrentModule === 'Menu'){
                        // @ts-ignore
                        MenuUp();
                    // @ts-ignore
                    } else if(CurrentModule === 'Movies'){
                        // @ts-ignore
                        VodUp();
                    }
                    break;
                
                // @ts-ignore
                case 'ARROW_KEY_DOWN':
                    // @ts-ignore
                    if(CurrentModule === 'Tv'){
                        // @ts-ignore
                        TvDown();
                    // @ts-ignore
                    } else if(CurrentModule === 'Menu'){
                        // @ts-ignore
                        MenuDown();
                    // @ts-ignore
                    } else if(CurrentModule === 'Movies'){
                        // @ts-ignore
                        VodDown();
                    }
                    break;
    
                // @ts-ignore
                case 'ARROW_KEY_RIGHT':
                    // @ts-ignore
                    if(CurrentModule === 'Tv'){
                        // @ts-ignore
                        TvRight();
                    // @ts-ignore
                    } else if(CurrentModule === 'Menu'){
                        // @ts-ignore
                        MenuRight();
                    // @ts-ignore
                    } else if(CurrentModule === 'Movies'){
                        // @ts-ignore
                        VodRight();
                    // @ts-ignore
                    } else if(CurrentModule === 'Moods'){
                        // @ts-ignore
                        MoodsRight();
                    } 
                    break;
    
                // @ts-ignore
                case 'ARROW_KEY_LEFT':
                    // @ts-ignore
                    if(CurrentModule === 'Tv'){
                        // @ts-ignore
                        TvLeft();
                    // @ts-ignore
                    } else if(CurrentModule === 'Menu'){
                        // @ts-ignore
                        MenuLeft();
                    // @ts-ignore
                    } else if(CurrentModule === 'Movies'){
                        // @ts-ignore
                        VodLeft();
                    // @ts-ignore
                    } else if(CurrentModule === 'Moods'){
                        // @ts-ignore
                        MoodsLeft();
                    } 
                    break;
                    
                // @ts-ignore
                case 'SMALL_ARROW_UP':
                    // @ts-ignore
                    if(CurrentModule === 'Tv'){
                        // @ts-ignore
                        TvPageUp();
                    }
                    break;
                    
                // @ts-ignore
                case 'SMALL_ARROW_DOWN':
                    // @ts-ignore
                    if(CurrentModule === 'Tv'){
                        // @ts-ignore
                        TvPageDown();
                    }
                    break;
                    
            /********** CANAL +/- **********/
    
                // @ts-ignore
                case 'REMOTE_CHANNEL_UP':
                    // @ts-ignore
                    if(CurrentModule === 'Tv'){
                        // @ts-ignore
                        TvChannelUp();
                    }
                    break;
    
                // @ts-ignore
                case 'REMOTE_CHANNEL_DOWN':
                    // @ts-ignore
                    if(CurrentModule === 'Tv'){
                        // @ts-ignore
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
            //        // @ts-ignore
            //        Comando  = $.parseJSON(response);
            //        //alert(Comando[0].MAC);
            //    }
            //});
    

            $.ajax({
                type: "POST",
                url: 'Core/Controllers/Firebase.php',
                data: { 
                    Option    : 'UpdateControlByMac',
                    mac_address: MacAddressAppControl
                }
            });
        }
    }
}
InitialDataAppControl();
// @ts-ignore


//alert(STBControll[0]['CON']);
if(STBControll[0]['CON']=="1"){
   DBAppControl();
}