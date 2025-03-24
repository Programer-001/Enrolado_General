import React, { useEffect, useState } from "react";
import { Enrolado_total, buscarValor_1 } from "./funciones/Calculos"; // Asegúrate de importar correctamente

interface TablasResultadosProps {
  Voltaje: number;
  Potencia: number;
  Longitud: number;
  diametro_tubo: string;
}

const TablasResultados: React.FC<TablasResultadosProps> = ({
  Voltaje,
  Potencia,
  Longitud,
  diametro_tubo,
}) => {
  const [resultados, setResultados] = useState<any[][]>([]);
  const [salida, setSalida] = useState<(number | string)[][]>([]);

  useEffect(() => {
    const calcular = async () => {
      await Enrolado_total(
        Voltaje,
        Potencia,
        Longitud,
        diametro_tubo,
        setResultados
      );
    };
    calcular();
  }, [Voltaje, Potencia, Longitud, diametro_tubo]);

  // 🔹 Extraer la segunda tabla después de calcular `resultados`
  useEffect(() => {
    if (resultados.length > 0) {
      const calcularMejoresOpciones = async () => {
        let salidaTemp: (number | string)[][] = [];
        let mitad_tubo = Longitud / 2; // Mitad del tubo para la comparación

        for (let columna = 0; columna < resultados[0].length; columna += 2) {
          let rangoDatos = resultados.map((fila) => [
            fila[columna], // Longitud
            fila[columna + 1], // Diámetro
          ]);

          let mejorOpcion = await buscarValor_1(
            mitad_tubo,
            diametro_tubo,
            rangoDatos
          );
          salidaTemp = salidaTemp.concat(mejorOpcion);
        }

        setSalida(salidaTemp);
      };

      calcularMejoresOpciones();
    }
  }, [resultados, Longitud, diametro_tubo]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Tabla Completa de Resultados</h2>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Longitud</th>
            <th className="border border-gray-400 p-2">Diámetro</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((fila, index) => (
            <tr key={index}>
              {fila.map((valor, i) => (
                <td key={i} className="border border-gray-400 p-2 text-center">
                  {valor}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-6 mb-4">Mejores Opciones</h2>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Mejor Longitud</th>
            <th className="border border-gray-400 p-2">Mejor Diámetro</th>
          </tr>
        </thead>
        <tbody>
          {salida.map((fila, index) => (
            <tr key={index}>
              {fila.map((valor, i) => (
                <td key={i} className="border border-gray-400 p-2 text-center">
                  {valor}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablasResultados;
