const DECIMAL_PLACES = 6;

const multiplier = Math.pow(10, DECIMAL_PLACES);

export function trimCoordinate(coordinate: number): number {
  return Math.round(coordinate * multiplier) / multiplier;
}