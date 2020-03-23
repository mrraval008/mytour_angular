import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { HelperService } from 'src/app/helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService:HttpService,private helperService:HelperService) { }

  private baseUrl = "/users";
  private userData = [];
  private currentUserId;


  setUserId(userId){
      this.helperService.updateLocalStorageData("userId",userId);
      this.currentUserId = userId;
  }

  getCurrentUserId(){
      if(!this.currentUserId){
        this.currentUserId = this.helperService.getLocalStorageData("userId");
      }
      return this.currentUserId;
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
