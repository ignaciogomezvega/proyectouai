// ----- FORMULARIO DE CONTACTO -----
const form = document.getElementById("form-contacto");
if (form) {
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        if (nombre.value.trim() === "" || email.value.trim() === "" || mensaje.value.trim() === "") {
            alert("Por favor, completá todos los campos.");
            return;
        }

        const emailValido = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailValido.test(email.value)) {
            alert("Por favor, ingresá un correo electrónico válido.");
            email.focus();
            return;
        }

        alert(`¡Gracias ${nombre.value}! Tu mensaje fue enviado correctamente.`);
        form.reset();
    });
}

// ----- FILTRO DE CATEGORÍAS -----
const botones = document.querySelectorAll(".categorias button");
const productos = document.querySelectorAll(".producto");

if (botones.length > 0) {
    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const categoria = boton.dataset.categoria;

            // Sacar clase activo de todos y marcar el actual
            botones.forEach(b => b.classList.remove("activo"));
            boton.classList.add("activo");

            // Mostrar/ocultar productos
            productos.forEach(prod => {
                if (categoria === "todos" || prod.dataset.categoria === categoria) {
                    prod.style.display = "block";
                } else {
                    prod.style.display = "none";
                }
            });
        });
    });
}
