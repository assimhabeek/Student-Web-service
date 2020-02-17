import { filter } from 'rxjs/operators';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpParams } from '@angular/common/http';

export class BaseService {


  constructor(private _http: HttpService) {
  }

  public getRecords(url, page: number, sort: string, sortDir: string, filter: string, customPageSize?: string): Observable<any> {
    let params = new HttpParams();
    if (page !== undefined) {
      params = params
        .set('page', String(page + 1))
        .set('pageSize', customPageSize ? customPageSize : String(environment.itemPerPage));
    }

    if (sort && sortDir) {
      params = params
        .set('sort', sort)
        .set('sortDir', String(sortDir === 'asc' ? 1 : -1));
    }

    if (filter) {
      params = params
        .set('filter', filter);
    }

    return this._http.getWithAuth(url, { params });
  }

  public getRecord(url: string, id: any): Observable<any> {
    return this._http.getWithAuth(`${url}/${id}`);
  }

  public insertRecord(url, data: any): Observable<any> {
    return this._http.postWithAuth(url, data);
  }

  public updateRecord(url, data: any): Observable<any> {
    return this._http.putWithAuth(url, data);
  }

  public delete(url, id: number): Observable<string> {
    return this._http.deleteWithAuth(url + `/${id}`, {
      responseType: 'text'
    });
  }

}
