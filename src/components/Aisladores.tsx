import React, { useEffect, useState } from "react";
import { cargarTablaAWG, cargarTablaDatos } from "../funciones/Cargar_tablas";
import "../Style/tabla.css";

const Table = () => {
  const [data, setData] = useState<string[][]>([]);

  useEffect(() => {
    fetch("/Aisladores.txt") // Suponiendo que el archivo está en la carpeta public
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split("\n"); // Separar el archivo por saltos de línea
        const parsedData = rows.map((row) => row.split(/\s+/)); // Separar cada fila por cualquier cantidad de espacios/tabulaciones
        setData(parsedData);
      })
      .catch((error) => console.error("Error al cargar el archivo:", error));
  }, []);

  return (
    <div>
      <h1>Aisladores</h1>
      <p>En esta tabla se muestra el diametro de cada aislador.
        El Diametro Final es la circunferencia máxima que garantiza 
        que entre tu resistencia en el aislador. </p>
      <table border={1}>
        <thead>
          <tr>
            <th>Aislador</th>
            <th>Tubo</th>
            <th>Diametro</th>
            <th>Tolerancia</th>
            <th>Diametro Final</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row[0]}</td> {/* Calibre */}
              <td>{row[1]}</td> {/* Diámetro */}
              <td>{row[2]}</td> {/* Resistividad */}
              <td>{row[3]}</td> {/* Resistividad */}
              <td>{row[4]}</td> {/* Resistividad */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
