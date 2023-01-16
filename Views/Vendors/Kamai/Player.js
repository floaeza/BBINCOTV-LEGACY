// @ts-nocheck
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Reproductor tv
 * Vendor: Kamai
 */

    // Variables globales
    var PlayingChannel  = false,
        PlayingVod      = false,
        PlayDigita      = false,
        PauseLive       = false,
        PauseStatus     = false,
        pltActive           = false,
        HDMIstatus;

    var WindowMaxWidth  = 0,
        WindowMaxHeight = 0,
        WindowMinWidth  = 0,
        WindowMinHeight = 0,
        updatingMoviePosition = null;

        GetWindowFullSize();
        GetWindowMinSize();

    // Limpiar todo antes de comenzar con la reproducción de TV
        ENTONE.video.cleanupAll();

    // Variables kamai
    var Video   = new ENTONE.video(1,0);
        Video.setPltvBuffer(7200);

    Debug('#################################################################');

    /* *****************************************************************************
    * Reproductor de canal
    * ****************************************************************************/

    function PlayChannel(Source, Port){
        Debug('PlayChannel--------------------------------->> Source + CheckPort'+Source + ':'+ Port);
        
        var CheckPort = '';
        
            if(Port){
                CheckPort = ':' + Port;
            }
        
        if(PauseStatus = true){
            TvPlay();
            PauseStatus = false;
            ResumeVideo()
        }
        
        // Reproduce el canal actual 
        Source = Source.replace('igmp','udp');
        Debug(Source + ' ' + CheckPort);

        StopVideo();
        //alert(Source+":"+Port);
        Video.open(Source + CheckPort, null, {pltbuf:1000});
        //Video.open(Source + CheckPort);

        //ret = video.open(url, null, {pltbuf: 3600});
        //, null, {sync:0,seek_to_start:1}

        Debug('---->> Source + CheckPort');
        PlayDigita = false;
        Video.play(1);
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

        Video.setVideoCallback(HandleVideo);
    }
    
/* *****************************************************************************
 * Reproduce canales digitales
 * ****************************************************************************/
    
    function PlayDigitalChannel(Source){
        // Detiene el proceso de la reproduccion anterior
        StopVideo();

        // Reproduce el video
        Video.open(Source);

        Video.play(1);
        PlayDigita = false;
        // Maximiza el video en caso de que no este en pantalla completa
        MaximizeTV();

        // Activamos la bandera
        PlayingChannel = true;
        
        // Si tiene una fecha ya registrada guarda estadisticas en la BD
        if(StartDateChannel !== ''){
            SetChannelStatistics();
        }
           
        // Actualiza la fecha inicio de la reproduccion del canal */
        StartDateChannel = new Date();

        Video.setVideoCallback(HandleVideo);
    }
    
/* *****************************************************************************
 * Reproduce videos
 * ****************************************************************************/

    function PlayVideo(Source){
        // Guarda la estadistica
        StopVideo();

        // Reproduce el video
        Video.open(Source);

        Video.play(1);

        Video.setVideoCallback(HandleVideo);

        // Maximiza el video en caso de que no este en pantalla completa
        MaximizeTV();

        Video.setVideoCallback(HandleVideo);
    }
    function PlayMovie(Source, pos){
        Video.open(Source);
        Video.play(1);
        Video.setVideoCallback(HandleVideo);

        MaximizeTV();
        
        setTimeout(function(){Video.setPlayPosition(pos);},500);
        
        if(updatingMoviePosition !== null){
            clearInterval(updatingMoviePosition);
            updatingMoviePosition = null;
        }
        
        updatingMoviePosition = setInterval(updateMoviePosition, 1000);
    }
    function setSubtitles(option, sour){
        if(option){
            var actualPosition = Video.getPlayPosition();
            StopVideo();
            PlayMovie(actualSources + "_sub.mp4", actualPosition)
        }else{
            var actualPosition = Video.getPlayPosition();
            StopVideo();
            PlayMovie(actualSources + ".mp4", actualPosition)
        }
    }
    function updateMoviePosition(){
        var percentage = ((Video.getPlayPosition()/1000)/ (Video.getDuration()/1000) ) * 100;
        $("#custom-seekbar span").css("width", percentage+"%");
        
        var hour = Math.floor((Video.getPlayPosition()/1000) / 3600);
        hour = (hour < 10)? '0' + hour : hour;
        var minute = Math.floor(((Video.getPlayPosition()/1000) / 60) % 60);
        minute = (minute < 10)? '0' + minute : minute;
        var second = Math.floor((Video.getPlayPosition()/1000) % 60);
        second = (second < 10)? '0' + second : second;
        var actual = hour + ':' + minute+ ':' + second;

        hour = Math.floor((Video.getDuration()/1000) / 3600);
        hour = (hour < 10)? '0' + hour : hour;
        minute = Math.floor(((Video.getDuration()/1000) / 60) % 60);
        minute = (minute < 10)? '0' + minute : minute;
        second = Math.floor((Video.getDuration()/1000) % 60);
        second = (second < 10)? '0' + second : second;
        var total = hour + ':' + minute + ':' + second;

        document.getElementById("timeProgress").innerText =actual+" / "+total;
    }

    function speedMovie(Option){
        if(Option == "forward"){
            if(Video.getDuration() > Video.getPlayPosition()+10000){
                Video.setPlayPosition(Video.getPlayPosition() + 10000);
                // Video.setPlayPosition(Video.getDuration() - 20000);
            }
        }else if(Option == "backward"){
            var actual = Video.getPlayPosition()-11000;
            if(actual >= 10000){
                Video.setPlayPosition(actual);
            }
        }else if(Option == "fastForward"){
            if(Video.getDuration() > Video.getPlayPosition()+600000){
                Video.setPlayPosition(Video.getPlayPosition() + 600000);
                // Video.setPlayPosition(Video.getDuration() - 20000);
            }
        }else if(Option == "fastBackward"){
            var actual = Video.getPlayPosition()-610000;
            if(actual >= 0){
                Video.setPlayPosition(actual);
            }
        }
    }

    function SkipCommercials(dir){
        if(dir === "right"){
            if(((Video.getDuration()/1000) > (Video.getPlayPosition()/1000) + 60)){
                Video.setPlayPosition(Video.getPlayPosition() + 60000);
            }
        }else{
            if((0 < (Video.getPlayPosition()/1000) - 10)){
                Video.setPlayPosition(Video.getPlayPosition() - 10000);
            }
        }
    }

    function PreviewVideo(Source){
        // Guarda la estadistica
        StopVideo();

        // Reproduce el video
        Video.open(Source);
        
        Video.play(1); 

        SetPosition(400);
        
        // Maximiza el video en caso de que no este en pantalla completa
        MaximizeTV();
        
        PlayingVod = true;
    }
    
    function SetPosition(Pos){

    }
    
/* *****************************************************************************
 * Obtiene los tamanos maximos y minimos de la pantalla
 * ****************************************************************************/

    function GetWindowFullSize(){
        WindowMaxWidth   = window.screen.width;
        WindowMaxHeight  = window.screen.height;
    }
    
    function GetWindowMinSize(){
        WindowMinWidth   = ((window.screen.width)*34)/100;
        WindowMinHeight  = ((window.screen.height)*34)/100;
    }


/* *****************************************************************************
 * Funcion para poner TV en pantalla completa
 * ****************************************************************************/

    function MaximizeTV(){
            Video.setVideoPosition(0, 0, WindowMaxWidth, WindowMaxHeight, 0);
    }

/* *****************************************************************************
 * Funcion para minimizar la TV
 * ****************************************************************************/

    function MinimizeTV(){
            // Video.setVideoPosition(160, 65, WindowMinWidth, WindowMinHeight, 0);
            // Video.setVideoPosition(TvPositionLeft, TvPositionTop, WindowMinWidth, WindowMinHeight, 0);
            Video.setVideoPosition(TvPositionLeft, 1, WindowMinWidth, WindowMinHeight, 0);   
        }

/* *****************************************************************************
 * Reinicia el dispositivo
 * ****************************************************************************/ 
    function RebootDevice(){
        ENTONE.stb.reboot();
    }
    
/* *****************************************************************************
 * Opciones reproduccion
 * ****************************************************************************/ 
   
    function StopVideo(){
        Debug('StopVideo 1 ');
        if(typeof (Video) !== 'undefined'){
        //Verificar si se está reproduciento ya algo antes de poner una nueva fuente   
            if(Video.getPlayingUrl() !== null) {
                Debug('StopVideo !== undefined ');
                Video.stop();
                Video.close();
                Video.cleanup();
                //ENTONE.video.cleanupAll();
                Video = new ENTONE.video(1, 0);

                PlayingRecording = false;
            }
        }
        pltActive = false;
        PlayDigita = false;
        Debug('StopVideo 2 ');
        if(PauseLive === true){
            HideBarStatus();
        }
    }
    
    function PauseVideo(){
        PauseStatus = true;
        pltActive = true;
        Video.play(0);
    }
    
    function ResumeVideo(){
        Video.play(1);
    }
    
    function SpeedVideo(Speed){
        Video.play(Speed);
    }
    
/* *****************************************************************************
 * Obtiene la posicion del video en reproduccion (PAUSE LIVE Y GRABACIONES)
 * ****************************************************************************/ 

    function AssetStatus(Duration){
        var PositionInfo = [];

        if(PlayingRecording === true || PlayingVod === true){
            PositionInfo = Video.getPlayPositionInfo();
            DurationAsset = parseInt(Duration,10) * 60;
            // Debug('>>>>>> DurationAsset: '+DurationAsset);
            PositionAsset = Math.round((Video.getPlayPosition())/1000);
            Debug('--------------------->POSITION INFO VIDEO'+PositionAsset);

            // Debug('>>>>>> PositionAsset: '+PositionAsset);
            
            PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);

            // Debug('PercentagePosition: '+PercentagePosition);
        } else if (PauseLive == true){
            DurationAsset = Math.round((Video.getDuration())/1000);
                //DurationAsset = Video.getDuration();
                //DurationAsset = parseInt(Duration,10) * 60;
                //Debug('>>>>>> DurationAsset: '+DurationAsset);
                PositionAsset = Math.round((Video.getPlayPosition())/1000);
                // Debug('>>>>>> PositionAsset: '+PositionAsset);
                // if(DurationAsset !== 0){
                    PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
                    // Debug('>>>>>> PercentagePosition: '+PercentagePosition);
                    //DurationAsset = DurationAsset * 2;
                // }
            
        }

        PositionInfo = null;
    }
    function rebootInHour(){
        //HDMIstatus = ENTONE.stb.getHdmiStatus();
        //if(HDMIstatus.result.connected == false){
        //    RebootDevice();
        //}
    }