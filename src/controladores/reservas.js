function crearControladorReservas(servicio) {
  function inicio(req, res) {
    res.render("inicio", { titulo: "Inicio" });
  }

  async function estado(req, res) {
    const cantidad = await servicio.contar();

    res.json({
      servicio: "activo",
      reservas: cantidad,
      solicitudId: res.locals.solicitudId,
    });
  }

  async function listar(req, res) {
    const reservas = await servicio.listar();

    res.render("reservas/lista", {
      titulo: "Reservas",
      reservas,
      seccion: res.locals.seccion,
    });
  }

  function nueva(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      seccion: res.locals.seccion,
      error: null,
      valores: {},
    });
  }

  async function detalle(req, res) {
    const reserva = await servicio.obtenerPorId(req.params.id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
      });
    }

    res.render("reservas/detalle", {
      titulo: "Detalle de reserva",
      reserva,
      seccion: res.locals.seccion,
    });
  }

  async function crear(req, res) {
    await servicio.crear(req.reservaValidada);
    res.redirect(302, "/reservas");
  }

  function noEncontrado(req, res) {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
    });
  }

  return {
    inicio,
    estado,
    listar,
    nueva,
    detalle,
    crear,
    noEncontrado,
  };
}

module.exports = { crearControladorReservas };
