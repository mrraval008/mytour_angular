import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { HelperService } from 'src/app/helper.service';
import { UserService } from 'src/app/user.service';
declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public loginModel = {email:"",password:""};
  public signUpModel = {name:"",email:"",password:"",passwordConfirm:""};
  public resetPasswordModel = {password:"",passwordConfirm:""};
  public resetPasswordToken;

  public userEmail;
  public showLoader = false;
  

  constructor(public router: Router, public route: ActivatedRoute, public loginService: LoginService, public helperService: HelperService, public userService: UserService) { }

  ngOnInit() {
    $("#flipbook").turn({
      autoCenter: true,
      acceleration: false
    });
    this.route.paramMap.subscribe((params:ParamMap)=>{
      this.resetPasswordToken = params.get('token');
    })

    setTimeout(() => {
      if(this.router.url.includes("reset-password")){
        if(!this.helperService.isEmpty(this.resetPasswordToken)){
          $("#flipbook").turn("page", 8);
        }
      }else{
        $("#flipbook").turn("page", 2);
        $('#flipbook .reset_pass').css( "display", "none" );
      }
    }, 1500);

    toastr.options = this.helperService.getToastOption();


  }

  openSignup() {
    $("#flipbook").turn("page", 5);
  }

  openForgotPassword() {
    $("#flipbook").turn("page", 7);
  }

  onLogin() {
    this.showLoader = true;
    let reqBody = this.loginModel;
    this.loginService.login(reqBody).subscribe(response => {
      console.log(response)
      this.showLoader = false;
      
      if (response["status"] == "success") {
        this.redirectUser(response)
      } else {
        toastr.error(response);
      }
    }, error => {
      this.showLoader = false;
      toastr.error("Please Provide Valid Username and Password")
    })
  }

  redirectUser(response){
    this.helperService.updateLocalStorageData("authToken", response.token);
    let data = response.data.user;
    this.userService.setCurrentUserData(data);
    this.router.navigate(['/tourDetails']);
  }


  onSignUp() {
    this.showLoader = true;
    let reqBody = this.signUpModel;
    this.loginService.signup(reqBody).subscribe(response => {
      console.log(response)
      this.showLoader = false;
      if (response["status"] == "success") {
        this.redirectUser(response)
      } else {
        toastr.error(response);
      }
    }, error => {
      this.showLoader = false;
      toastr.error(error.error.message);
    })
  }


  onForgotPassword() {
    this.showLoader = true;
    this.loginService.forgotPassword({email:this.userEmail}).subscribe(response => {
      console.log(response)
      this.showLoader = false;
      if (response["status"] == "success") {
        toastr.success(response.message);
      } else {
      }
    }, error => {
      this.showLoader = false;
      toastr.error(error.error.message);
    })
  }


  onResetPassword() {
    this.showLoader = true;
    let reqBody = this.resetPasswordModel;
    if(!this.helperService.isEmpty(this.resetPasswordToken)){
      this.loginService.resetPassword(reqBody,this.resetPasswordToken).subscribe(response => {
        console.log(response)
        this.showLoader = false;
        if (response["status"] == "success") {
        } else {
        }
      }, error => {
        this.showLoader = false;
        toastr.error(error.error.message);
      })
    }else{
      toastr.error("Reset Password Token is required");
      
    }

  }
}