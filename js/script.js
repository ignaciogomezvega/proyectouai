// -------------------- FUNCIONES DEL CARRITO --------------------
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
    alert("SE AGREGO PRODUCTO A LA LISTA DE COMPRA. \n Diríjase a CONTACTO para terminar con el pedido. \n\n¡Muchas gracias!");
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

// -------------------- INICIALIZACIÓN GENERAL --------------------
document.addEventListener('DOMContentLoaded', () => {
    inicializarBotonesComprar();
    inicializarFiltroCategorias();

    if (document.getElementById('lista-carrito')) {
        mostrarCarrito();
    }

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

            alert(`¡Gracias ${nombre.value}! Tu mensaje fue enviado correctamente.\nTe contactaremos en breve\n\nProductos seleccionados:\n${listaProductos}\n\nCOSTO TOTAL: $${total.toLocaleString()}`);

            form.reset();
            localStorage.removeItem('carrito');
            mostrarCarrito();
        });
    }
});



function inicializarBotonesComprar() {
    const contenedor = document.querySelector('.contenedor-productos');
    if (!contenedor) return;

    
    contenedor.addEventListener('click', (e) => {
        const boton = e.target.closest('.boton-comprar');
        if (!boton) return; 

        e.preventDefault();
        const producto = boton.closest('.producto');
        const nombre = producto.querySelector('h3').textContent;
        const precioTexto = producto.querySelector('p:nth-of-type(2)').textContent;
        const precio = parseFloat(precioTexto.replace(/[^0-9]/g, ''));
        agregarProducto(nombre, precio);
    });
}





function inicializarFiltroCategorias() {
    const botonesFiltro = document.querySelectorAll('.categorias button');
    const productos = document.querySelectorAll('.producto');

    if (botonesFiltro.length === 0) return;

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            boton.classList.add('activo');

            const categoria = boton.getAttribute('data-categoria');

            productos.forEach(producto => {
                const categoriaProducto = producto.getAttribute('data-categoria');
                
                if (categoria === 'todos' || categoria === categoriaProducto) {
                    producto.style.display = 'block';
                } else {
                    producto.style.display = 'none';
                }
            });

            
        });
    });
}

