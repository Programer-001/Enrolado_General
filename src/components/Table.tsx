import React, { useEffect, useState } from "react";
import "../Style/tabla.css";

const Table = () => {
  const [data, setData] = useState<string[][]>([]);

  useEffect(() => {
    fetch("/Alambre_array.txt") // Suponiendo que el archivo está en la carpeta public
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
      <h1>Tabla de Alambre</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>Calibre</th>
            <th>Diámetro</th>
            <th>Resistividad</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row[0]}</td> {/* Calibre */}
              <td>{row[1]}</td> {/* Diámetro */}
              <td>{row[2]}</td> {/* Resistividad */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
