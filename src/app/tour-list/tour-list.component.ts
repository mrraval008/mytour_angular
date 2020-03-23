import { Component, OnInit } from '@angular/core';
import { TourService } from 'src/app/tour.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.css']
})
export class TourListComponent implements OnInit {

  constructor(private tourService:TourService,private userService:UserService) { }
 
  public tourList = [];
  public error = ""
  public selectedTour;
  public defaultSearchCriterion = {sortVal:"name"};
  public showLoader = true;

  ngOnInit() {
   this.getTourList(JSON.stringify(this.defaultSearchCriterion));
  }
  getTourList(searchCriterion){
    this.tourService.getToursList(searchCriterion).subscribe(response=>{
      console.log(response)
      this.showLoader = false;
      if(response["status"] == "success"){
          
          if(response.data){
            let _response = response.data;
            if(_response.data){
                // need to optimized to get only required data
                let _tourList = response.data.data;
                _tourList.forEach(element => {
                  element.startDate = element.startDates[0];
                  // element.image = element.images[0]
                });
                // console.log(_tourList)
                this.tourList = _tourList;
            }
            // if(_response.user){
            //     this.userService.setUserData([_response.user])
            // }
         
          }
      }else{

        this.error = response
      }
      // this.TourList = data
    },error=>{
      this.error = error
    })
  }

  searchCriterionChanged(searchCriterion){
      this.showLoader = true;
      this.getTourList(searchCriterion)
  }

}
