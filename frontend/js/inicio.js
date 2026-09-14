// Página index.html: pinta las categorías destacadas a partir del catálogo.
//
// Depende de: productos.js (cargarCatalogo) y layout.js (para el encabezado).
// Cada tarjeta enlaza a productos.html?categoria=<id>, que catalogo.js lee para
// abrir el catálogo ya filtrado.

const gridCategorias = document.getElementById("grid-categorias");

// Portada de la categoría: la foto del primer producto que pertenece a ella.
// El catálogo no trae una imagen propia por categoría y agregar ese campo
// obligaría a mantener la misma foto en dos lugares de productos.json.
function imagenDeCategoria(productos, categoriaId) {
  const producto = productos.find((item) => item.categoria === categoriaId);
  return producto ? producto.imagen : "";
}

function crearTarjetaCategoria(categoria, productos) {
  const cuantos = productos.filter(
    (producto) => producto.categoria === categoria.id
  ).length;

  const enlace = document.createElement("a");
  enlace.className = "categoria-card";
  enlace.href = `productos.html?categoria=${categoria.id}`;
  enlace.innerHTML = `
    <img src="${imagenDeCategoria(productos, categoria.id)}" alt="">
    <div class="categoria-card-texto">
      <h3>${categoria.nombre}</h3>
      <p>${categoria.descripcion}</p>
      <p class="categoria-card-cuenta">${cuantos} ${
        cuantos === 1 ? "producto" : "productos"
      }</p>
    </div>
  `;
  return enlace;
}

// Punto de entrada de esta página.
async function iniciarPortada() {
  if (!gridCategorias) return;

  // Mismo catch que el catálogo: abrir el .html con doble clic rompe fetch()
  // y sin esto la sección queda vacía sin ninguna pista de por qué.
  try {
    const datos = await cargarCatalogo();
    datos.categorias.forEach((categoria) => {
      gridCategorias.appendChild(
        crearTarjetaCategoria(categoria, datos.productos)
      );
    });
  } catch (error) {
    console.error("No se pudieron cargar las categorías", error);
    gridCategorias.innerHTML =
      "<p>No pudimos cargar las categorías. Revisa que el sitio esté abierto desde un servidor local.</p>";
  }
}

document.addEventListener("DOMContentLoaded", iniciarPortada);
