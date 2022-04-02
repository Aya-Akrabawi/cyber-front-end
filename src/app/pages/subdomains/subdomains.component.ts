import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-subdomains',
  templateUrl: './subdomains.component.html',
  styleUrls: ['./subdomains.component.css']
})
export class SubdomainsComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  loading = true;
  domainId = '';
  domainName = '';
  subDomains: any = [];
  errorApi = false;
  page = 0;
  pageSize = 10;
  total = 0;
  userRole = '';
  
  constructor(
    private http: HttpService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    
    this.subscription = this.route.params.subscribe((params: any) => {
      this.userRole = localStorage.getItem('userRoleMNQ') || '';
      this.domainId = params.domainId;
      this.domainName = params.domainName;
      
      if (this.domainId) {
        this.getSubDomains();
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getSubDomains(page = 0) {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('tokenMNQ') });
    this.http.getReq(`/sub_domain/getAllSub_domainsInDomain/${this.domainId}/${page}`, {headers}).subscribe(res => {
      this.subDomains = res.sub_domains.data;
      this.total = res.sub_domains.count;
      this.loading = false;
      this.errorApi = false
    }, err => {
      this.errorApi = true;
      this.loading = false;
      this.subDomains = [];
      this.total = 0
    })
  }
  pageChange(event: number) {
    this.getSubDomains(event - 1)
  }
}
