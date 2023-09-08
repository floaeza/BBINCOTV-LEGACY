// @ts-nocheck
// Video.setVideoCallback(HandleVideo);
// function HandleVideo(event_type){
//     if(event_type === 'EN_VIDEOEVENT_EOS'){
//         if(CurrentModule === 'Tv'){
//             SetDigitalChannel();
//         }
//     }
// }

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// EVENTOS VIDEO
//EN_VIDEOEVENT_PMT
//EN_VIDEOEVENT_FIRST_PTS
//EN_VIDEOEVENT_MPEG_TIMEOUT
//EN_VIDEOEVENT_MPEG_PCR

// EVENTOS NETWORK
// DOWN
// {"status":28676}
// {"status":28678}
// UP
// {"status":28675}
// {"status":28677}
var records = {}
EventHdmi = 1;

function HandleVideo(event_type){

    //Debug('------------------------------------->>> EventType: '+event_type);


    if(event_type === 'EN_VIDEOEVENT_FIRST_PTS'){
        EventString = 'STATUS_PLAYING';
        if(Executing === false){
            UpdateQuickInfoDevice();
        }
    } else if(event_type === 'EN_VIDEOEVENT_MPEG_TIMEOUT'){
        EventString = 'STATUS_ERROR_STREAM';
        if(Executing === false){
            UpdateQuickInfoDevice();
        }
    } else if(event_type === 'EN_VIDEOEVENT_EOS'){

        EventString = 'STATUS_END_OF_STREAM';

        if(CurrentModule === 'Tv'){
            if(PlayingRecording === true) {
                SpeedText = '';
                OptionText = 'play';
                UpdateBarStatus();
                // Termino reproduccion grabacion
                OpenRecordPlayOptions();
            } else {
                SetDigitalChannel();
            }
        }else if(CurrentModule === 'Movies') {
            endMovie();
        }

        if(Executing === false){
            UpdateQuickInfoDevice();
        }
    }else if (event_type === 'EN_VIDEOEVENT_SOS') {
        SpeedText = '';
        OptionText = 'play';
        UpdateBarStatus();
    }
}


ENTONE.stb.setHdmiEvtCallback(function(e){
    EventHdmiObj = e;

    EventHdmiRes = EventHdmiObj['event_name'];

    //Debug('EventHdmiRes--->'+EventHdmiRes);

    if(EventHdmiRes === 'hdmi_disconnected'){
        EventHdmi = 0;
    } else if(EventHdmiRes === 'hdmi_connected'){
        EventHdmi = 1;
    }

    if(Executing === false){
        //Debug('UpdateQuickInfoDevice >> HDMICALLBACK '+Executing);
        UpdateQuickInfoDevice();
    }
}, this);

ENTONE.network.setNetworkEvtCallback(function(e){

    EventValue = e.status;


    if(EventValue === '28675'){
        EventNetman = 'LINK STATUS DOWN/UP';
        if(Executing === false){
            UpdateQuickInfoDevice();
        }
    }
}, this);


function GetProgramsToSchedule(){
    ////Debug('-------->> GetProgramsToScheduleNow');
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'CheckProgramsToScheduleNow',
            MacAddress : MacAddress
        },
        success: function (response){
            ProgramsToSchedule = $.parseJSON(response);

            var Indexps     = 0,
                ProgramId   = '',
                Title       = '',
                Source      = '',
                Start       = '',
                End         = '',
                TimeOut     = 0;

            var Recordings = new Object();

            for(Indexps = 0;  Indexps < ProgramsToSchedule.length; Indexps++){

                ProgramId = ProgramsToSchedule[Indexps]['id_programa'];
                Title = ProgramsToSchedule[Indexps]['titulo_programa'];
                Source = ProgramsToSchedule[Indexps]['url_canal'];
                Source = Source.replace('igmp','udp');
                Start = ProgramsToSchedule[Indexps]['utc_inicio'];
                End = ProgramsToSchedule[Indexps]['utc_final'];
                TimeOut = (parseInt(End) - (new Date().getTime() / 1000) + 20)*1000;

                //Debug('>> '+ProgramId + ', ' +Source +', '+ Title +', '+ Start +', '+ End + ', '+TimeOut);

                // try {

                //Debug('Recordings >> Start= '+ProgramId);
                Recordings[ProgramId] = new ENTONE.recorder(Source, pad(parseInt(ProgramId), 10), null, {recnow:1});
                Recordings[ProgramId].start();
                records[ProgramId] = ProgramId;
                    //var recorder = new ENTONE.recorder(Source, pad(parseInt(ProgramId), 10), null, {recnow:1});
                    //recorder.start();

                        // Recordings[ProgramId].setRecorderCallback(function(e, h){
                        // //recorder.setRecorderCallback(function(e, h){
                        //     //Debug('-------------------------> setRecorderCallback: '+ProgramId+ ', '+e);
                        //     if (e === ENTONE.Recordings[ProgramId].PVR_RECORD_FINISHED){
                                
                        //         UpdateDiskInfo();
                        //         UpdateProgramActive(ProgramId, OperationsList.recorded, false);
                        //     }
                        // }, this);

                        setTimeout(function(id){
                           //recorder.stop();
                            //Debug('Recordings >> Stop= '+id);
                            Recordings[id].stop();
                            //recorder.cleanup();
                            UpdateProgramActive(id, OperationsList.recorded, false);
                        }, TimeOut, ProgramId);

                    UpdateProgramActive(ProgramId, OperationsList.recording, true);
                // } catch (e) {
                //     //Debug('> Failed to create recorder or start recording. Error handling');
                // }
            }
        }
    });
    ////Debug('--------<< GetProgramsToScheduleNow');
}

/*******************************************************************************
 * Actualiza el estatus de la grabacion y su stream id
 *******************************************************************************/

function UpdateProgramActive(ProgramId, OperationId, ActiveRecording){

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramActive',
            ProgramId : ProgramId,
            OperationId : OperationId,
            ActiveRecording : ActiveRecording,
        },
        success: function (response){
            ////Debug('----------UpdateProgramActive----------');
            ////Debug(response);
        }
    });
}

/*******************************************************************************
 * Obtien lista de programas a eliminar
 *******************************************************************************/

function GetSchedulesToDelete(){

    ////Debug('-------->> GetSchedulesToDelete');
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'CheckSchedulesToDelete',
            MacAddress : MacAddress
        },
        success: function (response){
            ProgramsToDelete = $.parseJSON(response);

            var Indexps = 0,
                AssetId = 0;

            for(Indexps = 0;  Indexps < ProgramsToDelete.length; Indexps++){
                AssetId  = parseInt(ProgramsToDelete[Indexps].id_programa,10);
                ENTONE.recorder.deleteAsset(pad(AssetId, 10));
                DeleteProgram(ProgramsToDelete[Indexps].id_programa);
            }
        }
    });

    ////Debug('--------<< GetSchedulesToDelete');
}

function DeleteProgram(ProgramId){
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'DeleteProgram',
            ProgramId : ProgramId
        },
        success: function (response){
            ////Debug(response);
        }
    });
}

/*******************************************************************************
 * Actualiza informacion del disco duro
 *******************************************************************************/

function UpdateDiskInfo(){

    var StorageInfo = [];
        StorageInfo = ENTONE.recorder.getStorageInfo();

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'SetPvrInfo',
            LocationId : Device['LocationId'],
            MacAddress : MacAddress,
            TotalSize : StorageInfo.pvrTotalSpace / 1024,
            AvailableSize : StorageInfo.pvrFreeSpace / 1024
        },
        success: function (response){
            //Debug(response);
        }
    });
}

function SetMediaRecordings(){
    var AssetsList = [];
        AssetsList = ENTONE.recorder.getAssetList();

        //Debug(JSON.stringify(AssetsList));
        //Debug(AssetsList.length);

}

/*******************************************************************************
 * Carga inicial con funciones para el DVR
 *******************************************************************************/

if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
    UpdateDiskInfo();

    HandlerPvr();

    GetProgramsSerie();
    
}

function HandlerPvr(){
    var StorageInfo = [];
        StorageInfo = ENTONE.recorder.getStorageInfo();

    var assi = ENTONE.recorder.getAssetInfo('0000000217');

    var HDST = ENTONE.stb.getHdmiSettings();
    var Rs = Video.getOsdResolution() ;

    var GRI = ENTONE.resource.getRecorders();
    GetProgramsToSchedule();

    GetSchedulesToDelete();

    // ENTONE.recorder.getAssetInfo(assetname)

    ////Debug('-------> HandlerPvr');
    setTimeout(function() {
        HandlerPvr();
    },30000);
}


function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}