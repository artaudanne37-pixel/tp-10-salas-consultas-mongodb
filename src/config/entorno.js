function leerConfiguracion(entorno = process.env) {
  const valorPuerto = entorno.PORT ?? "3000";
  const puerto = Number(valorPuerto);

  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error("PORT debe ser un número entero entre 1 y 65535.");
  }

  const entornoNode = entorno.NODE_ENV ?? "development";

  return {
    puerto,
    entorno: entornoNode,
    formatoMorgan: entornoNode === "production" ? "combined" : "dev",
  };
}

function leerUriMongo(entorno = process.env) {
  const uri = entorno.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("Falta configurar MONGODB_URI en el entorno.");
  }

  return uri;
}

module.exports = { leerConfiguracion, leerUriMongo };
