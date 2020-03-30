import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpSentEvent } from '@angular/common/http';
import { ITourInterface } from 'src/app/tourInterface';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { error } from 'selenium-webdriver';
import { HttpService } from 'src/app/http.service';
import { HelperService } from 'src/app/helper.service';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(public httpService: HttpService,public helperService:HelperService) { }
 
  public baseUrl = "/tours";


  getToursList(searchCriterion){
    let _baseUrl = this.baseUrl;
    if(searchCriterion){
      searchCriterion = searchCriterion;
      _baseUrl =  this.helperService.formatURL(this.baseUrl,searchCriterion)
    }
    return this.httpService.get(_baseUrl);
  }

  getTour(tourId){
    return this.httpService.getById(this.baseUrl,tourId);
  }

  updateTour(tourId,tourData){
    return this.httpService.updatePost(this.baseUrl,tourId,tourData);
  }

  deleteTour(tourId){
    return this.httpService.deleteById(this.baseUrl,tourId);
  }

  createTour(tourData){
    return this.httpService.create(this.baseUrl,tourData);
  }
}
