import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogConfig } from 'src/app/dialog/dialog-config';
import { AgGridAngular } from 'ag-grid-angular';
import { TourService } from 'src/app/tour.service';
import { HelperService } from 'src/app/helper.service';
import { UserService } from 'src/app/user.service';
import {  FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.component.html',
  styleUrls: ['./edit-tour.component.css']
})
export class EditTourComponent implements OnInit {

  constructor(public config: DialogConfig,private tourService:TourService,private helperService:HelperService,private userService:UserService) { }

  private tourModel = { locations: [],id:"",price:"" ,difficulty:false,startLocation:{},guides:[]};
  private originalTourData = {};
  private difficultyLevels = ["easy", "medium", "difficult"];
  private difficultyLevelhasError = true;
  private discountHasError = false;

  private locationRowData = [];
  private locationColumnDefs = [
    { headerName: 'Day', field: 'day', editable: true },
    { headerName: 'Description', field: 'description', editable: true },
    { headerName: 'Longitude', field: 'longitude', editable: true },
    { headerName: 'Latitude', field: 'latitude', editable: true }
  ];

  private guideRowData = [];
  private guideColumnDefs = [
    { headerName: 'ID', field: '_id',checkboxSelection: true},
    { headerName: 'Name', field: 'name'},
    { headerName: 'Role', field: 'role'}
  ];

  private startLocationRowData = []
  private startLocationColumnDefs = [
    { headerName: 'Description', field: 'description', editable: true },
    { headerName: 'Longitude', field: 'longitude', editable: true },
    { headerName: 'Latitude', field: 'latitude', editable: true },
    { headerName: 'Address', field: 'address', editable: true }
  ]

  private rowSelection = "multiple";


  private authToken = this.helperService.getLocalStorageData("authToken");
  public uploader:FileUploader = new FileUploader({autoUpload: true,allowedFileType: ['image'],headers: [{ name: 'authorization', value: 'Bearer '+this.authToken}],itemAlias: 'imageCover'});
  
  public imagesUploader:FileUploader = new FileUploader({autoUpload: true,allowedFileType: ['image'],headers: [{ name: 'authorization', value: 'Bearer '+this.authToken}],itemAlias: 'images'});
  
  


  private showLoader = false;
  private isEditMode = false;

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
    this.getAllGuides()
    // this.guideRowData = this.tourModel.guides;

  }else{
    //add one row for start location
    this.startlocationGrid.api.updateRowData({add: [{"day":"","address":"","longitude":"","latitude":""}]});
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
  
  
  }
 
  onAfterAddingFile(file){
    this.showLoader = true;
    file.url = `http://127.0.0.1:3000/api/v1/tours/${this.tourModel.id}`
    file.withCredentials = false; 
  }

  onAfterCompleteFile(item,response,status,headers){
    this.showLoader = false;
    alert("Image Uploaded");
    console.log("ImageUpload:uploaded:", item, status, response);
  }

  getAllGuides(){
    let searchCriterion = {"filterVal":["role={'$in':['guide','lead-guide']}"]} 
    this.userService.getUserList(JSON.stringify(searchCriterion)).subscribe(response=>{
      this.showLoader = false
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
      this.showLoader = false
        console.log(error)
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
    if(this.config.data){

      let diffFields = this.helperService.getObjectDiffrences(this.tourModel,this.originalTourData);
      if(Object.entries(diffFields).length != 0){
        this.showLoader = true;
        let tourId = this.tourModel.id;
        this.tourService.updateTour(tourId,diffFields).subscribe(response=>{
          this.showLoader = false
          alert("Tour Updated");
          // this.onDialogClose();
        },
        error =>{
          this.showLoader = false;
          console.log(error)
        })
      }
    }else{
      this.showLoader = true;
      let obj = Object.assign({},this.tourModel);
      obj["locations"] = this.getlocationRowData();
      obj["guides"] = this.getGuideRowData();
      obj["startLocation"] = this.getStartLocationRowData()[0];
      this.tourService.createTour(obj).subscribe(response=>{
        this.showLoader = false
        alert("Tour created");
        // this.onDialogClose();
      },
      error =>{
        this.showLoader = false;
        console.log(error)
      })
    }
    


  }
}


// https://www.ag-grid.com/javascript-grid-data-update/#gsc.tab=0
// https://www.ag-grid.com/javascript-grid-cell-editing/#gsc.tab=0
