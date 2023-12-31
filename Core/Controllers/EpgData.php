<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

// Calcula tiempo de ejecucion 
// $time_start = microtime(true);

    date_default_timezone_set('America/Phoenix');

    require_once '../Models/Database.php';
    require_once '../Models/Libraries.php';
    require_once '../Models/Utilities.php';
    require_once '../DataAccess/Config.php';
    require_once '../DataAccess/Packages.php';
    require_once '../DataAccess/Channels.php';
    
    $CurrentController = 'EpgDataController';

    $Utilities    = new Utilities('system', $CurrentController);
    $PackageData  = new Packages('system', $CurrentController);
    $ConfigData   = new Config('system', $CurrentController);
    $ChannelsData = new Channels('system', $CurrentController);

    $ExtraHour  = $ConfigData->getConfigByName('ExtraHour');
    $StartEnd   = $ConfigData->getConfigByName('StartEnd');
    $OffsetZone = $ConfigData->getConfigByName('OffsetZone');

    $Client = $ConfigData->getConfigByName('Identifier');
    $ServerIp = $ConfigData->getConfigByName('ServerIp');
    
//    $CurrentDate = date('Ymd');
//    $PackageId   = '1';
    $CurrentDate  = stripslashes($argv[1]);
    $PackageId    = $argv[2];
    $PlusDate     = strtotime('+1 day', strtotime($CurrentDate));
    $TomorrowDate = date('Ymd',$PlusDate);

    $PreChannalesArray  = $PackageData->getPackageListById($PackageId);
    
    $ChannelsLength     = count($PreChannalesArray);
    $PreChannalesArrayA = array();
    
    $Channels   = $ChannelsData->getPassChannelsList($PackageId);
    $Today      = date('Y-m-d');
    $Yesterday  = date('Y-m-d',(strtotime ( '-1 day' , strtotime ( $Today) ) ));
    $Symbols    = array('>', '<', '/', '=', '"', '-','&');
    $RemoveAmYesterday = true;
    $RemoveAmToday     = false;
    
    $EpgFolder = 'http://'.$ServerIp.'/EpgChannels/';
    
    foreach ($PreChannalesArray as $PreChannelRow):

        $Calidad = ($PreChannelRow['id_calidad'] === '1') ? 'HD' : '';
         
        $PreChannelRow['SRCE'] = $PreChannelRow['src'];
        unset($PreChannelRow['src']);
        
        $PreChannelRow['QLTY'] = $Calidad;
        unset($PreChannelRow['calidad']);
        
        $PreChannelRow['PORT'] = $PreChannelRow['puerto'];
        unset($PreChannelRow['puerto']);

        $PreChannelRow['CHNL'] = $PreChannelRow['numero_canal'];
        unset($PreChannelRow['numero_canal']);
        
        $PreChannelRow['STTN'] = $PreChannelRow['numero_estacion'];
        unset($PreChannelRow['numero_estacion']);
        
        $PreChannelRow['NAME'] = $PreChannelRow['nombre_canal'];
        unset($PreChannelRow['nombre_estacion']);
        
        $PreChannelRow['INDC'] = $PreChannelRow['indicativo'];
        unset($PreChannelRow['indicativo']);
        
        $PreChannelRow['LOGO'] = $PreChannelRow['logo'];
        unset($PreChannelRow['logo']);

        unset($PreChannelRow['id_paquete_canal']);
        unset($PreChannelRow['id_modulo']);
        unset($PreChannelRow['id_calidad']);
        unset($PreChannelRow['nombre_canal']);
        unset($PreChannelRow['id_canal']);
        unset($PreChannelRow['id_paquete']);
        unset($PreChannelRow['id_estacion']);
        unset($PreChannelRow['repetir_contenido']);
        array_push($PreChannalesArrayA, $PreChannelRow);
    endforeach;
    
    $PreChannalesArrayM  = $PackageData->getModulesPackageListById($PackageId);

    $AddChannelsLength     = count($PreChannalesArrayM);

    $ChannelsLength = $ChannelsLength + $AddChannelsLength;

    foreach ($PreChannalesArrayM as $PreChannelRow):

        $PreChannelRow['SRCE'] = $PreChannelRow['url_modulo'];
        unset($PreChannelRow['url_modulo']);
        
        $PreChannelRow['QLTY'] = 'HD';

        
        $PreChannelRow['PORT'] = $PreChannelRow['id_modulo'];
        unset($PreChannelRow['id_modulo']);


        $PreChannelRow['CHNL'] = $PreChannelRow['numero_canal'];
        unset($PreChannelRow['numero_canal']);
        
        $PreChannelRow['STTN'] = 'CONTENT';

        
        $PreChannelRow['NAME'] = $PreChannelRow['descripcion_modulo'];
        unset($PreChannelRow['descripcion_modulo']);

        
        $PreChannelRow['INDC'] = $PreChannelRow['nombre_modulo'];
        unset($PreChannelRow['nombre_modulo']);
        
        $PreChannelRow['LOGO'] = $PreChannelRow['nombre_icono'];
        unset($PreChannelRow['nombre_icono']);

        unset($PreChannelRow['id_paquete_canal']);
        unset($PreChannelRow['id_canal']);
        unset($PreChannelRow['id_paquete']);
        unset($PreChannelRow['canal_activo']);
        unset($PreChannelRow['modulo_principal']);
        unset($PreChannelRow['modulo_canal']);
        unset($PreChannelRow['repetir_contenido']);
        unset($PreChannelRow['padre_modulo']);
        unset($PreChannelRow['id_proyecto']);
        unset($PreChannelRow['id_template']);
        
        array_push($PreChannalesArrayA, $PreChannelRow);
    endforeach;
    
    // Wednesday 20th of February 2019 
    $FormatDate =  date('l, F j, Y', strtotime($CurrentDate));

    $PreChannalesArrayB = array();
    foreach($PreChannalesArrayA as $PreChannelRowB):
        $PreChannelRowB = array_push_assoc($PreChannelRowB, 'DTNU', $CurrentDate);
        array_push($PreChannalesArrayB, $PreChannelRowB);
    endforeach;

    $arrayCanales = array();
    foreach($PreChannalesArrayB as $Channel):
        $Channel = array_push_assoc($Channel, 'DATE', $FormatDate);
        array_push($arrayCanales, $Channel);
    endforeach;

    $arraySchedule = array();
    $Programacion = array();
    
    $ProgramsLength = 0;
    $Index = 0;
    
    //print_r($Channels);
    
    //echo count($Channels). PHP_EOL;
    
    foreach ($Channels as $Channel):
        $StationName = $Channel['numero_estacion'];
        $ChannelName = preg_replace('/\s+/', '', $Channel['nombre_canal']);
        
        /* AYER */

        $UrlYesterday = $EpgFolder.$ChannelName.'/'.$Yesterday.'.txt';

        $GetTxtYesterday1 = $Utilities->GetDataFromUrl($UrlYesterday);
        $GetTxtYesterday  = str_replace('"', '', $GetTxtYesterday1);

        $DataYesterday2 = htmlspecialchars($GetTxtYesterday);
        $DataYesterday1 = str_replace('>', '', $DataYesterday2);
        $DataYesterday  = str_replace('<', '', $DataYesterday1);

        $SlicesYesterday = explode('list-group-itemdata', $DataYesterday);

        $CheckHoursAM = false;
        
       // echo 'Yesteday: '. PHP_EOL;
        foreach($SlicesYesterday as $SliceYesterday):  
            $SliceYesterday = str_replace('"', '', $SliceYesterday);

            $TitleA       = '';
            $DurationA    = $Utilities->getBetween($SliceYesterday, 'data-duration', 'data-showID');
            $TimeA        = $Utilities->getBetween($SliceYesterday, 'time class=', 'time');
            $Title1       = $Utilities->getBetween($SliceYesterday, 'data-showName', 'Showdata');
            $Title2       = $Utilities->getBetween($SliceYesterday, 'data-showName', 'data-episodeTitle');
            $DescriptionA = $Utilities->getBetween($SliceYesterday, 'data-description', 'data-league');
            $RatingA      = $Utilities->getBetween($SliceYesterday, 'data-rating', 'data-captioned');
            $StarsA       = $Utilities->getBetween($SliceYesterday, 'starRating', 'data-description');
            $EpisodeA     = $Utilities->getBetween($SliceYesterday, 'episodeTitle', 'data-episodeNumber');
            $TitleExtra   = $Utilities->getBetween($SliceYesterday, 'teams', '/span');
            $TitleExtra2  = $Utilities->getBetween($SliceYesterday, 'strong', 'span');

            if (strpos($Title1, 'episodeTitle') !== false) {
                $TitleA = $Title2;
            } else {
                $TitleA = $Title1;
            }

            $Title       = str_replace($Symbols, '', $TitleA);
            $Duration    = str_replace($Symbols, '', $DurationA);
            $Time        = substr($TimeA, 4, -5);
            $Description = str_replace($Symbols, '', $DescriptionA);
            $Rating      = str_replace($Symbols, '', $RatingA);
            $Stars       = str_replace($Symbols, '', $StarsA);
            $Episode     = str_replace($Symbols, '', $EpisodeA);
            
            $TitleE1     = str_replace($Symbols, '', $TitleExtra);
            $TitleE2     = str_replace($Symbols, '', $TitleExtra2);

            $ID = substr($Time, -2); 

            if($RemoveAmYesterday == true && $ID == 'AM'){
                //echo '::FALSE 1 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
            } else if($ID == 'PM'){
                //echo '::FALSE 2 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
                $RemoveAmYesterday = false;
            } if($RemoveAmYesterday == false && $ID == 'AM'){
                //echo '::TRUE 1 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
                
                $CheckHourAm = explode(":", $Time);
                //echo $CheckHourAm[0]. PHP_EOL;
                
                if($CheckHourAm[0] === '12'){
                    $CheckHoursAM = true;
                }
                
                if($CheckHoursAM === true){
                    $StartTime = str_pad(Time12to24($Time),5,'0',STR_PAD_LEFT);
                    $FinalTime = date('H:i',strtotime($Duration.' minutes',strtotime($StartTime)));
                    $CheckMovie = ReplaceXtrainChar($Title);

                    if($CheckMovie == 'Movie'){
                        array_push($Programacion, array('STTN' => $StationName, //STATION
                                                        'DBKY' => '', //DATABASEKEY
                                                        'TTLE' => ReplaceXtrainChar($Episode), //TITLE
                                                        'DSCR' => ReplaceXtrainChar($Description), //DESCRIPTION
                                                        'DRTN' => (intval($Duration) / 60), //DURATION
                                                        'MNTS' => $Duration, //DURACION MINUTES
                                                        'DATE' => str_replace('-', '', $Today), //DATE (EPOCH) 
                                                        'STRH' => $StartTime, // START HOUR
                                                        'FNLH' => $FinalTime, // FINAL HOUR
                                                        'TVRT' => $Rating, //TV RATING
                                                        'STRS' => $Stars, //STARS
                                                        'EPSD' => '' //EPISODE
                                                        ));     
                    } else {

                        if($TitleE1 !== ''){
                            $TitleC = ReplaceXtrainChar($Title) . ' '. ReplaceXtrainChar($TitleE1);
                            $DescriptionC = ReplaceXtrainChar($Description) . ' '.ReplaceXtrainChar($TitleE2);
                                    
                        } else {
                            $TitleC = ReplaceXtrainChar($Title);
                            $DescriptionC = ReplaceXtrainChar($Description);
                        }
                        array_push($Programacion, array('STTN' => $StationName, //STATION
                                                        'DBKY' => '', //DATABASEKEY
                                                        'TTLE' => $TitleC, //TITLE
                                                        'DSCR' => $DescriptionC, //DESCRIPTION
                                                        'DRTN' => (intval($Duration) / 60), //DURATION
                                                        'MNTS' => $Duration, //DURACION MINUTES
                                                        'DATE' => str_replace('-', '', $Today), //DATE (EPOCH) 
                                                        'STRH' => $StartTime, // START HOUR
                                                        'FNLH' => $FinalTime, // FINAL HOUR
                                                        'TVRT' => $Rating, //TV RATING
                                                        'STRS' => $Stars, //STARS
                                                        'EPSD' => ReplaceXtrainChar($Episode) //EPISODE
                                                        ));  
                    }
                  // echo '::::1 '.$Time . ' : '.$StartTime . ' - '.$FinalTime.' = '.$TitleC. ', '.$DescriptionC.PHP_EOL;
                }
            }
        endforeach;
        
        //echo '******************************************'. PHP_EOL;
        
        $CheckHoursAM = false;

    /* HOY */

        $UrlToday = $EpgFolder.$ChannelName.'/'.$Today.'.txt';

        $GetTxtToday1 = $Utilities->GetDataFromUrl($UrlToday);
        $GetTxtToday  = str_replace('"', '', $GetTxtToday1);

        $DataToday2 = htmlspecialchars($GetTxtToday);
        $DataToday1 = str_replace('>', '', $DataToday2);
        $DataToday  = str_replace('<', '', $DataToday1);

        $SlicesToday = explode('list-group-itemdata', $DataToday);

       // echo 'Today:'. PHP_EOL;
        foreach($SlicesToday as $SliceToday):  
            $SliceToday = str_replace('"', '', $SliceToday);

            $TitleA       = '';
            $DurationA    = $Utilities->getBetween($SliceToday, 'data-duration', 'data-showID');
            $TimeA        = $Utilities->getBetween($SliceToday, 'time class=', 'time');
            $Title1       = $Utilities->getBetween($SliceToday, 'data-showName', 'Showdata');
            $Title2       = $Utilities->getBetween($SliceToday, 'data-showName', 'data-episodeTitle');
            $DescriptionA = $Utilities->getBetween($SliceToday, 'data-description', 'data-league');
            $RatingA      = $Utilities->getBetween($SliceToday, 'data-rating', 'data-captioned');
            $StarsA       = $Utilities->getBetween($SliceToday, 'starRating', 'data-description');
            $EpisodeA     = $Utilities->getBetween($SliceToday, 'episodeTitle', 'data-episodeNumber');
            $TitleExtra   = $Utilities->getBetween($SliceToday, 'teams', '/span');
            $TitleExtra2  = $Utilities->getBetween($SliceToday, 'strong', 'span');

            if (strpos($Title1, 'episodeTitle') !== false) {
                $TitleA = $Title2;
            } else {
                $TitleA = $Title1;
            }

            $Title       = str_replace($Symbols, '', $TitleA);
            $Duration    = str_replace($Symbols, '', $DurationA);
            $Time        = substr($TimeA, 4, -5);
            $Description = str_replace($Symbols, '', $DescriptionA);
            $Rating      = str_replace($Symbols, '', $RatingA);
            $Stars       = str_replace($Symbols, '', $StarsA);
            $Episode     = str_replace($Symbols, '', $EpisodeA);
            
            $TitleE1     = str_replace($Symbols, '', $TitleExtra);
            $TitleE2     = str_replace($Symbols, '', $TitleExtra2);

            $ID = substr($Time, -2); 

            if($RemoveAmToday == true && $ID == 'AM'){
                //echo '::FALSE 1 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
            } else if($ID == 'PM'){
                //echo '::FALSE 2 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
                $RemoveAmToday = true;

                $StartTime = str_pad(Time12to24($Time),5,'0',STR_PAD_LEFT);
                $FinalTime = date('H:i',strtotime($Duration.' minutes',strtotime($StartTime)));
                $CheckMovie = ReplaceXtrainChar($Title);
                
                if($CheckMovie == 'Movie'){
                    array_push($Programacion, array('STTN' => $StationName, //STATION
                                                    'DBKY' => '', //DATABASEKEY
                                                    'TTLE' => ReplaceXtrainChar($Episode), //TITLE
                                                    'DSCR' => ReplaceXtrainChar($Description), //DESCRIPTION
                                                    'DRTN' => (intval($Duration) / 60), //DURATION
                                                    'MNTS' => $Duration, //DURACION MINUTES
                                                    'DATE' => str_replace('-', '', $Today), //DATE (EPOCH) 
                                                    'STRH' => $StartTime, // START HOUR
                                                    'FNLH' => $FinalTime, // FINAL HOUR
                                                    'TVRT' => $Rating, //TV RATING
                                                    'STRS' => $Stars, //STARS
                                                    'EPSD' => '' //EPISODE
                                                    ));     
                } else {
                    if($TitleE1 !== ''){
                            $TitleC = ReplaceXtrainChar($Title) . ' '. ReplaceXtrainChar($TitleE1);
                            $DescriptionC = ReplaceXtrainChar($Description) . ' '.ReplaceXtrainChar($TitleE2);
                                    
                        } else {
                            $TitleC = ReplaceXtrainChar($Title);
                            $DescriptionC = ReplaceXtrainChar($Description);
                        }
                        array_push($Programacion, array('STTN' => $StationName, //STATION
                                                        'DBKY' => '', //DATABASEKEY
                                                        'TTLE' => $TitleC, //TITLE
                                                        'DSCR' => $DescriptionC, //DESCRIPTION
                                                        'DRTN' => (intval($Duration) / 60), //DURATION
                                                        'MNTS' => $Duration, //DURACION MINUTES
                                                        'DATE' => str_replace('-', '', $Today), //DATE (EPOCH) 
                                                        'STRH' => $StartTime, // START HOUR
                                                        'FNLH' => $FinalTime, // FINAL HOUR
                                                        'TVRT' => $Rating, //TV RATING
                                                        'STRS' => $Stars, //STARS
                                                        'EPSD' => ReplaceXtrainChar($Episode) //EPISODE
                                                        ));  
                }
                //echo '::::2 '.$Time . ' : '.$StartTime . ' - '.$FinalTime.' = '.$TitleC. ', '.$DescriptionC.PHP_EOL;
            } if($RemoveAmToday == false && $ID == 'AM'){
                //echo '::TRUE 1 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
                $StartTime = str_pad(Time12to24($Time),5,'0',STR_PAD_LEFT);
                $FinalTime = date('H:i',strtotime($Duration.' minutes',strtotime($StartTime)));
                $CheckMovie = ReplaceXtrainChar($Title);
                
                if($CheckMovie == 'Movie'){
                    array_push($Programacion, array('STTN' => $StationName, //STATION
                                                    'DBKY' => '', //DATABASEKEY
                                                    'TTLE' => ReplaceXtrainChar($Episode), //TITLE
                                                    'DSCR' => ReplaceXtrainChar($Description), //DESCRIPTION
                                                    'DRTN' => (intval($Duration) / 60), //DURATION
                                                    'MNTS' => $Duration, //DURACION MINUTES
                                                    'DATE' => str_replace('-', '', $Today), //DATE (EPOCH) 
                                                    'STRH' => $StartTime, // START HOUR
                                                    'FNLH' => $FinalTime, // FINAL HOUR
                                                    'TVRT' => $Rating, //TV RATING
                                                    'STRS' => $Stars, //STARS
                                                    'EPSD' => '' //EPISODE
                                                    ));     
                } else {
                    if($TitleE1 !== ''){
                            $TitleC = ReplaceXtrainChar($Title) . ' '. ReplaceXtrainChar($TitleE1);
                            $DescriptionC = ReplaceXtrainChar($Description) . ' '.ReplaceXtrainChar($TitleE2);
                                    
                        } else {
                            $TitleC = ReplaceXtrainChar($Title);
                            $DescriptionC = ReplaceXtrainChar($Description);
                        }
                        array_push($Programacion, array('STTN' => $StationName, //STATION
                                                        'DBKY' => '', //DATABASEKEY
                                                        'TTLE' => $TitleC, //TITLE
                                                        'DSCR' => $DescriptionC, //DESCRIPTION
                                                        'DRTN' => (intval($Duration) / 60), //DURATION
                                                        'MNTS' => $Duration, //DURACION MINUTES
                                                        'DATE' => str_replace('-', '', $Today), //DATE (EPOCH) 
                                                        'STRH' => $StartTime, // START HOUR
                                                        'FNLH' => $FinalTime, // FINAL HOUR
                                                        'TVRT' => $Rating, //TV RATING
                                                        'STRS' => $Stars, //STARS
                                                        'EPSD' => ReplaceXtrainChar($Episode) //EPISODE
                                                        ));  
                }
                //echo '::::3 '.$Time . ' : '.$StartTime . ' - '.$FinalTime.' = '.$TitleC. ', '.$DescriptionC.PHP_EOL;
            }
            
           // echo $CheckHourAm[0]. PHP_EOL;
            
        endforeach;
//ECHO '------------------------------------------------'. PHP_EOL;
    endforeach;
    
   // print_r($Programacion);

    // Valida si la ubicacion puede ser utilizada
    if (is_readable($Libraries['EpgFilesPath'])) {

        // s k e d r e c
        $ScheduleRecord = fopen($Libraries['EpgFilesPath'] . 'skedrec.txt', 'r')
                or exit('No se puede abrir el archivo skedrec.txt');
        while (!feof($ScheduleRecord)) {
            $schedule = explode('|', fgets($ScheduleRecord));
            if(empty($schedule[2])){
                $schedule[2] = '';
            }

            if ($schedule[2] == $CurrentDate && ($schedule[3] + $schedule[4]) > $StartEnd && $schedule[3] >= $StartEnd || $schedule[2] == $TomorrowDate && $schedule[3] < $StartEnd) {
                //echo $schedule[0]." - ".$schedule[1].": ".$schedule[2] ." && (".$schedule[3]." + ".$schedule[4]." )= ".($schedule[4]+$schedule[3])." > ".$StartEnd. " <br>";
                    array_push($arraySchedule, array(
                    $schedule[0], // 0 station
                    $schedule[1], //  1 databasekey
                    $schedule[3],// hora inicio
                    $Utilities->SumHours($schedule[3], $schedule[4]), //hora fin
                    $Utilities->duracion($schedule[4], $schedule[3], $StartEnd, $schedule[2]), // 4 duration (0130, 0530, 0700, 20170306)
                    $schedule[15], // 5 tv rating
                    $schedule[27], //dolby
                    $schedule[2], //fecha
                    $schedule[12], // premiere final
                    $Utilities->MinutesDuration($schedule[4]) //hora fin
                ));
            }
            $Index++;
        }fclose($ScheduleRecord);

        // p r o r e c  
        $ProgramRecord = fopen($Libraries['EpgFilesPath'] . 'progrec.txt', 'r')
            or exit('No se puede abrir el archivo progrec.txt');
        while (!feof($ProgramRecord)) {
            $program = explode('|', fgets($ProgramRecord)); 
            for ($i = 0; $i < count($arraySchedule); $i++) {
                if ($arraySchedule[$i][1] == $program[0])  {

                    array_push($Programacion, array('STTN' => $arraySchedule[$i][0], //STATION
                                                    'DBKY' => $arraySchedule[$i][1], //DATABASEKEY
                                                    'TTLE' => ReplaceXtrainChar($program[1]), //TITLE
                                                    'DSCR' => ReplaceXtrainChar($program[159]), //DESCRIPTION
                                                    'DRTN' => $arraySchedule[$i][4], //DURATION
                                                    'MNTS' => $arraySchedule[$i][9], //DURACION MINUTES
                                                    'DATE' => $arraySchedule[$i][7], //DATE (EPOCH) 
                                                    'STRH' => $Utilities->HoraZonaInicio($arraySchedule[$i][2], $OffsetZone, $arraySchedule[$i][7], $CurrentDate), // START HOUR
                                                    'FNLH' => $Utilities->HoraZonaFinal($arraySchedule[$i][3], $OffsetZone), // FINAL HOUR
                                                    'TVRT' => $arraySchedule[$i][5], //TV RATING
                                                    'STRS' => $program[145], //STARS
                                                    'EPSD' => ReplaceXtrainChar($program[156]) //EPISODE
                                                    ));
                }
            }
        } 
        fclose($ProgramRecord);

        foreach ($Programacion as $clave => $fila):
           $horaIni[$clave] = $fila['STRH'];
        endforeach;

        array_multisort($horaIni, SORT_ASC, $Programacion);    

        for ($j = 0; $j < count($arrayCanales); $j++) {
            $arrayCanales[$j]['PROGRAMS'] = array();
            //if (!is_numeric($arrayCanales[$j]['STTN'])) {
            if($arrayCanales[$j]['STTN'] == 'AUDIO' || $arrayCanales[$j]['STTN'] == 'VIDEO' || $arrayCanales[$j]['STTN'] == 'CONTENT') {
                array_push($arrayCanales[$j]['PROGRAMS'], 
                    array('STTN' => $arrayCanales[$j]['STTN'],
                          'DBKY' => '',
                          'TTLE' => $arrayCanales[$j]['NAME'],
                          'DSCR' => '',
                          'DRTN' => '24',
                          'MNTS' => '',
                          'DATE' => $CurrentDate,
                          'STRH' => '00:00',
                          'FNLH' => '24:00',
                          'TVRT' => '',
                          'STRS' => '',
                          'EPSD'=> ''
                        ));
                $ProgramsLength++;
            } else {
                //echo '::::count($Programacion): '.count($Programacion).' ::::::<BR>';

                for ($i = 0; $i < count($Programacion); $i++) {
                    $AddProgram = true;
                    
                    if ($arrayCanales[$j]['STTN']  == $Programacion[$i]['STTN']) {
                        
                        //echo $arrayCanales[$j]['STTN']  .' == '. $Programacion[$i]['STTN'].' <br>';
                        array_push($arrayCanales[$j]['PROGRAMS'], $Programacion[$i]);
                        $ProgramsLength++;
                    }
                }
                if($ProgramsLength === 0){
                    
                    if($arrayCanales[$j]['STTN'] === 'VIDEO_ES'){
                        $des = 'Tv guide soon';
                    } else {
                        $des = '';
                    }
                    array_push($arrayCanales[$j]['PROGRAMS'], 
                        array('STTN' => $arrayCanales[$j]['STTN'],
                              'DBKY' => '',
                              'TTLE' => $des,
                              'DSCR' => '',
                              'DRTN' => '24',
                              'MNTS' => '',
                              'DATE' => $CurrentDate,
                              'STRH' => '00:00',
                              'FNLH' => '24:00',
                              'TVRT' => '',
                              'STRS' => '',
                              'EPSD' => ''
                            )
                    );
                    $ProgramsLength++;
                }
            }
            $arrayCanales[$j]['P_Length'] = $ProgramsLength;
            $ProgramsLength = 0;
        }
        $arrayCanales['C_Length'] = $ChannelsLength;

        foreach ($arrayCanales as $clave => $fila) {
            $chan[$clave] = $fila['CHNL'];
        }
        array_multisort($chan, SORT_ASC, $arrayCanales);

        $EpgData = json_encode(utf8ize($arrayCanales), JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT | JSON_PRETTY_PRINT);

        $NameDay = 'epg_'.$CurrentDate.'_'.$PackageId.'.json';
        
        if (file_put_contents('Epg/'.$Client.'/'.$NameDay, $EpgData)) {
            chmod('Epg/'.$Client.'/'.$NameDay, 0775);
            echo ".::: Archivo JSON con la programacion del dia $CurrentDate del paquete $PackageId se ha creado correctamente". PHP_EOL;
        } else {
            echo ".::: Error al crear archivo JSON". PHP_EOL;
        }   

    } 
//else {
//    //echo "No pueden ser procesados los archivos de tribune y se hara un archivo con informacion estatica de los canales en la BD".chr(13).chr(10);
//    
//    $arraySchedule = array();
//    $Programacion= array();
//    $Index = 0;
//
//    for ($j = 0; $j < count($arrayCanales); $j++) {
//        $arrayCanales[$j]['PROGRAMS'] = array();
//            array_push($arrayCanales[$j]['PROGRAMS'], 
//                  array('estacion' => $arrayCanales[$j]['numero_estacion'],
//                        'database_key' => "",
//                        'grabacion'=>false,
//                        'serie'=>false,
//                        'titulo' => $arrayCanales[$j]['nombre_estacion'],
//                        'descripcion' => "",
//                        'duracion' => "24",
//                        'duracion_minutos' => 'Guide not available',
//                        'fecha'    => $fecha,
//                        'hora_inicio' => "00:00",
//                        'hora_final' => "24:00",
//                        'hora_inicio_epoch' => '',
//                        'hora_final_epoch' => '', 
//                        'tv_rating' => '',
//                        'estrellas_rating' => '',
//                        'mpaa_rating' => '',
//                        'numero_episodio'=> '',
//                        'titulo_episodio'=> '',
//                        'advertencias' =>
//                        array('advertencia_uno' => "",
//                            'advertencia_dos' => "",
//                            'advertencia_tres' => "",
//                            'advertencia_cuatro' => "",
//                            'advertencia_cinco' => "",
//                            'advertencia_seis' => "")
//                    ));
//            $lenght_p++;
//
//        $arrayCanales[$j]['lenght_p'] = $lenght_p;
//        $lenght_p = 0;
//    }
//    $arrayCanales['lenght_c']   = $lenght_c;
//
//
//    foreach ($arrayCanales as $clave => $fila) {
//        $chan[$clave] = $fila['numero_canal'];
//    }
//    array_multisort($chan, SORT_ASC, $arrayCanales);
//
//    $data_EPG = json_encode(utf8ize($arrayCanales), JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT | JSON_PRETTY_PRINT);
//
//    // "epg_".$fechaAyer."_".$Package[id_paquete].".json"
//
//    //echo $nombreEpg = "epg_general_".(string) $id_paquete.".json";
//    //if (file_put_contents("../Modules/EPG/epg_general_".$nombreEpg.".json", $data_EPG)) {
//        
//    $nombreEpg = "_".$PackageId."_";
//    if (file_put_contents("../Modules/EPG/epg_general".$nombreEpg.".json", $data_EPG)) {
//        chmod("../Modules/EPG/epg_general".$nombreEpg.".json", 0775);
//        echo "Archivo JSON con la programacion general se ha creado correctamente".chr(13).chr(10);
//    } else {
//        echo "Error al crear archivo JSON sin tribune".chr(13).chr(10);
//    } 
//
// }

function ReplaceXtrainChar($Str){
    $EncodedString = json_encode(utf8ize($Str),  JSON_FORCE_OBJECT | JSON_PRETTY_PRINT);
    //Caracteres a reemplazar y el caracter que lo sustituye
    $CharToReplace = array('"', '""', "''", "/", "¨", "´", "``", "\\");
    $CharToSet     = array('',  '',   "'",  "",  "",  "",  "'",  "/");
    $ReplacedString = str_replace($CharToReplace, $CharToSet ,$EncodedString);
    //Codigos a reemplazar y el caracter que lo sustituye
    //                       á         é        í           ó       ú           ü       ñ
    $ReplacedCodes  = array("/u00a0", "/u0082", "/u00a1", "/u00a2", "/u00a3", "/u0081", "/u00a4", "/u00ad", "/u00b5", "/u0090", "/u00b5", 
    "/u00b5", "/u00e9", "/u0088", "/u0085", "/u0083", "/u00a8","/u0089","/u008a","/u0094", "/u008c","/u0092","/u0084","/u0086","/u00e2/u0080/u0099","/u00e2/u0080/u0098","/u00a9","/u00f8F","gt;","lt;","/u00c3","/u00c3");
    //Caracteres especiales comentados para futuras referencias
    $ReplaceChar    = array("a"     ,"e"      ,"i"      ,"o"      ,"u"      ,"u"      ,"n"      , "¡"     , "a"/*�?*/, "e"/*É*/, "i"/*�?*/,
    "o"/*Ó*/,"u"/*Ú*/, "e"/*ê*/,  "a"/*à*/, "a"/*à*/, "¿",     "e",     "e"/*è*/,  "o",   "i"/*î*/, "AE"/*Æ*/,"a"/*ä*/,"a"/*å*/,"'", "","","%","","","e","o");
    $ReplacedString = str_replace($ReplacedCodes, $ReplaceChar ,$ReplacedString);
    $nEnd = $ReplacedString;    
    return $nEnd;
}

function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string($d)) {
        return utf8_encode($d);
    }
    return $d;
}

/* associative array push */
function array_push_assoc($array, $key, $value){
    $array[$key] = $value;
    return $array;
}

function Time12to24($time12h){
    $time     = explode(' ', $time12h);
    $modifier = $time[1];
    $times    = explode(':', $time[0]);
    $hours    = $times[0];
    $minutes  = $times[1];
    
    if ($hours == '12') {
        $hours = '00';
    }
    
    if ($modifier === 'PM') {

        $hours = intval($hours);
        if($hours !== 12){
            $hours = $hours + 12; 
        }
    } else {
        $hours = intval($hours);
    }
    return $hours.':'.$minutes;
}

//$time_end = microtime(true);

//$execution_time = ($time_end - $time_start);

//$hours = (int)($execution_time/60/60);
//$minutes = (int)($execution_time/60)-$hours*60;
//$seconds = (int)$execution_time-$hours*60*60-$minutes*60;
//echo '<b>Tiempo de ejecucion </b> Minutos: '.$minutes. ' Segundos: '.$seconds. '<br>';