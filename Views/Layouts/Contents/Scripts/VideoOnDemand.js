/* @Creado por: Tania Maldonado
 * @Fecha: Julio 2020
 * @Tipo: Funciones para controlar el layout de peliculas
 */

/*******************************************************************************
 * Variables generales
 *******************************************************************************/

 var positionGenderSelect = 0;
 var FilterContainer = document.getElementById('Filter'),
     ListFilters = document.getElementById('ListFilters'),
     ListFiltersNodes = ListFilters.childNodes;
 
 var muvis = document.getElementsByClassName('MoviesRow');
 var series = document.getElementsByClassName('SeriesRow');

 var FiltersOptions = ['By gender', 'By year'],
     FiltersByYear = [],
     FiltersByGender = [];
 var optionSelected = 1;
 var allmovies = document.getElementsByClassName('MoviesRow').childNodes;
 var MenuOptionsNodes = document.getElementById('MenuOptions').childNodes;
 //MenuNodesArray          = [1,3,5,7],
 MenuNodesArray = [1,3,5],
     MenuFocus = -1;
 
 
 var CurrentFocus = '';
 var genero = '', onFocusCategori = 12;
 var GenresList = [];
 var MoviesByGender = [];
 var MoviesList = [];
 
 
 
 var PanelLeftNodes = document.getElementById('PanelLeft').childNodes,
     PanelLeftNodes2 = document.getElementById('PanelLeft').childNodes,
     /*     PanelLeftNodesArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
         GenresBoxLength = 17, */
     PanelLeftNodesArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25],
     PanelLeftNodesArray2 = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25],
     GenresRowLength = 12,
     CategoryFocus = 0,
     CategoryRowFocus = 1,
     CategoryBox = '';
 
 var PanelRightMoviesNodes = document.getElementById('PanelRightMovies').childNodes,
     PanelRightMoviesNodesArray = [1, 3, 5],
     MoviesRowLength = 2,
     MoviesBoxLength = 5,
     IndexMovies = 0,
     MovieRowFocus = -1,
     MovieFocus = 0,
     MovieBox = ''

     PanelRightSeriesNodes = document.getElementById('PanelRightSeries').childNodes,
     PanelRightSeriesNodesArray = [1, 3, 5],
     SeriesRowLength = 2,
     SeriesBoxLength = 5,
     IndexSeries = 0,
     SerieRowFocus = -1,
     SerieFocus = 0,
     SerieBox = ''
     ;
 
 var FolderSource = '../../vod/mvs/';
 
 var BackgroundPanel = document.getElementById('BackgroundPanel');
 
 
 var ListPanel = document.getElementById('ListPanel'),
     MoviePanel = document.getElementById('MoviePanel'),
     MoviePanelNodes = MoviePanel.childNodes;
 
 var MoviePanelPlay = document.getElementById('PlayPanel'),
     MoviePanelExit = document.getElementById('ExitPanel'),
     MoviePanelFocus = 'Play';
 
 
 var PlayingPanel = document.getElementById('PlayingPanel'),
     PlayingOptions = document.getElementById('PlayingOptions'),
     PlayingOptionsNodes = PlayingOptions.childNodes,
     PlayingNodesArray = [1, 3, 5],
     PlayingFocus = -1,
     PlayingPanelTimer = '',
     PlayinPanelActive = false;
 
 var SpeedText = '',
     OptionText = 'play';
 
 var BarPosition = document.getElementById('PlayingPosition'),
     InfoPosition = document.getElementById('InfoPosition'),
     PlayingSpeed = document.getElementById('PlayingSpeed'),
     ExitPlaying = document.getElementById('ExitPlaying'),
     PlayingTitle = document.getElementById('PlayingTitle');
 
 var BarTimer = '',
     BarUpdate = '',
     DurationAsset = 0,
     PositionAssetVod = 0,
     PercentagePosition = 0;
 
 var BoxDivGen = '',
     BoxTileGen = '';
 
 var BoxPoster = '',
     BoxTitle = '',
     BoxDiv = '';
 
 var movilist = false,
     genreslist = false,
 
     pauseVod = false;
 
 
 var cantidadRows;
 var posRows;
 var posRowsCategories;
 var posOptions;
/*******************************************************************************
* Carga inicial
*******************************************************************************/
function Init(){
    GetMoviesByGender();
    GetFiltersList();
    GetGendersList();
    SetFocusHeader('up');
    CurrentFocus = 'Menu';
    GetMoviesList();
    posRows = 0;
    posRowsCategories = 0;
    cantidadRows = Math.ceil(MoviesList.length / 5);
    SetMoviesList();
    SetGenresList();
}

setTimeout(Init,300);

function GetFiltersList() {
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetYearsList'
        },
        success: function (response) {
            FiltersByYear = $.parseJSON(response);
        }
    });

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetGendersList'
        },
        success: function (response) {
            FiltersByGender = $.parseJSON(response);

        }
    });

}

/*******************************************************************************
* Navegacion header
*******************************************************************************/

function SetFocusHeader(Direction) {
    if (MenuFocus >= 0) {
        MenuOptionsNodes[MenuNodesArray[MenuFocus]].classList.remove('OptionFocus');
    }
    if (Direction === 'down') {
        MenuFocus++;

        if (MenuFocus === 2) {
            MenuFocus++;
        }
    } else {
        MenuFocus--;

        if (MenuFocus === 2) {
            MenuFocus--;
        }
    }

    if (MenuFocus >= MenuNodesArray.length) {
        MenuFocus = (MenuNodesArray.length - 1);
    } else if (MenuFocus < 0) {
        MenuFocus = 0;
    }


    MenuOptionsNodes[MenuNodesArray[MenuFocus]].classList.add('OptionFocus');
}


function SelectMenuOption(){

    switch (MenuNodesArray[MenuFocus]) {
    case 1:
        if(optionSelected != 1){
            optionSelected = 1;
            clearSeries();
            Init();
        }
        // Lista de todas las peliculas
    break;
    
    case 3:
        if(optionSelected != 2){
            optionSelected = 2;
            clearMovies();
            setSeries();
        }
        // Selecciona los filtros
    break;
    
    case 5:
        GoPage('menu.php', Device['MenuId'], 'Menu');
        // Search (aun no esta activo)
    break;
    
    case 7:
        // Regresa a la television
        
    break;
}
}

/*******************************************************************************
* Lista peliculas, sin filtros
*******************************************************************************/
function GetMoviesList() {
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetMoviesList'
        },
        success: function (response) {
            MoviesList = $.parseJSON(response);


        }
    });
}
function GetGendersList() {
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetGendersList'
        },
        success: function (response) {
            GenresList = $.parseJSON(response);


        }
    });

}
function GetMoviesByGender() {
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetMoviesByGender'
        },
        success: function (response) {
            MoviesByGenderList = $.parseJSON(response);


        }
    });


}

function SetGenresList() {
    genreslist = false;
    var genres = document.getElementsByClassName('OptionsFilter');
    genres[0].innerHTML = "";
    genres[1].innerHTML = "";
    genres[2].innerHTML = "";
    genres[3].innerHTML = "";
    genres[4].innerHTML = "";
    genres[5].innerHTML = "";
    genres[6].innerHTML = "";
    genres[7].innerHTML = "";
    genres[8].innerHTML = "";
    genres[9].innerHTML = "";
    genres[10].innerHTML = "";
    genres[11].innerHTML = "";
    genres[12].innerHTML = "";
    genres[13].innerHTML = "";
    genres[14].innerHTML = "";
    genres[15].innerHTML = "";
    BoxDivGen = document.createElement('div');
    BoxTileGen = document.createElement('h6');
    BoxDivGen.setAttribute('class', 'Category');
    BoxTileGen.textContent = 'Select a Category';
    BoxDivGen.appendChild(BoxTileGen);
    PanelLeftNodes[PanelLeftNodesArray[0]].appendChild(BoxDivGen);

    for (var index = 0; index < 11; index++) {
        BoxDivGen = document.createElement('div');
        BoxTileGen = document.createElement('h6');

        BoxDivGen.setAttribute('class', 'RowGenre');
        BoxDivGen.setAttribute('id', index + 1);
        BoxTileGen.textContent = GenresList[index];

        BoxDivGen.style.border = '3px solid transparent';
        BoxDivGen.appendChild(BoxTileGen);
        PanelLeftNodes[PanelLeftNodesArray[index + 1]].appendChild(BoxDivGen);
        if (index === 10) {
            BoxDivGen = document.createElement('div');
            BoxTileGen = document.createElement('h6');

            BoxDivGen.setAttribute('class', 'RowGenre');
            BoxDivGen.setAttribute('id', index + 2);
            BoxTileGen.textContent = "All Movies";
            BoxDivGen.appendChild(BoxTileGen);
            PanelLeftNodes[PanelLeftNodesArray[index + 2]].appendChild(BoxDivGen);
        }

    }
    PlayingVod = true;

}
function setSeries(){
    document.getElementById("PanelRightMovies").style.display = "none";
    document.getElementById("PanelRightSeries").style.display = "inline";
}
function SetMoviesList() {
    document.getElementById("PanelRightMovies").style.display = "inline";
    document.getElementById("PanelRightSeries").style.display = "none";

    movilist = false;
     
    var muvis = document.getElementsByClassName('MoviesRow');
    muvis[0].innerHTML = "";
    muvis[1].innerHTML = "";

    var IndexR = 0,
        IndexM = 0,
        IndexB = posRows * 5;

    if (posRows % 2 != 0) {
        IndexB = IndexB - 5;
    }
    
    StopVideo();
    
    if (posRows % 2 == 0 && (posRows == cantidadRows)) {
        MoviesRowLength = 1;
        MoviesBoxLength = MoviesList.length - IndexB;
    } else {
        MoviesRowLength = 2;
        MoviesBoxLength = 5;
    }


    for (IndexR = 0; IndexR < MoviesRowLength; IndexR++) {

        for (IndexM = 0; IndexM < MoviesBoxLength; IndexM++) {
            if (IndexB > (MoviesList.length - 1)) {
                IndexM = MoviesBoxLength;
                IndexR = MoviesRowLength;
            } else {
                BoxDiv = document.createElement('div');
                BoxPoster = document.createElement('img');
                /*  BoxTitle = document.createElement('h3'); */

                BoxDiv.setAttribute('class', 'RowPoster');
                BoxDiv.setAttribute('id', IndexB);
                //alert(MoviesList[IndexB].FLDR);
                BoxPoster.src = FolderSource + MoviesList[IndexB].FLDR + MoviesList[IndexB].PSTR;
                /* BoxTitle.textContent = MoviesList[IndexB].TTLE; */

                BoxDiv.appendChild(BoxPoster);
                /* BoxDiv.appendChild(BoxTitle); */
                PanelRightMoviesNodes[PanelRightMoviesNodesArray[IndexR]].appendChild(BoxDiv);
                IndexB++;
            }
        }
    }
    BackgroundPanel.style.backgroundImage = "url('" + FolderSource + "bg/VDM2_mini.png')";
    PlayingVod = false;

}



function SetMoviesListByGender(CategoryRowFocus) {
    document.getElementById("PanelRightMovies").style.display = "inline";
    document.getElementById("PanelRightSeries").style.display = "none";
    for (var index = 0; index < MoviesByGender.length; index++) {
        MoviesByGender[index] = '';

    }
    movilist = false;

    genero = (GenresList[CategoryRowFocus]).toString();
    var IndexG = 0;
    var cont = 0;
    posRows = 0;
    posRowsCategories = 0;
    MovieFocus = -1;
    MovieRowFocus = -1;
    cantidadRows = Math.ceil(MoviesByGenderList.length / 5);
    for (IndexG = 0; IndexG < MoviesByGenderList.length; IndexG++) {

        if (genero == MoviesByGenderList[IndexG].GNDR) {
            MoviesByGender[cont] = MoviesByGenderList[IndexG];
            cont++
        }

    }
    var IndexR = 0,
        IndexM = 0,
        IndexB = posRows * 5;

    if (posRows % 2 != 0) {
        IndexB = IndexB - 5;
    }
    MoviesList = MoviesByGender;
    StopVideo();

    if (posRows % 2 == 0 && (posRows == cantidadRows)) {
        MoviesRowLength = 1;
        MoviesBoxLength = MoviesList.length - IndexB;
    } else {
        MoviesRowLength = 2;
        MoviesBoxLength = 5;
    }


    for (IndexR = 0; IndexR < MoviesRowLength; IndexR++) {

        for (IndexM = 0; IndexM < MoviesBoxLength; IndexM++) {

            if (IndexB > (MoviesList.length - 1)) {
                IndexM = MoviesBoxLength;
                IndexR = MoviesRowLength;
            } else {
                if (MoviesList.length !== 0) {

                    BoxDiv = document.createElement('div');
                    BoxPoster = document.createElement('img');
                    /*  BoxTitle = document.createElement('h3'); */

                    BoxDiv.setAttribute('class', 'RowPoster');
                    BoxDiv.setAttribute('id', IndexB);

                    BoxPoster.src = FolderSource + MoviesList[IndexB].FLDR + MoviesList[IndexB].PSTR;
                    /* BoxTitle.textContent = MoviesList[IndexB].TTLE; */
                  
                    BoxDiv.appendChild(BoxPoster);
                    /* BoxDiv.appendChild(BoxTitle); */
                    PanelRightMoviesNodes[PanelRightMoviesNodesArray[IndexR]].appendChild(BoxDiv);

                    IndexB++;
                } else {
                    clearMovies();

                }


            }
        }
    }
    BackgroundPanel.style.backgroundImage = "url('" + FolderSource + "bg/VDM2_mini.png')";
    PlayingVod = false;
}



function SetFocusMovie(Direction) {

    // if (MoviesByGender.length == 0) {
    //     //ClearFocusPanelLeft();
    // }

    if (MovieRowFocus !== -1 && MovieFocus !== -1) {
        PanelRightMoviesNodes[PanelRightMoviesNodesArray[MovieRowFocus]].childNodes[MovieFocus].style.border = '3px solid transparent';
    }

    if (Direction === 'up') {
        if (MovieRowFocus > 0) {
            posRows--;
            MovieRowFocus--;
        } else if (posRows > 1 && posRows % 2 == 0) {
            MovieRowFocus = 1;
            posRows--;
            movilist = true;
        }
    } else if (Direction === 'down') {
        if (MovieRowFocus < MoviesRowLength - 1) {
            MovieRowFocus++;
            posRows++;
            if (posRows == cantidadRows - 1) {
                MovieFocus = 0;
            }

        } else if (posRows < cantidadRows - 1 && posRows % 2 != 0) {
            MovieRowFocus = 0;
            MovieFocus = 0;
            posRows++;
            movilist = true;
        }
    } else if (Direction === 'left') {
        if (MovieFocus > 0) {
            MovieFocus--;
        }
    } else if (Direction === 'right') {
        if (MovieFocus < (MoviesBoxLength - 1)) {
            MovieFocus++;
        }
    } else if (Direction === 'set') {
        if (MovieRowFocus === -1) {
            MovieRowFocus++;
        }
        MovieFocus = 0;
    }
    if (movilist) {
        SetMoviesList();
    }
    MovieBox = PanelRightMoviesNodes[PanelRightMoviesNodesArray[MovieRowFocus]].childNodes[MovieFocus];
    if (typeof (MovieBox) === 'undefined') {
        if (Direction === 'up') {
            MovieRowFocus++;
        } else if (Direction === 'down') {
            MovieRowFocus--;
        } else if (Direction === 'left') {
            if (MovieFocus > 0) {
                MovieFocus++;
            }
        } else if (Direction === 'right') {

            if (MovieFocus < (MoviesBoxLength - 1)) {
                MovieFocus--;
            }

        }
        //if (MoviesByGender.length !== 0) {
            MovieBox = PanelRightMoviesNodes[PanelRightMoviesNodesArray[MovieRowFocus]].childNodes[MovieFocus];
        //}

    }

    MovieBox.style.border = '3px solid #fff'; //.classList.add('OptionFocus');
}

function SetFocusCategory(Direction) {

    if (CategoryRowFocus !== 0) {
        PanelLeftNodes[PanelLeftNodesArray[CategoryRowFocus]].childNodes[0].style.border = '3px solid transparent';
    }


    if (Direction === 'up') {
        if (CategoryRowFocus > 1) {
            CategoryRowFocus--;

        } else {
            CategoryRowFocus = 1;
        }

    } else if (Direction === 'down') {
        if (CategoryRowFocus < GenresRowLength) {
            CategoryRowFocus++;

        }
    } else if (Direction === 'set') {
        if (CategoryRowFocus === 1) {
            CategoryRowFocus++;
        }
        CategoryRowFocus = 1;
    }
    

    /* if (genreslist) {
        SetGenresList();
    }
 */
    //for(var i = 1; ){

    //}
    CategoryBox = PanelLeftNodes[PanelLeftNodesArray[CategoryRowFocus]].childNodes[0];

    if (typeof (CategoryBox) === 'undefined') {
        if (Direction === 'up') {
            CategoryRowFocus++;
        } else if (Direction === 'down') {
            CategoryRowFocus--;
        } /* else if (Direction === 'left') {

           CategoryRowFocus = CategoryRowFocus;
        } else if (Direction === 'right') {

            if (MovieFocus < (GenresRowLength - 1)) {
                CategoryFocus--;
            }
          
        } */

        CategoryBox = PanelLeftNodes[PanelLeftNodesArray[CategoryRowFocus]].childNodes[0];

    }
    
    CategoryBox.style.border = '3px solid #fff'; //.classList.add('OptionFocus');
    BackgroundPanel.style.backgroundImage = "url('" + FolderSource + "bg/VDM2_mini.png')";
    PlayingVod = false;

}

/*******************************************************************************
* 
*******************************************************************************/

function LoadMoviePanel() {
    CurrentFocus = 'MoviePanel';

    ListPanel.style.visibility = 'hidden';
    MoviePanel.style.visibility = 'visible';
    Debug("LoadMoviePanel");

    //MoviePanelNodes[1].src = FolderSource + MoviesList[MovieBox.id].FLDR + 'HD'+MoviesList[MovieBox.id].PSTR;
    MoviePanelNodes[1].src = FolderSource + MoviesList[MovieBox.id].FLDR + MoviesList[MovieBox.id].PSTR;
    MoviePanelNodes[3].textContent = MoviesList[MovieBox.id].TTLE;
    MoviePanelNodes[5].textContent = MoviesList[MovieBox.id].SCOR;
    MoviePanelNodes[9].textContent = MoviesList[MovieBox.id].DRTN;
    MoviePanelNodes[11].textContent = MoviesList[MovieBox.id].GNDR;
    MoviePanelNodes[13].textContent = MoviesList[MovieBox.id].YEAR;
    MoviePanelNodes[15].textContent = MoviesList[MovieBox.id].RTNG;
    MoviePanelNodes[17].textContent = MoviesList[MovieBox.id].DSCR;
    MoviePanelNodes[19].textContent = MoviesList[MovieBox.id].DRTR;
    MoviePanelNodes[21].textContent = 'Casting: ' + MoviesList[MovieBox.id].CAST;

    BackgroundPanel.style.backgroundImage = "url('" + FolderSource + MoviesList[MovieBox.id].FLDR + 'preview.png' + "')";

    MoviePanelFocus = 'Play';
    SetFocusOnMoviePanel();

    PlayingFocus = -1;
    PlayingPanel.style.visibility = 'hidden';
    PlayingVod = false;
    HidePlayingPanel();
    StopVideo();
}

function clearMovies() {
    muvis[0].innerHTML = "";
    muvis[1].innerHTML = "";
    MoviesByGender = [];
}
function clearSeries() {
    series[0].innerHTML = "";
    series[1].innerHTML = "";
    SeriesByGender = [];
}

function ClearFocusHeader() {
    var IndexC = 0;
    for (IndexC = 0; IndexC < MenuNodesArray.length; IndexC++) {
        MenuOptionsNodes[MenuNodesArray[IndexC]].classList.remove('OptionFocus');
    }
}

function ClearFocusPanelLeft() {
    for (var index = 1; index < PanelLeftNodesArray.length; index++) {
    if (CurrentFocus === 'MenuCategories') {
        PanelLeftNodes[PanelLeftNodesArray[positionGenderSelect]].childNodes[0].classList.remove('ButtonFocus')
    }
    if (index !== positionGenderSelect) {
        PanelLeftNodes[PanelLeftNodesArray[positionGenderSelect]].childNodes[0].classList.remove('ButtonFocus')     
    }    
    PanelLeftNodes[PanelLeftNodesArray[CategoryRowFocus]].childNodes[0].style.border = '3px solid transparent'
    }
}

function ClearMoviePanel() {
    MoviePanel.style.visibility = 'hidden';

    MoviePanelNodes[1].src = '';
    MoviePanelNodes[3].textContent = '';
    MoviePanelNodes[5].textContent = '';
    MoviePanelNodes[9].textContent = '';
    MoviePanelNodes[11].textContent = '';
    MoviePanelNodes[13].textContent = '';
    MoviePanelNodes[15].textContent = '';
    MoviePanelNodes[17].textContent = '';
    MoviePanelNodes[19].textContent = '';
    MoviePanelNodes[21].textContent = '';

}
function ClearFocusMovieList() {
    PanelRightMoviesNodes[PanelRightMoviesNodesArray[MovieRowFocus]].childNodes[MovieFocus].style.border = '3px solid transparent';
    MovieFocus--;
}
function ClearFocusPlaying() {
    var IndexC = 0;

    for (IndexC = 0; IndexC < PlayingNodesArray.length; IndexC++) {
        PlayingOptionsNodes[PlayingNodesArray[IndexC]].classList.remove('ButtonFocus');
    }
}

function SetFocusOnMoviePanel() {
    if (MoviePanelFocus === 'Play') {
        MoviePanelPlay.classList.add('MovieOption');
        MoviePanelExit.classList.remove('MovieOption');
        MoviePanelFocus = 'Exit';
    } else {
        MoviePanelPlay.classList.remove('MovieOption');
        MoviePanelExit.classList.add('MovieOption');
        MoviePanelFocus = 'Play';
    }
}


function ExecOptionMoviePanel() {

    if (MoviePanelFocus === 'Play') {
        ListPanel.style.visibility = 'visible';
        MoviePanel.style.visibility = 'hidden';

        CurrentFocus = 'Movies';

        BackgroundPanel.style.backgroundImage = "url('" + FolderSource + "bg/VDM2_mini.png')";
    }else {        
        CurrentFocus = 'Playing';
        ClearMoviePanel();
        ShowPlayingPanel();        
        SetFocusPlaying('right');

        PlayVideo(Libraries['MoviesSource'] + MoviesList[MovieBox.id].FLDR + MoviesList[MovieBox.id].FILE);
        PlayingVod = true;
        

        BackgroundPanel.style.visibility = 'hidden';
    }
}

/*******************************************************************************
* 
*******************************************************************************/

function ShowPlayingPanel() {
    PlayingPanel.style.visibility = 'visible';
    Debug("ShowPlayingPanel");
    PlayinPanelActive = true;

    if (OptionText !== 'pause') {
        clearTimeout(PlayingPanelTimer);

        /* Contador para ocultar contenedor principal con la informacion*/
        PlayingPanelTimer = setTimeout(HidePlayingPanel, 7000);
    } else {
        clearTimeout(PlayingPanelTimer);
    }

    PlayingTitle.textContent = MoviesList[MovieBox.id].TTLE;

    UpdateBarStatus();

    clearTimeout(BarUpdate);

    BarUpdate = setInterval(UpdateBarStatus, 1000);

    //SetFocusPlaying('right');
}


function HidePlayingPanel() {
    if (PlayinPanelActive === true) {
        PlayingPanel.style.visibility = 'hidden';

        PlayinPanelActive = false;

        clearTimeout(PlayingPanelTimer);

        clearTimeout(BarUpdate);

        ExitPlaying.classList.remove('ButtonFocus');
    }
}

function SetFocusPlaying(Direction) {
    if (PlayinPanelActive === true) {

        if (PlayingFocus >= 0 && PlayingFocus < PlayingNodesArray.length) {
            PlayingOptionsNodes[PlayingNodesArray[PlayingFocus]].classList.remove('ButtonFocus');
        }

        (Direction === 'right') ? PlayingFocus++ : PlayingFocus--;


        if (PlayingFocus >= PlayingNodesArray.length) {
            PlayingFocus = (PlayingNodesArray.length - 1);
        } else if (PlayingFocus < 0) {
            PlayingFocus = 0;
        }

        PlayingOptionsNodes[PlayingNodesArray[PlayingFocus]].classList.add('ButtonFocus');

        /* */
        clearTimeout(PlayingPanelTimer);

        PlayingPanelTimer = setTimeout(HidePlayingPanel, 7000);

    }
}




function SelectPlayingOption() {
    Debug('VodOk---> SelectPlayingOption');
    if (PlayinPanelActive === true) {
        switch (PlayingNodesArray[PlayingFocus]) {
            case 1:
                // Backward
                Debug('VodOk---> SelectPlayingOption 1');
                SetSpeed('backward');
                break;

            case 3:
                // Play
                Debug('VodOk---> SelectPlayingOption 3');
                //SetSpeed('play');
                if (pauseVod == true) {
                    pauseVod = false;
                    ResumeVideo();
                } else {
                    pauseVod = true;
                    PauseVideo();
                }


                break;

            case 5:
                SetSpeed('forward');
                break;

            case 8:
                // close
                Debug('VodOk---> SelectPlayingOption 8');
                StopVideo();

                break;
        }
        if (OptionText !== 'pause') {
            clearTimeout(PlayingPanelTimer);

            /* Contador para ocultar contenedor principal con la informacion*/
            PlayingPanelTimer = setTimeout(HidePlayingPanel, 7000);
        } else {
            clearTimeout(PlayingPanelTimer);
        }
    }
}


function SetFocusClose() {

    ClearFocusPlaying();

    ExitPlaying.classList.add('ButtonFocus');

    PlayingFocus++;

    CurrentFocus = 'StopPlaying';

    clearTimeout(PlayingPanelTimer);

    PlayingPanelTimer = setTimeout(HidePlayingPanel, 7000);
}

function UnsetFocusClose() {
    ExitPlaying.classList.remove('ButtonFocus');

    SetFocusPlaying('left');

    CurrentFocus = 'Playing';
}
/*******************************************************************************
* Opciones reproduccion
*******************************************************************************/

function SetSpeed(Option) {
    Debug('VodOk---> SetSpeed: ' + Option);
    if (Option === 'forward') {
        Debug('VodOk---> UpdatePosition: add');
        UpdatePositionVod('add');
    } else if (Option === 'backward') {
        UpdatePositionVod('subtract');
    } else if (Option === 'pause') {
        PauseVideo();
    } else if (Option === 'play') {
        ResumeVideo();
    }

    OptionText = Option;
}

function UpdateBarStatus() {
    //Debug('UpdateBarStatus-> ' + MoviesList[MovieBox.id].MNTS);
    AssetStatusVod(MoviesList[MovieBox.id].MNTS);
    BarPosition.style.width = PercentagePosition + '%';
    InfoPosition.textContent = SecondsToTimeVod(PositionAssetVod) + ' / ' + MoviesList[MovieBox.id].DRTN;
    PlayingSpeed.textContent = SpeedText;
    //Debug('UpdateBarStatus-> PercentagePosition = ' + PercentagePosition);
}


/*******************************************************************************
* 
*******************************************************************************/

function StopCloseMovie() {
    ListPanel.style.visibility = 'visible';
    MoviePanel.style.visibility = 'hidden';
    BackgroundPanel.style.visibility = 'visible';

    CurrentFocus = 'Movies';
    BackgroundPanel.style.backgroundImage = "url('" + FolderSource + "bg/VDM2_mini.png')";
    PlayingVod = false;
    HidePlayingPanel();
    StopVideo();
}

/*******************************************************************************
* Navegacion 
*******************************************************************************/

function VodRight() {
    if (CurrentFocus === 'Menu') {
        //
        /* CurrentFocus = 'Movies'; */
        CurrentFocus = 'MenuCategories'
        ClearFocusHeader();
        SetFocusCategory('set');

    } else if (CurrentFocus === 'MenuCategories') {
        if (MoviesByGender.length !== 0 || MoviesList.length !== 0) {
            CurrentFocus = 'Movies';
            
            
            SetFocusMovie('set');
            ClearFocusPanelLeft();
            if (positionGenderSelect !== 0) {  
                PanelLeftNodes[PanelLeftNodesArray[positionGenderSelect]].childNodes[0].classList.add('ButtonFocus')
            }
        }

    } else if (CurrentFocus === 'Movies') {
        SetFocusMovie('right');
    } else if (CurrentFocus === 'MoviePanel') {

        SetFocusOnMoviePanel();
    } else if (CurrentFocus === 'Playing') {
        
        if (PlayinPanelActive == true) {
            SetFocusPlaying('right');
        } else {
            ShowPlayingPanel();
        }
    }
}

function VodLeft() {
    if (CurrentFocus === 'Menu') {
        ///
    } else if (CurrentFocus === 'MenuCategories') {
        
        if (CategoryRowFocus > 0) {
            CurrentFocus = 'Menu';
            MenuFocus--;
            MenuFocus--;         
            SetFocusHeader('up');
            ClearFocusPanelLeft();
            if (positionGenderSelect !== 0) {  
                PanelLeftNodes[PanelLeftNodesArray[positionGenderSelect]].childNodes[0].classList.add('ButtonFocus')
            }
        }
    } else if (CurrentFocus === 'Movies') {
        if (MovieFocus === 0) {
            CategoryRowFocus--;
            CurrentFocus = 'MenuCategories';

            ClearFocusMovieList();

            SetFocusCategory('down');
        } else {
            SetFocusMovie('left');
        }
    } else if (CurrentFocus === 'MoviePanel') {
        SetFocusOnMoviePanel();
    } else if (CurrentFocus === 'Playing') {
        if (PlayinPanelActive == true) {
            SetFocusPlaying('left');
        } else {
            ShowPlayingPanel();
        }
    }
}

function VodDown() {
    if (CurrentFocus === 'Menu') {
        SetFocusHeader('down');
    } else if (CurrentFocus === 'MenuCategories') {
        if (positionGenderSelect !== 0) {  
            PanelLeftNodes[PanelLeftNodesArray[positionGenderSelect]].childNodes[0].classList.add('ButtonFocus')
        }
        SetFocusCategory('down'); 
    } else if (CurrentFocus === 'Movies') {
        SetFocusMovie('down');
    } else if (CurrentFocus === 'MoviePanel') {
        SetFocusOnMoviePanel();
    } else if (CurrentFocus === 'StopPlaying') {
        if (PlayinPanelActive == true) {
            UnsetFocusClose();
        } else {
            ShowPlayingPanel();
        }
    }
}

function VodUp() {
    if (CurrentFocus === 'Menu') {
        SetFocusHeader('up');
    } else if (CurrentFocus === 'MenuCategories') {
        if (positionGenderSelect !== 0) {
            PanelLeftNodes[PanelLeftNodesArray[positionGenderSelect]].childNodes[0].classList.add('ButtonFocus')
        }
        SetFocusCategory('up');
    } else if (CurrentFocus === 'Movies') {
        SetFocusMovie('up');
    } else if (CurrentFocus === 'MoviePanel') {
        SetFocusOnMoviePanel();
    } else if (CurrentFocus === 'Playing') {
        if (PlayinPanelActive == true) {
            SetFocusClose();
        } else {
            ShowPlayingPanel();
        }
    }
}

function VodClose() {
    if (CurrentFocus === 'Playing' || CurrentFocus === 'StopPlaying') {
        HidePlayingPanel();
    }
}

function VodOk() {
    
    if (CurrentFocus === 'Menu') {
        SelectMenuOption();
    } else if (CurrentFocus === 'MenuCategories') {
        clearMovies();
        ClearFocusPanelLeft();
        
        positionGenderSelect = CategoryRowFocus;
        if (positionGenderSelect !== 0) {  
            PanelLeftNodes[PanelLeftNodesArray[positionGenderSelect]].childNodes[0].classList.add('ButtonFocus')
        }
        if (CategoryRowFocus == 12) {
            GetMoviesList();
            posRows = 0;
            posRowsCategories = 0;
            cantidadRows = Math.ceil(MoviesList.length / 5);
            SetMoviesList();   
        }else{
            SetMoviesListByGender(CategoryRowFocus - 1);
        }
    } else if (CurrentFocus === 'Movies') {
        LoadMoviePanel();
    } else if (CurrentFocus === 'MoviePanel') {
        ExecOptionMoviePanel();
    } else if (CurrentFocus === 'Playing') {
        Debug('VodOk---> Playing');
        if (PlayinPanelActive == true) {
            SelectPlayingOption();
        } else {
            ShowPlayingPanel();
        }
    } else if (CurrentFocus === 'StopPlaying') {
        if (PlayinPanelActive == true) {
            StopCloseMovie();
            CurrentFocus === 'Movies'
            LoadMoviePanel();
        } else {
            ShowPlayingPanel();
        }
    }
}

function VodInfo() {
    if (CurrentFocus === 'Playing' || CurrentFocus === 'StopPlaying') {
        ShowPlayingPanel();
    }
}

function moviesClose() {
    if (CurrentFocus === 'Menu') {
        GoPage('menu.php', Device['MenuId'], 'Menu');
    } else if (CurrentFocus === 'Movies') {
        GoPage('menu.php', Device['MenuId'], 'Menu');
    } else if (CurrentFocus === 'MoviePanel') {
        ListPanel.style.visibility = 'visible';
        MoviePanel.style.visibility = 'hidden';
        CurrentFocus = 'Movies';
        BackgroundPanel.style.backgroundImage = "url('" + FolderSource + "bg/VDM2_mini.png')";
    } else if (CurrentFocus === 'Playing') {
        Debug('VodOk---> Playing');
        LoadMoviePanel();
        ClearFocusPlaying();
    }
}