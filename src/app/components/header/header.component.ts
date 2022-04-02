import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import localeAr from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeAr, 'ar');
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('openClose', [
      // ...
      transition(':enter', [
        style({transform: 'translateY(0)', opacity: 0}),
        animate('300ms', style({transform: 'translateY(10px)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(10px)', opacity: 1}),
        animate('300ms', style({transform: 'translateY(0)', opacity: 0}))
      ])
    ]),
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {

  notifications: any = [];
  total = 0;
  isNotificationsOpen = false;
  authUser = false;
  userRole: string = '';
  userID: string = '';
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
        this.userID = localStorage.getItem('userIDMNQ') || '';
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
        this.notifications = res?.notifications.data;
        this.total = res?.notifications.count;
      }, err => {
        this.notifications = [];
        this.total = 0;
      })
    }
  }

  markAsRead() {
    // this.http.postReq()
  }

  logout() {
    localStorage.removeItem('tokenMNQ');
    localStorage.removeItem('userRoleMNQ');
    localStorage.removeItem('userIDMNQ');
    this.router.navigate(['/sign-in'])
  }
}
