import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

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
  newTaskForm = new FormGroup({
    task_name: new FormControl('', Validators.required),
    task_manager_notes: new FormControl(''),
    task_expected_start_date: new FormControl(''),
    task_expected_end_date: new FormControl(''),
    task_expected_audit_date: new FormControl(''),
    control_id: new FormControl(''),
    assignToType: new FormControl(''),
    task_assigned_department: new FormControl(''),
    task_internal_auditor_id: new FormControl(''),
    task_assigned_user_id: new FormControl(''),
    task_external_auditor_id: new FormControl(''),
  });
  users: any = [];
  today = (new Date()).toISOString().split('T')[0]
  constructor(
    private route: ActivatedRoute,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    console.log(this.today);
    
    this.subscription = this.route.params.subscribe((params: any) => {
      this.controlID = params.subDomainID;
      this.newTaskForm.controls.control_id.setValue(this.controlID);
    });
    this.getAuditors();
    this.getAllUsers();
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
  getAllUsers() {
    this.http.getReq('/users').subscribe(res => {
      this.users = res;
    }, err => {
      this.users = [];
    })
  }
  onSubmit() {

  }
}
