import { obtenerDatosAislador } from "./Aislador";

export const Resistencia = (Voltaje: number, Potencia: number) => {
  return Math.pow(Voltaje, 2) / Potencia;
};

export const Enrolado_total = async (
  Voltaje: number,
  Potencia: number,
  Longitud: number,
  diametro_tubo: string
) => {
  let Resistencia_1 = Resistencia(Voltaje, Potencia);
  let datosAislador = await obtenerDatosAislador(diametro_tubo);

  if (!datosAislador) {
    console.error("No se encontró el aislador para el diámetro proporcionado.");
    return null;
  }

  let diametro_Aislador = datosAislador.diametro_final;
  Longitud /= 2;
  console.log(Longitud);

  console.log("Mitad de la longitud:", Longitud);
  console.log("Diámetro del aislador:", diametro_Aislador);

  return Math.pow(Voltaje, 2) / Potencia;
};
