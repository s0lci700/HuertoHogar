// Página productos.html: pinta los filtros de categoría y la grilla de productos,
// y engancha el botón "Agregar al carrito".
//
// Depende de: productos.js (cargarCatalogo) y carrito.js (agregarProducto).
// Catálogo ya descargado, para poder filtrar sin volver a pedirlo.
let productosDelCatalogo = [];
const grid = document.getElementById("grid-productos");

// TODO: dar formato a un precio en CLP.
//   - si el valor es null (PO003 Quinua, PL001 Leche) devolver "Precio a confirmar"
//   - ver Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })
function formatearPrecio(valor) {
  if (valor === null) {
    return "Precio a confirmar";
  }
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(valor);
}

// TODO: construir y devolver el <li class="producto-card"> de un producto.
//   - imagen, nombre, precio + unidad, origen
//   - botón "Agregar al carrito" con data-codigo="${producto.codigo}"
//   - enlace al detalle: producto.html?codigo=${producto.codigo}
function crearTarjetaProducto(producto) {
  const div = document.createElement("div");
  div.className = "producto-card";
  div.innerHTML = `
  <div class="producto-info">
        
        <strong>${producto.nombre}</strong> <aside>(${producto.codigo}) - <span class="categoria">${producto.categoria}</span></aside><br>
        <img src="${producto.imagen}" alt="${producto.nombre}"><br>
        Origen: ${producto.origen}<br>
        Unidad: ${producto.unidad}<br>
        Precio: ${formatearPrecio(producto.precio)}<br>
        
        <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
  </div>`;
  return div;
}

// TODO: vaciar #grid-productos y pintar dentro la lista recibida.
//   - si la lista viene vacía, mostrar un mensaje en vez de una grilla vacía
function renderizarProductos(lista) {
  grid.innerHTML = "";
  if (lista.length === 0) {
    grid.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  lista.forEach((producto) => {
    console.log("Renderizando producto:", producto);
    grid.appendChild(crearTarjetaProducto(producto));
  });
}

// TODO: filtrar productosDelCatalogo por categoría y volver a renderizar.
//   - categoriaId === 'todas' muestra todo
//   - marcar visualmente el botón de filtro activo
function aplicarFiltro(categoriaId) {
  let productosFiltrados;
  if (categoriaId === "todas") {
    productosFiltrados = productosDelCatalogo;
  } else {
    productosFiltrados = productosDelCatalogo.filter(
      (producto) => producto.categoria === categoriaId
    );
  }
  renderizarProductos(productosFiltrados);

  // Marcar visualmente el botón activo
  const botones = document.querySelectorAll(".filtros button");
  botones.forEach((btn) => {
    if (btn.getAttribute("data-categoria") === categoriaId) {
      btn.classList.add("activo");
    } else {
      btn.classList.remove("activo");
    }
  });
}

// TODO: pintar los botones de #filtros-categoria a partir de datos.categorias.
//   - agregar primero un botón "Todas"
//   - cada botón lleva data-categoria="${categoria.id}"
function renderizarFiltros(categorias) {
  const filtros = document.querySelector(".filtros");
  if (!filtros) return;

  filtros.innerHTML = "";

  const todos = document.createElement("button");
  todos.textContent = "Todas";
  todos.setAttribute("data-categoria", "todas");
  filtros.appendChild(todos);

  categorias.forEach((categoria) => {
    const btn = document.createElement("button");
    btn.textContent = categoria.nombre;
    btn.setAttribute("data-categoria", categoria.id);
    filtros.appendChild(btn);
  });
  filtros.addEventListener("click", (event) => {
    const categoriaId = event.target.getAttribute("data-categoria");
    if (categoriaId) {
      aplicarFiltro(categoriaId);
    }
  });
}

// TODO: un solo listener en #grid-productos (delegación de eventos) que detecte
// los clics en los botones con data-codigo y llame a agregarProducto().
//   - buscar el producto en productosDelCatalogo por su código
//   - después de agregar, actualizar el contador del encabezado
//     (ver actualizarBadgeCarrito en layout.js)
function engancharBotonesAgregar() {}

// Punto de entrada de esta página.
async function iniciarCatalogo() {
  const grid = document.getElementById("grid-productos");
  if (!grid) return;
  const datos = await cargarCatalogo();
  const categorias = datos.categorias;
  productosDelCatalogo = datos.productos;
  console.log("Productos del catálogo:", productosDelCatalogo);
  renderizarFiltros(datos.categorias);
  renderizarProductos(datos.productos);
  engancharBotonesAgregar();

  // TODO: const datos = await cargarCatalogo();
  // TODO: guardar datos.productos en productosDelCatalogo
  // TODO: renderizarFiltros(datos.categorias) y renderizarProductos(datos.productos)
  // TODO: engancharBotonesAgregar()
  // TODO: envolver en try/catch y mostrar un mensaje si el catálogo no carga
}

document.addEventListener("DOMContentLoaded", iniciarCatalogo);
