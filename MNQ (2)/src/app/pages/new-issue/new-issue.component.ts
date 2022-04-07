import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

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
  
  constructor(
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getManagers();
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
    this.http.postReq('/issues/add', this.issueForm.value).subscribe(res => {
      this.submitLoading = false;
      this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
      this.router.navigate(['/issues']);
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', err.error);
    });
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
