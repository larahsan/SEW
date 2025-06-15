<?php
    require_once "teverga.php";
    
    class Horario extends Teverga {

        public function obtenerHorarios($id_recurso) {
            $this->connect();

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

        public function plazasDisponiblesHorario($fecha, $id_horario) {
            $this->connect();

            $sql = "SELECT COALESCE(SUM(res.personas), 0) AS plazas_reservadas, (r.plazas - COALESCE(SUM(res.personas), 0)) AS plazas_disponibles
                    FROM recursos r
                    JOIN horarios_recurso hr ON r.id_recurso = hr.id_recurso
                    LEFT JOIN reservas res ON hr.id_horario = res.id_horario AND res.fecha = ?
                    WHERE hr.id_horario = ?
                    GROUP BY r.id_recurso, hr.id_horario";

            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("si", $fecha, $id_horario);
            $stmt->execute();
            $result = $stmt->get_result();

            $plazas = $result->fetch_assoc()["plazas_disponibles"] ?? 0;

            $stmt->close();
            $this->disconnect();
            return $plazas;
        }
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {

        $horario = new Horario();
        $resultado;

        $modo = $_GET["modo"];
        if($modo == "horarios")
            $resultado = $horario->obtenerHorarios($_GET["id_recurso"]);
        else if($modo == "plazas")
            $resultado = $horario->plazasDisponiblesHorario($_GET["fecha"], $_GET["id_horario"]);

        header("Content-Type: application/json");
        echo json_encode($resultado);
    } 
?>