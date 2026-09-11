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

// TODO: leer CARRITO_KEY de localStorage y devolver el arreglo.
//   - si la clave no existe, JSON.parse(null) devuelve null -> devolver []
//   - si el contenido está corrupto, JSON.parse lanza -> try/catch y devolver []
function obtenerCarrito() {
  try {
    const carrito = localStorage.getItem(CARRITO_KEY);
    return carrito ? JSON.parse(carrito) : [];
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    return [];
  }
}

// TODO: guardar el arreglo recibido en localStorage bajo CARRITO_KEY (JSON.stringify).
function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  console.log(carrito);
}

// TODO: agregar un producto al carrito.
//   - recibe el OBJETO producto completo (no un código), porque este archivo
//     no tiene el catálogo para buscarlo
//   - si ya está en el carrito (mismo "codigo"), sumar la cantidad
//   - si no está, agregarlo con { ...producto, cantidad }
//   - nunca pasar de MAX_UNIDADES
function agregarProducto(producto, cantidad) {
  console.log(producto, cantidad);
  let carrito = obtenerCarrito();
  let item = carrito.find(i => i.codigo === producto.codigo);
  console.log(item);
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

// TODO: fijar la cantidad de un item por su código.
//   - si cantidad <= 0, quitar el item del carrito
//   - si cantidad > MAX_UNIDADES, dejarlo en MAX_UNIDADES
// TODO (bugs pendientes, revisar antes de dar por terminada):
//   - "producto = carrito.find(...)" no está declarada con let/const -> fuga de
//     variable global.
//   - falta un "return" después de quitarProducto(codigo): ahora mismo, cuando
//     cantidad <= 0, se quita el producto pero la línea de abajo lo vuelve a
//     agregar igual (con cantidad 1).
//   - la función debe FIJAR la cantidad: buscar el item y asignar
//     item.cantidad = validarCantidad(cantidad) directamente (+ guardarCarrito),
//     no delegar a agregarProducto(producto, 1) — eso siempre suma +1 sin
//     importar qué cantidad se pidió, así que "+" y "-" terminan haciendo lo mismo.
function actualizarCantidad(codigo, cantidad) {
  const carrito = obtenerCarrito();
  producto = carrito.find(item => item.codigo === codigo);
  if (cantidad <= 0) {
    quitarProducto(codigo);
  }
  agregarProducto(producto, 1);
}

// TODO: quitar del carrito el item con ese código (filter).
function quitarProducto(codigo) {
  let carrito = obtenerCarrito();
  let nuevoCarrito = carrito.filter(item => item.codigo != codigo);
  console.log("nuevo carrito = " + carrito);
  return guardarCarrito(nuevoCarrito);
}

// TODO: sumar precio * cantidad de todos los items (reduce) y devolver el total.
//   - ojo: PO003 y PL001 tienen precio null mientras no se defina su valor
function calcularTotal(carrito) {
  let total;
  carrito.forEach(producto => {
    total = total + (producto.precio * producto.cantidad);
  });
  return total;
}

// TODO: dejar el carrito vacío.
function vaciarCarrito() {
  guardarCarrito([]);
  renderizarCarrito();
  actualizarBadgeCarrito();
}
