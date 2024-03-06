import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverFlags]'
})
export class HoverFlagsDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    // Se ejecuta cuando el mouse entra en el elemento
    this.addHoverClass();
  }

  @HostListener('mouseleave') onMouseLeave() {
    // Se ejecuta cuando el mouse sale del elemento
    this.removeHoverClass();
  }

  private addHoverClass() {
    console.log()
    this.renderer.addClass(this.el.nativeElement, 'hovered'); // Añade la clase 'hovered'
  }

  private removeHoverClass() {
    this.renderer.removeClass(this.el.nativeElement, 'hovered'); // Elimina la clase 'hovered'
  }
}

