var myApp = angular.module('myApp');

myApp.service('ParseVariablesService', ['$http','$q', function($http, $q){

  this.fixCorruptedParams = function(stateParams){
    var corruptedIdx = stateParams.indexOf('=');
    if (corruptedIdx){
       return stateParams.slice(corruptedIdx + 1, stateParams.length)
    } else {
      return stateParams;
    }
  };
  
  this.adjustTimeForCalendar = function(theTime) {
    var time = theTime.replace(" ", "");
    time = time.toUpperCase();
    var adjustedTime = {
      hour: 0,
      min: 0
    };
     if (time.includes("AM") && time.includes(":")){
        adjustedTime.hour = time.substr(0,time.indexOf(':'));
        adjustedTime.min = time.substr(time.indexOf(':')+1,time.indexOf('AM')-2);
    } else if (time.includes("AM")){
        adjustedTime.hour = time.substr(0,time.indexOf('AM'));
        adjustedTime.min = 0;
    } else if (time.includes("PM") && time.includes(":")){
        adjustedTime.hour = parseInt(time.substr(0,time.indexOf(':')));
        if (adjustedTime.hour < 12){
          adjustedTime.hour = adjustedTime.hour + 12;
        }
        adjustedTime.min = time.substr(time.indexOf(':')+1,time.indexOf('PM')-2);
    } else if (time.includes("PM")){
        adjustedTime.hour = parseInt(time.substr(0,time.indexOf('PM')));
        if (adjustedTime.hour < 12){
          adjustedTime.hour = adjustedTime.hour + 12;
        }
        adjustedTime.min = 0;
    }
    adjustedTime.hour = parseInt(adjustedTime.hour);
    adjustedTime.min = parseInt(adjustedTime.min);
    return adjustedTime;
  };

}]);
