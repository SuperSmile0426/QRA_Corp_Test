import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AnalyzeRequirementsRequest,
  AnalyzeRequirementsResponse,
  ConfigurationSummary
} from '../models/requirement.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = `${environment.apiBaseUrl}/v1/analysis`;

  constructor(private http: HttpClient) {}

  analyzeRequirements(request: AnalyzeRequirementsRequest): Observable<AnalyzeRequirementsResponse> {
    return this.http.post<AnalyzeRequirementsResponse>(this.apiUrl, request);
  }

  getConfigurationSummary(): Observable<ConfigurationSummary[]> {
    return this.http.get<ConfigurationSummary[]>(`${this.apiUrl}/configuration/summary`);
  }

  getAnalysisHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`);
  }
} 