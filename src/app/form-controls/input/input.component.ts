import { Component, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControl } from '../base-control';
import { InputType } from './input-type';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent extends BaseControl<string | number> {
  @Input() public type: InputType;
  @Input() public min: number;
  @Input() public max: number;
  @Input() public step: number;
  @Input() public unit: string;
  @Input() public pattern: string;

  @ViewChild('input') public input: ElementRef;

  public readonly InputType = InputType;

  public onKeydown($event: KeyboardEvent): void {
    if ($event.key === '.' && this.type === InputType.number && this.step && this.step % 1 === 0) {
      $event.preventDefault();
    }
  }

  public onInput($event: any): void {
    if (this.type === InputType.number && this.step && this.step % 1 === 0) {
      $event.target.value = parseInt($event.target.value, 10);
    }
  }

  public setValue(value: string): void {
    if (this.type === InputType.number) {
      if (this.step && this.step % 1 === 0) {
        this.value = parseInt(value, 10);
      } else {
        this.value = parseFloat(value);
      } 
    } else {
      this.value = value;
    }

    this.propogateChange(this.value);
  }
}