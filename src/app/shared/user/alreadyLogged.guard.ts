import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AlreadyLoggedGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  public canActivate() {
    if (this.userService.isLogged) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
