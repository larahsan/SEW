class Noticias
{
    constructor()
    {
        this.soportaAPI = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;
    }

    readInputFile(file) 
    {
        if(!this.soportaAPI)
        {
            document.write('<p>El navegador no soporta el uso de la API file.</p>');
            return;
        }

        var archivo = file[0];

        if (archivo.type.match(/text.*/)) 
        {
            var lector = new FileReader();

            lector.onload = function() 
            {
              var noticias = lector.result.split("\n");

              var contenedorNoticias = document.querySelector("section");
              if(contenedorNoticias==undefined)
              {
                contenedorNoticias = document.createElement("section");
                document.querySelector("main").appendChild(contenedorNoticias);
              }

              noticias.forEach((noticia) => 
              {
                  var partes = noticia.split("_");

                  var nombre = document.createElement("h3");
                  nombre.innerText = partes[0];
                  var descripcion = document.createElement("p");
                  descripcion.innerText = partes[1];
                  var autor = document.createElement("p");
                  autor.innerText = partes[2];

                  var contenedorNoticia = document.createElement("article");
                  contenedorNoticia.appendChild(nombre);
                  contenedorNoticia.appendChild(descripcion);
                  contenedorNoticia.appendChild(autor);

                  contenedorNoticias.appendChild(contenedorNoticia);
              });
            }      
            lector.readAsText(archivo);
        }
        else 
        {
            document.write("<p>Error : archivo no válido</p>");
        }       
    }

    addNoticia()
    {
        var partes = document.querySelector("form").querySelectorAll("input");

        var nombre = document.createElement("h3");
        nombre.innerText = partes[0].value;
        var contenido = document.createElement("p");
        contenido.innerText = partes[1].value;
        var autor = document.createElement("p");
        autor.innerText = partes[2].value;

        var contenedorNoticia = document.createElement("article");
        contenedorNoticia.appendChild(nombre);
        contenedorNoticia.appendChild(contenido);
        contenedorNoticia.appendChild(autor);

        var contenedorNoticias = document.querySelector("section");
        if(contenedorNoticias==undefined)
        {
            contenedorNoticias = document.createElement("section");
            document.querySelector("main").appendChild(contenedorNoticias);
        }
        contenedorNoticias.appendChild(contenedorNoticia);
    }
}