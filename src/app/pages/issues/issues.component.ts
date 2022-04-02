import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent implements OnInit {

  loading = true;
  count = 0;
  rows = [];
  page = 0;
  userRole = '';

  constructor(private http: HttpService,) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRoleMNQ') || '';
    this.getIssues();
  }

  getIssues(page = 0) {
    this.loading= true;
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('tokenMNQ') });
    this.http.getReq(`/issues/getAllIssues/${page}`, {headers}).subscribe(res => {      
      this.rows = res.issues.data;
      this.count = res.issues.count;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.rows = [];
    })
  }

  setPage(event: any) {
    this.page = event.offset;
    this.getIssues(event.offset)
  }
}
