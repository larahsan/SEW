class País
{
    constructor(país, capital)
    {
        this.país = país;
        this.capital = capital;
    }

    completar()
    {
        this.circuito = "Cirtuito Internacional de Shanghai";
        this.numPoblación = 1409670000;
        this.formaGobierno = "República";
        this.latitudMeta = 31.33666532;
        this.longitudMeta = 121.218499126;
        this.religión = "budismo";
    }

    getPaís()
    {
        return this.país;
    }

    getCapital()
    {
        return this.capital;
    }

    getInfo()
    {
        return "<aside> <ul> \
                    <li>Nombre del circuito: " + this.circuito + "</li> \
                    <li>Número de población del país: " + this.numPoblación + "</li> \
                    <li>Forma de gobierno del país: " + this.formaGobierno + "</li> \
                    <li>Religión mayoritaria del país: " + this.religión + "</li> \
                </ul> </aside>"
    }

    escribirCoordenadasMeta()
    {
        document.write("<p>Coordenadas de la línea de meta del circuito: " 
            + this.latitudMeta + ", " + this.longitudMeta + "</p>");
    }

    obtenerTiempo()
    {
        const apiKey = 'aea850bb1314d3e9a63ee4610f2702ff';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitudMeta}&lon=${this.longitudMeta}&appid=${apiKey}&units=metric&mode=xml&lang=es`;

        $.ajax(
        {
            url: url,
            dataType: 'xml',
            method: 'GET',

            success: function(data) 
            {
                var título = $('<h3>').text("Pronóstico de los próximos 5 días");
                var section = $('<section>'); // Sección para el tiempo
                $('main').append(título, section);

                var counter = 1; // Contador para los días
                var times = data.querySelectorAll("time");

                for(var i=4; i<40; i+=8) // Elegir un intervalo de cada día
                {
                    var day = times[i];
                    
                    var tempMax       = $('temperature',day).attr("max");
                    var tempMin       = $('temperature',day).attr("min");
                    var humedad       = $('humidity',day).attr("value");
                    var precipitacion = $('precipitation',day).attr("value");
                    var iconCode      = $('symbol',day).attr("var");
                    var weatherIcon   = `https://openweathermap.org/img/wn/${iconCode}.png`;

                    if(precipitacion==undefined)
                        precipitacion = "sin datos";

                    var article = $("<article>");
                    var pronóstico = $("<h4>").text(`Día ${counter}:`)
                        .add($("<img>").attr("src", weatherIcon).attr("alt", "Icono del clima"))
                        .add($("<p>").text(`Temperatura máxima: ${Math.round(tempMax)}°C`))
                        .add($("<p>").text(`Temperatura mínima: ${Math.round(tempMin)}°C`))
                        .add($("<p>").text(`Humedad: ${humedad}%`))
                        .add($("<p>").text(`Precipitación: ${precipitacion}`));

                    article.append(pronóstico);
                    section.append(article);

                    counter++;
                }
            }
        });
    }
}
