import { ChangeDetectorRef, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverColor]'
})
export class HoverColorDirective {

  private _color:string = "transparent";
  @Input() set appHighLight(color:string){
    this._color = color;
  }
  get appHighLight():string{
    return this._color;
  }
  constructor(
    private renderer:Renderer2,
    private el:ElementRef
  ) {
    this.unsetHighlight();
  }

  @HostListener('mouseenter') onMouseEnter(){
    this.setHighlight();
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.unsetHighlight();
  }

  private setHighlight(){
    this.renderer.addClass(this.el.nativeElement, 'highlight');
  }
  private unsetHighlight(){
    this.renderer.removeClass(this.el.nativeElement, 'highlight');
    }
}
