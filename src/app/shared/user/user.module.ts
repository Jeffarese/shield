import { NgModule } from '@angular/core';

import { UserService } from './user.service';
import { LoggedGuard } from './logged.guard';
import { HaversineService } from 'ng2-haversine';
import { SharedModule } from '../../shared/shared.module';
import { MdIconModule } from '@angular/material';
import { TrackingModule } from '../tracking/tracking.module';
import { AlreadyLoggedGuard } from './alreadyLogged.guard';
import { ItemModule } from '../item/item.module';

@NgModule({
  imports: [
    SharedModule,
    MdIconModule,
    TrackingModule,
    ItemModule
  ],
  providers: [
    UserService,
    LoggedGuard,
    AlreadyLoggedGuard,
    HaversineService
  ],
})
export class UserModule {
}
