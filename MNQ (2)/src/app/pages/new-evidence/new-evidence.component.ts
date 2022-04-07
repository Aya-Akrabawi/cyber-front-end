import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-evidence',
  templateUrl: './new-evidence.component.html',
  styleUrls: ['./new-evidence.component.css']
})
export class NewEvidenceComponent implements OnInit, OnDestroy {

  evidenceForm= new FormGroup({
    evid_description: new FormControl('', Validators.required),
    evid_creation_date: new FormControl((new Date()).toISOString()),
    evid_send_to: new FormControl(''),
    evid_phone_no: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^\d+$/)]),
    evid_email: new FormControl('', [Validators.required, Validators.email]),
    evid_notes: new FormControl(''),
    evid_attachment: new FormControl(''),
    evid_attachment_beforeConvert: new FormControl(''),
  });
  subDomainId = '';
  submitLoading = false;
  subscription!: Subscription;
  managers: any = [];
  size = environment.fileSize
  extensions = environment.fileAllowedExt;
  
  constructor(
    private http: HttpService,
    private router: Router,
    private notificationService: NotificationsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.subDomainId = params.subDomainId;
    })
    this.getManagers();
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
    
    this.http.postReq(`/evidences/add/${this.subDomainId}`, this.evidenceForm.value).subscribe(res => {
      this.submitLoading = false;
      this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
      this.router.navigate(['/evidences-prerequisites', this.subDomainId]);
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', err.error);
    })
  }

  fileConvert(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.evidenceForm.controls['evid_attachment'].setValue(reader.result);
    };
  }
  toControl(absCtrl: AbstractControl): FormControl {
    const ctrl = absCtrl as FormControl;
    // if(!ctrl) throw;
    return ctrl;
  }
}
