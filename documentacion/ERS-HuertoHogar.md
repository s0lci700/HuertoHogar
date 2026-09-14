# Especificación de Requisitos de Software — HuertoHogar

**Proyecto Semestral · DSY1104 Desarrollo Full Stack II · Duoc UC**
Caso **Forma A — HuertoHogar**

| | |
|---|---|
| Versión | 1.1 — etapa **EV1** |
| Fecha | 13 de septiembre de 2026 |
| Autora | Sol León |
| Repositorio | https://github.com/s0lci700/HuertoHogar |

> Este documento se construye de forma progresiva durante el semestre
> (EV1 iniciado → EV2 actualizado → EV3 casi completo → ET final) y describe el
> sistema **tal como está construido**, no una propuesta ideal. Cada requisito
> indica su estado real de implementación.

---

## 1. Introducción

### 1.1 Propósito

Especificar los requisitos de **HuertoHogar**, una tienda en línea de productos
frescos del campo para clientes en Chile. El documento sirve como referencia
para el desarrollo, como evidencia de la evaluación y como base para las etapas
siguientes del proyecto semestral.

### 1.2 Alcance del producto

HuertoHogar permite a una persona navegar un catálogo de productos frescos,
filtrarlos por categoría, revisar su detalle, armar un carrito de compras y
gestionar una cuenta de usuario.

El sistema es **un solo producto que evoluciona por etapas**; no se reinicia en
cada evaluación:

| Etapa | Tecnología | Estado |
|---|---|---|
| **EV1** | HTML + CSS + JavaScript, `localStorage` | **en desarrollo** |
| EV2 | Migración a React, Bootstrap, pruebas | pendiente |
| EV3 | Spring Boot + MySQL, API REST, Swagger, JWT | pendiente |
| ET | Integración y cierre | pendiente |

### 1.3 Alcance de esta versión (EV1)

El enunciado del caso advierte explícitamente (p. 2):

> «Todos los requerimientos propuestos deben ser validados por el docente para
> determinar el alcance, por lo que **no todos los requerimientos se deben
> realizar**.»

Por lo tanto, este documento distingue tres situaciones por requisito:

- **En alcance EV1** — se construye en esta etapa.
- **Diferido** — corresponde a una etapa posterior (requiere backend).
- **Por validar** — su inclusión depende de confirmación con el docente.

### 1.4 Definiciones

| Término | Significado |
|---|---|
| Catálogo | Conjunto de productos disponibles, definido en `database/productos.json` |
| Carrito | Selección temporal de productos con cantidades, persistida en el navegador |
| Parcial | Fragmento HTML reutilizable (encabezado, pie de página) inyectado por JavaScript |
| `localStorage` | Almacenamiento clave-valor del navegador, persistente entre sesiones |
| CLP | Peso chileno |
| ERS | Especificación de Requisitos de Software (este documento) |

### 1.5 Referencias

1. `CONTENIDO_CLASES/DSY1104 - Forma A tienda HUERTO HOGAR.pdf` — enunciado del caso.
2. `CONTENIDO_CLASES/00_Instrucciones_Generales_Proyecto_Semestral_DSY1104.docx` — reglas del proyecto semestral.
3. Material de las semanas 03 y 04 del ramo (formularios, validaciones, `localStorage`, carrito).
4. `CLAUDE.md` — contexto técnico del repositorio.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

En EV1 el sistema es una aplicación **exclusivamente de front-end**, sin
servidor de aplicación ni base de datos. El catálogo se lee de un archivo JSON
estático y todo el estado del usuario (carrito, sesión simulada) vive en el
`localStorage` del navegador.

Esta arquitectura es **deliberadamente temporal**: en EV3 el JSON se reemplaza
por MySQL a través de una API REST en Spring Boot, y la sesión simulada por
autenticación real con JWT.

### 2.2 Funciones principales

- Navegación entre páginas con encabezado y pie de página comunes.
- Visualización del catálogo con filtros por categoría.
- Detalle individual de producto.
- Carrito de compras persistente.
- Registro, inicio de sesión y perfil de usuario (simulados).
- Página institucional con misión, visión y listado de tiendas.
- Blog de contenido educativo.

### 2.3 Características de los usuarios

| Perfil | Descripción | Conocimiento técnico |
|---|---|---|
| Visitante | Navega el catálogo sin cuenta | Ninguno |
| Cliente registrado | Además gestiona su perfil y su carrito | Ninguno |
| Administrador | Se introduce en EV3 junto con roles y permisos | — |

### 2.4 Restricciones

- **R-01** — EV1 debe resolverse con HTML, CSS y JavaScript sin framework. No se
  permite adelantar React, Spring Boot ni MySQL.
- **R-02** — El sitio debe servirse desde un servidor HTTP local. `fetch()` está
  bloqueado bajo el protocolo `file://`, por lo que abrir un `.html` con doble
  clic deja la página sin catálogo y sin encabezado.
- **R-03** — Debe respetarse la propuesta visual del enunciado (paleta,
  tipografías, textura) sin alteraciones.
- **R-04** — No puede eliminarse el trabajo de una etapa para empezar de cero en
  la siguiente.
- **R-05** — La autenticación de EV1 es una **simulación didáctica** en
  `localStorage`. No constituye seguridad real y así debe presentarse.

### 2.5 Suposiciones y dependencias

- **S-01** — El navegador soporta `fetch`, `localStorage`, `Intl.NumberFormat`
  y atributos `data-*`.
- **S-02** — El usuario no tiene `localStorage` deshabilitado.
- **S-03** — El mapa de tiendas dependerá de Leaflet + OpenStreetMap, sin clave
  de API.
- **D-01** — Dos productos del catálogo (**PO003 Quinua Orgánica** y **PL001
  Leche Entera**) aparecen en el listado del enunciado (p. 6) pero **nunca se
  detallan**: no tienen precio, stock ni fotografía en ninguna parte del
  documento. Ver decisión **DEC-03**.

---

## 3. Requisitos funcionales

Estado: ✅ implementado · 🔄 parcial · ⬜ pendiente · ⏸ diferido a etapa posterior

### 3.1 Navegación y estructura

| ID | Requisito | Origen | Etapa | Estado |
|---|---|---|---|---|
| RF-01 | Todas las páginas comparten el mismo encabezado, navegación y pie de página | Semana 04 | EV1 | ✅ |
| RF-02 | La navegación entre páginas es funcional | Inst. §7 | EV1 | ✅ |
| RF-03 | El enlace de la página actual se marca como activo | Semana 04 | EV1 | ✅ |
| RF-04 | El contador del carrito es visible en la navegación de todas las páginas | Semana 04 | EV1 | ✅ |

### 3.2 Catálogo de productos

| ID | Requisito | Origen | Etapa | Estado |
|---|---|---|---|---|
| RF-10 | Mostrar el catálogo con precio, descripción, origen y disponibilidad | Enunciado p. 2 | EV1 | ✅ |
| RF-11 | Filtrar productos por categoría | Enunciado p. 2 | EV1 | ✅ |
| RF-12 | Mostrar el detalle de un producto individual | Enunciado p. 2 | EV1 | ✅ |
| RF-13 | Mostrar el origen de cada producto | Enunciado p. 5 | EV1 | ✅ |
| RF-14 | Búsqueda por texto con filtrado combinado | Enunciado p. 3 | EV2 | ⬜ |

### 3.3 Carrito de compras

| ID | Requisito | Origen | Etapa | Estado |
|---|---|---|---|---|
| RF-20 | Agregar productos al carrito | Enunciado p. 2 | EV1 | ✅ |
| RF-21 | Modificar la cantidad de un producto en el carrito | Enunciado p. 2 | EV1 | ✅ |
| RF-22 | Eliminar un producto del carrito | Enunciado p. 2 | EV1 | ✅ |
| RF-23 | Vaciar el carrito completo | Semana 04 | EV1 | ✅ |
| RF-24 | Mostrar resumen con precios detallados y total | Enunciado p. 2 | EV1 | ✅ |
| RF-25 | El carrito persiste entre páginas y tras recargar | Inst. §7 | EV1 | ✅ |
| RF-26 | Máximo 5 unidades por producto | Semana 04 | EV1 | ✅ |

### 3.4 Usuarios

| ID | Requisito | Origen | Etapa | Estado |
|---|---|---|---|---|
| RF-30 | Registro con correo electrónico y contraseña | Enunciado p. 2 | EV1 | ✅ |
| RF-31 | Inicio de sesión | Enunciado p. 2 | EV1 | ✅ |
| RF-32 | Gestión de perfil: dirección de entrega y número de contacto | Enunciado p. 2 | EV1 | ✅ |
| RF-33 | Cerrar sesión **sin borrar el carrito** | Semana 04 | EV1 | ✅ |
| RF-34 | Autenticación real con JWT, roles y permisos | Inst. §9 | EV3 | ⏸ |

### 3.5 Contenido institucional

| ID | Requisito | Origen | Etapa | Estado |
|---|---|---|---|---|
| RF-40 | Página con misión y visión | Enunciado p. 1 | EV1 | ✅ |
| RF-41 | Mapa con las tiendas del país | Enunciado p. 3 | EV2 | ⏸ |
| RF-42 | Blog o sección de noticias sobre alimentación y sostenibilidad | Enunciado p. 3 | EV1 | ✅ |
| RF-43 | Sección de impacto ambiental (huella de carbono, comunidad) | Enunciado p. 5 | EV1 | ✅ |

### 3.6 Pedido

| ID | Requisito | Origen | Etapa | Estado |
|---|---|---|---|---|
| RF-50 | Confirmación del pedido y generación de la boleta | Enunciado p. 2 | EV1 | ✅ |

RF-50 está implementado **simulado**: `confirmarPedido()` arma el pedido con un
folio correlativo, lo guarda bajo `huertohogar-pedido` en `localStorage` y vacía
el carrito; `renderizarComprobante()` dibuja la boleta. No hay envío a un
servidor ni documento tributario real — eso llega en EV3 junto con el API.

### 3.7 Requisitos diferidos — dependen de backend y de validación de alcance

Los siguientes requisitos aparecen en el enunciado pero **no son realizables en
EV1** por depender de un servidor, y su inclusión definitiva está sujeta a la
validación de alcance descrita en §1.3.

| ID | Requisito | Origen | Etapa estimada |
|---|---|---|---|
| RF-51 | Notificaciones de estado del pedido | p. 2 | EV3 |
| RF-52 | Rastreo de envíos en tiempo real | p. 2 | EV3 |
| RF-53 | Selección de fecha de entrega preferida | p. 2 | EV3 |
| RF-54 | Reseñas y calificaciones de productos | p. 2 | EV3 |
| RF-55 | Historial de compras y repetición de pedidos | p. 5 | EV3 |
| RF-56 | Programa de fidelización por puntos o descuentos | p. 3 | EV3 |
| RF-57 | Recomendaciones personalizadas | p. 5 | EV3 |
| RF-58 | Integración con redes sociales | p. 3 | EV2 |
| RF-59 | Recetas sugeridas y prácticas sostenibles por producto | p. 5 | EV2 |

---

## 4. Requisitos no funcionales

### 4.1 Interfaz y diseño visual

**RNF-01 — Paleta de colores.** Definida como variables CSS en
`frontend/css/main.css`, idéntica al enunciado (p. 4). **Estado: ✅**

| Uso | Color | Variable |
|---|---|---|
| Fondo principal | `#F7F7F7` | `--bg` |
| Botones, enlaces, interactivos | `#2E8B57` | `--acc-ve` |
| Ofertas y promociones | `#FFD700` | `--acc-am` |
| Títulos y subtítulos | `#8B4513` | `--acc-mc` |
| Texto principal | `#333333` | `--primary-font-color` |
| Texto secundario | `#666666` | `--secondary-font-color` |

> Nota: el enunciado denomina «Amarillo Mostaza» a `#FFD700` (dorado) y «Marrón
> Claro» a `#8B4513` (marrón oscuro). Se respeta el valor hexadecimal, que es el
> dato verificable, no el nombre.

**RNF-02 — Tipografía.** Montserrat para texto general y Playfair Display para
encabezados, según el enunciado (p. 4). **Estado: ✅**

**RNF-03 — Textura de fondo.** Textura sutil de papel reciclado (p. 5),
aplicada como `body::before` fijo con opacidad reducida. **Estado: ✅**

**RNF-04 — Diseño responsive.** El sitio debe ser usable en móvil, tablet y
escritorio. En EV2 se formaliza con Bootstrap. **Estado: ⬜**

### 4.2 Calidad del código

- **RNF-10** — HTML semántico: uso de `header`, `nav`, `main`, `section`,
  `article`, `footer`; un solo `h1` por página y jerarquía de títulos coherente.
  **Estado: 🔄**
- **RNF-11** — CSS externo y compartido por todas las páginas. **Estado: ✅**
- **RNF-12** — Separación de responsabilidades entre HTML, CSS y JavaScript, y
  entre archivos JavaScript (ver §5.3). **Estado: ✅**
- **RNF-13** — Accesibilidad básica: `alt` en imágenes, `aria-label` en la
  navegación, `aria-current` en el enlace activo. **Estado: 🔄**

### 4.3 Rendimiento

- **RNF-20** — El catálogo se descarga una sola vez por sesión y se mantiene en
  memoria (`catalogoCache`). **Estado: ✅**
- **RNF-21** — Las imágenes deben tener un peso razonable para web. La textura
  de fondo se redujo de 6,9 MB a 206 KB sin cambio visual apreciable.
  **Estado: ✅**

### 4.4 Seguridad

- **RNF-30** — En EV1 **no existe seguridad real**. El registro y el inicio de
  sesión son una simulación en `localStorage` con fines didácticos. Las
  contraseñas no se cifran y no deben considerarse protegidas.
- **RNF-31** — En EV3 se incorpora autenticación con JWT, control de roles y
  almacenamiento seguro de credenciales.

---

## 5. Modelo de datos y arquitectura

### 5.1 Catálogo — `database/productos.json`

Archivo estático con dos colecciones: `categorias` (4) y `productos` (9).

```jsonc
{
  "categorias": [
    { "id": "frutas", "nombre": "Frutas Frescas", "descripcion": "..." }
  ],
  "productos": [
    {
      "codigo":      "FR001",          // identificador único del producto
      "nombre":      "Manzanas Fuji",
      "categoria":   "frutas",         // referencia a categorias[].id
      "precio":      1200,             // CLP; null si no está definido
      "unidad":      "kilo",
      "stock":       150,              // null si no está definido
      "origen":      "Valle del Maule",
      "descripcion": "...",
      "imagen":      "img/productos/fr001.jpg"
    }
  ]
}
```

**Catálogo completo:**

| Código | Producto | Categoría | Precio | Stock |
|---|---|---|---|---|
| FR001 | Manzanas Fuji | Frutas Frescas | $1.200 / kilo | 150 |
| FR002 | Naranjas Valencia | Frutas Frescas | $1.000 / kilo | 200 |
| FR003 | Plátanos Cavendish | Frutas Frescas | $800 / kilo | 250 |
| VR001 | Zanahorias Orgánicas | Verduras Orgánicas | $900 / kilo | 100 |
| VR002 | Espinacas Frescas | Verduras Orgánicas | $700 / bolsa 500 g | 80 |
| VR003 | Pimientos Tricolores | Verduras Orgánicas | $1.500 / kilo | 120 |
| PO001 | Miel Orgánica | Productos Orgánicos | $5.000 / frasco 500 g | 50 |
| PO003 | Quinua Orgánica | Productos Orgánicos | *sin definir* | *sin definir* |
| PL001 | Leche Entera | Productos Lácteos | *sin definir* | *sin definir* |

### 5.2 Estado en el navegador — `localStorage`

| Clave | Contenido | Declarada en |
|---|---|---|
| `huertohogar-carrito` | Arreglo de items `{ ...producto, cantidad }` | `carrito.js` (`CARRITO_KEY`) |
| `huertohogar-usuario` | Objeto `{ nombre, email, direccion, telefono }` | `layout.js` (`USUARIO_KEY`) |

Cerrar sesión elimina **únicamente** `huertohogar-usuario`; el carrito
sobrevive (RF-33).

### 5.3 Organización del código

```
frontend/
├── index.html  productos.html  producto.html  carrito.html
├── login.html  registro.html   perfil.html
├── nosotros.html  blog.html    contacto.html
├── partials/
│   ├── header.html          encabezado único de todo el sitio
│   └── footer.html          pie de página único
├── css/main.css             variables de diseño y estilos
├── img/                     textura de fondo e imágenes de producto
└── js/
    ├── layout.js            inyecta los parciales, nav activo, contador
    ├── productos.js         carga y cachea el catálogo
    ├── carrito.js           estado del carrito y del pedido (solo datos)
    ├── catalogo.js          vista de productos.html
    ├── carrito-vista.js     vista de carrito.html
    ├── producto-detalle.js  vista de producto.html
    ├── inicio.js            categorías destacadas de index.html
    └── validaciones.js      formularios de registro, login, perfil y contacto
database/productos.json
documentacion/ERS-HuertoHogar.md
```

**Responsabilidades.** `carrito.js` gestiona exclusivamente el arreglo del
carrito: no conoce el catálogo ni dibuja nada. Por eso `agregarProducto()`
recibe el **objeto producto completo** y no un código — quien llama ya lo tiene.

**Ámbito global.** Los archivos JavaScript se cargan como scripts clásicos y
comparten un único ámbito global (45 identificadores, sin colisiones). Cada uno
define su punto de entrada `iniciarX()` sobre `DOMContentLoaded` y retorna de
inmediato si su contenedor no existe, de modo que es inofensivo en las páginas
que no lo usan.

**Parciales.** El encabezado y el pie de página existen una sola vez, en
`partials/`. `layout.js` los inyecta en los contenedores `data-parcial` de cada
página. Esto convierte en estructural el requisito RF-01, en lugar de depender
de copiar y pegar en diez archivos.

---

## 6. Decisiones de diseño registradas

| ID | Decisión | Justificación |
|---|---|---|
| **DEC-01** | El catálogo se lee de un JSON externo, no de un arreglo en el código | Aproxima la estructura a la API REST de EV3 y permite migrar sin reescribir las vistas |
| **DEC-02** | Encabezado y pie de página como parciales inyectados | Fuente única de verdad; un parcial se convierte casi directamente en un componente React en EV2 |
| **DEC-03** | PO003 y PL001 quedan con `precio` y `stock` en `null` | El enunciado los nombra pero nunca los detalla. Registrar el vacío es más honesto que inventar datos. **Pendiente de resolver con el docente** |
| **DEC-04** | El campo `origen` dice «Chile» en 7 de 9 productos | El enunciado solo declara origen real para FR001 (Valle del Maule) y VR001 (Región de O'Higgins) |
| **DEC-05** | Las fotos de producto se extrajeron del PDF del enunciado | Son las imágenes oficiales del caso. Resolución 260×260 px, suficiente para las tarjetas del catálogo |
| **DEC-06** | JavaScript con ámbito global, sin módulos ES | Coincide con el patrón enseñado en clase y permite manejadores `onclick` en línea. Se migra a módulos en EV2 con React |
| **DEC-07** | Clave `huertohogar-carrito` en vez de `carrito` | Evita colisiones con otros proyectos servidos desde el mismo `localhost` durante el desarrollo |
| **DEC-08** | El carrito se lee de `localStorage` en cada operación | Evita que dos pestañas abiertas sobrescriban mutuamente los datos |

---

## 7. Inconsistencias detectadas en el enunciado

Se documentan por transparencia y porque afectan decisiones de implementación.

| # | Inconsistencia | Tratamiento adoptado |
|---|---|---|
| 1 | La p. 1 indica «más de 9 puntos a lo largo del país» pero solo nombra **7 ciudades** | Se usará la cifra de 7 tiendas, coherente con el mapa. **Por confirmar** |
| 2 | El enunciado escribe «Villarica»; la ciudad chilena es **Villarrica** | Se adopta la grafía correcta |
| 3 | PO003 y PL001 se listan pero nunca se detallan | Ver DEC-03 |
| 4 | Los nombres de color no corresponden a sus valores hexadecimales | Se respeta el hexadecimal (ver RNF-01) |

---

## 8. Estado de avance de EV1

| Área | Avance |
|---|---|
| Estructura y navegación | ✅ completo |
| Diseño visual (paleta, tipografía, textura) | ✅ completo |
| Catálogo y filtros | ✅ completo |
| Detalle de producto | ✅ completo |
| Carrito | ✅ completo, con confirmación de pedido y boleta |
| Formularios y validaciones | ✅ completo (registro, login, perfil, contacto) |
| Contenido institucional (Nosotros, Blog, Contacto) | ✅ completo |
| Mapa de tiendas | ⏸ diferido a EV2; en su lugar va la lista de las 7 tiendas |
| Documentación (este ERS) | 🔄 iniciado, según corresponde a EV1 |

### Pendientes conocidos

1. **Mapa de tiendas (RF-41).** Se difiere a EV2. El enunciado lo plantea como
   un deseo («nos gustaría») y no como requisito, y Leaflet no alcanzaba a
   entrar antes de la entrega de EV1. `nosotros.html` muestra en su lugar la
   lista de las 7 tiendas, que es el dato que el mapa iba a comunicar.
2. **PO003 y PL001 sin precio ni stock (DEC-03).** Se muestran en el catálogo
   como «Precio a confirmar» y con el botón de agregar desactivado, tanto en la
   tarjeta como en la ficha. Falta resolver los datos con el docente.
3. **Búsqueda por texto (RF-14).** Diferida a EV2, donde el filtrado se rehace
   con componentes de React.
4. Validar el alcance definitivo con el docente (§1.3).

---

## 9. Ejecución del sistema

El sitio requiere un servidor HTTP local, porque `fetch()` está bloqueado bajo
`file://` (restricción R-02). Desde la **raíz del repositorio**:

```bash
npx serve .
```

y abrir `http://localhost:3000/frontend/`. Alternativamente, la extensión Live
Server de VS Code abriendo la carpeta desde la raíz del proyecto.

> Servir la carpeta `frontend/` en vez de la raíz **no funciona**: la ruta
> `../database/productos.json` quedaría por encima del directorio raíz del
> servidor.

---

## 10. Historial de versiones

| Versión | Fecha | Etapa | Cambios |
|---|---|---|---|
| 1.0 | 2026-09-11 | EV1 | Versión inicial: alcance, requisitos, modelo de datos, arquitectura y decisiones de diseño |
| 1.1 | 2026-09-13 | EV1 | Estados de los requisitos puestos al día con lo efectivamente construido. RF-50 (confirmación de pedido y boleta) pasa a implementado y sale de los diferidos; RF-41 (mapa) se difiere a EV2; RF-42 y RF-43 quedan implementados. Se actualizan §5.3 y §8 |
