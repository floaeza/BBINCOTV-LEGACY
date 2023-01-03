// @ts-nocheck
/******************************************************************************
 * @Objetivo: Ejecutar botones del control remoto para todas las marcas
 * @CreadoPor: Tania Maldonado
 * @Fecha: Mayo 26, 2018
 *******************************************************************************/

var PressedKey      = 0,
    Clicks          = 0,
    MaxClicks       = 10,
    TimeClicks      = 1000, //milisegundos
    TimeCheck       = 2000, //milisegundos
    Sequence        = 0,
    ClearingClicks  = false,
    CheckingClicks  = false,
    timeMenu        = 0,
    showInfoDevi  = false,
    timeInfoDevice  = null,
    contInfoDevice  = 0,
    DelayChangeChannel = false,
    DelaySkip          = false;

    document.addEventListener('keydown',KeyHandler,false);
    var SwapPausePlay = true;
var CheckInfo = 0;
    function KeyHandler(e) {
        PressedKey = e.which;
        e.preventDefault();
        if(typeof(gSTB) !== 'undefined' && PressedKey === 9){
            ShiftKey = e.shiftKey;
            if(ShiftKey === true){
                PressedKey = 7;
            }
        }
        if(Clicks <= MaxClicks) {
            switch (PressedKey) {
                case REMOTE_RED:
                    if(showInfoDevi == false){
                        Red();
                    }
                break;
                case REMOTE_BLUE:
                    if(showInfoDevi == false){
                        Blue();
                    }
                break;

                case REMOTE_GREEN:
                    if(showInfoDevi == false){
                        Green();
                    }
                break;

                case REMOTE_YELLOW:
                    if(showInfoDevi == false){
                       Yellow(); 
                    }
                break;

                case ARROW_KEY_UP:
                    if(contInfoDevice == 0 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }else if(contInfoDevice == 2 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvUp();
                    } else if(CurrentModule === 'Menu' && showInfoDevi == false){
                        MenuUp();
                    } else if(CurrentModule === 'Movies' && showInfoDevi == false){
                        VodUp();
                    } else if(CurrentModule == "Interactivo"){
                        UpInteractive();
                    }
                break;

                case ARROW_KEY_DOWN:
                    if(contInfoDevice == 1 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }else if(contInfoDevice == 3 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvDown();
                    } else if(CurrentModule === 'Menu' && showInfoDevi == false){
                        MenuDown();
                    } else if(CurrentModule === 'Movies' && showInfoDevi == false){
                        VodDown();
                    } else if(CurrentModule == "Interactivo"){
                        DownInteractive();
                    }
                break;

                case ARROW_KEY_RIGHT:
                    if(contInfoDevice == 4 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }else if(contInfoDevice == 6 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvRight();
                    } else if(CurrentModule === 'Menu' && showInfoDevi == false){
                        MenuRight();
                    } else if(CurrentModule === 'Movies' && showInfoDevi == false){
                        VodRight();
                    } else if(CurrentModule === 'Moods' && showInfoDevi == false){
                        MoodsRight();
                    } else if(CurrentModule == "Interactivo"){
                        RightInteractive();
                    }
                break;

                case ARROW_KEY_LEFT:
                    if(contInfoDevice == 5 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }else if(contInfoDevice == 7 && showInfoDevi == false){
                        clearTimeout(timeInfoDevice);
                        showInfoDevice();
                        contInfoDevice=0;
                        showInfoDevi = true;
                    }
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvLeft();
                    } else if(CurrentModule === 'Menu' && showInfoDevi == false){
                        MenuLeft();
                    } else if(CurrentModule === 'Movies' && showInfoDevi == false){
                        VodLeft();
                    } else if(CurrentModule === 'Moods' && showInfoDevi == false){
                        MoodsLeft();
                    } else if(CurrentModule == "Interactivo"){
                        LeftInteractive();
                    }
                break;
                
                case SMALL_ARROW_UP:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvPageUp();
                    }
                break;
                
                case SMALL_ARROW_DOWN:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvPageDown();
                    }
                break;

                case REMOTE_CHANNEL_UP:
                    
                    if(CurrentModule === 'Movies'){
                        if(playingMovie == false){
                            GoPage('tv.php', 1, 'Tv', 'UP');
                        }
                    }else if(CurrentModule === 'Tv'){
                        if (ActiveEpgContainer === true && (typeof(ENTONE) !== 'undefined' || typeof(gSTB) !== 'undefined')) {
                            if(showInfoDevi == false){
                                TvPageUp();
                            }
                        }else if(RecordingPanel == true){
                        }else{
                            if(showInfoDevi == false){
                                if(DelayChangeChannel == false){
                                    DelayChangeChannel = true;
                                    TvChannelUp();
                                    setTimeout(function(){
                                        DelayChangeChannel = false;
                                    },1000);
                                }
                            }
                        }
                    }
                break;

                case REMOTE_CHANNEL_DOWN:
                    if(CurrentModule === 'Movies'){
                        if(playingMovie == false){
                            GoPage('tv.php', 1, 'Tv', 'Down');
                        }       
                    }else if(CurrentModule === 'Tv'){
                        if (ActiveEpgContainer === true && (typeof(ENTONE) !== 'undefined' || typeof(gSTB) !== 'undefined')) {
                            if(showInfoDevi == false){
                                TvPageDown();
                            }
                        }else if(RecordingPanel == true){
                        }else{
                            if(showInfoDevi == false){
                                if(DelayChangeChannel == false){
                                    DelayChangeChannel = true;
                                    TvChannelDown();
                                    setTimeout(function(){
                                        DelayChangeChannel = false;
                                    },1000);
                                }
                            }
                        }
                    }
                break;
                case REMOTE_OK:
                    CheckInfo++;
                    if(CurrentModule === 'Tv'){
                        TvOk();
                        if(CheckInfo === 2){
                            CheckInfo = 0;
                            TvInfo();
                        }
                    } else if(CurrentModule === 'Menu'){
                        MenuOk();
                    } else if(CurrentModule === 'Movies'){
                        VodOk();
                    } else if(CurrentModule === 'Moods'){
                        MoodsOk();
                    } else if(CurrentModule == "Interactivo"){
                        OkInteractive();
                    }
                    break;
            
                case REMOTE_INFO:
                    if(CurrentModule === 'Tv'){
                        TvInfo();
                    } else if(CurrentModule === 'Movies'){
                        VodInfo();
                    }
                break;
                
                case REMOTE_BACK:
                    if(showInfoDevi == false){
                        Back();
                    }else{
                        removeInfoDevice();
                    }
                    
                break;

                case REMOTE_CLOSE:
                    if(showInfoDevi == false){
                        Close();
                    }else{
                        removeInfoDevice();
                    }
                break;
                
                case PREVIOUS_PROGRAM:
                    if(CurrentModule === 'Tv'  && showInfoDevi == false){
                        ReturnLastChannel();
                    }else if(showInfoDevi){
                        removeInfoDevice();
                    }
                break;
                case REMOTE_GUIDE:
                    if(CurrentModule === 'Tv'  && showInfoDevi == false){
                        
                        TvGuide();
                    }
                break;
                case REMOTE_MENU:
                    if(timeMenu == 0 &&  showInfoDevi == false && PlayingRecording == false ){
                        timeMenu = 1;
                        setTimeout(function(){
                            timeMenu = 0;
                        },2000)
                        Menu();
                    } else if(showInfoDevi == true){
                        if (typeof(ASTB) !== 'undefined') {
                            Browser.Action(16);
                            removeInfoDevice();
                        }
                    }
                break;
                case REMOTE_PVR:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        Debug("REMOTE_PVR");
                        TvRecorder();
                    }
                break;
                
                case REMOTE_STOP:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvStop();
                    }
                break;
                
                case REMOTE_PLAY:
                    if(typeof(gSTB) !== 'undefined'){
                        if(CurrentModule === 'Tv' && showInfoDevi == false){
                            if(SwapPausePlay === false){
                                TvPlay();
                                SwapPausePlay = true;
                            } else {
                                TvPause();
                                SwapPausePlay = false;
                            }
                        }else if(CurrentModule === 'Movies'){
                            if(currentPanelFocused == "playingContent" && statusVideo == "play"){
                                PauseVideo();
                                statusVideo = "pause";
                            }else if(currentPanelFocused == "playingContent" && statusVideo == "pause"){
                                statusVideo = "play";
                                ResumeVideo();
                            }
                        }
                    } else {
                        if(CurrentModule === 'Tv' && showInfoDevi == false){
                            TvPlay();
                        }else if(CurrentModule === 'Movies'){
                            if(currentPanelFocused == "playingContent" && statusVideo == "pause"){
                                statusVideo = "play";
                                ResumeVideo();
                            }
                        }
                    }
                break;

                case REMOTE_PAUSE:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvPause();
                    }else if(CurrentModule === 'Movies'){
                        if(currentPanelFocused == "playingContent" && statusVideo == "play"){
                            PauseVideo();
                            statusVideo = "pause";
                        }
                    }
                break;
                
                case REMOTE_FORWARD:
                    if(CurrentModule === 'Tv'){
                        if(showInfoDevi == false){
                            TvForward();
                        }
                    }else if(CurrentModule === 'Movies'){
                        if(playingMovie == true){
                            speedMovie("forward");
                        }
                    }
                break;
                
                case REMOTE_BACKWARD:
                    
                    if(CurrentModule === 'Tv'){
                        if(showInfoDevi == false){
                            TvBackward();
                        }
                    }else if(CurrentModule === 'Movies'){
                        if(playingMovie == true){
                            speedMovie("backward");
                        }
                    }
                break;
                case REMOTE_RECORD:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvRecord();
                    }
                break;
                case REMOTE_FAST_BACKWARD:
                    if(CurrentModule === 'Tv'){
                        if(PlayingRecording == true){
                            if(DelaySkip == false){
                                DelaySkip = true;
                                TvPlay();
                                SkipChapterRecord("backward");  
                                setTimeout(function(){
                                    DelaySkip = false;
                                },1000);
                            }
                        }
                    }else if(CurrentModule === 'Movies'){
                        if(playingMovie == true){
                            speedMovie("fastBackward");
                        }
                    }
                break;
                case REMOTE_FAST_FORWARD:
                    if(CurrentModule === 'Tv'){
                        if(PlayingRecording == true){
                            if(DelaySkip == false){
                                DelaySkip = true;
                                TvPlay();
                                TvPlay();
                                SkipChapterRecord("forward");  
                                setTimeout(function(){
                                    DelaySkip = false;
                                },1000);
                            }
                        }
                    }else if(CurrentModule === 'Movies'){
                        if(playingMovie == true){
                            speedMovie("fastForward");
                        }
                    }
                break;
        /********** NUMEROS **********/        
                case 48: // 0
                case 49: // 1
                case 50: // 2
                case 51: // 3
                case 52: // 4 
                case 53: // 5
                case 54: // 6
                case 55: // 7
                case 56: // 8
                case 57: // 9
                    if(CurrentModule === 'Tv' && showInfoDevi == false && PlayingRecording == false){
                        NumericChange(PressedKey - 48);
                    }
                    break;
                case 96: // 0
                case 97: // 1
                case 98: // 2
                case 99: // 3
                case 100: // 4 
                case 101: // 5
                case 102: // 6
                case 103: // 7
                case 104: // 8
                case 105: // 9
                    if(CurrentModule === 'Tv' && MacAddress === '00:00:00:00:00:00'){
                        NumericChange(PressedKey - 96);
                    }
                break;
            }
            ++Clicks;
            if(CheckingClicks === false){
                setTimeout(CheckClicks,TimeCheck);
                CheckingClicks = true;
            }
        }  else if (Clicks > MaxClicks){
            if(ClearingClicks === false){
                ClearingClicks = true;
                setTimeout(ClearClicks,TimeClicks);
            } 
        }
    }
    function ClearClicks(){
        CheckInfo = 0;
        Clicks = 0;
        ClearingClicks = false;
        Sequence = 0;
    }
    function CheckClicks(){
        if(ClearingClicks === false){
            Clicks = 0;
            CheckingClicks = false;
        }
    }
    function MakeEvent(key){
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':key, 'which':key}));
    }