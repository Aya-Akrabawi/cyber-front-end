import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import localeAr from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
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
  userRole = '';
  userID!: number;
  personTypeID!: number;
  personTypeNotes = '';
  personTypeNotesEng = '';
  personNote = '';

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private modalService: NgbModal,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.employeeId = params.employeeId;
      this.userRole = localStorage.getItem('userRoleMNQ') || '';
      const userTempId = localStorage.getItem('userIDMNQ') || '';
      if (userTempId) {
        this.userID = +userTempId;
      }
      this.getTasks();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTasks(page = 0) {
    // const apiUlr = this.employeeId ? `/tasks/getAllTasksForUser/${this.employeeId}` : `/tasks/getAllTasks/${page}`;
    // this.loading = true;
    // this.http.getReq(apiUlr).subscribe(res => {
    this.httpClient.get('/assets/data.json').subscribe((res: any) => {
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
  updateValue(cell: string, rowIndex: number) {
    this.rows[rowIndex][cell] = this.personNote;
    this.rows = [...this.rows];
  }
  updateTask(taskId: string | number, index: number, cell:string) {
    this.http.putReq(`/tasks/update/${taskId}`, this.rows[index]).subscribe(res => {
      this.notificationService.success('', 'تم تعديل المهمة بنجاح  ');
      this.updateValue(cell, index);
    }, err => {
      if (err.error) {
        this.notificationService.error('', err.error);
      } else {
        this.notificationService.error('', 'تعذر نعديل المهمة');
      }
    })
  }

  open(obj: any) {
    this.personTypeNotes = obj.personType;
    this.personTypeID = obj.personId;
    this.personTypeNotesEng = obj.personTypeEng;
    this.personNote = obj.note;
    this.modalService.open(obj.content, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
      this.updateTask(obj.taskId, obj.rowIndex, obj.cell);
      this.showOrHideEdit();
    }, (reason) => {
      this.personTypeNotes = '';
      this.personTypeNotesEng = '';
      this.personNote = '';
    });
  }

  showOrHideEdit() {
    document.getElementById('note-input')?.classList.toggle('d-none')
    document.getElementById('note')?.classList.toggle('d-none')
    document.getElementById('edit-note-btn')?.classList.toggle('d-none')
    document.getElementById('save-note-btn')?.classList.toggle('d-none')
  }
  getRowClass(row: any) {
    return {
      'red': row.task_commitment === '',
      // 'red': row.task_commitment === '',
      // 'red': row.task_commitment === '',
    };
  }
  getCellClass({ row, column, value }: any): any {
    console.log(column);
    
    return {
      'task-info': column.prop === 'ar_sub_domain_name' || column.prop === 'ar_domain_name' || column.prop === 'task_name',
      'employee-cols' : column.prop === 'task_commitment' || column.prop === 'task_attachment' ||  column.prop === 'task_employee_notes' || column.prop === 'task_corrective_action',
      'manager-cols' : column.prop === 'task_manager_notes' || column.prop === 'task_status' ||  column.prop === 'task_stage'
    };
  }
}
