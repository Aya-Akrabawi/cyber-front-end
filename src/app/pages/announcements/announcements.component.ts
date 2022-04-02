import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

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
  userRole = '';

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRoleMNQ') || '';
    this.getAnnouncements();
  }

  getAnnouncements(page = 0) {
    this.loading= true;
    const token = localStorage.getItem('tokenMNQ');
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
    this.http.getReq(`/announcements/getAllAnnouncements/${page}`, {headers}).subscribe(res => {
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
