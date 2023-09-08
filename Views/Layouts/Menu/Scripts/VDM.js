// @ts-nocheck

var MenuListNodes   = document.getElementsByClassName('MenuList'),
    MenuDate        = document.getElementById('MenuDate'),
    MenuHour        = document.getElementById('MenuHour'),
    WeatherFarenheit        = document.getElementById('WeatherFarenheit'),
    WeatherCelsius        = document.getElementById('WeatherCelsius'),
    ImagesUrl       = ServerSource+'Media/Menu/',
    FormatDate      = '',
    FormatHour      = '',
    MenuList        = ''
    MenuIndex       = 0,
    IndexM = null,
    xhr = null;

function SetMenuList(){
    
    MenuList = null;
    $.ajax({
        type: 'POST',
        cache: false,
        async: false,
        url: ServerSource + 'Core/Controllers/Menu.php',
        data: { 
            Option : 'GetModules',
            ProjectId: '1'
        },
        success: function (response){
            
            MenuList = $.parseJSON(response);
            
            
        }
    });
    SetMenuInfo();
}
    GetWeather();
    SetMenuList();

function SetMenuInfo(){
    MenuListNodes[0].textContent = MenuList[0].Name;
    MenuListNodes[1].textContent = MenuList[1].Name;
}
/*******************************************************************************
* MOVIMIENTOS FLECHAS EPG
*******************************************************************************/

function MenuOk(){ 
    if(MenuList[MenuIndex].Url !== 'menu.php'){
        //Page, ModuleId, ChangeModule
        GoPage(MenuList[MenuIndex].Url, MenuList[MenuIndex].Id, MenuList[MenuIndex].Name);
    }
}

function MenuRight(){
    //MenuSelect('RIGHT');
    if(MenuList.length >2){
        if(MenuListNodes[0].classList.length > 1){
            MenuListNodes[0].classList.remove('focus');
            MenuListNodes[1].classList.add('focus');
        }else if(MenuListNodes[1].classList.length > 1){
            MenuListNodes[1].classList.remove('focus');
            MenuListNodes[0].classList.add('focus');
        }
    }else{
        MenuListNodes[0].classList.remove('focus');
        MenuListNodes[1].classList.add('focus');
    }
    MenuIndex++;
    if(MenuIndex > MenuList.length - 1){
        MenuIndex = MenuList.length - 1;
    }
    SetMenuInfo();
}

function MenuLeft(){
    //MenuSelect('LEFT');
    if(MenuList.length >2){
        if(MenuListNodes[0].classList.length > 1){
            MenuListNodes[0].classList.remove('focus');
            MenuListNodes[1].classList.add('focus');
        }else if(MenuListNodes[1].classList.length > 1){
            MenuListNodes[1].classList.remove('focus');
            MenuListNodes[0].classList.add('focus');
        }  
    }else{
        MenuListNodes[1].classList.remove('focus');
        MenuListNodes[0].classList.add('focus');
    }

    MenuIndex--;
    if(MenuIndex < 0){
        MenuIndex = 0;
    }
    SetMenuInfo();
    
}

function MenuDown(){
    //MenuSelect('RIGHT');
    if(MenuList.length >2){
        if(MenuListNodes[0].classList.length > 1){
            MenuListNodes[0].classList.remove('focus');
            MenuListNodes[1].classList.add('focus');
        }else if(MenuListNodes[1].classList.length > 1){
            MenuListNodes[1].classList.remove('focus');
            MenuListNodes[0].classList.add('focus');
        }
    }else{
        MenuListNodes[0].classList.remove('focus');
        MenuListNodes[1].classList.add('focus');
        
        MenuIndex++;
    
        if(MenuIndex > MenuList.length - 1){
            MenuIndex = MenuList.length - 1;
        }   
        SetMenuInfo();
    }
}

function MenuUp(){
    //MenuSelect('LEFT');
    if(MenuList.length >2){
        if(MenuListNodes[0].classList.length > 1){
            MenuListNodes[0].classList.remove('focus');
            MenuListNodes[1].classList.add('focus');
        }else if(MenuListNodes[1].classList.length > 1){
            MenuListNodes[1].classList.remove('focus');
            MenuListNodes[0].classList.add('focus');
        } 
    }else{
        MenuListNodes[1].classList.remove('focus');
        MenuListNodes[0].classList.add('focus');
    }

    MenuIndex--;
    if(MenuIndex < 0){
        MenuIndex = 0;
    }
    SetMenuInfo();
}