// Catálogo de productos: carga database/productos.json y lo deja disponible
// para el resto de las páginas.
//
// OJO: fetch() necesita un servidor local (Live Server o `npx serve .` desde la
// RAÍZ del repositorio). La ruta '../database/...' se resuelve desde el .html
// que está abierto, no desde este archivo .js.

// Guarda el catálogo ya descargado para no volver a pedirlo en cada llamada.
let catalogoCache = null;

// Devuelve: { categorias: [...], productos: [...] }
async function cargarCatalogo() {
  if (catalogoCache) {
    return catalogoCache;
  }

  const response = await fetch("../database/productos.json");
  if (!response.ok) {
    throw new Error("Error al cargar el catálogo");
  }

  const data = await response.json();
  catalogoCache = data;
  console.log("Catálogo cargado:", data);
  return data;
}

async function buscarPorCodigo(codigo) {
  const catalogo = await cargarCatalogo();
  return catalogo.productos.find((producto) => producto.codigo === codigo) || null;
}
