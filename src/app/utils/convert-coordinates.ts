import { DegreesMinutesSeconds } from '../types/dms';
import { DegreesDecimalMinutes } from '../types/ddm';
import { trimCoordinate } from './trim-coordinate';

export function degreesMinutesSecondsStringToDecimalDegrees(dms: string): number {
  const degreesSplit = dms.split('°');
  const degrees = parseInt(degreesSplit[0]);
  const minutesSplit = degreesSplit[1].split(`'`);
  const minutes = parseInt(minutesSplit[0], 10);
  const secondsSplit = minutesSplit[1].split(`"`);
  const seconds = parseFloat(secondsSplit[0]);
  const directionString = secondsSplit[1];
  const direction = ['N', 'E'].includes(directionString) ? 1 : -1;

  return degreesMinutesSecondsToDecimalDegrees(direction, degrees, minutes, seconds);
}

export function degreesMinutesSecondsToDecimalDegrees(direction: -1 | 1, degrees: number, minutes: number, seconds: number): number {
  return trimCoordinate((degrees + (minutes / 60) + (seconds / 3600)) * direction);
}

export function decimalDegreesToDegreesMinutesSeconds(value: number): DegreesMinutesSeconds {
  const direction = value < 0 ? -1 : 1;

  value = Math.abs(value);

  const degrees = Math.floor(value);

  const minFloat = (value - degrees) * 60;
  const minutes = Math.floor(minFloat);

  const seconds = (minFloat - minutes) * 60;

  return {
    degrees,
    minutes,
    seconds,
    direction,
  };
}

export function degreesDecimalMinutesStringToDecimalDegrees(ddm: string): number {
  const degreesSplit = ddm.split('°');
  const degrees = parseInt(degreesSplit[0]);
  const minutesSplit = degreesSplit[1].split(`'`);
  const minutes = parseFloat(minutesSplit[0]);
  const directionString = minutesSplit[1];
  const direction = ['N', 'E'].includes(directionString) ? 1 : -1;

  return degreesDecimalMinutesToDecimalDegrees(direction, degrees, minutes);
}

export function degreesDecimalMinutesToDecimalDegrees(direction: -1 | 1, degrees: number, minutes: number): number {
  return trimCoordinate((degrees + (minutes / 60)) * direction);
}

export function decimalDegreesToDegreesDecimalMinutes(value: number): DegreesDecimalMinutes {
  const direction = value < 0 ? -1 : 1;

  value = Math.abs(value);

  const degrees = Math.floor(value);

  const minutes = (value - degrees) * 60;
  return {
    degrees,
    minutes,
    direction,
  };
}