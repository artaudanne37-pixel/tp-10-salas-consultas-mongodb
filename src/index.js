const { leerConfiguracion } = require("./config/entorno");
const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("./config/base-datos");
const servicio = require("./servicios/reservas");
const { crearApp } = require("./app");

const configuracion = leerConfiguracion();
const app = crearApp(servicio, configuracion.formatoMorgan);

async function iniciarServidor() {
  await conectarBaseDatos();

  const servidor = app.listen(configuracion.puerto, () => {
    console.log(
      "Servidor ejecutándose en http://localhost:" + configuracion.puerto,
    );
  });

  async function cerrarServidor() {
    console.log("\nCerrando servidor...");

    servidor.close(async (error) => {
      try {
        await desconectarBaseDatos();

        console.log("Conexión con MongoDB cerrada.");

        if (error) {
          console.error("Error al cerrar el servidor:", error);
          process.exitCode = 1;
        }
      } catch (errorDesconexion) {
        console.error(
          "Error al desconectar MongoDB:",
          errorDesconexion.message,
        );
        process.exitCode = 1;
      }
    });
  }

  process.once("SIGINT", cerrarServidor);
  process.once("SIGTERM", cerrarServidor);
}

iniciarServidor().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error.message);
  process.exitCode = 1;
});
