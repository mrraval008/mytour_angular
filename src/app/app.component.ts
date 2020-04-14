import { Component, OnInit } from '@angular/core';
import { DialogService } from './dialog/dialog.service'
import { ExampleComponent } from './example/example.component'
import { HttpService } from 'src/app/http.service';
import { HelperService } from 'src/app/helper.service';
import { LoginService } from 'src/app/login.service';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DialogService]
})
export class AppComponent  implements OnInit  {
  title = 'tour-app';

  constructor(private loginService:LoginService,private helperService:HelperService,private userService:UserService,private router:Router){

  }

  ngOnInit() {
    let authToken =  this.helperService.getLocalStorageData("authToken")
    if(authToken){
      this.loginService.isLoggedIn().subscribe(response => {
        if (response["status"] == "success") {
          let data = response.user;
          this.userService.setCurrentUserData(data);
          this.router.navigate(['/tourDetails']);
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
