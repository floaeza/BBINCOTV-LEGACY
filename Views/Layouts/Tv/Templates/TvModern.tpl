<!--Contenido canal digital -->
<img id='ImageDigitalChannel'>
<div id='DigitalChannel'></div>
<div id='InteractiveChannel'>
    <div id="keyboard">
            <div id="keyboard1">
                <label id="1" class="buttonSelected">Q</label>
                <label id="2" class="button">W</label>
                <label id="3" class="button">E</label>
                <label id="4" class="button">R</label>
                <label id="5" class="button">T</label>
                <label id="6" class="button">Y</label>
                <label id="7" class="button">U</label>
                <label id="8" class="button">I</label>
                <label id="9" class="button">O</label>
                <label id="10" class="button">P</label>
            </div>
            <div id="keyboard2">
                <label id="11" class="button">A</label>
                <label id="12" class="button">S</label>
                <label id="13" class="button">D</label>
                <label id="14" class="button">F</label>
                <label id="15" class="button">G</label>
                <label id="16" class="button">H</label>
                <label id="17" class="button">J</label>
                <label id="18" class="button">K</label>
                <label id="19" class="button">L</label>
            </div>
            <div id="keyboard3">
                <label id="20" class="button">Z</label>
                <label id="21" class="button">X</label>
                <label id="22" class="button">C</label>
                <label id="23" class="button">V</label>
                <label id="24" class="button">B</label>
                <label id="25" class="button">N</label>
                <label id="26" class="button">M</label>
                <label id="27" class="button"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14L14 12M14 12L16 10M14 12L12 10M14 12L16 14M3 12L9.41421 18.4142C9.78929 18.7893 10.298 19 10.8284 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H10.8284C10.298 5 9.78929 5.21071 9.41421 5.58579L3 12Z" stroke="#3087ba" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></label>
            </div>
            <div id="keyboard4">
                <label id="28" class="buttonSpace">SPACE</label>
                <label id="29" class="buttonSelect">OK</label>
            </div>  
        </div>
    <div id='SelectUsers'>
        <!--<div id='InteractiveText'>Who's watching?</div>-->
        <div id='InteractiveUsers'></div>
    </div>
    <div id='InteractiveAddUser'>
        <div id='AddText'></div>
    </div>
    <div id="InteractiveChannelMain">
        <div id='InteractiveHeader'>
            <img id='InteractiveLogo' src="Media/Logos/CHL/logo.png"></img>
            <div id='OptionsHeader'>
                <div id='InteractiveOptionSearch'>Search</div>
                <div id='InteractiveSearchBox'></div>
                <div id='InteractiveOptionHome'>Home</div>
                <div id='InteractiveOptionTV'>TV</div>
            </div>
            <span id='InteractiveHeaderIcon'></span>    
        </div>

        <div id="InteractivePopularChannel">
            <div id='InteractivePopularChannelTittle'>Most Viewed Channels</div>
            <div id='InteractivePopularChannelImg'></div>
        </div>
        <div id="InteractiveLastRecords">
            <div id='InteractiveLastRecordsTittle'>Last Records</div>
            <div id='InteractiveLastRecordsImg'></div>
        </div>
    </div>
    <div id="showResults">
    </div>
</div>
<iframe id='ContentFrame' src=''></iframe>

<div id='InfoContainer' class='BackgroundInfo'>
    <div class='ChannelNumber'></div>
    <div class='Quality'></div>
    <div class='ChannelName'></div>
    <div class='Date'></div>
    <div class='Title'></div>
    <div class='Duration'></div>
    <div class='Time'></div>
    <div class='Description'></div>
</div>

<div id='ChannelNumber'></div><!-- Cuadro con informacion del canal-->



<!-- Barra Pause Live Tv y Grabacion en reproduccion -->
<div id='BarStatus'></div>
<div id='BarContainer'>
    <div id='BarPosition'></div>
</div>
<div id='BarDuration'></div>
<div id='BarTimes'></div>

<!-- Opciones para grabar un programa -->
<div id='RecordingOptions'>
    <div class='RecordingOptionsButton'>Tune channel</div>
    <div class='RecordingOptionsButton'>Add record</div>
    <div class='RecordingOptionsButton'>Record all shows</div>
    <div class='RecordingOptionsButton'>Close</div>
</div>

<div id='RecordPlayOptions'>
    <div class='RecordingOptionsButton'>Play again</div>
    <div class='RecordingOptionsButton'>Delete</div>
    <div class='RecordingOptionsButton'>Stop</div>
    <div class='RecordingOptionsButton'>Return</div>
</div>

<!-- Opciones para grabar un programa manualmente | OnLoadHourPosition  & Hours[(0 - > 47)]  | -->
<div id='RecordingManualOptions'>
    <i class='fa fa-caret-up'></i><br>
    <div class='TimeNewRecording'>00</div>
    <div class='TimeNewRecording'>00</div>
    <div class='TimeNewRecording'>00</div>
    <div class='TimeNewRecording' style='width: 35%;'>+15 min</div>
    <i class='fa fa-caret-down'></i><br>

    <div class='RecordingOptionsButton'>Accept</div>
    <div class='RecordingOptionsButton'>Close</div>
</div>

<!-- Mensajes para grabaciones -->
<div id='PanelMessage'>
    <div id='RecorderMessage'></div>
    <div id='MessageClose'>OK</div>
</div>
<div id='PanelMessageConfirm'>
    <div id='RecorderMessageConfirm'></div>
    <div id='MessageCloseConfirm'>Continue</div>
    <div id='MessageCloseCancel'>Cancel</div>
</div>
<div id='PanelMessageAddSerie'>
    <div id='RecorderMessageAddSerie'></div>
    <div id='MessageCloseOnlynew'>Only New</div>
    <div id='MessageCloseAll'>All</div>
</div>

<!-- Panel grabador -->
<div id='PvrContainer'>
    <div id='PvrLogoContainer'>
        <div id='PvrMainLogo'></div>
    </div>

    <div id='PvrLateral'>
        <div id='PvrWeather'>
            <div id='Temperatures'>
                <span id='PvrWeatherFarenheit'></span><span>&deg; F/</span>
                <span id='PvrWeatherCelsius'></span><span>&deg; C</span>
            </div>
            <div id='PvrIcon'>
                <canvas id='PvrWeatherIcon' width='25' height='25'></canvas>
            </div>
        </div>
        <div id='PvrDate'></div>

        <div id='BarCircle'>
            <div id='PercentageCircle' class='c100 center p0'>
                <span id='PercentageText'>34%</span>
                <div class='slice'>
                    <div class='bar'></div>
                    <div class='fill'></div>
                </div>
            </div>
        </div>

    </div>

    <div id='PvrDiskInfo'>
        <div id='UsedSize'></div>
        <div class='BarUsedSize'></div>
        <div id='BarUsedSize'></div>
    </div>

    <div class='PvrHeader'>
        <i class='fa fa-caret-left PvrChevronLeft'></i>
        <div id='CurrentPvrOption'></div>
        <i class='fa fa-caret-right PvrChevronRight'></i>
    </div>

    <div id='PvrList'>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
    </div>

    <div id='PvrInfo'>
        <div id='PvrProgramDate'></div>
        <div id='PvrProgramDuration'></div>
        <div id='PvrProgramStars'></div>
        <div id='PvrProgramEpisode'></div>
        <div id='PvrProgramDescription'></div>
        <div id='PvrProgramTitle'></div>
        <div id='PvrProgramChannel'></div>
    </div>

    <div id='PvrOptions'>
        <div class='PvrOptionsButton'>Play</div>
        <div class='PvrOptionsButton'>Delete</div>
        <div class='PvrOptionsButton'>Close</div>
    </div>
    <div id='PvrFolderOptions'>
        <div class='PvrOptionsButton'>Open</div>
        <div class='PvrOptionsButton'>Delete</div>
        <div class='PvrOptionsButton'>Close</div>
    </div>
    <div id='PvrDeleteOptions'>
        <div class='PvrOptionsButton'>Delete</div>
        <div class='PvrOptionsButton'>Close</div>
    </div>
</div>
