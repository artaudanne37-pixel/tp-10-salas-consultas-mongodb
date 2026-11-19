const mongoose = require("mongoose");
const Reserva = require("../modelos/reserva");

const ordenesPermitidos = {
  estudiante: { estudiante: 1, _id: 1 },
  "personas-asc": { personas: 1, _id: 1 },
  "personas-desc": { personas: -1, _id: 1 },
};

function representarReserva(reserva) {
  return {
    id: reserva._id.toString(),
    estudiante: reserva.estudiante,
    email: reserva.email,
    sala: reserva.sala,
    fecha: reserva.fecha,
    turno: reserva.turno,
    personas: reserva.personas,
    estado: reserva.estado,
  };
}

async function listar(filtro = {}) {
  const reservas = await Reserva.find(filtro).lean();

  return reservas.map(representarReserva);
}

async function consultar(sala, orden = "estudiante", pagina = 1, limite = 2) {
  const filtro = {};

  if (sala) {
    filtro.sala = sala;
  }

  const sort = ordenesPermitidos[orden] || ordenesPermitidos.estudiante;
  const salto = (pagina - 1) * limite;

  const total = await Reserva.countDocuments(filtro);

  const reservas = await Reserva.find(filtro)
    .select("estudiante email sala fecha turno personas estado")
    .sort(sort)
    .skip(salto)
    .limit(limite)
    .lean();

  return {
    datos: reservas.map(representarReserva),
    pagina,
    limite,
    total,
    paginas: Math.ceil(total / limite),
  };
}

async function obtenerPorId(id) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return null;
  }

  const reserva = await Reserva.findById(id).lean();

  return reserva ? representarReserva(reserva) : null;
}

async function contar() {
  return Reserva.countDocuments();
}

async function crear(datos) {
  const reserva = await Reserva.create({
    estudiante: datos.estudiante,
    email: datos.email,
    sala: datos.sala,
    fecha: datos.fecha,
    turno: datos.turno,
    personas: datos.personas,
  });

  return representarReserva(reserva);
}

async function reemplazar(id, datos) {
  const reserva = await Reserva.findByIdAndUpdate(
    id,
    {
      estudiante: datos.estudiante,
      email: datos.email,
      sala: datos.sala,
      fecha: datos.fecha,
      turno: datos.turno,
      personas: datos.personas,
      estado: datos.estado,
    },
    {
      new: true,
      runValidators: true,
      overwrite: true,
      upsert: false,
    },
  );

  return reserva ? representarReserva(reserva) : null;
}

async function actualizarParcialmente(id, datos) {
  const cambios = {};

  if (datos.personas !== undefined) {
    cambios.personas = datos.personas;
  }

  if (datos.estado !== undefined) {
    cambios.estado = datos.estado;
  }

  const reserva = await Reserva.findByIdAndUpdate(
    id,
    { $set: cambios },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  );

  return reserva ? representarReserva(reserva) : null;
}

async function eliminar(id) {
  const reserva = await Reserva.findByIdAndDelete(id);

  return reserva ? representarReserva(reserva) : null;
}

module.exports = {
  listar,
  consultar,
  obtenerPorId,
  contar,
  crear,
  reemplazar,
  actualizarParcialmente,
  eliminar,
};
