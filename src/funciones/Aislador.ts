export const obtenerDatosAislador = async (
  tuboSeleccionado: string | number // Cambiamos a string para aceptar "5/16"
): Promise<Aislador | null> => {
  try {
    const response = await fetch("/Aisladores.txt");
    const data = await response.text();

    const lines = data.split("\n").filter((line) => line.trim() !== ""); // Filtrar líneas vacías

    const parsedData: Aislador[] = lines
      .map((line) => {
        const columns = line.split(/\s+/); // Separar por espacios o tabulaciones

        if (columns.length >= 5) {
          const [aislador, tubo, diametro, tolerancia, diametro_final] =
            columns;
          const tuboNumero = fraccionANumero(tubo); // Convertir fracción a número

          return {
            aislador,
            tubo: tuboNumero, // Convertimos a número
            diametro: parseFloat(diametro),
            tolerancia: parseFloat(tolerancia),
            diametro_final: parseFloat(diametro_final),
          };
        }
        return null;
      })
      .filter((item): item is Aislador => item !== null);

    // Convertir tuboSeleccionado a número antes de buscarlo en la tabla
    const tuboNumeroBuscado = fraccionANumero(String(tuboSeleccionado));

    // Buscar el aislador con el tubo seleccionado
    return (
      parsedData.find((d) => Math.abs(d.tubo - tuboNumeroBuscado) < 0.001) ||
      null
    );
  } catch (error) {
    console.error("Error al cargar Aisladores.txt:", error);
    return null;
  }
};

// Definir la interfaz de los datos
export interface Aislador {
  aislador: string;
  tubo: number;
  diametro: number;
  tolerancia: number;
  diametro_final: number;
}

// Función para convertir fracciones a número (ejemplo: "5/16" → 0.3125)
const fraccionANumero = (fraccion: string): number => {
  if (fraccion.includes("/")) {
    const [numerador, denominador] = fraccion.split("/").map(Number);
    return numerador / denominador;
  }
  return parseFloat(fraccion);
};
