<?php
    require_once "teverga.php";

    class Usuario extends Teverga {
        // Datos del usuario
        private $nombre;
        private $email;
        private $contraseña;

        public function obtenerDatosFormulario()
        {
            $this->nombre = $_POST["nombre"] ?? null;
            $this->email = $_POST["email"];
            $this->contraseña = $_POST["contraseña"];
        }

        public function registrar()
        {
            $this->connect();

            $stmt = $this->conn->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
            $stmt->bind_param("s", $this->email);
            $stmt->execute();
            $result = $stmt->get_result();

            $mensaje = "";

            if ($result->fetch_assoc()) {
                $mensaje = "Este email ya está registrado.";
            } else {
                $stmt = $this->conn->prepare("INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)");
                $stmt->bind_param("sss", $this->nombre, $this->email, $this->contraseña);
                $stmt->execute();
                
                $mensaje = "OK";

                // Guardar el usuario
                $id_usuario = $this->conn->insert_id;
                session_start();
                $_SESSION["id_usuario"] = $id_usuario;
            }
            
            $stmt->close();
            $this->disconnect();

            return $mensaje;
        }

        public function autenticar() 
        {
            $this->connect();

            $stmt = $this->conn->prepare("SELECT id_usuario, contraseña FROM usuarios WHERE email = ?");
            $stmt->bind_param("s", $this->email);
            $stmt->execute();
            $stmt->bind_result($id_usuario, $contraseña);

            $mensaje = "";

            if ($stmt->fetch()) {
                if ($this->contraseña === $contraseña) {
                    $mensaje = "OK";
                    // Guardar el usuario
                    session_start();
                    $_SESSION["id_usuario"] = $id_usuario;
                } else {
                    $mensaje = "Contraseña incorrecta.";
                }
            } else {
                $mensaje = "El usuario no existe.";
            }
            
            $stmt->close();
            $this->disconnect();

            return $mensaje;
        }

        public function ejecutar()
        {
            $this->obtenerDatosFormulario();

            if($this->nombre == null)
                echo $this->autenticar();
            else
                echo $this->registrar();
        }
    }
    $usuario = new Usuario();
    $usuario->ejecutar();
?>