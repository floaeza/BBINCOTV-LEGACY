// @ts-nocheck
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Reproductor tv
 * Vendor: Generico
 */

    // Variables globales
    var PlayingChannel  = false,
        PauseLive       = false;

    var WindowMaxWidth  = 0,
        WindowMaxHeight = 0,
        WindowMinWidth  = 0,
        WindowMinHeight = 0;

    var updatingMoviePosition = null;
    var Sources = ['http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/AAA.mp4',
                  'http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/ABC.mp4',
                  'http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/CN.mp4',
                  'http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/CNM.mp4',
                  'http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/ESPN.mp4'
                 ];

    var IndexChannel = 0;

/* *****************************************************************************
 * Reproductor de canal
 * ****************************************************************************/
    function PlayChannel(Source, Port){
        // Activamos la bandera
        PlayingChannel = true;
        
        Debug('Playing: '+Source + ':'+Port);



        document.getElementById('DigitalChannel').innerHTML = '<video id="VideoPlaying" autoplay loop><source src='+Sources[IndexChannel]+' type="video/mp4"></video>';
        document.getElementById('DigitalChannel').style.display = 'inline';

        IndexChannel++;

        if(IndexChannel > Sources.length - 1){
            IndexChannel = 0;
        }
        
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
        // Activamos la bandera
        PlayingChannel = true;

        document.getElementById('DigitalChannel').innerHTML = '<video id="VideoPlaying" autoplay loop><source src='+Sources[IndexChannel]+' type="video/mp4"></video>';
        document.getElementById('DigitalChannel').style.display = 'inline';

        IndexChannel++;

        if(IndexChannel > Sources.length - 1){
            IndexChannel = 0;
        }

        // Si la guia esta cerrada muestra cuadro con informacion del canal en reproduccion
        ShowInfo();
    }
    
/* *****************************************************************************
 * Reproduce videos
 * ****************************************************************************/

    function PlayVideo(Source){
        
    }
    function PlayMovie(Source, pos){
        var div = document.createElement('p');
        div.id = "PruebaMovie";
        div.innerHTML = '<video id="PruebaMovie1" src="'+Source+'" type=\'video/x-matroska; codecs="theora, vorbis"\' autoplay onerror="failed(event)" ></video></p><p>'
        document.getElementById('PlayingPanel').appendChild(div);

        document.getElementById('PruebaMovie1').addEventListener('ended',myHandler,false);
        function myHandler(e) {
            // What you want to do after the event
            endMovie();
        }
        if(pos != 0){
            var vid3 = document.getElementById("PruebaMovie1");
            vid3.currentTime = pos;
        }
        if(updatingMoviePosition !== null){
            clearInterval(updatingMoviePosition);
            updatingMoviePosition = null;
        }
        updatingMoviePosition = setInterval(updateMoviePosition, 1000);
    }
    function setSubtitles(option, sour){
        if(option){
            var vid2 = document.getElementById("PruebaMovie1");
            var actualPosition = vid2.currentTime;
            StopVideo();
            PlayMovie(actualSources + "_sub.mp4", actualPosition)
        }else{
            var vid2 = document.getElementById("PruebaMovie1");
            var actualPosition = vid2.currentTime;
            StopVideo();
            PlayMovie(actualSources + ".mp4", actualPosition)
        }
    }
    function updateMoviePosition(){
        var vid = document.getElementById("PruebaMovie1");
        vid.ontimeupdate = function(){
        var percentage = ( vid.currentTime / vid.duration ) * 100;
        $("#custom-seekbar span").css("width", percentage+"%");
        };
        
        var hour = Math.floor(vid.currentTime / 3600);
        hour = (hour < 10)? '0' + hour : hour;
        var minute = Math.floor((vid.currentTime / 60) % 60);
        minute = (minute < 10)? '0' + minute : minute;
        var second = vid.currentTime % 60;
        second = (second < 10)? '0' + second : second;
        var actual = hour + ':' + minute+ ':' + parseInt(second);

        hour = Math.floor(vid.duration / 3600);
        hour = (hour < 10)? '0' + hour : hour;
        minute = Math.floor((vid.duration / 60) % 60);
        minute = (minute < 10)? '0' + minute : minute;
        second = vid.duration % 60;
        second = (second < 10)? '0' + second : second;
        var total = hour + ':' + minute + ':' + parseInt(second);

        document.getElementById("timeProgress").innerText =actual+" / "+total;
    }

    function speedMovie(Option){
        if(Option == "forward"){
            var vid = document.getElementById("PruebaMovie1");
            if(vid.duration > vid.currentTime+10){
                // vid.currentTime = vid.currentTime + 10;
                // vid.currentTime = vid.duration - 20;
                vid.currentTime = vid.currentTime + 60;

            }
        }else if(Option == "backward"){
            if(vid.currentTime - 10 > 0){
                vid.currentTime = vid.currentTime - 10;
            }
        }else if(Option == "fastForward"){

        }else if(Option == "fastBackward"){

        }
    }

    function GetRaws(Source){
        var RawSource = Source.replace('rtsp','http') + '/raw/';
        RawSource = RawSource.replace('554','8080');

        Debug(RawSource);
        IndexPlaylist = 0;
        LengthPlaylist = 0;

        $.ajax({
            type: 'POST',
            async: false,
            url: 'Core/Controllers/GetRaws.php',
            data : {
                SourceRaw: RawSource
            },
            success: function(data){
                Playlist = $.parseJSON(data);
                
                IndexPlaylist = 0;
                LengthPlaylist = Playlist.length - 1;
            }
        });
    }
    
    function SetPlaylist(option){
        //if(option === 'forward'){
            
            IndexPlaylist++;
            
            if(IndexPlaylist === LengthPlaylist){
                OpenRecordPlayOptions();
            } else {
                // play
               Debug(Playlist[IndexPlaylist]);
            }
  
        //} 
    }
    
/* *****************************************************************************
 * Funcion para poner TV en pantalla completa
 * ****************************************************************************/
    function MaximizeTV(){
    }

/* *****************************************************************************
 * Funcion para minimizar la TV
 * ****************************************************************************/
    function MinimizeTV(){
    }
    
/* *****************************************************************************
 *
 * ****************************************************************************/ 
    function RebootDevice(){
        location.reload();
    }
    
/* *****************************************************************************
 * Opciones reproduccion
 * ****************************************************************************/ 

    function StopVideo(){
        PauseLive = false;
        PlayingRecording = false;
        if(CurrentModule == "Movies" && playingMovie == true){
            document.getElementById('PlayingPanel').removeChild(document.getElementById('PruebaMovie'));
            if(updatingMoviePosition !== null){
                clearInterval(updatingMoviePosition);
                updatingMoviePosition = null;
            }
        }

    }
    
    function PauseVideo(){
        if(CurrentModule == "Movies"){
            document.getElementById('PruebaMovie1').pause();
        }
    }
    
    function ResumeVideo(){
        if(CurrentModule == "Movies"){
            document.getElementById('PruebaMovie1').play();
        }
    }
    
    function SpeedVideo(Speed){

    }

/* *****************************************************************************
 * Obtiene la posicion del video en reproduccion (PAUSE LIVE Y GRABACIONES)
 * ****************************************************************************/ 

    function AssetStatus(Duration){
        if(PlayingRecording === true){

        }
    }
    function AssetStatusVod(Duration){
        if(PlayingRecording === true){

        }
    }
    function rebootInHour(){
        //HDMIstatus = ENTONE.stb.getHdmiStatus();
        //if(HDMIstatus.result.connected == false){
        //    RebootDevice();
        //}
    }