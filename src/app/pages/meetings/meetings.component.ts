import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {

  meetingCreator = '';
  loading = true;
  rows: any = [];
  count = 0;
  page = 0;
  usersInfoObj: any = {};
  notifiedUserIdsArr: string[] = [];

  constructor(
    private http: HttpService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.getUserMeetings();
  }

  getUserMeetings(page = 0) {
    this.loading = true;
    this.http.getReq(`/meetings/getAllMeetingsForUser`).subscribe(res => {
      this.loading = false;
      this.rows = res?.meetings?.data;
      this.count = res?.meetings?.count;
      this.extractNotifiedUsersIds();
    }, err => {
      this.loading = false;
      this.rows = [];
      this.count = 0
      this.notificationService.error('', err.error);
    });
  }
  extractNotifiedUsersIds() {
    this.rows.forEach((row: any) => {
      const notifiedUsers = row.notified_users_id;
      let arr = [];
      if (notifiedUsers) {
        arr = notifiedUsers.split(',');        
        arr.forEach((id: string) => {
          if (this.notifiedUserIdsArr.indexOf(id) === -1) {
            this.notifiedUserIdsArr.push(id)
          }
        })
      }
    });
    this.getNotifiedUsersData(this.notifiedUserIdsArr.join(","))        
  }

  getNotifiedUsersData(usersIds: string) {
    this.http.getReq(`/getUserById?userID=${usersIds}`).subscribe(res => {
      const userInfo = res?.userInfo;
      userInfo.forEach((user: any) => {
        this.usersInfoObj[user.user_id] = user;
      });
    }, err => {
      this.usersInfoObj = {};
    })
  }

  setPage(event: any) {
    this.page = event.offset;
    this.getUserMeetings(event.offset)
  }
}
