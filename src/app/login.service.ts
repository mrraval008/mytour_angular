import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ITourInterface } from 'src/app/tourInterface';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { error } from 'selenium-webdriver';
import { HttpService } from 'src/app/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public httpService: HttpService) { }

  login(reqBody) {
    return this.httpService.login(reqBody);
  }

  signup(reqBody) {
    return this.httpService.signup(reqBody);
  }

  forgotPassword(reqBody){
    return this.httpService.forgotPassword(reqBody);
  }

  resetPassword(reqBody,token){
    return this.httpService.resetPassword(reqBody,token);
    
  }



}
