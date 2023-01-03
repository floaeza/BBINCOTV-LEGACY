<?php
/* Creado por: Tania Maldonado
 * Fecha: Julio 2020
 * Tipo: Controlador
 */
    require_once './../Models/Database.php';
    require_once './../Models/Utilities.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/VideoOnDemand.php';
    
    $CurrentController = 'VideoOnDemandController';

    $Option         = !empty($_POST['Option']) ? $_POST['Option'] : 'GetFilters'; 
    $MacAddress     = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : ''; 
    $OrderBy        = !empty($_POST['OrderBy']) ? $_POST['OrderBy'] : 'year'; 
    $Order          = !empty($_POST['Order']) ? $_POST['Order'] : 'ASC'; 
    $Where          = !empty($_POST['Where']) ? $_POST['Where'] : ''; 
    $Like           = !empty($_POST['Like']) ? $_POST['Like'] : ''; 
    

    
    $VideoOnDemand  = new VideoOnDemand($MacAddress, $CurrentController);
    $Utilities      = new Utilities();
    
    $Response = '';
    $FirstElement = 0;
    switch ($Option){
        case 'GetGeneralList':

            $Result = $VideoOnDemand->getMoviesList($OrderBy, $Order, $Where, $Like);
    
            $Movies = array();
    
            $Cast = array();
    
            foreach ($Result as $Row) :
    
                $Genders = $VideoOnDemand->getGendersByMovie($Row['id_pelicula']);
    
                $Casting = $VideoOnDemand->getCastingByMovie($Row['id_pelicula']);

                foreach ($Casting as $CastRow) :
                    array_push($Cast, $CastRow['Name'] . ' ' . $CastRow['LastName']);
                endforeach;
    
    
                $Director = $VideoOnDemand->getDirectorByMovie($Row['id_pelicula']);
    
                array_push($Movies, array(
                    'id_pelicula' => $Row['id_pelicula'],
                    'TTLE' => $Row['nombre_pelicula'],
                    'DSCR' => $Row['descripcion_pelicula'],
                    'PSTR' => $Row['nombre_poster'],
                    'FILE' => $Row['archivo_pelicula'],
                    'FLDR' => $Row['folder_pelicula'] . '/',
                    'YEAR' => $Row['year'],
                    'BNNR' => $Row['show_in_banner'],
                    'RTNG' => $Row['clasificacion'],
                    'MNTS' => $Row['duracion_minutos'],
                    'DRTN' => $Row['duracion_pelicula'],
                    'SCOR' => $Row['calificacion'],
                    'GNDR' => $Genders,
                    'CAST' => $Cast,
                    'DRTR' => 'Director: ' . $Director[0]['Name'] . ' ' . $Director[0]['LastName'],
                    'TYPE' => 'Movie'
                ));
    
                $Cast = array();
            endforeach;
            $Result = $VideoOnDemand->getSeriesList($OrderBy, $Order, $Where, $Like);
            $Series = array();
            $Cast = array();
            foreach ($Result as $Row) :
                $Genders = $VideoOnDemand->getGendersBySerie($Row['id_series']);
    
                $Casting = $VideoOnDemand->getCastingBySerie($Row['id_series']);

                foreach ($Casting as $CastRow) :
                    array_push($Cast, $CastRow['Name'] . ' ' . $CastRow['LastName']);
                endforeach;
    
    
                $Director = $VideoOnDemand->getDirectorBySerie($Row['id_series']);
    
                array_push($Series, array(
                    'id_serie' => $Row['id_series'],
                    'TTLE' => $Row['nombre_serie'],
                    'DSCR' => $Row['descripcion_serie'],
                    'PSTR' => $Row['nombre_poster'],
                    'FLDR' => $Row['folder_serie'] . '/',
                    'YEAR' => $Row['year'],
                    'BNNR' => $Row['show_in_banner'],
                    'RTNG' => $Row['clasificacion'],
                    'TMPR' => $Row['numero_temporadas'],
                    'SCOR' => $Row['calificacion'],
                    'GNDR' => $Genders,
                    'CAST' => $Cast,
                    'DRTR' => 'Director: ' . $Director[0]['Name'] . ' ' . $Director[0]['LastName'],
                    'TYPE' => 'Serie'
                ));
    
                $Cast = array();
            endforeach;


            $Response = array_merge($Series, $Movies);
            shuffle($Response);
        break;
        case 'GetMoviesList':

            $Result = $VideoOnDemand->getMoviesList($OrderBy, $Order, $Where, $Like);
    
            $Movies = array();
    
            $Cast = array();
    
            foreach ($Result as $Row) :
    
                $Genders = $VideoOnDemand->getGendersByMovie($Row['id_pelicula']);
    
                $Casting = $VideoOnDemand->getCastingByMovie($Row['id_pelicula']);

                foreach ($Casting as $CastRow) :
                    array_push($Cast, $CastRow['Name'] . ' ' . $CastRow['LastName']);
                endforeach;
    
    
                $Director = $VideoOnDemand->getDirectorByMovie($Row['id_pelicula']);
    
                array_push($Movies, array(
                    'id_pelicula' => $Row['id_pelicula'],
                    'TTLE' => $Row['nombre_pelicula'],
                    'DSCR' => $Row['descripcion_pelicula'],
                    'PSTR' => $Row['nombre_poster'],
                    'FILE' => $Row['archivo_pelicula'],
                    'FLDR' => $Row['folder_pelicula'] . '/',
                    'YEAR' => $Row['year'],
                    'BNNR' => $Row['show_in_banner'],
                    'RTNG' => $Row['clasificacion'],
                    'MNTS' => $Row['duracion_minutos'],
                    'DRTN' => $Row['duracion_pelicula'],
                    'SCOR' => $Row['calificacion'],
                    'GNDR' => $Genders,
                    'CAST' => $Cast,
                    'DRTR' => 'Director: ' . $Director[0]['Name'] . ' ' . $Director[0]['LastName'],
                    'TYPE' => 'Movie'
                ));
    
                $Cast = array();
            endforeach;

            $Response = $Movies;
        break;
        case 'GetSeriesList':

            $Result = $VideoOnDemand->getSeriesList($OrderBy, $Order, $Where, $Like);
    
            $Series = array();
    
            $Cast = array();
    
            foreach ($Result as $Row) :
    
                $Genders = $VideoOnDemand->getGendersBySerie($Row['id_series']);
    
                $Casting = $VideoOnDemand->getCastingBySerie($Row['id_series']);

                foreach ($Casting as $CastRow) :
                    array_push($Cast, $CastRow['Name'] . ' ' . $CastRow['LastName']);
                endforeach;
    
    
                $Director = $VideoOnDemand->getDirectorBySerie($Row['id_series']);
    
                array_push($Series, array(
                    'id_serie' => $Row['id_series'],
                    'TTLE' => $Row['nombre_serie'],
                    'DSCR' => $Row['descripcion_serie'],
                    'PSTR' => $Row['nombre_poster'],
                    'FLDR' => $Row['folder_serie'] . '/',
                    'YEAR' => $Row['year'],
                    'BNNR' => $Row['show_in_banner'],
                    'RTNG' => $Row['clasificacion'],
                    'TMPR' => $Row['numero_temporadas'],
                    'SCOR' => $Row['calificacion'],
                    'GNDR' => $Genders,
                    'CAST' => $Cast,
                    'DRTR' => 'Director: ' . $Director[0]['Name'] . ' ' . $Director[0]['LastName'],
                    'TYPE' => 'Serie'
                ));
    
                $Cast = array();
            endforeach;

            $Response = $Series;
        break;
        case 'GetYearsList':
            $Response = $VideoOnDemand->GetYearsList();
        break;
        
        case 'GetGendersList':
            $Response = $VideoOnDemand->GetGendersList();
        break;

        case 'GetGeneralByGender':
            $Gender = !empty($_POST['Gender']) ? $_POST['Gender'] : ''; 

            $Result = $VideoOnDemand->GetGendersList();
            $Movies = array();
            $Series = array();
            $Result2 = $VideoOnDemand->GetMoviesByGender($Gender);
            $Cast = array();
            foreach ($Result2 as $line) :
                $Casting = $VideoOnDemand->getCastingByMovie($line['id_pelicula']);

                foreach ($Casting as $CastRow) :
                    array_push($Cast, $CastRow['Name'] . ' ' . $CastRow['LastName']);
                endforeach;


                array_push($Movies, array(
                    'id_pelicula' => $line['id_pelicula'],
                    'TTLE' => $line['nombre_pelicula'],
                    'DSCR' => $line['descripcion_pelicula'],
                    'PSTR' => $line['nombre_poster'],
                    'FILE' => $line['archivo_pelicula'],
                    'FLDR' => $line['folder_pelicula'] . '/',
                    'YEAR' => $line['year'],
                    'BNNR' => $line['show_in_banner'],
                    'RTNG' => $line['clasificacion'],
                    'MNTS' => $line['duracion_minutos'],
                    'DRTN' => $line['duracion_pelicula'],
                    'SCOR' => $line['calificacion'],
                    'CAST' => $Cast,
                    'GNDR' => $Gender,
                    'TYPE' => 'Movie'
                ));
            endforeach;
    
            $Result2 = $VideoOnDemand->GetSeriesByGender($Gender);
            $Cast = array();
            foreach ($Result2 as $line) :
                $Casting = $VideoOnDemand->getCastingBySerie($line['id_series']);

                foreach ($Casting as $CastRow) :
                    array_push($Cast, $CastRow['Name'] . ' ' . $CastRow['LastName']);
                endforeach;

                array_push($Series, array(
                    'id_serie' => $line['id_series'],
                    'TTLE' => $line['nombre_serie'],
                    'DSCR' => $line['descripcion_serie'],
                    'PSTR' => $line['nombre_poster'],
                    'FLDR' => $line['folder_serie'] . '/',
                    'YEAR' => $line['year'],
                    'BNNR' => $line['show_in_banner'],
                    'RTNG' => $line['clasificacion'],
                    'TMPR' => $line['numero_temporadas'],
                    'SCOR' => $line['calificacion'],
                    'GNDR' => $Gender,
                    'CAST' => $Cast,
                    'DRTR' => 'Director: ' . $Director[0]['Name'] . ' ' . $Director[0]['LastName'],
                    'TYPE' => 'Serie'
                ));
            endforeach;
    

            $Response = array_merge($Series, $Movies);
            shuffle($Response);
    
        break;

        case 'GetMoviesByGender':
            $Gender = !empty($_POST['Gender']) ? $_POST['Gender'] : ''; 
            $Movies = array();
            $Result2 = $VideoOnDemand->GetMoviesByGender($Gender);
            $Cast = array();
            foreach ($Result2 as $line) :
                $Casting = $VideoOnDemand->getCastingByMovie($line['id_pelicula']);

                foreach ($Casting as $CastRow) :
                    array_push($Cast, $CastRow['Name'] . ' ' . $CastRow['LastName']);
                endforeach;


                array_push($Movies, array(
                    'id_pelicula' => $line['id_pelicula'],
                    'TTLE' => $line['nombre_pelicula'],
                    'DSCR' => $line['descripcion_pelicula'],
                    'PSTR' => $line['nombre_poster'],
                    'FILE' => $line['archivo_pelicula'],
                    'FLDR' => $line['folder_pelicula'] . '/',
                    'YEAR' => $line['year'],
                    'BNNR' => $line['show_in_banner'],
                    'RTNG' => $line['clasificacion'],
                    'MNTS' => $line['duracion_minutos'],
                    'DRTN' => $line['duracion_pelicula'],
                    'SCOR' => $line['calificacion'],
                    'CAST' => $Cast,
                    'GNDR' => $Gender,
                    'TYPE' => 'Movie'
                ));
            endforeach;
    
            $Response = $Movies;
    
        break;
        case 'GetSeriesByGender':

            //$Result = $VideoOnDemand->GetGendersList();
            $Series = array();
            $Gender = !empty($_POST['Gender']) ? $_POST['Gender'] : ''; 
            $Result2 = $VideoOnDemand->GetSeriesByGender($Gender);
            $Cast = array();
            foreach ($Result2 as $line) :
                $Casting = $VideoOnDemand->getCastingBySerie($line['id_series']);

                foreach ($Casting as $CastRow) :
                    array_push($Cast, $CastRow['Name'] . ' ' . $CastRow['LastName']);
                endforeach;

                array_push($Series, array(
                    'id_serie' => $line['id_series'],
                    'TTLE' => $line['nombre_serie'],
                    'DSCR' => $line['descripcion_serie'],
                    'PSTR' => $line['nombre_poster'],
                    'FLDR' => $line['folder_serie'] . '/',
                    'YEAR' => $line['year'],
                    'BNNR' => $line['show_in_banner'],
                    'TMPR' => $line['numero_temporadas'],
                    'SCOR' => $line['calificacion'],
                    'RTNG' => $line['clasificacion'],
                    'GNDR' => $Gender,
                    'CAST' => $Cast,
                    'DRTR' => 'Director: ' . $Director[0]['Name'] . ' ' . $Director[0]['LastName'],
                    'TYPE' => 'Serie'
                ));
            endforeach;
    
            $Response = $Series;
    
        break;
        case 'LoadChapters':

            $Chapters = array();
            $id_serie = !empty($_POST['id_serie']) ? $_POST['id_serie'] : ''; 
            $temporada = !empty($_POST['temporada']) ? $_POST['temporada'] : ''; 

            $Result = $VideoOnDemand->getChapters($id_serie, $temporada);

            foreach ($Result as $line) :

                array_push($Chapters, array(
                    'id_capitulo' => $line['id_capitulo'],
                    'TTLE' => $line['nombre_capitulo'],
                    'NMBR' => $line['numero_capitulo'],
                    'DSCR' => $line['descripcion_capitulo'],
                    'TMPR' => $line['temporada'],
                    'SCOR' => $line['calificacion'],
                    'TYPE' => 'Chapter'
                ));
            endforeach;
            $Response = $Chapters;
        break;
    }
    echo json_encode($Response);