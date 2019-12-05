import {
  Component,
  Output,
  ElementRef,
  TemplateRef,
  HostListener,
  EventEmitter,
  ViewChild,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-popout',
  templateUrl: './popout.component.html',
  styleUrls: ['./popout.component.scss']
})
export class PopoutComponent {
  @Output() public close = new EventEmitter<boolean>();

  public template: TemplateRef<any>;

  public trigger: ElementRef<any>;
  
  @ViewChild('popout') private popout: ElementRef;

  public width: string;
  public left: string;
  public opacity: number = 0;

  private _open: boolean;
  private clickedInside: boolean;

  private readonly bodyOffset = 10;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  public set open(open: boolean) {
    this._open = open;
    
    if (open) {
      this.layoutPopover();
    }
  }

  private layoutPopover(): void {
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    this.width = `${hostRect.width}px`;

    setTimeout(() => {
      const templateRect = this.popout.nativeElement.getBoundingClientRect();

      let left = (hostRect.width / 2) - (templateRect.width / 2);

      const leftDiff = hostRect.x - this.bodyOffset + left;

      if (leftDiff < this.bodyOffset) {
        left -= leftDiff;
      } else {
        const rightDiff = hostRect.x + hostRect.width - left - window.innerWidth;

        if (rightDiff > this.bodyOffset) {
          left -= rightDiff + this.bodyOffset;
        }
      }
      
      this.left = `${left}px`;

      this.opacity = 1;
    });
  }

  public get open(): boolean {
    return this._open;
  }


  @HostListener('window:resize') private onResize(): void {
    if (this.open) {
      this.layoutPopover();
    }
  }

  @HostListener('document:mousedown', ['$event']) private clickOutside($event: MouseEvent): void {
    if (this.open) {
      const target = $event.target;

      if (
        target && 
        !this.trigger.nativeElement.contains(target) && 
        !this.elementRef.nativeElement.contains(target)
      ) {
        this.open = false;
        this.opacity = 0;
        this.close.emit();
      }
    }
  }
}