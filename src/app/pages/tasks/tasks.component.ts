import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  
  loading = true;
  temp: any = [];
  rows: any = [];
  count = 1;
  page = 0;

  constructor(private http: HttpService,) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(page = 0) {
    this.loading= true;
    this.http.getReq(`/tasks/getAllTasks/${page}`).subscribe(res => {
      this.rows = res.data;
      this.temp = this.rows;
      this.count = res.count;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.rows = [];
    })
  }

  setPage(event: any) {
    this.page = event.offset;
    this.getTasks(event.offset)
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
