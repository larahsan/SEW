class Rutas
{
    constructor() {
        this.xmlPath = "xml/rutasEsquema.xml";
        this.kmlPath = "xml/rutas.kml"
        this.svgPath = "xml/altimetria.svg"
        this.ns = "http://www.uniovi.es";
    }

    cargarDatos() {
        $.get(this.xmlPath, (data) => {
            const rutas = $(data).find("ruta");
            let html = '';

            rutas.each((_, rutaElem) => {
                const ruta = $(rutaElem);
                html += this.generarHTMLRuta(ruta);
            });

            $("main section:first-of-type").append(html);
        });
    }

    generarHTMLRuta(ruta) {
        // Información básica de la ruta
        const info = ruta.find("info");
        const nombre = info.attr("nombre");

        let html = `<article><h3>${nombre}</h3>`;
        html += `<details><summary>Información</summary><ul>`;

        const tipo = info.attr("tipo");
        const descripcion = info.attr("descripcion");
        const transporte = info.attr("transporte");
        const agencia = info.attr("agencia");
        const personasAdecuadas = info.attr("personasAdecuadas");
        const recomendacion = info.attr("recomendacion");
        const duracion = ruta.find("tiempo").attr("duracion");

        html += `<li><b>Tipo:</b> ${tipo}</li>
                    <li><b>Descripción:</b> ${descripcion}</li>
                    <li><b>Transporte:</b> ${transporte}</li>
                    <li><b>Agencia:</b> ${agencia}</li>
                    <li><b>Personas adecuadas:</b> ${personasAdecuadas}</li>
                    <li><b>Recomendación:</b> ${recomendacion}</li>
                    <li><b>Duración:</b> ${duracion}</li></ul></details>`

        // Localización de la ruta

        html += `<details><summary>Localización</summary><ul>`;

        const localizacion = ruta.find("localizacion");
        const lugar = localizacion.attr("lugar");
        const direccion = localizacion.attr("direccion");
        const coord = localizacion.find("coordenadas");
        const lat = coord.attr("latitud");
        const lon = coord.attr("longitud");
        const alt = coord.attr("altitud");

        html += `<li><b>Lugar:</b> ${lugar}</li>
                    <li><b>Dirección:</b> ${direccion}</li>
                    <li><b>Coordenadas:</b> ${lat}, ${lon}, ${alt}</li></ul></details>`

        // Hitos de la ruta

        html += `<details><summary>Hitos</summary><ul>`;

        const hitos = ruta.find("hito");
        hitos.each(function (i) {
            const hito = $(this);

            // Información sobre cada hito

            const nombreHito = hito.attr("nombreHito");
            const coord = hito.find("coordenadas");
            const lat = coord.attr("latitud");
            const lon = coord.attr("longitud");
            const alt = coord.attr("altitud");

            html += `<li><b>Hito ${i + 1}:</b> ${nombreHito} (${lat}, ${lon}, ${alt} m)`;

            // Galería de cada hito

            const galeria = hito.find("galeriaHito");
            galeria.find("foto").each((_, foto) => { // Sólo tengo una foto por hito pero por si se añadiesen más
                const src = $(foto).text().trim();
                html += `<img src="${src}" alt="Foto de: ${nombreHito}"/>`
            });

            const video = galeria.find("video");
            if(video.length > 0) { // Los vídeos son opcionales
                video.each((_, video) => {
                    const src = $(video).text().trim();
                    html += `<video controls>
                                <source src="${src}" type="video/mp4">
                            </video>`;
                });
            }
        });
        html += `</li></ul></details></article>`;

        return html;
    }

    generarKML()
    {
        fetch(this.kmlPath)
        .then(response => response.text())
        .then(contenido =>
        {
            var contenedor = $("main section")[1];

            var mapaGeoposicionado = new google.maps.Map(contenedor,
            {
                zoom: 11,
                center: {lat: 43.2374863, lng: -6.0930811},
                mapId: "df57fcfb1310827e"
            });

            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(contenido, "application/xml");
            const placemarks = kmlDoc.getElementsByTagName("Placemark");
            
            for (let placemark of placemarks) {
                const nameElem = placemark.getElementsByTagName("name")[0];
                const name = nameElem ? nameElem.textContent.trim() : "Sin nombre";
                
                const pointElem = placemark.getElementsByTagName("Point")[0];
                const lineElem = placemark.getElementsByTagName("LineString")[0];

                if (pointElem) {
                    const coordsText = pointElem.getElementsByTagName("coordinates")[0].textContent.trim();
                    const [lng, lat] = coordsText.split(',').map(Number);

                    new google.maps.marker.AdvancedMarkerElement({
                        position: { lat, lng },
                        map: mapaGeoposicionado,
                        title: name
                    });
                }

                if (lineElem) {
                    const coordsText = lineElem.getElementsByTagName("coordinates")[0].textContent.trim();
                    const coordLines = coordsText.split(/\s+/);
                    const pathCoordinates = coordLines.map(coordStr => {
                        const [lng, lat] = coordStr.split(',').map(Number);
                        return { lat, lng };
                    });

                    new google.maps.Polyline({
                        path: pathCoordinates,
                        geodesic: true,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        map: mapaGeoposicionado
                    });
                }
            }
        });
    }

    generarSVG()
    {
        fetch(this.svgPath)
        .then(response => response.text())
        .then(contenido =>
        {
            var parser = new DOMParser();
            var svgDoc = parser.parseFromString(contenido, "image/svg+xml");

            const svgElement = svgDoc.querySelector('svg');

            if (svgElement) {
                if (!svgElement.getAttribute('viewBox')) {
                    const width = svgElement.getAttribute("width") || 1000;
                    const height = svgElement.getAttribute("height") || 1000;
                    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                }
                
                $("main section").eq(2).append(svgElement);
            }
        });
    }
}
