import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-http.service';

export type Page<T> = { content: T[]; totalElements: number; page: number; size: number };

@Injectable({ providedIn: 'root' })
export class CrudService<T, F = any> {
  constructor(private api: ApiHttpService, private base: string) {}

  list(params?: any) { return this.api.get<Page<T>>(this.base, params); }
  get(id: number | string) { return this.api.get<T>(`${this.base}/${id}`); }
  create(dto: T) { return this.api.post<T>(this.base, dto); }
  update(id: number | string, dto: Partial<T>) { return this.api.put<T>(`${this.base}/${id}`, dto); }
  patch(id: number | string, dto: Partial<T>) { return this.api.patch<T>(`${this.base}/${id}`, dto); }
  remove(id: number | string) { return this.api.delete<void>(`${this.base}/${id}`); }
  // Filter endpoints (Praxis Starter)
  filtered(filter: F, page = 0, size = 20) {
    return this.api.post<Page<T>>(`${this.base}/filtered?page=${page}&size=${size}`, filter);
  }
  options(filter?: F) { return this.api.post<any>(`${this.base}/options/filter`, filter ?? {}); }
}

