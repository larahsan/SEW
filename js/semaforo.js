class Semaforo
{
    levels = [0.2, 0.5, 0.8]; // Dificultad
    lights = 4; // Número de luces del semáforo
    unload_moment = null; // Momento en que se inicia la secuencia de apagado
    click_moment = null; // Momento en el que el usuario hace click

    constructor()
    {
        var index = Math.floor(Math.random() * this.levels.length);
        this.difficulty = this.levels[index];
        this.createStructure();
    }

    createStructure()
    {
        var main = document.querySelector('main');

        const title = document.createElement('h2');
        title.textContent = 'Semáforo';
        main.appendChild(title);

        const lightContainer = document.createElement('div');
        main.appendChild(lightContainer);

        for(var i = 0; i<this.lights; i++)
        {
            const light = document.createElement('div');
            light.classList.add('light');
            lightContainer.appendChild(light);
        }

        const buttonContainer = document.createElement('section');
        main.appendChild(buttonContainer);

        const buttonUnload = document.createElement('button');
        buttonUnload.textContent = 'Arranque';
        buttonUnload.onclick = this.initSequence.bind(buttonUnload, this);
        buttonContainer.appendChild(buttonUnload);
        
        const buttonClick = document.createElement('button');
        buttonClick.textContent = 'Reacción';
        buttonClick.onclick = this.stopReaction.bind(buttonClick, this);
        buttonClick.disabled = true;
        buttonContainer.appendChild(buttonClick);
    }

    initSequence(semaforo)
    {
        var main = document.querySelector('main');
        main.classList.add('load');
        this.disabled = true;

        setTimeout(() =>
        {
            semaforo.unload_moment = new Date();
            semaforo.endSequence();
        }, 2000+semaforo.difficulty*100);
    }

    endSequence()
    {
        var main = document.querySelector('main');
        main.classList.add('unload');

        var buttonClick = document.querySelector('main section').children[1];
        buttonClick.disabled = false;
    }

    stopReaction(semaforo)
    {
        semaforo.click_moment = new Date();
        var reactionTime = semaforo.click_moment - semaforo.unload_moment;
        var reactionTimeRounded = (reactionTime / 1000).toFixed(3);
        var main = document.querySelector('main');

        const parrafo = document.createElement('p');
        parrafo.textContent = 'Tiempo de reacción: ' + reactionTimeRounded + 's';
        main.appendChild(parrafo);
        
        main.classList.remove('load', 'unload');

        var buttonUnload = document.querySelector('main section').children[0];
        buttonUnload.disabled = false;
        this.disabled = true; // Button click
    }
}