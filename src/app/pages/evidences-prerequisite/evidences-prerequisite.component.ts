import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import localeAr from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeAr, 'ar');
import { NotificationsService } from 'angular2-notifications';
@Component({
  selector: 'app-evidences-prerequisite',
  templateUrl: './evidences-prerequisite.component.html',
  styleUrls: ['./evidences-prerequisite.component.css']
})
export class EvidencesPrerequisiteComponent implements OnInit {

  evidencesLoading = true;
  evidences: any = [];
  evidencesCount = 1;
  evidencesPage = 0;

  prerequisitesLoading = true;
  prerequisites: any = [];
  prerequisitesCount = 1;
  prerequisitesPage = 0;
  subDomainID = '';
  subscription!: Subscription;
  userRole = '';
  preReqStatusEditing: any = {};
  evidStatusEditing: any = {};

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.userRole = localStorage.getItem('userRoleMNQ') || '';
      this.subDomainID = params.subDomainId;
      if (this.subDomainID) {
        this.getEvidences();
        this.getPrerequisites();
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  getEvidences(page = 0) {
    this.http.getReq(`/evidences/getAllEvidencesInSubDomain/${this.subDomainID}/${page}`).subscribe(res => {
      this.evidences = res?.evidences.data;
      this.evidencesCount = res?.evidences?.count;
      this.evidencesLoading = false;
    }, err => {
      this.evidencesLoading = false;
      this.evidences = [];
      this.evidencesCount = 0;
    })
  }
  getPrerequisites(page = 0) {
    // this.http.getReq(`/prerequisites/getAllPrerequisites/0`, {headers}).subscribe(res => {
    this.http.getReq(`/prerequisites/getAllPrerequisitesInSubDomain/${this.subDomainID}/${page}`).subscribe(res => {
      this.prerequisites = res?.prerequisites;
      this.prerequisitesCount = res?.prerequisites?.count;
      // this.prerequisitesCount = this.prerequisites.length;
      this.prerequisitesLoading = false;
    }, err => {
      this.prerequisitesLoading = false;
      this.prerequisites = [];
      this.prerequisitesCount = 0;
    })
  }
  setEvidencesPage(event: any) {
    this.evidencesPage = event.offset;
    this.getEvidences(event.offset)
  }
  setPrerequisitesPagePage(event: any) {
    this.evidencesPage = event.offset;
    this.getEvidences(event.offset)
  }

  updatePrereqStatus(event: any, cell: string, rowIndex: number, preReqID: string) {
    this.preReqStatusEditing[rowIndex + '-' + cell] = false;
    this.prerequisites[rowIndex][cell] = event.target.value;
    this.prerequisites = [...this.prerequisites];
    this.updateStatus(preReqID, rowIndex, 'prerequisite');
  }
  updateEvidStatus(event: any, cell: string, rowIndex: number, evidID: string) {
    this.evidStatusEditing[rowIndex + '-' + cell] = false;
    this.evidences[rowIndex][cell] = event.target.value;
    this.evidences = [...this.evidences];
    this.updateStatus(evidID, rowIndex, 'evid');
  }

  updateStatus(id: string, rowIndex: number, type: string) {

    let url = '';
    type === 'evid' ? url = '/evidences/update' : url = '/prerequisites/update';

    let payload = {};
    type == 'evid' ? payload = this.evidences[rowIndex] : payload = this.prerequisites[rowIndex];
    this.http.putReq(`${url}/${id}`, payload).subscribe(res => {
      this.notificationService.success('', 'تم تعديل الحالة بنجاح')
    }, err => {
      this.notificationService.error('', 'تعذر تعديل الحالة ')
    });
  }
 
}
