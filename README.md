# HuertoHogar

Proyecto Semestral de **DSY1104 — Desarrollo Full Stack II** (Duoc UC). Caso elegido: **Forma A — HuertoHogar**, una tienda online de productos frescos del campo (frutas, verduras orgánicas, productos orgánicos y lácteos) para clientes en Chile.

Es un único proyecto que evoluciona durante todo el semestre — no se reinicia en cada evaluación:

| Etapa | Tecnología | Estado |
|---|---|---|
| **EV1** | HTML + CSS + JavaScript, carrito con `localStorage` | **completa** |
| EV2 | Migración a React | pendiente |
| EV3 | React + Spring Boot + MySQL | pendiente |
| ET | Cierre e integración final | pendiente |

## Cómo ejecutar

`frontend/` obtiene el catálogo con `fetch('../database/productos.json')` y arma el
encabezado con `fetch('partials/header.html')`, así que hay que servir la **raíz del
repositorio** (no solo `frontend/`) con un servidor local. Abriendo los `.html` con
doble clic, el navegador bloquea esas peticiones y la página se ve incompleta.

```bash
npx serve .
```

Después abrir <http://localhost:3000/frontend/> — o usar la extensión Live Server de
VS Code, abriendo el proyecto desde la raíz.

## Qué hay implementado en EV1

- **10 páginas** con encabezado y pie compartidos, inyectados desde `frontend/partials/`.
- **Catálogo dinámico** desde `database/productos.json`, con filtros por categoría y
  ficha de detalle por producto.
- **Carrito** completo: agregar, subir y bajar cantidades, quitar, vaciar, total, y
  confirmación de pedido con generación de boleta y folio correlativo.
- **Persistencia en `localStorage`**: el carrito sobrevive a la recarga y al cierre de
  sesión.
- **Formularios validados con JavaScript**: registro, inicio de sesión, perfil y
  contacto. Sin backend todavía, la sesión es una simulación en el navegador.
- **Contenido institucional**: misión y visión, impacto ambiental, listado de las 7
  tiendas y blog.

El detalle de cada requisito, su estado real y las decisiones de diseño están en la
especificación de requisitos:

**→ [`documentacion/ERS-HuertoHogar.md`](documentacion/ERS-HuertoHogar.md)**

## Estructura

```
frontend/         páginas, estilos y JS de la etapa actual (EV1)
database/         productos.json — catálogo de HuertoHogar
documentacion/    ERS del proyecto
CONTENIDO_CLASES/ material del ramo (enunciados, pauta)
backend/          se crea en EV3
```
