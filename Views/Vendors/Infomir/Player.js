    // @ts-nocheck
    /* Creado por: Tania Maldonado
    * Fecha: Noviembre 2019
    * Tipo: Reproductor tv
    * Vendor: Infomir
    */

    // Variables globales
    var PlayingChannel  = false,
        PlayingRecordPlaylist = false
        PlayingRecordPlaylist2 = false,
        PlayingVod      = true,
        PauseLive       = false,
        URLLog          = '',
        skipCommerialrest = 0;

    var updatingMoviePosition = null;
    var banderaDePrueba = false;
    
    var numberFilesGlobal = 0,
        positionFile      = 0,
        RecordsPlaylist,
        SecondsOfRecord = 0,
        durationFull,
        pltActive = false,
        UpdateSecondsRecord = null,
        chapters = [],
        positionChapter = 0;

    var WindowMaxWidth  = 0,
        WindowMaxHeight = 0,
        WindowMinWidth  = 0,
        WindowMinHeight = 0;

    var deviceModer = gSTB.GetDeviceModel(),
        macDevice = gSTB.GetDeviceMacAddress();


    var player = stbPlayerManager.list[0];
    //gSTB.SetTopWin(0);

    player.videoWindowMode = 1;
    player.aspectConversion = 0;

    if(deviceModer !== 'MAG520' && deviceModer !=='MAG524' && deviceModer !=='MAG522v2'){
        var player2 = stbPlayerManager.list[1];
        player2.videoWindowMode = 0;
        player2.aspectConversion = 5;    
    }
    var Swap            = false,
        Playlist        = '',
        IndexPlaylist   = -1;
    var idSeconds       = null,
        idPosition      = null,
        RewFor          = null,
        Position        = 0,
        TimeShiftStart  = 0,
        seconds         = 0,
        NewSpeed        = 0,
        isPause         = false;
    LengthPlaylist  = 0;

    GetWindowFullSize();
    GetWindowMinSize();

    /* Set the preset window over others.
    * 0 	graphic window
    * 1 	video window   */

    gSTB.SetTopWin(0);

    var storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
    var USB = storageInfo.result || [];
    if((deviceModer == 'MAG424' || deviceModer =='MAG524') && (USB.length !== 0)){
        // set folder for saving TimeShift buffer data
        timeShift.SetTimeShiftFolder(USB[0].mountPath+"/records");
        timeShift.SetMaxDuration(7500);
        // set mode which defines what happens after reaching the left boundary of TimeShift buffer in paused mode
        timeShift.SetSlidingMode(true);
    }

    var Ext = gSTB.StandBy(false);

    /* *****************************************************************************
    * Reproductor de canal
    * ****************************************************************************/

    function PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition){
        
        var CheckPort = '';
        StopVideo();
        
        if((deviceModer == 'MAG424' || deviceModer =='MAG524') && (USB.length !== 0)){
            
            //Establece de forma manual la posicion en la que se encuentra el reproductor de video
            if(idPosition !== null){
                clearInterval(idPosition);
                idPosition = null;
                Position = 0;
                idPosition = setInterval(updatePosition,1000);
            }else{
                Position = 0;
                idPosition = setInterval(updatePosition,1000);
            }
            if(idSeconds !== null){
                timeShift.ExitTimeShift();
                clearInterval(idSeconds);
                seconds = 0;
                Position = 0;
                idSeconds = null;
                TvPlay();
                SwapPausePlay = true;
                ResumeVideo();
                idSeconds = setInterval(updateSeconds,1000);
                if(RewFor !== null){
                    clearInterval(RewFor);
                    RewFor = null;
                    NewSpeed = 0;
                }
            }else{
                Debug("############################################");
                seconds = 0;
                Position = 0;
                idSeconds = null;
                TvPlay();
                //SwapPausePlay = true;
                ResumeVideo();
                idSeconds = setInterval(updateSeconds,1000);
                if(RewFor !== null){
                    clearInterval(RewFor);
                    RewFor = null;
                }
            }
        }
        if(Port){
            CheckPort = ':' + Port;
        }
        // Detiene el proceso de la reproduccion anterior
        Source = Source.replace('igmp','udp');
        Source = (Source).slice(0, 6) + "@" + (Source).slice(6);
        URLLog = Source+CheckPort;
        
        Debug("Source "+ Source +" Port "+CheckPort);
        
        //gSTB.Play(Source + CheckPort);
        if((deviceModer == 'MAG424' || deviceModer =='MAG524') && (USB.length !== 0)){

            player.play({
                uri: Source + CheckPort,
                solution: 'extTimeShift',
                //program: ProgramIdPosition
            });
        }else{
            player.play({
                uri: Source + CheckPort,
                solution: 'rtp',
                //program: ProgramIdPosition
            });
        }

        // Maximiza el video en caso de que no este en pantalla completa
        MaximizeTV();
        // Activamos la bandera
        PlayingChannel = true;

        // Si la guia esta cerrada muestra cuadro con informacion del canal en reproduccion
        ShowInfo();

        // Si tiene una fecha ya registrada guarda estadisticas en la BD
        if(StartDateChannel !== ''){
            SetChannelStatistics();
        }

        // Actualiza la fecha inicio de la reproduccion del canal */
        StartDateChannel = new Date();
    }


    function PlayChannel2(url){
        if((deviceModer == 'MAG424' || deviceModer =='MAG524' || macDevice == '00:1a:79:6d:d0:7a' || macDevice == '00:1a:79:6d:d1:03' || macDevice == '00:1a:79:6d:d1:a3' || macDevice == '00:1a:79:6d:c6:ff' || macDevice == '00:1a:79:6d:d0:7a' || macDevice == '00:1a:79:72:cb:f7' || macDevice == '00:1a:79:72:4a:9d' || macDevice == '00:1a:79:72:cb:99' || macDevice == '00:1a:79:74:b7:66' || macDevice == '00:1a:79:72:c7:13' || macDevice == '00:1a:79:72:cc:79' || macDevice == '00:1a:79:72:cb:de' || macDevice == '00:1a:79:72:cb:e7' || macDevice == '00:1a:79:70:06:f1' || MacAddress == '00:1a:79:6d:c7:c1') && (USB.length !== 0)){
            player.play({
                uri: url,
                solution: 'extTimeShift'
            });
        }else{
            player.play({
                uri: url,
                solution: 'auto'
            }); 
        }
    }

    /* *****************************************************************************
    * Reproduce canales digitales
    * ****************************************************************************/

    function PlayDigitalChannel(Source){
        StopVideo();
        player.play({
            uri: Source,
            solution: 'ffrt3'
        });    
        MaximizeTV();
        PlayingChannel = true;
        if(StartDateChannel !== ''){
            SetChannelStatistics();
        }
        StartDateChannel = new Date();
    }
    var Playlist = '',
        IndexPlaylist = 0;
        LengthPlaylist = 0;

    function PlayVideo(Source){
       
        chapters = [];
        var conti = false;
        if(PlayingRecording===true){
            conti = true;
        }
        StopVideo();
        if(conti == true){
            PlayingRecording = true;
        }
        Debug('---------------> 1');
        if(CurrentModule === 'Tv'){
            Debug('---------------> 1.1');
            if(Source.indexOf('pvr') !== -1 || Source.indexOf('rtsp') !== -1){
            
                player.play({
                    uri: Source+"/",
                    solution: 'rtsp'
                });
            }else{
                Source = Source.replace(/\s+/g, '');
                Debug('--------------->>> '+Source);
                player.play({
                    uri: Source,
                    solution: 'auto'
                });
                
            }
        }else {
            player.play({
                uri: Source,
                solution: 'ffrt3'
            });
        }
        MaximizeTV();
    }
    function PlayMovie(Source, pos){
        player.play({
            uri: Source,
            solution: 'auto',
            position: pos
        });
        if(updatingMoviePosition !== null){
            clearInterval(updatingMoviePosition);
            updatingMoviePosition = null;
        }
        setTimeout(function() {
            Debug("=================== Audio Pids"+ JSON.stringify(player.subtitlesTracks));
        }, 10);
        updatingMoviePosition = setInterval(updateMoviePosition, 1000);
    }
    function setSubtitles(option, sour){
        if(option){
            var actualPosition = player.position;
            StopVideo();
            PlayMovie(actualSources + "_sub.mp4", actualPosition)
        }else{
            var actualPosition = player.position;
            StopVideo();
            PlayMovie(actualSources + ".mp4", actualPosition)
        }
    }
    function getMovieLanguage(Option){
        if(Option == "Audio"){
            return player.audioTracks;
        }else if(Option == "Subtitles"){
            return player.subtitlesTracks;
        }else if(Option == "currentAudio"){
            return player.audioPID;
        }else if(Option == "currentSubtitle"){
            return player.subtitlesPID;
        }
    }

    function updateMoviePosition(){
        var percentage = ( player.position / player.duration ) * 100;
        $("#custom-seekbar span").css("width", percentage+"%");
    
        var hour = Math.floor(player.position / 3600);
        hour = (hour < 10)? '0' + hour : hour;
        var minute = Math.floor((player.position / 60) % 60);
        minute = (minute < 10)? '0' + minute : minute;
        var second = Math.floor(player.position % 60);
        second = (second < 10)? '0' + second : second;
        var actual = hour + ':' + minute+ ':' + second;

        hour = Math.floor(player.duration / 3600);
        hour = (hour < 10)? '0' + hour : hour;
        minute = Math.floor((player.duration / 60) % 60);
        minute = (minute < 10)? '0' + minute : minute;
        second = Math.floor(player.duration % 60);
        second = (second < 10)? '0' + second : second;
        var total = hour + ':' + minute + ':' + second;

        document.getElementById("timeProgress").innerText =actual+" / "+total;
    }

    function speedMovie(Option){
        if(Option == "forward"){
            if(player.duration > player.position+10){
                player.position = player.position + 10;
                // player.position = player.duration - 20;
            
            }
        }else if(Option == "backward"){
            var actual = player.position-11;
            if(actual >= 0){
                player.position = actual;
            }
        }else if(Option == "fastForward"){
            if(player.duration > player.position+10){
                player.position = player.position + 600;
                // player.position = player.duration - 20;
            
            }
        }else if(Option == "fastBackward"){
            var actual = player.position-600;
            if(actual >= 0){
                player.position = actual;
            }
        }
    }

    function PlayRecordsPlaylist(filename, numberFiles, durationParts){
        Debug("ENTRO A PlayRecordsPlaylist");
        Debug("ENTRO A PlayRecordsPlaylist");
        PlayingRecordPlaylist = false;
        positionFile = 0;
        numberFilesGlobal = 0;
        
        // if((deviceModer !== "MAG424" && deviceModer !=="MAG524") && macDevice != '00:1a:79:6d:d0:7a' && macDevice != '00:1a:79:6d:d1:03' && macDevice != '00:1a:79:6d:d1:a3' && macDevice != '00:1a:79:6d:c6:ff' && macDevice != '00:1a:79:6d:d0:7a' && macDevice != '00:1a:79:72:cb:f7' && macDevice != '00:1a:79:72:4a:9d' && macDevice != '00:1a:79:72:cb:99' && macDevice != '00:1a:79:74:b7:66' && macDevice != '00:1a:79:72:c7:13' && macDevice != '00:1a:79:72:cc:79' && macDevice != '00:1a:79:72:cb:de' && macDevice != '00:1a:79:72:cb:e7' && macDevice != '00:1a:79:70:06:f1'){
        //     var source2 = filename.split('/');
        //     filename = "http://10.30.0.17/INFOMIR_RECORDINGS/" + source2[4]; 
        // }
        RecordsPlaylist = [filename];
        durationFull = parseFloat(durationParts) * 60;
        SecondsOfRecord = 0;
        for(x = 1; x <= numberFiles; x++){
            RecordsPlaylist.push(filename+x);
        }
        var conti = false;
        if(PlayingRecording===true){
            conti = true;
        }
        StopVideo();
        if(conti == true){
            PlayingRecording = true;
        }
        PlayingRecordPlaylist = true;
        positionFile = 0;
        numberFilesGlobal = RecordsPlaylist.length-1;
        for(var x = 0; x<RecordsPlaylist.length; x++){
            RecordsPlaylist[x] = RecordsPlaylist[x].replace(/\s+/g, '');
        }
        player.play({
            uri: RecordsPlaylist[0],
            solution: 'auto'
        });
        if(UpdateSecondsRecord === null){
            UpdateSecondsRecord = null;
            UpdateSecondsRecord = setInterval(SecondsOfRecordFun,1000);
        }else{
            clearInterval(UpdateSecondsRecord);
            UpdateSecondsRecord = null;
            UpdateSecondsRecord = setInterval(SecondsOfRecordFun,1000);
        }
        
    }

    function GetRaws(Source){
        var RawSource = Source.replace('rtsp','http') + '/raw/';
        RawSource = RawSource.replace('554','8080');

        Debug(RawSource);

        $.ajax({
            type: 'POST',
            async: false,
            url: 'Core/Controllers/GetRaws.php',
            data : {
                SourceRaw: RawSource
            },
            success: function(data){
                Playlist = $.parseJSON(data);

                LengthPlaylist = Playlist.length;

                Debug('---------- LengthPlaylist= '+LengthPlaylist);

                if(LengthPlaylist === 0){
                    Debug('---------- Stop record, sorry= '+LengthPlaylist);
                    PlayingRecording =  false;

                    ShowRecorderMessage('Sorry for the incoveniences, it will be activated at short term.');

                    StopVideo();

                    HideBarStatus();

                    SetChannel('');
                } else {
                    LengthPlaylist--;

                    DualPlay();
                }
            }
        });
    }

    function SwapPlayers(){
        Debug('--------------> SwapPlayers > Swap = '+Swap);
        if(Swap === false){
            Debug('--------------> SwapPlayers > FALSE ');
            player2.resume();
            Debug('--------------> SwapPlayers > player2.resume ');
            stbPlayerManager.swap(player, player2);
            Debug('--------------> SwapPlayers > stbPlayerManager.swap ');
            Swap = true;
            Debug('--------------> SwapPlayers > Swap = '+Swap);
            IndexPlaylist++;
            if(IndexPlaylist < LengthPlaylist){
                player.play({
                    uri: Playlist[IndexPlaylist],
                    solution: 'auto'
                });
            }
        } else {
            player.resume();
            stbPlayerManager.swap(player2, player);
            Swap = false;

            IndexPlaylist++;
            if(IndexPlaylist < LengthPlaylist){
                player2.play({
                    uri: Playlist[IndexPlaylist],
                    solution: 'auto'
                });
            }
        }
    }
    /* *****************************************************************************
    * Obtiene los tamanos maximos y minimos de la pantalla
    * ****************************************************************************/
    function GetWindowFullSize(){
        WindowMaxWidth   = player.viewport.width;
        WindowMaxHeight  = player.viewport.height;
    }

    function GetWindowMinSize(){
        WindowMinWidth   = Math.round((player.viewport.width*35)/100);
        WindowMinHeight  = Math.round((player.viewport.height*35)/100);
    }

    /* *****************************************************************************
    * Funcion para poner TV en pantalla completa
    * ****************************************************************************/

    function MaximizeTV(){   
        player.fullscreen = true;
    }

    /* *****************************************************************************
    * Funcion para minimizar la TV
    * ****************************************************************************/

    function MinimizeTV(){
        //player.setViewport({x: (20*WindowMaxWidth)/100, y: (8*WindowMaxWidth)/100, width: WindowMinWidth, height: WindowMinHeight});
            player.setViewport({
            x: Math.round((12*WindowMaxWidth)/100),
              y: Math.round((8*WindowMaxHeight)/100), 
              width: WindowMinWidth, 
              height: WindowMinHeight});
    }

    /* *****************************************************************************
    * Reinicia el dispositivo
    * ****************************************************************************/

    function RebootDevice(){
        gSTB.ExecAction('reboot');
    }

    /* *****************************************************************************
    * Funcion para detener la reproduccion de un video, multicast, etc.
    * ****************************************************************************/

    function StopVideo(){
        if(UpdateSecondsRecord !== null){
            clearInterval(UpdateSecondsRecord);
            UpdateSecondsRecord = null;
        }
        if(updatingMoviePosition !== null){
            clearInterval(updatingMoviePosition);
            updatingMoviePosition = null;
        }
        player.stop();
        if(deviceModer !== 'MAG520' && deviceModer !=='MAG524'  && deviceModer !=='MAG522v2'){
            if(player2.state !== 0){
                player2.stop();
            }
        }
        PlayingRecording = false;
        PlayingRecordPlaylist = false;
        PlayingRecordPlaylist2 = false;
        if(PauseLive === true){
            HideBarStatus();
        }
        pltActive = false;
    }

    function PauseVideo(){
        if((deviceModer == 'MAG424' || deviceModer =='MAG524' || macDevice == '00:1a:79:6d:d0:7a' || macDevice == '00:1a:79:6d:d1:03' || macDevice == '00:1a:79:6d:d1:a3' || macDevice == '00:1a:79:6d:c6:ff' || macDevice == '00:1a:79:6d:d0:7a' || macDevice == '00:1a:79:72:cb:f7' || macDevice == '00:1a:79:72:4a:9d' || macDevice == '00:1a:79:72:cb:99' || macDevice == '00:1a:79:74:b7:66' || macDevice == '00:1a:79:72:c7:13' || macDevice == '00:1a:79:72:cc:79' || macDevice == '00:1a:79:72:cb:de' || macDevice == '00:1a:79:72:cb:e7' || macDevice == '00:1a:79:70:06:f1' || MacAddress == '00:1a:79:6d:c7:c1') && (USB.length !== 0)){
            timeShift.EnterTimeShift();
            TimeShiftStart = Position;
        }
        if(RewFor !== null){
            clearInterval(RewFor);
            RewFor = null;
            NewSpeed = 0;
        }
        pltActive = true;
        if(UpdateSecondsRecord !== null){
            clearInterval(UpdateSecondsRecord);
            UpdateSecondsRecord = null;
        }
        player.pause();
    }
    function updateSeconds(){
        if(seconds-TimeShiftStart<7500){
            seconds += 1;
        }
        //Debug("#################################3       "+seconds);
    }
    function updatePosition(){
        if(player.state != 3){
            Position += 1;
        }
    }

    function UpdatePositionVod(Option){
        PositionAssetVod = gSTB.GetPosTimeEx();
        (Option === 'add') ? PositionAssetVod += 30000: PositionAssetVod -= 30000;
        gSTB.SetPosTimeEx(PositionAssetVod);
        PositionAssetVod = gSTB.GetPosTimeEx();
        Debug(PositionAssetVod); 
    }

    function ResumeVideo(){
        Debug("=======> ResumeVideo");

        if(RewFor !== null){
            clearInterval(RewFor);
            NewSpeed = 0;
            RewFor = null;
        }
        player.resume();
        if(UpdateSecondsRecord === null && (PlayingRecordPlaylist == true || PlayingRecordPlaylist2 == true) && pltActive == true){
            clearInterval(UpdateSecondsRecord);
            UpdateSecondsRecord = null;
            UpdateSecondsRecord = setInterval(SecondsOfRecordFun,1000);
        }
    }
    function SecondsOfRecordFun(){
        SecondsOfRecord = SecondsOfRecord + 1;
    }

    function SpeedVideo(Speed){
        //player.speed = parseInt(Speed);
        if(Speed == (-2)){
            Speed = -4;
        }
        if(RewFor === null){
            NewSpeed = Speed;
            RewFor = setInterval(updateRewFor,1000);
        }else{
            NewSpeed = 0;
            clearInterval(RewFor);
            RewFor = null;
            NewSpeed = Speed;
            RewFor = setInterval(updateRewFor,1000);
        } 
    }
    function updateRewFor(){
        //Debug("############3    "+player.position + "   E############");
        Debug('PauseLive = '+PauseLive);
        if(PauseLive === true && PlayingRecording === false){
            if(parseInt(Position) + (parseInt(NewSpeed)-1) >=parseInt(seconds) || (parseInt(Position) + (parseInt(NewSpeed)-1) <=parseInt(TimeShiftStart)+2)){
                Debug(' =====>>> Se pasa por alguna razón ');
                
                clearInterval(RewFor);
                TvPlay();
            }else{
                Debug(' =====>>> Si entra ' + player.duration);
                if(NewSpeed<0){
                    player.position = parseInt(player.position) + (parseInt(NewSpeed)-1);
                }else{
                    player.position = parseInt(player.position) + parseInt(NewSpeed);
                }    
                Position = parseInt(Position) + parseInt(NewSpeed);
            }
        }else {
            if(PlayingRecordPlaylist == false && PlayingRecordPlaylist2 == false){
                if(parseInt(player.position) + parseInt(NewSpeed) >= player.duration || parseInt(player.position) + parseInt(NewSpeed) <= 0){
                    Debug("############3    Se Pasa: "+parseInt(player.duration) + "############");
                    clearInterval(RewFor);
                    NewSpeed = 0;
                    TvPlay();
                }else{
                    player.position += parseInt(NewSpeed);
                    Position = parseInt(Position) + parseInt(NewSpeed);
                    //Debug("############3    player.position "+parseInt(player.position) + "   E############");
                }
            }else{
                if(parseInt(SecondsOfRecord) + parseInt(NewSpeed) >= (durationFull-5) || parseInt(SecondsOfRecord) + parseInt(NewSpeed) <= 0){
                    Debug("############3    Se Pasa: "+parseInt(durationFull) + "############");
                    clearInterval(RewFor);
                    TvPlay();
                }else{
                    if(parseInt(player.position) + parseInt(NewSpeed) <= parseInt(player.duration)-2){
                        if(deviceModer == "MAG424" || deviceModer == "MAG524" || macDevice == '00:1a:79:6d:d0:7a' || macDevice == '00:1a:79:6d:d1:03' || macDevice == '00:1a:79:6d:d1:a3' || macDevice == '00:1a:79:6d:c6:ff' || macDevice == '00:1a:79:6d:d0:7a' || macDevice == '00:1a:79:72:cb:f7' || macDevice == '00:1a:79:72:4a:9d' || macDevice == '00:1a:79:72:cb:99' || macDevice == '00:1a:79:74:b7:66' || macDevice == '00:1a:79:72:c7:13' || macDevice == '00:1a:79:72:cc:79' || macDevice == '00:1a:79:72:cb:de' || macDevice == '00:1a:79:72:cb:e7' || macDevice == '00:1a:79:70:06:f1' || MacAddress == '00:1a:79:6d:c7:c1'){
                            player.position += parseInt(NewSpeed);
                            SecondsOfRecord = SecondsOfRecord + parseInt(NewSpeed);
                            Position = parseInt(Position) + parseInt(NewSpeed);
                        }else{
                            if((parseInt(player.position) + parseInt(NewSpeed) <= 16) && NewSpeed < 0 && positionFile>0){
                                banderaDePrueba == true;
                                PlayingRecordPlaylist = true;
                                PlayingRecordPlaylist2 = false;
                                positionFile = positionFile-1;
                                player.play({
                                    uri: RecordsPlaylist[positionFile],
                                    solution: 'auto',
                                });
                                player.position = player.duration - 5;
                                SecondsOfRecord = SecondsOfRecord - 6;
                            }else {
                                player.position += parseInt(NewSpeed);
                                SecondsOfRecord = SecondsOfRecord + parseInt(NewSpeed);
                                Position = parseInt(Position) + parseInt(NewSpeed);
                            }
                        }
                    }
                }
            }
        }
    }

    function SkipCommercials(dir){
        if(dir == "right"){
            if(PlayingRecordPlaylist == false && PlayingRecordPlaylist2 == false ){
                if((parseInt(player.position) + 60)<parseInt(player.duration)){
                    player.position = parseInt(player.position) + parseInt(60);
                }
            }else{
                if((parseInt(player.position) + 60)<parseInt(player.duration)){
                    player.position = parseInt(player.position) + parseInt(60);
                    SecondsOfRecord = SecondsOfRecord + 60;
                }else if(positionFile < numberFilesGlobal){
                    skipCommerialrest =(parseInt(player.duration) - parseInt(player.position));
                    positionFile++;
                    player.play({
                        uri: RecordsPlaylist[positionFile],
                        solution: 'auto'
                    });
                    if(positionFile == numberFilesGlobal){
                        PlayingRecordPlaylist = false;
                        PlayingRecordPlaylist2 = true;
                    }
                    setTimeout(function(){
                        player.position = (60 - skipCommerialrest);
                    },500);
                    SecondsOfRecord = SecondsOfRecord + 60;
                }
            }
        }else{
            if(PlayingRecordPlaylist == false && PlayingRecordPlaylist2 == false){
                if(parseInt(player.position) > 7){
                    player.position = parseInt(player.position) - parseInt(7);
                }else{
                    player.position = 1;
                }
            }else{
                if(parseInt(player.position)>parseInt(7)){
                    player.position = parseInt(player.position) - parseInt(7);
                    SecondsOfRecord = SecondsOfRecord-7;
                }else if(positionFile>0){
                    skipCommerialrest = (parseInt(7) - parseInt(player.position));
                    positionFile = positionFile-1;
                    player.play({
                        uri: RecordsPlaylist[positionFile],
                        solution: 'auto',
                    });
                    setTimeout(function(){
                        player.position = player.duration - skipCommerialrest-10;
                    },500);
                    SecondsOfRecord = SecondsOfRecord - 17;
                }else{
                    SecondsOfRecord=1;
                    player.position = 1;
                }
            }
        }
        
    }

    function SkipChapterRecord(direccionSkip){
        var durationSkip;
        if(PlayingRecordPlaylist == false && PlayingRecordPlaylist2 == false){
            durationSkip = player.duration;
        }else{
            durationSkip = durationFull;
        }
        
        if(chapters.length == 0 && durationSkip > 300){
            chapters.push(0);
            if(durationSkip > 300 && durationSkip<= 600){
                for(var i = 0; i < Math.floor(durationSkip/60); i++){
                    chapters.push((i+1)*60);
                }
            }else if(durationSkip > 600 && durationSkip<= 1200){
                for(var i = 0; i < Math.floor(durationSkip/120); i++){
                    chapters.push((i+1)*120);
                }
            }else if(durationSkip > 1200 && durationSkip<= 1800){
                for(var i = 0; i < Math.floor(durationSkip/300); i++){
                    chapters.push((i+1)*300);
                }
            }else if(durationSkip > 1800 && durationSkip<= 2400){
                for(var i = 0; i < Math.floor(durationSkip/480); i++){
                    chapters.push((i+1)*480);
                }
            }else if(durationSkip > 2400){
                for(var i = 0; i < Math.floor(durationSkip/600); i++){
                    chapters.push((i+1)*600);
                }
            }
        }

        if(chapters.length != 0){
            if(PlayingRecordPlaylist == false && PlayingRecordPlaylist2 == false){

                for(var x = 0; x < chapters.length; x++){
                    if(x == (chapters.length-1)){
                        if(player.position>chapters[chapters.length-1]){
                            positionChapter = chapters.length-1;
                            //ShowRecorderMessage("X1=" + x + " " + chapters[x]);
                        }
                    }if(x == 0 ){
                        if(player.position<chapters[x+1]){
                            positionChapter = x;
                            //ShowRecorderMessage("X2=" + x + " " + chapters[x]);
                        }
                    }else if(x>0){
                        if(player.position>chapters[x] && player.position<chapters[x+1]){
                            positionChapter = x;
                            //ShowRecorderMessage("X3=" + x + " " + chapters[x]);
                        }
                    }
                }

                if(direccionSkip == "forward" && positionChapter<chapters.length-1){
                    positionChapter = positionChapter + 1;
                    player.position = chapters[positionChapter];
                }
                if(direccionSkip == "backward" && positionChapter>0){
                    positionChapter = positionChapter - 1;
                    player.position = chapters[positionChapter];
                }
            }else{
                for(var x = 0; x < chapters.length; x++){
                    if(x == (chapters.length-1)){
                        if(SecondsOfRecord>chapters[chapters.length-1]){
                            positionChapter = chapters.length-1;
                            //ShowRecorderMessage("X1=" + x + " " + chapters[x]);
                        }
                    }if(x == 0 ){
                        if(SecondsOfRecord<chapters[x+1]){
                            positionChapter = x;
                            //ShowRecorderMessage("X2=" + x + " " + chapters[x]);
                        }
                    }else if(x>0){
                        if(SecondsOfRecord>chapters[x] && SecondsOfRecord<chapters[x+1]){
                            positionChapter = x;
                            //ShowRecorderMessage("X3=" + x + " " + chapters[x]);
                        }
                    }
                }

                if(direccionSkip == "forward" && positionChapter<chapters.length-1 && SecondsOfRecord < chapters[positionChapter+1]){
                    positionChapter = positionChapter+1
                    var salto = chapters[positionChapter] - SecondsOfRecord;
                    var salto2 = player.duration - player.position;
                    if(salto>salto2){
                        positionFile++;
                        player.play({
                            uri: RecordsPlaylist[positionFile],
                            solution: 'auto'
                        });
                        if(positionFile == numberFilesGlobal){
                            PlayingRecordPlaylist = false;
                            PlayingRecordPlaylist2 = true;
                        }
                        setTimeout(function(){
                            if(player.duration>(salto-salto2)){
                                player.position = salto - salto2;
                            }else{
                                var s = player.duration;
                                positionFile++;
                                player.play({
                                    uri: RecordsPlaylist[positionFile],
                                    solution: 'auto'
                                });
                                if(positionFile == numberFilesGlobal){
                                    PlayingRecordPlaylist = false;
                                    PlayingRecordPlaylist2 = true;
                                }
                                setTimeout(function(){
                                    player.position = salto - salto2-s; 
                                },500);
                            }
                            
                        },500);
                        SecondsOfRecord = chapters[positionChapter]+1;
                    }else{
                        player.position = parseInt(player.position) + parseInt(salto);
                        SecondsOfRecord = chapters[positionChapter];
                    }
                }
                if(direccionSkip == "backward" && positionChapter>0){
                    positionChapter = positionChapter - 1
                    var salto = SecondsOfRecord - chapters[positionChapter];
                    if(salto>player.position){
                        positionFile= positionFile -1;
                        player.play({
                            uri: RecordsPlaylist[positionFile],
                            solution: 'auto'
                        });
                        if(positionFile == numberFilesGlobal){
                            PlayingRecordPlaylist = false;
                            PlayingRecordPlaylist2 = true;
                        }
                        setTimeout(function(){
                            player.position = (parseInt(SecondsOfRecord) - chapters[positionChapter+1])
                        },500);
                        SecondsOfRecord = chapters[positionChapter];
                    }else{
                        player.position = parseInt(player.position) + parseInt(salto);
                        SecondsOfRecord = chapters[positionChapter];
                    }
                }
            }

            
        }
    }
    /* *****************************************************************************
    * Obtiene la posicion del video en reproduccion (PAUSE LIVE Y GRABACIONES)
    * ****************************************************************************/

    function AssetStatus(Duration){
        //Debug('SecondsOfRecord  '+ SecondsOfRecord);
        if(PlayingRecording === true){
            if(PlayingRecordPlaylist == true || PlayingRecordPlaylist2 == true){
                PositionAsset = SecondsOfRecord;
                DurationAsset = parseInt(Duration,10) * 60;
                PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
            }else{
                PositionAsset = player.position;
                DurationAsset = parseInt(Duration,10) * 60;
                PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
            }        
        }else{ if (PauseLive === true){
            //alert('as');
            DurationAsset = Math.round(seconds);
            
            PositionAsset = Math.round(Position);
            //Debug('>>>>>> PositionAsset: '+PositionAsset);
            // if(DurationAsset !== 0){
            PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
            if(PercentagePosition > 100){
                PercentagePosition = 100;
            }
                //Debug('>>>>>> PercentagePosition: '+PercentagePosition);
                //DurationAsset = DurationAsset * 2;
            // }
            
        }}
    }
    
    function rebootInHour(){
        
    }


    // function AssetStatusVod(Duration){
    //     //alert(Duration);
    //     if(PlayingRecording === true || PlayingVod === true){
    //         PositionAsset = gSTB.GetPosTime();
    //         DurationAsset = parseInt(Duration,10) * 60;
    //         PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);     
    //     }else if (PauseLive === true){
    //         DurationAsset = Math.round(seconds);
    //         PositionAsset = Math.round(Position);
    //         PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
    //         if(PercentagePosition > 100){
    //             PercentagePosition = 100;
    //         }
    //     }
    // }