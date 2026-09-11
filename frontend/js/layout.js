// Encabezado y pie de página compartidos (partials/header.html, partials/footer.html).
// Cada página deja un contenedor vacío con data-parcial="header" / data-parcial="footer"
// y este archivo inyecta el HTML del parcial correspondiente.
//
// OJO: usa fetch(), así que el sitio se debe abrir desde un servidor local
// (Live Server o `npx serve .`). Abriendo el .html con doble clic (file://)
// el navegador bloquea la petición y el encabezado no aparece.
//
// Este archivo se carga en TODAS las páginas, por eso vive aquí la clave del
// usuario que también usa validaciones.js.
const USUARIO_KEY = "huertohogar-usuario";

// Vuelca el HTML del parcial dentro del elemento que coincide con `selector`.
async function cargarParcial(selector, url) {
  const destino = document.querySelector(selector);
  if (!destino) return;

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    destino.innerHTML = await respuesta.text();
  } catch (error) {
    console.error(`No se pudo cargar el parcial ${url}:`, error);
  }
}

// Marca el link de .main-nav que corresponde a la página actual.
// La página se identifica con <body data-page="...">.
function marcarNavActivo() {
  const pagina = document.body.dataset.page;
  if (!pagina) return;

  const activo = document.querySelector(`.main-nav [data-nav="${pagina}"]`);
  if (activo) {
    activo.classList.add("activo");
    activo.setAttribute("aria-current", "page");
  }
}

// Actualiza el número del carrito en el encabezado.
// Tolera que carrito.js todavía no esté implementado: en ese caso muestra 0.
function actualizarBadgeCarrito() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const carrito = (typeof obtenerCarrito === "function" && obtenerCarrito()) || [];
  const total = carrito.reduce((suma, item) => suma + (item.cantidad || 0), 0);
  badge.textContent = total;
}

// TODO: mostrar "Iniciar sesión / Registrarse" cuando no hay sesión, o el
// nombre del usuario + "Cerrar sesión" cuando sí la hay, dentro de #auth-actions.
//   - leer USUARIO_KEY de localStorage
//   - "Cerrar sesión" debe borrar SOLO USUARIO_KEY, nunca el carrito
//     (es un requisito explícito del desafío de la semana 04)
function actualizarAcciones() {}

// El orden importa: las tres funciones de abajo tocan elementos que viven
// dentro del encabezado, así que no pueden correr antes del await.
async function iniciarLayout() {
  await Promise.all([
    cargarParcial('[data-parcial="header"]', "partials/header.html"),
    cargarParcial('[data-parcial="footer"]', "partials/footer.html"),
  ]);

  marcarNavActivo();
  actualizarBadgeCarrito();
  actualizarAcciones();
}

document.addEventListener("DOMContentLoaded", iniciarLayout);
