// Página producto.html: lee ?codigo= de la URL, busca ese producto en el
// catálogo y pinta su detalle con el formulario para agregarlo al carrito.
//
// Depende de: productos.js (buscarPorCodigo, nombreCategoria), carrito.js
// (agregarProducto, MAX_UNIDADES) y layout.js (formatearPrecio,
// actualizarBadgeCarrito).

// Pluraliza una unidad del catálogo. El plural va en la primera palabra y no
// al final: "bolsa de 500g" son "bolsas de 500g", no "bolsa de 500gs". El
// enunciado las nombra así ("80 bolsas", "50 frascos").
function pluralizarUnidad(unidad) {
  const palabras = unidad.split(" ");
  palabras[0] = palabras[0] + "s";
  return palabras.join(" ");
}

// Pinta el detalle del producto dentro de #detalle-producto.
// Muestra lo que pide el enunciado para el catálogo: precio, descripción,
// origen y disponibilidad.
function renderizarDetalle(producto, categoria) {
  const contenedor = document.getElementById("detalle-producto");

  // PO003 y PL001 no traen stock en el enunciado, igual que no traen precio.
  const sinStock = producto.stock === null;

  // El tope real es el menor entre la regla del taller (5 unidades) y el stock.
  // Hoy siempre gana MAX_UNIDADES porque el stock más bajo del catálogo es 50,
  // pero dejarlo calculado evita un carrito imposible si el stock baja. Sin
  // stock conocido no se calcula: Math.min(5, null) da 0 y el texto de ayuda
  // terminaba diciendo "Máximo 0 por compra".
  const maximo = sinStock ? MAX_UNIDADES : Math.min(MAX_UNIDADES, producto.stock);

  // Sin precio no se puede cobrar, así que el formulario se muestra desactivado
  // en vez de dejar agregar algo que sumaría 0 al total.
  const sinPrecio = producto.precio === null;

  contenedor.className = "detalle-producto";
  contenedor.innerHTML = `
    <div class="detalle-imagen">
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>

    <div class="detalle-info">
      <p class="detalle-categoria">${categoria}</p>
      <h1>${producto.nombre}</h1>
      <p class="detalle-precio">${formatearPrecio(producto.precio)}
        <span class="detalle-unidad">por ${producto.unidad}</span>
      </p>

      <p class="descripcion">${producto.descripcion}</p>

      <dl class="detalle-datos">
        <dt>Código</dt>
        <dd>${producto.codigo}</dd>
        <dt>Origen</dt>
        <dd>${producto.origen}</dd>
        <dt>Disponibilidad</dt>
        <dd>${
          sinStock
            ? "Por confirmar"
            : `${producto.stock} ${pluralizarUnidad(producto.unidad)} en stock`
        }</dd>
      </dl>

      <form class="form-agregar-carrito" id="form-agregar" novalidate>
        <div class="campo">
          <label for="cantidad">Cantidad</label>
          <input type="number" id="cantidad" name="cantidad" value="1"
            min="1" max="${maximo}" step="1" ${sinPrecio ? "disabled" : ""}
            aria-describedby="ayuda-cantidad">
          <p class="ayuda txt-secundario" id="ayuda-cantidad">${
            sinPrecio ? "No disponible por ahora." : `Máximo ${maximo} por compra.`
          }</p>
        </div>

        <button type="submit" class="btn btn-primary" ${sinPrecio ? "disabled" : ""}>
          Agregar al carrito
        </button>

        <p class="form-mensaje" id="detalle-mensaje" role="status">${
          sinPrecio ? "Este producto todavía no tiene precio publicado." : ""
        }</p>
      </form>
    </div>
  `;

  if (sinPrecio) {
    document.getElementById("detalle-mensaje").classList.add("alerta");
  }
}

// Mensaje claro cuando el código no existe o no viene en la URL.
function mostrarProductoNoEncontrado(mensaje) {
  const contenedor = document.getElementById("detalle-producto");

  contenedor.className = "detalle-vacio";
  contenedor.innerHTML = `
    <h1>Producto no encontrado</h1>
    <p>${mensaje}</p>
    <a class="btn" href="productos.html">Ver todo el catálogo</a>
  `;
}

// Conecta el formulario de cantidad con el carrito.
function engancharFormulario(producto) {
  const form = document.getElementById("form-agregar");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    // Sin preventDefault el formulario recarga la página y se pierde el
    // mensaje de confirmación.
    event.preventDefault();

    // Number() y no parseInt(): un input vacío da NaN y no un 1 silencioso.
    const cantidad = Number(form.elements.cantidad.value);
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      mostrarMensajeDetalle("Escribe una cantidad válida.", "alerta");
      return;
    }

    // agregarProducto() ya recorta a MAX_UNIDADES con validarCantidad(), así
    // que acá no hace falta volver a topearla.
    agregarProducto(producto, cantidad);
    actualizarBadgeCarrito();

    mostrarMensajeDetalle(
      `Agregamos ${cantidad} ${producto.unidad}${cantidad > 1 ? "s" : ""} al carrito.`,
      "exito"
    );
  });
}

// Mensaje de resultado bajo el formulario. Reusa las clases de main.css.
function mostrarMensajeDetalle(texto, tipo) {
  const mensaje = document.getElementById("detalle-mensaje");
  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.className = `form-mensaje ${tipo}`;
}

// Punto de entrada de esta página.
async function iniciarDetalleProducto() {
  const contenedor = document.getElementById("detalle-producto");
  if (!contenedor) return;

  const codigo = new URLSearchParams(location.search).get("codigo");
  if (!codigo) {
    mostrarProductoNoEncontrado("No indicaste qué producto quieres ver.");
    return;
  }

  // El try/catch cubre el caso más habitual en desarrollo: abrir el .html con
  // doble clic en vez de servirlo, con lo que fetch() falla y buscarPorCodigo()
  // lanza antes de devolver nada.
  try {
    const producto = await buscarPorCodigo(codigo);
    if (!producto) {
      mostrarProductoNoEncontrado(`No encontramos ningún producto con el código ${codigo}.`);
      return;
    }

    const categoria = await nombreCategoria(producto.categoria);
    document.title = `${producto.nombre} — HuertoHogar`;

    renderizarDetalle(producto, categoria);
    engancharFormulario(producto);
  } catch (error) {
    console.error("No se pudo cargar el producto", error);
    mostrarProductoNoEncontrado(
      "No pudimos cargar el catálogo. Revisa que el sitio esté abierto desde un servidor local."
    );
  }
}

document.addEventListener("DOMContentLoaded", iniciarDetalleProducto);
