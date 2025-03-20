export const Resistencia = (Voltaje: number, Potencia: number) => {
  return Math.pow(Voltaje, 2) / Potencia;
};

export const Enrolado_total = (
  Voltaje: number,
  Potencia: number,
  Longitud: number,
  diametro_tubo: number
) => {
  let Resistencia_1 = Resistencia(Voltaje, Potencia);
  Longitud /= 2;

  return Math.pow(Voltaje, 2) / Potencia;
};
