import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpService } from './services/http.service';
import { User } from './model/user';
import { TokenStorage } from './shared/token.storage';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private isLoggedInEvent: ReplaySubject<boolean>;
  private userEvent: ReplaySubject<User>;

  constructor(private _http: HttpService,
    private tokenStorage: TokenStorage) {
    this.init();
  }

  init() {
    this.isLoggedInEvent = new ReplaySubject<boolean>(1);
    this.userEvent = new ReplaySubject<User>(1);
    this.getUserInfo();
  }

  login(user: User): Observable<any> {
    return this._http.post(environment.segmentUrls.auth.login, user);
  }

  getUserInfo() {
    this._http.getWithAuth(environment.segmentUrls.auth.isLoggedIn).subscribe(res => {
      this.isLoggedInEvent.next(!!res.data);
      this.userEvent.next(res.data);
    });
  }

  isLoggedIn() {
    return this.isLoggedInEvent;
  }

  user() {
    return this.userEvent;
  }

  registerLogin(token: string, rememberMe: boolean) {
    this.tokenStorage.storeToken(token, rememberMe);
    return this._http.getWithAuth(environment.segmentUrls.auth.isLoggedIn).pipe(
      map(res => {
        this.isLoggedInEvent.next(!!res.data);
        this.userEvent.next(res.data);
        return res.data;
      }));
  }

  logout() {
    this.tokenStorage.removeToken();
    this.userEvent.next(null);
    this.isLoggedInEvent.next(false);
  }

}
