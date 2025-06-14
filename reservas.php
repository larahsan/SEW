<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Turismo en Teverga: Reservas</title>
    <meta name ="author" content ="Lara Haya Santiago" />
    <meta name ="description" content ="Reservas" />
    <meta name ="keywords" content ="Reservas" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <!--<link rel="icon" href="multimedia/imagenes/Inicio.ico" />-->
    <script src="js/reservas.js"></script>
</head>

<body>
    <header>
        <h1>Turismo en Teverga</h1>

        <nav>
            <a title="Inicio" href="index.html">Inicio</a>
            <a title="Gastronomía" href="gastronomia.html">Gastronomía</a>
            <a title="Meteorología" href="meteorologia.html">Meteorología</a>
            <a title="Rutas" href="rutas.html">Rutas</a>
            <a title="Reservas" href="reservas.php" class="active">Reservas</a>
            <a title="Juego" href="juego.html">Juego</a>
            <a title="Ayuda" href="ayuda.html">Ayuda</a>
        </nav>
    </header>

    <p>Estás en: Inicio > Reservas</p>

    <h2>Reserva en Teverga</h2>

    <main></main>

    <script>
        let reservas = new Reservas();
        reservas.mostrarFormulario('login');
    </script>
   
</body>
</html>