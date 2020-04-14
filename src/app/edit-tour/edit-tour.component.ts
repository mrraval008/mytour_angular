import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogConfig } from 'src/app/dialog/dialog-config';
import { AgGridAngular } from 'ag-grid-angular';
import { TourService } from 'src/app/tour.service';
import { HelperService } from 'src/app/helper.service';
import { UserService } from 'src/app/user.service';
import {  FileUploader } from 'ng2-file-upload';
import { DialogRef } from 'src/app/dialog/dialog-ref';
declare var toastr: any;

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.component.html',
  styleUrls: ['./edit-tour.component.css']
})
export class EditTourComponent implements OnInit {

  constructor(public config: DialogConfig,public tourService:TourService,public helperService:HelperService,public userService:UserService,public dialog: DialogRef) { }

  // public tourModel = { locations: [],id:"",price:"" ,difficulty:false,startLocation:{},guides:[]};
  public tourModel = {imageCover:"",name:"",duration:"",startLocation:{description:""},difficulty:false,maxGroupSize:"",ratingsAverage:4.5,guides:[],description:"",images:[""],location:"",locations:[],id:"",price:"",summary:"",priceDiscount:""};
  
  public originalTourData = {};
  public difficultyLevels = ["easy", "medium", "difficult"];
  public difficultyLevelhasError = true;
  public discountHasError = false;

  public locationRowData = [];
  public locationColumnDefs = [
    { headerName: 'Day', field: 'day', editable: true },
    { headerName: 'Description', field: 'description', editable: true },
    { headerName: 'Longitude', field: 'longitude', editable: true },
    { headerName: 'Latitude', field: 'latitude', editable: true }
  ];

  public guideRowData = [];
  public guideColumnDefs = [
    { headerName: 'ID', field: '_id',checkboxSelection: true},
    { headerName: 'Name', field: 'name'},
    { headerName: 'Role', field: 'role'}
  ];

  public startLocationRowData = []
  public startLocationColumnDefs = [
    { headerName: 'Description', field: 'description', editable: true },
    { headerName: 'Longitude', field: 'longitude', editable: true },
    { headerName: 'Latitude', field: 'latitude', editable: true },
    { headerName: 'Address', field: 'address', editable: true }
  ]

  public rowSelection = "multiple";


  public authToken = this.helperService.getLocalStorageData("authToken");
  public uploader:FileUploader = new FileUploader({autoUpload: true,allowedFileType: ['image'],headers: [{ name: 'authorization', value: 'Bearer '+this.authToken}],itemAlias: 'imageCover'});
  
  public imagesUploader:FileUploader = new FileUploader({autoUpload: true,allowedFileType: ['image'],headers: [{ name: 'authorization', value: 'Bearer '+this.authToken}],itemAlias: 'images'});
  
  


  public showLoader = false;
  public isEditMode = false;

  @ViewChild("locationGrid", { static: false }) locationGrid: AgGridAngular;
  @ViewChild("guideGrid", { static: false }) guideGrid: AgGridAngular;
  @ViewChild("startlocationGrid", { static: false }) startlocationGrid: AgGridAngular;  
  

  ngOnInit() {
    //get tour data from config in case of edit
    if(this.config.data && this.config.data.tourData){
    this.tourModel = this.config.data.tourData;
    console.log(this.tourModel)
    this.isEditMode = true;


    //set original data for comparision
    this.originalTourData = Object.assign({},this.tourModel);

    console.log(this.tourModel);

    //format location data to display in ag-grid
    this.formatLocationDataToDisplay()
    this.formatStartLocationDataToDisplay();

    //Render ag-grid locationRowData
    this.locationRowData = this.tourModel.locations;
    this.startLocationRowData = [this.tourModel.startLocation];
    // this.getAllGuides()
    // this.guideRowData = this.tourModel.guides;

  }

  this.getAllGuides()
  

  this.uploader.onAfterAddingFile = (file)=> { 
    this.onAfterAddingFile(file)
  };
  this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
    this.onAfterCompleteFile(item,response,status,headers)
  };

  this.imagesUploader.onAfterAddingFile = (file)=> { 
    this.onAfterAddingFile(file)
  };
  this.imagesUploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
    this.onAfterCompleteFile(item,response,status,headers)
  };
  
  toastr.options = this.helperService.getToastOption();
  
  }

  ngAfterViewInit(){
    if(!this.isEditMode){
      this.startlocationGrid.api.updateRowData({add: [{"description":"","address":"","longitude":"","latitude":""}]});
    }
  }
 
  onAfterAddingFile(file){
    this.showLoader = true;
    file.url = `http://127.0.0.1:3000/api/v1/tours/${this.tourModel.id}`
    file.withCredentials = false; 
  }

  onAfterCompleteFile(item,response,status,headers){
    this.showLoader = false;
    toastr.success('Image Uploaded SuccessFully');
    this.dialog.close('some value')
    console.log("ImageUpload:uploaded:", item, status, response);
  }

  getAllGuides(){
    // let searchCriterion = {"filterVal":{'role':{'$in':['guide','lead-guide']}}} 
    let searchCriterion = {"filterVal":["role={'$in':['guide','lead-guide']}"]} 
    
    this.userService.getUserList(JSON.stringify(searchCriterion)).subscribe(response=>{
      this.showLoader = false;
      if (response["status"] == "success") {
        if (response.data.data) {
          let guideList = response.data.data
          console.log(response)
      
          let rowData = [];
          guideList.forEach(element => {
            rowData.push({"name":element.name,"role":element.role,"id":element._id})
          });
          this.guideRowData = rowData
          // this.userList = response.data.data;
        }
      }
    },error=>{
      this.showLoader = false;
      toastr.success('Image Uploaded SuccessFully');
    });
  }

  formatLocationDataToDisplay() {
    if (this.tourModel.locations && this.tourModel.locations.length > 0) {
      this.tourModel.locations.forEach(element => {
        element["longitude"] =  element.coordinates[0]
        element["latitude"] =  element.coordinates[1]
      });
    }
  }

  formatStartLocationDataToDisplay() {
    if (this.tourModel.startLocation && !this.helperService.isEmpty(this.tourModel.startLocation)) {
      this.tourModel.startLocation["longitude"] =  this.tourModel.startLocation["coordinates"][0];
      this.tourModel.startLocation["latitude"] =  this.tourModel.startLocation["coordinates"][1];
    }
  }



  AddRow(){
    this.locationGrid.api.updateRowData({add: [{"description":"","day":"","longitude":"","latitude":""}]});
  }
  removeRow(){
    let selectedData = this.locationGrid.api.getSelectedRows();
    this.locationGrid.api.updateRowData({remove: selectedData});
  }

  getlocationRowData() {
    let rowData = [];
    this.locationGrid.api.forEachNode( function(node) {
        rowData.push(node.data);
    });
    if(this.isEditMode){
      
    }else{
      return this.getLocationFormatedData(rowData);
    }
  }

  getStartLocationRowData() {
    let rowData = [];
    this.startlocationGrid.api.forEachNode( function(node) {
        rowData.push(node.data);
    });
    return this.getLocationFormatedData(rowData);
  }

  getGuideRowData(){
    let selectedNode = this.guideGrid.api.getSelectedNodes();
    let guideRowData = selectedNode.map(element => element.data.id);
    return guideRowData;
  }

  onGuideGridReady(event){
    if(this.tourModel.guides.length > 0){
      setTimeout(()=>{
        event.api.forEachNode( (node) => {
          if (this.tourModel.guides.findIndex(elem => elem._id === node.data.id ) > -1) {
              node.setSelected(true);
          }
      });
      },1000)
    }
  
    
  }

  getLocationFormatedData(rowData){
    let formattedRowData = rowData.map(element => {
      element["coordinates"] = [element.longitude,element.latitude];
      element["type"] = "Point";
      delete element.latitude;
      delete element.longitude;
      return element;
    });
    return formattedRowData 
  }

  getStartLocationFormatedData(rowData){
    let formattedRowData = rowData.map(element => {
      element["coordinates"] = [element.longitude,element.latitude];
      element["type"] = "Point";
      delete element.latitude;
      delete element.longitude;
      return element;
    });
    return formattedRowData 
  }



register(){
  console.log("locationGrid");
  
}


  validateDifficultyLevel(value) {
    console.log(this.locationGrid);
    this.difficultyLevelhasError = value == "default" ? true : false;
  }
  validateDiscount(value) {
    this.discountHasError = value > this.tourModel.price  ? true : false;
  }




  onSubmit(){
    if(this.isEditMode){

      let diffFields = this.helperService.getObjectDiffrences(this.tourModel,this.originalTourData);
      if(Object.entries(diffFields).length != 0){
        this.showLoader = true;
        let tourId = this.tourModel.id;
        this.tourService.updateTour(tourId,diffFields).subscribe(response=>{
          this.showLoader = false
          
          toastr.success('Tour Updated SuccessFully')
          this.dialog.close('some value')
        },
        error =>{
          this.showLoader = false;
          console.log(error);
          toastr.error(error.error.message)
        })
      }
    }else{
      this.showLoader = true;
      let obj = Object.assign({},this.tourModel);
      let locations = this.getlocationRowData();
      if(!this.helperService.isEmpty(locations)){
        obj["locations"] = locations;
      }
      let guides = this.getGuideRowData();
      if(!this.helperService.isEmpty(guides)){
        obj["guides"] = guides
      }
      let startLocation = this.getStartLocationRowData()[0];
      if(!this.helperService.isEmpty(startLocation.coordinates)){
        obj["startLocation"] = startLocation
      }else{
        delete obj["startLocation"] 
      }
      this.tourService.createTour(obj).subscribe(response=>{
        this.showLoader = false
        toastr.success('Tour Created SuccessFully');
        this.dialog.close('some value')
      },
      error =>{
        this.showLoader = false;
        console.log(error)
        toastr.error(error.error.message)
      })
    }
    


  }
}


// https://www.ag-grid.com/javascript-grid-data-update/#gsc.tab=0
// https://www.ag-grid.com/javascript-grid-cell-editing/#gsc.tab=0
// https://docs.mongodb.com/manual/tutorial/calculate-distances-using-spherical-geometry-with-2d-geospatial-indexes/
// Valid longitude values are between -180 and 180, both inclusive.
// Valid latitude values are between -90 and 90, both inclusive.