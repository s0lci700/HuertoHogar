// Página carrito.html: pinta los items guardados, permite cambiar cantidades
// o quitar items, y muestra el total.

const lista = document.getElementById("lista-carrito");

// Depende de: carrito.js (obtenerCarrito, actualizarCantidad, quitarProducto,
// calcularTotal, vaciarCarrito) y layout.js (formatearPrecio).
function crearFilaCarrito(item) {
  let subtotal = item.precio * item.cantidad;
  const li = document.createElement("li");
  li.className = "carrito-item";
  li.innerHTML = `
    <span>${item.nombre}</span>
    <span>${formatearPrecio(item.precio)}</span>
    <span>${item.cantidad}</span>
    <span>${formatearPrecio(subtotal)}</span>
    <button data-codigo="${item.codigo}" data-qty="+"> + </button>
    <button data-codigo="${item.codigo}" data-qty="-"> - </button>
    <button data-codigo="${item.codigo}">Quitar</button>
  `;
  return li;
}

function renderizarCarrito() {
  lista.innerHTML = "";

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    document.getElementById("carrito-vacio").style.display = "block";
    document.getElementById("resumen-carrito").style.display = "none";
    return;
  }
  const header = document.createElement("li");
  header.className = "carrito-header";
  header.innerHTML = `
    <span>Producto</span>
    <span>Precio</span>
    <span>Cantidad</span>
    <span>Subtotal</span>
    <span>Acciones</span>
  `;
  lista.appendChild(header);
  carrito.forEach((item) => {
    lista.appendChild(crearFilaCarrito(item));
  });
  document.getElementById("carrito-vacio").style.display = "none";
  document.getElementById("resumen-carrito").style.display = "block";
  document.getElementById("total-carrito").textContent = formatearPrecio(calcularTotal(carrito));
}

function engancharAccionesCarrito() {
  lista.addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-codigo]");
    if (!boton) return;                       // clic en el <span>, ignorar
    const codigo = boton.getAttribute("data-codigo");
    const signo  = boton.getAttribute("data-qty"); // "+" , "-" o null (= Quitar)

    const carrito = obtenerCarrito();
    let producto = carrito.find((item) => item.codigo === codigo);
    if (!producto) {
      return;
    }
    let cantidad = producto.cantidad;

    if (signo === "+") {
      actualizarCantidad(codigo, cantidad + 1);
    } else if (signo === "-") {
      actualizarCantidad(codigo, cantidad - 1);
    } else {
      quitarProducto(codigo);
    }
      renderizarCarrito();
      actualizarBadgeCarrito();
    });
}

// vaciarCarrito() solo toca localStorage (carrito.js no dibuja nada), así que
// el repintado tiene que pedirse acá.
function engancharBotonVaciar() {
  const boton = document.getElementById("btn-vaciar");
  if (!boton) return;

  boton.addEventListener("click", () => {
    vaciarCarrito();
    renderizarCarrito();
    actualizarBadgeCarrito();
  });
}

// Punto de entrada de esta página.
function iniciarVistaCarrito() {
  if (!lista) return;

  renderizarCarrito();
  actualizarBadgeCarrito();
  engancharAccionesCarrito();
  engancharBotonVaciar();
}

document.addEventListener("DOMContentLoaded", iniciarVistaCarrito);
