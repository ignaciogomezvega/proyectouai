document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".categorias button");
    const productos = document.querySelectorAll(".producto");

    console.log("Filtro cargado correctamente. Botones detectados:", botones.length);

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            // Quita la clase activa de todos los botones
            botones.forEach(b => b.classList.remove("activo"));
            boton.classList.add("activo");

            const categoriaSeleccionada = boton.getAttribute("data-categoria");
            console.log("Categoría seleccionada:", categoriaSeleccionada);

            productos.forEach(producto => {
                const categoriaProducto = producto.getAttribute("data-categoria");

                if (categoriaSeleccionada === "todos" || categoriaProducto === categoriaSeleccionada) {
                    producto.style.display = "block";
                } else {
                    producto.style.display = "none";
                }
            });
        });
    });
});
