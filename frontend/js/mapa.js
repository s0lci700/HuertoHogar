// Mapa de tiendas para nosotros.html — Leaflet + OpenStreetMap (sin API key).
//
// PENDIENTE: nosotros.html todavía no carga Leaflet. Hay que agregar en el
// <head> el CSS y el JS de Leaflet por CDN, si no `L` no existe y esto no corre.

// Las 7 ciudades del enunciado.
// TODO: completar lat/lng de cada tienda.
const TIENDAS = [
  { nombre: "Santiago", lat: null, lng: null },
  { nombre: "Puerto Montt", lat: null, lng: null },
  { nombre: "Villarrica", lat: null, lng: null },
  { nombre: "Nacimiento", lat: null, lng: null },
  { nombre: "Viña del Mar", lat: null, lng: null },
  { nombre: "Valparaíso", lat: null, lng: null },
  { nombre: "Concepción", lat: null, lng: null },
];

// Punto de entrada de esta página.
function iniciarMapa() {
  const contenedor = document.getElementById("mapa-tiendas");
  if (!contenedor || typeof L === "undefined") return;

  // TODO: const mapa = L.map(contenedor).setView([-38.5, -72.5], 5)
  // TODO: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //         attribution: '&copy; OpenStreetMap'
  //       }).addTo(mapa)
  // TODO: recorrer TIENDAS y agregar un L.marker([lat, lng]) con .bindPopup(nombre)
}

document.addEventListener("DOMContentLoaded", iniciarMapa);
