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
import { UserService } from 'src/app/services/user.service';
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
  subscription!: Subscription;
  isProfileMenuOpen = false;

  typeUrls: any = {
    'Meeting': 'meetings',
    'Announcement': 'announcements',
    'Issue': 'issues',
    'Task': 'tasks'
  }
  isUnreadNotification = false;

  constructor(
    private http: HttpService,
    private router: Router,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.subscription = this.router.events.pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.getNotifications();
        this.isNotificationsOpen = false;
        this.isProfileMenuOpen = false;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  getNotifications() {
    this.http.getReq('/notifications/getAllNotificationsForUser').subscribe(res => {
      this.notifications = res?.notifications.data?.slice(0,21);
      this.total = res?.notifications.count;
      this.checkForUnreadNotifications()
    }, err => {
      this.notifications = [];
      this.total = 0;
    })
  }

  markAsRead(index: number, id: number) {
    if (!this.notifications[index].is_read) {
      this.notifications[index].is_read = true;
      this.http.putReq(`/notifications/update/${id}`, this.notifications[index]).subscribe( res => {
        // do nothing (no feedback for user is needed)
      });
     this.checkForUnreadNotifications()
    }
    this.router.navigate([this.typeUrls[this.notifications[index].notification_type]])
  }

  logout() {
    localStorage.removeItem('tokenMNQ');
    localStorage.removeItem('userRoleMNQ');
    localStorage.removeItem('userIDMNQ');
    this.router.navigate(['/sign-in'])
  }

  checkForUnreadNotifications() {
    this.notifications.findIndex((el: any) => el.is_read == false) !== -1? this.isUnreadNotification = true : this.isUnreadNotification = false;
  }
}
