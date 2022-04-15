import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {

  loading = true;
  page = 0;
  count = 0;
  rows = [];

  constructor(private http: HttpService, public userService: UserService) { }

  ngOnInit(): void {
    this.getAnnouncements();
  }

  getAnnouncements(page = 0) {
    this.loading= true;
    this.http.getReq(`/announcements/getAllAnnouncements/${page}`).subscribe(res => {
      this.rows = res.announcements.data;
      this.count = res.announcements.count;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.rows = [];
    })
  }

  setPage(event: any) {
    this.page = event.offset;
    this.getAnnouncements(event.offset)
  }
}
