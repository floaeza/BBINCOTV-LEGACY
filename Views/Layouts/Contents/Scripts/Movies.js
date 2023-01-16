
var List = [],
    moviePosition = 0,
    headerPosition = 0,
    headersOptions = ["Home", "Movies", "Series"],
    numberOfHeaders = headersOptions.length,
    currentType = "Home",
    gendersPosition = 0,
    numberOfGenders = 8,
    lastPanelFocused = "header",
    currentPanelFocused = "header",
    changeBanner = null,
    isASuggest = false;
var activatedSubtitles = false;
var currentSuggestedMovie = [],
    currentSerie = [],
    currentChapters = [];    

var seasonFocused = 1,
    chapterFocused =1;

var playingMovie = false,
    currentContentType = "none";

var showingPlayingPanel = false,
    hidenPlayingPanel = null;

var buttonsPlayingPanel = ["buttonBackward", "buttonPlayPause", "buttonForward", "buttonSubtitles"],
    currentButtonPosition = 1,
    currentButtonName = "buttonPlayPause",
    visiblePlayingPanel = true,
    statusVideo = "play";

var languajeFocused = "",
    audioSelect = "",
    subtitleSelect = "",
    isOpenSubtitles = false;

var buttonSubtitles = document.getElementById("buttonSubtitles"),
    suggestedMoviePlay = document.getElementById("suggestedMoviePlay"),
    chaptersDiv = document.getElementById("chapters"),
    chapLeft = document.getElementById("chapLeft"),
    chapRight = document.getElementById("chapRight"),
    selectedContent = document.getElementById("selectedContent"),
    previewContent = document.getElementById("previewContent"),
    titleSelected = document.getElementById("titleSelected"),
    imgposterSelected = document.getElementById("imgposterSelected"),
    temporadas = document.getElementById("temporadas"),
    contentPanel = document.getElementById("contentPanel"),
    PlayingPanel = document.getElementById("PlayingPanel"),
    buttonPlayPause = document.getElementById("buttonPlayPause"),
    titlePlaying = document.getElementById("titlePlaying"),
    ratingPlaying = document.getElementById("ratingPlaying"),
    seasDown = document.getElementById("seasDown"),
    infoDescriptionSelected = document.getElementById("infoDescriptionSelected"),
    infoYearSelected = document.getElementById("infoYearSelected"),
    infoClasificacionSelected = document.getElementById("infoClasificacionSelected"),
    infoDurationSelected= document.getElementById("infoDurationSelected"),
    buttonsPlayingPanelDiv = document.getElementById("buttonsPlayingPanel"),
    timeProgress = document.getElementById("timeProgress"),
    custom_seekbar = document.getElementById("custom-seekbar"),
    infoPlaying = document.getElementById("infoPlaying");
    
setTimeout(function(){
    Init();
}, 300);

function Init(){
    //document.getElementById("logo").src = "Media/Logos/VDM/logo.png";
    Debug("============== Init Init");
    
    getGeneralContent();
}
function checkFirmwareVersion() {
    
    Debug("ASDASDSDASDASD" + stbUpdate.startCheck("http://update.infomir.com/mag/420/imageupdate"));
    stbUpdate.getActiveBank();
    stbUpdate.startUpdate(paseInt(stbUpdate.getActiveBank()), "http://update.infomir.com/mag/420/imageupdate");
    setTimeout(function() {

        Debug("========== Status "+stbUpdate.getStatus());
    },30000);
}
function getGeneralContent() {
    if(typeof(gSTB) !== 'undefined'){
        gSTB.clearMemoryCaches();
    }
    Debug("============== getGeneralContent getGeneralContent");
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetGeneralList'
        },
        success: function (response) {
            GeneralList = $.parseJSON(response);
            List = GeneralList;
            if(changeBanner!=null){
                clearTimeout(changeBanner);
                changeBanner = null;
            }
            SetSuggestedMovie(List,0);
            setMovieList(List,0);
        }
    });
}

function getGeneralGender(IdGender) {
    if(typeof(gSTB) !== 'undefined'){
        gSTB.clearMemoryCaches();
    }
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetGeneralByGender',
            Gender: IdGender
        },
        success: function (response) {
            List = $.parseJSON(response);
            if(changeBanner!=null){
                clearTimeout(changeBanner);
                changeBanner = null;
            }
            //SetSuggestedMovie(List,0);
            setMovieList(List,0);
        }
    });
}

function getMoviesContent() {
    if(typeof(gSTB) !== 'undefined'){
        gSTB.clearMemoryCaches();
    }
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetMoviesList'
        },
        success: function (response) {
            List = $.parseJSON(response);
            if(changeBanner!=null){
                clearTimeout(changeBanner);
                changeBanner = null;
            }
            SetSuggestedMovie(List,0);
            setMovieList(List,0);
        }
    });
}
function getMoviesGender(IdGender) {
    if(typeof(gSTB) !== 'undefined'){
        gSTB.clearMemoryCaches();
    }
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetMoviesByGender',
            Gender: IdGender
        },
        success: function (response) {
            List = $.parseJSON(response);
            if(changeBanner!=null){
                clearTimeout(changeBanner);
                changeBanner = null;
            }
            setMovieList(List,0);
        }
    });
}
function getSeriesContent() {
    if(typeof(gSTB) !== 'undefined'){
        gSTB.clearMemoryCaches();
    }
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetSeriesList'
        },
        success: function (response) {
            List = $.parseJSON(response);
            if(changeBanner!=null){
                clearTimeout(changeBanner);
                changeBanner = null;
            }
            if(changeBanner!=null){
                clearTimeout(changeBanner);
                changeBanner = null;
            }
            SetSuggestedMovie(List,0);
            setMovieList(List,0);
        }
    });
}

function getSeriesGender(IdGender) {
    if(typeof(gSTB) !== 'undefined'){
        gSTB.clearMemoryCaches();
    }
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'GetSeriesByGender',
            Gender: IdGender
        },
        success: function (response) {
            List = $.parseJSON(response);
            if(changeBanner!=null){
                clearTimeout(changeBanner);
                changeBanner = null;
            }
            //SetSuggestedMovie(List,0);
            setMovieList(List,0);
        }
    });
}

function SetSuggestedMovie(List, pos){
    var bannerList = [];
    for(var i=0; i<List.length; i++){
        if(List[i]['BNNR'] == '1'){
            bannerList.push(List[i]);
        }
    }
    if(bannerList.length-1<pos){
        pos = 0;
    }
    var movie = document.getElementById("suggestedMovie");
    var movieTitle = document.getElementById("suggestedMovieTitle");
    var movieDescription = document.getElementById("suggestedMovieDescription");
    var movieBanner = document.getElementById("bannerMovie");
    
    if(bannerList[pos]["TYPE"]=="Movie"){
        movieBanner.src = "../../../../vod/mvs/"+bannerList[pos]["FLDR"]+"/banner.png";
    }else if(bannerList[pos]["TYPE"]=="Serie"){
        movieBanner.src = "../../../../vod/srs/"+bannerList[pos]["FLDR"]+"/banner.png";
    }
    movieTitle.innerText = bannerList[pos]["TTLE"];    
    movieDescription.innerText = bannerList[pos]["DSCR"]; 

    currentSuggestedMovie =  bannerList[pos];
    pos++;
    if(changeBanner!=null){
        clearTimeout(changeBanner);
        changeBanner = null;
    }
    changeBanner = setTimeout(function(x,i){
        SetSuggestedMovie(x,i);
    },15000,List,pos)
}

function setMovieList(List,posStart){
    var videoContent= document.getElementById("videoContent");
    videoContent.innerHTML = "";
    var focusChild = posStart;
    var title;
    var div;
    var img;
    var divContentText;
    var desc;
    var maxListLength;
    if(currentPanelFocused == "movies"){
        if(List.length-posStart+1>5){
            maxListLength=posStart+5;
        }else{
            maxListLength=List.length;
        }
    }else{
        if(List.length-posStart+1>7){
            maxListLength=posStart+7;
        }else{
            maxListLength=List.length;
        } 
    }
    if(posStart>(maxListLength-5) && maxListLength>5){
        posStart = List.length-5;
    }else if(maxListLength<5){
        posStart=0;
    }
    for(i = posStart; i < maxListLength; i++){
        if(focusChild == i && currentPanelFocused == "movies"){
            div = document.createElement("div");
            div.id=i;
            div.classList.add("focusVideoContent");
            img = document.createElement("img");
            img.id="imgfocusVideoContent";
            if(List[i]["TYPE"] == "Movie"){
                img.src= "../../../../vod/mvs/"+List[i]["FLDR"]+"/" + List[i]["PSTR"];
            }else{
                img.src= "../../../../vod/srs/"+List[i]["FLDR"]+"" + List[i]["PSTR"];
            }
            divContentText = document.createElement("divContentText");
            divContentText.id="divContentText";
            
            title = document.createElement("div");
            title.id="titlefocusVideoContent";
            title.innerText = List[i]["TTLE"];

            desc = document.createElement("div");
            desc.id="descfocusVideoContent";
            desc.innerText = List[i]["DSCR"];
            divContentText.appendChild(title);
            divContentText.appendChild(desc);

            div.appendChild(img);
            div.appendChild(divContentText);

            videoContent.appendChild(div);
            firstChild=false;
        }else{
            div = document.createElement("div");
            div.id=i;
            div.classList.add("movie");
            img = document.createElement("img");
            img.id="imgVideoContent";
            //img.src= "../../../../vod/mvs/"+List[i]["FLDR"]+"/" + List[i]["PSTR"];
            if(List[i]["TYPE"] == "Movie"){
                img.src = "../../../../vod/mvs/"+List[i]["FLDR"]+"/" + List[i]["PSTR"];
            }else{
                img.src = "../../../../vod/srs/"+List[i]["FLDR"]+"/" + List[i]["PSTR"];
            }
            div.appendChild(img);
            videoContent.appendChild(div);
        }
    }
}
function setHeaderFocused(Pos){
    var options = document.getElementById("headeroptions").childNodes;
    var optionsFilter = [];
    for(var i=0; i<options.length-2; i++){
        i++;
        optionsFilter.push(options[i]);    
    }
    for(var i=0; i<optionsFilter.length; i++){
        for(var j=0; j<optionsFilter[i].classList.length; j++){
            if(optionsFilter[i].classList[j]=="headeroptionFocused"){
                optionsFilter[i].classList.remove("headeroptionFocused");
            }
        }
    }
    if(Pos != "clear"){
        optionsFilter[Pos].classList.add("headeroptionFocused");
    }
}
function setgendersFocused(Pos){
    var options = document.getElementsByClassName("gender");
    
    for(var i=0; i<options.length; i++){
        for(var j=0; j<options[i].classList.length; j++){
            if(options[i].classList[j]=="genderFocused"){
                options[i].classList.remove("genderFocused");
                break;
            }
        }
    }
    if(Pos != "clear"){
        options[Pos].classList.add("genderFocused");
    }
}
function setsuggestedMovieFocused(option){
    if(option=="clear"){
        suggestedMoviePlay.classList.remove("suggestedMoviePlayFocused");
    }else{
        suggestedMoviePlay.classList.add("suggestedMoviePlayFocused");
    }
}

function setChapters(pos) {
    chaptersDiv.innerHTML = "";
    var limit;
    if(currentChapters.length-pos+1>6){
        limit = pos+5;
    }else{
        limit = currentChapters.length;
    }
    if(pos>6){
        chapLeft.style.display = "block";
    }else{
        chapLeft.style.display = "none";
    }
    if(limit<currentChapters.length){
        chapRight.style.display = "block";
    }else{
        chapRight.style.display = "none";
    }
    var firstChild = true;
    for(var i=pos;i<=limit;i++){
        var divChapter = document.createElement('div');
        divChapter.id = "Chapter"+i;
        if(firstChild){
            divChapter.classList.add("ChapterSelected");
            firstChild = false;
        }
        divChapter.innerHTML = "Chapter "+i;
        chaptersDiv.appendChild(divChapter);
    }
    chapterFocused = pos;
}
function loadChapters(){
    chapterFocused = 1;
    if(typeof(gSTB) !== 'undefined'){
        gSTB.clearMemoryCaches();
    }
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/VideoOnDemand.php',
        data: {
            Option: 'LoadChapters',
            id_serie: currentSerie['id_serie'],
            temporada: seasonFocused
        },
        success: function (response) {
            currentChapters = $.parseJSON(response);
            setChapters(chapterFocused);
        }
    });
}
function setSeasonFocus(Direction){
    if(Direction == "UP"){
        var idfirstChild = temporadas.childNodes[0].id;
        if(seasonFocused > 1 && idfirstChild != "Season"+seasonFocused){
            document.getElementById("Season"+seasonFocused).classList.remove("SeasonSelected");
            seasonFocused--;
            document.getElementById("Season"+seasonFocused).classList.add("SeasonSelected");
            loadChapters();
            document.getElementById("titleSeasNum").innerText = "Season "+seasonFocused;
        }else if(seasonFocused > 1){
                seasonFocused = seasonFocused-4;
                loadSeasons(seasonFocused);
                loadChapters();
                document.getElementById("titleSeasNum").innerText = "Season "+seasonFocused;

        }
    }else if(Direction == "DOWN"){
        if(seasonFocused < currentSerie["TMPR"] && seasonFocused%4!=0){
            document.getElementById("Season"+seasonFocused).classList.remove("SeasonSelected");
            seasonFocused++;
            document.getElementById("Season"+seasonFocused).classList.add("SeasonSelected");
            loadChapters();
            document.getElementById("titleSeasNum").innerText = "Season "+seasonFocused;

        }else if(seasonFocused< currentSerie['TMPR']){
                seasonFocused++;
                loadSeasons(seasonFocused);
                loadChapters();
                documents.getElementById("titleSeasNum").innerText = "Season "+seasonFocused;
        }
    }else if(Direction == "RIGHT"){
        if(chapterFocused < currentChapters.length && chapterFocused%6!=0){
            document.getElementById("Chapter"+chapterFocused).classList.remove("ChapterSelected");
            chapterFocused++;
            document.getElementById("Chapter"+chapterFocused).classList.add("ChapterSelected");
        }else if(chapterFocused< currentChapters.length){
            chapterFocused++;
            setChapters(chapterFocused);
        }
    }else if(Direction == "LEFT"){
        var idfirstChild = chaptersDiv.childNodes[0].id;
        if(chapterFocused > 1 && idfirstChild != "Chapter"+chapterFocused){
            document.getElementById("Chapter"+chapterFocused).classList.remove("ChapterSelected");
            chapterFocused--;
            document.getElementById("Chapter"+chapterFocused).classList.add("ChapterSelected");
        }else if(chapterFocused > 1){
                chapterFocused = chapterFocused-6;
                setChapters(chapterFocused);
        }
    }else if(Direction == "OK"){
        lastPanelFocused = currentPanelFocused;
        currentPanelFocused = "playingContent";
        selectedContent.style.display = "none";
        titlePlaying.innerText = "Chapter "+currentChapters[chapterFocused-1]['NMBR']+": "+ currentChapters[chapterFocused-1]['TTLE'];
        ratingPlaying.innerHTML = currentChapters[chapterFocused-1]['SCOR'] + " <span class=\"fa fa-star\"></span>";
        visiblePlayingPanel = true;
        playingMovie = true;
        currentContentType = "Serie";
        PlayingPanel.style.display = "block";
        actualSources = "http://10.0.3.241/vod/srs/"+currentSerie['FLDR']+"T"+seasonFocused+"/"+chapterFocused;
        showPlayingPanel();
        PlayMovie(actualSources + ".mp4", 0);
    }
}
function showPlayingPanel(){
    showingPlayingPanel = true;
    buttonsPlayingPanelDiv.style.display = "block";
    timeProgress.style.display = "block";
    custom_seekbar.style.display = "block";
    infoPlaying.style.display = "block";
    if(hidenPlayingPanel !== null){
        clearTimeout(hidenPlayingPanel);
        hidenPlayingPanel = null;
    }
    hidenPlayingPanel = setTimeout(function(){
        hidePlayingPanel();
    }, 10000);
}
function hidePlayingPanel(){
    showingPlayingPanel = false;
    buttonsPlayingPanelDiv.style.display = "none";
    timeProgress.style.display = "none";
    custom_seekbar.style.display = "none";
    infoPlaying.style.display = "none";
}
function loadSeasons(pos){
    temporadas.innerHTML = "";
    document.getElementById("titleSeasNum").innerText = "Season 1";
    
    var limit;
    if(currentSerie['TMPR']-pos+1>4){
        limit = pos+3;
    }else{
        limit = currentSerie['TMPR'];
    }
    if(pos>4){
        document.getElementById("seasUp").style.display = "block";
    }else{
        document.getElementById("seasUp").style.display = "none";
    }
    if(limit<currentSerie['TMPR']){
        seasDown.style.display = "block";
    }else{
        seasDown.style.display = "none";
    }
    var firstChild = true;
    for(var i=pos;i<=limit;i++){
        var imgSeason = document.createElement('img');
        imgSeason.id = "Season"+i;
        
        if(firstChild){
            imgSeason.classList.add("SeasonSelected")
            firstChild = false;
        }
        imgSeason.src = "../../../vod/srs/"+currentSerie['FLDR']+"T"+i+"/folder.png";
        temporadas.appendChild(imgSeason);
    }
    seasonFocused = pos;
    chapterFocused = 1;
    loadChapters();
}
function selectMovie(){
    if(List[moviePosition]['TYPE']=="Serie"){
        currentPanelFocused = "contentSelected";
        contentPanel.style.display = "none";
        selectedContent.style.display = "block";
        previewContent.style.backgroundImage = "url('../../../vod/srs/"+List[moviePosition]['FLDR']+"/preview.png')";
        titleSelected.innerText= List[moviePosition]['TTLE'];
        imgposterSelected.src = "../../../vod/srs/"+List[moviePosition]['FLDR']+List[moviePosition]['PSTR'];
        infoDescriptionSelected.innerText = List[moviePosition]['DSCR'];
        infoYearSelected.innerHTML = List[moviePosition]['YEAR'];
        infoClasificacionSelected.innerHTML = List[moviePosition]['RTNG'];
        infoDurationSelected.innerHTML = List[moviePosition]['SCOR'];
        currentSerie = List[moviePosition];
        loadSeasons(1);
    }else{
        currentPanelFocused = "playingContent";
        contentPanel.style.display = "none";
        PlayingPanel.style.display = "block";
        titlePlaying.innerText = List[moviePosition]['TTLE'];
        ratingPlaying.innerHTML =  List[moviePosition]['SCOR'] + " <span class=\"fa fa-star\"></span>";
        visiblePlayingPanel = true;
        playingMovie = true;
        currentContentType = "Movie";
        actualSources = "http://10.0.3.241/vod/mvs/"+List[moviePosition]['FLDR']+List[moviePosition]['FILE'];
        showPlayingPanel();
        PlayMovie(actualSources + ".mp4", 0);
    }
}
function closeContentselected(){
    if(List[moviePosition]['TYPE']=="Serie"){
        if(currentPanelFocused=="playingContent"){
            currentPanelFocused = lastPanelFocused;
            selectedContent.style.display = "block";
            PlayingPanel.style.display = "none";
            document.getElementsByClassName("buttonFocused")[0].classList.remove("buttonFocused");
            buttonPlayPause.classList.add("buttonFocused");
            buttonSubtitles.src = "Media/Movies/subtitles.png";
            setChapters(1);
            $("#custom-seekbar span").css("width", "0%");
            document.getElementById("timeProgress").innerText =+"00:00:00 / 00:00:00";
            currentButtonPosition = 1;
            currentButtonName = "buttonPlayPause";
            visiblePlayingPanel = false;
            statusVideo = "play";
            activatedSubtitles = false;
            StopVideo();
            currentContentType = "none";
            playingMovie = false;
        }else{
            currentPanelFocused = "movies";
            previewContent.style.backgroundImage = "";
            titleSelected.innerText= "";
            imgposterSelected.src = "";
            temporadas.innerHTML = "";
            contentPanel.style.display = "block";
            selectedContent.style.display = "none";
            infoDescriptionSelected.innerHTML = "";
            infoYearSelected.innerHTML = "";
            infoClasificacionSelected.innerHTML = "";
            infoDurationSelected.innerHTML = "";
            seasonFocused = 0;
            chapterFocused = 0;
        }
    }else{
        currentPanelFocused = lastPanelFocused;
        contentPanel.style.display = "block";
        PlayingPanel.style.display = "none";
        document.getElementsByClassName("buttonFocused")[0].classList.remove("buttonFocused");
        buttonPlayPause.classList.add("buttonFocused");
        buttonSubtitles.src = "Media/Movies/subtitles.png";
        $("#custom-seekbar span").css("width", "0%");
        document.getElementById("timeProgress").innerText =+"00:00:00 / 00:00:00";
        currentButtonPosition = 1;
        currentButtonName = "buttonPlayPause";
        visiblePlayingPanel = false;
        statusVideo = "play";
        activatedSubtitles = false;
        StopVideo();
        currentContentType = "none";
        playingMovie = false;
    }
}
function filterContentByType(Type){
    if(Type == "Home"){
        getGeneralContent();
    }else if(Type == "Movies"){
        getMoviesContent();
    }else if(Type == "Series"){
        getSeriesContent();
    }
}

function setFocusButtonPlaying(Direction){
    if(Direction == "Right" && currentButtonName != "buttonClose"){
        document.getElementById(currentButtonName).classList.remove("buttonFocused");
        Debug("=====> " + Direction);

        currentButtonPosition++;
        if(currentButtonPosition > buttonsPlayingPanel.length-1){
            currentButtonPosition = 0;
        }
        currentButtonName = buttonsPlayingPanel[currentButtonPosition];
        document.getElementById(currentButtonName).classList.add("buttonFocused");
    }else if(Direction == "Left" && currentButtonName != "buttonClose"){
        document.getElementById(currentButtonName).classList.remove("buttonFocused");
        Debug("=====> " + Direction);
        currentButtonPosition--;
        if(currentButtonPosition < 0){
            currentButtonPosition = buttonsPlayingPanel.length-1;
        }
        currentButtonName = buttonsPlayingPanel[currentButtonPosition];
        document.getElementById(currentButtonName).classList.add("buttonFocused");
    }
    else if(Direction == "Down"){
        if(currentButtonName == "buttonClose"){
            document.getElementById(currentButtonName).classList.remove("buttonFocused");
            currentButtonPosition = 1;
            currentButtonName = buttonsPlayingPanel[currentButtonPosition];
            document.getElementById(currentButtonName).classList.add("buttonFocused");
        }
    }else if(Direction == "Up"){
        if(currentButtonName != "buttonClose"){
            document.getElementById(currentButtonName).classList.remove("buttonFocused");
            currentButtonPosition = 1;
            currentButtonName = "buttonClose";
            document.getElementById(currentButtonName).classList.add("buttonFocused");
        }
    }
}

function openSubtitles(){
    if(activatedSubtitles){
        buttonSubtitles.src = "Media/Movies/subtitles.png";
        activatedSubtitles = false;
        setSubtitles(activatedSubtitles);
    }else{
        buttonSubtitles.src = "Media/Movies/subtitlesActive.png";
        activatedSubtitles = true;
        setSubtitles(activatedSubtitles);
    }
}

function selectButton(){
    if(currentButtonName == "buttonPlayPause"){
        if(statusVideo == "play"){
            PauseVideo();
            statusVideo = "pause";
        }else{
            statusVideo = "play";
            ResumeVideo();
        }
    }else if(currentButtonName == "buttonBackward"){
        speedMovie("backward");
    }else if(currentButtonName == "buttonForward"){
        speedMovie("forward");
    }else if(currentButtonName == "buttonSubtitles"){
        //isOpenSubtitles = true;
        openSubtitles();
    }else if(currentButtonName == "buttonClose"){
        //closeContentselected();
        VodClose();
    }
}

function selectSuggestedMovie(){
    if(currentSuggestedMovie['TYPE']=="Serie"){
        currentPanelFocused = "contentSelected";
        isASuggest = true;
        contentPanel.style.display = "none";
        selectedContent.style.display = "block";
        previewContent.style.backgroundImage = "url('../../../vod/srs/"+currentSuggestedMovie['FLDR']+"/preview.png')";
        titleSelected.innerText= currentSuggestedMovie['TTLE']
        imgposterSelected.src = "../../../vod/srs/"+currentSuggestedMovie['FLDR']+currentSuggestedMovie['PSTR'];
        
        infoDescriptionSelected.innerText = currentSuggestedMovie['DSCR'];
        infoYearSelected.innerHTML = List[moviePosition]['YEAR'];
        infoClasificacionSelected.innerHTML = List[moviePosition]['RTNG'];
        infoDurationSelected.innerHTML = List[moviePosition]['SCOR'];
        
        currentSerie = currentSuggestedMovie;
        loadSeasons(1);
    }else{
        currentPanelFocused = "playingContent";
        contentPanel.style.display = "none";
        PlayingPanel.style.display = "block";
        titlePlaying.innerText = currentSuggestedMovie['TTLE'];
        ratingPlaying.innerHTML = currentSuggestedMovie['SCOR'] + " <span class=\"fa fa-star\"></span>";
        visiblePlayingPanel = true;
        playingMovie = true;
        currentContentType = "Movie";
        actualSources = "http://10.0.3.241/vod/mvs/"+currentSuggestedMovie['FLDR']+currentSuggestedMovie['FILE'];
        showPlayingPanel();
        PlayMovie(actualSources + ".mp4", 0);
    }
}
function closeSuggestedMovie(){

    if(currentSuggestedMovie['TYPE']=="Serie"){
        if(currentPanelFocused=="playingContent"){
            currentPanelFocused = lastPanelFocused;
            selectedContent.style.display = "block";
            PlayingPanel.style.display = "none";
            document.getElementsByClassName("buttonFocused")[0].classList.remove("buttonFocused");
            buttonPlayPause.classList.add("buttonFocused");
            buttonSubtitles.src = "Media/Movies/subtitles.png";
            setChapters(1);
            currentButtonPosition = 1;
            currentButtonName = "buttonPlayPause";
            visiblePlayingPanel = false;
            statusVideo = "play";
            $("#custom-seekbar span").css("width", "0%");
            document.getElementById("timeProgress").innerText =+"00:00:00 / 00:00:00";
            activatedSubtitles = false;
            StopVideo();
            currentContentType = "none";
            playingMovie = false;
        }else{
            isASuggest = false;
            currentPanelFocused = "suggestedMovie";
            previewContent.style.backgroundImage = "";
            titleSelected.innerText= "";
            imgposterSelected.src = "";
            temporadas.innerHTML = "";
            infoDescriptionSelected.innerHTML = "";
            infoYearSelected.innerHTML = "";
            infoClasificacionSelected.innerHTML = "";
            infoDurationSelected.innerHTML = "";
            contentPanel.style.display = "block";
            selectedContent.style.display = "none";
            
            $("#custom-seekbar span").css("width", "0%");
            document.getElementById("timeProgress").innerText =+"00:00:00 / 00:00:00";
            seasonFocused = 0;
            chapterFocused = 0;
        }
    }else{
        currentPanelFocused = suggestedMovie;
        contentPanel.style.display = "block";
        PlayingPanel.style.display = "none";
        document.getElementsByClassName("buttonFocused")[0].classList.remove("buttonFocused");
        buttonPlayPause.classList.add("buttonFocused");
        buttonSubtitles.src = "Media/Movies/subtitles.png";
        $("#custom-seekbar span").css("width", "0%");
        document.getElementById("timeProgress").innerText =+"00:00:00 / 00:00:00";
        currentButtonPosition = 1;
        currentButtonName = "buttonPlayPause";
        visiblePlayingPanel = false;
        statusVideo = "play";
        activatedSubtitles = false;
        StopVideo();
        currentContentType = "none";
        playingMovie = false;
    }
}

function selectHeader(){
    var options = document.getElementById("headeroptions").childNodes
    var optionsFilter = [];
    for(var i=0; i<options.length-2; i++){
        i++;
        optionsFilter.push(options[i]);    
    }
    for(var i=0; i<optionsFilter.length; i++){
        for(var j=0; j<optionsFilter[i].classList.length; j++){
            if(optionsFilter[i].classList[j]=="headeroptionSelected"){
                optionsFilter[i].classList.remove("headeroptionSelected");
            }
        }
    }
    optionsFilter[headerPosition].classList.add("headeroptionSelected");
    currentType = headersOptions[headerPosition];
    filterContentByType(headersOptions[headerPosition]);
    selectGender("clear")
}

function endMovie(){
    if(currentContentType == "Movie"){
        VodClose();
    }else{
        if(chapterFocused < currentChapters.length){
            chapterFocused++;
            titlePlaying.innerText = "Chapter "+currentChapters[chapterFocused-1]['NMBR']+": "+ currentChapters[chapterFocused-1]['TTLE'];
            ratingPlaying.innerHTML = currentChapters[chapterFocused-1]['SCOR'] + " <span class=\"fa fa-star\"></span>";
            StopVideo();
            actualSources = "http://10.0.3.241/vod/srs/"+currentSerie['FLDR']+"T"+seasonFocused+"/"+chapterFocused;
            showPlayingPanel();
            if(activatedSubtitles){
                PlayMovie(actualSources + "_sub.mp4", 0);
            }else{
                PlayMovie(actualSources + ".mp4", 0);
            }
        }else if(seasonFocused < currentSerie['TMPR']){
            setChapters(1);
            VodClose();
        }
    }
}
function selectGender(Option){
    if(Option == "select"){
        var options = document.getElementsByClassName("gender")
        var id;
        for(var i=0; i<options.length; i++){
            for(var j=0; j<options[i].classList.length; j++){
                if(options[i].classList[j]=="genderSelected"){
                    options[i].classList.remove("genderSelected");
                    break;
                }
            }
        }
        for(var i=0; i<options.length; i++){
            for(var j=0; j<options[i].classList.length; j++){
                if(options[i].classList[j]=="genderFocused"){
                    options[i].classList.add("genderSelected");
                    id = options[i].id;
                    break;
                }
            }
        }
        if(0 == parseInt(id)){
            if(currentType == "Home"){
                getGeneralContent();
            }else if(currentType == "Movies"){
                getMoviesContent();
            }else if(currentType == "Series"){
                getSeriesContent();
            }
        }else{
            if(currentType == "Home"){
                getGeneralGender(parseInt(id));
            }else if(currentType == "Movies"){
                getMoviesGender(parseInt(id));
            }else if(currentType == "Series"){
                getSeriesGender(parseInt(id));
            }
        }
    }else{
        var options = document.getElementsByClassName("gender")
        var id;
        for(var i=0; i<options.length; i++){
            for(var j=0; j<options[i].classList.length; j++){
                if(options[i].classList[j]=="genderSelected"){
                    options[i].classList.remove("genderSelected");
                    break;
                }
            }
        }
        options[0].classList.add("genderSelected");
        id = options[0].id;
        if(0 == parseInt(id)){
            if(currentType == "Home"){
                getGeneralContent();
            }else if(currentType == "Movies"){
                getMoviesContent();
            }else if(currentType == "Series"){
                getSeriesContent();
            }
        }else{
            if(currentType == "Home"){
                getGeneralGender(parseInt(id));
            }else if(currentType == "Movies"){
                getMoviesGender(parseInt(id));
            }else if(currentType == "Series"){
                getSeriesGender(parseInt(id));
            }
        }
    }
}
function VodRight(){
    if(currentPanelFocused == "header"){
        headerPosition++;
        if(headerPosition>numberOfHeaders-1){
            headerPosition=0;
        }
        setHeaderFocused(headerPosition);
    }else if(currentPanelFocused == "genders"){
        gendersPosition++;
        if(gendersPosition>numberOfGenders-1){
            gendersPosition=0;
        }
        setgendersFocused(gendersPosition);
    }else if(currentPanelFocused == "movies"){
        moviePosition++;
        if(moviePosition>List.length - 1)
            moviePosition=0;
        setMovieList(List,moviePosition);
    }else if(currentPanelFocused == "contentSelected"){
        setSeasonFocus("RIGHT");
    }else if(currentPanelFocused == "playingContent" && visiblePlayingPanel == true){
        if(showingPlayingPanel == true){
            if(hidenPlayingPanel !== null){
                clearTimeout(hidenPlayingPanel);
                hidenPlayingPanel = null;
            }
            hidenPlayingPanel = setTimeout(function(){
                hidePlayingPanel();
            }, 5000);
            setFocusButtonPlaying("Right");
        }else{
            showPlayingPanel();
        }
    }
}

function VodLeft(){
    if(currentPanelFocused == "header"){
        headerPosition--;
        if(headerPosition<0){
            headerPosition=numberOfHeaders-1;
        }
        setHeaderFocused(headerPosition);
    }else if(currentPanelFocused == "genders"){
        gendersPosition--;
        if(gendersPosition<0){
            gendersPosition=numberOfGenders-1;
        }
        setgendersFocused(gendersPosition);
    }else if(currentPanelFocused == "movies"){
        moviePosition--;
        if(moviePosition<0)
            moviePosition=0;
        setMovieList(List,moviePosition);
    }else if(currentPanelFocused == "contentSelected"){
        setSeasonFocus("LEFT");
    }else if(currentPanelFocused == "playingContent" && visiblePlayingPanel == true){
        if(showingPlayingPanel == true){
            if(hidenPlayingPanel !== null){
                clearTimeout(hidenPlayingPanel);
                hidenPlayingPanel = null;
            }
            hidenPlayingPanel = setTimeout(function(){
                hidePlayingPanel();
            }, 5000);
            setFocusButtonPlaying("Left");
        }else{
            showPlayingPanel();
        }
    }
    
}
function VodDown(){
    if(currentPanelFocused == "header"){
        currentPanelFocused = "suggestedMovie";
        headerPosition=0;
        setHeaderFocused("clear");
        setsuggestedMovieFocused("set");
    }else if(currentPanelFocused == "suggestedMovie"){
        currentPanelFocused = "genders";
        setsuggestedMovieFocused("clear");
        gendersPosition=0;
        setgendersFocused(gendersPosition);
    }else if(currentPanelFocused == "genders"){
        currentPanelFocused = "movies";
        gendersPosition=0;
        setgendersFocused("clear");
        moviePosition=0;
        setMovieList(List,moviePosition);
    }else if(currentPanelFocused == "contentSelected"){
        setSeasonFocus("DOWN");
    }else if(currentPanelFocused == "playingContent" && visiblePlayingPanel == true){
        if(showingPlayingPanel == true){
            if(hidenPlayingPanel !== null){
                clearTimeout(hidenPlayingPanel);
                hidenPlayingPanel = null;
            }
            hidenPlayingPanel = setTimeout(function(){
                hidePlayingPanel();
            }, 5000);
            setFocusButtonPlaying("Down");
        }else{
            showPlayingPanel();
        }
    }
}
function VodUp(){
    if(currentPanelFocused == "suggestedMovie"){
        currentPanelFocused = "header";
        headerPosition=0;
        setHeaderFocused(headerPosition);
        setsuggestedMovieFocused("clear");
    }else if(currentPanelFocused == "genders"){
        gendersPosition=0;
        setgendersFocused("clear");
        currentPanelFocused = "suggestedMovie";
        setsuggestedMovieFocused("set");
    }else if(currentPanelFocused == "movies"){
        currentPanelFocused = "genders";
        gendersPosition=0;
        setgendersFocused(gendersPosition);
        moviePosition=0;
        setMovieList(List,moviePosition);
    }else if(currentPanelFocused == "contentSelected"){
        setSeasonFocus("UP");
    }else if(currentPanelFocused == "playingContent" && visiblePlayingPanel == true){
        if(showingPlayingPanel == true){ 
            if(hidenPlayingPanel !== null){
                clearTimeout(hidenPlayingPanel);
                hidenPlayingPanel = null;
            }
            hidenPlayingPanel = setTimeout(function(){
                hidePlayingPanel();
            }, 5000);
            setFocusButtonPlaying("Up");
        }else{
            showPlayingPanel();
        }
    }
}

function VodOk() {
    if(currentPanelFocused == "header"){
        selectHeader();
    }else if(currentPanelFocused == "suggestedMovie"){
        lastPanelFocused = currentPanelFocused;
        selectSuggestedMovie();
    }else if(currentPanelFocused == "genders"){
        selectGender("select");
    }else if(currentPanelFocused == "movies"){
        lastPanelFocused = currentPanelFocused;
        if(changeBanner!=null){
            clearTimeout(changeBanner);
            changeBanner = null;
        }
        selectMovie();
    }else if(currentPanelFocused == "contentSelected"){
        setSeasonFocus("OK");
    }else if(currentPanelFocused == "playingContent"){
        if(showingPlayingPanel == true){
            if(hidenPlayingPanel !== null){
                clearTimeout(hidenPlayingPanel);
                hidenPlayingPanel = null;
            }
            hidenPlayingPanel = setTimeout(function(){
                hidePlayingPanel();
            }, 5000);
            selectButton();
        }else{
            showPlayingPanel();
        }
        
    }
}
function VodClose(){
    if(currentPanelFocused == "contentSelected" || currentPanelFocused == "playingContent"){
        SetSuggestedMovie(List,0);
        if(!isASuggest){
            closeContentselected();
        }else{
            closeSuggestedMovie();
        }
    }
}