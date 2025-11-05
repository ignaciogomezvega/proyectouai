// === FUNCIONALIDAD DE CARRITO ===

// Agregar productos al carrito
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("boton-comprar")) {
    const nombre = e.target.dataset.nombre;
    const precio = parseFloat(e.target.dataset.precio);
    agregarAlCarrito(nombre, precio);
    alert(`${nombre} fue agregado al carrito 🛒`);
  }
});

function agregarAlCarrito(nombre, precio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push({ nombre, precio });
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// === MOSTRAR CARRITO EN carrito.html ===
if (document.getElementById("lista-carrito")) {
  mostrarCarrito();
}

function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalEl = document.getElementById("total");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalEl.textContent = "";
    return;
  }

  let total = 0;

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.innerHTML = `
      <span>${item.nombre} - $${item.precio.toLocaleString()}</span>
      <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
    `;
    lista.appendChild(div);
    total += item.precio;
  });

  totalEl.textContent = `Total: $${total.toLocaleString()}`;
}

function eliminarDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// === FINALIZAR COMPRA ===
const formCompra = document.getElementById("form-compra");
if (formCompra) {
  formCompra.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;

    alert(`¡Gracias ${nombre}! Tu compra fue enviada y pronto se contactarán contigo vía mail para finalizar la compra y entrega.`);
    
    formCompra.reset();
    localStorage.removeItem("carrito");
    mostrarCarrito();
  });
}
