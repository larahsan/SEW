class Juego {

    constructor() {
        this.preguntas = [
            "¿Qué comida tradicional puedes encontrar en Teverga?",
            "¿Cuál es una de las rutas de senderismo más conocidas en Teverga?",
            "¿Que producto artesanal es originario de Teverga?",
            "¿En qué zona de Asturias se encuentra Teverga?",
            "¿Qué ingrediente NO llevan las casadiellas de Teverga?",
            "¿Desde qué ruta en Teverga podemos ver el Pico Caldoveiro?",
            "¿Cuál de estos postres es típico de Teverga?",
            "¿Cuál de estas es una famosa atracción en Teverga?",
            "¿De qué forma se puede preparar la fabada tradicionalmente en Teverga?",
            "¿Cual de estas rutas NO pertenece al concejo de Teverga?"
        ];

        this.respuestas = [
            [
                "Pote de castañas",
                "Fabes con almejas",
                "Cachopo de merluza",
                "Pastel de cabracho",
                "Repollo relleno"
            ],
            [
                "Senda del Oso",
                "Ruta del Cares",
                "Camino Primitivo",
                "Ruta de las Xanas",
                "Senda Costera"
            ],
            [
                "Queso de fuente",
                "Sidra natural",
                "Miel de brezo",
                "Jabón de lavanda",
                "Cerámica de Cudillero"
            ],
            [
                "Sur",
                "Norte",
                "Este",
                "Oeste",
                "Centro"
            ],
            [
                "Mantequilla",
                "Harina",
                "Nuez",
                "Azúcar",
                "Anís"
            ],
            [
                "Puertos de Marabio",
                "Senda del Oso",
                "Las brañas de Vicenturo y Cueiro",
                "Carmín Real de la Mesa",
                "Ruta Vaqueira"
            ],
            [
                "Arroz con leche",
                "Tarta de Santiago",
                "Frixuelos rellenos",
                "Carbayones",
                "Leche frita"
            ],
            [
                "El Parque de la Prehistoria",
                "Museo del Jurásico",
                "Teleférico de Fuente Dé",
                "Parque Natural de Somiedo",
                "La Cuevona de Cuevas"
            ],
            [
                "Con calamares",
                "Con compango",
                "Con chorizo y morcilla",
                "Con fabes verdinas",
                "Con pimientos del piquillo"
            ],
            [
                "Ruta del Alba",
                "Ruta de la Braña de las Cadenas",
                "Ruta de la Braña de Cuevas",
                "Ruta de Navariegas",
                "Ruta del Urogallo"
            ]
        ]

        document.querySelector('main').innerHTML = `
            <article>
                <h3></h3>
                <label></label>
                <label></label>
                <label></label>
                <label></label>
                <label></label>
                <button type="button" disabled>Siguiente</button>
            </article>`

        this.index = 0;
        this.puntuacion = 0;
        this.respuestasUsuario = [];
        this.mostrarPregunta();
    }

    mostrarPregunta() {
        const article = document.querySelector('main article');
        const siguiente = article.querySelector('button');

        // Pregunta
        article.querySelector('h3').textContent = `${this.index+1}. ${this.preguntas[this.index]}`;

        // Asignar el valor a cada respuesta (0, 1, 2, 3, 4)
        const opciones = this.respuestas[this.index].map((texto, i) => ({
            texto,
            value: i
        }));

        // Barajar las opciones
        for (let i = opciones.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
        }

        // Añadir las labels barajadas
        const labels = article.querySelectorAll('label');
        for (let i = 0; i < labels.length; i++)
            labels[i].innerHTML = `<input type="radio" name="pregunta" value="${opciones[i].value}"/> ${opciones[i].texto}`;

        // Habilitar el botón de siguiente sólo si hay una respuesta seleccionada
        article.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                siguiente.disabled = false;
            });
        });

        // Pasar a la siguiente pregunta
        siguiente.onclick = () => this.procesarRespuesta();
    }

    procesarRespuesta() {
        // Hasta que no se seleccione una respuesta está deshabilitado
        document.querySelector('main article button').disabled = true;

        const seleccion = document.querySelector('input:checked');
        this.respuestasUsuario.push(parseInt(seleccion.value)); // Guardar respuesta seleccionada

        if (parseInt(seleccion.value) === 0) // La correcta siempre es la primera
            this.puntuacion++;

        this.index++;
        if (this.index >= this.preguntas.length) 
            this.finJuego();
        else 
            this.mostrarPregunta();
    }

    finJuego() {
        const article = document.querySelector('main article');

        let mensaje = '';
        if(this.puntuacion < 5)
            mensaje = '¡Vaya! Has perdido.';
        else
            mensaje = '¡Felicidades! Has ganado.'

        // Puntuación
        article.innerHTML = `<h3>${mensaje} Tu puntuación es: ${this.puntuacion}/${this.preguntas.length}.</h3>`;

        // Preguntas corregidas
        article.innerHTML += this.revision();

        // Jugar de nuevo
        article.innerHTML += "<button>Jugar de nuevo</button>"
        article.querySelector('button').onclick = () => {
            new Juego();
        };
    }

    revision() {
        let resumen = '<details><summary>Ver respuestas</summary><ul>';
        for (let i = 0; i < this.preguntas.length; i++) {
            const pregunta = this.preguntas[i];
            const opciones = this.respuestas[i];
            const correcta = opciones[0];
            const elegida = opciones[this.respuestasUsuario[i]];
            const esCorrecta = this.respuestasUsuario[i] === 0;

            resumen += `<li>${i+1}. ${pregunta}<ul>`;
            if(esCorrecta)
                resumen += `<li>Tu respuesta: ${elegida} (Correcta)</li>`;
            else {
                resumen += `<li>Tu respuesta: ${elegida} (Incorrecta)</li>
                            <li>Respuesta correcta: ${correcta}</li>`;
            }
            resumen += `</ul></li>`;
        }
        resumen += '</ul></details>';
        return resumen;
    }
}