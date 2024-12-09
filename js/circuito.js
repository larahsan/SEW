class Circuito
{
    mostrarXML(files) 
    {
        var archivo = files[0];

        if (archivo && (archivo.type === "text/xml" || archivo.name.endsWith(".xml")))
        {
            var lector = new FileReader();

            lector.onload = function () 
            {
                var contenido = lector.result;

                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(contenido, "text/xml");

                var html = "<ul>";

                $(xmlDoc).find("datos").each(function () 
                {
                    var atributos = this.attributes;
                    html += "<li><strong>Datos:</strong><ul>";
                    for (let i = 0; i < atributos.length; i++) {
                        html += `<li>${atributos[i].name}: ${atributos[i].value}</li>`;
                    }
                    html += "</ul></li>";
                });

                $(xmlDoc).find("ref").each(function () {
                    html += `<li><strong>Referencia:</strong> ${$(this).text()}</li>`;
                });

                $(xmlDoc).find("galería").each(function () {
                    html += `<li><strong>Galería</strong></li><ul>`;

                    $(this).find("foto").each(function ()
                    {
                        html += `<li>Foto: ${$(this).text()}</li>`;
                    });

                    $(this).find("vídeo").each(function ()
                    {
                        html += `<li>Vídeo: ${$(this).text()}</li>`;
                    });

                    html += "</ul></li>";
                });

                $(xmlDoc).find(`tramo`).each(function () 
                {
                    var distancia = $(this).attr("distancia");
                    var numSector = $(this).attr("numSector");

                    html += `<li><strong>Tramo ${numSector}:</strong> Distancia: ${distancia}<ul>`;

                    // Procesar coordenadas dentro del tramo
                    $(this).find(`coordenadas`).each(function () 
                    {
                        var longitud = $(this).attr("longitud");
                        var latitud = $(this).attr("latitud");
                        var altitud = $(this).attr("altitud");
                        html += `<li>Coordenadas: Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}</li>`;
                    });

                    html += "</ul></li>";
                });

                html += "</ul>";
                $("section").eq(3).append(html);
            };
        }
        lector.readAsText(archivo);
    }
    
    mostrarKML(files)
    {
        var archivo = files[0];

        if (archivo && (archivo.type === "text/xml" || archivo.name.endsWith(".kml")))
        {
            var lector = new FileReader();

            lector.onload = function() 
            {
                var contenido = lector.result;
                var contenedor = $("section")[4];

                var mapaGeoposicionado = new google.maps.Map(contenedor,
                {
                    zoom: 15,
                    center: {lat: 43.3672702, lng: -5.8502461},
                    mapId: "df57fcfb1310827e"
                });

                const parser = new DOMParser();
                const kmlDoc = parser.parseFromString(contenido, "application/xml");
                const placemarks = kmlDoc.getElementsByTagName("Placemark");
                var pathCoordinates = [];

                for (let i = 0; i < placemarks.length-1; i++) 
                {
                    var placemark = placemarks[i];
                    var name = placemark.getElementsByTagName("name")[0].textContent.trim();
                    var coordinates = placemark.getElementsByTagName("coordinates")[0].textContent.trim();
                    
                    const [lng, lat, alt] = coordinates.split(',').map(Number);
                    pathCoordinates.push({lat, lng});
                    
                    new google.maps.marker.AdvancedMarkerElement
                    ({
                        position: { lat, lng, alt },
                        map: mapaGeoposicionado,
                        title: name
                    });

                    mapaGeoposicionado.setCenter({ lat, lng });
                }

                const path = new google.maps.Polyline
                ({
                    path: pathCoordinates,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                path.setMap(mapaGeoposicionado);
            };
        }
        lector.readAsText(archivo);
    }

    mostrarSVG(files)
    {
        var archivo = files[0];

        if (archivo && (archivo.type === "text/svg" || archivo.name.endsWith(".svg")))
        {
            var lector = new FileReader();

            lector.onload = function () 
            {
                var contenido = lector.result;

                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(contenido, "text/xml");

                const polyline = svgDoc.querySelector("polyline");
                const points = polyline.getAttribute("points").trim();

                var html = "<ul>";
                var puntos = points.split("     ");

                for(let i = 0; i<puntos.length-1; i++)
                {
                    var punto = puntos[i].split(",");
                    html += `<li>Punto ${i}: ${punto[0]}, ${punto[1]}</li>`;
                }
                html += "</ul>";
                $("section").eq(5).append(html);
            };
        }
        lector.readAsText(archivo);
    }
}