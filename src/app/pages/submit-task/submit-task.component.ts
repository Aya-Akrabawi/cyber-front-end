import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { FileUploader } from 'ng2-file-upload';
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
    task_attachment_beforeConvert: new FormControl(''),
  });
  submitLoading = false;
  loading = true;
  size = environment.fileSize
  extensions = environment.fileAllowedExt;
  public uploader: FileUploader = new FileUploader({
    url: `${environment.baseURL}/tasks/update/${this.taskId}`,
    headers: [{ name: 'Authorization', value: `Bearer ${this.userService.token}` }],
    itemAlias: 'uploaded_file',
    queueLimit: 1,
  });
  
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
    this.uploader.onBuildItemForm = (item, form) => {
      const formValue = this.submitForm.value;
      for (const key in formValue) {
        form.append(key, formValue[key]);
      }
    };
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => this.onApiError(response);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem();
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
    if (this.submitForm.invalid) {
      this.submitForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;

    // this.http.putReq(`/tasks/update/${this.taskId}`, this.submitForm.value).subscribe(res => {
    //   this.notificationService.success('', 'تم تعديل المهمة بنجاح');
    //   this.submitLoading = false;
    //   this.router.navigate(['/tasks', this.userService.userId]);
    // }, err => {
    //   this.submitLoading = false;
    //   this.notificationService.error('', err.error)
    // })
  }
  onSuccessItem() {
    this.notificationService.success('', 'تم تعديل المهمة بنجاح');
    this.submitLoading = false;
    this.router.navigate(['/tasks', this.userService.userId]);
  }
  onApiError(err: any) {
    this.submitLoading = false;
    if(err.error) {
      this.notificationService.error('', err.error);
    } else {
      this.notificationService.error('', 'حدث خطأ, يرجى إعادة المحاولة');

    }
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
