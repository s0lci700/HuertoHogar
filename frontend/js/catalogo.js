// Página productos.html: pinta los filtros de categoría y la grilla de productos,
// y engancha el botón "Agregar al carrito".
//
// Depende de: productos.js (cargarCatalogo) y carrito.js (agregarProducto).
// Catálogo ya descargado, para poder filtrar sin volver a pedirlo.
let productosDelCatalogo = [];
const grid = document.getElementById("grid-productos");

// Formatea un precio en CLP. Devuelve "Precio a confirmar" cuando el valor es
// null (PO003 Quinua y PL001 Leche: el enunciado nunca les asigna precio).
function formatearPrecio(valor) {
  if (valor === null) {
    return "Precio a confirmar";
  }
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(valor);
}

// Construye y devuelve la tarjeta de un producto.
// TODO: falta el enlace al detalle -> producto.html?codigo=${producto.codigo}
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
        
        
        <button data-codigo="${producto.codigo}">Agregar al carrito</button>
  </div>`;
  return div;
}

// Vacía #grid-productos y pinta dentro la lista recibida.
function renderizarProductos(lista) {
  grid.innerHTML = "";
  if (lista.length === 0) {
    grid.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  lista.forEach((producto) => {
    grid.appendChild(crearTarjetaProducto(producto));
  });
}

// Filtra el catálogo por categoría y vuelve a renderizar.
// 'todas' muestra todo. Marca visualmente el botón activo.
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

// Pinta los botones de filtro a partir de las categorías del catálogo,
// con un botón "Todas" al inicio. Usa delegación de eventos en el contenedor.
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

// Conecta el botón "Agregar al carrito" de cada tarjeta.
// Va con delegación y no con onclick porque renderizarProductos() rehace
// las tarjetas en cada filtro: los listeners puestos en cada botón se
// perderían, el del contenedor no.
function engancharBotonesAgregar() {
  grid.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-codigo]");
    if (!boton) {
      return
    }
    let producto = productosDelCatalogo.find(i => i.codigo === boton.getAttribute("data-codigo"));
    agregarProducto(producto, 1);
    actualizarBadgeCarrito();
  })
}

// Punto de entrada de esta página.
async function iniciarCatalogo() {
  const grid = document.getElementById("grid-productos");
  if (!grid) return;
  // TODO: envolver todo esto en try/catch y mostrar un mensaje en #grid-productos
  // si el catálogo no carga (servidor caído, JSON malformado, ruta equivocada).
  const datos = await cargarCatalogo();
  productosDelCatalogo = datos.productos;
  renderizarFiltros(datos.categorias);
  renderizarProductos(datos.productos);
  engancharBotonesAgregar();
}

document.addEventListener("DOMContentLoaded", iniciarCatalogo);
