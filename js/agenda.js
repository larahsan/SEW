class Agenda
{
    constructor()
    {
        this.url = "https://ergast.com/api/f1/current.json";
    }

    getInfoCarreras()
    {
        $.ajax(
        {
            dataType: "json",
            url: this.url,
            method: 'GET',

            success: function(datos)
            {
                var section = $("<section>");
                $('main').append(section);
                
                var races = datos.MRData.RaceTable.Races;
                races.forEach(race => 
                {
                    var raceName = race.raceName;
                    var circuitName = race.Circuit.circuitName;
                    var coordLat = race.Circuit.Location.lat;
                    var coordLong = race.Circuit.Location.long;
                    var fecha = race.date;
                    var hora = race.time;
                    var round = race.round;
                    
                    var article = $("<article>");

                    var number = $("<span>")
                        .text(round);
                    article.append(number);

                    var info = ($("<h3>").text(raceName))
                        .add($("<h4>").text(`${fecha} a las ${hora}`))
                        .add($("<p>").text(`Circuito: ${circuitName}`))
                        .add($("<p>").text(`Localización: ${coordLat}, ${coordLong}`));
                    
                    article.append(info);
                    section.append(article);
                });
            }
        });
    }
}