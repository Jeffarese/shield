import { NgModule } from '@angular/core';
import { ItemService } from './item.service';
import { MdIconModule } from '@angular/material';
import { TrackingModule } from '../tracking/tracking.module';
import { ItemAvatarComponent } from './item-avatar/item-avatar.component';
import { SharedModule } from '../../shared/shared.module';
import { ItemSoldComponent } from './item-sold/item-sold.component';

@NgModule({
  imports: [
    SharedModule,
    MdIconModule,
    TrackingModule
  ],
  exports: [
    ItemAvatarComponent,
    ItemSoldComponent
  ],
  declarations: [
    ItemAvatarComponent,
    ItemSoldComponent
  ],
  providers: [
    ItemService
  ],
})
export class ItemModule {
}
