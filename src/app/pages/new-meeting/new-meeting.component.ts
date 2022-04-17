import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

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
    meeting_happening_on_date: new FormControl('', [Validators.required, this.minDate()])
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
  departments: any = [];

  constructor(
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router,
    private userService: UserService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.getDepartments();
  }

  getDepartments() {
    this.httpClient.get('/assets/departments.json').subscribe(res => {
      this.departments = res;
    })
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

    this.http.getReq('/users').subscribe(res => {
      const users = res;
      this.users = users.map((el: any) => {return {...el, name: `${el.user_first_name} ${el.user_last_name} (${el.department != 'Adminstration' ? this.departments[el.department] : 'Administration'})`}})
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
    if(this.meetingForm.value['notified_users_array']) {
      const notifiedUserIds = this.meetingForm.value['notified_users_array'].map((selectedUser: any) => selectedUser.user_id);      
      const currentUserId = this.userService.userId;
      if(currentUserId && notifiedUserIds.indexOf(+currentUserId) === -1) {
        notifiedUserIds.push(+currentUserId);
      }
      this.meetingForm.controls.notified_users_id.setValue(notifiedUserIds.join(','));
    }


    this.http.postReq('/meetings/add', this.meetingForm.value).subscribe(res => {
      this.submitLoading = false;
      this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
      this.router.navigate(['/meetings']);
    }, err => {
      this.notificationService.error('', err.error);
      this.submitLoading = false;
    })
  }
}
