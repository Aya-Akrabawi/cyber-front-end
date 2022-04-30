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
  departments: any = [];
  csvRows: any = [];

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
    });
    this.getDepartments();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDepartments() {
    this.httpClient.get('/assets/departments.json').subscribe(res => {
      this.departments = res;
    })
  }

  getTasks(page = 0) {
    const apiUlr = this.employeeId ? `/tasks/getAllTasksForUser/${this.employeeId}` : `/tasks/getAllTasks/${page}`;
    this.loading = true;
    this.http.getReq(apiUlr).subscribe(res => {
      // this.httpClient.get('/assets/response.json').subscribe((res: any) => {
      if (this.employeeId) {
        this.rows = res?.tasks.data;
        this.count = res.tasks.count;
      } else {
        this.rows = res.data;
        this.count = res.count;
      }
      this.csvDataFormat();
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
    this.csvDataFormat();
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  updateValue(cell: string, rowIndex: number) {
    this.rows[rowIndex][cell] = this.personNote;
    this.rows = [...this.rows];
    this.csvDataFormat();
  }
  updateTask(taskId: string | number, index: number, cell: string, value = '') {
    let payload;
    if (cell === 'task_manager_notes') {
      payload = {...this.rows[index]};
      payload[cell] = this.personNote;
    } else {
      payload = this.rows[index];
    }
    this.http.putReq(`/tasks/update/${taskId}`, payload).subscribe(res => {
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
      'ext-aud-cols': column.prop === 'task_commitment_by_external_auditor' || column.prop === 'task_corrective_action_by_external_auditor' || column.prop === 'task_attachment_by_external_auditor' || column.prop === 'task_external_auditor_notes' || column.prop === 'task_external_auditor_status',
      'int-aud-cols': column.prop === 'task_commitment_by_internal_auditor' || column.prop === 'task_corrective_action_by_internal_auditor' || column.prop === 'task_attachment_by_internal_auditor' || column.prop === 'task_internal_auditor_notes' || column.prop === 'task_internal_auditor_status',
    };
  }

  updateStatusOStage(taskId: any, rowIndex: number, cell: string, event: any) {
    this.editing[rowIndex + '-' + cell] = false;
    let value = event.target.value;
    this.rows[rowIndex][cell] = value;
    this.rows = [...this.rows];
    this.updateTask(taskId, rowIndex, cell, value);
  }

  saveByteArray(reportName: string, fileBits: any) {
    // const base64String = btoa(String.fromCharCode(...new Uint8Array(byte)));
    // console.log(base64String);
    
    var link = document.createElement('a');
    link.href = fileBits;
    var fileName = reportName + '.png';
    link.download = fileName;
    link.click();
  };
  
  csvDataFormat() {
    this.csvRows = [];
    this.rows.forEach((row: any, i: number) => {
      this.csvRows.push({...row})
      row['task_attachment'] ? this.csvRows[i]['task_attachment'] = 'موجود':  this.csvRows[i]['task_attachment'] = ' غير موجود'
      row['task_attachment_by_external_auditor'] ? this.csvRows[i]['task_attachment_by_external_auditor'] = 'موجود':  this.csvRows[i]['task_attachment_by_external_auditor'] = 'غير موجود'
      row['task_attachment_by_internal_auditor'] ? this.csvRows[i]['task_attachment_by_internal_auditor'] = 'موجود':  this.csvRows[i]['task_attachment_by_internal_auditor'] = 'غير موجود'
      this.csvRows[i]['task_actual_audit_date'] = this.csvRows[i]['task_actual_audit_date']?.split('T')[0]; 
      this.csvRows[i]['task_expected_start_date'] = this.csvRows[i]['task_expected_start_date']?.split('T')[0]; 
      this.csvRows[i]['task_actual_end_date'] = this.csvRows[i]['task_actual_end_date']?.split('T')[0]; 
      this.csvRows[i]['task_actual_start_date'] = this.csvRows[i]['task_actual_start_date']?.split('T')[0]; 
      this.csvRows[i]['task_commitment_expected_date'] = this.csvRows[i]['task_commitment_expected_date']?.split('T')[0]; 
      this.csvRows[i]['task_creation_date'] = this.csvRows[i]['task_creation_date']?.split('T')[0]; 
      this.csvRows[i]['task_expected_end_date'] = this.csvRows[i]['task_expected_end_date']?.split('T')[0]; 
      this.csvRows[i]['task_expected_audit_date'] = this.csvRows[i]['task_expected_audit_date']?.split('T')[0]; 
    });    
  }
}
