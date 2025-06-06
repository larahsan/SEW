class Index {
    crearCarrusel()
    {
        const imagenes = $("img");
        const nextButton = $("article button").eq(0);
        const prevButton = $("article button").eq(1);

        var current = 0;
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

    mostrarNoticias() {
        /* La versión gratuita de NewsApi solo funciona en local
        const apiKey_newsapi = '9c188c548de64e7ebb69e75f6f6d2232';
        const url_newsapi = `https://newsapi.org/v2/everything?q=Teverga&language=es&apiKey=${apiKey_newsapi}`;*/

        const apiKey_newsdata = 'pub_bd8eac6c2c974fd9a69815805bc71d6b';
        const url_newsdata = `https://newsdata.io/api/1/news?apikey=${apiKey_newsdata}`;

        function procesarNoticias(noticias) {
            const articleNoticias = $('main > article').eq(1).empty();
            articleNoticias.append($('<h3>').text('Noticias destacadas'));

            // Coger 4 noticias
            noticias = noticias.slice(0, 5);

            for (const noticia of noticias) {
                const enlace = $('<a>')
                    .attr('href', noticia.link)
                    .text(noticia.title.normalize("NFC"));

                const titulo = $('<h4>').append(enlace);
                const descripcion = $('<p>').text(noticia.description.normalize("NFC") || '');

                const imagen = $('<img>')
                    .attr('src', noticia.image_url)
                    .attr('alt', noticia.title.normalize("NFC"));

                articleNoticias.append(titulo, descripcion, imagen);
            }
        }
        
        fetch(`${url_newsdata}&q=Teverga`)
        .then(response => response.json())
        .then(data1 => {
            let noticias1 = data1.results || [];

            if (noticias1.length >= 3)
                procesarNoticias(noticias1);
            else {
                // Si hay pocas noticias, ampliar la búsqueda a concejos cercanos
                fetch(`${url_newsdata}&q="Teverga" OR "Quirós" OR "Somiedo" OR "Proaza"`)
                .then(response => response.json())
                .then(data2 => {

                    let noticias2 = data2.results || [];

                    for (const noticia of noticias2)
                        if (!noticias1.some(n => n.title === noticia.title))
                            noticias1.push(noticia);

                    procesarNoticias(noticias1);
                });
            }
        })
        .catch(error => {
            console.error("Error al cargar noticias: ", error);
        });
    }
}