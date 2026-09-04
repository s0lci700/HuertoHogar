// Carrito persistido en localStorage bajo la clave 'huertohogar-carrito'.
window.HHCarrito = (function () {
  const KEY = 'huertohogar-carrito';

  // TODO: leer la clave KEY de localStorage y devolver el array (o [] si no existe/está corrupta)
  function obtenerCarrito() {}

  // TODO: guardar el array de carrito en localStorage bajo KEY
  function guardarCarrito(carrito) {}

  // TODO: si el producto ya está en el carrito, sumar cantidad; si no, agregarlo
  function agregarProducto(producto, cantidad) {}

  // TODO: cambiar la cantidad de un item por su código (quitarlo si cantidad <= 0)
  function actualizarCantidad(codigo, cantidad) {}

  // TODO: quitar un item del carrito por código
  function quitarProducto(codigo) {}

  // TODO: sumar precio * cantidad de todos los items
  function calcularTotal(carrito) {}

  // TODO: vaciar el carrito completo
  function vaciarCarrito() {}

  return {
    obtenerCarrito,
    agregarProducto,
    actualizarCantidad,
    quitarProducto,
    calcularTotal,
    vaciarCarrito,
  };
})();
