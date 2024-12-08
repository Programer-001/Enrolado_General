// cargarTablas.ts
export const cargarTablaAWG = async (
  setTablaAWG: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await fetch("/Alambre_array.txt");
    const data = await response.text();
    console.log("Contenido del archivo Alambre_array.txt:", data); // Verifica el contenido del archivo

    const lines = data.split("\n").filter((line) => line.trim() !== ""); // Elimina líneas vacías

    const parsedData = lines
      .map((line) => {
        const [calibre, diametro, resistividad, aumento] = line
          .split(/\s+/)
          .map((item) => parseFloat(item.trim()));

        if (
          !isNaN(calibre) &&
          !isNaN(diametro) &&
          !isNaN(resistividad) &&
          !isNaN(aumento)
        ) {
          return { calibre, diametro, resistividad, aumento };
        }
        return null;
      })
      .filter((item) => item !== null);

    console.log("Datos procesados (tabla AWG):", parsedData);
    setTablaAWG(parsedData);
  } catch (error) {
    console.error("Error al cargar el archivo Alambre_array.txt:", error);
  }
};

export const cargarTablaDatos = async (
  setTablaDatos: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await fetch("/Aisladores.txt");
    const data = await response.text();
    console.log("Contenido del archivo Aisladores.txt:", data);

    const lines = data.split("\n").filter((line) => line.trim() !== ""); // Eliminar líneas vacías

    const parsedData = lines
      .map((line) => {
        const columns = line.split(/\s+/); // Dividimos por espacios/tabulaciones

        if (columns.length >= 5) {
          const [aislador, tubo, diametro, tolerancia, diametro_final] =
            columns;
          const tuboNumero = fraccionANumero(tubo); // Convertir fracción a número
          const diametroNumero = parseFloat(diametro);
          const toleranciaNumero = parseFloat(tolerancia);
          const diametroFinalNumero = parseFloat(diametro_final);

          if (
            aislador &&
            !isNaN(tuboNumero) &&
            !isNaN(diametroNumero) &&
            !isNaN(toleranciaNumero) &&
            !isNaN(diametroFinalNumero)
          ) {
            return {
              aislador,
              tubo,
              diametro: diametroNumero,
              tolerancia: toleranciaNumero,
              diametro_final: diametroFinalNumero,
            };
          }
        }
        return null;
      })
      .filter((item) => item !== null);

    console.log("Datos procesados (tabla Datos):", parsedData);
    setTablaDatos(parsedData);
  } catch (error) {
    console.error("Error al cargar el archivo Aisladores.txt:", error);
  }
};

// Función auxiliar (si la necesitas)
const fraccionANumero = (fraccion: string): number => {
  const [numerador, denominador] = fraccion.split("/").map(Number);
  return numerador / denominador;
};
