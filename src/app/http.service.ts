import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { HelperService } from 'src/app/helper.service';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http: HttpClient,public helperService :HelperService,public router: Router) { }
  public serverUrl ="http://127.0.0.1:3000/api/v1"
  

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'AuthorizationToken': ""
    })
  };


  isLoggedIn(){
    let _url = this.serverUrl + "/users/isLoggedIn";
    return this.http.get<any>(_url);
  }

  login(reqBody){
    let _url = this.serverUrl + "/users/login";
    return this.http.post<any>(_url,reqBody);
  }

  signup(reqBody){
    let _url = this.serverUrl + "/users/signup";
    return this.http.post<any>(_url,reqBody);
  }

  forgotPassword(reqBody){
    let _url = this.serverUrl + "/users/forgotPassword";
    return this.http.post<any>(_url,reqBody);
  }
  resetPassword(reqBody,token){
    let _url = this.serverUrl + "/users/resetPassword/" + token;
    return this.http.post<any>(_url,reqBody);
  }

  get(url){
    let _url = this.serverUrl + url;
    return this.http.get<any>(_url,this.httpOptions);
  }


  getById(url,id){
    let _url = this.serverUrl + url +"/"+ id;
    return this.http.get<any>(_url,this.httpOptions);
  }

  update(url,id,data){
    let _url = this.serverUrl + url +"/"+ id;
    return this.http.patch<any>(_url,data,this.httpOptions);
  }

  updatePost(url,id,data){
    let _url = this.serverUrl + url +"/"+ id;
    return this.http.post<any>(_url,data,this.httpOptions);
  }

  updateMe(url,data){
    let _url = this.serverUrl + url;
    return this.http.post<any>(_url,data,this.httpOptions);
  }

  deleteById(url,id){
    let _url = this.serverUrl + url + "/"+ id;
    return this.http.delete<any>(_url,this.httpOptions);
  }

  updatePassword(url,data){
    let _url = this.serverUrl + url
    return this.http.patch<any>(_url,data,this.httpOptions);
  }

  create(url,data){
    let _url = this.serverUrl + url;
    return this.http.post<any>(_url,data,this.httpOptions);
  }

  bookTour(url){
    let _url = this.serverUrl + url;
    return this.http.get<any>(_url,this.httpOptions);
  }




  // getToursList(){
  //   let _url = this.serverUrl + "/tours";
  //   return this.http.get<any>(_url,this.httpOptions);
  // }

  // getTour(tourId){
  //   let _url = `${this.serverUrl}"/tours"${tourId}`;
  //   return this.http.get<any>(_url);
  // }






  // public handleError(error: HttpErrorResponse) {
    
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     // if(error.error && error.error.message == mappedCode["code_1"]){
  //     //   this.router.navigate(['/welcome/login']);
  //     // }
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
       
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // };
}
