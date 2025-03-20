import React, { useState } from "react";

const Enrolado = () => {
  const [voltaje, setVoltaje] = useState(0);
  const [potencia, setPotencia] = useState(0);
  const [longitudTubo, setLongitudTubo] = useState(0);
  const [tubo, setTubo] = useState("");
  const [resultados, setResultados] = useState<number[][]>([]);
  const [salida, setSalida] = useState<number[][]>([]);

  const calcularEnrolado = () => {
    console.log("🟢 Ejecutando cálculo de enrolado");
    if (!voltaje || !potencia || !longitudTubo || !tubo) {
      console.error("❌ Error: Datos insuficientes para el cálculo");
      return;
    }

    let resistencia = Math.pow(voltaje, 2) / potencia;
    let mitadTubo = longitudTubo / 2;
    let valorCeramica = Ceramica(tubo);

    let T_Calibre = [...Array(40)].map((_, i) => i + 1); // Simulación de datos
    let T_Diametro = [...Array(40)].map((_, i) => i * 0.1); // Simulación de datos
    let T_Resistividad = [...Array(40)].map((_, i) => 0.01 * i); // Simulación de datos

    let newResultados: number[][] = [];
    let newSalida: number[][] = [];

    for (let columna = 7; columna <= 17; columna++) {
      let resultadosTemp: number[][] = [];
      for (let fila = 0; fila < T_Calibre.length; fila++) {
        let resultadoColumna1 =
          (Enrolado(
            longitudDeCable(T_Calibre[fila], resistencia, T_Resistividad[fila]),
            T_Diametro[columna],
            T_Diametro[fila]
          ) * 100);
        let resultadoColumna2 = T_Diametro[columna] + 2 * T_Diametro[fila];
        resultadosTemp.push([resultadoColumna1, resultadoColumna2]);
      }
      for (let fila = 0; fila < T_Calibre.length; fila++) {
        if (!newResultados[fila]) newResultados[fila] = [];
        newResultados[fila].push(resultadosTemp[fila][0], resultadosTemp[fila][1]);
      }
    }

    for (let columna = 0; columna < newResultados[0].length; columna += 2) {
      let rangoDatos = newResultados.map((fila) => [fila[columna], fila[columna + 1]]);
      let mejorOpcion = buscarValor_1(mitadTubo, tubo, rangoDatos);
      newSalida = newSalida.concat(mejorOpcion);
    }

    setResultados(newResultados);
    setSalida(newSalida);
  };

  const Ceramica = (aislador: string): number => {
    return Math.random() * 10; // Simulación
  };

  const longitudDeCable = (calibre: number, resistencia: number, resistividad: number): number => {
    return (resistencia * resistividad) / calibre;
  };

  const Enrolado = (longitud: number, diametro1: number, diametro2: number): number => {
    return (longitud / (diametro1 + diametro2)) * 10;
  };

  const buscarValor_1 = (valor1: number, valor2: string, rangoDatos: number[][]): number[][] => {
    return [[Math.random() * 10, Math.random() * 10]]; // Simulación
  };

  return (
    <div>
      <h2>Enrolado de Tubo</h2>
      <label>Voltaje: <input type="number" value={voltaje} onChange={(e) => setVoltaje(Number(e.target.value))} /></label>
      <label>Potencia: <input type="number" value={potencia} onChange={(e) => setPotencia(Number(e.target.value))} /></label>
      <label>Longitud del Tubo: <input type="number" value={longitudTubo} onChange={(e) => setLongitudTubo(Number(e.target.value))} /></label>
      <label>Tubo: <input type="text" value={tubo} onChange={(e) => setTubo(e.target.value)} /></label>
      <button onClick={calcularEnrolado}>Calcular</button>

      <h3>Resultados</h3>
      <pre>{JSON.stringify(resultados, null, 2)}</pre>

      <h3>Mejores Opciones</h3>
      <pre>{JSON.stringify(salida, null, 2)}</pre>
    </div>
  );
};

export default Enrolado;
