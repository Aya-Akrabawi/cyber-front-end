import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auditors-task',
  templateUrl: './auditors-task.component.html',
  styleUrls: ['./auditors-task.component.css']
})
export class AuditorsTaskComponent implements OnInit {

  submitLoading = false;
  loading = false;
  subscription!: Subscription;
  taskId = '';
  auditorType = '';
  taskData: any;
  size = environment.fileSize
  extensions = environment.fileAllowedExt;
  submitForm = new FormGroup({
    task_commitment: new FormControl('', Validators.required),
    task_notes: new FormControl('', Validators.required),
    task_corrective_action: new FormControl('', Validators.required),
    task_status: new FormControl('', Validators.required),
    task_attachment: new FormControl(''),
    task_attachment_beforeConvert: new FormControl(''),
  });
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.taskId = params.taskId;
      params.auditorType === 'external_auditor' ? this.auditorType = 'external' : this.auditorType = 'internal';
      
      this.getTaskDetails();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTaskDetails() {
    this.loading = true;
    this.http.getReq(`/tasks/getTask/${this.taskId}`).subscribe(res => {
      this.taskData = res?.taskInfo;
      this.submitForm.controls.task_notes.setValue(this.taskData[`task_${this.auditorType}_auditor_notes`])
      this.submitForm.controls.task_status.setValue(this.taskData[`task_${this.auditorType}_auditor_status`])
      this.submitForm.controls.task_commitment.setValue(this.taskData[`task_commitment_by_${this.auditorType}_auditor`])
      this.submitForm.controls.task_corrective_action.setValue(this.taskData[`task_corrective_action_by_${this.auditorType}_auditor`])
      this.loading = false;
    }, err => {
      this.taskData = {}
      this.notificationService.error('', 'تعذر احضار بيانات المهمة')
      this.loading = false;
    })
  }

  fileConvert(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.submitForm.controls['task_attachment'].setValue(reader.result);
    };
  }
  toControl(absCtrl: AbstractControl): FormControl {
    const ctrl = absCtrl as FormControl;
    // if(!ctrl) throw;
    return ctrl;
  }

  onSubmit() {
    if (this.submitForm.invalid) {
      this.submitForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;
    const tempPayload: any = this.submitForm.value;
    const payload: any = {};

    payload[`task_attachment_by_${this.auditorType}_auditor`] = tempPayload.task_attachment;
    payload[`task_${this.auditorType}_auditor_notes`] = tempPayload.task_notes;
    payload[`task_${this.auditorType}_auditor_status`] = tempPayload.task_status;
    payload[`task_commitment_by_${this.auditorType}_auditor`] = tempPayload.task_commitment;
    payload[`task_corrective_action_by_${this.auditorType}_auditor`] = tempPayload.task_corrective_action;

    
    this.http.putReq(`/tasks/update/${this.taskId}`, payload).subscribe(res => {
      this.notificationService.success('', 'تم تعديل المهمة بنجاح');
      this.submitLoading = false;
      this.router.navigate(['/tasks']);
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', err.error)
    })
  }
}
