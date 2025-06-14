<?php
    require_once "teverga.php";
    
    class Horario extends Teverga {

        public function obtenerHorarios() {
            $this->connect();

            $id_recurso = $_GET["id_recurso"];

            $sql = "SELECT id_horario, hora_inicio, hora_fin 
                    FROM horarios_recurso 
                    WHERE id_recurso = ?
                    ORDER BY hora_inicio";

            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $id_recurso);
            $stmt->execute();
            $result = $stmt->get_result();

            $horarios = [];

            while ($fila = $result->fetch_assoc()) {
                $horarios[] = $fila;
            }

            $stmt->close();
            $this->disconnect();
            return $horarios;
        }
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        header("Content-Type: application/json");
        $horario = new Horario((int)$_GET["id_recurso"]);
        echo json_encode($horario->obtenerHorarios());
    } 
?>