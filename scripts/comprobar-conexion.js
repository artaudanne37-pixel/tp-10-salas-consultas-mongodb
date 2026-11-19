const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

async function comprobarConexion() {
  try {
    await conectarBaseDatos();
    console.log("Prueba de conexión finalizada correctamente.");
  } catch (error) {
    console.error("No se pudo conectar con MongoDB:", error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

comprobarConexion();
