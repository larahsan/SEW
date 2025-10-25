class Ciudad
{
    constructor(nombre, pais, gentilicio)
    {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
    }

    completar()
    {
        this.poblacion = 6.794;
        this.longitud = 12.723393899880431;
        this.latitud = 50.78623461653255;
    }

    getCiudad()
    {
        return this.nombre;
    }

    getPais()
    {
        return this.pais;
    }

    getInfo()
    {
        return "<ul> <li>Gentilicio: " + this.gentilicio + "</li> \
                     <li>Población: " + this.poblacion + " habitantes</li> </ul>";
    }

    coordenadas()
    {
        document.write("<p>Coordenadas: " + this.latitud + ", " + this.longitud + "</p>");
    }
}