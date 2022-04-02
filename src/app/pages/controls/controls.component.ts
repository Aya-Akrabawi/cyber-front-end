import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  
  subDomainID = '';
  subscription!: Subscription;
  count = 0;
  rows:any = [];
  temp:any = [];
  loading = true;
  page = 0;
  isManager = false;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.subDomainID = params.subDomainID;
      if (this.subDomainID) {
        this.getControls();
      }
    })
    this.isManager = localStorage.getItem('userRoleMNQ') === 'manager';
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getControls(page = 0) {
    this.loading= true;
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('tokenMNQ') });
    this.http.getReq(`/controls/getAllControlsInSubDomain/${this.subDomainID}/${page}`, {headers}).subscribe(res => {
      this.rows = res.controls.data;
      this.temp = this.rows;
      this.count = res.controls.count;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.rows = [];
    })
  }

  setPage(event: any) {
    this.page = event.offset;
    this.getControls(event.offset)
  }

  updateFilter(event: any) {
    const val = event.target.value?.toLowerCase();
    if (val) {
      
      // filter our data
      const tempMainNum = this.temp.filter(function(d: any) {           
        return d.con_main_number?.toLowerCase().includes(val) || !val;
      }); 
      const tempSubNum = this.temp.filter(function(d: any) {   
        return d.con_sub_number?.toLowerCase().includes(val) || !val;
      }); 
      const tempSubName = this.temp.filter(function(d: any) {   
        return d.con_name?.toLowerCase().includes(val) || !val;
      }); 
      // update the rows
      this.rows = [...tempMainNum, ...tempSubNum, ...tempSubName];
      
      this.count = this.rows.length;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }
  }
}
