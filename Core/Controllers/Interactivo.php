<?php
/* Creado por: Fabian Loaeza
 * Fecha: Mayo 2021
 * Tipo: Controlador
 */

    date_default_timezone_set('America/Mazatlan');
    
    require_once '../Models/Database.php';
    require_once '../Models/Libraries.php';
    require_once '../DataAccess/Config.php';
    require_once '../DataAccess/Interactivo.php';
    require_once '../DataAccess/Channels.php';
    require_once '../DataAccess/Devices.php';

    $Option = !empty($_POST['Option']) ? $_POST['Option'] : '';
    $macDevice = !empty($_POST['macDevice']) ? $_POST['macDevice'] : '';
    $newUser = !empty($_POST['newUser']) ? $_POST['newUser'] : '';
    
    $CurrentModule = "TV";

    $DevicesData  = new Devices($macDevice,$CurrentModule);
    $Interactivo = new Interactivo('system', $CurrentController);

    switch ($Option){
        case 'getUsers':
            $idLocation = $DevicesData -> getDeviceLocationByMacAddress($macDevice);
            $Users = $Interactivo->getUsers($idLocation);
            echo json_encode($Users);
        break;
        case 'newUser':
            $idLocation = $DevicesData -> getDeviceLocationByMacAddress($macDevice);
            $Users = $Interactivo->newUser($idLocation,$newUser);
            echo json_encode($Users);
        break;
        case 'searchProgram':
            $date = date('Ymd');
            $programName = !empty($_POST['programName']) ? $_POST['programName'] : '';
            $string = file_get_contents("/var/www/html/BBINCO/TV2/Core/Controllers/Epg/VDM/epg_".$date."_2.json");
            $json_a = json_decode($string, true);
            
            
            $json_b = array();
            $array_channels = array();
            $array_programs= array();
            foreach ($json_a as $channel) {
                if(is_array($channel)){
                    array_push($array_channels, $channel);
                }
            }
            foreach ($array_channels as $programs) {
                $pro = array();
                foreach ($programs['PROGRAMS'] as $program) {
                    if(stripos(strtolower($program['TTLE']), strtolower($programName)) !== false) {
                        array_push($pro, $program);
                    }
                }
                if(!empty($pro)){
                    array_push($array_programs, array($programs['CHNL'] => $pro));
                }
            }
            echo json_encode($array_programs);
            break;
    }