import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TourService } from 'src/app/tour.service';
import { HelperService } from 'src/app/helper.service';

declare let google: any;
declare let toastr: any;


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit ,AfterViewInit {

  constructor(private tourService:TourService,private helperService:HelperService) { }

  public showLoader = true;
  public monthArr = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  public Years = [2021,2022,2023];
  
  // private chartContainer
  @ViewChild('chartDiv',{static:false}) chartContainer: ElementRef;
  
  

  ngOnInit() {
    google.charts.load('current', {packages: ['corechart']});     
    this.getChartData();
    toastr.options = this.helperService.getToastOption();
    
  }

  ngAfterViewInit() {
    // this.initializeSwiper()
  }

  getChartData(year = 2021){
    this.tourService.getMonthlyPlan(year).subscribe(response => {
      console.log(response)
      this.showLoader = false;
      if (response["status"] == "success") {
        google.charts.setOnLoadCallback(this.drawChart.bind(this,response.data.monthlyPlan,year));
      } else {
        toastr.error(response.error.message)
      }
    }, error => {
      this.showLoader = false;
      toastr.error(error.error.message)
    })
  }

  drawChart(monthlyData,year) {
    let chartArr = [['Month', 'No.  Of Tours Planned']];
    if(monthlyData.length > 0){
        monthlyData.forEach(element => {
            chartArr.push([this.monthArr[element.month-1],element.numOfTours])
        });
    }else{
        toastr.error(`No data found for Year: ${year}`)
        return;
    }

    let data = google.visualization.arrayToDataTable(chartArr);

    let options = {title: `Tours Monthly Plan for ${year}`,vAxis: {title: "No.  Of Tours Planned in Month",format: '0'},hAxis: {title: "Month"}}; 

    // Instantiate and draw the chart.
    let chart = new google.visualization.ColumnChart(this.chartContainer.nativeElement);
    chart.draw(data, options);
 }

}
