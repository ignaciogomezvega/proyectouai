// ---------------------- CARRITO (FUNCIONES GLOBALES) ----------------------
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarProducto(nombre, precio) {
    const carrito = obtenerCarrito();
    carrito.push({ nombre, precio });
    guardarCarrito(carrito);
    alert("SE AGREGO PRODUCTO A LA LISTA DE COMPRA. Diríjase a CONTACTO para terminar con el pedido.");
    // Si la página tiene el contenedor del carrito visible, actualizamos la vista
    if (document.getElementById('lista-carrito')) mostrarCarrito();
}

function eliminarProducto(indice) {
    const carrito = obtenerCarrito();
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
}

// Aseguramos que la función sea accesible si el HTML usa onclick inline
window.eliminarProducto = eliminarProducto;

function mostrarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    if (!contenedor) return;

    const carrito = obtenerCarrito();
    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>No hay productos en la lista.</p>';
        return;
    }

    const ul = document.createElement('ul');
    carrito.forEach((p, i) => {
        const li = document.createElement('li');
        // Escapamos texto mínimamente para evitar inyecciones si el nombre viene de una fuente desconocida
        const nombreSafe = String(p.nombre).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        li.innerHTML = `${nombreSafe} - $${Number(p.precio).toLocaleString()} <button class="btn-eliminar" data-indice="${i}">❌</button>`;
        ul.appendChild(li);
    });
    contenedor.appendChild(ul);

    const total = carrito.reduce((acc, p) => acc + Number(p.precio), 0);
    const totalP = document.createElement('p');
    totalP.innerHTML = `<strong>Total: $${total.toLocaleString()}</strong>`;
    contenedor.appendChild(totalP);

    // Delegación para botones eliminar (en lugar de onclick inline)
    ul.addEventListener('click', (e) => {
        if (e.target && e.target.matches('button.btn-eliminar')) {
            const idx = Number(e.target.getAttribute('data-indice'));
            eliminarProducto(idx);
        }
    }, { once: false });
}

// ---------------------- DOMContentLoaded: FILTRO + BOTONES COMPRA + FORM ----------------------
document.addEventListener("DOMContentLoaded", () => {
    // --- filtro de categorías ---
    const botonesCategorias = document.querySelectorAll(".categorias button");
    const productos = document.querySelectorAll(".producto");

    console.log("script.js cargado. botonesCategorias:", botonesCategorias.length, "productos:", productos.length);

    if (botonesCategorias.length > 0 && productos.length > 0) {
        botonesCategorias.forEach(boton => {
            boton.addEventListener("click", () => {
                // Quita la clase activa de todos
                botonesCategorias.forEach(b => b.classList.remove("activo"));
                boton.classList.add("activo");

                const categoriaSeleccionada = boton.getAttribute("data-categoria");
                console.log("Filtrando por categoría:", categoriaSeleccionada);

                productos.forEach(producto => {
                    const categoriaProducto = producto.getAttribute("data-categoria") || "";
                    if (categoriaSeleccionada === "todos" || categoriaProducto === categoriaSeleccionada) {
                        producto.style.display = ""; // deja que el CSS determine el display (normalmente block/flex)
                    } else {
                        producto.style.display = "none";
                    }
                });
            });
        });
    } else {
        console.log("No se detectaron botones de categoría o productos (no se aplicará filtro).");
    }

    // --- botones de compra ---
    const botonesCompra = document.querySelectorAll('.boton-comprar');
    if (botonesCompra.length === 0) console.log("No se detectaron botones de compra (.boton-comprar).");

    botonesCompra.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const productoElem = e.target.closest('.producto');
            if (!productoElem) {
                console.warn("No se pudo encontrar el elemento .producto padre al hacer click en comprar.");
                return;
            }

            const nombreElem = productoElem.querySelector('h3');
            const nombre = nombreElem ? nombreElem.textContent.trim() : 'Producto';

            // Buscamos el párrafo que contenga "Precio" o el segundo p por defecto
            let precioTexto = '';
            const todosPs = productoElem.querySelectorAll('p');
            // buscar p que contenga "Precio" o que tenga un número
            for (let p of todosPs) {
                if (/precio/i.test(p.textContent) || /\$\d+/.test(p.textContent) || /\d{3,}/.test(p.textContent)) {
                    precioTexto = p.textContent;
                }
            }
            // si no encontramos nada, intentamos tomar el segundo <p>
            if (!precioTexto && todosPs[1]) precioTexto = todosPs[1].textContent;

            // Extraer número del texto (acepta puntos y comas)
            const precioNumero = parseFloat(
                (precioTexto || '')
                    .replace(/\./g, '')    // quitar separadores de miles
                    .replace(/,/g, '.')    // comas decimales => punto
                    .replace(/[^\d.]/g, '') // quitar todo lo que no sea dígito o punto
            );

            const precio = isNaN(precioNumero) ? 0 : precioNumero;

            agregarProducto(nombre, precio);
        });
    });

    // --- mostrar carrito si estamos en la página de contacto ---
    if (document.getElementById('lista-carrito')) {
        mostrarCarrito();
    }

    // --- envío del formulario en contacto ---
    const form = document.getElementById('form-contacto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreInput = document.getElementById('nombre');
            const carrito = obtenerCarrito();

            if (carrito.length === 0) {
                alert("No has agregado productos a tu lista de compra.");
                return;
            }

            const listaProductos = carrito.map(p => `- ${p.nombre} ($${Number(p.precio).toLocaleString()})`).join('\n');
            const total = carrito.reduce((acc, p) => acc + Number(p.precio), 0);

            alert(`¡Gracias ${nombreInput.value}! Tu mensaje fue enviado correctamente.\n\nProductos seleccionados:\n${listaProductos}\n\nCOSTO TOTAL: $${total.toLocaleString()}`);

            form.reset();
            localStorage.removeItem('carrito');
            mostrarCarrito();
        });
    }
});
