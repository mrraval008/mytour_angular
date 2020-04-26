import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogConfig } from 'src/app/dialog/dialog-config';
import { AgGridAngular } from 'ag-grid-angular';
import { TourService } from 'src/app/tour.service';
import { HelperService } from 'src/app/helper.service';
import { UserService } from 'src/app/user.service';
import {  FileUploader } from 'ng2-file-upload';
import { DialogRef } from 'src/app/dialog/dialog-ref';
declare var toastr: any;
declare var $: any;


@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.component.html',
  styleUrls: ['./edit-tour.component.css']
})
export class EditTourComponent implements OnInit {

  constructor(public config: DialogConfig,public tourService:TourService,public helperService:HelperService,public userService:UserService,public dialog: DialogRef) { }

  // public tourModel = { locations: [],id:"",price:"" ,difficulty:false,startLocation:{},guides:[]};
  public tourModel = {imageCover:"",name:"",duration:"",startLocation:{description:""},difficulty:false,maxGroupSize:"",ratingsAverage:4.5,guides:[],description:"",images:[""],location:"",locations:[],id:"",price:"",summary:"",priceDiscount:"",startDates:[]};
  // public tourModel :any

  
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
    { headerName: 'ID', field: 'id',checkboxSelection: true},
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

  public startDatesRowData = []
  public startDatesColumnDefs = [
    { headerName: 'Start Dates', field: 'startDates', editable: true, cellEditor: 'datePicker' },
  ]

  public rowSelection = "multiple";


  public authToken = this.helperService.getLocalStorageData("authToken");
  public uploader:FileUploader = new FileUploader({autoUpload: true,allowedFileType: ['image'],headers: [{ name: 'authorization', value: 'Bearer '+this.authToken}],itemAlias: 'imageCover'});
  
  public imagesUploader:FileUploader = new FileUploader({autoUpload: true,allowedFileType: ['image'],headers: [{ name: 'authorization', value: 'Bearer '+this.authToken}],itemAlias: 'images'});
  
  


  public showLoader = false;
  public isEditMode = false;

  public formButtonText  = "Create Tour"

  private components : any;

  @ViewChild("locationGrid", { static: false }) locationGrid: AgGridAngular;
  @ViewChild("guideGrid", { static: false }) guideGrid: AgGridAngular;
  @ViewChild("startlocationGrid", { static: false }) startlocationGrid: AgGridAngular;  
  @ViewChild("startDatesGrid", { static: false }) startDatesGrid: AgGridAngular;  
  

  ngOnInit() {
    this.components = { datePicker: this.getDatePicker() };
  
    //get tour data from config in case of edit
    if(this.config.data && this.config.data.tourData){
    this.tourModel = this.config.data.tourData;
    console.log(this.tourModel)
    this.isEditMode = true;
    this.formButtonText = "Update Tour"



    console.log(this.tourModel);

    //format location data to display in ag-grid
    this.formatLocationDataToDisplay()
    this.formatStartLocationDataToDisplay();
    this.formatStartDatesDataToDisplay()
    //Render ag-grid locationRowData
    this.locationRowData = this.tourModel.locations;
    this.startLocationRowData = [this.tourModel.startLocation];
    this.startDatesRowData = this.tourModel.startDates;

    //set original data for comparision
    this.originalTourData = this.helperService.cloneObject(this.tourModel);
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
    let searchCriterion = {'filterVal': {role:'role={"$in":["guide","lead-guide"]}'}} 
    
    this.userService.getUserList(JSON.stringify(searchCriterion)).subscribe(response=>{
      this.showLoader = false;
      if (response["status"] == "success") {
        if (response.data.data) {
          let guideList = response.data.data
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
      toastr.success(error.error.message);
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

  formatStartDatesDataToDisplay() {
    if (this.tourModel.startDates && !this.helperService.isEmpty(this.tourModel.startDates)) {

      this.tourModel.startDates = this.tourModel.startDates.map(element => {
        let date = new Date(element);
        
        let year :any = date.getFullYear();
        let month :any = date.getMonth()+1;
        let dt :any = date.getDate();
        
        if (dt < 10) {
          dt = '0' + dt;
        }
        if (month < 10) {
          month = '0' + month;
        }
        
        return {"startDates":year+'-' + month + '-'+dt};
      });
    }
  }



  AddRow(selectedGrid){
    if(selectedGrid == 'locationGrid'){
      this.locationGrid.api.updateRowData({add: [{"description":"","day":"","longitude":"","latitude":""}]});
    }else if(selectedGrid == 'startDatesGrid'){
      this.startDatesGrid.api.updateRowData({add: [{"startDates":""}]});
    }
  }
  removeRow(selectedGrid){
    if(selectedGrid == 'locationGrid'){
      let selectedData = this.locationGrid.api.getSelectedRows();
      this.locationGrid.api.updateRowData({remove: selectedData});
    }else if(selectedGrid == 'startDatesGrid'){
      let selectedData = this.startDatesGrid.api.getSelectedRows();
      this.startDatesGrid.api.updateRowData({remove: selectedData});
    }
   
  }

  getlocationRowData() {
    let rowData = [];
    this.locationGrid.api.forEachNode( function(node) {
        rowData.push(node.data);
    });
    return this.getLocationFormatedData(rowData);
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

  getStartDatesRowData(){
    let rowData = [];
    this.startDatesGrid.api.forEachNode( function(node) {
      let date = new Date(node.data.startDates);
      let isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
      rowData.push(isoDate);
    });
    return rowData
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
    let _rowData =  this.helperService.cloneObject(rowData);
    let formattedRowData = _rowData.map(element => {
      element["coordinates"] = [element.longitude,element.latitude];
      element["type"] = "Point";
      delete element.latitude;
      delete element.longitude;
      return element;
    });
    return formattedRowData;
  }

  getStartLocationFormatedData(rowData){
    let formattedRowData = rowData.map(element => {
      element["coordinates"] = [element.longitude,element.latitude];
      element["type"] = "Point";
      delete element.latitude;
      delete element.longitude;
      return element;
    });
    return formattedRowData; 
  }

  validateDifficultyLevel(value) {
    console.log(this.locationGrid);
    this.difficultyLevelhasError = value == "default" ? true : false;
  }
  validateDiscount(value) {
    this.discountHasError = value > this.tourModel.price  ? true : false;
  }


  getDatePicker() {
    function Datepicker() {}
    Datepicker.prototype.init = function(params) {
      this.eInput = document.createElement('input');
      this.eInput.value = params.value;
      this.eInput.type = "date";
    };
    Datepicker.prototype.getGui = function() {
      return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function() {
      this.eInput.focus();
      this.eInput.select();
    };
    Datepicker.prototype.getValue = function() {
      return this.eInput.value;
    };
    Datepicker.prototype.destroy = function() {};
    Datepicker.prototype.isPopup = function() {
      return false;
    };
    return Datepicker;
  }


  onCellValueChanged(event){
      let selectedRowData = event.api.getSelectedRows()
  }

  onSubmit(){
    if(this.isEditMode){
      let diffFields : any = this.helperService.getObjectDiffrences(this.tourModel,this.originalTourData);
      let locations = this.getlocationRowData();
      if(!this.helperService.isEmpty(locations)){
        diffFields["locations"] = locations;
      }else{
        toastr.error(`Locations can not be empty`)
        return;
      }
      let guides = this.getGuideRowData();
      if(!this.helperService.isEmpty(guides)){
        diffFields["guides"] = guides;
      }else{
        toastr.error(`Guides can not be empty`)
        return;
      }
      

      let startLocation = this.getStartLocationRowData()[0];
      if(!this.helperService.isEmpty(startLocation.coordinates)){
        diffFields["startLocation"] = startLocation;
      }else{
        toastr.error(`Start Locations can not be empty`)
        return;
      }
      let startDates = this.getStartDatesRowData();
      if(!this.helperService.isEmpty(startDates)){
        diffFields["startDates"] = startDates;
      }else{
        toastr.error(`Start Dates can not be empty`);
        return;
      }

      if(Object.entries(diffFields).length != 0){
        if(diffFields.hasOwnProperty("locations")){
          diffFields["locations"] = this.getlocationRowData();
        }
     
        if(diffFields.hasOwnProperty("startLocation")){
          diffFields["startLocation"] = this.getStartLocationRowData()[0];
        }
        if(Object.keys(diffFields).includes("priceDiscount") && diffFields.priceDiscount > this.tourModel.price){
          toastr.error(`Discount price ${diffFields.priceDiscount} should be below regular price`)
          return;
        }
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
      }else{
        toastr.info("No changes to save")
      }
    }else{
      this.showLoader = true;
      let obj = this.helperService.cloneObject(this.tourModel);
      let locations = this.getlocationRowData();
      if(!this.helperService.isEmpty(locations)){
        obj["locations"] = locations;
      }
      let guides = this.getGuideRowData();
      if(!this.helperService.isEmpty(guides)){
        obj["guides"] = guides;
      }
      let startLocation = this.getStartLocationRowData()[0];
      if(!this.helperService.isEmpty(startLocation.coordinates)){
        obj["startLocation"] = startLocation;
      }else{
        delete obj["startLocation"];
      }
      let startDates = this.getStartDatesRowData();
      if(!this.helperService.isEmpty(startDates)){
        let startDate = this.helperService.cloneObject(startDates);
        obj["startDates"] = startDate.map(elem => elem.startDates)
      }
      this.tourService.createTour(obj).subscribe(response=>{
        this.showLoader = false;
        toastr.success('Tour Created SuccessFully');
        this.dialog.close('some value');
      },
      error =>{
        this.showLoader = false;
        console.log(error);
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