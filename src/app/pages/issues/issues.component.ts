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
  baseUrl = environment.baseURL;
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

  download(link: string) {
    console.log("linkkkkkkk", link);
    
    var element = document.createElement('a');
    element.setAttribute('href', this.baseUrl+ '/attachments/'+link);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  // saveByteArray(reportName: string, fileBits: any) {
  //   // const base64String = btoa(String.fromCharCode(...new Uint8Array(byte)));
  //   // console.log(base64String);
    
  //   var link = document.createElement('a');
  //   link.href = fileBits;
  //   var fileName = reportName + '.png';
  //   link.download = fileName;
  //   link.click();
  // };
}
