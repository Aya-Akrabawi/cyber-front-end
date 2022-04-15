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
import { UserService } from 'src/app/services/user.service';
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
  userID!: number;
  personTypeID!: number;
  personTypeNotes = '';
  personTypeNotesEng = '';
  taskIdToBeEdited: string | number = ''
  personNote = '';
  editing: any = {};

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private modalService: NgbModal,
    private httpClient: HttpClient,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.employeeId = params.employeeId;
      const userTempId = this.userService.userId;
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
    const apiUlr = this.employeeId ? `/tasks/getAllTasksForUser/${this.employeeId}` : `/tasks/getAllTasks/${page}`;
    this.loading = true;
    this.http.getReq(apiUlr).subscribe(res => {
      // this.httpClient.get('/assets/data.json').subscribe((res: any) => {
      if (this.employeeId) {
        this.rows = res?.tasks.data;
        this.count = res.tasks.count;
      } else {
        this.rows = res.data;
        this.count = res.count;
      }
      this.temp = [...this.rows];

      if (this.rows.length == 0) {
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
      const tempManagerCom = this.temp.filter(function (d: any) {
        return d.task_commitment?.toLowerCase().includes(val) || !val;
      });
      const tempExtAudComm = this.temp.filter(function (d: any) {
        return d.task_commitment_by_external_auditor?.toLowerCase().includes(val) || !val;
      });
      const tempIntAudComm = this.temp.filter(function (d: any) {
        return d.task_commitment_by_internal_auditor?.toLowerCase().includes(val) || !val;
      });
      const tempDomainName = this.temp.filter(function (d: any) {
        return d.ar_domain_name?.toLowerCase().includes(val) || !val;
      });
      const tempSubDomainName = this.temp.filter(function (d: any) {
        return d.ar_sub_domain_name?.toLowerCase().includes(val) || !val;
      });

      // update the rows
      this.rows = [...tempManagerCom, ...tempExtAudComm, ...tempIntAudComm, ...tempDomainName, ...tempSubDomainName];


    } else {
      this.rows = this.temp;
    }
    this.count = this.rows.length;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  updateValue(cell: string, rowIndex: number) {
    this.rows[rowIndex][cell] = this.personNote;
    this.rows = [...this.rows];
  }
  updateTask(taskId: string | number, index: number, cell: string, value = '') {
    this.http.putReq(`/tasks/update/${taskId}`, this.rows[index]).subscribe(res => {
      this.notificationService.success('', 'تم تعديل المهمة بنجاح  ');
      if (!value) {
        this.updateValue(cell, index);
      }
    }, err => {
      if (err.error) {
        this.notificationService.error('', err.error.message);
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
    this.taskIdToBeEdited = obj.taskId;
    this.modalService.open(obj.content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.updateTask(this.taskIdToBeEdited, obj.rowIndex, obj.cell);
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
    return {
      'task-info': column.prop === 'ar_sub_domain_name' || column.prop === 'ar_domain_name' || column.prop === 'task_name',
      'employee-cols': column.prop === 'task_commitment' || column.prop === 'task_attachment' || column.prop === 'task_employee_notes' || column.prop === 'task_corrective_action',
      'manager-cols': column.prop === 'task_manager_notes' || column.prop === 'task_status' || column.prop === 'task_stage',
      'ext-aud-cols': column.prop === 'task_commitment_by_external_auditor' || column.prop === 'task_corrective_action_by_external_auditor' || column.prop === 'task_attachment_by_external_auditor' || column.prop === 'task_external_auditor_notes',
      'int-aud-cols': column.prop === 'task_commitment_by_internal_auditor' || column.prop === 'task_corrective_action_by_internal_auditor' || column.prop === 'task_attachment_by_internal_auditor' || column.prop === 'task_internal_auditor_notes',
    };
  }

  updateStatusOStage(taskId: any, rowIndex: number, cell: string, event: any) {
    this.editing[rowIndex + '-' + cell] = false;
    let value = event.target.value;
    this.rows[rowIndex][cell] = value;
    this.rows = [...this.rows];
    this.updateTask(taskId, rowIndex, cell, value);
  }

}
