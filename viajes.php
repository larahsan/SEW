<?php
    class Carrusel
    {
        private $capital;
        private $país;

        public function __construct($capital, $país)
        {
            $this->capital = $capital;
            $this->país = $país;
        }

        function obtenerImagen()
        {
            //$tag = "$this->país, $this->capital";
            $perPage = 10;

            $url = 'http://api.flickr.com/services/feeds/photos_public.gne?';
            $url.= '&tags='.$this->país .$this->capital;
            $url.= '&per_page='.$perPage;
            $url.= '&format=json';
            $url.= '&nojsoncallback=1';

            $respuesta = file_get_contents($url);
            $json = json_decode($respuesta);

            for($i=0;$i<$perPage;$i++) 
            {
                $titulo = $json->items[$i]->title;
                $URLfoto = str_replace("_m", "_b", $json->items[$i]->media->m);
     
                print "<img alt='".$titulo."' src='".$URLfoto."' />";
            }
        }
    }

    class Moneda
    {
        private $from;
        private $to;

        public function __construct($from, $to)
        {
            $this->from = $from;
            $this->to = $to;
        }

        function getCambio()
        {
            // API usada: ExConvert

            $apikey = "4a3dad5e-c286e921-39bc11ee-70d642b5";
            $url = "https://api.exconvert.com/convert?from=$this->from&to=$this->to&amount=1&access_key=$apikey";

            $json = file_get_contents($url);
            $datos = json_decode($json, true);

            $result = $datos['result'][$this->to];
            print "<p>1 $this->from equivale a $result $this->to</p>";
        }
    }
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop: Viajes</title>
    <meta name ="author" content ="Lara Haya Santiago" />
    <meta name ="description" content ="Sección para los viajes" />
    <meta name ="keywords" content ="Viajes" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/imagenes/Viajes.ico" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" 
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
            crossorigin="anonymous">
    </script>
    <script src="js/viajes.js"></script>
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
            <a title="Viajes" href="viajes.php" class="active">Viajes</a>
            <a title="Juegos" href="juegos.html">Juegos</a>
        </nav>
    </header>

    <p>Estás en: Inicio > Viajes</p>
    
    <main>
        <h2>Viajes</h2>

        <section>
            <h3>Ubicación</h3>
            <section></section>
        </section>

        <script 
            async 
            defer 
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU&callback=initMap&loading=async&libraries=marker">
        </script>

        <section>
            <h3>Moneda</h3>
            <?php
                $moneda = new Moneda("CNY", "EUR");
                $moneda->getCambio();
            ?>
        </section>

        <section>
            <h3>Imágenes</h3>
        </section>
        <article>
            <?php
                $carrusel = new Carrusel("Beijing", "China");
                $carrusel->obtenerImagen();
            ?>
            <button> &gt; </button>
            <button> &lt; </button>
        </article>
    </main>

</body>
</html>