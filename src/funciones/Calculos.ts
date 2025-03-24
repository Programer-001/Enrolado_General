import { obtenerDatosAislador } from "./Aislador";
import { cargarTablaAWG } from "./Cargar_tablas";

export const Resistencia = (Voltaje: number, Potencia: number) => {
  return Math.pow(Voltaje, 2) / Potencia;
};

export const Enrolado = (
  Longitud: number,
  Diametro_Guia: number,
  Diametro_alambre: number
): number | string => {
  // Verifica que los parámetros sean números válidos antes de cualquier operación
  if (isNaN(Longitud) || isNaN(Diametro_Guia) || isNaN(Diametro_alambre)) {
    return "Error: Ingresa números válidos";
  }

  // Verifica que Longitud, Diametro_Guia y Diametro_alambre sean números válidos
  if (Longitud <= 0 || Diametro_Guia <= 0 || Diametro_alambre <= 0) {
    return "Error: Los valores deben ser mayores que cero";
  }

  let vueltas = NVueltas(Longitud, Diametro_Guia, Diametro_alambre);

  // Verificar si la función NVueltas devuelve un error
  if (typeof vueltas === "string" && vueltas.startsWith("Error")) {
    return vueltas; // Si hay un error en NVueltas, lo devolvemos
  }

  // Asegúrate de que el resultado de vueltas es un número antes de realizar la multiplicación
  if (typeof vueltas !== "number" || isNaN(vueltas)) {
    return "Error: El cálculo de vueltas no produjo un número válido";
  }

  // Realiza la multiplicación si todo es válido
  return vueltas * Diametro_alambre;
};

export const NVueltas = (
  Longitud: number,
  Diametro_Guia: number,
  Diametro_alambre: number
): number | string => {
  // Verifica que los parámetros sean números válidos
  if (isNaN(Longitud) || isNaN(Diametro_Guia) || isNaN(Diametro_alambre)) {
    return "Error: Ingresa números válidos";
  }

  // Convierte explícitamente a números
  Longitud = Number(Longitud);
  Diametro_Guia = Number(Diametro_Guia);
  Diametro_alambre = Number(Diametro_alambre);

  // Verifica si la conversión fue exitosa
  if (isNaN(Longitud) || isNaN(Diametro_Guia) || isNaN(Diametro_alambre)) {
    return "Error: Los valores convertidos no son números válidos";
  }

  // Comprobamos si la suma de Diametro_Guia y Diametro_alambre es cero
  if (Diametro_Guia + Diametro_alambre === 0) {
    return "Error: La suma de Diametro_Guia y Diametro_alambre no puede ser cero.";
  }

  // Calcula las vueltas de manera segura
  return Longitud / ((Diametro_Guia + Diametro_alambre) * Math.PI);
};

export const longituddecable = async (
  calibre: number,
  resistencia: number,
  resistividad: number
) => {
  // 1. Cargar la tabla usando cargarTablaAWG
  const tablaAWG = await new Promise<any[]>((resolve) => {
    cargarTablaAWG(resolve); // Llama a cargarTablaAWG y resuelve la promesa
  });

  // 2. Si no hay datos cargados, devolver
  if (!tablaAWG || tablaAWG.length === 0) {
    console.error("No se cargaron datos de la tabla");
    return;
  }

  // Crear los arreglos para cada columna
  const T_Calibre = tablaAWG.map((row) => row.calibre);
  const T_Aumento = tablaAWG.map((row) => row.aumento); // Usamos columna 4 (aumento)

  let clave = calibre;
  // Buscar el valor de aumento correspondiente al calibre
  let valorBusqueda = buscarValor(T_Calibre, T_Aumento, clave);

  if (valorBusqueda === null) {
    console.log("Error: No se encontró el valor para " + clave);
    return "Error: No se encontró el valor para " + clave;
  }

  if (resistividad === 0) {
    console.log("Error: División por cero en resistividad");
    return "Error: División por cero";
  }

  let resultado = (valorBusqueda + resistencia) / resistividad;

  //Logger.log("Resultado calculado: " + resultado);
  return resultado; // ✅ Ahora la función solo devuelve el resultado
};

// Función para buscar el valor correspondiente en la tabla (columna de aumento)
export const buscarValor = (
  calibres: number[],
  aumentos: number[],
  clave: number
) => {
  for (let i = 0; i < calibres.length; i++) {
    if (calibres[i] === clave) {
      return aumentos[i]; // Retorna el valor de aumento correspondiente
    }
  }
  return null; // Si no se encuentra el valor, devuelve null
};
export const buscarValor_1 = async (
  valor1: number,
  valor2: string,
  rangoDatos: number[][] // Aseguramos que sea un array de arrays
) => {
  if (!Array.isArray(rangoDatos) || rangoDatos.length === 0) {
    return [["Error: Rango vacío o inválido"]];
  }

  let mejorFila: number[] | null = null;
  let mejorDiferencia = Infinity;

  let diametro_aislador = await obtenerDatosAislador(valor2);
  if (diametro_aislador == null) {
    return [["Error: Valor inválido para el aislador"]];
  }

  for (let i = 0; i < rangoDatos.length; i++) {
    if (Array.isArray(rangoDatos[i]) && rangoDatos[i].length >= 2) {
      let diferencia_1 = Math.abs(rangoDatos[i][0] - valor1);
      let diferencia_2 = Math.abs(
        rangoDatos[i][1] - diametro_aislador.diametro_final
      );

      if (
        rangoDatos[i][0] <= valor1 &&
        rangoDatos[i][1] <= diametro_aislador.diametro_final &&
        diferencia_1 + diferencia_2 < mejorDiferencia
      ) {
        mejorDiferencia = diferencia_1 + diferencia_2;
        mejorFila = rangoDatos[i];
      }
    }
  }

  return mejorFila ? [mejorFila] : [["No encontrado", "-", "-", "-", "-"]];
};

export const opciones3 = async (
  valor1: number,
  valor2: string,
  rangoDatos: (number | string)[][] // 🔹 Aceptamos datos mixtos para convertirlos
): Promise<number[][] | string[][]> => {
  // Verificar si el rango es un array válido
  if (!Array.isArray(rangoDatos) || rangoDatos.length === 0) {
    return [["Error: Rango vacío o inválido"]];
  }

  // 🔹 Convertir `string` a `number`, asegurando que `rangoDatos` sea `number[][]`
  let rangoNumerico: number[][] = rangoDatos.map((row) =>
    row.map((value) => (typeof value === "string" ? parseFloat(value) : value))
  );

  // Obtener datos del aislador
  var diam_ceramica = await obtenerDatosAislador(valor2);
  if (!diam_ceramica) {
    return [["Error: No se encontró un aislador válido"]];
  }

  var resultados: { fila: number[]; diferencia: number }[] = []; // Array para almacenar las diferencias y las filas correspondientes

  // Recorrer cada fila del rango de datos
  for (var i = 0; i < rangoNumerico.length; i++) {
    if (rangoNumerico[i] && rangoNumerico[i].length >= 2) {
      var diferencia_1 = Math.abs(rangoNumerico[i][0] - valor1);
      var diferencia_2 = Math.abs(
        rangoNumerico[i][1] - diam_ceramica.diametro_final
      );

      var sumaDiferencias = diferencia_1 + diferencia_2;
      resultados.push({ fila: rangoNumerico[i], diferencia: sumaDiferencias });
    }
  }

  // Ordenar los resultados por la suma de las diferencias (de menor a mayor)
  resultados.sort((a, b) => a.diferencia - b.diferencia);

  // Tomar los tres primeros resultados más cercanos
  var mejoresResultados = resultados.slice(0, 3);

  // Devolver las tres filas más cercanas (completas)
  return mejoresResultados.map((item) => item.fila);
};

//---------------------------------------------------------------------------->>

export const Enrolado_total = async (
  Voltaje: number,
  Potencia: number,
  Longitud: number,
  diametro_tubo: string,
  setResultados: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const Resistencia_1 = Resistencia(Voltaje, Potencia);

  // Obtiene los datos del aislador
  let datosAislador = await obtenerDatosAislador(diametro_tubo);
  if (!datosAislador) {
    console.error("No se encontró el aislador para el diámetro proporcionado.");
    return;
  }

  let diametro_Aislador = datosAislador.diametro_final;
  let mitad_tubo = (Longitud /= 2); // Se ajusta la longitud
  console.log("Mitad de la longitud:", Longitud);
  console.log("Diámetro del aislador:", diametro_Aislador);

  // 1. Cargar la tabla usando cargarTablaAWG
  const tablaAWG = await new Promise<any[]>((resolve) => {
    cargarTablaAWG(resolve); // Llama a cargarTablaAWG y resuelve la promesa
  });

  // 2. Si no hay datos cargados, devolver
  if (!tablaAWG || tablaAWG.length === 0) {
    console.error("No se cargaron datos de la tabla");
    return;
  }

  // Crear los arreglos para cada columna
  const T_Calibre = tablaAWG.map((row) => row.calibre);
  const T_Diametro = tablaAWG.map((row) => row.diametro);
  const T_Resistividad = tablaAWG.map((row) => row.resistividad);

  let resultados: any[] = []; // Arreglo que almacenará los resultados de todos los cálculos

  // 3. Calcula los resultados de acuerdo a las columnas
  for (let columna = 7; columna <= 17; columna++) {
    let resultados_temp: any[] = [];

    // Recorrer cada fila de T_Calibre
    for (let fila = 0; fila < T_Calibre.length; fila++) {
      // Calcula el enrollado
      const longitudCable = await longituddecable(
        T_Calibre[fila],
        Resistencia_1,
        T_Resistividad[fila]
      );

      // Verifica si longitudCable es un número válido
      if (typeof longitudCable !== "number" || isNaN(longitudCable)) {
        console.error("Longitud del cable no válida en la fila", fila);
        continue; // Salta al siguiente ciclo si la longitud no es válida
      }

      // Llama a Enrolado con el valor correcto
      const resultado_columna1 = Enrolado(
        longitudCable,
        T_Diametro[columna],
        T_Diametro[fila]
      );

      // Verifica si resultado_columna1 es un número válido antes de multiplicar
      if (typeof resultado_columna1 !== "number" || isNaN(resultado_columna1)) {
        console.error("Resultado de enrolado no válido para la fila", fila);
        continue;
      }

      // Calcula el diámetro del aislador
      const resultado_columna2 = T_Diametro[columna] + 2 * T_Diametro[fila];
      //Guarda Guía, almabre y longitud.
      let resultado_columna3 = Number(columna + 1);
      let resultado_columna4 = Number(fila + 1);
      let resultado_columna5 = longitudCable;

      // Verifica si resultado_columna2 es un número válido
      if (isNaN(resultado_columna2)) {
        console.error(
          "Resultado de diámetro de aislador no válido para la fila",
          fila
        );
        continue;
      }

      // Guarda los resultados temporales
      resultados_temp.push([
        resultado_columna1 * 100,
        resultado_columna2,
        resultado_columna3,
        resultado_columna4,
        resultado_columna5,
      ]); // Multiplicamos directamente
    }

    // Se agrega los resultados temporales a la tabla final
    for (let fila = 0; fila < T_Calibre.length; fila++) {
      if (!resultados[fila]) resultados[fila] = [];
      resultados[fila].push(
        resultados_temp[fila][0], // Longitud Enrolada
        resultados_temp[fila][1], // Diámetro del Aislador
        resultados_temp[fila][2], // Guía
        resultados_temp[fila][3], // Alambre
        resultados_temp[fila][4] // Longitud del Cable
      );
    }
  }

  //Calcula las mejores opciones de la columnas

  let salida: (number | string)[][] = []; // Aseguramos que sea un array de arrays
  for (let columna = 0; columna < resultados[0].length; columna += 5) {
    let rangoDatos = resultados.map((fila) => [
      fila[columna],
      fila[columna + 1],
      fila[columna + 2], // Posición de la columna
      fila[columna + 3], // Fila de T_Calibre
      fila[columna + 4], // Longitud del cable
    ]);
    //Logger.log("🔹 Rango de datos para columnas " + (columna + 1) + " y " + (columna + 2) + ": " + JSON.stringify(rangoDatos));
    //Logger.log("tubo: "+ (longitud_tubo/2)+" tubo: "+tubo);
    let mejorOpcion = await buscarValor_1(
      mitad_tubo,
      diametro_tubo,
      rangoDatos
    );
    if (mejorOpcion.length > 0) {
      mejorOpcion.forEach((fila) => {
        salida.push(
          fila.length === 5 ? fila : ["No encontrado", "-", "-", "-", "-"]
        );
      });
    }
  }

  //---3 opciones------->>
  let salidaNumerica: number[][] = salida.map((row) =>
    row.map((value) => (typeof value === "string" ? parseFloat(value) : value))
  );
  let res3 = await opciones3(mitad_tubo, diametro_tubo, salidaNumerica);

  // 🛠 Verificar si opciones3() devuelve algo
  console.log("📌 Resultado de opciones3():", JSON.stringify(res3));
  console.log(
    "🔍 Tipo de res3:",
    typeof res3,
    ", Contenido:",
    JSON.stringify(res3)
  );

  if (!Array.isArray(res3) || res3.length === 0) {
    console.log("⚠ opciones3() no devolvió resultados válidos.");
    return;
  }

  // 🔹 Convertimos `res3` en `number[][]` para asegurar compatibilidad en la tabla
  let res3Convertido: number[][] = res3
    .map((row) =>
      row.map((value) =>
        typeof value === "string" ? parseFloat(value) : value
      )
    )
    .filter((row) => row.every((value) => !isNaN(value))); // 🔹 Filtramos filas con `NaN`

  console.log("✅ res3 listo para mostrar:", JSON.stringify(res3Convertido));

  //-------------------------------->>
  // 4. Actualiza el estado con los resultados calculados
  setResultados(resultados);
};
