import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import localeAr from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';
registerLocaleData(localeAr, 'ar');
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;


  loading = true;
  temp: any = [];
  rows: any = [];
  count = 1;
  page = 0;
  subscription!: Subscription;
  employeeId = '';
  editing: any = {};
  userRole = '';

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.employeeId = params.employeeId;
      this.userRole = localStorage.getItem('userRoleMNQ') || '';
      this.getTasks();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTasks(page = 0) {
    const apiUlr = this.employeeId ? `/tasks/getAllTasksForUser/${this.employeeId}` : `/tasks/getAllTasks/${page}`;
    const token = localStorage.getItem('tokenMNQ');
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
    this.loading = true;
    this.http.getReq(apiUlr, { headers }).subscribe(res => {
      if (this.employeeId) {
        this.rows = res?.tasks.data;
        this.count = res.tasks.count;
      } else {
        this.rows = res.data;
        this.count = res.count;
      }
      this.temp = this.rows;
      if(this.rows.length == 0) {
        this.count = 0
      }
      this.loading = false;
    }, err => {
      this.loading = false;
      this.notificationService.error('', 'تعذر احضار المهام');
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
      const tempMainNum = this.temp.filter(function (d: any) {
        return d.con_main_number?.toLowerCase().includes(val) || !val;
      });
      const tempSubNum = this.temp.filter(function (d: any) {
        return d.con_sub_number?.toLowerCase().includes(val) || !val;
      });
      const tempSubName = this.temp.filter(function (d: any) {
        return d.con_name?.toLowerCase().includes(val) || !val;
      });
      // update the rows
      this.rows = [...tempMainNum, ...tempSubNum, ...tempSubName];

      this.count = this.rows.length;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }
  }
  updateValue(event: any, cell: string, rowIndex: number, taskId: string) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.updateTask(taskId, rowIndex);
  }
  updateTask(taskId: string | number, index: number) {
    const token = localStorage.getItem('tokenMNQ');
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
    this.http.putReq(`/tasks/update/${taskId}`, this.rows[index], { headers }).subscribe(res => {
      this.notificationService.success('', 'تم تعديل المهمة بنجاح  ');
    }, err => {
      if (err.error) {
        this.notificationService.error('', err.error);
      } else {
        this.notificationService.error('', 'تعذر نعديل المهمة');
      }
    })
  }
}
