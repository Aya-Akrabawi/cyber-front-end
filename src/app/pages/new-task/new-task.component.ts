import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  subscription!: Subscription;
  internalAuditors: any = [];
  externalAuditors: any = [];
  controlID = 0;
  submitLoading = false;
  today = (new Date()).toISOString().split('T')[0];
  newTaskForm = new FormGroup({
    task_name: new FormControl('', Validators.required),
    task_manager_notes: new FormControl(''),
    task_expected_start_date: new FormControl('', [Validators.required, this.minDate()]),
    task_expected_end_date: new FormControl('', [Validators.required, this.minDate()]),
    task_expected_audit_date: new FormControl('', Validators.required),
    control_id: new FormControl(''),
    assignToType: new FormControl('', Validators.required),
    task_assigned_department: new FormControl(''),
    task_internal_auditor_id: new FormControl('', Validators.required),
    task_assigned_user_id: new FormControl(''),
    task_external_auditor_id: new FormControl('', Validators.required),
    task_manager_id: new FormControl(''),
  });
  employees: any = [];
  departments: any = [];
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router,
    private userService: UserService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {

    this.subscription = this.route.params.subscribe((params: any) => {
      this.controlID = params.controlID;
      this.newTaskForm.controls.control_id.setValue(this.controlID);
    });
    const managerId = this.userService.userId;
    this.newTaskForm.controls.task_manager_id.setValue(managerId);
    this.getAuditors();
    this.getAllEmployees();
    this.getDepartments();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAuditors() {
    this.http.getReq('/getAllInternalAuditors').subscribe(res => {
      this.internalAuditors = res;
    }, err => {
      this.internalAuditors = [];

    })
    this.http.getReq('/getAllExternal').subscribe(res => {
      this.externalAuditors = res;
    }, err => {
      this.externalAuditors = [];

    })
  }
  getAllEmployees() {
    this.http.getReq('/getAllEmployees').subscribe(res => {
      this.employees = res;
    }, err => {
      this.employees = [];
    })
  }
  getDepartments() {
    this.httpClient.get('/assets/departments.json').subscribe(res => {
      this.departments = res;
    })
  }
  onSubmit() {
    if(this.newTaskForm.invalid) {
      this.newTaskForm.markAllAsTouched();
      return;
    }
    this.submitLoading = true;
    const payload = this.newTaskForm.value;
    if (payload.task_assigned_department) {
      payload.task_assigned_user_id = null;
    }
    this.http.postReq(`/tasks/add/${this.controlID}`, payload).subscribe(res => {
      this.notificationService.success('', '?????? ?????????? ???????????? ??????????');
      this.submitLoading = false;
      this.router.navigate(['/tasks']);
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', '???????? ?????????? ???????? ??????????');
    })
  }
  minDate(): ValidatorFn {
    return (control: any): ValidationErrors | null => {
      if (control.value) {
        return control.value < this.today ? { 'minDate': true } : null;
      }
      return null;
    };
  }
}
