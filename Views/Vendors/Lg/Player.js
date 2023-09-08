// @ts-nocheck
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Reproductor tv
 * Vendor: Lg
 */

    /* Variables globales */
    var PlayingChannel  = false,
        PauseLive       = false;
        
    var WindowMaxWidth  = 0,
        WindowMaxHeight = 0,
        WindowMinWidth  = 0,
        WindowMinHeight = 0;

        GetWindowFullSize();
        GetWindowMinSize();
    

/* *****************************************************************************
 * Reproducir canal
 * ****************************************************************************/

    function PlayChannel(Source, Port){
        // Detiene el canal actual
            StopChannel();
            
        // Elimina la etiqueta igmp o rf, ya que el parametro solo acepta numeros en el string
        var Src = Source.replace('igmp://', '');
        Debug('--> PlayChannel ');
        hcap.channel.requestChangeCurrentChannel({
            'channelType':hcap.channel.ChannelType.IP, 
            'ip':  Src,
            'port': parseInt(Port, 10),
            'ipBroadcastType': hcap.channel.IpBroadcastType.UDP,
            'onSuccess' : function() {
                //Debug('onSuccess');
            }, 
            'onFailure' : function(f) {
                //Debug('onFailure : errorMessage = ' + f.errorMessage);
            }
        });
        
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
 * Reproduce videos
 * ****************************************************************************/

    function PlayVideo(Source){
        // Detiene el proceso de la reproduccion anterior
        StopVideo();

        // Reproduce el video


        // Maximiza el video en caso de que no este en pantalla completa
        MaximizeTV();
    }

/* *****************************************************************************
 * Obtiene los tamanos maximos y minimos de la pantalla
 * ****************************************************************************/

    function GetWindowFullSize(){
        WindowMaxWidth   = window.screen.width;
        WindowMaxHeight  = window.screen.height;
    }
    
    function GetWindowMinSize(){
        WindowMinWidth   = ((window.screen.width)*33)/100;
        WindowMinHeight  = ((window.screen.height)*33)/100;
    }
    
/* *****************************************************************************
 * Funcion para poner TV en pantalla completa
 * ****************************************************************************/

    function MaximizeTV(){
        hcap.video.setVideoSize({
            'x': 0, 
            'y': 0,
            'width': WindowMaxWidth,
            'height': WindowMaxHeight,
            'onSuccess' : function() {
                //Debug('onSuccess');
            }, 
            'onFailure' : function(f) {
                //Debug('onFailure : errorMessage = ' + f.errorMessage);
            }
        });
    }

/* *****************************************************************************
 * Funcion para minimizar la TV
 * ****************************************************************************/
    
    function MinimizeTV(){
        hcap.video.setVideoSize({
            'x': 15, 
            'y': 60,
            'width': WindowMinWidth,
            'height': WindowMinHeight,
            'onSuccess' : function() {
                //Debug('onSuccess');
            }, 
            'onFailure' : function(f) {
                //Debug('onFailure : errorMessage = ' + f.errorMessage);
            }
        });
    }
    
/* *****************************************************************************
 * Reinicia el dispositivo
 * ****************************************************************************/ 
    function RebootDevice(){

    }
    
/* *****************************************************************************
 * Opciones reproduccion
 * ****************************************************************************/ 

    function StopVideo(){

        hcap.channel.stopCurrentChannel({
            'onSuccess' : function() {
                //Debug('onSuccess');
            }, 
            'onFailure' : function(f) {
                //Debug('onFailure : errorMessage = ' + f.errorMessage);
            }
        });

        PlayingRecording = false;
    }
    
    function PauseVideo(){
       
    }
    
    function ResumeVideo(){
        
    }
    
    function SpeedVideo(Speed){
        
    }
    
/* *****************************************************************************
 * Obtiene la posicion del video en reproduccion (PAUSE LIVE Y GRABACIONES)
 * ****************************************************************************/ 

    function AssetStatus(Duration){
        if(PlayingRecording === true){
            
            PositionAsset = 0;
            DurationAsset = parseInt(Duration,10) * 60;
            
            PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
        } 
    }
    function rebootInHour(){
        //HDMIstatus = ENTONE.stb.getHdmiStatus();
        //if(HDMIstatus.result.connected == false){
        //    RebootDevice();
        //}
    }