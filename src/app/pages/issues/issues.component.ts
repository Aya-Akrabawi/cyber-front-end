import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

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
  attchmentUrl = environment.baseURL + '/attachments/';
  
  constructor(private http: HttpService,public userService: UserService) { }

  ngOnInit(): void {
    this.getIssues();
  }

  getIssues(page = 0) {
    this.loading = true;
    this.http.getReq(`/issues/getAllIssues/${page}`).subscribe(res => {
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
