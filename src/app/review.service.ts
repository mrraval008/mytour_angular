import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpService:HttpService) { }

  private baseUrl = "/review"

  createReview(reviewData){
    // let url = `tours/${tourId}/bookings`;
    return this.httpService.create(this.baseUrl,reviewData);
  }

  getReview(tourId){
    let url = `/tours/${tourId}/reviews`;
    return this.httpService.get(url);
  }
}
