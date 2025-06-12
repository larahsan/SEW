class Reservas{
    mostrarFormulario(tipo) {
        // Limpiar main en caso de que ya tenga un formulario
        const main = document.querySelector("main");
        main.innerHTML = "";

        // Primer artículo (form)
        const articleForm = document.createElement("article");
        const titulo = document.createElement("h3");
        const form = document.createElement("form");
        const mensajeError = document.createElement("p");
        mensajeError.hidden = true;

        // Botón de enviar (en el primer artículo)
        const buttonNext = document.createElement("button");
        buttonNext.textContent = "Siguiente";
        buttonNext.type = "submit";

        // Segundo artículo (cambiar de form)
        const articleSwitch = document.createElement("article");
        const pregunta = document.createElement("h4");
        const botonSwitch = document.createElement("button");
        botonSwitch.type = "button";

        // Estructura del formulario según el tipo
        let htmlCampos = "";
        if (tipo === "registro") {
            titulo.textContent = "Registrarse";
            htmlCampos = `
                <label>
                    Nombre:
                    <input type="text" name="nombre" required/>
                </label>
                <label>
                    Email:
                    <input type="email" name="email" required/>
                </label>
                <label>
                    Contraseña:
                    <input type="password" name="contraseña" required/>
                </label>
            `;
            pregunta.textContent = "¿Ya tienes una cuenta?";
            botonSwitch.textContent = "Iniciar sesión";
            botonSwitch.onclick = () => this.mostrarFormulario("login");
        } 
        else {
            titulo.textContent = "Iniciar sesión";
            htmlCampos = `
                <label>
                    Email:
                    <input type="text" name="email" required/>
                </label>
                <label>
                    Contraseña:
                    <input type="password" name="contraseña" required/>
                </label>
            `;
            pregunta.textContent = "¿No tienes una cuenta?";
            botonSwitch.textContent = "Registrarse";
            botonSwitch.onclick = () => this.mostrarFormulario("registro");
        }

        // Añadir todos los elementos 

        form.innerHTML = htmlCampos;
        form.appendChild(mensajeError);
        form.appendChild(buttonNext);
        form.onsubmit = (e) => {
            e.preventDefault();
            this.mostrarErrores();
        };

        articleForm.appendChild(titulo);
        articleForm.appendChild(form);
        articleSwitch.appendChild(pregunta);
        articleSwitch.appendChild(botonSwitch);

        main.appendChild(articleForm);
        main.appendChild(articleSwitch);
    }

    async mostrarErrores() {
        const formulario = document.querySelector('form');
        const mensaje = document.querySelector('form p');

        const datos = new FormData(formulario);

        const res = await fetch("php/usuarios.php", {
            method: "POST",
            body: datos
        });

        const mensajeRecibido = await res.text();

        if (mensajeRecibido.trim() == "OK") 
            this.mostrarInicio();
        else {
            mensaje.hidden = false;
            mensaje.textContent = mensajeRecibido;
        }
    }

    mostrarInicio() {
        document.querySelector("body > h2").textContent = `Hola, ¿qué deseas hacer?`;
        document.querySelector("body > p").textContent = "Estás en: Inicio > Reservas";

        const articulo = document.createElement("article");
        articulo.innerHTML = '<h3>MENÚ</h3>';

        const button1 = document.createElement('button');
        button1.textContent = "Consultar/anular reservas";
        button1.onclick = () => this.cargarReservas();
        articulo.appendChild(button1);

        const button2 = document.createElement('button');
        button2.textContent = "Realizar reserva";
        button2.onclick = () => this.mostrarRecursos();
        articulo.appendChild(button2);

        const main = document.querySelector("main")
        main.innerHTML = '';
        main.appendChild(articulo);
    }

    async mostrarRecursos() {

        const respuesta = await fetch("php/recursos.php");
        const recursos = await respuesta.json();

        let section = document.querySelector("main section");
        if(section==null) {
            section = document.createElement("section");
            document.querySelector("main").appendChild(section);
        }
        else
            section.innerHTML = '';

        document.querySelector("body > p").textContent = "Estás en: Inicio > Reservas > Realizar reserva";
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = "Recursos turísticos disponibles:";
        section.appendChild(sectionTitle);

        recursos.forEach(r => {
            const articulo = document.createElement("article");
            articulo.innerHTML = `
                <h3>${r.nombre}</h3>
                <ul>
                    <li>${r.descripcion}</li>
                    <li>Tipo: ${r.nombre_tipo}</li>
                    <li>Fecha: ${r.fecha}</li>
                    <li>Plazas disponibles: ${r.plazas}</li>
                    <li>Precio: ${r.precio}€</li>
                </ul>
            `;

            if(r.plazas == 0) 
                articulo.innerHTML += `<p>NO QUEDAN PLAZAS DISPONIBLES</p>`;
            else {
                const button = document.createElement("button");
                button.textContent = "Seleccionar";
                button.onclick = () => this.seleccionarRecurso(r);
                articulo.appendChild(button);
            }

            section.appendChild(articulo);
        });
    }

    async seleccionarRecurso(r) {
        document.querySelector("body > h2").textContent = `Recurso seleccionado: ${r.nombre}`;

        const respuesta = await fetch(`php/horarios.php?id_recurso=${r.id_recurso}`);
        const horarios = await respuesta.json();

        const articulo = document.createElement('article');
        const form = document.createElement('form');
        const h3 = document.createElement('h3');
        h3.textContent = 'Completar reserva';
        articulo.appendChild(h3);
        articulo.appendChild(form);

        // Fecha
        const labelFecha = document.createElement('label');
        labelFecha.innerHTML = `
                Fecha:
                <input type="date" name="fecha" value="${r.fecha}" readonly>
            `;
        form.appendChild(labelFecha);
        
        // Horario
        const label = document.createElement("label");
        label.textContent = 'Horarios disponibles:';

        const select = document.createElement("select");
        select.name = "horario";
        select.required = true;

        // Opción inicial vacía
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.hidden = true;
        defaultOption.textContent = "Selecciona un horario";
        select.appendChild(defaultOption);

        horarios.forEach((h, i) => {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `${h.hora_inicio} - ${h.hora_fin}`;
            select.appendChild(option);
        });
        label.appendChild(select);
        form.appendChild(label);

        // Número de personas
        const labelPlazas = document.createElement('label');
        labelPlazas.innerHTML = `
                Número de personas:
                <input type="number" name="plazas" min="1" max="${r.plazas}" required>
            `;
        form.appendChild(labelPlazas);

        // Presupuesto
        const labelPresupuesto = document.createElement('label');
        labelPresupuesto.innerHTML = `
                Presupuesto final:
                <input type="text" name="presupuesto" value="0.00€" readonly>
            `;
        form.appendChild(labelPresupuesto);

        form.plazas.addEventListener("input", () => {
            const n = parseInt(form.plazas.value);
            const total = isNaN(n) ? 0 : n * parseFloat(r.precio);
            form.presupuesto.value = `${total.toFixed(2)}€`;
        });

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "Reservar";
        form.appendChild(submit);
        
        const main = document.querySelector("main");
        main.innerHTML = '';
        main.appendChild(articulo);

        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const personas = parseInt(form.plazas.value);
            const horario = horarios[form.horario.value];
            const presupuesto = parseFloat(form.presupuesto.value);

            if(window.confirm("La reserva se guardará. ¿Desea continuar?"))
                this.añadirReserva(r, personas, horario, presupuesto);
        };
    }

    async añadirReserva(r, personas, horario, presupuesto) {

        const datos = new FormData();
        datos.append("id_horario", horario.id_horario);
        datos.append("presupuesto", presupuesto);
        datos.append("personas", personas);
        datos.append("id_recurso", r.id_recurso);
        datos.append("accion", "añadir");

        await fetch("php/reservas.php", {
            method: "POST",
            body: datos
        });

        this.finalizarReserva(r.nombre, r.fecha, horario, personas, presupuesto);
    }

    finalizarReserva(nombre, fecha, horario, personas, presupuesto) {
        document.querySelector("body > h2").textContent = `¡Hecho!`;

        const articulo = document.createElement('article');
        articulo.innerHTML = `
            <h3>Reserva realizada con éxito</h3>
            <ul>
                <li>Recurso reservado: ${nombre}</li>
                <li>Fecha: ${fecha}</li>
                <li>Horario: ${horario.hora_inicio} - ${horario.hora_fin}</li>
                <li>Número de personas: ${personas}</li>
                <li>Precio final: ${presupuesto}€</li>
            </ul>
        `;

        const boton = document.createElement("button");
        boton.textContent = "Volver al inicio";
        boton.onclick = () => this.mostrarInicio();
        articulo.appendChild(boton);

        const main = document.querySelector("main");
        main.innerHTML = '';
        main.appendChild(articulo);
    }

    async cargarReservas() {
        const res = await fetch("php/reservas.php");
        const reservas = await res.json();
        
        let section = document.querySelector("main section");
        if(section==null) {
            section = document.createElement("section");
            document.querySelector("main").appendChild(section);
        }
        else 
            section.innerHTML = '';
            
        document.querySelector("body > p").textContent = "Estás en: Inicio > Reservas > Consultar/anular reserva";
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = "Mis reservas:";
        section.appendChild(sectionTitle);

        if(reservas.length===0) {
            const article = document.createElement("article");
            article.innerHTML = `<h4>¡Vaya! Aún no hay reservas.</h4>`
            section.appendChild(article);
        }
        else {
            reservas.forEach(r => {
                const art = document.createElement("article");
                art.innerHTML = `
                    <h3>${r.nombre}</h3>
                    <details>
                        <summary>Mostrar detalles</summary>
                        <ul>
                            <li>Fecha: ${r.fecha}</li>
                            <li>Horario: ${r.hora_inicio} - ${r.hora_fin}</li>
                            <li>Personas: ${r.personas}</li>
                            <li>Precio: ${r.presupuesto}€</li>
                        </ul>
                    </details>
                `;
                
                const boton = document.createElement("button");
                boton.textContent = "Anular reserva";
                boton.onclick = () => {
                    if(window.confirm("La reserva se anulará. ¿Desea continuar?"))
                        this.anularReserva(r);
                };

                art.appendChild(boton);
                section.appendChild(art);
            });
        }
    }

    async anularReserva(r) {
        const datos = new FormData();
        datos.append("accion", "anular");
        datos.append("id_reserva", r.id_reserva);
        datos.append("personas", r.personas);
        datos.append("id_recurso", r.id_recurso);

        await fetch("php/reservas.php", {
            method: "POST",
            body: datos
        });

        this.cargarReservas(); // Recargar las reservas
    }
}