class Viajes
{
    constructor ()
    {
        navigator.geolocation.getCurrentPosition
        (
            this.getPosicion.bind(this), 
            this.verError.bind(this)
        );
    }

    getPosicion(posicion)
    {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.latitud = posicion.coords.latitude;
        this.longitud = posicion.coords.longitude; 

        // Llamar después de que se hayan obtenido las coordenadas
        this.getMapaEstático();
    }
    
    verError(error)
    {
        switch(error.code) 
        {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización";
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible";
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado";
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido";
                break;
        }
    }

    getMapaEstático()
    {
        const apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
        const url = "https://maps.googleapis.com/maps/api/staticmap?";

        var centro = `center=${this.latitud},${this.longitud}`;
        //zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
        var zoom ="&zoom=8";
        var tamaño= "&size=600x500";
        var marcador = `&markers=color:red%7C${this.latitud},${this.longitud}`;
        var sensor = "&sensor=false"; 

        var imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        var imagenElemento = document.createElement("img");
        imagenElemento.src = imagenMapa;
        imagenElemento.alt = "Mapa estático";
       
        var section = document.createElement("section");
        section.appendChild(imagenElemento);
        document.querySelector("main").querySelector("section").querySelector("section").appendChild(section);
    }

    getMapaDinámico()
    {
        var centro = {lat: 43.3672702, lng: -5.8502461};

        var section = document.createElement("section");
        var contenedor = document.querySelector("main").querySelector("section").querySelector("section").
        appendChild(section);

        var mapaGeoposicionado = new google.maps.Map(contenedor,
        {
            zoom: 15,
            center: centro,
            mapId: "df57fcfb1310827e"
        });

        navigator.geolocation.getCurrentPosition(function(position) 
        {
            var pos = 
            {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            new google.maps.marker.AdvancedMarkerElement
            ({
                position: pos,
                map: mapaGeoposicionado,
                title: 'Localización'
            });

            mapaGeoposicionado.setCenter(pos);
        });
    }

    crearCarrusel()
    {
        const imagenes = $("img");
        const nextButton = $("button").eq(0);
        const prevButton = $("button").eq(1);

        var current = 5;
        var max = imagenes.length - 1;

        function actualizarPosiciones()
        {
            imagenes.each((index, img) => 
            {
                var trans = 100 * (index - current)
                $(img).css("transform", "translateX(" + trans + "%)")
            });
        }

        actualizarPosiciones();

        nextButton.on("click", function () 
        {
            current === max ? current = 0 : current++;
            actualizarPosiciones();
        });

        prevButton.on("click", function () 
        {
            current === 0 ? current = max : current--;
            actualizarPosiciones();
        });
    }
}

function initMap() 
{
    var viajes = new Viajes();
    viajes.getMapaDinámico();
    viajes.crearCarrusel();
}
