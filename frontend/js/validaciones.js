// EV1 no tiene backend todavía: registro/login son una simulación que vive
// solo en localStorage de este navegador. Se reemplaza por autenticación
// real (Spring Boot + JWT) en EV3 — ver CLAUDE.md.
(function () {
  // TODO: mostrar/limpiar el mensaje de error de un campo de formulario
  function mostrarError(campo, mensaje) {}

  // TODO: validar formato de correo con una regex simple
  function validarEmail(valor) {}

  // TODO: form-registro — validar nombre/email/password/confirmarPassword,
  // guardar el "usuario" en localStorage y redirigir a perfil.html
  function inicializarRegistro() {}

  // TODO: form-login — validar email/password contra el usuario guardado
  // en localStorage y redirigir a perfil.html si coincide
  function inicializarLogin() {}

  // TODO: form-perfil — precargar los datos del usuario guardado, y al
  // enviar, actualizar dirección/teléfono en localStorage
  function inicializarPerfil() {}

  document.addEventListener('DOMContentLoaded', () => {
    inicializarRegistro();
    inicializarLogin();
    inicializarPerfil();
  });
})();
