// === FUNCIONES DEL CARRITO ===
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
    alert("✅ Se agregó el producto a la lista de compra.\n Vaya a CONTACTO para finalizar el pedido.");
}

function eliminarProducto(indice) {
    const carrito = obtenerCarrito();
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
}

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
        li.innerHTML = `${p.nombre} - $${p.precio.toLocaleString()} <button onclick="eliminarProducto(${i})">❌</button>`;
        ul.appendChild(li);
    });
    contenedor.appendChild(ul);

    const total = carrito.reduce((acc, p) => acc + p.precio, 0);
    const totalP = document.createElement('p');
    totalP.innerHTML = `<strong>Total: $${total.toLocaleString()}</strong>`;
    contenedor.appendChild(totalP);
}

// === FILTRO DE CATEGORÍAS ===
document.addEventListener("DOMContentLoaded", () => {
    const botonesCategorias = document.querySelectorAll(".categorias button");
    const productos = document.querySelectorAll(".producto");

    // Filtro de categorías
    if (botonesCategorias.length > 0) {
        botonesCategorias.forEach(boton => {
            boton.addEventListener("click", () => {
                // Quita la clase activa de todos
                botonesCategorias.forEach(b => b.classList.remove("activo"));
                boton.classList.add("activo");

                const categoriaSeleccionada = boton.getAttribute("data-categoria");

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
    }

    // Botones de compra
    const botonesCompra = document.querySelectorAll('.boton-comprar');
    botonesCompra.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const producto = e.target.closest('.producto');
            const nombre = producto.querySelector('h3').textContent;
            const precioTexto = producto.querySelector('p:nth-of-type(2)').textContent;
            const precio = parseFloat(precioTexto.replace(/[^0-9]/g, ''));
            agregarProducto(nombre, precio);
        });
    });

    // Mostrar carrito (si hay contenedor)
    if (document.getElementById('lista-carrito')) {
        mostrarCarrito();
    }

    // Envío de formulario (CONTACTO)
    const form = document.getElementById('form-contacto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre');
            const carrito = obtenerCarrito();

            if (carrito.length === 0) {
                alert("No has agregado productos a tu lista de compra.");
                return;
            }

            const listaProductos = carrito.map(p => `- ${p.nombre} ($${p.precio.toLocaleString()})`).join('\n');
            const total = carrito.reduce((acc, p) => acc + p.precio, 0);

            alert(`¡Gracias ${nombre.value}! Tu mensaje fue enviado correctamente.\n\nProductos seleccionados:\n${listaProductos}\n\nCOSTO TOTAL: $${total.toLocaleString()}`);

            form.reset();
            localStorage.removeItem('carrito');
            mostrarCarrito();
        });
    }
});
