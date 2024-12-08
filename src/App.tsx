import "./Style/styles.css";
import Select from "react-select";
import { useState } from "react";
import React, { useEffect } from "react";
import Table from "./components/Table"; // Importa el componente Tabla
import Aislador from "./components/Aisladores";
import { ReactComponent as Logo } from "./multimedia/formato_logo_blanco.svg";
import { verificacion_aislador } from "./funciones/comp_funciones";

export default function App() {
  const options = [
    { value: 5 / 16, label: "5/16" },
    { value: 7 / 16, label: "7/16" },
  ];
  //Lista de proovedores
  /* const proovedor=[
    [1,7.35,0.02],
    [2,6.54,0.03],
    [3,6.36,0.05]
  ];*/

  //--------------------------------------------------------------------------------------->>
  //Variables de prueba
  const [primero, setPrimero] = useState(0);
  const [final_res, setFinal_res] = useState(0);
  const [segundo, setSegundo] = useState(0);
  const [tercero, setTercero] = useState(0); //Toma los datos de los list box
  const [lectura, setLectura] = useState(""); //Esta variable es para tomar datos de un archivo txt

  // Estado para controlar si mostrar la tabla o no
  const [mostrarTabla, setMostrarTabla] = useState(false);

  // Función para mostrar/ocultar la tabla
  const toggleTabla = () => {
    setMostrarTabla(!mostrarTabla);
  };

  //Varaibles del programa--------------------------->>
  const [voltaje, setVoltaje] = useState(0);
  const [potencia, setPotencia] = useState(0);
  const [resistencia, setResistencia] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [guia, setGuia] = useState(0);
  const [alambre, setAlambre] = useState(0);
  const [AWG_alambre, setAWG_alambre] = useState([]);
  const [Longitud_total, setLongitud_total] = useState(0);
  const [Resistencia_final, setResistencia_final] = useState(0);
  const [compatibilidad_aisaldor, setcompatibilidad_aisaldor] = useState("");
  //------------------------------------------------->>
  const [tablaAWG, setTablaAWG] = useState<any[]>([]);
  const [tablaDatos, setTablaDatos] = useState<any[]>([]);
  //---------------------------------------------------------------->>

  const [calibreSeleccionado, setCalibreSeleccionado] = useState<number | null>(
    null
  ); //Alambre Select
  const [calibreSeleccionado_2, setCalibreSeleccionado_2] = useState<
    number | null
  >(null); //Guia Select
  const [calibreSeleccionado_3, setCalibreSeleccionado_3] = useState<
    number | null
  >(null); //Guia Select
  const [diametroPrimerCable, setDiametroPrimerCable] = useState<number | null>(
    null
  ); //Diametro del alambre
  const [diametroSegundoCable, setDiametroSegundoCable] = useState<
    number | null
  >(null); //Diametro de la guía
  const [resistividadCable, setResistividadCable] = useState<number>(0); //resistividad tabla
  const [diametro_final, setDiametro_final] = useState(0);
  const [Resistencia_compactada, setResistencia_compactada] = useState(0);
  const [Diametro_Tubu, setDiametro_Tubu] = useState(0);
  const [Diametro_tubo_mm, setDiametro_tubo_mm] = useState(0);
  //Funciones--------------------------------------->>
  useEffect(() => {
    console.log("Diametro_Tubu actualizado:", Diametro_Tubu);
  }, [Diametro_Tubu]); // Se ejecutará cada vez que Diametro_Tubu cambie

  useEffect(() => {
    fetch("/Alambre_array.txt")
      .then((response) => response.text())
      .then((data) => {
        console.log("Contenido del archivo:", data); // Verifica el contenido del archivo
        const lines = data.split("\n").filter((line) => line.trim() !== ""); // Elimina líneas vacías

        const parsedData = lines
          .map((line) => {
            // Usamos split(/\s+/) para dividir por cualquier cantidad de espacios o tabulaciones
            const [calibre, diametro, resistividad, aumento] = line
              .split(/\s+/)
              .map((item) => parseFloat(item.trim()));

            // Validamos que los datos sean números
            if (
              !isNaN(calibre) &&
              !isNaN(diametro) &&
              !isNaN(resistividad) &&
              !isNaN(aumento)
            ) {
              return {
                calibre,
                diametro,
                resistividad,
                aumento,
              };
            }
            return null; // Si hay datos inválidos, retornamos null
          })
          .filter((item) => item !== null); // Filtramos los datos nulos

        console.log("Datos procesados:", parsedData); // Verifica si los datos están siendo procesados correctamente
        setTablaAWG(parsedData);
      })
      .catch((error) => {
        console.error("Error al cargar el archivo:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/Aisladores.txt") // Ruta del archivo de texto
      .then((response) => response.text())
      .then((data) => {
        console.log("Contenido del archivo:", data); // Verifica el contenido del archivo

        const lines = data.split("\n").filter((line) => line.trim() !== ""); // Eliminar líneas vacías

        const parsedData = lines
          .map((line) => {
            const columns = line.split(/\s+/); // Dividimos por espacios/tabulaciones

            // Comprobamos que haya al menos 5 columnas para cada línea
            if (columns.length >= 5) {
              const [aislador, tubo, diametro, tolerancia, diametro_final] =
                columns;

              const tuboNumero = fraccionANumero(tubo); // Convertir fracción a número
              const diametroNumero = parseFloat(diametro);
              const toleranciaNumero = parseFloat(tolerancia);
              const diametroFinalNumero = parseFloat(diametro_final);
              // Validamos los valores para asegurarnos de que sean números
              if (
                aislador &&
                !isNaN(tuboNumero) &&
                !isNaN(diametroNumero) &&
                !isNaN(toleranciaNumero) &&
                !isNaN(diametroFinalNumero)
              ) {
                return {
                  aislador,
                  tubo: tubo,
                  diametro: diametroNumero,
                  tolerancia: toleranciaNumero,
                  diametro_final: diametroFinalNumero,
                };
              }
            }
            return null; // Si hay algún dato inválido, retornamos null
          })
          .filter((item) => item !== null); // Filtramos los datos nulos

        console.log("Datos procesados:", parsedData); // Verifica los datos procesados
        setTablaDatos(parsedData); // Actualiza el estado con los datos procesados
      })
      .catch((error) => {
        console.error("Error al cargar el archivo:", error);
      });
  }, []);
  console.log(tablaDatos);
  //----------------------------------------------------->>
  // Función para manejar el cambio del select
  const manejarCambioCalibre = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      const calibreSeleccionado = selectedOption.value;
      setCalibreSeleccionado(calibreSeleccionado);

      const cableSeleccionado = tablaAWG.find(
        (cable) => cable.calibre === calibreSeleccionado
      );
      setDiametroPrimerCable(
        cableSeleccionado ? cableSeleccionado.diametro : null
      );

      const cableSeleccionado_01 = tablaAWG.find(
        (cable) => cable.calibre === calibreSeleccionado
      );
      setResistividadCable(
        cableSeleccionado ? cableSeleccionado.resistividad : null
      );

      const cableSeleccionado_02 = tablaAWG.find(
        (cable) => cable.calibre === calibreSeleccionado
      );
      setResistencia_compactada(
        cableSeleccionado ? cableSeleccionado.aumento : null
      );
    }
  };
  //Guía -Cable
  const manejarCambioCalibre_2 = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      const calibreSeleccionado = selectedOption.value;
      setCalibreSeleccionado_2(calibreSeleccionado);

      const cableSeleccionado = tablaAWG.find(
        (cable) => cable.calibre === calibreSeleccionado
      );
      setDiametroSegundoCable(
        cableSeleccionado ? cableSeleccionado.diametro : null
      );
    }
  };

  //Guía -Cable
  const Cambio_Diametro = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      const calibreSeleccionado = selectedOption.value;
      setCalibreSeleccionado_3(calibreSeleccionado);

      const DSeleccionado = tablaDatos.find(
        (d1) => d1.tubo === selectedOption.value
      );

      console.log("DSeleccionado:", DSeleccionado);

      if (DSeleccionado) {
        // Accede a la propiedad 'diametro_final' en lugar de 'diametroFinalNumero'
        console.log("diametro_final:", DSeleccionado.diametro_final);

        // Asigna el valor correcto a 'Diametro_Tubu'
        setDiametro_Tubu(DSeleccionado.diametro_final);
      } else {
        console.log("No se encontró el aislador correspondiente");
      }
    }
    console.log("Diametro final aislador:", Diametro_Tubu);
  };
  //---------------------------------------------------->>
  const Calc_Re = () => {
    console.log("Diametro Primer Cable:", diametroPrimerCable);
    console.log("Diametro Segundo Cable:", diametroSegundoCable);
    console.log("Aumento de Cable:", Resistencia_compactada);
    // Verificamos que ambos diametros tengan valores válidos (no sean null o undefined)
    const diametro1 = diametroPrimerCable ?? 0;
    const diametro2 = diametroSegundoCable ?? 0;
    const resistencia_1 = (voltaje * voltaje) / potencia;
    const mitad_long = longitud / 2;
    const Diam_final = (diametro2 ?? 0) + 2 * (diametro1 ?? 0);
    const Res_final = resistencia_1 + Resistencia_compactada;
    const longitud_2 = Res_final / resistividadCable ?? 0;
    const conversion = milimetros(longitud_2);
    const Numero_vueltas = conversion / ((diametro1 + diametro2) * 3.1416);
    const Resorte_final = centimetros(Numero_vueltas * diametro1);
    setcompatibilidad_aisaldor(
      verificacion_aislador(Diam_final, Diametro_Tubu)
    );
    setResistencia(resistencia_1);
    setLongitud(mitad_long);
    setDiametro_final(Diam_final);
    setLongitud_total(longitud_2);
    setResistencia_final(Resorte_final);
    console.log("Diametro Final:", Diam_final);
    console.log("Resistencia final:", Res_final);
    console.log("Longitud final:", longitud_2);
    console.log("longitud en mm:", conversion);
    console.log("Numero de vueltas", Numero_vueltas);
    console.log("resorte de", Resorte_final);
  };
  const sumar = () => {
    let resultado = primero + segundo + tercero;
    resultado = resultado + 1;
    setFinal_res(resultado);
  };
  const tomar_dato_guia = (dato: number) => {
    setGuia(dato);
  };
  const tomar_dato_alambre = (dato: number) => {
    setAlambre(dato);
  };
  const milimetros = (dato: number): number => {
    return dato * 1000;
  };
  const centimetros = (dato: number): number => {
    return dato / 10;
  };
  function convertirAPulgadasYMM(dato: number) {
    // Primero calculamos el valor de la fracción en pulgadas
    const valorEnPulgadas = dato;

    // Convertimos de pulgadas a milímetros
    const valorEnMM = valorEnPulgadas * 25.4;
    setDiametro_tubo_mm(valorEnMM);
    console.log(Diametro_tubo_mm);
    //console.log(`El valor en milimetros es: ${Diametro_tubo_mm} mm`);

    // Devolvemos el resultado para imprimir
    /*return {
      pulgadas: valorEnPulgadas,
      milimetros: valorEnMM.toFixed(2),
    };*/
  }

  // Función para convertir fracciones a números
  const fraccionANumero = (fraccion: string) => {
    const partes = fraccion.split("/").map(Number);
    if (partes.length === 2 && partes[1] !== 0) {
      return partes[0] / partes[1];
    }
    return 0; // Si no es una fracción válida, retornamos 0
  };
  /*fetch(_prueba)
  .then(r => r.text())
  .then(text => { setLectura(text) });*/

  // Función para convertir un número decimal a fracción
  const decimalToFraction = (decimal: number): string => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

    let denominator = 1;
    while (decimal % 1 !== 0) {
      decimal *= 10;
      denominator *= 10;
    }

    const greatestCommonDivisor = gcd(decimal, denominator);
    return `${decimal / greatestCommonDivisor}/${
      denominator / greatestCommonDivisor
    }`;
  };
  /*-------------------------------------------------------------------------------------------------*/
  return (
    <>
      <div className="App">
        <Logo className="logo" />
        <h1>Enrolado</h1>
      </div>

      <div className="selectores">
        <div className="selector">
          <h3>Alambre</h3>
          <Select
            className="Alambre-select"
            options={tablaAWG.map((cable) => ({
              value: cable.calibre, // El valor que se seleccionará
              label: `${cable.calibre}`, // Lo que se mostrará en el select
            }))}
            onChange={manejarCambioCalibre}
            placeholder="Seleccione un Calibre"
          />
        </div>
        <div className="selector">
          <h3>Guia</h3>

          <Select
            className="guia-select"
            options={tablaAWG.map((cable) => ({
              value: cable.calibre, // El valor que se seleccionará
              label: `${cable.calibre}`, // Lo que se mostrará en el select
            }))}
            onChange={manejarCambioCalibre_2}
            placeholder="Seleccione una guía"
          />
        </div>
      </div>

      <div className="valores_VP">
        <h3>Voltaje (V)</h3>
        <input
          className="Entrada"
          inputMode="numeric"
          onChange={(dato_1) => setVoltaje(parseFloat(dato_1.target.value))}
        ></input>
        <h3>Potencia (W)</h3>
        <input
          className="Entrada"
          inputMode="numeric"
          onChange={(dato_2) => setPotencia(parseFloat(dato_2.target.value))}
        ></input>
        <h3>Longitud del tubo (cm)</h3>
        <input
          className="Entrada"
          inputMode="numeric"
          onChange={(dato_3) => setLongitud(parseFloat(dato_3.target.value))}
        ></input>
        <h3>Diametro del tubo</h3>
        <Select
          className="diametro_select"
          options={tablaDatos.map((cable) => ({
            value: cable.tubo, // El valor que se seleccionará
            label: `${cable.tubo}`, // Lo que se mostrará en el select
          }))}
          placeholder="diametro del tubo"
          onChange={Cambio_Diametro}
        />
        <p></p>
      </div>
      {/*------------------------------------------------------------------------*/}
      <div className="resultados">
        <h4>Resistencia final</h4>
        <p>{resistencia} Ω</p>
        <p></p>
        <h4>Longitud de alambre (m)</h4>
        <p>{Longitud_total} m</p>
        <h4>Enrolado</h4>
        <p>{Resistencia_final} cm</p>
        <p>{compatibilidad_aisaldor}</p>
      </div>
      <button onClick={Calc_Re} className="Calcular_1">
        Calcular
      </button>
      <div>
        {/* Botón que al hacer clic alterna la visibilidad de la tabla */}
        <button onClick={toggleTabla} className="mostrar_tabla">
          {mostrarTabla ? "Regresar a la app" : "Ver tabla"}
        </button>

        {/* Condicionalmente renderiza la tabla o la app */}
        {mostrarTabla ? <Table /> : <div></div>}
      </div>
    </>
  );
}
