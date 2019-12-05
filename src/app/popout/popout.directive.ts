import { Directive, Input, Output, TemplateRef, ElementRef, ViewContainerRef, ComponentFactoryResolver, OnInit, EventEmitter } from '@angular/core';

import { PopoutComponent } from './popout.component';

@Directive({
  selector: '[popout]'
})
export class PopoutDirective implements OnInit {
  @Input('popout') private templateRef: TemplateRef<any>;

  @Output('shown') private onShown = new EventEmitter<void>();
  @Output('hidden') private onHidden = new EventEmitter<void>();

  private popout: PopoutComponent;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    const containerFactory = this.componentFactoryResolver.resolveComponentFactory(PopoutComponent);
    this.popout = this.viewContainerRef.createComponent(containerFactory);
    this.popout.instance.template = this.templateRef;
    this.popout.instance.trigger = this.elementRef;

    this.elementRef.nativeElement.addEventListener('click', () => {
      if (!this.popout.instance.open) {
        this.popout.instance.open = true;

        this.onShown.emit();
      }
    });

    this.popout.instance.close.subscribe(() => this.onHidden.emit());
  }
}