import {Inject, Injectable} from '@angular/core';
import {LOCAL_STORAGE, SESSION_STORAGE, StorageService} from 'angular-webstorage-service';


@Injectable({
  providedIn: 'root'
})
export class TokenStorage {

  private static storageKey = 'UserToken';

  constructor(@Inject(SESSION_STORAGE) private sessionStorage: StorageService,
              @Inject(LOCAL_STORAGE) private localStorage: StorageService) {
  }


  public storeToken(token: string, remmberMe: boolean) {
    if (remmberMe) {
      this.sessionStorage.remove(TokenStorage.storageKey);
      this.localStorage.set(TokenStorage.storageKey, token);
    } else {
      this.localStorage.remove(TokenStorage.storageKey);
      this.sessionStorage.set(TokenStorage.storageKey, token);
    }
  }

  public getStoredToken(): any {
    return this.localStorage.get(TokenStorage.storageKey) ||
      this.sessionStorage.get(TokenStorage.storageKey) || null;
  }

  public removeToken() {
    this.localStorage.remove(TokenStorage.storageKey);
    this.sessionStorage.remove(TokenStorage.storageKey);
  }
}

