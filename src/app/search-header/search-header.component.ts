import { Component, OnInit, Output ,EventEmitter, Input} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs/internal/Observable';
import { JsonPipe } from '@angular/common';
import { HelperService } from 'src/app/helper.service';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.css']
})
export class SearchHeaderComponent implements OnInit {

  constructor(private helperService:HelperService) { }
  // public sortItmeList = ["Name","Duration","Rating","Price","Difficulty"];
  @Input() public sortItmeList;
  public ratingList = ['Ratings','>=1','>=2','>=3','>=4','>=5'];
  public priceList = ['Price','<=500','<=1500','<=2000','<=2500','<=3000']
  @Input() public hideFilters = false;
  public selectedSortByText = "Name";
  public selectedRatingFilterText = "Ratings";
  public selectedPriceFilterText = "Price"
  

  public showSortByMenu = false;
  public showRatingFilter = false;
  public showPriceFilter = false;
  
  
  public sortBy = "name";
  public searchStr = "";
  public filterObj = {};
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
  onSortByChange(target){
    this.sortBy = target.getAttribute('data-value');
    this.selectedSortByText = target.getAttribute('data-externalName');
    this.showSortByMenu = false;
    this.emitSearchEvent();
  }

  onFilterChange(target,filterName){
    this.closeAllFilterMenus();
    let value = target.getAttribute('data-value');
    let splitedVal = value.split("=");
    let _value = splitedVal.length > 0 ?  splitedVal[1] : splitedVal[0]
      if(filterName == "rating"){
        this.selectedRatingFilterText = value;
        if(value !== 'Ratings'){
          this.filterObj['rating'] = `rating={"gte":${_value}}`;
        }else{
          delete this.filterObj['rating']
        }
      }
      if(filterName == "price"){
        this.selectedPriceFilterText = value;
        if(value !== 'Price'){
          this.filterObj['price'] = `price={"lte":${_value}}`;
        }else{
          delete this.filterObj['price']
        }
      }
      this.emitSearchEvent();
  }
  onClickedOutside(){
    this.showSortByMenu = false;
  }
  onClickedFilterOutside(){
   this.closeAllFilterMenus()
  }

  closeAllFilterMenus(){
    this.showRatingFilter = false;
    this.showPriceFilter = false;
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
    this.searchCriterionChangedEvent.emit(JSON.stringify({sortVal:this.sortBy,searchVal : this.searchStr,filterVal:this.filterObj}))
  }

}
