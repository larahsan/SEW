<?php
    require_once "teverga.php";
    
    class Recurso extends Teverga {
        public function obtenerRecursos() {
            $this->connect();

            $sql = "SELECT r.id_recurso, r.nombre, r.descripcion, r.precio, r.plazas,
                        r.fecha_inicio, r.fecha_fin, t.nombre_tipo
                    FROM recursos r
                    JOIN tipos_recurso t ON r.id_tipo = t.id_tipo
                    ORDER BY r.id_recurso, r.fecha_inicio";

            $result = $this->conn->query($sql);

            $recursos = [];

            while ($fila = $result->fetch_assoc()) {
                $recursos[] = $fila;
            }

            $this->disconnect();
            return $recursos;
        }
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        header("Content-Type: application/json");
        $recurso = new Recurso();
        echo json_encode($recurso->obtenerRecursos());
    }
?>