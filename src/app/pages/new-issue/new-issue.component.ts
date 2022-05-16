import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.css']
})
export class NewIssueComponent implements OnInit {

  issueForm = new FormGroup({
    issue_name: new FormControl('', Validators.required),
    issue_notes: new FormControl('', Validators.required),
    issue_attachment: new FormControl(''),
    issue_attachment_beforeConvert: new FormControl(''),
    issue_sent_to_id: new FormControl('')
  });
  submitLoading = false;
  managers: any = [];
  size = environment.fileSize
  extensions = environment.fileAllowedExt;
  public uploader: FileUploader = new FileUploader({
    url: `${environment.baseURL}/issues/add`,
    headers: [{ name: 'Authorization', value: `Bearer ${localStorage.getItem('tokenMNQ')}` }],
    // additionalParameter:this.issueForm.value,
    itemAlias: 'uploaded_file',
  });
  constructor(
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getManagers();
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded File Details:', item);
      this.toastr.success('File successfully uploaded!');
    };
    
    this.uploader.onBuildItemForm = (item, form) => {
      const formValue = this.issueForm.value;
      for (const key in formValue) {
        form.append(key, formValue[key]);
      }
    };
  }

  getManagers() {
    this.http.getReq('/getAllManagers').subscribe(res => {
      this.managers = res;
    }, err => {
      this.managers = [];
    });
  }

  onSubmit() {
    console.log("***************",this.issueForm.value) ;
    
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }
    this.submitLoading = true;
    // this.http.postReq('/issues/add', this.issueForm.value).subscribe(res => {
    //   this.submitLoading = false;
    //   this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
    //   this.router.navigate(['/issues']);
    // }, err => {
    //   this.submitLoading = false;
    //   this.notificationService.error('', err.error);
    // });
  }
  fileConvert(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.issueForm.controls['issue_attachment'].setValue(reader.result);
    };
  }
  toControl(absCtrl: AbstractControl): FormControl {
    const ctrl = absCtrl as FormControl;
    // if(!ctrl) throw;
    return ctrl;
  }

}
