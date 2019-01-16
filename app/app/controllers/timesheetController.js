var myApp = angular.module('myApp');

myApp.controller('TimesheetCtrl', ['$scope', '$transitions', '$http', '$location', '$stateParams', '$timeout', '$state', '$rootScope', '$window','DataService', 'LongVariablesService', 'CalendarService', '$q', function($scope, $transitions, $http, $location, $stateParams, $timeout, $state, $rootScope, $window, DataService, LongVariablesService, CalendarService, $q) {

    console.log('inside timesheet controller');
    $scope.timesForPicker = LongVariablesService.timesForPicker;
    $scope.adjustTimeForCalendar = CalendarService.adjustTimeForCalendar; //function
    $scope.convertMinsToHoursMinsObj = CalendarService.convertMinsToHoursMinsObj; //function
    $scope.showNote = {};
    $scope.selectedEnd = $scope.timesForPicker[0];
    $scope.selectedStart = $scope.timesForPicker[0];
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
       shifts: [
         {
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
           timeDiffMins: 0
         }
       ],
       totalMileageRefund: 0,
       dailyWorkTimeMins: 0,
       dailyOvertimeMins: 0
     };

     $scope.addShift = function(){
       var newShift;
       if ($scope.tsData.shifts.length < 5) { //add max 5 shifts per day
         newShift =      {
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
            timeDiffMins: 0
          };
        $scope.tsData.shifts.push(newShift);
      } else {
        $scope.warningMsg = "You cannot work on more than 5 shifts per day.";
        $timeout(function() {
           $scope.warningMsg = "";
        }, 4000);
      }
    };

    $scope.removeShift = function(shiftSelected, shiftIdx){
      $scope.tsData.shifts.splice(shiftIdx, 1);
    };

    $scope.updateStartTime = function(timeSelected, shiftSelected, shiftIdx){
      console.log('time selected is ', timeSelected);
      console.log('shift selected is ', shiftSelected);
      console.log('shift idx is ', shiftIdx);
      var convertedTime = $scope.adjustTimeForCalendar(timeSelected);
      console.log('converted timeSelected is ', convertedTime);
      shiftSelected.startTimeMeridian = timeSelected;
      shiftSelected.startTimeObj = convertedTime;
      shiftSelected.idx = shiftIdx;
      console.log("shift is ", $scope.tsData.shifts[shiftIdx]);
      $scope.tsData.shifts[shiftIdx] = shiftSelected;
      console.log('updated shifts array is ', $scope.tsData.shifts);
    };

    $scope.updateEndTime = function(timeSelected, shiftSelected, shiftIdx){
      console.log('time selected is ', timeSelected);
      console.log('shift selected is ', shiftSelected);
      console.log('shift idx is ', shiftIdx);
      var convertedTime = $scope.adjustTimeForCalendar(timeSelected);
      console.log('converted timeSelected is ', convertedTime);
      shiftSelected.endTimeMeridian = timeSelected;
      shiftSelected.endTimeObj = convertedTime;
      shiftSelected.idx = shiftIdx;
      console.log("shift is ", $scope.tsData.shifts[shiftIdx]);
      $scope.tsData.shifts[shiftIdx] = shiftSelected;
      console.log('updated shifts array is ', $scope.tsData.shifts);
    };

    $scope.toggleNote = function(shiftIdx){
      $scope.showNote[shiftIdx] = !$scope.showNote[shiftIdx];
    };

    $scope.calculateDayOfPeriod = function(day){
    };

    $scope.recordShift = function(shiftIdx){
      $scope.tsData.shiftSelectedIdx = $scope.tsData.shifts[shiftIdx].idx = shiftIdx;
      $scope.tsData.shifts[shiftIdx].mileageRefund = $scope.calculateMileageRefund(shiftIdx); //calculate mileage refund
      $scope.tsData.totalMileageRefund += $scope.tsData.shifts[shiftIdx].mileageRefund; //add to total daily mileage refund
      $scope.calculateTotalWorkTime(shiftIdx); //calculates work time and work overtime
      $scope.calculateOvertime();
    };

    $scope.calculateMileageRefund = function(shiftIdx){
      var mileageRefund = $scope.tsData.rates.mileageRate * $scope.tsData.shifts[shiftIdx].milesPerShift
      console.log('mileageRefund is ', mileageRefund);
      return mileageRefund;
    };

    $scope.calculateTotalWorkTime = function(shiftIdx){
      var startTimeObj; var endTimeObj; var startTimeMins; var endTimeMins; var timeDiffMins; var overtime;
      var timeDiffHoursMins = $scope.convertMinsToHoursMinsObj(timeDiffMins);
      for (var i in $scope.tsData.shifts) {
        console.log('each ', $scope.tsData.shifts[i]);
        startTimeObj = $scope.tsData.shifts[i].startTimeObj;
        endTimeObj = $scope.tsData.shifts[i].endTimeObj;
        console.log('start time obj ', startTimeObj, 'end time obj', endTimeObj);
        startTimeMins = (startTimeObj.hour * 60) + startTimeObj.min;
        endTimeMins = (endTimeObj.hour * 60) + endTimeObj.min;
        timeDiffMins = endTimeMins - startTimeMins;
        timeDiffHoursMins = $scope.convertMinsToHoursMinsObj(timeDiffMins);
        $scope.tsData.shifts[shiftIdx].timeDiffMins = timeDiffMins;
        $scope.tsData.shifts[shiftIdx].timeDiffHoursMins = timeDiffHoursMins;
        console.log('worktime mins is ', timeDiffMins, ', hours mins is ', timeDiffHoursMins);
        $scope.tsData.dailyWorkTimeMins += timeDiffMins;
      }
    };

    $scope.deductLunch = function(){
      console.log('deduct lunch val is ', $scope.tsData.tookLunch);
      if ($scope.tsData.tookLunch){ // if lunch selected, deduct 30mins
        $scope.tsData.dailyWorkTimeMins = $scope.tsData.dailyWorkTimeMins - 30
      } else {
        $scope.tsData.dailyWorkTimeMins = $scope.tsData.dailyWorkTimeMins + 30
      }
      console.log('updated deduct lunch time is ', $scope.tsData.dailyWorkTimeMins);
    }

    $scope.calculateOvertime = function(){
      var otBenchmarkMins = $scope.tsData.rates.otBenchmark * 60;
      $scope.tsData.dailyOvertimeMins = $scope.tsData.dailyWorkTimeMins - otBenchmarkMins
    };

    $scope.submitTimesheet = function(){
    };


}]);
