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

  // La boleta corresponde al carrito que ya se confirmó: si el carrito cambia,
  // deja de ser válida. confirmarPedido() la vuelve a mostrar después.
  const comprobante = document.getElementById("comprobante");
  if (comprobante) comprobante.hidden = true;

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

// Dibuja la boleta del pedido recién confirmado dentro de #comprobante.
// El detalle se copia del pedido y no del carrito porque confirmarPedido() ya
// vació el carrito: si leyera de ahí, la boleta saldría en blanco.
function renderizarComprobante(pedido) {
  const contenedor = document.getElementById("comprobante");
  if (!contenedor) return;

  const fecha = new Date(pedido.fecha).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filas = pedido.items
    .map(
      (item) => `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.cantidad}</td>
          <td>${formatearPrecio(item.precio)}</td>
          <td>${formatearPrecio(item.precio * item.cantidad)}</td>
        </tr>`
    )
    .join("");

  contenedor.innerHTML = `
    <h2>¡Gracias por tu compra!</h2>
    <p class="comprobante-folio">Boleta <strong>${pedido.folio}</strong> — ${fecha}</p>

    <table class="comprobante-tabla">
      <caption class="visualmente-oculto">Detalle del pedido ${pedido.folio}</caption>
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Precio</th>
          <th scope="col">Subtotal</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
      <tfoot>
        <tr>
          <th scope="row" colspan="3">Total</th>
          <td>${formatearPrecio(pedido.total)}</td>
        </tr>
      </tfoot>
    </table>

    <p>Te avisaremos por correo cuando el pedido salga de la tienda más cercana
      a tu dirección de entrega.</p>
    <a class="btn" href="productos.html">Seguir comprando</a>
  `;
  contenedor.hidden = false;
  contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
}

// confirmarPedido() vive en carrito.js y solo toca localStorage, así que el
// repintado y la boleta se piden acá, igual que con vaciarCarrito().
function engancharBotonConfirmar() {
  const boton = document.getElementById("btn-confirmar");
  if (!boton) return;

  boton.addEventListener("click", () => {
    const pedido = confirmarPedido();
    if (!pedido) return;

    renderizarCarrito();
    actualizarBadgeCarrito();
    renderizarComprobante(pedido);
    document.getElementById("carrito-vacio").style.display = "none";
  });
}

// Punto de entrada de esta página.
function iniciarVistaCarrito() {
  if (!lista) return;

  renderizarCarrito();
  actualizarBadgeCarrito();
  engancharAccionesCarrito();
  engancharBotonVaciar();
  engancharBotonConfirmar();
}

document.addEventListener("DOMContentLoaded", iniciarVistaCarrito);
