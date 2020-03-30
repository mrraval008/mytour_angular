import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { HelperService } from 'src/app/helper.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(public httpService:HttpService,public helperService:HelperService) { }

  public baseUrl = "/bookings";


  // createBooking(tourId,bookingData){
  //   let _baseUrl = `/tours/${tourId}/bookings`;
  //   return this.httpService.create(_baseUrl,bookingData);
  // }

  createBooking(tourId,bookingData){
    let _baseUrl = `${this.baseUrl}/checkout-session/${tourId}`
    return this.httpService.bookTour(_baseUrl);
  }

  getBookingList(){
    // let _baseUrl = this.baseUrl;
    // if(searchCriterion){
    //   searchCriterion = searchCriterion;
    //   _baseUrl =  this.helperService.formatURL(this.baseUrl,searchCriterion)
    // }
    return this.httpService.get(this.baseUrl);
  }

  getMyBookings(){
    let _baseUrl = this.baseUrl + "/myBookings";
    return this.httpService.get(_baseUrl);
  }

}
