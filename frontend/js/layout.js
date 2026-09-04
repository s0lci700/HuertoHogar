// Encabezado/pie de página compartidos entre páginas (partials/header.html, partials/footer.html).
window.HHLayout = (function () {
  // TODO: hacer fetch del partial y volcar el HTML dentro del elemento que coincide con `selector`
  async function cargarParcial(selector, url) {}

  // TODO: marcar el link de .main-nav que corresponda a la página actual (usar document.body.dataset.page)
  function marcarNavActivo() {}

  // TODO: leer HHCarrito.obtenerCarrito() y actualizar el número en #cart-count
  function actualizarBadgeCarrito() {}

  // TODO: mostrar "Iniciar sesión / Registrarse" o el nombre de usuario + "Cerrar sesión" en #auth-actions
  function actualizarAcciones() {}

  // TODO: llamar a las funciones de arriba en orden cuando cargue el DOM
  async function init() {}

  document.addEventListener('DOMContentLoaded', init);

  return { actualizarBadgeCarrito };
})();
