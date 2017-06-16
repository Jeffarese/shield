import { NgModule } from '@angular/core';
import { TrackingService } from './tracking.service';
import { TrackDirective } from './track.directive';

@NgModule({
  imports: [],
  exports: [
    TrackDirective
  ],
  declarations: [
    TrackDirective
  ],
  providers: [
    TrackingService
  ],
})
export class TrackingModule {
}
