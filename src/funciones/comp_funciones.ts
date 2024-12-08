export function verificacion_aislador(a: number, b: number): string {
  //Variable a diametro final
  //variable b diametro del aisaldor
  if (a < b) {
    return "Aislador compatible";
  } else {
    return "Aislador no compatible";
  }
}
