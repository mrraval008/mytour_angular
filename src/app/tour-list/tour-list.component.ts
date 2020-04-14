import { Component, OnInit } from '@angular/core';
import { TourService } from 'src/app/tour.service';
import { UserService } from 'src/app/user.service';
import { HelperService } from 'src/app/helper.service';

declare var toastr: any;


@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.css']
})

export class TourListComponent implements OnInit {

  constructor(public tourService: TourService, public userService: UserService,public helperService:HelperService) { }

  public tourList = [];
  public error = ""
  public selectedTour;
  public defaultSearchCriterion = { sortVal: "name" };
  public showLoader = true;
  public sortItmeList = this.helperService.getTourSortItemList();
  

  ngOnInit() {
    this.getTourList(JSON.stringify(this.defaultSearchCriterion));
    toastr.options = this.helperService.getToastOption();
  }
  getTourList(searchCriterion) {
    this.tourService.getToursList(searchCriterion).subscribe(response => {
      console.log(response)
      this.showLoader = false;
      if (response["status"] == "success") {

        if (response.data) {
          let _response = response.data;
          if (_response.data) {
            // need to optimized to get only required data
            let _tourList = response.data.data;
            // _tourList.forEach(element => {
              // element.startDate = element.startDates[0];
              // element.image = element.images[0]
            // });
            // console.log(_tourList)
            this.tourList = _tourList;
          }
        }
      } else {

        this.error = response
      }
    }, error => {
      this.showLoader = false;
      
      this.error = error;
      toastr.error(error.error.message)
    })
  }

  searchCriterionChanged(searchCriterion) {
    this.showLoader = true;
    this.getTourList(searchCriterion)
  }

  showUserNearByTours(locationData){
    this.showLoader = true;
    this.getNearByTours(locationData);
  }
  getNearByTours(locationData){
    console.log(locationData)
    let {distance, lat , lng , unit} = locationData;
    this.tourService.getNearByTours(distance, lat , lng, unit).subscribe(response => {
      this.showLoader = false;
      if (response["status"] == "success") {
        if (response.data) {
          let _response = response.data;
          if (_response.data) {
            this.tourList = response.data.data;
          }
        }
      } else {
        toastr.error(response.error.message)
      }
    }, error => {
      this.showLoader = false;
      toastr.error(error.error.message)
    })
  }

}
