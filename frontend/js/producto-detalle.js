// Página producto.html: lee ?codigo= de la URL, busca ese producto en el
// catálogo y pinta su detalle con el formulario para agregarlo al carrito.
//
// Depende de: productos.js (buscarPorCodigo) y carrito.js (agregarProducto).

// TODO: pintar el detalle del producto dentro de #detalle-producto.
//   - imagen, nombre, precio + unidad, origen, descripción, stock
//   - formulario con un input de cantidad (min 1, max MAX_UNIDADES)
function renderizarDetalle(producto) {}

// TODO: mostrar un mensaje claro cuando el código no existe o falta.
function mostrarProductoNoEncontrado(mensaje) {}

// Punto de entrada de esta página.
async function iniciarDetalleProducto() {
  const contenedor = document.getElementById("detalle-producto");
  if (!contenedor) return;

  // TODO: leer el parámetro "codigo" con new URLSearchParams(location.search)
  // TODO: si no viene el código -> mostrarProductoNoEncontrado()
  // TODO: const producto = await buscarPorCodigo(codigo)
  // TODO: si es null -> mostrarProductoNoEncontrado(), si no -> renderizarDetalle()
  // TODO: al enviar el formulario (submit), llamar a agregarProducto() con la
  //       cantidad elegida, hacer preventDefault() y actualizar el contador
}

document.addEventListener("DOMContentLoaded", iniciarDetalleProducto);
