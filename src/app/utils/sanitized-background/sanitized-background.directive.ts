import { Directive, Input, Renderer, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[tslsanitizedBackground]'
})
export class SanitizedBackgroundDirective implements OnChanges {

  @Input('tslsanitizedBackground') image: string;
  @Input('fallback') fallback: string;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  ngOnChanges(changes?: any) {
    if (this.fallback) {
      this.renderer.setElementStyle(this.el.nativeElement, 'backgroundImage', `url(${this.image}), url('${this.fallback}')`);
    } else {
      this.renderer.setElementStyle(this.el.nativeElement, 'backgroundImage', `url(${this.image})`);
    }

  }

}
