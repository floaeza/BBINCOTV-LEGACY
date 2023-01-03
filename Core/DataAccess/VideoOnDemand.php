<?php
/* Creado por: Tania Maldonado
 * Fecha: Julio 2020
 * Tipo: DAO
 */

class VideoOnDemand extends Database {
    
    private $VideoOnDemandList;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'VideoOnDemand';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getMoviesList($OrderBy, $Order, $Where, $Like) {
        $this->Function = 'getMoviesList';
        
        $this->connect();
        
        if(empty($Where)){
            $this->select("vod_peliculas", "*","","","","","","","","$OrderBy $Order");
        } else {
            $this->select("vod_peliculas", "*","","","","","$Where"," '$Like' ","","$OrderBy $Order");
        }
        $this->VideoOnDemandList = $this->getResult();
        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    function getSeriesList($OrderBy, $Order, $Where, $Like) {
        $this->Function = 'getSeriesList';
        
        $this->connect();
        
        if(empty($Where)){
            $this->select("vod_series", "*","","","","","","","","$OrderBy $Order");
        } else {
            $this->select("vod_series", "*","","","","","$Where"," '$Like' ","","$OrderBy $Order");
        }
        $this->VideoOnDemandList = $this->getResult();
        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    
    function getGendersByMovie($MovieId) {
        $this->Function = 'getGendersByMovie';
        
        $this->connect();
        $this->select("vod_pelicula_genero", "genero", 
                      "vod_generos ON vod_pelicula_genero.id_genero = vod_generos.id_genero", 
                      "","","",
                      "id_pelicula = '".$MovieId."' "
                );

        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,$Row['genero']);
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    function getGendersBySerie($MovieId) {
        $this->Function = 'getGendersByMovie';
        
        $this->connect();
        $this->select("vod_serie_genero", "genero", 
                      "vod_generos ON vod_serie_genero.id_genero = vod_generos.id_genero", 
                      "","","",
                      "id_serie = '".$MovieId."' "
                );

        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,$Row['genero']);
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    function getCastingByMovie($MovieId) {
        $this->Function = 'getCastingByMovie';
        
        $this->connect();
        $this->select("vod_pelicula_cast", "*", 
                      "vod_casting ON vod_pelicula_cast.id_cast = vod_casting.id_cast", 
                      "","","",
                      "id_pelicula = '".$MovieId."' ","","",""
                );
        
        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,array('Name' => $Row['nombre_cast'],'LastName' => $Row['apellido_cast']));
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    
    function getCastingBySerie($MovieId) {
        $this->Function = 'getCastingByMovie';
        
        $this->connect();
        $this->select("vod_serie_cast", "*", 
                      "vod_casting ON vod_serie_cast.id_cast = vod_casting.id_cast", 
                      "","","",
                      "id_serie = '".$MovieId."' ","","",""
                );
        
        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,array('Name' => $Row['nombre_cast'],'LastName' => $Row['apellido_cast']));
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }

    function getDirectorByMovie($MovieId) {
        $this->Function = 'getDirectorByMovie';
        
        $this->connect();
        $this->select("vod_pelicula_director", "*", 
                      "vod_directores ON vod_pelicula_director.id_director = vod_directores.id_director", 
                      "","","",
                      "id_pelicula = '".$MovieId."' "
                );
        
        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,array('Name' => $Row['nombre_director'],'LastName' => $Row['apellido_director']));
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    function getDirectorBySerie($MovieId) {
        $this->Function = 'getDirectorByMovie';
        
        $this->connect();
        $this->select("vod_serie_director", "*", 
                      "vod_directores ON vod_serie_director.id_director = vod_directores.id_director", 
                      "","","",
                      "id_serie = '".$MovieId."' "
                );
        
        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,array('Name' => $Row['nombre_director'],'LastName' => $Row['apellido_director']));
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    function GetYearsList(){
        $this->Function = 'getYearsList';
        
        $this->connect();
        $this->select("vod_peliculas", "year");
        
        $Result = $this->getResult();
        
        $PreResult = array();

        foreach ($Result as $Row):
            array_push($PreResult,intval($Row['year']));
        endforeach;
        
        $this->disconnect();
        
        $ArrayResult = array_unique($PreResult);

        $this->VideoOnDemandList = array(); 
        foreach ($ArrayResult as $Row):
            array_push($this->VideoOnDemandList,$Row);
        endforeach;
        
        sort($this->VideoOnDemandList);
        
        return $this->VideoOnDemandList;
    }
    function GetGendersList(){
        $this->Function = 'getGendersList';
        
        $this->connect();   
        $this->select("vod_generos", "genero");
        $Result= $this->getResult();
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,$Row['genero']);
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }

    function GetMoviesByGender($Gender) {
        $this->Function = 'getMoviesByGender';
        $this->connect();
        $this->select("vod_pelicula_genero", "*", 
                      "vod_peliculas ON vod_pelicula_genero.id_pelicula = vod_peliculas.id_pelicula", 
                      "vod_generos ON vod_pelicula_genero.id_genero = vod_generos.id_genero","","",
                      "vod_pelicula_genero.id_genero = ".$Gender
                );

        $this->VideoOnDemandList = $this->getResult();

        $this->disconnect();
        
        return $this->VideoOnDemandList;
    }
    function GetSeriesByGender($Gender) {
        $this->Function = 'getSeriesByGender';
        
        $this->connect();
        $this->select("vod_serie_genero", "*", 
                      "vod_series ON vod_serie_genero.id_series = vod_series.id_series", 
                      "vod_generos ON vod_serie_genero.id_genero = vod_generos.id_genero","","",
                      "vod_serie_genero.id_genero = ".$Gender
                );

        $this->VideoOnDemandList = $this->getResult();

        $this->disconnect();
        
        return $this->VideoOnDemandList;
    }

    function getChapters($id_serie, $temporada) {
        $this->Function = 'getChapters';
        
        $this->connect();
     
        $this->select("vod_series_capitulos", "*", "", "", "", "","vod_series_capitulos.temporada = ".$temporada." AND vod_series_capitulos.id_serie = ".$id_serie,"","","numero_capitulo");

        $this->VideoOnDemandList = $this->getResult();

        $this->disconnect();
        
        return $this->VideoOnDemandList;
    }
}