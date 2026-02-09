/**
 * DEFINICIÓN DE ROLES DE USUARIO
 * Constantes que definen los niveles de acceso y jerarquía en el sistema.
 * Se utilizan para el control de permisos en backend y frontend.
 * Uso: RequestController.js, abencesController.js
 */
const rolUser = {
    ADMIN: "Admin",
    WORKER: "Empleado",
    SUPERVISOR: "Supervisor",
    DIRECTOR: "Director",
    RRHH: "Jefe de Administración"
}

module.exports = rolUser;