/// <reference lib="webworker" />

import { obtenerDatosAislador } from "../funciones/Aislador";
import { cargarTablaAWG } from "../funciones/Cargar_tablas";
import {
  longituddecable,
  Enrolado,
  buscarValor_1,
  opciones3,
} from "../funciones/Calculos";

// 👇 Asegura que `self` es un Worker
const ctx: DedicatedWorkerGlobalScope = self as any;

ctx.onmessage = async function (e: MessageEvent) {
  const { Voltaje, Potencia, Longitud, diametro_tubo } = e.data;

  // Calcula la resistencia
  const Resistencia_1 = Math.pow(Voltaje, 2) / Potencia;

  // Obtiene los datos del aislador
  let datosAislador = await obtenerDatosAislador(diametro_tubo);
  if (!datosAislador) {
    ctx.postMessage({ error: "No se encontró el aislador." });
    return;
  }

  let diametro_Aislador = datosAislador.diametro_final;
  let mitad_tubo = Longitud / 2; // Se ajusta la longitud

  // Cargar la tabla AWG
  const tablaAWG = await new Promise<any[]>((resolve) =>
    cargarTablaAWG(resolve)
  );
  if (!tablaAWG || tablaAWG.length === 0) {
    ctx.postMessage({ error: "No se cargaron datos de la tabla AWG." });
    return;
  }

  // Extraer datos de la tabla
  const T_Calibre = tablaAWG.map((row) => row.calibre);
  const T_Diametro = tablaAWG.map((row) => row.diametro);
  const T_Resistividad = tablaAWG.map((row) => row.resistividad);

  let resultados: number[][] = [];

  // Cálculos en bloques de columnas
  for (let columna = 7; columna <= 17; columna++) {
    let resultados_temp: number[][] = [];

    for (let fila = 0; fila < T_Calibre.length; fila++) {
      // Calcular longitud del cable
      const longitudCable = await longituddecable(
        T_Calibre[fila],
        Resistencia_1,
        T_Resistividad[fila]
      );

      if (typeof longitudCable !== "number" || isNaN(longitudCable)) continue;

      // Calcular enrolado
      const resultado_columna1 = Enrolado(
        longitudCable,
        T_Diametro[columna],
        T_Diametro[fila]
      );

      if (typeof resultado_columna1 !== "number" || isNaN(resultado_columna1))
        continue;

      // Calcular diámetro del aislador
      const resultado_columna2 = T_Diametro[columna] + 2 * T_Diametro[fila];

      resultados_temp.push([
        resultado_columna1 * 100,
        resultado_columna2,
        columna + 1,
        fila + 1,
        longitudCable,
      ]);
    }

    for (let fila = 0; fila < T_Calibre.length; fila++) {
      if (!resultados[fila]) resultados[fila] = [];
      if (resultados_temp[fila]) {
        resultados[fila].push(...resultados_temp[fila]);
      }
    }
  }

  // Buscar mejores opciones
  let salida: (number | string)[][] = [];
  for (let columna = 0; columna < resultados[0].length; columna += 5) {
    let rangoDatos = resultados.map((fila) => [
      fila[columna],
      fila[columna + 1],
      fila[columna + 2],
      fila[columna + 3],
      fila[columna + 4],
    ]);

    let mejorOpcion = await buscarValor_1(
      mitad_tubo,
      diametro_tubo,
      rangoDatos
    );
    salida = salida.concat(mejorOpcion);
  }

  let salidaNumerica = salida.map((row) =>
    row.map((value) => (typeof value === "string" ? parseFloat(value) : value))
  );
  let res3 = await opciones3(mitad_tubo, diametro_tubo, salidaNumerica);

  ctx.postMessage({ resultados, res3 });
};
