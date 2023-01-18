// @ts-nocheck

var n = 0;
var prueba = false;
function Red(){
    if(typeof(gSTB) !== 'undefined'){
        gSTB.clearMemoryCaches();
        gSTB.DeleteAllCookies();
    }
    var relo = location.href;
    location.href = relo;
}

function Blue(){
    if (window.tizen !== undefined){
        var onSuccess = function() {
            Debug("[rebootDevice] succeeded!");
        };
        var onError = function(error) {
            Debug("[rebootDevice] failed! error code: " + error.code + " error name: " + error.name + "  message " + error.message);
        };
        b2bcontrol.rebootDevice(onSuccess, onError);
    }else {
        RebootDevice();
    }
}
function Green(){
}

function Yellow(){
    
}

function Close(){
    if(CurrentModule === 'Tv'){
        TvClose();
    } else if(CurrentModule === 'Menu'){
        //
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
