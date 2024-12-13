class Api
{
    mostrarKML(files) 
    {
        var archivo = files[0];

        const lector = new FileReader();
        lector.onload = function () 
        {
            const contenido = lector.result;
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(contenido, "application/xml");

            const coordenadas = kmlDoc.querySelector("coordinates").textContent.trim().split("\n");
            console.log(coordenadas);
            const contenedor = document.querySelector('section');

            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            contenedor.appendChild(renderer.domElement);

            const escena = new THREE.Scene();
            const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            //camara.position.set(0, 500, 1000);
            //camara.lookAt(escena.position);

            const luz = new THREE.AmbientLight(0x404040, 1);
            escena.add(luz);

            const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
            luzDireccional.position.set(10, 10, 10).normalize();
            escena.add(luzDireccional);

            const escala = 100000;
            const puntos = coordenadas.map(linea => {
                const [lng, lat, alt] = linea.split(",").map(parseFloat);
                return new THREE.Vector3(lng * escala, alt, lat * escala);
            });

            const puntosReducidos = puntos.filter((_, index) => index % 10 === 0);
            //const geometriaCircuito = new THREE.BufferGeometry().setFromPoints(puntosReducidos);
            const puntosGeometria = new THREE.BufferGeometry().setFromPoints(puntos);

            const materialPuntos = new THREE.PointsMaterial({ color: 0xff0000, size: 1 });
            const materialCircuito = new THREE.LineBasicMaterial({ color: 0xff0000 });

            const circuito = new THREE.LineLoop(puntosGeometria, materialCircuito);

            //escena.add(puntosCircuito);
            escena.add(circuito);

            const boundingBox = new THREE.Box3().setFromObject(circuito);
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);

            camara.position.set(center.x, center.y + 500, center.z + 1000);
            camara.lookAt(center);

            escena.background = new THREE.Color(0xeeeeee); // Fondo claro


            /*var geometria = new THREE.Geometry();

            puntos.forEach(point =>
            {
                geometria.vertices.push(point);
            }
            )

            var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

            var line = new THREE.Mesh( geometria, material );
            escena.add( line );*/

            function animar() 
            {
                requestAnimationFrame(animar);
                renderer.render(escena, camara);
            }
            animar();

            /*var contenido = lector.result;
            var contenedor = document.querySelector("section");

                var mapaGeoposicionado = new google.maps.Map(contenedor,
                {
                    zoom: 15,
                    center: {lat: 43.3672702, lng: -5.8502461},
                    mapId: "df57fcfb1310827e"
                });

                const parser = new DOMParser();
                const kmlDoc = parser.parseFromString(contenido, "application/xml");
                const placemarks = kmlDoc.querySelector("coordinates").textContent.trim().split("\n");
                var pathCoordinates = [];

                for (let i = 0; i < placemarks.length; i++) 
                {
                    var placemark = placemarks[i];
                    
                    const [lng, lat] = placemark.split(',').map(Number);
                    pathCoordinates.push({lat, lng});
                    
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

                path.setMap(mapaGeoposicionado);*/
        };
        lector.readAsText(archivo);
    }

    circuito3D(coordenadas)
    {
        const contenedor = document.querySelector('section');

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        contenedor.appendChild(renderer.domElement);

        const escena = new THREE.Scene();
        const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const luz = new THREE.DirectionalLight(0xffffff, 1);
        luz.position.set(5, 10, 7.5);
        escena.add(luz);

        const geometriaTerreno = new THREE.PlaneGeometry(100, 100, 32, 32);
        const materialTerreno = new THREE.MeshBasicMaterial({ color: 0x228B22, wireframe: true });
        const terreno = new THREE.Mesh(geometriaTerreno, materialTerreno);
        terreno.rotation.x = -Math.PI / 2;
        escena.add(terreno);

        camara.position.set(0, 20, 30);
        camara.lookAt(escena.position);

        const puntos = coordenadas.split("\n").map(([x, y]) => new THREE.Vector3(x, 0, y));
        const geometriaCircuito = new THREE.BufferGeometry().setFromPoints(puntos);
        const materialCircuito = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const circuito = new THREE.Line(geometriaCircuito, materialCircuito);
        escena.add(circuito);

        function animar() 
        {
            requestAnimationFrame(animar);
            renderer.render(escena, camara);
        }
        animar();
    }
}