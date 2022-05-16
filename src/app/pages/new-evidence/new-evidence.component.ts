import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-evidence',
  templateUrl: './new-evidence.component.html',
  styleUrls: ['./new-evidence.component.css']
})
export class NewEvidenceComponent implements OnInit, OnDestroy {

  evidenceForm = new FormGroup({
    evid_description: new FormControl('', Validators.required),
    evid_creation_date: new FormControl((new Date()).toISOString()),
    evid_send_to: new FormControl(''),
    evid_phone_no: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^\d+$/)]),
    evid_email: new FormControl('', [Validators.required, Validators.email]),
    evid_notes: new FormControl(''),
    evid_attachment_beforeConvert: new FormControl(''),
  });
  subDomainId = '';
  submitLoading = false;
  subscription!: Subscription;
  managers: any = [];
  size = environment.fileSize
  extensions = environment.fileAllowedExt;
  departments: any = [];
  public uploader!: FileUploader;

  constructor(
    private http: HttpService,
    private router: Router,
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.subDomainId = params.subDomainId;
      this.uploader = new FileUploader({
        url: `${environment.baseURL}/evidences/add/${this.subDomainId}`,
        headers: [{ name: 'Authorization', value: `Bearer ${this.userService.token}` }],
        itemAlias: 'uploaded_file',
        queueLimit: 1,
      })
    })
    this.getManagers();
    this.getDepartments();
    this.uploader.onBuildItemForm = (item, form) => {
      const formValue = this.evidenceForm.value;
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

  getDepartments() {
    this.httpClient.get('/assets/departments.json').subscribe(res => {
      this.departments = res;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  getManagers() {
    this.http.getReq('/getAllManagers').subscribe(res => {
      this.managers = res;
    }, err => {
      this.managers = [];
    });
  }

  onSubmit() {
    if (this.evidenceForm.invalid) {
      this.evidenceForm.markAllAsTouched();
      return;
    }
    this.submitLoading = true;
    this.uploader.uploadAll();
  }

  onSuccessItem() {
    this.submitLoading = false;
    this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
    this.router.navigate(['/evidences-prerequisites', this.subDomainId]);
  }

  onApiError(err: any) {
    this.submitLoading = false;
    if (err.error) {
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
