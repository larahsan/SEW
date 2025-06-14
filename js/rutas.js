class Rutas
{
    mostrarFicheros(files) {
        var archivo = files[0];

        if (archivo && (archivo.type === "text/xml" || archivo.name.endsWith(".xml")))
        {
            var lector = new FileReader();

            lector.onload = () => 
            {
                var contenido = lector.result;

                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(contenido, "text/xml");

                const rutas = $(xmlDoc).find("ruta");

                const contenedorPrincipal = $("main").empty();
                const botonesSection = $(`<section>`).append($('<h2>').text('Escoge una ruta:'));
                contenedorPrincipal.append(botonesSection);
                const contenedoresRutas = [];
                
                rutas.each((i, rutaElem) => {
                    const ruta = $(rutaElem);
                    const nombreRuta = ruta.find("info").attr("nombre");
                    const nombre = `Ruta ${i+1}: ${nombreRuta}`;

                    const button = $(`<button>`).text(nombre);
                    botonesSection.append(button);

                    const contenedorRuta = $(`<section>`).append($('<h3>').text(`${nombre}`)).hide();
                    const datosSection = $(`<article>`);
                    const planimetriaSection = $(`<section>`).append($(`<h3>`).text(`Planimetría:`));
                    const altimetriaSection = $(`<section>`).append($(`<h3>`).text(`Altimetría:`)); 

                    contenedorRuta.append(datosSection, planimetriaSection, altimetriaSection);
                    contenedorPrincipal.append(contenedorRuta);
                    contenedoresRutas.push(contenedorRuta);

                    // Datos de la ruta
                    const html = this.generarXML(ruta);
                    datosSection.append(html);

                    // Planimetría
                    const kmlPath = ruta.find("kml").text().trim();
                    this.generarKML(kmlPath, planimetriaSection[0]);

                    // Altimetría
                    const svgPath = ruta.find("svg").text().trim();
                    this.generarSVG([svgPath], altimetriaSection);

                    button.on("click", () => {
                        contenedoresRutas.forEach(sec => sec.hide());
                        contenedorRuta.show();
                    });
                });
            };
        }
        lector.readAsText(archivo);
    }

    generarXML(ruta) {
        // Información básica de la ruta
        const info = ruta.find("info");

        let html = `<h3>Datos sobre la ruta</h3>`;
        html += `<details><summary>Información</summary><ul>`;

        const tipo = info.attr("tipo");
        const descripcion = info.attr("descripcion");
        const transporte = info.attr("transporte");
        const agencia = info.attr("agencia");
        const personasAdecuadas = info.attr("personasAdecuadas");
        const recomendacion = info.attr("recomendacion");
        const duracion = ruta.find("tiempo").attr("duracion");

        html += `<li>Tipo: ${tipo}</li>
                    <li>Descripción: ${descripcion}</li>
                    <li>Transporte: ${transporte}</li>
                    <li>Agencia: ${agencia}</li>
                    <li>Personas adecuadas: ${personasAdecuadas}</li>
                    <li>Recomendación: ${recomendacion}</li>
                    <li>Duración: ${duracion}</li></ul></details>`

        // Localización de la ruta

        html += `<details><summary>Localización</summary><ul>`;

        const localizacion = ruta.find("localizacion");
        const lugar = localizacion.attr("lugar");
        const direccion = localizacion.attr("direccion");
        const coord = localizacion.find("coordenadas");
        const lat = coord.attr("latitud");
        const lon = coord.attr("longitud");
        const alt = coord.attr("altitud");

        html += `<li>Lugar: ${lugar}</li>
                    <li>Dirección: ${direccion}</li>
                    <li>Coordenadas: ${lat}, ${lon}, ${alt}</li></ul></details>`

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

            html += `<li>Hito ${i + 1}: ${nombreHito} (${lat}, ${lon}, ${alt} m)`;

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
        html += `</li></ul></details>`;

        return html;
    }

    generarKML(path, contenedor)
    {
        var mapaGeoposicionado = new google.maps.Map(contenedor,
        {
            zoom: 11,
            center: {lat: 43.2374863, lng: -6.0930811},
            mapId: "df57fcfb1310827e"
        });

        fetch(path)
        .then(response => response.text())
        .then(contenido => {
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

    generarSVG(path, contenedor)
    {
        fetch(path)
        .then(response => response.text())
        .then(contenido =>
        {
            var parser = new DOMParser();
            var svgDoc = parser.parseFromString(contenido, "image/svg+xml");

            const svgElement = svgDoc.querySelector('svg');

            if (svgElement) {
                svgElement.querySelector('text').remove(); // Eliminar el nombre de la ruta (redundante)
                if (!svgElement.getAttribute('viewBox')) {
                    const width = svgElement.getAttribute("width") || 1050;
                    const height = svgElement.getAttribute("height") || 300;
                    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                }
                contenedor.append(svgElement);
            }
        });
    }
}
