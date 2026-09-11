// Formularios de registro, login y perfil.
//
// EV1 no tiene backend todavía: registro y login son una SIMULACIÓN que vive
// solo en el localStorage de este navegador. No es autenticación segura — se
// reemplaza por Spring Boot + JWT en EV3 (ver CLAUDE.md).
//
// La clave USUARIO_KEY está declarada en layout.js, que se carga en todas las
// páginas.

// TODO: mostrar el mensaje de error de un campo (y marcarlo visualmente).
function mostrarError(campo, mensaje) {}

// TODO: limpiar el mensaje de error de un campo.
function limpiarError(campo) {}

// TODO: validar formato de correo.
//   - el taller pide como mínimo que contenga "@"
//   - una regex simple es suficiente para EV1
function validarEmail(valor) {}

// TODO: validar la contraseña (el taller pide mínimo 4 caracteres).
function validarPassword(valor) {}

// TODO: guardar el usuario en localStorage bajo USUARIO_KEY.
//   - objeto con { nombre, email, direccion, telefono }
function guardarUsuario(usuario) {}

// TODO: leer el usuario guardado (o null si no hay sesión).
function obtenerUsuario() {}

// TODO: form-registro — validar nombre, email, password y confirmación;
// si todo está bien, guardarUsuario() y redirigir a perfil.html.
function iniciarRegistro() {
  const form = document.getElementById("form-registro");
  if (!form) return;
}

// TODO: form-login — validar email y password contra el usuario guardado;
// si coincide, redirigir a perfil.html.
function iniciarLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;
}

// TODO: form-perfil — precargar los datos del usuario guardado y, al enviar,
// actualizar dirección y teléfono.
function iniciarPerfil() {
  const form = document.getElementById("form-perfil");
  if (!form) return;
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarRegistro();
  iniciarLogin();
  iniciarPerfil();
});
