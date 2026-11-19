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

module.exports = { leerConfiguracion };
