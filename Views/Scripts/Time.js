// @ts-nocheck
/******************************************************************************
 * @Objetivo: Actualiza la hora
 * @CreadoPor: Tania Maldonado
 * @Fecha: Noviembre 2019
 *******************************************************************************/

/* Validacion para reinicar dispositivo y buscar actualizaciones de la epg */
var TimeRunning       = 0,
MaxMinutesRunning = 15,
TimerDate         = 0,
Offset            = 0,
xhr;

if (window.tizen !== undefined) {
    var now = new tizen.TZDate(),
    TvHour = now.getHours();

    $.ajax({
        cache: false,
        type: 'POST',
        url: 'http://'+ServerIp+'/BBINCO/TV1/Core/Models/Time.php',
        async : false,
        success: function (response) {
            var Today = $.parseJSON(response),
                ServerHour   = Today.Hours;
            Offset = parseInt(TvHour) - parseInt(ServerHour);
            Today = null;
            ServerHour = null;
        }
    });
    now = null;
    TvHour = null;
}

function SetDate(){
    TimeRunning++;

    FormatDateAndHour = moment().subtract(Offset, 'hours').format('MMM, DD / h:mm A');
    CurrentStbDate = moment().subtract(Offset, 'hours').format('Y-MM-DD h:mm:ss');

    if(!Device){
        if (Device.Client === 'CHL') {
            FormatHour = moment().subtract(Offset, 'hours').format('h:mm A');
        } else {
            FormatHour = moment().subtract(Offset, 'hours').format('MMMM Do h:mm a');
        }
    } else {
        FormatHour = moment().subtract(Offset, 'hours').format('h:mm A');
    }

    if(CurrentModule === 'Tv'){

        if(typeof (ActiveInfoContainer) !== 'undefined' && ActiveInfoContainer === true){
            InfoContainerNodes[7].textContent  = FormatHour;
        } else if(typeof (ActiveEpgContainer) !== 'undefined' && ActiveEpgContainer === true){
            EpgDate.textContent = FormatDateAndHour;
        } else if(typeof (RecordingPanel) !== 'undefined' && RecordingPanel === true){
            PvrDate.textContent = FormatHour;
        }
        if(FormatHour === '12:01 AM'){
            SetEpgFile();
            if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
                if(EpgDataActive === true){
                    GetProgramsSerie();
                }
            }
        }
    } else if(CurrentModule === 'Menu'){
        FormatDate = moment().subtract(Offset, 'hours').format('MMMM DD YYYY');
        FormatHour = moment().subtract(Offset, 'hours').format('h:mm a');
        MenuDate.textContent = FormatDate;
        MenuHour.textContent = FormatHour;
    }
    if(CurrentModule !== 'Tv'){
        if(TimeRunning > MaxMinutesRunning){
            TimeRunning = 0;
            if(Executing === false){
                if(CurrentModule !== 'Tv') {
                    UpdateInfoDevice();
                } else {
                    UpdateQuickInfoDevice();
                }
            }
        }
    }
    
    setTimeout(SetDate, 50000);
}
setTimeout(SetDate,500);