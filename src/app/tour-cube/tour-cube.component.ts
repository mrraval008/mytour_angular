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
  public sortItmeList = ["Name","Duration","Rating","Price","Difficulty"];
  
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
      if (response["status"] == "success") {
        this.showLoader = false;
        if (response.data.data) {
          let _tourList = response.data.data;
          _tourList.forEach(element => {
            element.startDate = element.startDates[0];
          });
          this.tourList = _tourList;
          this.initializeSwiper();
        }
      } else {
        this.error = response
      }
    }, error => {
      this.showLoader = false;
      this.error = error
    })
  }

  onDeleteTour(tour){
    this.showLoader = false;
    let _tourId = tour.id;
    this.tourService.deleteTour(_tourId).subscribe(response => {
      this.showLoader = true;
      if (response["status"] == "success") {
        toastr.success('Tour Deleted SuccessFully');
        let tourIndex = this.tourList.findIndex(elem=>elem.id == _tourId);
        this.tourList.splice(tourIndex,1);
      } else {
        this.error = response
      }
    }, error => {
      this.showLoader = false;
      this.error = error
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

}
