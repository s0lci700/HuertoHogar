// Formularios de registro, login y perfil.
//
// EV1 no tiene backend todavía: registro y login son una SIMULACIÓN que vive
// solo en el localStorage de este navegador. No es autenticación segura — se
// reemplaza por Spring Boot + JWT en EV3 (ver CLAUDE.md).
//
// La clave USUARIO_KEY está declarada en layout.js, que se carga en todas las
// páginas.

// Reglas mínimas que pide el taller. Van como constantes para que la validación
// y el texto del error no se puedan desincronizar.
const LARGO_MINIMO_PASSWORD = 4;
const LARGO_MINIMO_NOMBRE = 3;
const LARGO_MINIMO_DIRECCION = 5;
const LARGO_MINIMO_MENSAJE = 10;
const DIGITOS_MINIMOS_TELEFONO = 8;
const DIGITOS_MAXIMOS_TELEFONO = 12;
// Lo único que se acepta además de los dígitos, porque es como la gente separa
// un teléfono al escribirlo.
const SEPARADORES_TELEFONO = " ()+-";

// Muestra el mensaje de error de un campo y lo marca visualmente.
// `campo` es el <input>; el <p class="error"> es hermano suyo dentro de .campo.
function mostrarError(campo, mensaje) {
  const contenedor = campo.closest(".campo");
  const error = contenedor && contenedor.querySelector(".error");
  if (error) error.textContent = mensaje;

  campo.classList.add("invalido");
  // aria-invalid hace que el lector de pantalla anuncie el campo como erróneo:
  // el borde rojo por sí solo no le comunica nada a quien no lo ve.
  campo.setAttribute("aria-invalid", "true");
}

// Limpia el mensaje de error de un campo.
function limpiarError(campo) {
  const contenedor = campo.closest(".campo");
  const error = contenedor && contenedor.querySelector(".error");
  if (error) error.textContent = "";

  campo.classList.remove("invalido");
  campo.removeAttribute("aria-invalid");
}

// Valida el formato del correo.
//
// El taller valida con email.includes("@") y nada más. Acá se piden cuatro
// cosas, que son las que separan "ana@correo.cl" de "@correo.cl", "ana@",
// "ana@correo." y "ana perez@correo.cl". Va con indexOf y length a propósito
// y no con una expresión regular: la regla se tiene que poder leer y explicar
// línea por línea.
function validarEmail(valor) {
  const correo = valor.trim();
  const arroba = correo.indexOf("@");
  const punto = correo.lastIndexOf(".");

  // Un espacio en cualquier parte descarta el correo.
  if (correo.includes(" ")) return false;

  // Tiene que haber al menos un carácter antes del "@". indexOf devuelve 0 si
  // el "@" va primero, y -1 si no hay "@" en ninguna parte.
  if (arroba < 1) return false;

  // Y tiene que haber uno solo: si el primer "@" y el último no son el mismo,
  // hay más de uno ("ana@@correo.cl").
  if (arroba !== correo.lastIndexOf("@")) return false;

  // El último punto tiene que venir después del "@", con al menos un carácter
  // de dominio entremedio: en "ana@.cl" el punto va pegado al "@".
  if (punto < arroba + 2) return false;

  // Y tiene que quedar algo después del punto, para que exista el ".cl".
  if (punto === correo.length - 1) return false;

  return true;
}

// El taller pide mínimo 4 caracteres. Acá no se hace trim: los espacios son
// parte legítima de una contraseña.
function validarPassword(valor) {
  return valor.length >= LARGO_MINIMO_PASSWORD;
}

// Número de contacto. La gente escribe el teléfono de muchas formas
// ("+56 9 1234 5678", "(2) 2345 6789", "912345678"), así que en vez de exigir
// un formato se recorre el texto carácter por carácter, se juntan solo los
// dígitos y se ignora el resto. Un celular chileno tiene 9 dígitos; el rango
// deja espacio para los fijos y para el código de país.
function validarTelefono(valor) {
  let digitos = "";

  for (let i = 0; i < valor.length; i++) {
    const caracter = valor.charAt(i);

    if (caracter >= "0" && caracter <= "9") {
      digitos = digitos + caracter;
    } else if (!SEPARADORES_TELEFONO.includes(caracter)) {
      // Una letra o un símbolo raro descarta el número entero. Si no,
      // "9123456a8" pasaría: se le caería la letra y quedarían 8 dígitos.
      return false;
    }
  }

  return (
    digitos.length >= DIGITOS_MINIMOS_TELEFONO &&
    digitos.length <= DIGITOS_MAXIMOS_TELEFONO
  );
}

// Guarda el usuario bajo USUARIO_KEY.
// OJO: la contraseña queda en texto plano en localStorage. Es aceptable solo
// porque EV1 simula la autenticación dentro del navegador; en EV3 la contraseña
// se hashea en el backend y nunca se guarda en el front.
function guardarUsuario(usuario) {
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

// Lee el usuario guardado (o null si no hay sesión).
// Delega en layout.js, que es el único archivo cargado en las 10 páginas.
// Duplicar acá el JSON.parse sería además peligroso: estos scripts son globales
// y el último en cargarse pisa las funciones del anterior.
function obtenerUsuario() {
  return leerUsuarioGuardado();
}

// Devuelve el <input> con ese name y le borra el error anterior, para no
// repetir las dos líneas en cada validación.
function leerCampo(form, nombre) {
  const campo = form.elements[nombre];
  limpiarError(campo);
  return campo;
}

// Mensaje general del formulario (el que no pertenece a un campo puntual).
// `tipo` es "alerta" o "exito"; ambas clases están definidas en main.css.
function mostrarMensaje(id, texto, tipo) {
  const mensaje = document.getElementById(id);
  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.className = `form-mensaje ${tipo}`;
}

// form-registro: valida nombre, email, password y confirmación; si todo está
// bien guarda el usuario y redirige a perfil.html.
function iniciarRegistro() {
  const form = document.getElementById("form-registro");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    // El <form> lleva novalidate, así que sin este preventDefault la página se
    // recargaría antes de que se alcance a ver un solo error.
    event.preventDefault();

    const nombre = leerCampo(form, "nombre");
    const email = leerCampo(form, "email");
    const password = leerCampo(form, "password");
    const confirmacion = leerCampo(form, "confirmacion");

    // Se revisan los cuatro campos y recién después se corta: si se retornara
    // en el primer error, habría que enviar el formulario cuatro veces para
    // descubrir los cuatro problemas.
    let valido = true;

    if (nombre.value.trim().length < LARGO_MINIMO_NOMBRE) {
      mostrarError(nombre, `El nombre debe tener al menos ${LARGO_MINIMO_NOMBRE} caracteres.`);
      valido = false;
    }

    if (!validarEmail(email.value)) {
      mostrarError(email, "Escribe un correo válido, por ejemplo nombre@correo.cl.");
      valido = false;
    }

    if (!validarPassword(password.value)) {
      mostrarError(password, `La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres.`);
      valido = false;
    }

    if (confirmacion.value !== password.value) {
      mostrarError(confirmacion, "Las dos contraseñas no coinciden.");
      valido = false;
    }

    if (!valido) {
      mostrarMensaje("registro-mensaje", "Revisa los campos marcados.", "alerta");
      return;
    }

    // El correo se guarda en minúsculas para que el login no falle por haberlo
    // escrito distinto. Dirección y teléfono se completan en perfil.html.
    guardarUsuario({
      nombre: nombre.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
      direccion: "",
      telefono: "",
    });

    location.href = "perfil.html";
  });
}

// form-login: valida el formato y después compara contra el usuario guardado.
function iniciarLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = leerCampo(form, "email");
    const password = leerCampo(form, "password");
    let valido = true;

    if (!validarEmail(email.value)) {
      mostrarError(email, "Escribe un correo válido, por ejemplo nombre@correo.cl.");
      valido = false;
    }

    if (!validarPassword(password.value)) {
      mostrarError(password, `La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres.`);
      valido = false;
    }

    if (!valido) {
      mostrarMensaje("login-mensaje", "Revisa los campos marcados.", "alerta");
      return;
    }

    // Sin backend, "la base de datos" es el único usuario guardado en este
    // navegador: si no existe, no hay contra qué comparar.
    const usuario = obtenerUsuario();
    if (!usuario) {
      mostrarMensaje(
        "login-mensaje",
        "Todavía no hay una cuenta creada en este navegador. Regístrate primero.",
        "alerta"
      );
      return;
    }

    // El mensaje no dice cuál de los dos datos falló: es la práctica habitual
    // para no confirmarle a nadie qué correos están registrados.
    const coincide =
      usuario.email === email.value.trim().toLowerCase() &&
      usuario.password === password.value;

    if (!coincide) {
      mostrarMensaje("login-mensaje", "El correo o la contraseña no coinciden.", "alerta");
      return;
    }

    location.href = "perfil.html";
  });
}

// form-perfil: precarga los datos guardados y, al enviar, actualiza nombre,
// dirección y teléfono.
function iniciarPerfil() {
  const form = document.getElementById("form-perfil");
  if (!form) return;

  const usuario = obtenerUsuario();

  // Guarda de interfaz, no de seguridad: sin backend cualquiera puede escribir
  // localStorage a mano. En EV3 esto lo resuelve el token JWT.
  if (!usuario) {
    form.hidden = true;
    mostrarMensaje("perfil-mensaje", "Necesitas iniciar sesión para ver tu perfil.", "alerta");
    return;
  }

  form.elements.nombre.value = usuario.nombre || "";
  form.elements.email.value = usuario.email || "";
  form.elements.direccion.value = usuario.direccion || "";
  form.elements.telefono.value = usuario.telefono || "";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = leerCampo(form, "nombre");
    const direccion = leerCampo(form, "direccion");
    const telefono = leerCampo(form, "telefono");
    let valido = true;

    if (nombre.value.trim().length < LARGO_MINIMO_NOMBRE) {
      mostrarError(nombre, `El nombre debe tener al menos ${LARGO_MINIMO_NOMBRE} caracteres.`);
      valido = false;
    }

    if (direccion.value.trim().length < LARGO_MINIMO_DIRECCION) {
      mostrarError(direccion, "Escribe la dirección donde quieres recibir tu pedido.");
      valido = false;
    }

    if (!validarTelefono(telefono.value)) {
      mostrarError(telefono, "Escribe un número de contacto válido, por ejemplo +56 9 1234 5678.");
      valido = false;
    }

    if (!valido) {
      mostrarMensaje("perfil-mensaje", "Revisa los campos marcados.", "alerta");
      return;
    }

    // Se reescribe el usuario completo con el spread para no perder el correo
    // ni la contraseña, que este formulario no edita.
    guardarUsuario({
      ...usuario,
      nombre: nombre.value.trim(),
      direccion: direccion.value.trim(),
      telefono: telefono.value.trim(),
    });

    mostrarMensaje("perfil-mensaje", "Listo, tus datos quedaron actualizados.", "exito");

    // El encabezado muestra el nombre del usuario, así que hay que repintarlo
    // para que no siga mostrando el anterior.
    actualizarAcciones();
    marcarNavActivo();
  });
}

// form-contacto: valida nombre, correo y mensaje.
//
// No hay a dónde enviarlo: EV1 no tiene backend, así que el formulario
// confirma en pantalla y se limpia. En EV3 esto pasa a ser un POST al API.
function iniciarContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = leerCampo(form, "nombre");
    const email = leerCampo(form, "email");
    const mensaje = leerCampo(form, "mensaje");
    let valido = true;

    if (nombre.value.trim().length < LARGO_MINIMO_NOMBRE) {
      mostrarError(nombre, `El nombre debe tener al menos ${LARGO_MINIMO_NOMBRE} caracteres.`);
      valido = false;
    }

    if (!validarEmail(email.value)) {
      mostrarError(email, "Escribe un correo válido, por ejemplo nombre@correo.cl.");
      valido = false;
    }

    if (mensaje.value.trim().length < LARGO_MINIMO_MENSAJE) {
      mostrarError(mensaje, `Cuéntanos un poco más: al menos ${LARGO_MINIMO_MENSAJE} caracteres.`);
      valido = false;
    }

    if (!valido) {
      mostrarMensaje("contacto-mensaje", "Revisa los campos marcados.", "alerta");
      return;
    }

    form.reset();
    mostrarMensaje(
      "contacto-mensaje",
      `Gracias, ${nombre.value.trim()}. Recibimos tu mensaje y te respondemos a ${email.value.trim()}.`,
      "exito"
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarRegistro();
  iniciarLogin();
  iniciarPerfil();
  iniciarContacto();
});
