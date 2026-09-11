# Imágenes de productos

Las 7 fotos `.jpg` (`fr001`, `fr002`, `fr003`, `vr001`, `vr002`, `vr003`, `po001`) son las
imágenes oficiales del caso, extraídas de `CONTENIDO_CLASES/DSY1104 - Forma A tienda HUERTO HOGAR.pdf`
(sección «Detalle de Productos», páginas 8–10). Vienen del enunciado, así que son las que
corresponden al caso — no hay que reemplazarlas.

Son de 260×260 px, que alcanza para las tarjetas del catálogo. Si el detalle de producto
las necesita más grandes habrá que conseguir fotos de mayor resolución.

Quedan 2 placeholders SVG: `po003.svg` (Quinua Orgánica) y `pl001.svg` (Leche Entera).
El enunciado nombra ambos productos en el «Listado de Productos» pero **nunca los detalla**:
no les da precio, stock ni foto. Por eso su `precio` y `stock` en `database/productos.json`
están en `null`. Antes de la entrega hay que decidir con el docente si se inventan esos
datos o si ambos productos quedan fuera del catálogo.
