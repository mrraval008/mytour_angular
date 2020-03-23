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
  // private sortItmeList = ["Name","Duration","Rating","Price","Difficulty"];
  @Input() private sortItmeList;
  
  private sortBy = "name";
  private searchStr = "";
  private searchText$ = new Subject<string>();
  private searchTimeOut;
  @Output() public searchCriterionChangedEvent = new EventEmitter();
  ngOnInit() {
    // this.searchText$.pipe(
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap(packageName =>
    //     this.filterChange())
    // );
  }
  onSearch(value){
    this.searchStr = value;
    
    clearTimeout(this.searchTimeOut)
    this.searchTimeOut = setTimeout(()=>{
      this.filterChange();
      clearTimeout(this.searchTimeOut)
    },1500)
  }
  onSortByChange(value){
    this.sortBy = value;
    this.filterChange();
  }
  
  filterChange(){
    this.searchCriterionChangedEvent.emit(JSON.stringify({sortVal:this.sortBy,searchVal : this.searchStr}))
  }

}
