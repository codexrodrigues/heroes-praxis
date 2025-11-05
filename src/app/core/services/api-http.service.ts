import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiHttpService {
  private readonly http = inject(HttpClient);

  get<T>(url: string, params?: Record<string, any>) {
    const p = new HttpParams({ fromObject: params ?? {} });
    return this.http.get<T>(url, { params: p });
  }
  post<T>(url: string, body: any) { return this.http.post<T>(url, body); }
  put<T>(url: string, body: any) { return this.http.put<T>(url, body); }
  patch<T>(url: string, body: any) { return this.http.patch<T>(url, body); }
  delete<T>(url: string) { return this.http.delete<T>(url); }
}
