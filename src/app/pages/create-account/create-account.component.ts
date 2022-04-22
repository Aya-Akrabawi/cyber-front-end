import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  submitLoading = false;
  accountForm = new FormGroup({
    user_first_name: new FormControl('', [Validators.required]),
    user_last_name: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    user_role: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    is_activated: new FormControl(true),
    reason: new FormControl('createNewAccount'),
  });
  departments: any = [];

  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.httpClient.get('/assets/departments.json').subscribe(res => {
      this.departments = res;
    })
  }
  onSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;

    this.http.postReq('/emails/send', this.accountForm.value).subscribe(res => {
      this.submitLoading = false;
      this.notificationService.success('', 'سيتم التواصل معك عما قريب');
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', err.error);
    })

  }
}
