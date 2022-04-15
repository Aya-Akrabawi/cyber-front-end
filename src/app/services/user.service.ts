import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userRole = localStorage.getItem('userRoleMNQ') ;
  userId = localStorage.getItem('userIDMNQ');
  token = localStorage.getItem('tokenMNQ');
  isAuthUser = false;

  constructor(private router: Router) { 
    router.events.pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.userRole = localStorage.getItem('userRoleMNQ') || '';
        this.userId = localStorage.getItem('userIDMNQ') || '';
        this.token = localStorage.getItem('tokenMNQ') || '';
        this.token ? this.isAuthUser = true :  this.isAuthUser = false;
      });
  }
}
