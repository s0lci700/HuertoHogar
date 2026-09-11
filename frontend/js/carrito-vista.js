// Página carrito.html: pinta los items guardados, permite cambiar cantidades
// o quitar items, y muestra el total.
//
// Depende de: carrito.js (obtenerCarrito, actualizarCantidad, quitarProducto,
// calcularTotal, vaciarCarrito).
// TODO: construir y devolver el <li class="carrito-item"> de un item.
//   - nombre, precio unitario, cantidad, subtotal (precio * cantidad)
//   - input o botones +/- con data-codigo="${item.codigo}"
//   - botón "Quitar" con data-codigo
function crearFilaCarrito(item) {
  const li = document.createElement("li");
  li.className = "carrito-item";
  li.innerHTML = `
    <span>${item.nombre}</span>
    <span>${formatearPrecio(item.precio)}</span>
    <span>${item.cantidad}</span>
    <span>${formatearPrecio(item.subtotal)}</span>
    <button data-codigo="${item.codigo}">Quitar</button>
  `;
  return li;
}

// TODO: leer obtenerCarrito() y pintar todo #lista-carrito.
//   - si el carrito está vacío, mostrar #carrito-vacio y ocultar el resumen
//   - pintar el total con calcularTotal()
//   - esta función se vuelve a llamar después de cada cambio
function renderizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    lista.innerHTML = "Carrito vacío";
    document.getElementById("carrito-vacio").style.display = "block";
    document.getElementById("resumen-carrito").style.display = "none";
    return;
  }
  carrito.forEach((item) => {
    lista.appendChild(crearFilaCarrito(item));
  });
  document.getElementById("carrito-vacio").style.display = "none";
  document.getElementById("resumen-carrito").style.display = "block";
  document.getElementById("total-carrito").textContent = calcularTotal(carrito);
}

// TODO: un solo listener en #lista-carrito (delegación de eventos) para
// cambios de cantidad y para el botón de quitar.
//   - después de cada cambio: renderizarCarrito() y actualizarBadgeCarrito()
function engancharAccionesCarrito() {}

// Punto de entrada de esta página.
function iniciarVistaCarrito() {
  const lista = document.getElementById("lista-carrito");
  if (!lista) return;

  renderizarCarrito();
  engancharAccionesCarrito();

  // TODO: renderizarCarrito()
  // TODO: engancharAccionesCarrito()
  // TODO: enganchar el botón "Vaciar carrito"
}

document.addEventListener("DOMContentLoaded", iniciarVistaCarrito);
