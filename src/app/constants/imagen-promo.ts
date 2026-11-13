// Fecha límite de la imagen promocional X360 (carnet y QR Acceso).
// Se muestra hasta el 1 de febrero de 2027 (inclusive, hora local del dispositivo).
// Mes en base 0: 1 = febrero. A partir del 2 de febrero de 2027 00:00 deja de mostrarse.
export const FECHA_FIN_IMAGEN_PROMO = new Date(2027, 1, 2, 0, 0, 0);

export function imagenPromoVigente(): boolean {
  return new Date() < FECHA_FIN_IMAGEN_PROMO;
}
