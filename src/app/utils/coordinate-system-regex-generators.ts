import { CoordinateType } from '../enums/coordinate-type';

export function generateDecimalDegreesRegex(coordinate: CoordinateType, matchingRegex = false): RegExp {
  const regexString = `-?(\\d{1,${coordinate === CoordinateType.Lat ? 2 : 3}})\\.?(\\d{0,6})`;

  return generateRegexFromString(regexString, matchingRegex);
}

export function generateDegreesMinutesSecondsRegex(coordinate: CoordinateType, matchingRegex = false, specialChars = true): RegExp {
  const regexString = `(\\d{1,${coordinate === CoordinateType.Lat ? 2 : 3}})${ specialChars ? '°' : ' ' }(\\d{1,2})${ specialChars ? '\'' : ' ' }(\\d{1,2})\\.?(\\d{0,4})${ specialChars ? '"' : ' ' }([NSEW])`;

  return generateRegexFromString(regexString, matchingRegex);
}

function generateRegexFromString(regexString: string, matchingRegex: boolean): RegExp {
  if (matchingRegex) {
    return new RegExp(`${regexString}`, 'g');
  }

  return new RegExp(`^${regexString}\$`);
}