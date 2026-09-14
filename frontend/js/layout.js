// Encabezado y pie de página compartidos (partials/header.html, partials/footer.html).
// Cada página deja un contenedor vacío con data-parcial="header" / data-parcial="footer"
// y este archivo inyecta el HTML del parcial correspondiente.
//
// OJO: usa fetch(), así que el sitio se debe abrir desde un servidor local:
// Live Server de VS Code, con la carpeta completa del proyecto abierta en el
// editor. Abriendo el .html con doble clic (file://) el navegador bloquea la
// petición y el encabezado no aparece.
//
// Este archivo se carga en TODAS las páginas, por eso vive aquí la clave del
// usuario que también usa validaciones.js.
const USUARIO_KEY = "huertohogar-usuario";

// Formatea un precio en CLP. Devuelve "Precio a confirmar" cuando el valor es
// null (PO003 Quinua y PL001 Leche: el enunciado nunca les asigna precio).
// Vive acá porque layout.js es el único archivo cargado en las 10 páginas:
// antes estaba copiado en catalogo.js y en carrito-vista.js, y producto.html
// no carga ninguno de los dos.
function formatearPrecio(valor) {
  if (valor === null) {
    return "Precio a confirmar";
  }
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(valor);
}

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

// Marca el enlace del encabezado que corresponde a la página actual.
// La página se identifica con <body data-page="...">.
// Se busca en todo .site-header y no solo en .main-nav porque el logo
// hace de enlace a Inicio y también lleva data-nav="index".
function marcarNavActivo() {
  const pagina = document.body.dataset.page;
  if (!pagina) return;

  const activo = document.querySelector(`.site-header [data-nav="${pagina}"]`);
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

// Devuelve el usuario guardado, o null si no hay sesión.
// Vive acá y no en validaciones.js porque layout.js es el único archivo que se
// carga en las 10 páginas y el encabezado necesita saber si hay sesión en
// todas. validaciones.js puede reutilizar esta función en obtenerUsuario().
function leerUsuarioGuardado() {
  try {
    const usuario = localStorage.getItem(USUARIO_KEY);
    return usuario ? JSON.parse(usuario) : null;
  } catch (error) {
    console.error("Error al leer el usuario", error);
    return null;
  }
}

// Cierra la sesión y vuelve a la portada.
// Borra SOLO USUARIO_KEY: el carrito vive bajo otra clave y tiene que
// sobrevivir al cierre de sesión (requisito explícito del desafío de la
// semana 04). Por eso no se usa localStorage.clear().
function cerrarSesion() {
  localStorage.removeItem(USUARIO_KEY);
  location.href = "index.html";
}

// Pinta #auth-actions según haya sesión o no.
// Los enlaces llevan data-nav para que marcarNavActivo() los marque igual que
// los del menú. Por eso iniciarLayout() llama a esta función ANTES que a
// marcarNavActivo(): si no, esos enlaces todavía no existen en el DOM.
function actualizarAcciones() {
  const contenedor = document.getElementById("auth-actions");
  if (!contenedor) return;

  const usuario = leerUsuarioGuardado();
  contenedor.innerHTML = "";

  if (!usuario) {
    contenedor.innerHTML = `
      <a href="login.html" data-nav="login">Iniciar sesión</a>
      <a href="registro.html" data-nav="registro">Registrarse</a>
    `;
    return;
  }

  // El nombre lo escribe la persona en el registro, así que se inserta con
  // textContent y no dentro de una plantilla de innerHTML: si alguien guarda
  // "<img onerror=...>" como nombre, acá se vería como texto y no se ejecuta.
  const perfil = document.createElement("a");
  perfil.href = "perfil.html";
  perfil.dataset.nav = "perfil";
  perfil.textContent = usuario.nombre || "Mi perfil";

  const salir = document.createElement("button");
  salir.type = "button";
  salir.textContent = "Cerrar sesión";
  salir.addEventListener("click", cerrarSesion);

  contenedor.append(perfil, salir);
}

// El orden importa por dos razones: las tres funciones de abajo tocan elementos
// que viven dentro del encabezado (no pueden correr antes del await), y
// actualizarAcciones() inyecta enlaces con data-nav, así que tiene que correr
// antes de marcarNavActivo() para que esos enlaces alcancen a marcarse.
async function iniciarLayout() {
  await Promise.all([
    cargarParcial('[data-parcial="header"]', "partials/header.html"),
    cargarParcial('[data-parcial="footer"]', "partials/footer.html"),
  ]);

  actualizarAcciones();
  marcarNavActivo();
  actualizarBadgeCarrito();
}

document.addEventListener("DOMContentLoaded", iniciarLayout);
