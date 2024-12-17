<?php
    class Record
    {
        private $server;
        private $user;
        private $pass;
        private $dbname;
        private $conn;

        private $nombre;
        private $apellidos;
        private $nivel;
        private $tiempo;

        public function __construct()
        {
            $this->server = "localhost";
            $this->user = "DBUSER2024";
            $this->pass = "DBPSWD2024";
            $this->dbname = "records";
        }

        public function connect()
        {
            $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        }

        public function disconnect()
        {
            if ($this->conn) 
            {
                $this->conn->close();
            }
        }

        public function addRecord()
        {
            $this->connect();

            $stmt1 = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
            $stmt1->bind_param("ssdd", $this->nombre, $this->apellidos, $this->nivel, $this->tiempo);
            $stmt1->execute();
            
            $stmt1->close();
            $this->disconnect();
        }

        public function displayRecords()
        {
            $this->connect();

            $stmt1 = $this->conn->prepare("SELECT DISTINCT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
            $stmt1->bind_param("d", $this->nivel);
            $stmt1->execute();
            $result = $stmt1->get_result();

            if($result->fetch_assoc()!=NULL) 
            {
                echo "<h3>Top récords para el nivel $this->nivel:</h3>";
                echo "<ol>";
                $result->data_seek(0);

                while($fila = $result->fetch_assoc()) 
                {
                    echo "<li>" . $fila['nombre'] . " " . $fila['apellidos'] . " - " . $fila['tiempo'] . "s</li>";
                } 
                echo "</ol>";
            }
        
            $stmt1->close();
            $this->disconnect();
        }

        public function execute()
        {
            $this->nombre = $_POST["nombre"];
            $this->apellidos = $_POST["apellidos"];
            $this->nivel = $_POST["nivel"];
            $this->tiempo = $_POST["tiempo"];

            $this->addRecord();
            $this->displayRecords();
        }
    }
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop: Juego del semáforo</title>
    <meta name ="author" content ="Lara Haya Santiago" />
    <meta name ="description" content ="Juego del semáforo" />
    <meta name ="keywords" content ="Juego, Semáforo, Tiempo de reacción"/>
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo_grid.css" />
    <link rel="icon" href="multimedia/imagenes/Juegos.ico" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" 
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
            crossorigin="anonymous"></script>
    <script src="js/semaforo.js"></script>
</head>

<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>

        <nav>
            <a title="Inicio" href="index.html">Inicio</a>
            <a title="Piloto" href="piloto.html">Piloto</a>
            <a title="Noticias" href="noticias.html">Noticias</a>
            <a title="Calendario" href="calendario.html">Calendario</a>
            <a title="Meteorología" href="meteorología.html">Meteorología</a>
            <a title="Circuito" href="circuito.html">Circuito</a>
            <a title="Viajes" href="viajes.php">Viajes</a>
            <a title="Juegos" href="juegos.html" class="active">Juegos</a>
        </nav>
    </header>

    <p>Estás en: Inicio > Juegos > Juego del semáforo</p>

    <menu>
        <li><a title="Memoria" href="memoria.html">Memoria</a></li>
        <li><a title="Api" href="api.html">Api</a></li>
    </menu>
    
    <script>
        var game = new Semaforo();
    </script>

    <section>
        <?php 
            if (count($_POST)>0) 
            {
                $record = new Record();
                $record->execute();
            }
        ?>
    </section>
</body>
</html>