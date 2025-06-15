class Reservas{
    mostrarFormulario(tipo) {
        // Limpiar main en caso de que ya tenga un formulario
        const main = document.querySelector("main");
        main.innerHTML = "";
        
        // Modificar el título en caso de que haya cambiado
        document.querySelector("body > h2").textContent = "Reserva en Teverga";

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
        const mensajeError = document.querySelector('form p');

        const datos = new FormData(formulario);

        const res = await fetch("php/usuarios.php", {
            method: "POST",
            body: datos
        });

        const mensajeRecibido = await res.text();

        if (mensajeRecibido.trim() == "OK") 
            this.mostrarInicio();
        else {
            mensajeError.hidden = false;
            mensajeError.textContent = mensajeRecibido;
        }
    }

    mostrarInicio() {
        document.querySelector("body > h2").textContent = `Hola, ¿qué deseas hacer?`;
        document.querySelector("body > p").textContent = "Estás en: Inicio > Reservas";

        const articulo = document.createElement("article");
        articulo.innerHTML = '<h3>MENÚ</h3>';

        const button1 = document.createElement('button');
        button1.textContent = "Consultar/Anular reservas";
        button1.onclick = () => this.cargarReservas();
        articulo.appendChild(button1);

        const button2 = document.createElement('button');
        button2.textContent = "Realizar reserva";
        button2.onclick = () => this.mostrarRecursos();
        articulo.appendChild(button2);

        const button3 = document.createElement('button');
        button3.textContent = "Gestionar mi cuenta";
        button3.onclick = () => this.gestionarCuenta();
        articulo.appendChild(button3);

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

        // Actualizar las migas
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
                    <li>Fecha inicio: ${r.fecha_inicio}</li>
                    <li>Fecha fin: ${r.fecha_fin}</li>
                    <li>Plazas: ${r.plazas}</li>
                    <li>Precio: ${r.precio}€</li>
                </ul>
            `;

            const button = document.createElement("button");
            button.textContent = "Seleccionar";
            button.onclick = () => this.seleccionarRecurso(r);
            articulo.appendChild(button);
            section.appendChild(articulo);
        });
    }

    async seleccionarRecurso(recurso) {
        document.querySelector("body > h2").textContent = `Recurso seleccionado: ${recurso.nombre}`;

        const respuesta = await fetch(`php/horarios.php?id_recurso=${recurso.id_recurso}&modo=horarios`);
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
                <input type="date" name="fecha" min="${recurso.fecha_inicio}" max="${recurso.fecha_fin}" required/>
            `;
        form.appendChild(labelFecha);
        
        // Horario
        const label = document.createElement("label");
        label.textContent = 'Horarios disponibles: ';

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

        // Plazas disponibles
        const pDisponibles = document.createElement('p');
        pDisponibles.innerHTML = `Plazas disponibles: seleccione fecha y horario`;
        form.appendChild(pDisponibles);

        // Por si no hay plazas disponibles
        const p = document.createElement("p");
        p.textContent = "No hay plazas disponibles para este horario.";

        async function mostrarPlazas() {
            const fechaSeleccionada = form.fecha.value;
            const indexSeleccionado = form.horario.selectedIndex - 1; // -1 porque la primera opción es la vacía

            // Fecha y horario deben haber sido seleccionados
            if (!fechaSeleccionada || indexSeleccionado < 0) return;
            
            const horarioSeleccionado = horarios[indexSeleccionado].id_horario;
            const plazasDisponibles = await fetch(`php/horarios.php?fecha=${fechaSeleccionada}&id_horario=${horarioSeleccionado}&modo=plazas`);
            const res = await plazasDisponibles.json();

            pDisponibles.innerHTML = `Plazas disponibles: ${res}`;

            if (res == 0) { // No hay plazas
                if (!form.contains(p)) 
                    form.appendChild(p);
                form.querySelector("button").disabled = true;
            }
            else { // Hay plazas
                if (form.contains(p)) 
                    form.removeChild(p);
                form.querySelector("button").disabled = false;
            }  
        }

        form.fecha.addEventListener("change", mostrarPlazas);
        form.horario.addEventListener("change", mostrarPlazas);

        // Número de personas
        const labelPlazas = document.createElement('label');
        labelPlazas.innerHTML = `
                Número de personas:
                <input type="number" name="plazas" value="1" min="1" max="${recurso.plazas}" required/>
            `;
        form.appendChild(labelPlazas);

        // Presupuesto
        const labelPresupuesto = document.createElement('label');
        labelPresupuesto.innerHTML = `
                Presupuesto:
                <input type="text" name="presupuesto" value="${recurso.precio}€" readonly/>
            `;
        form.appendChild(labelPresupuesto);

        form.plazas.addEventListener("input", () => {
            const n = parseInt(form.plazas.value);
            const total = isNaN(n) ? 0 : n * parseFloat(recurso.precio);
            form.presupuesto.value = `${total.toFixed(2)}€`;
        });

        // Para finalizar la reserva
        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "Reservar";
        form.appendChild(submit);

        // Para cancelar la reserva
        const cancelar = document.createElement("article");
        const h4 = document.createElement("h4");
        h4.textContent = "¿Has cambiado de opinión?";
        const buttonCancelar = document.createElement("button");
        buttonCancelar.textContent = "Cancelar reserva";
        buttonCancelar.onclick = () => this.mostrarInicio();
        cancelar.appendChild(h4);
        cancelar.appendChild(buttonCancelar);

        const main = document.querySelector("main");
        main.innerHTML = '';
        main.appendChild(articulo);
        main.appendChild(cancelar);

        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const personas = parseInt(form.plazas.value);
            const horario = horarios[form.horario.value];
            const presupuesto = parseFloat(form.presupuesto.value);
            const fecha = form.fecha.value;

            if(window.confirm("La reserva se guardará. ¿Desea continuar?"))
                this.añadirReserva(recurso, personas, horario, presupuesto, fecha);
        };
    }

    async añadirReserva(recurso, personas, horario, presupuesto, fecha) {

        const datos = new FormData();
        datos.append("id_horario", horario.id_horario);
        datos.append("presupuesto", presupuesto);
        datos.append("personas", personas);
        datos.append("fecha", fecha)
        datos.append("id_recurso", recurso.id_recurso);
        datos.append("accion", "añadir");

        await fetch("php/reservas.php", {
            method: "POST",
            body: datos
        });

        this.finalizarReserva(recurso.nombre, horario, personas, presupuesto, fecha);
    }

    finalizarReserva(nombre, horario, personas, presupuesto, fecha) {
        document.querySelector("body > h2").textContent = `¡Hecho!`;

        const articulo = document.createElement('article');
        articulo.innerHTML = `
            <h3>Reserva realizada con éxito</h3>
            <ul>
                <li>Recurso reservado: ${nombre}</li>
                <li>Fecha: ${fecha}</li>
                <li>Horario: ${horario.hora_inicio} - ${horario.hora_fin}</li>
                <li>Número de personas: ${personas}</li>
                <li>Presupuesto: ${presupuesto}€</li>
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
            
        // Actualizar las migas
        document.querySelector("body > p").textContent = "Estás en: Inicio > Reservas > Consultar/anular reserva";

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = "Mis reservas:";
        section.appendChild(sectionTitle);

        if(reservas.length===0) {
            const article = document.createElement("article");
            article.innerHTML = `<h3>¡Vaya! Aún no hay reservas.</h3>`
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
                            <li>Presupuesto: ${r.presupuesto}€</li>
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

    async anularReserva(reserva) {
        const datos = new FormData();
        datos.append("accion", "anular");
        datos.append("id_reserva", reserva.id_reserva);
        datos.append("personas", reserva.personas);
        datos.append("fecha", reserva.fecha);
        datos.append("id_recurso", reserva.id_recurso);

        await fetch("php/reservas.php", {
            method: "POST",
            body: datos
        });

        this.cargarReservas(); // Recargar las reservas
    }

    gestionarCuenta() {
        document.querySelector("body > p").textContent = "Estás en: Inicio > Reservas > Gestionar mi cuenta";
        const main = document.querySelector("main")

        let section = main.querySelector("section");
        if(section==null) {
            section = document.createElement("section");
            main.appendChild(section);
        }
        else
            section.innerHTML = '';

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = "Mi cuenta";
        section.appendChild(sectionTitle);
        
        const articulo = document.createElement("article");
        articulo.innerHTML = '<h3>¿Deseas cancelar tu cuenta?</h3>';

        const button = document.createElement("button");
        button.textContent = "Eliminar cuenta";
        button.onclick = async () => {
            const res = await fetch("php/reservas.php");
            const reservas = await res.json();
            
            if(reservas.length > 0) // La cuenta no se puede eliminar si hay reservas hechas
                window.alert("Anule sus reservas antes de eliminar su cuenta.");
            else {
                if(window.confirm("Su cuenta se eliminará. ¿Desea continuar?")) {
                    await fetch("php/usuarios.php");
                    this.mostrarFormulario("registro");
                }
            }
        };
        articulo.appendChild(button);
        section.appendChild(articulo);
    }
}