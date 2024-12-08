import React, { useEffect, useState } from "react";
import { cargarTablaAWG, cargarTablaDatos } from "../funciones/Cargar_tablas";
import "../Style/tabla.css";
// Definir el tipo de los datos de la tabla AWG
interface CableData {
  calibre: number;
  diametro: number;
  resistividad: number;
}
const Table = () => {
  const [data, setData] = useState<CableData[]>([]);

  useEffect(() => {
    cargarTablaAWG(setData);
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
              <td>{row.calibre}</td> {/* Calibre */}
              <td>{row.diametro}</td> {/* Diámetro */}
              <td>{row.resistividad}</td> {/* Resistividad */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
