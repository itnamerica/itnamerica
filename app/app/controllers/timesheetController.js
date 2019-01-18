var myApp = angular.module('myApp');

myApp.controller('TimesheetCtrl', ['$scope', '$transitions', '$http', '$location', '$stateParams', '$timeout', '$state', '$rootScope', '$window','DataService', 'LongVariablesService', 'CalendarService', '$q', function($scope, $transitions, $http, $location, $stateParams, $timeout, $state, $rootScope, $window, DataService, LongVariablesService, CalendarService, $q) {

    $scope.timesForPicker = LongVariablesService.timesForPicker;
    $scope.adjustTimeForCalendar = CalendarService.adjustTimeForCalendar; //function
    $scope.convertMinsToHoursMinsObj = CalendarService.convertMinsToHoursMinsObj; //function
    $scope.showNote = {};
    $scope.selectedStartTime = $scope.timesForPicker[0];
    $scope.selectedEndTime = $scope.timesForPicker[0];
    $scope.shiftsAdded = 0;
    $scope.tsData = {
       date: new Date(),
       tookLunch: false,
       dayOfPeriod: 0, //calculate
       shiftSelecteIdx: 0,
       rates: {
         mileageRate: 0.555,
         dailyRate: 7.14,
         weeklyRate: 50,
         otBenchmark: 8 //overtime benchmark in hours
       },
       shifts: [],
       totalMileageRefund: 0,
       dailyWorkTimeMins: 0,
       dailyOvertimeMins: 0
     };
     var newShift = {
      startTime: null,
      stopTime: null,
      startTimeObj: null,
      stopTimeObj: null,
      startTimeMeridian: null,
      stopTimeMeridian: null,
      milesPerShift: 0,
      note: "",
      isSelected: true,
      idx: 0,
      mileageRefund: 0,
      timeDiffHoursMins: 0,
      timeDiffMins: 0,
      saved: false,
      overtime: false
    };
    $scope.tsData.shifts.push(newShift);
    $scope.overtimeFlag = false;
    



     $scope.checkIfPreviousShiftSaved = function(){
       var shiftsNumber = $scope.tsData.shifts.length;
       var lastShift = $scope.tsData.shifts[shiftsNumber-1];
       if (lastShift.saved){
         return true
       } else {
         return false
       }
     };

     $scope.highlightOvertimeShift = function(shiftIdxTrigger){
         if ($scope.tsData.dailyOvertimeMins === Math.abs($scope.tsData.dailyOvertimeMins)){ //if overtime mins
           if ($scope.overtimeFlag === false){
              $scope.overtimeFlag = true;
              $scope.shiftIdxTrigger = shiftIdxTrigger;
           }
         }
     };


     $scope.addShift = function(){
       var previousShiftSaved = $scope.checkIfPreviousShiftSaved();
       if (!previousShiftSaved) {
         swal("Oops","Please save your previous shift before adding a new one.","error");
         return;
       }
       if ($scope.tsData.shifts.length < 5) { //add max 5 shifts per day
         var newShift2 = {
          startTime: null,
          stopTime: null,
          startTimeObj: null,
          stopTimeObj: null,
          startTimeMeridian: null,
          stopTimeMeridian: null,
          milesPerShift: 0,
          note: "",
          isSelected: true,
          idx: 0,
          mileageRefund: 0,
          timeDiffHoursMins: 0,
          timeDiffMins: 0,
          saved: false,
          overtime: false
        };
        $scope.tsData.shifts.push(newShift2);
      } else {
        swal("Oops","You cannot work on more than 5 shifts per day.","error");
      }
      console.log('after add, shifts are ', $scope.tsData.shifts);
      $scope.highlightOvertimeShift($scope.tsData.shifts.length);
    };


    $scope.removeShift = function(shiftSelected, shiftIdx){
      $scope.tsData.shifts.splice(shiftIdx, 1);
      console.log('after remove, shifts are ', $scope.tsData.shifts);
    };


    $scope.checkIfShiftLaterThanPrevious = function(shiftIdx, startTimeObj){
      var previousShiftEndTimeObj = $scope.tsData.shifts[shiftIdx-1].endTimeObj;
      var previousShiftEndTimeMins = $scope.convertTimeObjToMins(previousShiftEndTimeObj);
      var thisShiftStartTimeMins = $scope.convertTimeObjToMins(startTimeObj);
      var timeDiff = thisShiftStartTimeMins - previousShiftEndTimeMins;
      if (timeDiff === Math.abs(timeDiff)){ //if nxt start time later than prev end time
        return true;
      } else {
        return false;
      }
    };


    $scope.updateStartTime = function(timeSelected, shiftSelected, shiftIdx){
      var startTimeObj = $scope.adjustTimeForCalendar(timeSelected);
      console.log('shift idx is ', 0, 'selected and time ', shiftSelected, timeSelected);
      if (shiftIdx > 0){ //check for all, except first shift
        var laterThanPrevious = $scope.checkIfShiftLaterThanPrevious(shiftIdx, startTimeObj);
        if (!laterThanPrevious){
          swal("Create a later shift","Your shifts must be submitted chronologically.","error");
        }
      }
      shiftSelected.startTimeMeridian = timeSelected;
      shiftSelected.startTimeObj = startTimeObj;
      shiftSelected.idx = shiftIdx;
      $scope.tsData.shifts[shiftIdx] = shiftSelected;
      console.log('updated shift times after update start is ', $scope.tsData.shifts[shiftIdx]);
    };


    $scope.updateEndTime = function(timeSelected, shiftSelected, shiftIdx){
      var endTimeObj = $scope.adjustTimeForCalendar(timeSelected);
      //before assigning new end time to shift obj, need to check that endtime is later than startTime
      var timeSelectedIsOK = $scope.lockCellIfEarlierThanStartTime(shiftSelected, shiftIdx, endTimeObj);
      if (!timeSelectedIsOK){
        swal("Wrong time selected","You cannot select an end time earlier than a start time.","error");
        return;
      }
      shiftSelected.endTimeMeridian = timeSelected;
      shiftSelected.endTimeObj = endTimeObj;
      shiftSelected.idx = shiftIdx;
      $scope.tsData.shifts[shiftIdx] = shiftSelected;
      console.log('updated shift times after update end is ', $scope.tsData.shifts[shiftIdx]);
    };


    $scope.lockCellIfEarlierThanStartTime = function(shiftSelected, shiftIdx, endTimeObj){
      var timeDiffMins = $scope.calculateTimeDiffMins(shiftSelected.startTimeObj, endTimeObj);
      console.log('time diff mins is ', timeDiffMins);
      if (timeDiffMins === Math.abs(timeDiffMins)){ //if val negative, endTime is earlier so alert user
        return true
      } else {
        return false
      }
    };


    $scope.toggleNote = function(shiftIdx){
      $scope.showNote[shiftIdx] = !$scope.showNote[shiftIdx];
    };


    $scope.calculateDayOfPeriod = function(day){
    };


    $scope.recordShift = function(shiftIdx){
      $scope.tsData.shifts[shiftIdx].saved = true;
      $scope.tsData.shiftSelectedIdx = $scope.tsData.shifts[shiftIdx].idx = shiftIdx;
      $scope.tsData.shifts[shiftIdx].mileageRefund = $scope.calculateMileageRefund(shiftIdx); //calculate mileage refund
      $scope.tsData.totalMileageRefund += $scope.tsData.shifts[shiftIdx].mileageRefund; //add to total daily mileage refund
      $scope.calculateTotalWorkTime(shiftIdx); //calculates work time and work overtime
      $scope.calculateOvertime();
      console.log('new shift saved is ', $scope.tsData.shifts[shiftIdx]);
      console.log('after record, shifts are ', $scope.tsData.shifts)
    };


    $scope.calculateMileageRefund = function(shiftIdx){
      var mileageRefund = $scope.tsData.rates.mileageRate * $scope.tsData.shifts[shiftIdx].milesPerShift;
      return mileageRefund;
    };


    $scope.calculateTotalWorkTime = function(shiftIdx){
      var startTimeObj; var endTimeObj; var startTimeMins; var endTimeMins; var timeDiffMins; var overtime; var timeDiffHoursMins;
      for (var i in $scope.tsData.shifts) {
        startTimeObj = $scope.tsData.shifts[i].startTimeObj;
        endTimeObj = $scope.tsData.shifts[i].endTimeObj;
        timeDiffMins = $scope.calculateTimeDiffMins(startTimeObj, endTimeObj);
        timeDiffHoursMins = $scope.convertMinsToHoursMinsObj(timeDiffMins);
        $scope.tsData.shifts[shiftIdx].timeDiffMins = timeDiffMins;
        $scope.tsData.shifts[shiftIdx].timeDiffHoursMins = timeDiffHoursMins;
        $scope.tsData.dailyWorkTimeMins += timeDiffMins;
      }
    };


    $scope.calculateTimeDiffMins = function(startTimeObj, endTimeObj){
      var startTimeMins = $scope.convertTimeObjToMins(startTimeObj);
      var endTimeMins = $scope.convertTimeObjToMins(endTimeObj);
      var timeDiffMins = endTimeMins - startTimeMins;
      return timeDiffMins
    };

    $scope.convertTimeObjToMins = function(timeObj){
      var timeMins = (timeObj.hour * 60) + timeObj.min;
      return timeMins;
    };


    $scope.deductLunch = function(){
      if ($scope.tsData.tookLunch){ // if lunch selected, deduct 30mins
        $scope.tsData.dailyWorkTimeMins = $scope.tsData.dailyWorkTimeMins - 30
      } else {
        $scope.tsData.dailyWorkTimeMins = $scope.tsData.dailyWorkTimeMins + 30
      }
      console.log('updated deduct lunch time is ', $scope.tsData.dailyWorkTimeMins);
    };


    $scope.calculateOvertime = function(){
      var otBenchmarkMins = $scope.tsData.rates.otBenchmark * 60;
      $scope.tsData.dailyOvertimeMins = $scope.tsData.dailyWorkTimeMins - otBenchmarkMins
    };


    $scope.submitTimesheet = function(){
    };


}]);
