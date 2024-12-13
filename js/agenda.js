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

                    var number = $("<span>").text(round).add("</span>");
                    article.append(number);

                    var info = ($("<h3>").text(raceName))
                        .add($("<p>").add($("<strong>").text(`${fecha} a las ${hora}`).add($("</strong>").add("</p>"))))
                        .add($("<p>").text(`Circuito: ${circuitName}`).add($("</p>")))
                        .add($("<p>").text(`Localización: ${coordLat}, ${coordLong}`).add($("</p>")));
                    
                    article.append(info);
                    section.append(article);
                });
            }
        });
    }
}