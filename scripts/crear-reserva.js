const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function crearReserva() {
  try {
    await conectarBaseDatos();

    const reserva = new Reserva({
      estudiante: "Estudiante de prueba",
      email: "prueba@gmail.com",
      sala: "Sala Norte",
      fecha: "2026-10-20",
      turno: "Mañana",
      personas: 2,
    });

    const reservaGuardada = await reserva.save();

    console.log("Reserva guardada correctamente.");
    console.log("ID de la reserva:", reservaGuardada._id);
  } catch (error) {
    console.error("No se pudo guardar la reserva:", error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

crearReserva();
