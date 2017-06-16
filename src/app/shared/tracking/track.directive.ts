import { Directive, HostListener, Input } from '@angular/core';
import { TrackingService } from './tracking.service';

@Directive({
  selector: '[tslTrack]'
})
export class TrackDirective {

  @Input('tslTrack') event: string;
  private _params: any;

  constructor(private trackingService: TrackingService) {
  }

  @HostListener('click') onClick() {
    this.trackingService.track(TrackingService[this.event], this._params);
  }

  @Input() set params(params: any) {
    this._params = params;
  };

}
