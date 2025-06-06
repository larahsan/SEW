class Meteorologia {
    
    constructor() {
        // Coordenadas de La Plaza, Teverga
        this.lon = -6.1028422;
        this.lat = 43.1583780;
        this.alt = 471.6012148;
    }
    
    obtenerTiempoActual()
    {
        const apiKey = 'aea850bb1314d3e9a63ee4610f2702ff';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${apiKey}&units=metric&lang=es`;

        $.ajax(
        {
            url: url,
            dataType: 'json',
            method: 'GET',

            success: function(data) 
            {
                const article = $('main article').eq(0);

                const weather = data.weather;
                const main = data.main;

                const iconCode = weather[0].icon;
                const weatherIcon = `https://openweathermap.org/img/wn/${iconCode}.png`;
                const descripcion = weather[0].description;
                const temp = Math.round(main.temp);
                const humedad = main.humidity;
                const viento = data.wind.speed;

                article.append(
                    $('<h3>').text("Meteorología actual"),
                    $('<img>').attr('src', weatherIcon).attr('alt', descripcion),
                    $('<p>').text(`Descripción: ${descripcion}`),
                    $('<p>').text(`Temperatura: ${temp}°C`),
                    $('<p>').text(`Humedad: ${humedad}%`),
                    $('<p>').text(`Velocidad del viento: ${viento}km/h`)
                );
            }
        });
    }

    obtenerPronosticoSemana() {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&daily=precipitation_probability_max,temperature_2m_mean,weather_code,wind_speed_10m_mean&timezone=auto`
    
        $.ajax(
        {
            url: url,
            dataType: 'json',
            method: 'GET',

            success: function(data) 
            {
                const article = $('main article').eq(1);
                article.append($("<h3>").text("Pronóstico para los próximos 7 días"))

                // Unidades para los valores
                const unidades = data.daily_units;
                const tempUnit = unidades.temperature_2m_mean;
                const precipitacionesUnit = unidades.precipitation_probability_max;
                const vientoUnit = unidades.wind_speed_10m_mean;

                for(let i = 0; i < 7; i++) {
                    const dia = data.daily;
                    
                    // Valores
                    const temp = dia.temperature_2m_mean[i];
                    const precipitaciones = dia.precipitation_probability_max[i];
                    const viento = dia.wind_speed_10m_mean[i];

                    const desplegable = $('<details>').append($('<summary>').text(`Día ${i+1}`));
                    desplegable.append(
                        $('<p>').text(`Temperatura media: ${temp}${tempUnit}`),
                        $('<p>').text(`Probabilidad de lluvia: ${precipitaciones}${precipitacionesUnit}`),
                        $('<p>').text(`Velocidad media del viento: ${viento}${vientoUnit}`)
                    );
                    article.append(desplegable);
                }
            }
        });
    }
}