const mongoose = require("mongoose");

const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
const estadosPermitidos = ["pendiente", "confirmada"];

const camposReserva = [
  "estudiante",
  "email",
  "sala",
  "fecha",
  "turno",
  "personas",
];

const camposPut = [...camposReserva, "estado"];

function crearControladorApiReservas(servicio) {
  function validarObjeto(cuerpo) {
    return cuerpo && typeof cuerpo === "object" && !Array.isArray(cuerpo);
  }

  function validarId(id) {
    return mongoose.isObjectIdOrHexString(id);
  }

  function validarTexto(valor) {
    return typeof valor === "string" && valor.trim() !== "";
  }

  function validarPersonas(valor) {
    const personas =
      typeof valor === "string" && valor.trim() !== "" ? Number(valor) : valor;

    return Number.isInteger(personas) && personas >= 1 && personas <= 6
      ? personas
      : null;
  }

  function validarDatos(datos, campos, parcial = false) {
    const permitidos = new Set(campos);

    if (Object.keys(datos).some((campo) => !permitidos.has(campo))) {
      return null;
    }

    if (!parcial && campos.some((campo) => datos[campo] === undefined)) {
      return null;
    }

    if (parcial && Object.keys(datos).length === 0) {
      return null;
    }

    const resultado = {};

    for (const campo of campos) {
      if (datos[campo] === undefined) {
        continue;
      }

      if (campo === "personas") {
        const personas = validarPersonas(datos.personas);

        if (personas === null) {
          return null;
        }

        resultado.personas = personas;
        continue;
      }

      if (campo === "estado") {
        if (!estadosPermitidos.includes(datos.estado)) {
          return null;
        }

        resultado.estado = datos.estado;
        continue;
      }

      if (!validarTexto(datos[campo])) {
        return null;
      }

      resultado[campo] = datos[campo].trim();
    }

    if (resultado.email !== undefined && !resultado.email.includes("@")) {
      return null;
    }

    if (
      resultado.sala !== undefined &&
      !salasPermitidas.includes(resultado.sala)
    ) {
      return null;
    }

    if (
      resultado.turno !== undefined &&
      !turnosPermitidos.includes(resultado.turno)
    ) {
      return null;
    }

    return resultado;
  }

  async function listar(req, res) {
    const parametrosPermitidos = ["sala", "orden", "pagina", "limite"];

    if (
      Object.keys(req.query).some(
        (parametro) => !parametrosPermitidos.includes(parametro),
      )
    ) {
      return res.status(400).json({
        error: "Hay parámetros de consulta no permitidos.",
      });
    }

    const { sala, orden, pagina, limite } = req.query;

    // Rechazar parámetros repetidos.
    if (
      [sala, orden, pagina, limite].some(
        (valor) => valor !== undefined && typeof valor !== "string",
      )
    ) {
      return res.status(400).json({
        error: "No se permiten parámetros repetidos.",
      });
    }

    let salaValidada;

    if (sala !== undefined) {
      salaValidada = sala.trim();

      if (!salasPermitidas.includes(salaValidada)) {
        return res.status(400).json({
          error: "El filtro sala no es válido.",
        });
      }
    }

    const ordenesPermitidos = ["estudiante", "personas-asc", "personas-desc"];

    if (orden !== undefined && !ordenesPermitidos.includes(orden)) {
      return res.status(400).json({
        error: "El orden solicitado no es válido.",
      });
    }

    const paginaNumero = pagina === undefined ? 1 : Number(pagina);
    const limiteNumero = limite === undefined ? 2 : Number(limite);

    if (
      (pagina !== undefined &&
        (!/^\d+$/.test(pagina) || paginaNumero < 1 || paginaNumero > 1000)) ||
      (limite !== undefined &&
        (!/^\d+$/.test(limite) || limiteNumero < 1 || limiteNumero > 20))
    ) {
      return res.status(400).json({
        error: "La paginación no es válida.",
      });
    }

    const resultado = await servicio.consultar(
      salaValidada,
      orden || "estudiante",
      paginaNumero,
      limiteNumero,
    );

    res.status(200).json(resultado);
  }

  async function obtenerPorId(req, res) {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        error: "El ID de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicio.obtenerPorId(id);

    if (!reserva) {
      return res.status(404).json({
        error: "No se encontró la reserva solicitada.",
      });
    }

    res.status(200).json(reserva);
  }

  async function crear(req, res) {
    if (!validarObjeto(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON.",
      });
    }

    const datos = validarDatos(req.body, camposReserva);

    if (!datos) {
      return res.status(400).json({
        error: "Los datos de la reserva no son válidos.",
      });
    }

    const reserva = await servicio.crear(datos);

    res.location(`/api/reservas/${reserva.id}`).status(201).json(reserva);
  }

  async function reemplazar(req, res) {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        error: "El ID de la reserva no tiene un formato válido.",
      });
    }

    if (!validarObjeto(req.body)) {
      return res.status(400).json({
        error: "El cuerpo debe ser un objeto JSON.",
      });
    }

    const datos = validarDatos(req.body, camposPut);

    if (!datos) {
      return res.status(400).json({
        error: "Para reemplazar, se deben enviar todos los campos válidos.",
      });
    }

    const reserva = await servicio.reemplazar(id, datos);

    if (!reserva) {
      return res.status(404).json({
        error: "No se encontró la reserva solicitada.",
      });
    }

    res.status(200).json(reserva);
  }

  async function actualizarParcialmente(req, res) {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        error: "El ID de la reserva no tiene un formato válido.",
      });
    }

    if (!validarObjeto(req.body)) {
      return res.status(400).json({
        error: "El cuerpo debe ser un objeto JSON.",
      });
    }

    const camposPatch = ["personas", "estado"];
    const datos = validarDatos(req.body, camposPatch, true);

    if (!datos) {
      return res.status(400).json({
        error:
          "Solo se permite modificar personas o estado con valores válidos.",
      });
    }

    const reserva = await servicio.actualizarParcialmente(id, datos);

    if (!reserva) {
      return res.status(404).json({
        error: "No se encontró la reserva solicitada.",
      });
    }

    res.status(200).json(reserva);
  }

  async function eliminar(req, res) {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        error: "El ID de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicio.eliminar(id);

    if (!reserva) {
      return res.status(404).json({
        error: "No se encontró la reserva solicitada.",
      });
    }

    res.status(204).end();
  }

  return {
    listar,
    obtenerPorId,
    crear,
    reemplazar,
    actualizarParcialmente,
    eliminar,
  };
}

module.exports = { crearControladorApiReservas };
