<?php
    include('cronometro.php');

    class Test
    {
        private $server = "localhost";
        private $user = "DBUSER2025";
        private $pass_local = "DBPSWD2025";
        private $dbname = "UO289684_DB";
        private $conn;
        private $cronometro;

        public function __construct() 
        {
            $this->cronometro = new Cronometro();
        }

        private function connect()
        {
            $this->conn = new mysqli($this->server, $this->user, $this->pass_local, $this->dbname);
        }

        private function disconnect()
        {
            if ($this->conn) 
                $this->conn->close();
        }

        public function mostrarFormularioInicio() {
            echo "<form action='#' method='post' name='test'>
                      <input type='submit' name='iniciar' value='Iniciar prueba'/>
                  </form>";
        }

        public function iniciarPrueba()
        {
            $this->cronometro->arrancar();
            $this->mostrarPreguntas();
        }

        public function mostrarPreguntas()
        {
            echo "<form action='#' method='post'>";
            echo "<h3>Responda a las siguientes preguntas sobre el proyecto:</h3>";
            echo "<p>1. ¿En qué circuito se basa el proyecto?
                    <input type='text' name='p1'/>
                  </p>";
            echo "<p>2. ¿Sobre qué piloto se habla específicamente en el proyecto?
                    <input type='text' name='p2'/>
                  </p>";
            echo "<p>3. ¿En qué país se encuentra el circuito en el que se basa el proyecto?
                    <input type='text' name='p3'/>
                  </p>";
            echo "<p>4. ¿Quién fue el ganador de la carrera?
                    <input type='text' name='p4'/>
                  </p>";
            echo "<p>5. ¿Quién fue el tercer clasificado en la carrera?
                    <input type='text' name='p5'/>
                  </p>";
            echo "<p>6. ¿Dónde nació el piloto del que se habla en el proyecto?
                    <input type='text' name='p6'/>
                  </p>";
            echo "<p>7. ¿Qué significa el concepto 'pole' en el contexto de MotoGP?
                    <input type='text' name='p7'/>
                  </p>";
            echo "<p>8. ¿En qué posición de la carrera quedó el piloto del que se habla en el proyecto?
                    <input type='text' name='p8'/>
                  </p>";
            echo "<p>9. ¿En qué mes tuvieron lugar los entrenamientos previos a la carrera?
                    <input type='text' name='p9'/>
                  </p>";
            echo "<p>10. ¿Quién fue el segundo clasificado en la carrera?
                    <input type='text' name='p10'/>
                  </p>";
            echo "<input type='submit' name='terminar' value='Terminar prueba'/></form>";
        }

        public function terminarPrueba() 
        {
            $this->cronometro->parar();

            // Guardar las respuestas
            for ($i = 1; $i <= 10; $i++) {
                $campo = 'p' . $i;
                $_SESSION[$campo] = $_POST[$campo] ?? '';
            }

            $this->mostrarFormularioUsuario();
        }

        public function mostrarFormularioUsuario() 
        {
            echo "<form action='#' method='post'>";
            echo "<h3>Complete los siguientes datos:</h3>";
            echo "<p>Código de identificación de usuario (1-12): <input type='number' name='codigo_identificacion' min='1' max='12' required></p>";
            echo "<p>Profesión: <input type='text' name='profesion' required></p>";
            echo "<p>Edad: <input type='number' name='edad' min='0' required></p>";
            echo "<p>Género: 
                    <select name='genero'>
                        <option value='masculino'>Masculino</option>
                        <option value='femenino'>Femenino</option>
                        <option value='otro'>Otro</option>
                    </select>
                  </p>";
            echo "<p>Pericia informática (0-10): <input type='number' name='pericia' min='0' max='10' required></p>";
            echo "<p>Dispositivo:
                    <select name='dispositivo'>
                        <option value='ordenador'>Ordenador</option>
                        <option value='tableta'>Tableta</option>
                        <option value='telefono'>Teléfono</option>
                    </select>
                  </p>";
            echo "<p>Comentarios del usuario <textarea name='comentarios_usuario'></textarea></p>";
            echo "<p>Propuestas de mejora <textarea name='propuestas'></textarea></p>";
            echo "<p>Valoración (0-10) <input type='number' name='valoracion' min='0' max='10' required></p>";
            echo "<p>Comentarios del observador <textarea name='comentarios_observador'></textarea></p>";
            echo "<input type='submit' name='guardar' value='Guardar'/></form>";
        }

        public function guardarDatos()
        {
            // Tiempo que ha tardado el usuario en hacer la prueba
            $tiempo = $this->cronometro->getTiempo(); 

            // Comprobar si el usuario ha completado la prueba (si ha respondido a todas las preguntas)
            $completado = 1;
            $respuestas = [];
            for ($i = 1; $i <= 10; $i++) {
                $campo = 'p' . $i;
                $valor = isset($_SESSION[$campo]) ? trim($_SESSION[$campo]) : '';
                if ($valor === '') $completado = 0;
                $respuestas[] = "R$i: " . $valor;
            }
            $respuestasTexto = implode(' | ', $respuestas);

            $this->connect();

            // Insertar usuario

            $stmtU = $this->conn->prepare(
                "INSERT INTO usuarios (codigo_identificacion, profesion, edad, genero, pericia)
                 VALUES (?, ?, ?, ?, ?)"
            );

            $stmtU->bind_param("isisi",
                $_POST['codigo_identificacion'],
                $_POST['profesion'],
                $_POST['edad'],
                $_POST['genero'],
                $_POST['pericia']
            );

            $stmtU->execute();
            $idUsuario = $stmtU->insert_id;
            $stmtU->close();

            // Insertar resultados

            $stmtR = $this->conn->prepare(
                "INSERT INTO resultados
                (id_usuario, dispositivo, tiempo, completado,
                comentarios_usuario, propuestas, valoracion, respuestas)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
            );

            $dispositivo = $_POST['dispositivo'];
            $comentarios_usuario = $_POST['comentarios_usuario'] ?? '';
            $propuestas = $_POST['propuestas'] ?? '';
            $valoracion = $_POST['valoracion'];

            $stmtR->bind_param(
                "isdissis",
                $idUsuario,
                $dispositivo,
                $tiempo,
                $completado,
                $comentarios_usuario,
                $propuestas,
                $valoracion,
                $respuestasTexto
            );

            $stmtR->execute();
            $stmtR->close();

            // Insertar comentarios del observador
            $comentarios_observador = $_POST['comentarios_observador'] ?? '';

            $stmtO = $this->conn->prepare(
                "INSERT INTO observaciones (id_usuario, comentarios_observador)
                    VALUES (?, ?)"
            );

            $stmtO->bind_param(
                "is",
                $idUsuario,
                $comentarios_observador
            );

            $stmtO->execute();
            $stmtO->close();

            $this->disconnect();

            echo "<p>Datos de la prueba guardados correctamente.</p>";
        }
    }
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name ="author" content ="Lara Haya Santiago" />
    <meta name ="description" content ="COMPLETAR" />
    <meta name ="keywords" content ="Test, PHP" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <title>MotoGP-Juegos: Test</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css"/>
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css"/>
    <link rel="icon" href="../multimedia/iconos/juegos.ico" />
</head>

<body>
    <main>
        <h2>Test</h2>

        <?php
            $test = new Test();
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if (isset($_POST['iniciar'])) {
                    $test->iniciarPrueba();
                } elseif (isset($_POST['terminar'])) {
                    $test->terminarPrueba();
                }
                elseif (isset($_POST['guardar'])) {
                    $test->guardarDatos();
                }
            } else {
                $test->mostrarFormularioInicio();
            }
        ?>
    </main>
</body>
</html>