import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { HttpHeaders } from '@angular/common/http';

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

  constructor(
    private http: HttpService,
    private route: ActivatedRoute) { }

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
    const token = localStorage.getItem('tokenMNQ');
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
    this.http.getReq(`/evidences/getAllEvidencesInSubDomain/${this.subDomainID}/${page}`, {headers}).subscribe(res => {
    // this.http.getReq(`/evidences/getAllEvidences/0`, {headers}).subscribe(res => {
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
    const token = localStorage.getItem('tokenMNQ');
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
    // this.http.getReq(`/prerequisites/getAllPrerequisites/0`, {headers}).subscribe(res => {
    this.http.getReq(`/prerequisites/getAllPrerequisitesInSubDomain/${this.subDomainID}/${page}`, {headers}).subscribe(res => {
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
    this.updateStatus(preReqID, rowIndex);
  }

  updateStatus(id: string, rowIndex: number) {

  }
 
}
