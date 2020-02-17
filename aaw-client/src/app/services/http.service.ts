import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenStorage} from '../shared/token.storage';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private httpUrl = environment.url;

  constructor(public http: HttpClient,
              public tokenStorage: TokenStorage) {
  }

  get(url, args?): Observable<any> {
    return this.http.get(this.httpUrl + url, args);
  }

  post(url, data, options?): Observable<any> {
    return this.http.post(this.httpUrl + url, data, options);
  }


  postWithAuth(url, data, options?): Observable<any> {
    return this.http.post(this.httpUrl + url, data, this.addHeaders(options));
  }

  putWithAuth(url, data, options?): Observable<any> {
    return this.http.put(this.httpUrl + url, data, this.addHeaders(options));
  }

  deleteWithAuth(url, args?): Observable<any> {
    return this.http.delete(this.httpUrl + url, this.addHeaders(args));
  }

  getWithAuth(url, args?): Observable<any> {
    return this.get(url, this.addHeaders(args));
  }


  addHeaders(opti) {
    const options: any = opti || {};
    const headers = options.headers != null ? options.headers : {};
    if (this.tokenStorage.getStoredToken() != null) {
      headers[environment.authHeader] = this.tokenStorage.getStoredToken();
    }
    options.headers = headers;
    return options;
  }

}
