import { Component, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControl } from '../base-control';
import { Option } from '../../types/option';

@Component({
  selector: 'app-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonsComponent),
      multi: true,
    }
  ],
})
export class RadioButtonsComponent extends BaseControl<any> {
  @Input() public options: Option;
}