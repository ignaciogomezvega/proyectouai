// ==== CARRITO ====

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
    alert("✅ SE AGREGÓ EL PRODUCTO A LA LISTA DE COMPRA.\nDiríjase a CONTACTO para terminar con el pedido.");
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
        li.innerHTML = `${p.nombre} - $${p.precio.toLocaleString()} 
            <button onclick="eliminarProducto(${i})">❌</button>`;
        ul.appendChild(li);
    });
    contenedor.appendChild(ul);

    const total = carrito.reduce((acc, p) => acc + p.precio, 0);
    const totalP = document.createElement('p');
    totalP.innerHTML = `<strong>Total: $${total.toLocaleString()}</strong>`;
    contenedor.appendChild(totalP);
}

// ==== FILTRO DE PRODUCTOS ====

function filtrarProductos() {
    const input = document.getElementById('filtro-productos');
    if (!input) return;
    const filtro = input.value.toLowerCase();

    const productos = document.querySelectorAll('.producto');
    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        producto.style.display = nombre.includes(filtro) ? 'block' : 'none';
    });
}

// ==== EVENTOS ====

document.addEventListener('DOMContentLoaded', () => {

    // Mostrar carrito si existe la sección
    if (document.getElementById('lista-carrito')) {
        mostrarCarrito();
    }

    // Delegar evento de "comprar"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('boton-comprar')) {
            e.preventDefault();
            const producto = e.target.closest('.producto');
            const nombre = producto.querySelector('h3').textContent;
            const precioTexto = producto.querySelector('p:nth-of-type(2)').textContent;
            const precio = parseFloat(precioTexto.replace(/[^0-9]/g, ''));
            agregarProducto(nombre, precio);
        }
    });

    // Evento para el filtro
    const filtroInput = document.getElementById('filtro-productos');
    if (filtroInput) {
        filtroInput.addEventListener('input', filtrarProductos);
    }

    // Evento de formulario (CONTACTO)
    const form = document.getElementById('form-contacto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre');
            const carrito = obtenerCarrito();

            if (carrito.length === 0) {
                alert("❌ No has agregado productos a tu lista de compra.");
                return;
            }

            const listaProductos = carrito.map(p => `- ${p.nombre} ($${p.precio.toLocaleString()})`).join('\n');
            const total = carrito.reduce((acc, p) => acc + p.precio, 0);

            alert(`¡Gracias ${nombre.value}! Tu mensaje fue enviado correctamente.\n\n🛒 Productos seleccionados:\n${listaProductos}\n\n💰 COSTO TOTAL: $${total.toLocaleString()}`);

            form.reset();
            localStorage.removeItem('carrito');
            mostrarCarrito();
        });
    }
});
