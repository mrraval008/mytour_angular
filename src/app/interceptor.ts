import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { HelperService } from 'src/app/helper.service';
import { tap } from 'rxjs/internal/operators/tap';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public helperService: HelperService,public router: Router) {}
    public mappedCode = {
        "code_1":"Yor are logged out,please log in to get access."
      }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
        let authToken = this.helperService.getLocalStorageData("authToken");
        let authReq = req.clone();
        if(authToken){
            authToken = 'Bearer '+ authToken;
            authReq = req.clone({
                headers: req.headers.set(
                    'authorization',
                    authToken
                )
            });
        }

        return next.handle(authReq).pipe(
	        tap(event => {
	          if (event instanceof HttpResponse) {
	             
	            console.log(" all looks good");
	          }
	        }, error => {
                // if(error.error && error.error.message == this.mappedCode["code_1"]){
                //   this.router.navigate(['/welcome/login']);
                // }
	   			// http response status code
	          	console.log("----response----");
	          	console.error("status code:");
	          	console.error(error.status);
	          	console.error(error.message);
	          	console.log("--- end of response---");

	        })
	      )



    }
}




// https://stackblitz.com/edit/angular-interceptors-example?embed=1&file=src/app/api.interceptor.ts