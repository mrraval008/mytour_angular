import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { BookingService } from 'src/app/booking.service';
import { ReviewService } from 'src/app/review.service';
import { DialogService } from 'src/app/dialog/dialog.service';
import { ReviewComponent } from 'src/app/review/review.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {

  constructor(public bookingService:BookingService,public userService:UserService,public dialog: DialogService,public router: Router) { }

  public showLoader =true;
  public bookings;
  public dialogRef;
  

  ngOnInit() {
    if(this.router.url.includes("my-bookings")){
      this.getMyBookings();
    }else{
      this.getBookingList();
    }
  } 


  getBookingList(){
    // let userId = this.userService.getCurrentUserId();
    // let filterVal = JSON.stringify({filterVal:[`user=${userId}`]});
    this.bookingService.getBookingList().subscribe(response=>{
      this.showLoader = false;
      console.log(response)
      if(response["status"] == "success"){
        if(response.data){
          this.bookings = response.data.data;
        }
      }
    },error=>{
      this.showLoader = false;
      console.log(error)
    })
  }
  

  getMyBookings(){
    this.bookingService.getMyBookings().subscribe(response=>{
      this.showLoader = false;
      console.log(response)
      if(response["status"] == "success"){
        if(response.data){
          this.bookings = response.data.data;
        }
      }
    },error=>{
      this.showLoader = false;
      console.log(error)
    })
  }
  



  onWriteReview(tourId){
    this.dialogRef = this.dialog.open(ReviewComponent,{
      data: { tourId: tourId,dialogTitle:"Write a Review"}})
  }
}
