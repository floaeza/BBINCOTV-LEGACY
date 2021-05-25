<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

require_once './../Models/Database.php';
require_once './../DataAccess/Devices.php';

$CurrentController = 'DeviceInfoController';

$MacAddress    = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '';

$DevicesData  = new Devices($MacAddress, $CurrentController);

$EventString = !empty($_POST['EventString']) ? $_POST['EventString'] : '-';
$EventHdmi   = !empty($_POST['EventHdmi']) ? $_POST['EventHdmi'] : '1';
//$EventNetman = !empty($_POST['EventNetman']) ? $_POST['EventNetman'] : '';
$LastChannel = !empty($_POST['LastChannel']) ? $_POST['LastChannel'] : 'TV';
$CurrentDate = !empty($_POST['CurrentDateStb']) ? $_POST['CurrentDateStb'] : '';
$DeviceId    = !empty($_POST['DeviceId']) ? $_POST['DeviceId'] : '1';

$Reboot = '';

$DeviceUpdate =  array (
    'mensaje_evento'   => $EventString,
    'hdmi'             => $EventHdmi,
    'ultimo_canal'     => $LastChannel,
    'ultima_ejecucion' => $CurrentDate);

$UpdateDevice = $DevicesData->updateGetDevice($DeviceId, $DeviceUpdate,$MacAddress);

foreach ($UpdateDevice as $DeviceInfo):
    $Reboot = $DeviceInfo['reiniciar'];
endforeach;

echo json_encode($Reboot);