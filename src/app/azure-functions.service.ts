import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface AzureFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface RequestOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: string };
  retryCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AzureFunctionsService {
  private readonly baseUrl: string;
  private readonly defaultHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.azureFunctions?.baseUrl || '';
    this.defaultHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (environment.azureFunctions?.apiKey) {
      this.defaultHeaders = this.defaultHeaders.set('x-functions-key', environment.azureFunctions.apiKey);
    }
  }

  private buildUrl(functionName: string): string {
    if (!this.baseUrl) {
      throw new Error('Azure Functions base URL not configured in environment');
    }
    return `${this.baseUrl.replace(/\/$/, '')}/${functionName}`;
  }

  private buildHeaders(customHeaders?: { [key: string]: string }): HttpHeaders {
    let headers = this.defaultHeaders;
    if (customHeaders) {
      Object.keys(customHeaders).forEach(key => {
        const value = customHeaders[key];
        if (value !== undefined) {
          headers = headers.set(key, value);
        }
      });
    }
    return headers;
  }

  private buildParams(customParams?: { [key: string]: string }): HttpParams {
    let params = new HttpParams();
    if (customParams) {
      Object.keys(customParams).forEach(key => {
        const value = customParams[key];
        if (value !== undefined) {
          params = params.set(key, value);
        }
      });
    }
    return params;
  }

  get<T>(functionName: string, options?: RequestOptions): Observable<AzureFunctionResponse<T>> {
    const url = this.buildUrl(functionName);
    const headers = this.buildHeaders(options?.headers);
    const params = this.buildParams(options?.params);
    const retryCount = options?.retryCount ?? 1;

    return this.http.get<AzureFunctionResponse<T>>(url, { headers, params }).pipe(
      retry(retryCount),
      catchError(this.handleError)
    );
  }

  post<T>(functionName: string, data: any, options?: RequestOptions): Observable<AzureFunctionResponse<T>> {
    const url = this.buildUrl(functionName);
    const headers = this.buildHeaders(options?.headers);
    const params = this.buildParams(options?.params);
    const retryCount = options?.retryCount ?? 1;

    return this.http.post<AzureFunctionResponse<T>>(url, data, { headers, params }).pipe(
      retry(retryCount),
      catchError(this.handleError)
    );
  }

  put<T>(functionName: string, data: any, options?: RequestOptions): Observable<AzureFunctionResponse<T>> {
    const url = this.buildUrl(functionName);
    const headers = this.buildHeaders(options?.headers);
    const params = this.buildParams(options?.params);
    const retryCount = options?.retryCount ?? 1;

    return this.http.put<AzureFunctionResponse<T>>(url, data, { headers, params }).pipe(
      retry(retryCount),
      catchError(this.handleError)
    );
  }

  delete<T>(functionName: string, options?: RequestOptions): Observable<AzureFunctionResponse<T>> {
    const url = this.buildUrl(functionName);
    const headers = this.buildHeaders(options?.headers);
    const params = this.buildParams(options?.params);
    const retryCount = options?.retryCount ?? 1;

    return this.http.delete<AzureFunctionResponse<T>>(url, { headers, params }).pipe(
      retry(retryCount),
      catchError(this.handleError)
    );
  }

  deleteWithBody<T>(functionName: string, data: any, options?: RequestOptions): Observable<AzureFunctionResponse<T>> {
    const url = this.buildUrl(functionName);
    const headers = this.buildHeaders(options?.headers);
    const params = this.buildParams(options?.params);
    const retryCount = options?.retryCount ?? 1;

    return this.http.request<AzureFunctionResponse<T>>('DELETE', url, {
      body: data,
      headers,
      params
    }).pipe(
      retry(retryCount),
      catchError(this.handleError)
    );
  }

  getWithId<T>(functionName: string, id: string, options?: RequestOptions): Observable<AzureFunctionResponse<T>> {
    const enhancedOptions = {
      ...options,
      params: {
        ...options?.params,
        id: id
      }
    };
    return this.get<T>(functionName, enhancedOptions);
  }

  deleteWithId<T>(functionName: string, id: string, options?: RequestOptions): Observable<AzureFunctionResponse<T>> {
    const enhancedOptions = {
      ...options,
      params: {
        ...options?.params,
        id: id
      }
    };
    return this.delete<T>(functionName, enhancedOptions);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while calling Azure Function';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error (${error.status}): ${error.message}`;
      if (error.error?.error) {
        errorMessage += ` - ${error.error.error}`;
      }
    }

    console.error('Azure Functions Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}