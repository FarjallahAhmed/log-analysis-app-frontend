import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from 'src/config';
@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private endpointUrlSummary = `${API_BASE_URL}/api/agg/`;
  private endpointUrlReport = `${API_BASE_URL}/api/report/`;

  constructor(private http: HttpClient) { }


  getSummaryOfLogs(index: string): Observable<any> {
    return this.http.get<any>(`${this.endpointUrlSummary}`+'summary/'+index).pipe(
      map(response => {
        const logData = {
          totalLogs: response.totalLogs,
          stackTraceLogs: response.stackTraceLogs,
          latestDate: response.latestDate,
          earliestDate: response.earliestDate,
          errorLogs: response.errorLogs,
          topLoggers: response.topLoggers,
          logLevelPercentages: new Map<string,number>(),
          errorMessagePercentages: new Map<string,number>()
        };
        Object.keys(response.errorMessagePercentages).forEach(key => {
          logData.errorMessagePercentages.set(key, Math.round(response.errorMessagePercentages[key] * 100) / 100);
        });
        Object.keys(response.logLevelPercentages).forEach(key => {
          logData.logLevelPercentages.set(key,  Math.round(response.logLevelPercentages[key] * 100) / 100);
        });

        return logData;
      })
    );
  }

  generateReportPDF(summary: any): any {

    const requestBody = summary;

    return this.http.post<any>(`${this.endpointUrlReport}`+'generate-report-pdf',requestBody);

  }

  getReportData(index: string): Observable<any> {
    return this.http.get<any>(`${this.endpointUrlSummary}`+'summary/'+index).pipe(
      map(response => {
        const logData = {
          totalLogs: response.totalLogs,
          stackTraceLogs: response.stackTraceLogs,
          latestDate: response.latestDate,
          earliestDate: response.earliestDate,
          errorLogs: response.errorLogs,
          topLoggers: response.topLoggers,
          logLevelPercentages: response.logLevelPercentages,
          errorMessagePercentages: response.errorMessagePercentages
        };
        return logData;
      })
    );
  }
}



