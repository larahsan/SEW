class Memoria
{
    elements =
    [
        { element: "Redbull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
        { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
        { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
        { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
        { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
        { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" },
        
        { element: "Redbull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
        { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
        { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
        { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
        { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
        { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
    ]

    constructor()
    {
        this.hasFlippedCard = false; // Indica si ya hay una carta dada la vuelta
        this.lockBoard = false; // Indica si el tablero se encuentra bloqueado a la interacción del usuario
        this.firstCard = null; // Indica la primera carta a la que se ha dado la vuelta en esta interacción
        this.secondCard = null; // Indica la segunda carta a la que se ha dado la vuelta en esta interacción

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements()
    {
        for (let i = this.elements.length - 1; i > 0; i--) 
        {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards()
    {
        this.lockBoard = true;
        setTimeout(() =>
        {
            this.firstCard.dataset.state = "hidden";
            this.secondCard.dataset.state = "hidden";
            this.resetBoard();
        }, 1000);
    }

    resetBoard()
    {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    checkForMatch()
    {
        this.firstCard.dataset.element===this.secondCard.dataset.element 
        ? this.disableCards() : this.unflipCards();
    }

    disableCards()
    {
        this.firstCard.dataset.state = "revealed";
        this.secondCard.dataset.state = "revealed";
        this.resetBoard();
    }

    flipCard(game)
    {
        if(this.dataset.state=="revealed" || game.lockBoard || this===game.firstCard) return;
        this.dataset.state = "flip";

        if(!game.hasFlippedCard) // Primera carta
        {
            game.hasFlippedCard = true;
            game.firstCard = this;
        }
        else // Segunda carta
        {
            game.secondCard = this;
            game.checkForMatch();
        }
    }

    createElements()
    {
        var section = document.querySelector('main section');
       
        this.elements.forEach(({ element, source }) => 
        {
            var card = document.createElement('article');
            card.dataset.element = element;
            card.dataset.state = "hidden";

            const title = document.createElement('h3');
            title.textContent = 'Tarjeta de memoria';

            const img = document.createElement('img');
            img.src = source;
            img.alt = element;

            card.appendChild(title);
            card.appendChild(img);
            section.appendChild(card);
        });
    }

    addEventListeners()
    {
        var section = document.querySelector('main section');
        var cards = section.querySelectorAll('article');

        for(var card of cards)
            card.addEventListener('click', this.flipCard.bind(card, this));
    }
}