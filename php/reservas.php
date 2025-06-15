<?php
    require_once "teverga.php";
    
    class Reserva extends Teverga {

        private $id_usuario;
        private $id_horario;
        private $presupuesto;
        private $fecha;
        private $personas;
        private $id_recurso;
        private $id_reserva;

        public function __construct() {
            session_start();
            $this->id_usuario = $_SESSION["id_usuario"];

            $this->id_horario = $_POST["id_horario"] ?? null;
            $this->presupuesto = $_POST["presupuesto"] ?? null;
            $this->personas = $_POST["personas"] ?? null;
            $this->fecha = $_POST["fecha"] ?? null;
            $this->id_recurso = $_POST["id_recurso"] ?? null;
            $this->id_reserva = $_POST["id_reserva"] ?? null;
        }

        public function añadirReserva() {
            $this->connect();

            // Comprobar si ya existe una reserva del usuario con el mismo recurso, fecha y horario
            $sql = "SELECT id_reserva, personas, presupuesto, fecha
                    FROM reservas
                    WHERE id_usuario = ? AND id_horario = ? AND fecha = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("iis", $this->id_usuario, $this->id_horario, $this->fecha);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($reservaExistente = $result->fetch_assoc()) { // Actualizar la reserva
                
                $id_reserva = $reservaExistente["id_reserva"];
                $personas_antiguas = $reservaExistente["personas"];
                $presupuesto_antiguo = $reservaExistente["presupuesto"];

                $personas_nuevas = $personas_antiguas + $this->personas;
                $presupuesto_nuevo = $presupuesto_antiguo + $this->presupuesto;

                $stmt->close();

                $sql = "UPDATE reservas SET presupuesto = ?, personas = ? WHERE id_reserva = ?";
                $stmt = $this->conn->prepare($sql);
                $stmt->bind_param("dii", $presupuesto_nuevo,  $personas_nuevas, $id_reserva);
                $stmt->execute();
                $stmt->close();
            } 
            else { // No existe una reserva del mismo recurso en el mismo horario
                
                $stmt->close();
                $sql = "INSERT INTO reservas (id_usuario, id_horario, presupuesto, personas, fecha) VALUES (?, ?, ?, ?, ?)";
                $stmt = $this->conn->prepare($sql);
                $stmt->bind_param("iidis", $this->id_usuario, $this->id_horario, $this->presupuesto, $this->personas, $this->fecha);
                $stmt->execute();
                $stmt->close();
            }

            $this->disconnect();
        }

        public function verReservas() {
            $this->connect();

            $sql = "SELECT r.id_reserva, rc.id_recurso, r.fecha, r.personas, r.presupuesto, h.hora_inicio, h.hora_fin, rc.nombre
                    FROM reservas r
                    JOIN horarios_recurso h ON r.id_horario = h.id_horario
                    JOIN recursos rc ON h.id_recurso = rc.id_recurso
                    WHERE r.id_usuario = ?";

            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $this->id_usuario);
            $stmt->execute();
            $result = $stmt->get_result();

            $reservas = [];
            while ($fila = $result->fetch_assoc()) {
                $reservas[] = $fila;
            }

            $stmt->close();
            $this->disconnect();

            // Devolver en formato JSON
            header("Content-Type: application/json");
            echo json_encode($reservas);
        }

        public function anularReserva() {
            $this->connect();

            $sql = "DELETE FROM reservas WHERE id_reserva = ? AND id_usuario = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ii", $this->id_reserva, $this->id_usuario);
            $stmt->execute();

            $stmt->close();
            $this->disconnect();
        }
    }
    
    $reserva = new Reserva();

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        if($_POST["accion"] === "añadir")
            $reserva->añadirReserva();
        elseif($_POST["accion"] === "anular")
            $reserva->anularReserva();
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $reserva->verReservas();
    }
?>