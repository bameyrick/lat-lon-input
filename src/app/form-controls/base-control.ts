import { Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export class BaseControl<T> implements ControlValueAccessor {
  @Input() public name: string;
  @Input() public readonly: boolean;

  @Output() public focus = new EventEmitter<FocusEvent>();
  @Output() public blur = new EventEmitter<FocusEvent>();

  public value: T;

  protected propogateChange = (_: T) => {}
  
  public writeValue(value: T): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.propogateChange = fn;
  }

  public registerOnTouched(fn: any): void {}

  public setValue(value: T): void {
    this.value = value;

    this.propogateChange(value);
  }
}