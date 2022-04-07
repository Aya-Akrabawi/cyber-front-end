import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-new-prerequisite',
  templateUrl: './new-prerequisite.component.html',
  styleUrls: ['./new-prerequisite.component.css']
})
export class NewPrerequisiteComponent implements OnInit, OnDestroy {

  prerequisiteFrom = new FormGroup({
    prerequisite_description: new FormControl('', Validators.required),
    prerequisite_creation_date: new FormControl((new Date()).toISOString()),
    prerequisite_send_to: new FormControl(''),
    prerequisite_phone_no: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^\d+$/)]),
    prerequisite_email: new FormControl('', [Validators.required, Validators.email]),
    prerequisite_notes: new FormControl('')
  });
  submitLoading = false;
  subscription!: Subscription;
  subDomainId = '';
  managers: any = [];

  constructor(
    private http : HttpService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.subDomainId = params.subDomainId;
    });
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
    if (this.prerequisiteFrom.invalid) {
      this.prerequisiteFrom.markAllAsTouched()
      return;
    }
    this.submitLoading = true;

    this.http.postReq(`/prerequisites/add/${this.subDomainId}`, this.prerequisiteFrom.value).subscribe(res => {
      this.submitLoading = false;
      this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
      this.router.navigate(['/evidences-prerequisites', this.subDomainId]);
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', err.error);
    })
  }
}
