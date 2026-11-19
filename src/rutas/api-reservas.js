const express = require("express");
const {
  crearControladorApiReservas,
} = require("../controladores/api-reservas");

function crearRouterApiReservas(servicio) {
  const router = express.Router();
  const controlador = crearControladorApiReservas(servicio);

  router.get("/", controlador.listar);
  router.get("/:id", controlador.obtenerPorId);
  router.post("/", controlador.crear);
  router.put("/:id", controlador.reemplazar);
  router.patch("/:id", controlador.actualizarParcialmente);
  router.delete("/:id", controlador.eliminar);

  return router;
}

module.exports = { crearRouterApiReservas };
