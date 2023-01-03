<?php


class Interactivo extends Database {

    public function __construct($macDevice)
    {
        $this->ClassFile = 'Interactivo';
        $this->Mac = $macDevice;
        $this->Function = '';
    }


    function getUsers($LocationId) {
        $this->Function = 'getUsers';
        
        $this->connect();
        $this->select("users_location", "*", 
                      "", "", "", "", 
                      "id_location = '".$LocationId."'");
        $this->Users = $this->getResult();
        
        $this->disconnect();

        return $this->Users;
    }
    function newUser($LocationId, $newUser) {
        $this->Function = 'newUser';
        
        $this->connect();
        $this->insert("users_location",array('name'=> $newUser,'id_location'=> $LocationId));
        $this->Users = $this->getResult();
        $this->disconnect();

        return $this->Users;
    }
}