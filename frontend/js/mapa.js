// Mapa de tiendas para nosotros.html — usa Leaflet + OpenStreetMap (sin API key).
// Lista de tiendas del enunciado: Santiago, Puerto Montt, Villarrica,
// Nacimiento, Viña del Mar, Valparaíso, Concepción.
(function () {
  const contenedor = document.getElementById('mapa-tiendas');
  if (!contenedor || typeof L === 'undefined') return;

  // TODO: array de tiendas con { nombre, lat, lng }
  // TODO: L.map(contenedor).setView([...], zoom)
  // TODO: L.tileLayer(...).addTo(mapa) con los tiles de OpenStreetMap
  // TODO: L.marker([...]).addTo(mapa).bindPopup(...) por cada tienda
})();
