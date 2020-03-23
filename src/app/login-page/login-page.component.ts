import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,ParamMap} from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { HelperService } from 'src/app/helper.service';
import { UserService } from 'src/app/user.service';
declare var $: any;
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  private loginModel = {};
  private signUpModel = {}
  private error;

  constructor(private router: Router,private route:ActivatedRoute,private loginService:LoginService,private helperService:HelperService,private userService:UserService) { }

  ngOnInit() {
    $("#flipbook").turn({
      autoCenter: true,
      acceleration:false
    });

    setTimeout (() => {
      $("#flipbook").turn("page", 2);
    }, 1500);
  }

  openSignup(){
    $("#flipbook").turn("page", 5);
  }
  
  openForgotPassword(){
    $("#flipbook").turn("page", 7);
  }

  onLogin(e){
    let reqBody = this.loginModel;
    this.loginService.login(reqBody).subscribe(response=>{
      console.log(response)
      if(response["status"] == "success"){
        this.helperService.updateLocalStorageData("authToken",response.token);
        let data = response.data.user;
        // this.helperService.updateLocalStorageData("userId",data._id)
        this.userService.setUserId(data._id);
        this.router.navigate(['/tourDetails']);
      }else{
        // this.error = response
      }
      // this.TourList = data
    },error=>{
      this.error = error
    })
  }



  onSignUp(e){
    let reqBody = this.signUpModel;
    this.loginService.signup(reqBody).subscribe(response=>{
      console.log(response)
      if(response["status"] == "success"){
        this.helperService.updateLocalStorageData("authToken",response.token);
        let data = response.data.user;
        // this.helperService.updateLocalStorageData("userId",data._id)
        this.userService.setUserId(data._id);
        this.router.navigate(['/tourDetails']);
      }else{
        // this.error = response
      }
      // this.TourList = data
    },error=>{
      this.error = error
    })
  }

}


// $("#pageFld").val($("#flipbook").turn("page"));
  
  // $("#flipbook").bind("turned", function(event, page, view) {
  //     $("#pageFld").val(page);
  // });
  
  // $("#pageFld").change(function() {
  //     $("#flipbook").turn("page", $(this).val());
  // });
  
  // $("#prevBtn").click(function() {
  //     $("#flipbook").turn("previous");
  // });
  
  // $("#nextBtn").click(function() {
  //     $("#flipbook").turn("next");
  // });