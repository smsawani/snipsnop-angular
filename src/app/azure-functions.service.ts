import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface SnipData {
  trackId: string;
  startTime: string;
  endTime: string;
  episodeData: any;
  lastModified: string;
  storageKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AzureFunctionsService {
  private baseUrl = 'https://func-joex7zjy2asx4.azurewebsites.net/api';

  constructor(private http: HttpClient) {}

  loadSnips(): Observable<SnipData[]> {
    return this.http.get<SnipData[]>(`${this.baseUrl}/loadSnips`);
  }

  saveSnip(snipData: SnipData): Observable<any> {
    return this.http.post(`${this.baseUrl}/saveSnip`, snipData);
  }

  deleteSnip(trackId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteSnip`, {
      body: { trackId }
    });
  }
}