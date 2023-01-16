// @ts-nocheck
 /******************************************************************************
 * @Objetivo: Ejecucion de funciones para EPG
 * @CreadoPor: Tania Maldonado
 * @Fecha: Mayo 26, 2018
 * 
 * @NavegadoresPorMarca:
 * Amino A50: Opera 12
 * Amino A540, A140, A138: Opera 11
 * Kamai 500x: Safari 538.1
 * Lg UV770H: Chrome 53 
 *******************************************************************************/
    Date.prototype.yyyymmdd = function () {
        var mm = this.getMonth() + 1;
        var dd = this.getDate();
        return [this.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
        ].join('');
    };
    
    /* Variables generales */
    var ChannelsJson         = '',
        BackUpChannelsJson   = '',
        ChannelPosition      = 0,
        LastChannelPosition  = 0,
        SourceEpgFile        = '',
        ChannelsLength       = 0,
        Hours                = [],
        EpgDataActive        = false,
        CurrentDateFormat    = '',
        CurrentDate          = '',
        SkipChapter          = null,
        SkipChapterClick     = 0;

        var Booting     = true;

    /* Canal */
    var Source               = '',
        Port                 = '',
        ProgramIdChannnel    = 0,
        ProgramIdPosition    = 0,
        AudioPid             = 0,
        Direction            = 'UP';

    /* Horas y fechas */
    var FormatDateAndHour    = '',
        FormatHour           = '',
        StartDateChannel     = '',
        FormatStartDate      = '',
        CurrentStbDate       = '';
        
    /* Epg */
    var ActiveEpgContainer   = false,
        ProgramPosition      = 0,
        ChannelPositionFocus = 0;
 
    /* Info */
    var ActiveInfoContainer  = false,
        InfoTimer            = null,
        SecondsToCloseInfo   = 10,                                   /* Segundos para ocultar cuadro de informacion */
        TimeoutInfo          = SecondsToCloseInfo * 1000,
        InfoContainer        = document.getElementById('InfoContainer'),
        InfoContainerNodes   = document.getElementById('InfoContainer').childNodes,
        load                 = true;

    /* Canal */
    var ChannelContainer     = document.getElementById('ChannelNumber'),
        NumericChangeTimer   = '',
        ChannelToChange      = 0,
        ChannelMax           = 0;
    
    /* Definicion del arreglo que contendra todas las horas del dia a mostrar */
        Hours = [['00:00','12:00 am'],['00:30','12:30 am'],['01:00','1:00 am'],['01:30','1:30 am'],['02:00','2:00 am'],['02:30','2:30 am'],['03:00','3:00 am'],['03:30','3:30 am'],
                 ['04:00','4:00 am'],['04:30','4:30 am'],['05:00','5:00 am'],['05:30','5:30 am'],['06:00','6:00 am'],['06:30','6:30 am'],['07:00','7:00 am'],['07:30','7:30 am'],
                 ['08:00','8:00 am'],['08:30','8:30 am'],['09:00','9:00 am'],['09:30','9:30 am'],['10:00','10:00 am'],['10:30','10:30 am'],['11:00','11:00 am'],['11:30','11:30 am'],
                 ['12:00','12:00 pm'],['12:30','12:30 pm'],['13:00','1:00 pm'],['13:30','1:30 pm'],['14:00','2:00 pm'],['14:30','2:30 pm'],['15:00','3:00 pm'],['15:30','3:30 pm'],
                 ['16:00','4:00 pm'],['16:30','4:30 pm'],['17:00','5:00 pm'],['17:30','5:30 pm'],['18:00','6:00 pm'],['18:30','6:30 pm'],['19:00','7:00 pm'],['19:30','7:30 pm'],
                 ['20:00','8:00 pm'],['20:30','8:30 pm'],['21:00','9:00 pm'],['21:30','9:30 pm'],['22:00','10:00 pm'],['22:30','10:30 pm'],['23:00','11:00 pm'],['23:30','11:30 pm']];

    /* Validacion para reinicar dispositivo y buscar actualizaciones de la epg */
    var LastUpdatedTime     = '';

    /* Variable grabador */
    var RecordingsToCheck   = '',
        IndexRec              = 0;

    /* Canales digitales */
    var ImageDigital            = document.getElementById('ImageDigitalChannel'),
        ActiveDigitalChannel    = false,
        DigitalContent          = [],
        IndexDigital            = 0,
        IntervalDigital         = '',
        DigitalSource           = '',
        DigitalImgSource        = '';

    var ContentFrame            = document.getElementById('ContentFrame'),
        ActiveFrame             = false;

    var haveInteractiveChannel = false,
        numberInteractiveChannel = 1000,
        usersData = '',
        userFocused,
        userNumberFocused = 0,
        currentInteractive = "",
        actualUser = "";

    var headerInteractive = ['InteractiveOptionSearch', 'InteractiveOptionHome', 'InteractiveOptionTV'],
        headerInteractivePos = 0,
        interactiveFocusedSection = ['header', 'popularChannels', 'lastRecords'],
        interactiveFocusedSectionPos = 0,
        focusedPopularChannel = 0;
        focusedLastRecord = 0,
        visibleSearchBox = false,
        noFoundCont = false;
    
    var InteractiveUsers = document.getElementById("InteractiveUsers");
    
    var lastRecordsList = '', isShowingResults = false;

    /* Asigna archivo para consultar por primera vez */
    setTimeout(SetEpgFile,150);
function SetEpgFile(){
    /* Consulta la fecha actual cada vez que actualiza la guia */
    CurrentDateFormat = new Date();
    CurrentDate = CurrentDateFormat.yyyymmdd();
    NewDate     = CurrentDate;
    
    /* Si tiene activa EPG actualiza la variable que por defecto tiene el valor de general */
    if(Device['Services']['ActiveEpg'] === true){
            
        SourceEpgFile = Libraries['EpgDaysPath'] + 'epg_' + CurrentDate + '_' + Device['Services']['PackageId'] + '.json';
        GetJsonEpg(SourceEpgFile, 0);
    } else {
        EpgDataActive = false;
        GetJsonChannels();
    }

    if(prev_Direction !== ''){
        for(i = 0; i < ChannelsJson["C_Length"]; i++) {
            if(ChannelsJson[i].NAME == "Movies"){
                ChannelPosition = i;
                break;
            }
        }
    }
    SetChannel(prev_Direction);
}
    
function GetJsonEpg(Sour, rest){
    
    $.ajax({
        cache: false,
        async: false,
        url: ServerSource + Sour,
        success: function (response){
            SourceEpgFile = Sour;
            ChannelsJson = [];
            ChannelsJson = response;
            EpgDataActive = true;
            ////Debug(Sour);
            ChannelsLength = ChannelsJson.C_Length - 1;
            ChannelMax     = parseInt(ChannelsJson[ChannelsLength].CHNL, 10);
            
            ////Debug('------- GetJsonEpg -> ChannelsLength: '+ChannelsLength);
        },
        error: function (response){
            //Debug("EEEEEEEEEE"+response);

            if(rest!==-1){
                if(rest<2){
                    rest++;
                    var d = new Date();
                    d.setDate(d.getDate() - rest);
                    Sour = Libraries['EpgDaysPath'] + 'epg_' + d.yyyymmdd() + '_' + Device['Services']['PackageId'] + '.json';
                    
                    GetJsonEpg(Sour, rest);
                }else{
                    Sour = Libraries['EpgDaysPath'] + 'Default/epg_default_' + Device['Services']['PackageId'] + '.json';
                    
                    GetJsonEpg(Sour, -1);
                }
            }else{
                EpgDataActive = false;
                GetJsonChannels();
            }
        }
    });
}
function CheckUpdatedJson(){
    if (typeof ChannelsJson[0].PROGRAMS === 'undefined') {
        // Regresa al respaldo
        ChannelsJson = BackUpChannelsJson;
    } else {
        if(ChannelsJson[0].PROGRAMS[0]['DTNU'] === CurrentDate) {
            // Borra el respaldo
            BackUpChannelsJson = '';
        }
    }
}

function GetJsonChannels(){ 
    $.ajax({
        type: 'POST',
        async: false,
        cache: false,
        url: ServerSource + 'Core/Controllers/Packages.php',
        data: { 
            Option : 'GetChannels',
            PackageId: Device['Services']['PackageId']
        },
        success: function (response){
            ChannelsJson = $.parseJSON(response);   
            ChannelsLength = ChannelsJson.length - 1;
            ChannelMax     = parseInt(ChannelsJson[ChannelsLength].CHNL, 10);
            if(Device['Services']['ActiveEpg'] === true){
                SetLog(ErrorLoadGuide);
            }
        }
    });
}
    
/*******************************************************************************
 * Reproduce canal y abre informacion del canal en reproduccion
 *******************************************************************************/

function SetChannel(NewDirection){
    ////Debug('SetChannel = '+NewDirection);
    if(ActiveEpgContainer === false){
        
        /* Valida si se esta subiendo o bajando de canal para restar|sumar una posicion */
        if(NewDirection !== ''){
            LastChannelPosition = ChannelPosition;
            ////Debug('############### B LastChannelPosition '+LastChannelPosition+ ' ChannelPosition: '+ChannelPosition);
            Direction = NewDirection;

            (Direction === 'UP') ? ChannelPosition++: ChannelPosition--;
            if(ChannelPosition < 0){
                ChannelPosition = ChannelsLength;
            }
            if(ChannelPosition > ChannelsLength){
                ChannelPosition = 0;
            }
            ////Debug('2- ChannelPosition =  '+ChannelPosition);
        }
            Source = ChannelsJson[ChannelPosition].SRCE;
            Port   = ChannelsJson[ChannelPosition].PORT;
            ProgramIdChannnel = ChannelsJson[ChannelPosition].PRGM;
            ProgramIdPosition = ChannelsJson[ChannelPosition].PSCN;
            AudioPid          = ChannelsJson[ChannelPosition].ADIO;
            Direction = 'UP';
            if(ChannelsJson[ChannelPosition].STTN !== 'CONTENT'){
                if(ActiveDigitalChannel === true){
                    CloseDigitalChannel();
                }
                if(load){
                    $(document).ready(function(){
                        //your code
                        if(window.tizen !== undefined){
                            PlayChannel(Source, Port);
                        }else{

                            PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition);  
                             /* TvFunctions por marca */  
                        }
                    });
                    load = false;
                }else{
                    if(window.tizen !== undefined){
                        PlayChannel(Source, Port);
                    }else{
                        PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition);   /* TvFunctions por marca */
                    }
                }
            }else if(ChannelsJson[ChannelPosition].NAME =='MenuInteractivo'){
                if(NewDirection == ''){
                    haveInteractiveChannel = true;
                    HideInfo();
                    GetMenuInteractivo();
                }else {
                    SetChannel(NewDirection);
                }
            } else if(ChannelsJson[ChannelPosition].NAME =='Movies'){
                GoPage('content.php', 5, 'Movies'); 
            }else{
                GetDigitalChannel();      
            }
        
    }
}

function GetDigitalChannel(){
    ActiveDigitalChannel = true;

    var GetModule = ChannelsJson[ChannelPosition].INDC;

    DigitalSource = Libraries['MultimediaSource'] + GetModule + '/';
    DigitalImgSource = '../../Multimedia/' + GetModule + '/';

    $.ajax({
        type: 'POST',
        url: ServerSource + 'Core/Controllers/Template.php',
        async:false,
        data: {
            Option : 'getDigitalChannel',
            ModuleName : GetModule
        },
        success: function (response){
            DigitalContent = $.parseJSON(response);
        }
    });
    setTimeout(SetDigitalChannel(),1000);
    ShowInfo();
}

var DigitalChannel = document.getElementById('DigitalChannel');
    
function SetDigitalChannel(){
    Debug('--> SetDigitalChannel  = ' +ActiveDigitalChannel);
    if(ActiveDigitalChannel === true){
        if(DigitalContent.length > 0){
            var FileType = DigitalContent[IndexDigital].split('.')[1];
            if(FileType === 'mp4'){
                clearTimeout(IntervalDigital);

                ImageDigital.src = '';
                ImageDigital.style.display = 'none';
                
                PlayDigitalChannel(DigitalSource+DigitalContent[IndexDigital]);
                Debug( '..................Source'+ DigitalSource+DigitalContent[IndexDigital])
        
                Debug('Hasta aqui todo bien FINAL');
            } else {
                
                ImageDigital.src = DigitalSource+DigitalContent[IndexDigital];
                ImageDigital.style.display = 'inline';

                IntervalDigital = setInterval(SetDigitalChannel,9000);
            }
            IndexDigital++;

            if(IndexDigital > DigitalContent.length - 1){
                IndexDigital = 0;
            }
        } else {
            TvChannelUp();
        }
        
    }
}
function CloseDigitalChannel(){
    Debug("CloseDigitalChannel");
    ActiveDigitalChannel = false;
    ImageDigital.src = '';
    ImageDigital.style.display = 'none';
    clearTimeout(IntervalDigital);
}
function SetFrame(){
    ActiveFrame = true;
    StopVideo();
    MaximizeTV();
    PlayingChannel   = true;   
    
    ShowInfo();
    if(StartDateChannel !== ''){
        SetChannelStatistics();
    }
    StartDateChannel = new Date();
    var Page         = ChannelsJson[ChannelPosition].SRCE,
        ModuleId     = ChannelsJson[ChannelPosition].PORT,
        ChangeModule = ChannelsJson[ChannelPosition].INDC;
    
    ContentFrame.style.display = 'inline';
    ContentFrame.src = Libraries['ServerSource'] + Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule;
}

function CloseFrame(){
    ActiveFrame = false;
    ContentFrame.style.display = 'inline';
    ContentFrame.src = '';
}
/*******************************************************************************
 * Regresa al ultimo canal 
 *******************************************************************************/  
   
    function ReturnLastChannel(){
        if(ActiveEpgContainer === false){
            if(LastChannelPosition !== ChannelPosition){
                Source = ChannelsJson[LastChannelPosition].SRCE;
                Port   = ChannelsJson[LastChannelPosition].PORT;
                ProgramIdChannnel = ChannelsJson[ChannelPosition].PRGM;
                ProgramIdPosition = ChannelsJson[ChannelPosition].PSCN;
                AudioPid          = ChannelsJson[ChannelPosition].ADIO;

                var CurrentChannelPosition = ChannelPosition;
                ChannelPosition = LastChannelPosition;
                LastChannelPosition = CurrentChannelPosition;
                if(ChannelsJson[ChannelPosition].STTN !== 'CONTENT'){
                    if(ActiveDigitalChannel === true){
                        CloseDigitalChannel();
                    }
                    if(ActiveFrame === true){
                        CloseFrame();
                    }
                    if(load){
                       $(document).ready(function(){
                            //your code
                            if(window.tizen !== undefined)  
                                PlayChannel(Source, Port);
                            else
                                PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition);  /* TvFunctions por marca */
                        });
                        load = false;
                    }else{
                        if(window.tizen !== undefined){
                            PlayChannel(Source, Port);
                        }else
                        PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition);   /* TvFunctions por marca */
                    }    
                } else {
                    GetDigitalChannel();
                }
            } else {
            }
        }
    }
    
/*******************************************************************************
 * Actualiza la posicion del canal cuando presionan las teclas numericas 0-9
 *******************************************************************************/  

    function NumericChange(Key){

        if(ActiveEpgContainer === false){
            /* Limpiamos el timer */
            clearTimeout(NumericChangeTimer);

            if(ChannelToChange === 0){
                /* Asigna el valor ingresado, ya que es el primero */
                ChannelToChange = Key;
            } else {
                /* Multiplica por 10 el digito que se haya ingresado previamente mas el nuevo que se ingreso */
                ChannelToChange *= 10;
                ChannelToChange = ChannelToChange + Key;
            }

            if(ChannelToChange > ChannelMax){
                /* Si excede el numero de canales maximo limpia el timer y regrese a su valor inicial el numero a cambiar */
                clearTimeout(NumericChangeTimer);
                ChannelToChange = 0;

                ChannelContainer.textContent = '';
            } else {
                ChannelContainer.textContent = ChannelToChange;
                clearTimeout(NumericChangeTimer);
                NumericChangeTimer = setTimeout(function () {
                    var CurrentChannel   = parseInt(ChannelsJson[ChannelPosition].CHNL, 10);
                    var PositionToChange = FindChannelPosition(ChannelToChange);
                    if(ChannelToChange !== CurrentChannel){
                        LastChannelPosition = ChannelPosition;
                        ChannelPosition = PositionToChange;
                        ChannelToChange = 0;
                        clearTimeout(NumericChangeTimer);
                        SetChannel('');
                    }
                    ChannelContainer.textContent = '';
                }, 3000);
            }
        }
    }
    
    function FindChannelPosition(ChannelToChange){
        var Index            = 0,
            NewChannelNumber = parseInt(ChannelToChange, 10),
            ChannelNumber    = '',
            CheckChannel     = false,
            IndexB           = 0,
            Position         = 0;

        /* Valida en todas las posiciones si encuentra un numero de canal igual al que se recibio */
        while(Index <= ChannelsLength){
            if(NewChannelNumber === parseInt(ChannelsJson[Index].CHNL, 10)){
                Position = Index;
                Index = ChannelsLength;
                CheckChannel = true;
            }
            Index++;
        }
        if(CheckChannel === false){
            while(IndexB < ChannelsLength){

                ChannelNumber = parseInt(ChannelsJson[IndexB].CHNL, 10);
                
                if(ChannelNumber === (NewChannelNumber - 1) || ChannelNumber === (NewChannelNumber + 1)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 2) || ChannelNumber === (NewChannelNumber + 2)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 3) || ChannelNumber === (NewChannelNumber + 3)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 4) || ChannelNumber === (NewChannelNumber + 4)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 5) || ChannelNumber === (NewChannelNumber + 5)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 6) || ChannelNumber === (NewChannelNumber + 6)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 7) || ChannelNumber === (NewChannelNumber + 7)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 8) || ChannelNumber === (NewChannelNumber + 8)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 9) || ChannelNumber === (NewChannelNumber + 9)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                else if(ChannelNumber === (NewChannelNumber - 10) || ChannelNumber === (NewChannelNumber + 10)){
                    Position = IndexB;
                    IndexB = ChannelsLength;
                }
                IndexB++;
            }
        }
        return Position;
    }

function ShowInfo(){
    
    if(ActiveEpgContainer === false){
        if(ActiveInfoContainer === false){
            InfoContainer.style.visibility = 'visible';
        }
        LoadCurrentData(FindCurrentHour(GetCurrentHour()));

        if(EpgDataActive === true){
            var Times = '<p class="Times">\u00A0('+FormatHours(ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].STRH)+' - '+FormatHours(ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].FNLH)+')</p>';
            var Ttle = '<p class="Ttle">'+ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].TTLE+'\u00A0</p>';
            var Rtg = '<p class="Rtg">\u00A0'+ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].TVRT+'</p>';

            InfoContainerNodes[1].textContent  = ChannelsJson[ChannelPosition].CHNL+' - ' +ChannelsJson[ChannelPosition].INDC.toUpperCase();
            InfoContainerNodes[7].textContent  = FormatHour;
            InfoContainerNodes[9].innerHTML    = Ttle + Times + Rtg;
            if(RecordingsToCheck !== ''){
                for(IndexRec = 0; IndexRec < RecordingsToCheck.length; IndexRec++){
                    if(RecordingsToCheck[IndexRec].databasekey === ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].DBKY) {
                        InfoContainerNodes[9].innerHTML  = Ttle + Times + Rtg + '<p class="RecInfo">\u00A0REC</p>';
                        IndexRec = RecordingsToCheck.length;
                    }
                }
            }
            InfoContainerNodes[15].textContent = ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].DSCR;
                        
        } else {
            InfoContainerNodes[1].textContent  = ChannelsJson[ChannelPosition].CHNL+' - ' +ChannelsJson[ChannelPosition].INDC.toUpperCase();
            InfoContainerNodes[7].textContent  = FormatHour;
        }

        Times = null;
        Ttle = null;
        Rtg = null;
        clearTimeout(InfoTimer);
        InfoTimer = setTimeout(HideInfo,TimeoutInfo);
        ActiveInfoContainer = true;
    }
}
    
    function HideInfo(){
        if(ActiveInfoContainer === true){
            InfoContainer.style.visibility = 'hidden';
            ActiveInfoContainer = false;
            clearTimeout(InfoTimer);
            ClearInfo();
        }
    }
    
    function ClearInfo(){
        InfoContainerNodes[1].textContent  = '';
        InfoContainerNodes[3].textContent  = '';
        InfoContainerNodes[5].textContent  = '';
        InfoContainerNodes[7].textContent  = '';
        InfoContainerNodes[9].innerHTML    = '';
        InfoContainerNodes[11].textContent = '';
        InfoContainerNodes[13].textContent = '';
        InfoContainerNodes[15].textContent = '';
    }
    
/*******************************************************************************
 * Funcion que posiciona las variables de tv en el programa actual, segun la hora
 * actual en la que se cambia de nacal y se muestra la info.
 *******************************************************************************/

    function LoadCurrentData(HourPosition){
        var CurrentChannelPosition,
            CurrentHour     = Hours[HourPosition][0],
            StartHour       = '', 
            EndHour         = '', 
            IndexProgram    = 0;
        if(ActiveEpgContainer === true){
            CurrentChannelPosition = ChannelPositionFocus;
        } else {
            CurrentChannelPosition = ChannelPosition;
        }
        if(EpgDataActive === true && ChannelsJson[CurrentChannelPosition].P_Length > 0){
            for(IndexProgram = 0; IndexProgram < ChannelsJson[CurrentChannelPosition].P_Length; IndexProgram++){
                StartHour = ChannelsJson[CurrentChannelPosition].PROGRAMS[IndexProgram].STRH;
                EndHour   = ChannelsJson[CurrentChannelPosition].PROGRAMS[IndexProgram].FNLH;
                if(CompareHours(StartHour, CurrentHour) === '='){
                    ProgramPosition = IndexProgram;
                    IndexProgram = ChannelsJson[CurrentChannelPosition].P_Length;
                } else if(CompareHours(StartHour, CurrentHour) === '>'){
                    ProgramPosition = IndexProgram;
                    IndexProgram = ChannelsJson[CurrentChannelPosition].P_Length;
                } else if(CompareHours(StartHour, CurrentHour) === '<' && CompareHours(EndHour, CurrentHour) === '>'){
                    ProgramPosition = IndexProgram;
                    IndexProgram = ChannelsJson[CurrentChannelPosition].P_Length;
                } 
            }
        }
    }
    
    function PlayChannelEpg(){
        ChannelPosition = FocusChannelPosition;
        CloseEpg();
        var Source = ChannelsJson[ChannelPosition].SRCE,
            Port   = ChannelsJson[ChannelPosition].PORT;
             ProgramIdChannnel = ChannelsJson[ChannelPosition].PRGM,
             ProgramIdPosition = ChannelsJson[ChannelPosition].PSCN;
             AudioPid          = ChannelsJson[ChannelPosition].ADIO;

        if(ChannelsJson[ChannelPosition].STTN !== 'CONTENT'){
            if(ActiveDigitalChannel === true){
                CloseDigitalChannel();
            }
            if(load){
                
                $(document).ready(function(){
                    //your code
                    if(window.tizen !== undefined){
                        PlayChannel(Source, Port);
                    }else
                    PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition);   /* TvFunctions por marca */
                });
                load = false;
            }else{
                if(window.tizen !== undefined){
                    PlayChannel(Source, Port);
                }else
                PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition);   /* TvFunctions por marca */
            }
        }  else if(ChannelsJson[ChannelPosition].NAME !=='Movies'){
            GetDigitalChannel();
        }else{
            GoPage('content.php', 5, 'Movies');       
        }
    }

    function TvOk(){
        if(RecorderMessageActive === false) {
            if (ActiveEpgContainer === true) {
                if (RecordingOptionsActive === false && RecordManualOptionsActive === false) {
                    Debug(" ========= >Location ID" + Device['LocationId']);    
                    Debug(" ========= >Location Name" + Device['LocationName']);                    
                    if (Device['Type'] === 'NONE') {
                        PlayChannelEpg();
                    } else if(Device['LocationName'] == 'DEFAULT'){
                        ShowRecorderMessage('This device is not assigned to your location, contact it support');
                        PlayChannelEpg();
                    }else {
                        OpenRecordingOptions();
                    }
                } else if (RecordingOptionsActive === true) {
                    SelectRecordingsOption();
                } else if (RecordManualOptionsActive === true) {
                    SelectManualRecordOption();
                }
            } else if (RecordingPanel === true) {
                PvrOk();
            } else if (RecordPlayOptionsActive === true) {
                SelectRecordPlayOption();
            }
        } else {
            HideRecorderMessage();
        }
    }
    
    function TvClose(){
        if(RecorderMessageActive === false) {
            if (ActiveEpgContainer === true) {
                if (RecordingOptionsActive === false && RecordManualOptionsActive === false) {
                    CloseEpg();
                } else if (RecordingOptionsActive === true) {
                    CloseRecordingOptions();
                } else if (RecordManualOptionsActive === true) {
                    CloseManualRecord();
                }
            } else if (RecordingPanel === true) {
                PvrClose();
            }else if(PlayingRecording===false){
                ReturnLastChannel();
                Debug('Se cambia de canal');
            }
        } else {
            HideRecorderMessage();
        }
    }
    function TvInfo(){
        if(PauseLive === true){
            SetSpeed('play');
            if(PlayingRecording === true){
                ShowPvrInfo();
            }else{
                ShowInfo();
            }
        } else if(PlayingRecording === true){
            ShowPvrInfo();
        } else {
            if(Device['Type'] !== 'NONE'){
                GetRecordingsToRecord();
            }
            ShowInfo();
        }
    }
    function TvRight(){  
        if(RecorderMessageActive === false) {
            if (ActiveEpgContainer === true) {
                if (RecordingOptionsActive === false && RecordManualOptionsActive === false) {
                    ProgramRight();
                }
                if (RecordManualOptionsActive === true) {
                    SetFocusManualOption('down');
                }
                clearTimeout(EpgTimer);
                EpgTimer = setTimeout(CloseEpg, TimeoutEpg);
            } else if (RecordingPanel === true) {
                PvrRight();
            }else if(PlayingRecording == true){
                if(DelaySkip == false){
                    DelaySkip = true;
                    SkipCommercials("right");
                    setTimeout(function(){
                        DelaySkip = false;
                    },1000);
                } 
            }
        }
    }
    function TvLeft(){
        if(RecorderMessageActive === false) {
            if (ActiveEpgContainer === true) {
                if (RecordingOptionsActive === false && RecordManualOptionsActive === false) {
                    ProgramLeft();
                }
                if (RecordManualOptionsActive === true) {
                    SetFocusManualOption('up');
                }
                clearTimeout(EpgTimer);
                EpgTimer = setTimeout(CloseEpg, TimeoutEpg);
            } else if (RecordingPanel === true) {
                PvrLeft();
            }else if(PlayingRecording == true){
                if(DelaySkip == false){
                    DelaySkip = true;
                    SkipCommercials("left");
                    setTimeout(function(){
                        DelaySkip = false;
                    },1000);
                }
            }
        }
    }
    function TvDown(){
        if(RecorderMessageActive === false) {
            if (ActiveEpgContainer === true) {
                if (RecordingOptionsActive === false && RecordManualOptionsActive === false) {
                    ProgramDown();
                } else if (RecordingOptionsActive === true) {
                    SetFocusOptionRecording('down');
                } else if (RecordManualOptionsActive === true) {
                    SetManualTime('down');
                }
                clearTimeout(EpgTimer);
                EpgTimer = setTimeout(CloseEpg, TimeoutEpg);
            } else if (RecordingPanel === true) {
                PvrDown();
            } else if (RecordPlayOptionsActive === true) {
                SetFocusOptionRecordPlay('down');
            }
        }
    }
    function TvPageDown(){
        if(RecorderMessageActive === false) {
            if (ActiveEpgContainer === true) {
                if (RecordingOptionsActive === false && RecordManualOptionsActive === false) {
                    PageDown();
                }
                clearTimeout(EpgTimer);
                EpgTimer = setTimeout(CloseEpg, TimeoutEpg);
            }
        }
    }
    function TvUp(){
        if(RecorderMessageActive === false) {
            if (ActiveEpgContainer === true) {
                if (RecordingOptionsActive === false && RecordManualOptionsActive === false) {
                    ProgramUp();
                } else if (RecordingOptionsActive === true) {
                    SetFocusOptionRecording('up');
                } else if (RecordManualOptionsActive === true) {
                    SetManualTime('up');
                }
                clearTimeout(EpgTimer);
                EpgTimer = setTimeout(CloseEpg, TimeoutEpg);
            } else if (RecordingPanel === true) {
                PvrUp();
            } else if (RecordPlayOptionsActive === true) {
                SetFocusOptionRecordPlay('up');
            }
        }
    }
    function TvPageUp(){
        if(RecorderMessageActive === false) {
            if (ActiveEpgContainer === true) {
                if (RecordingOptionsActive === false && RecordManualOptionsActive === false) {
                    PageUp();
                }
                clearTimeout(EpgTimer);
                EpgTimer = setTimeout(CloseEpg, TimeoutEpg);
            }
        }
    }
    function TvPlay(){
        if(PlayingRecording === true){
            SetSpeed('play');
        } else {
            if(Device['Type'] === 'PVR_ONLY' || Device['Type'] === 'WHP_HDDY'){
                PauseLive = true;
                SetSpeed('play');
            }
        }
    }
    function TvPause(){
        if(PlayingRecording === true){
            SetSpeed('pause');
        } else {
            if(Device['Type'] === 'PVR_ONLY' || Device['Type'] === 'WHP_HDDY'){
                PauseLive = true;
                SetSpeed('pause');
            }
        }
    }
    function TvStop(){
        if(PlayingRecording === true){
            OpenRecordPlayOptions();
        }
    }
    function TvForward(){
        if(PlayingRecording === true){
            SetSpeed('forward');
        } else {
            if(Device['Type'] === 'PVR_ONLY' || Device['Type'] === 'WHP_HDDY'){
                PauseLive = true;
                SetSpeed('forward');
            }
        }
    } 
    function TvBackward(){
        if(PlayingRecording === true){
            SetSpeed('backward');
        } else {
            if(Device['Type'] === 'PVR_ONLY' || Device['Type'] === 'WHP_HDDY'){
                PauseLive = true;
                SetSpeed('backward');
            }
        }
    }  
    function TvRecord(){
        if(ActiveEpgContainer === true && Device['Type'] !== 'NONE'){
            if(ActiveEpgContainer === true ){
                if(RecordingOptionsActive === false && RecordManualOptionsActive === false){
                    if(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].STTN !== 'CONTENT'){
                        OpenRecordingOptions();
                    }
                }
            }
        } else if(ActiveEpgContainer === false && Device['Type'] !== 'NONE'){
            if(ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].STTN !== 'CONTENT'){
                if(ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].DRTN !== '24'){
                    REC_CHNL_POS = ChannelPosition;
                    REC_PROG_POS = ProgramPosition;
                    CheckRecordings();
                }
            }
        }
    }
    function TvRecorder(){
        if(RecorderMessageActive === false) {
            if (PlayingRecording === false) {
                Debug(Device['Type']);
                if (Device['Type'] !== 'NONE') {
                    if (RecordingOptionsActive === true) {
                        CloseRecordingOptions();
                    }
                    if (ActiveEpgContainer === true) {
                        CloseEpg();
                    }
                    if (RecordManualOptionsActive === true) {
                        CloseManualRecord();
                    }
                    if (ActiveInfoContainer === true) {
                        HideInfo();
                    }
                    OpenPvr();
                }
            } else {
                OpenRecordPlayOptions();
            }
        } else {
            HideRecorderMessage();
        }
    }  
function TvGuide(){
    if(RecorderMessageActive === false) {
        if (PlayingRecording === false) {
            if (RecordingOptionsActive === true) {
                CloseRecordingOptions();
            }
            if (RecordingPanel === true) {
                ClosePvr();
            }
            if (RecordManualOptionsActive === true) {
                CloseManualRecord();
            }
            if (ActiveInfoContainer === true) {
                HideInfo();
            }
            if (Device['Type'] !== 'NONE') {
                GetRecordingsToRecord();
            }
            OpenEpg();
        } else {
            OpenRecordPlayOptions();
        }
    }  else {
        HideRecorderMessage();
    }
}
function TvChannelUp(){
    if(PlayingRecording === false){
        SetChannel('UP');
    } else {
        OpenRecordPlayOptions();
    }
}
function TvChannelDown(){
    if(PlayingRecording === false){
        SetChannel('DOWN');
    } else {
        OpenRecordPlayOptions();
    }
}
function GetMenuInteractivo(){
    StopVideo();
    CurrentModule = "Interactivo";
    if(actualUser ==""){
        currentInteractive = "selectUser";
    }else{
        currentInteractive = "mainPanel";
    }
    //setUsers(usersData);
    document.getElementById("InteractiveChannel").style.display = "block";
    
    document.getElementById("SelectUsers").style.display = "none";
    document.getElementById("InteractiveChannelMain").style.display = "block";
    currentInteractive = "mainPanel";
    getPopularChannels();
    // getLastRecords();
    GetPvrInfo();
    if(Device['Type']!='NONE'){
        GetRecordings();
    }
    setLastRecors();
    setMainPanelFocused();
    HideInfo();

    // $.ajax({
    //     type: 'POST',
    //     url: ServerSource + 'Core/Controllers/Interactivo.php',
    //     async:false,
    //     data: {
    //         Option : 'getUsers',
    //         macDevice : MacAddress
    //     },
    //     success: function (response){
    //         usersData = $.parseJSON(response);
    //         setUsers(usersData);
    //         if(currentInteractive == "mainPanel"){
    //             getPopularChannels();
    //         }
    //     }
    // });
}
function searchProgram(programName){
    $.ajax({
        type: 'POST',
        url: ServerSource + 'Core/Controllers/Interactivo.php',
        async:false,
        data: {
            Option : 'searchProgram',
            programName : programName
        },
        success: function (response){
            var findedPrograms = $.parseJSON(response);
            ShowResults(findedPrograms);
        }
    });
}
function ShowResults(findedPrograms){
    if(findedPrograms.length > 0){
        document.getElementById('showResults').style.display = 'block';
        isShowingResults = true;
        var div, channelNumber, programName, programHours;
        var keys;
        var romper = 0;
        for(var i = 0; i < findedPrograms.length; i++) {
            keys = Object.keys(findedPrograms[i]);
            for(var j = 0; j < keys.length; j++) {
                for(var x = 0; x < findedPrograms[i][keys[j]].length; x++){
                    div = document.createElement('div');
                    div.classList.add('Result');
                    channelNumber = document.createElement('div');
                    channelNumber.id = "ResultChannel";
                    channelNumber.innerHTML = keys[j];
        
                    programName = document.createElement('div');
                    programName.id = "ResultName";
                    programName.innerHTML = findedPrograms[i][keys[j]][x].TTLE;
        
                    programHours = document.createElement('div');
                    programHours.id = "ResultHours";
                    programHours.innerHTML = findedPrograms[i][keys[j]][x].STRH + " - " + findedPrograms[i][keys[j]][x].FNLH;
        
                    div.appendChild(channelNumber);
                    div.appendChild(programName);
                    div.appendChild(programHours);
        
                    document.getElementById('showResults').appendChild(div);
                    romper ++;
                    if(romper == 8){
                        break;
                    }
                }
                if(romper == 8){
                    break;
                }
            }
            if(romper == 8){
                break;
            }
        }
        document.getElementById('showResults').style.height = (romper*9.25)+'%';
        for(var i=0; i<document.getElementsByClassName('Result').length; i++){
            document.getElementsByClassName('Result')[i].style.height = (90/romper)+'%';
        }
    }else{
        // alert('No results found for this search');
        noFoundCont = true;
        ShowNoFoundMessage('No results found for this search');

    }
}
function setUsers(users){
    document.getElementById("InteractiveChannel").style.display = "block";
    var divUser, span, divName;
    for(var i=0; i<users.length; i++){
        divUser = document.createElement("div");
        divUser.id = "User"+i;
        if(i == 0){
            divUser.classList.add("UserFocused");
            userFocused = divUser;
        }
        span = document.createElement("div");
        span.classList.add("dot");
        span.innerText = (users[i].name).charAt(0);
        span.classList.add(getSColor(random(1, 7)));
        
        divName = document.createElement("div");
        divName.id = "usersName";
        divName.innerText = users[i].name;
        divUser.appendChild(span);
        divUser.appendChild(divName);
        //document.getElementById("InteractiveUsersName").appendChild(divName);
        InteractiveUsers.appendChild(divUser);
        // InteractiveUsers.appendChild(divName);
        divUser = null;
        span = null;
        divName = null;
    }
    if(users.length<4){
        divUser = document.createElement("div");
        divUser.id = "User"+users.length;
        divUser.classList.add("addUser");
        if(users.length == 0){
            divUser.classList.add("UserFocused");
            userFocused = divUser;
        }
        span = document.createElement("div");
        span.classList.add("dot");
        span.innerHTML = "+";
        span.classList.add(getSColor(random(1, 7)));
        span.style.marginTop = "10%";
        divUser.appendChild(span);
        InteractiveUsers.appendChild(divUser);
    }
}
function LeftInteractive(){
    switch(currentInteractive){
        case "selectUser":
            if(userNumberFocused != 0){
                document.getElementById("User"+userNumberFocused).classList.remove("UserFocused");
                userNumberFocused--;
                document.getElementById("User"+userNumberFocused).classList.add("UserFocused");
            }
            break;
        case "addUser":
            KeyboardDirection("LEFT");
            break;
        case "mainPanel":
            switch(interactiveFocusedSectionPos){
                case 0:
                    if(headerInteractivePos > 0 && visibleSearchBox == false && isShowingResults ==false){
                        document.getElementById(headerInteractive[headerInteractivePos]).classList.remove("focusedItem");
                        headerInteractivePos--;
                        document.getElementById(headerInteractive[headerInteractivePos]).classList.add("focusedItem");
                    }else if(visibleSearchBox == true && isShowingResults == false){
                        KeyboardDirection("LEFT");
                    }
                    break;
                case 1:
                    if(focusedPopularChannel > 0){
                        document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.remove("focusedItem");
                        focusedPopularChannel--;
                        document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.add("focusedItem");        
                    }
                    break;
                case 2:
                    if(focusedLastRecord > 0){
                        document.getElementsByClassName("lastRecord")[focusedLastRecord].classList.remove("focusedItem");
                        focusedLastRecord--;
                        document.getElementsByClassName("lastRecord")[focusedLastRecord].classList.add("focusedItem");        
                    }
                    break;
            }
            break;
    }
}
function RightInteractive(){
    switch(currentInteractive){
        case "selectUser":
            if(usersData.length > userNumberFocused && userNumberFocused != 3){
                document.getElementById("User"+userNumberFocused).classList.remove("UserFocused");
                userNumberFocused++;
                document.getElementById("User"+userNumberFocused).classList.add("UserFocused");
            }
            break;
        case "addUser":
            KeyboardDirection("RIGHT");
            break;
        case "mainPanel":
            switch(interactiveFocusedSectionPos){
                case 0:
                    if(headerInteractivePos < headerInteractive.length-1 && visibleSearchBox == false && isShowingResults ==false){
                        document.getElementById(headerInteractive[headerInteractivePos]).classList.remove("focusedItem");
                        headerInteractivePos++;
                        document.getElementById(headerInteractive[headerInteractivePos]).classList.add("focusedItem");
                    }else if(visibleSearchBox == true && isShowingResults == false){
                        KeyboardDirection("RIGHT");
                    }
                    break;
                case 1:
                    if(focusedPopularChannel < 4){
                        document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.remove("focusedItem");
                        focusedPopularChannel++;
                        document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.add("focusedItem");        
                    }
                    break;
                case 2:
                    if(focusedLastRecord < 4){
                        document.getElementsByClassName("lastRecord")[focusedLastRecord].classList.remove("focusedItem");
                        focusedLastRecord++;
                        document.getElementsByClassName("lastRecord")[focusedLastRecord].classList.add("focusedItem");        
                    }
                    break;
            }
            break;
    }
}
function DownInteractive(){
    switch(currentInteractive){
        case "addUser":
            KeyboardDirection("DOWN");
            break;
        case "mainPanel":
            switch(interactiveFocusedSectionPos){
                case 0:
                    if(visibleSearchBox == false){
                        document.getElementById(headerInteractive[headerInteractivePos]).classList.remove("focusedItem");
                        headerInteractivePos = 0;
                        interactiveFocusedSectionPos++;
                        focusedPopularChannel=0;
                        document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.add("focusedItem");
                    }else if(visibleSearchBox == true && isShowingResults ==false){
                        KeyboardDirection("DOWN");
                    }
                    break;
                case 1:
                    if(Device['Type']!='NONE'){
                        if(visibleSearchBox == false && RecordingsList.length > 0){
                            document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.remove("focusedItem");
                            headerInteractivePos = 0;
                            interactiveFocusedSectionPos++;
                            focusedPopularChannel=0;
                            focusedLastRecord = 0
                            document.getElementsByClassName("lastRecord")[focusedLastRecord].classList.add("focusedItem");
                        }
                    }
                    break;
                case 2:
                    break;
            }
            break;
    }
}
function UpInteractive(){
    switch(currentInteractive){
        case "addUser":
            KeyboardDirection("UP");
            break;
        case "mainPanel":
            switch(interactiveFocusedSectionPos){
                case 0:
                    if(visibleSearchBox == true && isShowingResults ==false){
                        KeyboardDirection("UP");
                    }
                    break;
                case 1:
                    if(visibleSearchBox == false){
                        document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.remove("focusedItem");
                        headerInteractivePos = 0;
                        interactiveFocusedSectionPos--;
                        focusedPopularChannel=0;
                        document.getElementById(headerInteractive[headerInteractivePos]).classList.add("focusedItem");
                        // document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.add("focusedItem");
                    }else if(visibleSearchBox == true){
                        KeyboardDirection("UP");
                    }
                    break;
                case 2:
                    if(visibleSearchBox == false){
                    // document.getElementById(headerInteractive[headerInteractivePos]).classList.add("focusedItem");
                        document.getElementsByClassName("lastRecord")[focusedLastRecord].classList.remove("focusedItem");
                        headerInteractivePos = 0;
                        interactiveFocusedSectionPos--;
                        focusedPopularChannel=0;
                        focusedLastRecord = 0
                        document.getElementsByClassName("popularChannel")[focusedPopularChannel].classList.add("focusedItem");
                    }
                    break;
            }
            break;
    }
}
function OkInteractive(){
    switch(currentInteractive){
        case "selectUser":
            if(userNumberFocused == usersData.length){
                addUser();
            }else{
                selectUser(usersData[userNumberFocused]);
            }
            break;
        case "addUser":
            KeyboardDirection("OK");
            break;
        case "mainPanel":
            switch(interactiveFocusedSectionPos){
                case 0:
                    if(headerInteractivePos == 2){
                        document.getElementById("InteractivePopularChannelImg").innerHTML = "";
                        document.getElementById("InteractiveLastRecordsImg").innerHTML = "";
                        setMainPanelFocused();
                        hideInteractiveMenu();
                        SetChannel('UP');
                    }else if(headerInteractivePos == 0){
                        if(visibleSearchBox == false){
                            visibleSearchBox = true;
                            document.getElementById("keyboard").style.display = "block";
                            document.getElementById("InteractiveSearchBox").style.display = "flex";
                            document.getElementById("InteractiveSearchBox").style.width = "50%";
                        }else if(noFoundCont == true){
                            HideNoFoundMessage();
                            noFoundCont = false;
                        }else if(isShowingResults ==false){
                            KeyboardDirection("OK");
                        }
                    }
                    break;
                case 1:
                    var CurrentChannel   = parseInt(ChannelsJson[ChannelPosition].CHNL, 10);
                    var PositionToChange = FindChannelPosition(parseInt(document.getElementsByClassName("popularChannel")[focusedPopularChannel].id));
                    if(ChannelToChange !== CurrentChannel){
                        LastChannelPosition = ChannelPosition;
                        ChannelPosition = PositionToChange;
                        ChannelToChange = 0;
                        document.getElementById("InteractivePopularChannelImg").innerHTML = "";
                        document.getElementById("InteractiveLastRecordsImg").innerHTML = "";
                        setMainPanelFocused();
                        hideInteractiveMenu();
                        SetChannel('');
                    }
                case 2:
                    
                    ClearSpeed();
                    GetPvrInfo();
                    
                    CurrentModule = 'Tv';
                    
                    IndexRecordedFocus  = parseInt(document.getElementsByClassName("lastRecord")[focusedLastRecord].title.split(',')[1]);
                    IndexRecordedProgFocus   = parseInt(document.getElementsByClassName("lastRecord")[focusedLastRecord].title.split(',')[2]);
                    if((RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].operacion !=='4') || RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].active === '1'){
                        ShowRecorderMessage('This recording is not yet available, please wait');
                    }else{

                        if(parseInt(DiskInfo[DiskInfoIndex].rtsp_conexiones) >= 4){
                            ShowRecorderMessage('All connections to your recorder are active, please wait or close a connection');
                        } else {
                            UpdateRtspConnections('add');
                            if(parseInt(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].numberFiles) == 0){
                                PlayVideo(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);
                            }else{
                                PlayRecordsPlaylist(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url, RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].numberFiles, RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].duration);
                            }
            
                            //Debug('URL>>>>>> '+RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);
            
                            PlayingRecording = true;
            
                            //ClosePvr();
                            HidePvr();
            
                            ShowPvrInfo();
                            SetSpeed('play');
                        }
                    }
                    document.getElementById("InteractivePopularChannelImg").innerHTML = "";
                    document.getElementById("InteractiveLastRecordsImg").innerHTML = "";
                    setMainPanelFocused();
                    hideInteractiveMenu();
                    break;
            }
            break;
    }
}
function CloseInteractivo(){
    
    switch(currentInteractive){
        case "addUser":
            document.getElementById("InteractiveAddUser").style.display = "none";
            document.getElementById("keyboard").style.display = "none";
            document.getElementById("SelectUsers").style.display = "flex";
            currentInteractive = "selectUser";
            document.getElementById("AddText").textContent = "";
            break;
        case "mainPanel":
            switch(interactiveFocusedSectionPos){
                case 0:
                    if(headerInteractivePos == 0){
                        if(visibleSearchBox == true && isShowingResults ==false){
                            visibleSearchBox = false;
                            document.getElementById("keyboard").style.display = "none";
                            document.getElementById("InteractiveSearchBox").style.display = "none";
                            document.getElementById("InteractiveSearchBox").style.width = "0%";
                        }else if(isShowingResults == true){
                            document.getElementById("showResults").innerHTML = "";
                            document.getElementById("showResults").style.display= "none";
                            isShowingResults = false;
                        }
                    }
                    break;
                case 1:
                case 2:
                    break;
            }
            break;
    }
}

function selectUser(user){
    actualUser = user;
    if(currentInteractive == "selectUser"){
        document.getElementById("SelectUsers").style.display = "none";
        document.getElementById("InteractiveChannelMain").style.display = "block";
        currentInteractive = "mainPanel";
        getPopularChannels();
        setMainPanelFocused();
    } else if(currentInteractive == "addUser"){
        document.getElementById("InteractiveAddUser").style.display = "none";
        document.getElementById("keyboard").style.display = "none";
        document.getElementById("InteractiveChannelMain").style.display = "block";
        currentInteractive = "mainPanel";
        setMainPanelFocused();
    }
}
function getLastRecords(){
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option : 'RecordingsList',
            LocationId : Device['LocationId'],
            // LocationId : 257,
            MacAddress : MacAddress
        },
        success: function (response){
            lastRecordsList = $.parseJSON(response);
            setLastRecors();
        }
    });
}
function setLastRecors(){
    if(Device['Type']!='NONE'){
        if(RecordingsList.length>0){
            var div, logo, title;
            var recordsCount = 0;
            for(var i=0; i<RecordingsList.length; i++){
                for(var j=1; j<RecordingsList[i].length; j++){
                    div = document.createElement("div");
                    div.id = RecordingsList[i][j].channel;
                    div.classList.add("lastRecord");
                    div.title = 'Rec,'+i+","+j;

                    logo = document.createElement("div");
                    logo.classList.add("ChannelLogo");
                    logo.style.backgroundImage = 'url("Media/Logos/VDM/record.png")';
                    div.appendChild(logo);

                    title = document.createElement("div");
                    title.innerText = RecordingsList[i][0];
                    title.id = "nameRecordInt";
                    div.appendChild(title);

                    title = document.createElement("div");
                    title.innerText = RecordingsList[i][j].channel;
                    title.id = "numberRecordInt";
                    div.appendChild(title);
                    
                    document.getElementById("InteractiveLastRecordsImg").appendChild(div);
                    recordsCount++;
                    if(recordsCount == 5){
                        break;
                    }
                }
                if(recordsCount == 5){
                    break;
                }
            }
        }else{
            div = document.createElement("div");
            div.id = 'noRecords';
            div.innerText = 'You have no recordings';
            document.getElementById("InteractiveLastRecordsImg").appendChild(div);
        }
    }else{
        div = document.createElement("div");
        div.id = 'noRecords';
        div.innerText = 'You have no recordings';
        document.getElementById("InteractiveLastRecordsImg").appendChild(div);
    }
}
function getPopularChannels(){
    $.ajax({
        cache: false,
        type: 'POST',
        url: ServerSource + 'Core/Controllers/Statistics.php',
        data: {
            Option: 'getPopularChannelsByUser',
            LocationId: Device['LocationId'],
        },
        success: function (response){
            console.log(response);
            var popular = $.parseJSON(response);
            setPopularChannels(popular);
        }
    });
}
function setPopularChannels(popular){
    console.log(popular.length);
    if(popular.length>4){
        var div, logo, title;
        for(var i=0; i<5; i++){
            div = document.createElement("div");
            div.id = popular[i].numero_canal;
            div.classList.add("popularChannel");
            logo = document.createElement("div");
            logo.classList.add("ChannelLogo");
            logo.style.backgroundImage = 'url("'+ Libraries['ChannelsPath'] + ChannelsJson[FindChannelPosition(parseInt(popular[i].numero_canal))].LOGO+'")';
            div.appendChild(logo);

            title = document.createElement("div");
            title.innerText = popular[i].numero_canal;
            title.id = "numberChannelInt";
            div.appendChild(title);
            
            title = document.createElement("div");
            title.innerText = popular[i].nombre_canal;
            title.id = "nameChannelInt";
            div.appendChild(title);

            document.getElementById("InteractivePopularChannelImg").appendChild(div);
        }
    }
}
function setMainPanelFocused(){
    switch(interactiveFocusedSectionPos){
        case 0:
            document.getElementById(headerInteractive[headerInteractivePos]).classList.remove('focusedItem');
            headerInteractivePos = 0;
            interactiveFocusedSectionPos = 0;
            document.getElementById(headerInteractive[headerInteractivePos]).classList.add('focusedItem');
            break;
        case 1:
            interactiveFocusedSectionPos = 0;
            headerInteractivePos = 0;
            document.getElementById(headerInteractive[headerInteractivePos]).classList.add('focusedItem');
            break;
        case 2:
            interactiveFocusedSectionPos = 0;
            headerInteractivePos = 0;
            document.getElementById(headerInteractive[headerInteractivePos]).classList.add('focusedItem');
            break;
    }
}
function hideInteractiveMenu(){
    document.getElementById("InteractiveChannel").style.display = 'none';
    CurrentModule = "Tv";
}
function addUser(){
    currentInteractive = "addUser";
    document.getElementById("SelectUsers").style.display = "none";
    document.getElementById("InteractiveAddUser").style.display = "block";
    document.getElementById("keyboard").style.display = "block";
}
function newUser(name){
    var valid = true;
    for(var i=0; i<usersData.length; i++){
        if(usersData[i].name == name){
            valid = false;
            break;
        }
    }
    if(valid == true){
        $.ajax({
            type: 'POST',
            url: ServerSource + 'Core/Controllers/Interactivo.php',
            async:false,
            data: {
                Option : 'newUser',
                macDevice : MacAddress,
                newUser: name
            },
            success: function (response){
                register = $.parseJSON(response);
                selectUser({'id_user': register, 'name': name});
            }
        });
    }else{
        alert("Este Nombre De Usuario Ya Existe");
    }
}

function random(min, max) {
    var r = Math.round(Math.random() * (max - min) + parseInt(min));
    return r;
}

function random(min, max, ex) {
    r = Math.round(Math.random() * (max - min) + parseInt(min));
    if (r === ex) r++;
    if (r > max) r = r - 2;
    return r;
}

function getSColor(n) {
    switch (n) {
        case 1: color = 1; return "green-sea";
        case 2: color = 2; return "nephritis";
        case 3: color = 3; return "belize-hole";
        case 4: color = 4; return "wisteria";
        case 5: color = 5; return "orange";
        case 6: color = 6; return "pumpkin";
        case 7: color = 7; return "pomegranate";
    }
}

var keyposition, keyvalue, parentKey, antkey;

function KeyboardDirection(direction){
    keyposition = document.getElementsByClassName("buttonSelected");
    if(keyposition.length == 0){
        keyposition = document.getElementsByClassName("buttonSpaceSelected");
        if(keyposition.length == 0){
            keyposition = document.getElementsByClassName("buttonSearchSelected"); 
            if(keyposition.length == 0){
                keyposition = document.getElementsByClassName("buttonSelectSelected"); 
            }
        }
    }
    switch(direction){
        case "UP":
            if(keyposition[0].parentNode.id !== "keyboard1"){
                if(keyposition[0].className == "buttonSelected"){
                    if(keyposition[0].parentNode.id == "keyboard2"){
                        antkey =parseInt(keyposition[0].id)-10;
                    }else{
                        antkey = (parseInt(keyposition[0].id)==10)?parseInt(keyposition[0].id)-9:parseInt(keyposition[0].id)-8;
                    }
                    keyposition[0].className = "button";
                    document.getElementById(antkey).className = 'buttonSelected';
                }else if(keyposition[0].className == "buttonSpaceSelected"){
                    keyposition[0].className = "buttonSpace";
                    document.getElementById("22").className = "buttonSelected"
                }else if(keyposition[0].className == "buttonSearchSelected"){
                    keyposition[0].className ="buttonSearch";
                    document.getElementById("26").className = "buttonSelected"
                }else if(keyposition[0].className == "buttonSelectSelected"){
                    keyposition[0].className ="buttonSelect";
                    document.getElementById("27").className = "buttonSelected"
                }
            }        
            break;
        case "DOWN":
            if(keyposition[0].parentNode.id !== "keyboard4"){
                if(parseInt(keyposition[0].id) >= 25 ){
                    keyposition[0].className ="button";
                    document.getElementById("29").className = "buttonSelectSelected";
                }else if(parseInt(keyposition[0].id) >= 20){
                    keyposition[0].className ="button";
                    document.getElementById("28").className = "buttonSpaceSelected";
                }else{
                    if(keyposition[0].parentNode.id == "keyboard2"){
                        antkey = (parseInt(keyposition[0].id)==11)?parseInt(keyposition[0].id)+9: parseInt(keyposition[0].id)+8;
                    }else{
                        antkey = (parseInt(keyposition[0].id)==10)?parseInt(keyposition[0].id)+9:parseInt(keyposition[0].id)+10;
                    }
                    keyposition[0].className = "button";
                    document.getElementById(antkey).className = 'buttonSelected';
                }
            }
            break;
        case "LEFT":
            if(parseInt(keyposition[0].id) == 29){
                keyposition[0].className = "buttonSelect";
                document.getElementById("28").className = "buttonSpaceSelected";
            }else if((parseInt(keyposition[0].id) >= 2 && parseInt(keyposition[0].id) <11) || (parseInt(keyposition[0].id) >= 12 && parseInt(keyposition[0].id) <20) || (parseInt(keyposition[0].id) >= 21 && parseInt(keyposition[0].id) <28)){
                antkey = parseInt(keyposition[0].id)-1;
                keyposition[0].className = "button";
                document.getElementById(antkey).className = 'buttonSelected';
            }
            break;
        case "RIGHT":
            if(parseInt(keyposition[0].id) == 28){
                keyposition[0].className = "buttonSpace";
                document.getElementById("29").className = "buttonSelectSelected";
            }else if((parseInt(keyposition[0].id) >= 1 && parseInt(keyposition[0].id) <10) || (parseInt(keyposition[0].id) >= 11 && parseInt(keyposition[0].id) <19) || (parseInt(keyposition[0].id) >= 20 && parseInt(keyposition[0].id) <27)){
                antkey = parseInt(keyposition[0].id)+1;
                keyposition[0].className = "button";
                document.getElementById(antkey).className = 'buttonSelected';
            }
            break;
        case "OK":
            if(parseInt(keyposition[0].id)<=26 && document.getElementById("AddText").textContent.length<7){
                if(visibleSearchBox == false){
                    document.getElementById("AddText").textContent = document.getElementById("AddText").textContent + keyposition[0].outerText;
                }else{
                    document.getElementById("InteractiveSearchBox").textContent = document.getElementById("InteractiveSearchBox").textContent + keyposition[0].outerText;
                }
            }else if(parseInt(keyposition[0].id)==27){
                if(visibleSearchBox == false){
                    document.getElementById("AddText").textContent = document.getElementById("AddText").textContent.substring(0, document.getElementById("AddText").textContent.length - 1);
                }else {
                    document.getElementById("InteractiveSearchBox").textContent = document.getElementById("InteractiveSearchBox").textContent.substring(0, document.getElementById("InteractiveSearchBox").textContent.length - 1);
                }
            }else if(parseInt(keyposition[0].id)==28 && document.getElementById("AddText").textContent.length<7){
                if(visibleSearchBox == false){
                    document.getElementById("AddText").textContent = document.getElementById("AddText").textContent + " ";
                }else{
                    document.getElementById("InteractiveSearchBox").textContent = document.getElementById("InteractiveSearchBox").textContent + " ";
                }
            }else if(parseInt(keyposition[0].id)==29){
                if(visibleSearchBox == true){
                    searchProgram(document.getElementById("InteractiveSearchBox").textContent);
                }
            }
            break;
    }
}
function KeyboardNumeric(Number){
    document.getElementById("AddText").value = document.getElementById("AddText").value + Number;
}