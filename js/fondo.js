class Fondo
{
    constructor(país, capital, circuito)
    {
        this.país = país;
        this.capital = capital;
        this.circuito = circuito;
    }

    obtenerImagen()
    {
        var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        
        $.getJSON(flickrAPI, 
        {
            tags: this.circuito,
            tagmode: "any",
            format: "json"
        })
        .done(function(data) 
        {
            $.each(data.items, function(i,item ) 
            {
                //$('<img />').attr("src", item.media.m).appendTo('body');
                if ( i === 1 ) // Imagen deseada
                {
                    let imageURL = item.media.m.replace("_m", "_b");;
                    $('body').attr(
                        "style",
                        `background-image: url(${imageURL});` +
                        `background-size: cover;`+
                        `height: 75em;`+
                        `background-position: center;`
                    );
                    return false;
                }
            });
        }
    );
    }
}
