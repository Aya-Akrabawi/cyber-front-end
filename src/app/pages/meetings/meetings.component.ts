import { HttpHeaders } from '@angular/common/http';
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

  constructor(
    private http: HttpService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.getUserMeetings();
  }

  getUserMeetings(page = 0) {
    const token = localStorage.getItem('tokenMNQ');
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
    this.loading = true;
    this.http.getReq(`/meetings/getAllMeetingsForUser`, { headers }).subscribe(res => {
      this.loading = false;
      this.rows = res?.meetings?.data;
      this.count = res?.meetings?.count;
    }, err => {
      this.loading = false;
      this.rows = [];
      this.count = 0
      this.notificationService.error('', err.error);
    });
  }

  setPage(event: any) {
    this.page = event.offset;
    this.getUserMeetings(event.offset)
  }
}
