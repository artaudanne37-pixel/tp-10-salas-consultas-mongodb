const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  const cuerpo =
    req.body && typeof req.body === "object" && !Array.isArray(req.body)
      ? req.body
      : {};

  const estudiante =
    typeof cuerpo.estudiante === "string" ? cuerpo.estudiante.trim() : "";
  const email = typeof cuerpo.email === "string" ? cuerpo.email.trim() : "";
  const sala = typeof cuerpo.sala === "string" ? cuerpo.sala.trim() : "";
  const fecha = typeof cuerpo.fecha === "string" ? cuerpo.fecha.trim() : "";
  const turno = typeof cuerpo.turno === "string" ? cuerpo.turno.trim() : "";
  const personasOriginal =
    typeof cuerpo.personas === "string" ? cuerpo.personas.trim() : "";

  const personas = Number(personasOriginal);

  const valores = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: personasOriginal,
  };

  function rechazar(mensaje) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      seccion: res.locals.seccion,
      error: mensaje,
      valores,
    });
  }

  if (!estudiante || !email || !sala || !fecha || !turno || !personasOriginal) {
    return rechazar("Todos los campos son obligatorios.");
  }

  if (!email.includes("@")) {
    return rechazar("El email debe contener @.");
  }

  if (!salasPermitidas.includes(sala)) {
    return rechazar("La sala seleccionada no es válida.");
  }

  if (!turnosPermitidos.includes(turno)) {
    return rechazar("El turno seleccionado no es válido.");
  }

  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    return rechazar(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
};
