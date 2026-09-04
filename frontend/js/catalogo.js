// Lógica de productos.html: cargar el catálogo, pintar los filtros de categoría
// y la grilla de productos, y enganchar el botón "Agregar al carrito".
(function () {
  const grid = document.getElementById('grid-productos');
  const filtros = document.getElementById('filtros-categoria');
  if (!grid) return;

  // TODO: dar formato a un precio en CLP (o "Precio a confirmar" si es null)
  function formatearPrecio(valor) {}

  // TODO: construir el <li class="producto-card"> de un producto
  function crearTarjeta(producto) {}

  // TODO: pintar una lista de productos dentro de #grid-productos
  function renderizar(lista) {}

  // TODO: filtrar por categoría (o "todas") y volver a renderizar
  function aplicarFiltro(categoriaId) {}

  // TODO: pintar los botones de #filtros-categoria a partir de datos.categorias
  function renderizarFiltros(categorias) {}

  // TODO: cargar el catálogo (HHProductos.cargarCatalogo) y arrancar el render inicial
})();
