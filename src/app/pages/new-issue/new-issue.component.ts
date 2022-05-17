import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.css']
})
export class NewIssueComponent implements OnInit {

  issueForm = new FormGroup({
    issue_name: new FormControl('', Validators.required),
    issue_notes: new FormControl('', Validators.required),
    issue_attachment_beforeConvert: new FormControl(''),
    issue_sent_to_id: new FormControl('')
  });
  public uploader: FileUploader = new FileUploader({
    url: `${environment.baseURL}/issues/add`,
    headers: [{ name: 'Authorization', value: `Bearer ${this.userSrervice.token}` }],
    itemAlias: 'uploaded_file',
    queueLimit: 1,
  });
  submitLoading = false;
  managers: any = [];
  size = environment.fileSize
  extensions = environment.fileAllowedExt;

  constructor(
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router,
    private userSrervice: UserService
  ) { }

  ngOnInit(): void {
    this.getManagers();
    this.uploader.onBuildItemForm = (item, form) => {
      const formValue = this.issueForm.value;
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

  getManagers() {
    this.http.getReq('/getAllManagers').subscribe(res => {
      this.managers = res;
    }, err => {
      this.managers = [];
    });
  }

  onSubmit() {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }
    this.submitLoading = true;
    this.uploader.uploadAll();
  }
  onSuccessItem() {
    this.submitLoading = false;
    this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
    this.router.navigate(['/issues']);
  }

  onApiError(err: any) {
    this.submitLoading = false;
    if(err.error) {
      this.notificationService.error('', err.error);
    } else {
      this.notificationService.error('', 'حدث خطأ, يرجى إعادة المحاولة');

    }
  }
  
  toControl(absCtrl: AbstractControl): FormControl {
    const ctrl = absCtrl as FormControl;
    // if(!ctrl) throw;
    return ctrl;
  }

}
