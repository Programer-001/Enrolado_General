import React, { useEffect, useState } from "react";
import { Enrolado_total, buscarValor_1, opciones3 } from "./funciones/Calculos"; // Asegúrate de importar correctamente

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
  const [mejoresResultados, setMejoresResultados] = useState<number[][]>([]); // 🔹 Nuevo estado para los 3 mejores

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

        // 🔹 Convertir `salida` a `number[][]`
        let salidaNumerica: number[][] = salidaTemp.map((row) =>
          row.map((value) =>
            typeof value === "string" ? parseFloat(value) : value
          )
        );

        // 🔹 Obtener los 3 mejores resultados con `opciones3`
        let res3 = await opciones3(mitad_tubo, diametro_tubo, salidaNumerica);

        // 🔹 Convertimos `res3` en `number[][]`
        let res3Convertido: number[][] = res3
          .map((row) =>
            row.map((value) =>
              typeof value === "string" ? parseFloat(value) : value
            )
          )
          .filter((row) => row.every((value) => !isNaN(value))); // 🔹 Filtramos valores `NaN`

        setMejoresResultados(res3Convertido);
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
            {resultados[0]?.map((_, i) => (
              <>
                {i % 5 === 4 && i !== 0 ? (
                  <>
                    <th className="border border-gray-400 p-2">Enrolado</th>
                    <th className="border border-gray-400 p-2">Diámetro</th>
                    <th className="border border-gray-400 p-2">Guía</th>
                    <th className="border border-gray-400 p-2">Alambre</th>
                    <th className="border border-gray-400 p-2">Longitud</th>
                  </>
                ) : null}
              </>
            ))}
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

      {/* 🔹 Nueva tabla con los tres mejores resultados */}
      <h2 className="text-xl font-bold mt-6 mb-4">Top 3 Mejores Opciones</h2>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Longitud</th>
            <th className="border border-gray-400 p-2">Diámetro</th>
          </tr>
        </thead>
        <tbody>
          {mejoresResultados.map((fila, index) => (
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
