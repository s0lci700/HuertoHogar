// Página carrito.html: pinta los items guardados, permite cambiar cantidades
// o quitar items, y muestra el total.

const lista = document.getElementById("lista-carrito");

function formatearPrecio(valor) {
  if (valor === null) {
    return "Precio a confirmar";
  }
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(valor);
}
//
// Depende de: carrito.js (obtenerCarrito, actualizarCantidad, quitarProducto,
// calcularTotal, vaciarCarrito).
// TODO: construir y devolver el <li class="carrito-item"> de un item.
//   - nombre, precio unitario, cantidad, subtotal (precio * cantidad)
//   - input o botones +/- con data-codigo="${item.codigo}"
//   - botón "Quitar" con data-codigo
// TODO (bug pendiente): los botones qty no tienen data-codigo, así que
// engancharAccionesCarrito() no puede saber a qué producto pertenecen cuando
// se hace clic en ellos. Agregar data-codigo="${item.codigo}" a los dos
// botones + y -, igual que ya tiene el botón "Quitar".
function crearFilaCarrito(item) {
  let subtotal = item.precio * item.cantidad;
  const li = document.createElement("li");
  li.className = "carrito-item";
  li.innerHTML = `
    <span>${item.nombre}</span>
    <span>${formatearPrecio(item.precio)}</span>
    <span>${item.cantidad}</span>
    <span>${formatearPrecio(subtotal)}</span>
    <button qty="+"> + </button>
    <button qty="-"> - </button>
    <button data-codigo="${item.codigo}">Quitar</button>
  `;
  return li;
}

// TODO: leer obtenerCarrito() y pintar todo #lista-carrito.
//   - si el carrito está vacío, mostrar #carrito-vacio y ocultar el resumen
//   - pintar el total con calcularTotal()
//   - esta función se vuelve a llamar después de cada cambio
function renderizarCarrito() {
  lista.innerHTML = "";

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
  //document.getElementById("carrito-vacio").style.display = "none";
  //document.getElementById("resumen-carrito").style.display = "block";
  //document.getElementById("total-carrito").textContent = calcularTotal(carrito);
}

// TODO: un solo listener en #lista-carrito (delegación de eventos) para
// cambios de cantidad y para el botón de quitar.
//   - después de cada cambio: renderizarCarrito() y actualizarBadgeCarrito()
// TODO (bugs pendientes, revisar antes de dar por terminada):
//   - línea "let codigo = quitarBtn.getAttribute(...)": quitarBtn es null
//     cuando se hace clic en un botón qty (esos no tienen data-codigo todavía,
//     ver TODO en crearFilaCarrito) -> TypeError al hacer clic en + o -.
//     Leer el código desde el botón que realmente se clickeó, no siempre
//     desde quitarBtn.
//   - "let cantidad = producto.cantidad" se ejecuta ANTES del chequeo
//     "if (!producto)": si no se encuentra el producto, esto también revienta
//     antes de llegar al guard clause. El chequeo debería ir primero.
//   - falta un "else" entre las ramas "+" y "-" (líneas ~83-86): ahora mismo
//     actualizarCantidad(codigo, cantidad - 1) se ejecuta SIEMPRE después del
//     "+", así que un clic en "+" termina comportándose igual que un "-".
function engancharAccionesCarrito() {
  lista.addEventListener("click", (event) => {
    /* Boton Quitar */
    const quitarBtn = event.target.closest("[data-codigo]");
    const qtyBtn = event.target.closest("[qty]");
    if (quitarBtn || qtyBtn) {
      const carrito = obtenerCarrito();
      let codigo = quitarBtn.getAttribute("data-codigo");
      let producto = carrito.find((item) => item.codigo === codigo);
      let cantidad = producto.cantidad;
      if (!producto) {
        console.log("no existe el producto: " + codigo);
        return;
      }

      if (qtyBtn) {
        if (qtyBtn.getAttribute("qty") === "+") {
        actualizarCantidad(codigo, cantidad + 1);
      } 
        actualizarCantidad(codigo, cantidad - 1);
      } else {
      console.log("Quitando producto: " + codigo);
      console.log(producto);
      quitarProducto(codigo);
      }
      renderizarCarrito();
      actualizarBadgeCarrito();
    } return
  });
}

// Punto de entrada de esta página.
function iniciarVistaCarrito() {
  const lista = document.getElementById("lista-carrito");
  if (!lista) return;

  renderizarCarrito();
  actualizarBadgeCarrito();
  engancharAccionesCarrito();

  // TODO: engancharAccionesCarrito()
  // TODO: enganchar el botón "Vaciar carrito"
}

document.addEventListener("DOMContentLoaded", iniciarVistaCarrito);
