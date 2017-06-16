import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class LoggedGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot) {
    if (!this.userService.isLogged) {
      this.userService.queryParams = route.queryParams;
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
