import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/helper.service';
import { ReviewService } from 'src/app/review.service';
import { DialogConfig } from 'src/app/dialog/dialog-config';
import { DialogRef } from 'src/app/dialog/dialog-ref';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  constructor(private reviewService:ReviewService ,private helperService:HelperService,private config:DialogConfig,private dialog:DialogRef) { }
  private rating = "5";
  private comments = "";
  private tourId = "";
  ngOnInit() {
    if(this.helperService.isValidObjectPath(this.config,"data.tourId")){
      this.tourId = this.config.data.tourId;
    }
  }

  submitReview(){
      if(!this.helperService.isEmpty(this.comments)){
          let reviewObj = {
            tour:this.tourId,
            review:this.comments,
            rating:+(this.rating)  // to convert in to number
          }
          this.reviewService.createReview(reviewObj).subscribe((response)=>{
              alert("review submitted");
              this.dialog.close();
          },(error)=>{
            console.log(error)
          })
      }
  }

  ratingSelectionChanged(rating){
    console.log("rating",rating)
    this.rating = rating;
  }

}
