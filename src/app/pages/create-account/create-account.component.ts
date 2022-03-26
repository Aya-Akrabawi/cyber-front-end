import { HttpHeaders } from '@angular/common/http';
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

  constructor(
    private http: HttpService,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;
    
    // const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('tokenMNQ')});
    // this.http.postReq('/signup', this.accountForm.value, {headers}).subscribe( res => {
    //   this.submitLoading = false;
    //   this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
    // }, err => {
    //   this.submitLoading = false;
    //   this.notificationService.error('', err.message);
    // })

  }
}
