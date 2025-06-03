class Index {
    crearCarrusel()
    {
        const imagenes = $("img");
        const nextButton = $("article button").eq(0);
        const prevButton = $("article button").eq(1);

        var current = 0;
        var max = imagenes.length - 1;

        function actualizarPosiciones()
        {
            imagenes.each((index, img) => 
            {
                var trans = 100 * (index - current)
                $(img).css("transform", "translateX(" + trans + "%)")
            });
        }

        actualizarPosiciones();

        nextButton.on("click", function () 
        {
            current === max ? current = 0 : current++;
            actualizarPosiciones();
        });

        prevButton.on("click", function () 
        {
            current === 0 ? current = max : current--;
            actualizarPosiciones();
        });
    }
}