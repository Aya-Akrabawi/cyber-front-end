import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  notifications = [];
  total = 3;
  isNotificationsOpen = false;
  authUser = false;
  userRole: string = '';
  subscription!: Subscription;
  isProfileMenuOpen = false;

  constructor(
    private http: HttpService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.router.events.pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.getNotifications();
        this.userRole = localStorage.getItem('userRoleMNQ') || '';
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  getNotifications() {
    const token = localStorage.getItem('tokenMNQ');
    if (token) {
      this.authUser = true;
      const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
      this.http.getReq('/notifications/getAllNotificationsForUser', { headers }).subscribe(res => {

      }, err => {

      })
    }
  }

  logout() {
    localStorage.removeItem('tokenMNQ');
    localStorage.removeItem('userRoleMNQ');
    localStorage.removeItem('userIDMNQ');
    this.router.navigate(['/sign-in'])
  }
}
