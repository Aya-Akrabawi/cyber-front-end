import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css']
})
export class DomainsComponent implements OnInit {

  domains: any = [];
  loading = true;
  errorApi = false;
  page = 0;
  pageSize = 10;
  total = 1;
  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.getDomains();
  }

  getDomains(page = 0) {
    this.errorApi = false;
    this.loading = true;
    this.domains = [];
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('tokenMNQ') });
    this.http.getReq(`/domains/getAllDomains/${page}`, {headers}).subscribe(res => {
      this.domains = res.domains.data;
      this.total = res.domains.count
      this.loading = false;
      this.errorApi = false;
    }, err => {
      this.domains = [];
      this.loading = false;
      this.errorApi = true;
    })
  }
  pageChange(event: any) {
    this.getDomains(event - 1)
  }
}
