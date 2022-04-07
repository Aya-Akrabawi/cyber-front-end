import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.component.html',
  styleUrls: ['./new-announcement.component.css']
})
export class NewAnnouncementComponent implements OnInit {

  announcementForm = new FormGroup({
    announcement_title: new FormControl('', Validators.required),
    announcement_content: new FormControl('', Validators.required),
    announcement_notes: new FormControl('', Validators.required),
    announcement_attachment: new FormControl(''),
    announcement_attachment_beforeConvert: new FormControl(''),
    // notified_users_id: new FormControl(null),
  });
  submitLoading = false;
  size = environment.fileSize
  extensions = environment.fileAllowedExt;
  
  constructor(
    private http: HttpService,
    private notificationService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.announcementForm.invalid) {
      this.announcementForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;
    
    this.http.postReq('/announcements/add', this.announcementForm.value).subscribe(res => {
      this.submitLoading = false;
      this.router.navigate(['/announcements'])
      this.notificationService.success('', 'لقد تمت الاضافة بنجاح');
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
      this.announcementForm.controls['announcement_attachment'].setValue(reader.result);
    };
  }
  toControl(absCtrl: AbstractControl): FormControl {
    const ctrl = absCtrl as FormControl;
    // if(!ctrl) throw;
    return ctrl;
  }
}
