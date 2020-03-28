import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  getLocalStorageData(key){
    return localStorage.getItem(key)
  }

  updateLocalStorageData(key,value){
    localStorage.setItem(key,value)
  }

  clearLocaleStorage(){
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  }

  

  formatURL(baseURL,searchCriterion){
    let formattedURLArr = [];
    searchCriterion = JSON.parse(searchCriterion);
    if(searchCriterion.searchVal && searchCriterion.searchVal != ""){
      let searchValue = searchCriterion.searchVal.split(" ").join("-");
      formattedURLArr.push(`name=${searchValue}`)
    }
    if(searchCriterion.sortVal && searchCriterion.sortVal != ""){
      formattedURLArr.push(`sort=${searchCriterion.sortVal}`)
    }
    if(searchCriterion.filterVal && searchCriterion.filterVal != ""){
      let _filterVal  = "";
      searchCriterion.filterVal.forEach(element => {
        _filterVal += element
      });
      formattedURLArr.push(_filterVal)
    }
    let formattedURL = formattedURLArr.join("&");
    baseURL += "?"+ formattedURL;
    return baseURL;
  }

  getObjectDiffrences(obj1,obj2){
      let diffObj = {};
      for(let key in obj1){
        if(obj1.hasOwnProperty(key) && obj1[key] != obj2[key]){
          diffObj[key] = obj1[key]
        }
      }
      return diffObj;
  }

  isEmpty(obj) {
    if (typeof obj == 'number' || typeof obj == 'boolean') {
      return false;
    }
    if (obj == "") {
      return true;
    }
    for (var x in obj) {
      return false;
    }
    return true;
  }

  isValidObjectPath(base, path) {
    var current = base;
    var components = path.split(".");

    for (var i = 0; i < components.length; i++) {
      if (typeof current !== "object" || !current || !(components[i] in current)) {
        return false;
      }

      current = current[components[i]];
    }

    return true;
  }
}
