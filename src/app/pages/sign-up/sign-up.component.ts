import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm = new FormGroup({
    user_first_name: new FormControl('', [Validators.required]),
    user_last_name: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    user_role: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^.(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_-]).*$/), Validators.minLength(8)]),
    confirm_password: new FormControl('', [Validators.required, Validators.pattern(/^.(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_-]).*$/), Validators.minLength(8)]),
    is_activated: new FormControl(true),
  }, { validators: this.matchingPasswords() });
  submitLoading = false;
  departments: any = [];
  
  constructor(
    private http: HttpService,
    private notificationService: NotificationsService,
    private httpClient: HttpClient,
    ) { }

  ngOnInit(): void {
    this.getDepartments()
  }

  getDepartments() {
    this.httpClient.get('/assets/departments.json').subscribe(res => {
      this.departments = res;
    })
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;
    
    this.http.postReq('/signup', this.signUpForm.value).subscribe( res => {
      this.submitLoading = false;
      this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', err.error);
    })

  }
  matchingPasswords(): ValidatorFn {
    return (control: any): ValidationErrors | null => {
      return control.get('password').value !== control.get('confirm_password').value ? { 'unmatchedPasswords': true } : null;
    };
  }
}
