// @ts-nocheck

var n = 0;
var prueba = false, remoteAutoDos = null;
function Red(){
    if(MacAddress == "00:1a:79:6d:d0:7a" ){
        if(typeof(gSTB) !== 'undefined'){
            gSTB.clearMemoryCaches();
            gSTB.DeleteAllCookies();
        }
        var relo = location.href;
        location.href = relo;
    }
    // if(typeof(gSTB) !== 'undefined'){
    //     gSTB.clearMemoryCaches();
    //     gSTB.DeleteAllCookies();
    // }
    var relo = location.href;
        location.href = relo;
}

function Blue(){
    // if (window.tizen !== undefined){
    //     var onSuccess = function() {
    //         Debug("[rebootDevice] succeeded!");
    //     };
    //     var onError = function(error) {
    //         Debug("[rebootDevice] failed! error code: " + error.code + " error name: " + error.name + "  message " + error.message);
    //     };
    //     b2bcontrol.rebootDevice(onSuccess, onError);
    // }else {
        RebootDevice();
    // }
}
function Green(){
    // rtsp://10.30.12.201:554/0000009326
    // alert('Hola Mundo');
    //Debug("Resultado tras setRTSP == === = =" + JSON.stringify());
    // stbPlayerManager.setRTSP({
    //     type: 0,
    //     // keepAlive: true,
    //     // endByAnnounce: true,
    //     // useUDP: true
    // });
}

function Yellow(){
    Debug("posicion ==========="+player.position);
    Debug("duracion ==========="+player.duration);
    Debug("Speeds ==========="+player.speeds);

}

function Close(){
    if(CurrentModule === 'Tv'){
        TvClose();
    } else if(CurrentModule === 'Menu'){
        //
    } else if(CurrentModule === 'Interactivo'){
        CloseInteractivo();
    } else if(CurrentModule === 'Movies'){
        VodClose();
    } else if(CurrentModule === 'Moods'){
        MoodsClose();
    }
}

function Back(){
    if(CurrentModule === 'Tv'){
        TvClose();
    } else if(CurrentModule === 'Menu'){
        //
    } else if(CurrentModule === 'Interactivo'){
        CloseInteractivo();
    } else if(CurrentModule === 'Movies'){
        VodClose();
    } else if(CurrentModule === 'Moods'){
        MoodsClose();
    }else{
        GoPage('menu.php', Device['MenuId'], 'Menu');
    }
}

function Menu(){
    if(haveInteractiveChannel == true && CurrentModule === 'Tv'){
        var CurrentChannel   = parseInt(ChannelsJson[ChannelPosition].CHNL, 10);
        var PositionToChange = FindChannelPosition(numberInteractiveChannel);
        ClosePvr();
        if(ChannelToChange !== CurrentChannel){
            LastChannelPosition = ChannelPosition;
            ChannelPosition = PositionToChange;
            ChannelToChange = 0;
            clearTimeout(NumericChangeTimer);
            SetChannel('');
        }
    }else if(CurrentModule !== 'Menu' && Device['Services']['ActiveMenu'] === true){
        StopVideo();
        GoPage('menu.php', Device['MenuId'], 'Menu');       
    } else if(CurrentModule === 'Tv' && Device['Services']['ActiveMenu'] === false){
        TvRecorder();
    }
}
