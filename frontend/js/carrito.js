// Estado del carrito, persistido en localStorage.
// Este archivo NO dibuja nada y NO conoce el catálogo: solo lee y escribe el
// arreglo del carrito. Dibujar es trabajo de catalogo.js y carrito-vista.js.
//
// Patrón: cada función lee el carrito de localStorage, lo modifica y lo vuelve
// a guardar. No hay una variable `carrito` global — así dos pestañas abiertas
// no se pisan los datos.

const CARRITO_KEY = "huertohogar-carrito";

// Regla formativa del taller: máximo 5 unidades por producto.
const MAX_UNIDADES = 5;

function obtenerCarrito() {
  try {
    const carrito = localStorage.getItem(CARRITO_KEY);
    return carrito ? JSON.parse(carrito) : [];
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

function agregarProducto(producto, cantidad) {
  let carrito = obtenerCarrito();
  let item = carrito.find(i => i.codigo === producto.codigo);
  if (item) {
      item.cantidad = validarCantidad(item.cantidad + cantidad);
      guardarCarrito(carrito);
      return;
    }
  carrito.push({...producto, cantidad : validarCantidad(cantidad) });
  guardarCarrito(carrito);
  return;

  }

function validarCantidad(cantidad) {
  // No permite que la cantidad sea menor a 0 ni mayor a max_unidades
  return Math.max(0, Math.min(cantidad, MAX_UNIDADES));
}

function actualizarCantidad(codigo, cantidad) {
  const carrito = obtenerCarrito();
  const producto = carrito.find(item => item.codigo === codigo);
  if (cantidad <= 0) {
    quitarProducto(codigo);
    return;
  }
  if (!producto) return;

  producto.cantidad = validarCantidad(cantidad);
  guardarCarrito(carrito);
}

function quitarProducto(codigo) {
  let carrito = obtenerCarrito();
  let nuevoCarrito = carrito.filter(item => item.codigo != codigo);
  return guardarCarrito(nuevoCarrito);
}

// Ojo: PO003 y PL001 tienen precio null, así que hoy suman 0 al total.
function calcularTotal(carrito) {
  let total = 0;
  carrito.forEach(producto => {
    total = total + (producto.precio * producto.cantidad);
  });
  return total;
}

function vaciarCarrito() {
  guardarCarrito([]);
}

// PEDIDOS
// El enunciado pide "confirmación del pedido y generación de la boleta". Sin
// backend todavía, el pedido confirmado se guarda en localStorage igual que el
// carrito: en EV3 esta función pasa a ser un POST al API.
const PEDIDO_KEY = "huertohogar-pedido";
const FOLIO_KEY = "huertohogar-folio";

// Número de boleta correlativo. Se guarda aparte del pedido porque tiene que
// sobrevivir a la boleta siguiente: si viviera dentro del pedido, cada compra
// nueva pisaría el contador y todas las boletas saldrían con el mismo número.
function siguienteFolio() {
  const folio = Number(localStorage.getItem(FOLIO_KEY) || 0) + 1;
  localStorage.setItem(FOLIO_KEY, folio);
  return "HH-" + String(folio).padStart(4, "0");
}

// Convierte el carrito en un pedido, lo guarda y deja el carrito vacío.
// Devuelve el pedido para que la vista pueda dibujar la boleta, o null si no
// había nada que confirmar.
function confirmarPedido() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return null;

  const pedido = {
    folio: siguienteFolio(),
    fecha: new Date().toISOString(),
    items: carrito,
    total: calcularTotal(carrito),
  };

  localStorage.setItem(PEDIDO_KEY, JSON.stringify(pedido));
  vaciarCarrito();
  return pedido;
}
