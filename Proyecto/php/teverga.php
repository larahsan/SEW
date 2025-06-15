<?php
    class Teverga {

        // Para conectarse a la base de datos
        protected $server = "localhost";
        protected $user = "DBUSER2025";
        protected $pass_local = "DBPWD2025"; // Despliegue con XAMPP
        protected $pass = "dbPWD2025$"; // Despliegue con Azure
        protected $dbname = "teverga";
        protected $conn;

        public function connect()
        {
            $this->conn = new mysqli($this->server, $this->user, $this->pass_local, $this->dbname);
        }

        public function disconnect()
        {
            if ($this->conn) 
                $this->conn->close();
        }
    }
?>
