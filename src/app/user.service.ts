import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { HelperService } from 'src/app/helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public httpService:HttpService,public helperService:HelperService) { }

  public baseUrl = "/users";
  public currentUserData = {};

  setCurrentUserData(data){
    this.currentUserData = data;
  }

  getCurrentUserData(){
    return this.currentUserData;
  }

  getUserList(searchCriterion){
    let _baseUrl = this.baseUrl;
    if(searchCriterion){
      searchCriterion = searchCriterion;
      _baseUrl =  this.helperService.formatURL(this.baseUrl,searchCriterion)
    }
    return this.httpService.get(_baseUrl);
  }

  getUserById(userId){
    return this.httpService.getById(this.baseUrl,userId);
  }

  getMe(){
    return this.httpService.get(this.baseUrl + "/me");
  }

  updateUser(userId,userData){
      return this.httpService.update(this.baseUrl,userId,userData)
  }

  updateMe(userData){
    return this.httpService.updateMe(`${this.baseUrl}/updateMe`,userData)
  }

  updatePassword(userData){
    let _baseUrl = this.baseUrl + "/updateMypassword";
    return this.httpService.updatePassword(_baseUrl,userData)
  }
  
}
