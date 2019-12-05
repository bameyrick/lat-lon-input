import { Component } from '@angular/core';

import { CoordinateSystem } from './enums/coordinate-system';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  public coordinateSystems = Object.values(CoordinateSystem).map(value => ({ value }));
  public coordinateSystem = CoordinateSystem.DegreesMinutesSeconds;
}
