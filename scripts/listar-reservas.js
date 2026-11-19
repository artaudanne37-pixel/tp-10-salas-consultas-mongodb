const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function listarReservas() {
  try {
    await conectarBaseDatos();

    const reservas = await Reserva.find().lean();

    console.log("Reservas encontradas:", reservas.length);
    console.log(reservas);
  } catch (error) {
    console.error("No se pudieron listar las reservas:", error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

listarReservas();
