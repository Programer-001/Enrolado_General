export function verificacion_aislador(a: number, b: number): string {
  //Variable a diametro final
  //variable b diametro del aisaldor
  if (a < b) {
    return "Aislador compatible";
  } else {
    return "Aislador no compatible";
  }
}

export const sumar = (primero: number, segundo: number, tercero: number) => {
  let resultado = primero + segundo + tercero;
  resultado = resultado + 1;
  return resultado;
};
const tomar_dato_guia = (dato: number) => {
  //setGuia(dato);
};
const tomar_dato_alambre = (dato: number) => {
  //setAlambre(dato);
};
export const milimetros = (dato: number): number => {
  return dato * 1000;
};
export const centimetros = (dato: number): number => {
  return dato / 10;
};
function convertirAPulgadasYMM(dato: number) {
  // Primero calculamos el valor de la fracción en pulgadas
  const valorEnPulgadas = dato;
  // Convertimos de pulgadas a milímetros
  const valorEnMM = valorEnPulgadas * 25.4;
  //console.log(`El valor en milimetros es: ${Diametro_tubo_mm} mm`);

  // Devolvemos el resultado para imprimir
  /*return {
    pulgadas: valorEnPulgadas,
    milimetros: valorEnMM.toFixed(2),
  };*/
  return valorEnMM;
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
