<?php
/* Creado por: Tania Maldonado
 * Fecha: Julio 2020
 * Tipo: DAO
 */

class Movies extends Database {
    private $MoviesList;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Movies';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }
}