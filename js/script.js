// Seleccionamos elementos del DOM
const form = document.getElementById("form-contacto");
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const mensaje = document.getElementById("mensaje");

// Evento para validar el formulario
form.addEventListener("submit", function(event) {
    event.preventDefault(); // evita el envío real

    // Validación simple de campos vacíos
    if (nombre.value.trim() === "" || email.value.trim() === "" || mensaje.value.trim() === "") {
        alert("Por favor, completá todos los campos.");
        return;
    }

    // Validación básica de email
    const emailValido = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailValido.test(email.value)) {
        alert("Por favor, ingresá un correo electrónico válido.");
        email.focus();
        return;
    }

    // Si todo está bien
    alert(`¡Gracias ${nombre.value}! Tu mensaje fue enviado correctamente.`);
    form.reset();
});
