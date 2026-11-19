const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const {
  identificarSolicitud,
  medirDuracion,
  crearMorgan,
} = require("./middleware/solicitudes");

const { crearRouterReservas } = require("./rutas/reservas");
const { crearRouterApiReservas } = require("./rutas/api-reservas");
const { crearControladorReservas } = require("./controladores/reservas");

function crearApp(servicio, formatoMorgan) {
  const app = express();
  const controlador = crearControladorReservas(servicio);

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");

  app.use(crearMorgan(formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/", controlador.inicio);
  app.get("/estado", controlador.estado);

  app.use("/api/reservas", crearRouterApiReservas(servicio));
  app.use("/reservas", crearRouterReservas(servicio));

  // Rutas de API inexistentes: respuesta JSON.
  app.use("/api", (req, res) => {
    res.status(404).json({
      error: "La ruta de API solicitada no existe.",
    });
  });

  // Páginas inexistentes: respuesta HTML.
  app.use(controlador.noEncontrado);

  // Manejo centralizado de errores.
  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    const esErrorDeEntrada =
      error instanceof SyntaxError ||
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.status === 400 ||
      error.statusCode === 400;

    const estado = esErrorDeEntrada ? 400 : 500;

    if (req.originalUrl.startsWith("/api")) {
      return res.status(estado).json({
        error:
          estado === 400
            ? "La solicitud contiene datos inválidos."
            : "Ocurrió un error interno del servidor.",
      });
    }

    return res
      .status(estado)
      .send(
        estado === 400
          ? "La solicitud contiene datos inválidos."
          : "Ocurrió un error interno del servidor.",
      );
  });

  return app;
}

module.exports = { crearApp };
