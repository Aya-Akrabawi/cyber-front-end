import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css']
})
export class NewMeetingComponent implements OnInit {

  meetingForm = new FormGroup({
    meeting_title: new FormControl('', Validators.required),
    meeting_content: new FormControl('', Validators.required),
    notified_users_array: new FormControl(''),
    notified_users_id: new FormControl(''),
    meeting_creation_date: new FormControl('', [Validators.required, this.minDate()])
  });
  submitLoading = false;
  today = (new Date()).toISOString().split('T')[0];

  users: any = [];
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'لا يوجد بيانات',
    idField: 'user_id',
    textField: 'name',
  };

  constructor(
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers()
  }

  minDate(): ValidatorFn {
    return (control: any): ValidationErrors | null => {
      if (control.value) {
        return control.value < this.today ? { 'minDate': true } : null;
      }
      return null;
    };
  }

  getUsers() {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('tokenMNQ') });

    this.http.getReq('/users', {headers}).subscribe(res => {
      const users = res;
      this.users = users.map((el: any) => {return {...el, name: `${el.user_first_name} ${el.user_last_name}`}})
    }, err => {
      this.users = [];
    })
  }
  onSubmit() {
    if (this.meetingForm.invalid) {
      this.meetingForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;
    const notifiedUserIds = this.meetingForm.value['notified_users_array'].map((selectedUser: any) => selectedUser.user_id)
    this.meetingForm.controls.notified_users_id.setValue(notifiedUserIds.join(','));

    const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('tokenMNQ') });

    this.http.postReq('/meetings/add', this.meetingForm.value, {headers}).subscribe(res => {
      this.submitLoading = false;
      this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
      this.router.navigate(['/meetings']);
    }, err => {
      this.notificationService.error('', err.error);
      this.submitLoading = false;
    })
  }
}
