import { Component, OnInit , ViewChild  } from '@angular/core';
import { TourService } from 'src/app/tour.service';
import { Router , ActivatedRoute ,ParamMap} from '@angular/router';
import { MapComponent } from '../map/map.component'; 
import { BookingService } from 'src/app/booking.service';
import { ReviewService } from 'src/app/review.service';
import { HelperService } from 'src/app/helper.service';


declare var Stripe: any;
declare var toastr: any;




@Component({
  selector: 'app-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit {

  constructor(public tourService:TourService,public router: Router,public route:ActivatedRoute,public bookingService:BookingService,public reviewService:ReviewService,public helperService:HelperService) { }

  public tourData = {imageCover:"",name:"",duration:"",startLocation:{description:""},startDate:"",difficulty:"",maxGroupSize:"",ratingsAverage:"",guides:[],description:"",images:[],_id:""};
  public error = ""
  public selectedTour;
  public tourId = "";
  public reviewData = []

  @ViewChild(MapComponent,null ) child: MapComponent
  

  ngOnInit() {
    
    this.route.paramMap.subscribe((params:ParamMap)=>{
    this.tourId = params.get('id');
    this.getTour(this.tourId);
    toastr.options = this.helperService.getToastOption();
    
    // this.getReviews(this.tourId);
    })
  }

  getTour(tourId){
    this.tourService.getTour(tourId).subscribe(response=>{
      if(response["status"] == "success"){
        console.log(response)
          if(response.data.data){
            //need to optimized to get only required data
              let _tourData = response.data.data;
              this.reviewData = _tourData.reviews;
              _tourData.startDate = _tourData.startDates[0];
              this.tourData = _tourData;
              this.child.childFun(_tourData.locations);
        
          }
      }else{
        this.error = response
      }
      // this.TourList = data
    },error=>{
      this.error = error
    })
  }

  // bookTour(tourId){
  //     let bookingData = {"bookingSatus":"In Progress","price":1200}
  //     this.bookingService.createBooking(tourId,bookingData).subscribe((response)=>{
  //       if(response["status"] == "success"){
  //         console.log(response)
  //           alert("Booking Success");
  //           if(response.data.data){
  //           }
  //       }else{
  //         this.error = response
  //       }
  //     },(error)=>{
  //       console.log(error)
  //     })
  // }
  bookTour(tourId){
    let bookingData = {"bookingSatus":"In Progress","price":1200}
    this.bookingService.createBooking(tourId,bookingData).subscribe((response)=>{
      if(response["status"] == "success"){
        console.log(response)
        toastr.success('Booking Done Successfully');
          if(response.session){
            this.redirectToPayment(response.session)
          }
      }else{
        this.error = response
      }
    },(error)=>{
      console.log(error)
    })
}
//put 4242 4242 4242 4242
async redirectToPayment(sessionData){
  const stripe = Stripe('pk_test_Tpd9a6kGy3j9sMdA0LO5sYQU00CluSqLbd');
  await stripe.redirectToCheckout({
    sessionId: sessionData.id
  });
}



}
