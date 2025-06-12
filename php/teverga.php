<?php
    class Teverga {

        // Para conectarse a la base de datos
        protected $server = "localhost";
        protected $user = "DBUSER2025";
        protected $pass = "DBPWD2025";
        protected $dbname = "teverga";
        protected $conn;

        public function connect()
        {
            $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        }

        public function disconnect()
        {
            if ($this->conn) 
                $this->conn->close();
        }
    }
?>
