import { Component, AfterViewInit, AfterViewChecked, OnInit, } from '@angular/core';
import { TourService } from 'src/app/tour.service';
import { Subject } from 'rxjs/internal/Subject';
import { DialogService } from 'src/app/dialog/dialog.service';
import { EditTourComponent } from 'src/app/edit-tour/edit-tour.component';
import { HelperService } from 'src/app/helper.service';
declare var Swiper: any;
declare var toastr: any;


@Component({
  selector: 'app-tour-cube',
  templateUrl: './tour-cube.component.html',
  styleUrls: ['./tour-cube.component.css']
})
export class TourCubeComponent implements OnInit,AfterViewInit {

  constructor(public tourService: TourService,public dialog: DialogService,public helperService:HelperService) { }

  public tourList = [];
  public tourModel = {};
  public error = "";
  public dialogRef;
  public defaultSearchCriterion = JSON.stringify({sortVal:"name"})
  public sortItmeList = this.helperService.getTourSortItemList()
  
  public showLoader = true;

  ngOnInit() {
    this.getTourList(this.defaultSearchCriterion);
    toastr.options = this.helperService.getToastOption();
  }
  ngAfterViewInit() {
    // this.initializeSwiper()
  }

  initializeSwiper(){
    setTimeout(()=>{
      var swiper = new Swiper('.swiper-container', {
        effect: 'cube',
        grabCursor: true,
        cubeEffect: {
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
      if(swiper[0]){
        swiper[0].slideTo(2);
      }
    },2000)
  }

  getTourList(searchCriterion){
    this.showLoader = true;
    this.tourService.getToursList(searchCriterion).subscribe(response => {
      this.onTourListResponse(response)
    }, error => {
      this.showLoader = false;
      toastr.error(error.error.message)
    })
  }

  onDeleteTour(tour){
    this.showLoader = true;
    let _tourId = tour.id;
    this.tourService.deleteTour(_tourId).subscribe(response => {
      this.showLoader = false;
      if (response["status"] == "success") {
        toastr.success('Tour Deleted SuccessFully');
        let tourIndex = this.tourList.findIndex(elem=>elem.id == _tourId);
        this.tourList.splice(tourIndex,1);
      } else {
        this.error = response
      }
    }, error => {
      this.showLoader = false;
      toastr.error(error.error.message)
    })
  }

  onEditTour(tour){
    tour["isEdit"] = true;
    this.dialogRef = this.dialog.open(EditTourComponent,{
      data: {tourData:tour,dialogTitle:"Manage Tour" }})
    this.dialogRef.afterClosed.subscribe(result => {
        console.log('Dialog closed', result)
      })
    }
  onCreateTour(){
    this.dialogRef = this.dialog.open(EditTourComponent,{
      data: {dialogTitle:"Create Tour" }})


    this.dialogRef.afterClosed.subscribe(result => {
        console.log('Dialog closed', result)
      })

  }

  searchCriterionChanged(searchCriterion){
    this.getTourList(searchCriterion);
  }

  showUserNearByTours(locationData){
    this.showLoader = true;
    this.getNearByTours(locationData);
  }
  getNearByTours(locationData){
    let {distance, lat , lng , unit} = locationData;
    this.tourService.getNearByTours(distance, lat , lng, unit).subscribe(response => {
      this.onTourListResponse(response)
    }, error => {
      this.showLoader = false;
      toastr.error(error.error.message)
    })
  }
  getTop5Tours(){
    this.tourService.getTop5Tours().subscribe(response => {
      this.onTourListResponse(response);
    }, error => {
      this.showLoader = false;
      toastr.error(error.error.message)
    })
  }

  onTourListResponse(response){
    this.showLoader = false;
    console.log(response)
    if (response["status"] == "success") {
      if (response.data) {
        let _response = response.data;
        if (_response.data) {
          this.tourList = response.data.data;
          this.initializeSwiper();
        }
      }
    } else {
      toastr.error(response.error.message)
    }
  }
}
