// @ts-nocheck

function Red(){
    //alert(PressedKey);
    location.reload(true);
    //alert('TEST2');
}

function Blue(){
    // var Up = 0;
    // Up = ASTB.Upgrade('http://10.0.3.10//bbinco_28_x4x_611.mcfs');
    // alert(Up);
    if(typeof(ASTB) !== 'undefined'){
        ASTB.Reboot();
    } else if(ypeof(ENTONE) !== 'undefined'){
        ENTONE.stb.reboot();
    }
}

function Green(){
    alert(player.durationMs);
}

function Yellow(){
    //if(typeof(ASTB) !== 'undefined') {
    //    Browser.Action(16);
    //}
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
    }
}

function Menu(){
    if(CurrentModule !== 'Menu' && Device['Services']['ActiveMenu'] === true){
        Debug('----------- GOPAGE');
        //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
        //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
        //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
        GoPage('menu.php', Device['MenuId'], 'Menu');
        GoPage('menu.php', Device['MenuId'], 'Menu');
    } else if(CurrentModule === 'Tv' && Device['Services']['ActiveMenu'] === false){
        TvRecorder();
    }
}
