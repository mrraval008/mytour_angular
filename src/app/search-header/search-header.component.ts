import { Component, OnInit, Output ,EventEmitter, Input} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs/internal/Observable';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.css']
})
export class SearchHeaderComponent implements OnInit {

  constructor() { }
  // public sortItmeList = ["Name","Duration","Rating","Price","Difficulty"];
  @Input() public sortItmeList;
  public ratingList = ['Ratings','>=1','>=2','>=3','>=4','>=5'];
  public priceList = ['Price','>=100','>=200','>=300','>=400','>=500']
  @Input() public hideFilters = false;
  
  
  public sortBy = "name";
  public searchStr = "";
  public filterStr = "";
  public searchText$ = new Subject<string>();
  public searchTimeOut;
  @Output() public searchCriterionChangedEvent = new EventEmitter();
  @Output() public showUserNearByToursEvent = new EventEmitter();
  @Output() public getTop5ToursEvent = new EventEmitter();
  ngOnInit() {
    // this.searchText$.pipe(
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap(packageName =>
    //     this.emitSearchEvent())
    // );
  }
  onSearch(value){
    this.searchStr = value;
    
    clearTimeout(this.searchTimeOut)
    this.searchTimeOut = setTimeout(()=>{
      this.emitSearchEvent();
      clearTimeout(this.searchTimeOut)
    },1500)
  }
  onSortByChange(value){
    this.sortBy = value;
    this.emitSearchEvent();
  }

  onFilterChange(value,filterName){
    let splitedVal = value.split("=");
    let _value = splitedVal.length > 0 ?  splitedVal[1] : splitedVal[0]
      if(filterName == "rating"){
        if(value !== 'Ratings'){
          this.filterStr = `rating={gte:${_value}}`;
        }
      }
      if(filterName == "price"){
        if(value !== 'Price'){
          this.filterStr += `price={gte=${_value}`;
        }
      }
      this.emitSearchEvent();
  }

  showUserNearByTours(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        let localtionData = {distance:200,lat : position.coords.latitude,lng : position.coords.longitude,unit:"km"}
        this.showUserNearByToursEvent.emit(localtionData)
      })
    }
  }

  getTop5Tours(){
    this.getTop5ToursEvent.emit()
  }


  
  emitSearchEvent(){
    this.searchCriterionChangedEvent.emit(JSON.stringify({sortVal:this.sortBy,searchVal : this.searchStr,filterVal:this.filterStr}))
  }

}
