import { Component, Input, OnInit } from '@angular/core';

import { isNullOrUndefined } from 'util';

import { BaseControl } from '../base-control';

import { CoordinateSystem } from '../../enums/coordinate-system';
import { CoordinateType } from '../../enums/coordinate-type';

import { degreesMinutesSecondsStringToDecimalDegrees } from '../../utils/convert-coordinates';
import { generateDegreesMinutesSecondsRegex, generateDecimalDegreesRegex } from '../../utils/coordinate-system-regex-generators';

export interface LatLon {
  latitude: number | null;
  longitude: number | null;
}

@Component({
  selector: 'app-lat-lon-input',
  templateUrl: './lat-lon-input.component.html',
  styleUrls: ['./lat-lon-input.component.scss']
})
export class LatLonInputComponent extends BaseControl<LatLon> {
  @Input() public coordinateSystem: CoordinateSystem;
  
  // Enums for view
  public readonly CoordinateSystem = CoordinateSystem;
  public readonly CoordinateType = CoordinateType;

  public latitude: number | null;
  public longitude: number | null;
  
  private readonly defaultMapLat = 51.472734;
  private readonly defaultMapLon = -3.154986;

  public mapLat = this.defaultMapLat;
  public mapLon = this.defaultMapLon;

  public latDMS: string;
  public lonDMS: string;

  private dmsMatchingRegex = generateDegreesMinutesSecondsRegex(CoordinateType.Lon, true);
  private dmsSpacesMatchingRegex = generateDegreesMinutesSecondsRegex(CoordinateType.Lon, true, false);
  private decimalMatchingRegex = generateDecimalDegreesRegex(CoordinateType.Lon, true);

  public onCoordinateChange(value: string, coordinate: CoordinateType): void {
    if (value) {
      value = value.trim().toUpperCase();

      if (this.coordinateSystem === CoordinateSystem.DegreesMinutesSeconds) {
        const foundValue = this.findDMSValue(value, coordinate);

        if (!foundValue) {
          this.findDecimalValue(value, coordinate);
        }
      } else {
        const foundValue = this.findDecimalValue(value, coordinate);

        if (!foundValue) {
          this.findDMSValue(value, coordinate);
        }
      }
    } else {
      this.setNullValues(coordinate);
    }

    this.setValue({ latitude: this.latitude, longitude: this.longitude });

    this.mapLat = this.latitude;
    this.mapLon = this.longitude;
  }

  private findDMSValue(value: string, coordinate: CoordinateType): boolean {
    const matches = value.match(this.dmsMatchingRegex);

    if (matches) {
      return this.handleMatches(matches.map(match => degreesMinutesSecondsStringToDecimalDegrees(match)), coordinate);
    }

    const spacesMatches = value.match(this.dmsSpacesMatchingRegex);

    if (spacesMatches) {
      return this.handleMatches(spacesMatches.map(match => {
        const formattedMatch = this.spaceMatchToFormattedDMS(match);
        return degreesMinutesSecondsStringToDecimalDegrees(formattedMatch);
      }), coordinate);
    }

    return false;
  }

  private findDecimalValue(value: string, coordinate: CoordinateType): boolean {
    const dmsMatches = value.match(this.dmsMatchingRegex);

    if (!dmsMatches) {
      const matches = value.match(this.decimalMatchingRegex) as any[];

      if (matches) {
        return this.handleMatches(matches.map(match => parseFloat(match)), coordinate, true);
      }
    }

    return false;
  }

  private handleMatches(matches: number[], coordinate: CoordinateType, setNulls = false): boolean {
    if (matches && matches.length <= 2) {
      if (matches.length === 2) {
        this.latitude = matches[0];
        this.longitude = matches[1];
      } else if (coordinate === CoordinateType.Lat) {
        this.latitude = matches[0];
      } else {
        this.longitude = matches[0];
      }

      return true;
    } else if (setNulls) {
      this.setNullValues(coordinate);
    }

    return false;
  }

  private setNullValues(coordinate: CoordinateType): void {
    if (coordinate === CoordinateType.Lat) {
      this.latitude = null;
    } else {
      this.longitude = null;
    }
  }

  private spaceMatchToFormattedDMS(value: string): string {
    const valueParts = value.split(' ');

    return `${valueParts[0]}°${valueParts[1]}'${valueParts[2]}"${valueParts[3]}`;
  }

  public onMapChange({ latitude, longitude }: LatLon): void {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  public onMapClose(): void {
    if (!isNullOrUndefined(this.latitude) && !isNullOrUndefined(this.longitude)) {
      this.mapLat = this.latitude;
      this.mapLon = this.longitude;
    }
  }
}