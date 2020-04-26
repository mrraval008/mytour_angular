import { Component, OnInit } from '@angular/core';
import { DialogService } from './dialog/dialog.service'
import { ExampleComponent } from './example/example.component'
import { HttpService } from 'src/app/http.service';
import { HelperService } from 'src/app/helper.service';
import { LoginService } from 'src/app/login.service';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';


// Instead of trying to use Router (which is not ready to give you final route at this moment of navigation lifecycle), you can use Location service (https://angular.io/api/common/Location) and its method path, which will give you the url without base href
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DialogService]
})
export class AppComponent  implements OnInit  {
  title = 'tour-app';

  constructor(private loginService:LoginService,private helperService:HelperService,private userService:UserService,public router:Router,private location: Location){

  }

  ngOnInit() {
    let authToken =  this.helperService.getLocalStorageData("authToken")
    if(this.location.path().includes("reset-password")){
      return;
    }
    if(authToken){
      this.loginService.isLoggedIn().subscribe(response => {
        if (response["status"] == "success" && response["user"] != null) {
          let data = response.user;
          this.userService.setCurrentUserData(data);
          this.router.navigate([this.router.url]);
        } else {
          this.router.navigate(['/welcome/home']);
        }
      }, error => {
        this.router.navigate(["/welcome/home"])
        console.log(error.error.message)
      })
    }else{
      this.router.navigate(['/welcome/home']);
    }

  }
    
}
