<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: DAO
 */

class Statistics extends Database {

    private $StatisticsChannels;
    private $StatisticsModules;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Statistics';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function setStatisticChannel($StatisticsArray) {
        $this->Function = 'setStatisticChannel';
        
        $this->connect();
        $this->insert("estadisticas_canal",$StatisticsArray);
        $this->StatisticsChannels = $this->getResult();
        $this->disconnect();

        return $this->StatisticsChannels;
    }
    // function getPupularChannels($idUser) {
    //     $this->Function = 'getPupularChannels';
        
    //     $this->connect();
    //     $this->select("estadisticas_canal", "SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos, SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin))) as horas, nombre_canal, numero_canal, id_user", "", "", "", "", "id_user = ".$idUser,"","nombre_canal, numero_canal, id_user", "horas");

    //     $this->StatisticsChannels = $this->getResult();
    //     $this->disconnect();

    //     return $this->StatisticsChannels;
    // }
    function getPupularChannels($idLoacion) {
        $this->Function = 'getPupularChannels';
        
        if($idLoacion != 0){
            $this->connect();
            $this->select("estadisticas_canal", 
                            "SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos, SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin))) as horas, estadisticas_canal.nombre_canal as nombre_canal, paquete_canal.numero_canal AS numero_canal", 
                            "estaciones ON estaciones.nombre_estacion = estadisticas_canal.nombre_canal", 
                            "canales ON canales.id_estacion = estaciones.id_estacion", 
                            "paquete_canal ON paquete_canal.id_canal = canales.id_canal", 
                            "",
                            "paquete_canal.id_paquete = 2 AND estadisticas_canal.id_locacion = ".$idLoacion,
                            "",
                            "nombre_canal, paquete_canal.numero_canal",
                            "segundos DESC");

            $this->StatisticsChannels = $this->getResult();
            $this->disconnect();

            return $this->StatisticsChannels;
        }else{
            $this->connect();
            $this->select("estadisticas_canal", 
                            "SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos, SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin))) as horas, estadisticas_canal.nombre_canal as nombre_canal, paquete_canal.numero_canal AS numero_canal", 
                            "estaciones ON estaciones.nombre_estacion = estadisticas_canal.nombre_canal", 
                            "canales ON canales.id_estacion = estaciones.id_estacion", 
                            "paquete_canal ON paquete_canal.id_canal = canales.id_canal", 
                            "",
                            "paquete_canal.id_paquete = 2",
                            "",
                            "nombre_canal, paquete_canal.numero_canal",
                            "segundos DESC");

            $this->StatisticsChannels = $this->getResult();
            $this->disconnect();

            return $this->StatisticsChannels;
        }
    }
    function setStatisticModule($StatisticsArray) {
        $this->Function = 'get';

        $this->connect();
        $this->insert("estadisticas_modulo",$StatisticsArray);
        $this->StatisticsModules = $this->getResult();
        //echo $this->getSql();
        $this->disconnect();

        return $this->StatisticsModules;
    }

    function setStatisticMovie($StatisticsArray) {
        $this->Function = 'get';

        $this->connect();
        $this->insert("estadisticas_pelicula",$StatisticsArray);
        $this->StatisticsModules = $this->getResult();
        //echo $this->getSql();
        $this->disconnect();

        return $this->StatisticsModules;
    }

}
