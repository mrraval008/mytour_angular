import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  constructor() { }
  @Input() public isReadOnly = false;
  @Input() public rating = 5;
  @Output() public ratingSelectionChangedEvent = new EventEmitter();
  
  ngOnInit() {
  }

  ratingChanged(rating){
    console.log(rating);
    this.rating = rating;
    this.ratingSelectionChangedEvent.emit(rating)
  }

}
