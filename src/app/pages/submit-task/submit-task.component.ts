import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-submit-task',
  templateUrl: './submit-task.component.html',
  styleUrls: ['./submit-task.component.css']
})
export class SubmitTaskComponent implements OnInit {

  subscription!: Subscription;
  taskData: any;
  taskId: string = '';
  submitForm = new FormGroup({
    task_commitment: new FormControl('', Validators.required),
    task_employee_notes: new FormControl('', Validators.required),
    task_corrective_action: new FormControl('', Validators.required),
    task_attachment: new FormControl(''),
    task_attachment_beforeConvert: new FormControl(''),
  });
  submitLoading = false;
  loading = true;
  size = environment.fileSize
  extensions = environment.fileAllowedExt;
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.taskId = params.taskId;
      // this.getTasks();
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
      this.submitForm.controls.task_employee_notes.setValue(this.taskData?.task_employee_notes)
      this.submitForm.controls.task_commitment.setValue(this.taskData?.task_commitment)
      this.submitForm.controls.task_corrective_action.setValue(this.taskData?.task_corrective_action)
      this.loading = false;
    }, err => {
      this.taskData = {}
      this.notificationService.error('', 'تعذر احضار بيانات المهمة')
      this.loading = false;
    })
  }
  onSubmit() {
    console.log(this.submitForm);
    if (this.submitForm.invalid) {
      this.submitForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;

    this.http.putReq(`/tasks/update/${this.taskId}`, this.submitForm.value).subscribe(res => {
      this.notificationService.success('', 'تم تعديل المهمة بنجاح');
      this.submitLoading = false;
      this.router.navigate(['/tasks', this.userService.userId]);
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', err.error)
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
}
