import { Injectable } from '@angular/core';
import { UserService } from 'src/app/user.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  getLocalStorageData(key) {
    return localStorage.getItem(key)
  }

  updateLocalStorageData(key, value) {
    localStorage.setItem(key, value)
  }

  clearLocaleStorage() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  }



  formatURL(baseURL, searchCriterion) {
    let formattedURLArr = [];
    searchCriterion = JSON.parse(searchCriterion);
    if (searchCriterion.searchVal && searchCriterion.searchVal != "") {
      let searchValue = searchCriterion.searchVal.split(" ").join("-");
      formattedURLArr.push(`name=${searchValue}`)
    }
    if (searchCriterion.sortVal && searchCriterion.sortVal != "") {
      formattedURLArr.push(`sort=${searchCriterion.sortVal}`)
    }
    if (searchCriterion.filterVal && searchCriterion.filterVal != "") {
      let _filterVal  = searchCriterion.filterVal;
      for(let key in _filterVal){
        formattedURLArr.push(_filterVal[key]);
      }
    }
    let formattedURL = formattedURLArr.join("&");
    baseURL += "?" + formattedURL;
    return baseURL;
  }

  getObjectDiffrences(obj1, obj2) {
    let diffObj = {};
    for (let key in obj1) {
      if (obj1.hasOwnProperty(key) && JSON.stringify(obj1[key]) != JSON.stringify(obj2[key])) {
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

  getToastOption() {
    return {
      showEasing: 'swing',
      closeButton: true,
      closeMethod: 'fadeOut',
      closeDuration: 300,
      closeEasing: 'swing'
    }
  }


  getTourSortItemList() {
    return { "Name": "name", "Duration (ASC)": "duration", "Duration (DESC)": "-duration", "Rating (ASC)": "ratingsAverage", "Rating (DESC)": "-ratingsAverage", "Price (ASC)": "price", "Price (DESC)": "-price", "Difficulty": "difficulty" };
  }

  getUserSortItemList() {
    return { "Name": "name", "Role": "role" };
  }

  cloneObject(o) {
    // if not array or object or is null return self
    if (typeof o !== 'object' || o === null) return o;
    var newO, i; // handle case: array

    if (o instanceof Array) {
      var l;
      newO = [];

      for (i = 0, l = o.length; i < l; i++) {
        newO[i] = this.cloneObject(o[i]);
      }

      return newO;
    } // handle case: object


    newO = {};

    for (i in o) {
      if (o.hasOwnProperty(i)) newO[i] = this.cloneObject(o[i]);
    }

    return newO;
  }

  isObjectEqual(obj1,obj2){
    return JSON.stringify(obj1) == JSON.stringify(obj2);
  }

}
