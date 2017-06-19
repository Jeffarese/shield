import { NgModule } from '@angular/core';
import { ItemService } from './item.service';
import { MdIconModule } from '@angular/material';
import { TrackingModule } from '../tracking/tracking.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    MdIconModule,
    TrackingModule
  ],
  providers: [
    ItemService
  ],
})
export class ItemModule {
}
