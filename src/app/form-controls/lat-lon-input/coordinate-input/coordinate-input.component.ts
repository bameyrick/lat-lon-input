import { Component, Input, Output, OnChanges, SimpleChanges, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import * as openlayers from 'openlayers';


import { BaseControl } from '../../base-control';
import { CoordinateSystem } from '../../../enums/coordinate-system';
import { CoordinateType } from '../../../enums/coordinate-type';
import { Option } from '../../../types/option';

import { degreesMinutesSecondsToDecimalDegrees, decimalDegreesToDegreesMinutesSeconds } from '../../../utils/convert-coordinates';
import { generateDecimalDegreesRegex, generateDegreesMinutesSecondsRegex } from '../../../utils/coordinate-system-regex-generators';
import { trimCoordinate } from '../../../utils/trim-coordinate';
import { LatLon } from '../lat-lon-input.component';
import { Colours } from '../../../enums/colours';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-coordinate-input',
  templateUrl: './coordinate-input.component.html',
  styleUrls: ['./coordinate-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CoordinateInputComponent),
      multi: true,
    },
  ],
})
export class CoordinateInputComponent extends BaseControl<string | null> implements OnChanges {
  @Input() private coordinate: CoordinateType;

  @Input() private coordinateSystem: CoordinateSystem;

  @Input() public mapLat: number | null;
  @Input() public mapLon: number | null;

  @Input() public selectedLat: number | null;
  @Input() public selectedLon: number | null;
  
  @Output() public onMapChange = new EventEmitter<LatLon>();
  @Output() public onMapClose = new EventEmitter<void>();

  private degrees: number;

  public direction: '-1' | '1' = '1';
  public directionOptions: Option[] = [];

  public degreesValue: number | null = null;
  public minutesValue: number | null = null;
  public secondsValue: number | null = null;
  public dmsDisplayValue: string;

  public CoordinateSystem = CoordinateSystem;

  public decimalRegex: RegExp;
  public dmsRegex: RegExp;

  private readonly srid = 'EPSG:4326';
  public readonly Colours = Colours;

  private mapOpened = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.coordinate) {
      this.degrees = this.coordinate === CoordinateType.Lat ? 90 : 180;

      const directions = this.coordinate === CoordinateType.Lat ? ['N', 'S'] : ['E', 'W'];
      this.directionOptions = directions.map((direction, index) => ({ value: index === 0 ? '1' : '-1', label: direction }));

      this.decimalRegex = generateDecimalDegreesRegex(this.coordinate);
      this.dmsRegex = generateDegreesMinutesSecondsRegex(this.coordinate);
    }
  }

  protected writeValue(value: number): void {
    if (value !== null && value !== undefined && this.decimalRegex.test(value.toString())) {
      this.value = value.toString();

      const dms = decimalDegreesToDegreesMinutesSeconds(value);

      this.degreesValue = dms.degrees;
      this.minutesValue = dms.minutes;
      this.secondsValue = Math.round(dms.seconds * 10000) / 10000;
      this.direction = dms.direction.toString();

      this.setDisplayValue(this.degreesValue, this.minutesValue, this.secondsValue);
    } else {
      this.degreesValue = null;
      this.minutesValue = null;
      this.secondsValue = null;
      this.direction = '1';

      this.setDisplayValue(this.degreesValue, this.minutesValue, this.secondsValue);
    }
  }

  public onInput(value: string): void {
    this.setValue(value);
  }

  public degreesChange(value: number): void {
    if (value === this.degrees) {
        this.minutesValue = 0;
        this.secondsValue = 0;
    }
    
    this.setDecimal();
  }

  public minutesChange(value: number): void {
    if (value === 60) {
      this.secondsValue = 0;
    }

    if (value && this.degreesValue === this.degrees) {
      this.degreesValue--;
    }

    this.setDecimal();
  }

  public secondsChange(value: number): void {
    if (value && this.minutesValue === 60) {
      this.minutesValue--;
    }

    if (value && this.degreesValue === this.degrees) {
      this.degreesValue--;
    }

    this.setDecimal();
  }

  public setDecimal(): void {
    const degrees = this.degreesValue || 0;
    const minutes = this.minutesValue || 0;
    const seconds = this.secondsValue || 0;

    this.setValue(degreesMinutesSecondsToDecimalDegrees(parseInt(this.direction, 10), degrees, minutes, seconds));

    this.setDisplayValue(degrees, minutes, seconds, );
  }

  private setDisplayValue(degrees: number | null, minutes: number | null, seconds: number | null): void {
    if (!isNullOrUndefined(degrees) && !isNullOrUndefined(minutes) && !isNullOrUndefined(seconds)) {
      this.dmsDisplayValue = `${degrees}°${minutes}'${seconds}"${this.directionOptions.find(option => option.value.toString() === this.direction).label}`
    } else {
      this.dmsDisplayValue = '';
    }
  }

  public handleMapChange($event: openlayers.MapBrowserEvent): void {
    if (this.mapOpened) {
      const lonLat = openlayers.proj.toLonLat($event.map.getView().getCenter());

      const latitude = trimCoordinate(lonLat[1]);
      const longitude = trimCoordinate(lonLat[0]);

      this.selectedLat = latitude;
      this.selectedLon = longitude;

      this.onMapChange.emit( { latitude, longitude });
    }
  }
  public handlePaste($event: InputEvent): void {
    setTimeout(() => {
      this.setDisplayValue(this.degreesValue, this.minutesValue, this.secondsValue);
    });
  }

  public onPopoutShown(): void {
    setTimeout(() => this.mapOpened = true, 200);
  }

  public onPopoutHidden(): void {
    this.mapOpened = false;

    this.onMapClose.emit();
  }
}