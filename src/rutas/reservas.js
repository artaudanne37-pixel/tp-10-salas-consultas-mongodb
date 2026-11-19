const express = require("express");

const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");

const { crearControladorReservas } = require("../controladores/reservas");

function crearRouterReservas(servicio) {
  const router = express.Router();
  const controlador = crearControladorReservas(servicio);

  router.use(prepararAreaReservas);

  router.get("/", controlador.listar);
  router.get("/nueva", controlador.nueva);
  router.get("/:id", controlador.detalle);
  router.post("/", validarReserva, controlador.crear);

  return router;
}

module.exports = { crearRouterReservas };
