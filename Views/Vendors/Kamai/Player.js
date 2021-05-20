/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Reproductor tv
 * Vendor: Kamai
 */

    // Variables globales
    var PlayingChannel  = false,
        PlayingVod      = false,
        PauseLive       = false;

    var WindowMaxWidth  = 0,
        WindowMaxHeight = 0,
        WindowMinWidth  = 0,
        WindowMinHeight = 0;

        GetWindowFullSize();
        GetWindowMinSize();

    // Limpiar todo antes de comenzar con la reproducción de TV
        ENTONE.video.cleanupAll();

    // Variables kamai
    var Video   = new ENTONE.video(1,0);

    gSTB.SetTopWin(0);
    player.aspectConversion = 0;
    player.videoWindowMode = 0;


/* *****************************************************************************
 * Reproductor de canal
 * ****************************************************************************/

    function PlayChannel(Source, Port){
        var CheckPort = '';
        
            if(Port){
                CheckPort = ':' + Port;
            }
            
        // Reproduce el canal actual 
        Source = Source.replace('igmp','udp');
        Debug(Source + ' ' + CheckPort);

        StopVideo();

        Video.open(Source + CheckPort);

        //ret = video.open(url, null, {pltbuf: 3600});
        
        Video.play(1);

        Video.setVideoCallback(HandleVideo);

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
    
/* *****************************************************************************
 * Reproduce canales digitales
 * ****************************************************************************/
    
    function PlayDigitalChannel(Source){
        // Detiene el proceso de la reproduccion anterior
        StopVideo();

        // Reproduce el video
        Video.open(Source);
        
        Video.play(1); 

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
        WindowMinWidth   = ((window.screen.width)*TvPercentageSize)/100;
        WindowMinHeight  = ((window.screen.height)*TvPercentageSize)/100;
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
            Video.setVideoPosition(TvPositionLeft, TvPositionTop, WindowMinWidth, WindowMinHeight, 0);
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
        //Verificar si se está reproduciento ya algo antes de poner una nueva fuente   
        if(Video !== 'undefined' && Video.getPlayingUrl() !== null){
            Video.stop();
            Video.close();
            Video.cleanup();
            //ENTONE.video.cleanupAll();
            Video = new ENTONE.video(1,0);
        }
        
        PlayingRecording = false;
    }
    
    function PauseVideo(){
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
            Debug('>>>>>> DurationAsset: '+DurationAsset);
            PositionAsset = Math.round((PositionInfo.playPosition)/1000);

            Debug('>>>>>> PositionAsset: '+PositionAsset);
            
            PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);

            Debug('PercentagePosition: '+PercentagePosition);
        }

        PositionInfo = null;
    }