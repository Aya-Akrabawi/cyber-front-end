import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { HttpService } from 'src/app/services/http.service';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  active = 1;
  chartsArrEmployee: any = [];
  chartsArrIntAud: any = [];
  chartsArrExtAud: any = [];
  evidencesChart: any = {};
  evidencesTableData: any = {};
  loading = true;
  apiError = false;

  constructor(
    private http: HttpService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.getTabData(this.active);
  }

  getTabData(tabNum: number) {
    this.loading = true;
    this.apiError = false;
    let mainChartUrl = '';
    let chartsUrl = '';
    switch (true) {
      case tabNum === 1:
        mainChartUrl = '/dashboard/employee/all';
        chartsUrl = '/dashboard/employee';
        // mainChartUrl = '/assets/dashboard_employee_all.json';
        // chartsUrl = '/assets/employee.json';
        break;

      case tabNum === 2:
        mainChartUrl = '/dashboard/internal_auditor/all';
        chartsUrl = '/dashboard/internal_auditor';
        // mainChartUrl = '/assets/internal_auditor_all.json';
        // chartsUrl = '/assets/internal_auditor.json';
        break;

      case tabNum === 3:
        mainChartUrl = '/dashboard/external_auditor/all';
        chartsUrl = '/dashboard/external_auditor';
        // mainChartUrl = '/assets/external_auditor_all.json';
        // chartsUrl = '/assets/external_auditor.json';
        break;
      case tabNum === 4:
        mainChartUrl = '/dashboard/evidence/table/all';
        chartsUrl = '/dashboard/evidence/chart/all';
        // mainChartUrl = '/assets/evidence_table_all.json';
        // chartsUrl = '/assets/evidence_chart_all.json';
        break;

      default:
        break;
    }
    zip(
      // this.httpClient.get(mainChartUrl),
      // this.httpClient.get(chartsUrl),
      this.http.getReq(mainChartUrl),
      this.http.getReq(chartsUrl),
    ).pipe(
      map(([firstResp, secondResp]: any) => {
        switch (true) {
          case tabNum === 1:
            this.formatData({ ...firstResp.dashboards, ...secondResp.dashboards }, this.chartsArrEmployee)
            break;

          case tabNum === 2:
            this.formatData({ ...firstResp.dashboards, ...secondResp.dashboards }, this.chartsArrIntAud)
            break;

          case tabNum === 3:
            this.formatData({ ...firstResp.dashboards, ...secondResp.dashboards }, this.chartsArrExtAud)
            break;

          case tabNum === 4:
            this.evidencesTableData = firstResp.dashboards;            
            this.evidencesChart = {
              chartType: GoogleChartType.PieChart,
              dataTable: [['ملخص ما اذا تم ارفاق الملفات مع دليلها', ''],...Object.entries(secondResp.dashboards)],
            }
            break;

          default:
            break;
        }
      }),
    ).subscribe(() => {

      this.loading = false;
      this.apiError = false;
    }, () => {
      this.loading = false;
      this.apiError = true;
    })
  }

  formatData(respObj: any, arr: any) {
    let objectKeysArr = Object.keys(respObj);

    objectKeysArr.forEach(key => {
      let chartArr = [
        [key, ''],
        ...Object.entries(respObj[key][0])
      ]
      arr.push({
        chartType: GoogleChartType.PieChart,
        dataTable: chartArr,
        options: { 'title': key },
      })
    });
  }
}
