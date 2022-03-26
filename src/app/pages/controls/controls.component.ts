import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  subDomainID = '';
  subscription!: Subscription;
  rows = [
    { 'المكون الاساسي للضابط': 'Austin', gender: 'Male', company: 'Swimlane' },
    { 'المكون الاساسي للضابط': 'Dany', gender: 'Male', company: 'KFC' },
    { 'المكون الاساسي للضابط': 'Molly', gender: 'Female', company: 'Burger King' }
  ];
  columns = [
    // { name: 'المكون الاساسي للضابط' }, 
    // { name: 'المكون الفرعي للضابط' }, 
    { name: 'ar_domain_name' },
    { name: 'ar_sub_domain_name' },
    { name: 'con_main_number' },
    { name: 'con_name' },
    { name: 'sub_domain_goal' },
    { name: 'ar_domain_name' },
    { name: 'sub_domain_name' },
  ];
  constructor(
    private http: HttpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.subDomainID = params.subDomainID;
      // this.domainName = params.domainName;
      
      if (this.subDomainID) {
        this.getControls();
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getControls(page = 0) {
    this.http.getReq(`/controls/getAllControlsInSubDomain/${this.subDomainID}/${page}`).subscribe(res => {
      this.rows = res.controls.data
    }, err => {
      
    })
  }
}
