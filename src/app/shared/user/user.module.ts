import { NgModule } from '@angular/core';

import { UserService } from './user.service';
import { LoggedGuard } from './logged.guard';
import { UserComponent } from './user/user.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { HaversineService } from 'ng2-haversine';
import { SharedModule } from '../../shared/shared.module';
import { MdIconModule } from '@angular/material';
import { TrackingModule } from '../tracking/tracking.module';
import { AlreadyLoggedGuard } from './alreadyLogged.guard';
import { UserTypeComponent } from './user-type/user-type.component';
import { ItemModule } from '../item/item.module';
import { UserSurveyComponent } from './user-survey/user-survey.component';

@NgModule({
  imports: [
    SharedModule,
    MdIconModule,
    TrackingModule,
    ItemModule
  ],
  exports: [
    UserComponent,
    UserAvatarComponent,
    UserSurveyComponent
  ],
  declarations: [
    UserComponent,
    UserAvatarComponent,
    UserTypeComponent,
    UserSurveyComponent
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
