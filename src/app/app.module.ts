import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularOpenlayersModule } from "ngx-openlayers";

import { AppComponent } from './app.component';
import { LatLonInputComponent } from './form-controls/lat-lon-input/lat-lon-input.component';
import { RadioButtonsComponent } from './form-controls/radio-buttons/radio-buttons.component';
import { CoordinateInputComponent } from './form-controls/lat-lon-input/coordinate-input/coordinate-input.component';
import { InputComponent } from './form-controls/input/input.component';
import { SelectComponent } from './form-controls/select/select.component';
import { PopoutComponent } from './popout/popout.component';
import { PopoutDirective } from './popout/popout.directive';

@NgModule({
  imports:      [ BrowserModule, FormsModule, AngularOpenlayersModule ],
  declarations: [ AppComponent, PopoutComponent, LatLonInputComponent, RadioButtonsComponent, CoordinateInputComponent, InputComponent, SelectComponent, PopoutDirective ],
  bootstrap:    [ AppComponent ],
  entryComponents: [ PopoutComponent ],
})
export class AppModule { }
