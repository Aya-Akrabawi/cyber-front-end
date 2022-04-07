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

  saveByteArray(reportName: string, byte: any) {
    console.log(byte);
    
    var blob = new Blob([byte], { type: "image/png" });
    console.log(blob);
    
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  };
}
