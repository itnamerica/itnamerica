var myApp = angular.module('myApp');

myApp.controller('CalendarCtrl', ['$scope', '$transitions', '$http', '$anchorScroll', '$location', '$stateParams', '$timeout', '$state', '$rootScope', '$window', 'FormService', '$sce', 'DataService', '$q',  function($scope, $transitions, $http, $anchorScroll, $location, $stateParams, $timeout, $state, $rootScope, $window, FormService, $sce, DataService, $q) {
    console.log('inside calendar controller');
    $scope.eventObj = {}

    $scope.initAgenda = function() {
      $scope.hideModal('calendarModal');
      $scope.hideModal('addOrShowModal');
      var promise = $scope.viewCalendarEventsPromise();
      promise.then(function(data){
        // console.log('calendar events are ', $scope.calendarEvents);
        $('#calendar').fullCalendar({
          defaultView: 'agendaDay',
          height: 650,
          editable: true,
          selectable: true,
          slotEventOverlap: true,
          minTime: "08:00:00",
          eventRender: function(event, element){
              console.log("rendering " +event.title, 'elem is ', element);
          },
          eventClick: function(calEvent, jsEvent, view) {
            console.log('calEvent is ', calEvent);
            $(this).css('border-color', 'red');
            var reconstructEvent = $scope.reconstructEventObjByTitle(calEvent);
            swal({
              title: reconstructEvent.title,
              text: reconstructEvent.description + ' (by ' + reconstructEvent.author + ')',
              buttons: {
                cancel: true,
                confirm: true,
                deleteEvent: {
                  text: "Delete event",
                  value: reconstructEvent,
                },
              }
            }).then(function(eventToDelete){
              if (eventToDelete && eventToDelete.title) {
                console.log('eventToDelete is ', eventToDelete);
                $scope.deleteAgendaEvent(eventToDelete, calEvent);
              }
            })
          },
          dayClick: function(event) {
            $scope.$apply(function() {
                $scope.dayClicked = event._d;
            });
            $('#calendarModal').modal('show');
          }
        })//end of calendar config
        //day agenda only accepts today's date. Agenda has been hacked so we only care about time.
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var theEvent = {};
        $scope.eventsArr = [];

        for (calendarEvent in $scope.calendarEvents) {
          //only parse events for that day
          var calendarEventDay = new Date($scope.calendarEvents[calendarEvent].day).addDays(1)
          calendarEventDay = calendarEventDay.toDateString();

          if (calendarEventDay === $scope.selectedEventDateFormatted) {
            //placing events in day agenda according to start and end times.
            var st = $scope.calendarEvents[calendarEvent].startTime;
            var adjustedSt = $scope.adjustTimeForCalendar(st);
            var et = $scope.calendarEvents[calendarEvent].endTime;
            var adjustedEt = $scope.adjustTimeForCalendar(et);
            var startTime = new Date(y, m, d, adjustedSt.hour, adjustedSt.min);
            var endTime = new Date(y, m, d, adjustedEt.hour, adjustedEt.min);
            //draw on DOM
            theEvent = {title: $scope.calendarEvents[calendarEvent].title, start: startTime, end: endTime, description: $scope.calendarEvents[calendarEvent].description, author: $scope.calendarEvents[calendarEvent].author};
            $("#calendar").fullCalendar("renderEvent", theEvent);
            $scope.eventsArr.push(theEvent);
          }
        }
      });//end of promise
    };


    $scope.reconstructEventObjByTitle = function(calEvent) {
      var fullEvent = {};
      for (var i in $scope.eventsArr){
        if ($scope.eventsArr[i].title === calEvent.title){
          fullEvent.title = calEvent.title;
          fullEvent.startTime = $scope.eventsArr[i].startTime;
          fullEvent.endTime = $scope.eventsArr[i].endTime;
          fullEvent.description = $scope.eventsArr[i].description;
          fullEvent.author = $scope.eventsArr[i].author;
          return fullEvent;
        }
      }
    };

    $scope.adjustTimeForCalendar = function(theTime) {
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
      // console.log('time adjusted as ', adjustedTime);
      return adjustedTime;
    };


    $scope.initMonthCalendar = function(){
      $('#calendar').fullCalendar({
        dayClick: function(event) {
          $scope.$apply(function() {
              $scope.dayClicked = event._d;
          });
          console.log('a day has been clicked! event is ', $scope.dayClicked);
          $('#addOrShowModal').modal('show');
        }
      });
    };

    $scope.initWeekCalendar = function() {
      $scope.hideModal('calendarModal');
      $scope.hideModal('addOrShowModal');
      var promise = $scope.viewRISCalendarEventsPromise();
      promise.then(function(data){
        // console.log('calendar events are ', $scope.calendarEvents);
        $('#calendar-week').fullCalendar({
          defaultView: 'agendaWeek',
          height: 650,
          editable: true,
          selectable: true,
          slotEventOverlap: true,
          minTime: "08:00:00",
          maxTime: "20:00:00",
          nowIndicator: true,
          header: {
            left: 'prev,next today',
            center: 'Week of',
            right: 'agendaWeek,agendaDay'
          },
          eventRender: function(event, element){
              console.log("rendering " +event.title, 'elem is ', element);
          },
          eventClick: function(calEvent, jsEvent, view) {
            console.log('calEvent is ', calEvent);
            $(this).css('border-color', 'red');
            var reconstructEvent = $scope.reconstructEventObjByTitle(calEvent);
            swal({
              title: reconstructEvent.title,
              text: reconstructEvent.description + ' (by ' + reconstructEvent.author + ')',
              buttons: {
                cancel: true,
                confirm: true,
                deleteEvent: {
                  text: "Delete event",
                  value: reconstructEvent,
                },
              }
            }).then(function(eventToDelete){
              if (eventToDelete && eventToDelete.title) {
                console.log('eventToDelete is ', eventToDelete);
                $scope.deleteAgendaEvent(eventToDelete, calEvent);
              }
            })
          },
          dayClick: function(event, jsEvent) {
            console.log('event is ', event, 'wat is ', jsEvent.target);
            jsEvent.target.innerText = "Helloo";
            $scope.eventTest = jsEvent.target.innerText;
            $scope.$apply(function() {
                $scope.dayClicked = event._d;
            });
            console.log('day clicked is ', $scope.dayClicked);
            console.log('day of month is ', $scope.dayClicked.getDate());
            console.log(' month is ', $scope.dayClicked.getMonth());
            console.log('year is ', $scope.dayClicked.getYear() -100 + 2000);

            //go through isLaterTime first
            $scope.eventObj.startTime = $scope.dayClicked.getHours() + 4;
            console.log('start time is ', $scope.eventObj.startTime);

            $('#calendarModal').modal('show');

            $('#addEventForm').on('submit', function(e){
              console.log('after submit ', $scope.eventObj, 'target ',jsEvent.target);

              var event = {title: $scope.eventObj.title, start: $scope.eventObj.startTime, end: $scope.eventObj.endTime, description: $scope.eventObj.description, author: $scope.eventObj.author};

              jsEvent.target.innerHTML = '<h6 class="agenda-link"><span class="badge badge-secondary">' + event.start + '-' + event.end + '<br>' + event.title + '</span></h6>';
          });
          }
        })//end of calendar config
        //
        // var countries = new Array();
        // countries[0] = {'title':'España', 'start':new Date(y, m, d+4, 19, 0), url:'http://google.com/'};
        // countries[1] = {'title':'Portugal', 'start':new Date(y, m, 22, 22, 0)};
        // $("#calendar-week").fullCalendar( 'addEventSource', countries )
        // $("#calendar").fullCalendar("renderEvent", countries[0]);


        //day agenda only accepts today's date. Agenda has been hacked so we only care about time.
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var theEvent = {};
        $scope.eventsArr = [];

        // for (calendarEvent in $scope.calendarEvents) {
        //   //only parse events for that day
        //   var calendarEventDay = new Date($scope.calendarEvents[calendarEvent].day).addDays(1)
        //   calendarEventDay = calendarEventDay.toDateString();
        //
        //   if (calendarEventDay === $scope.selectedEventDateFormatted) {
        //     //placing events in day agenda according to start and end times.
        //     var st = $scope.calendarEvents[calendarEvent].startTime;
        //     var adjustedSt = $scope.adjustTimeForCalendar(st);
        //     var et = $scope.calendarEvents[calendarEvent].endTime;
        //     var adjustedEt = $scope.adjustTimeForCalendar(et);
        //     var startTime = new Date(y, m, d, adjustedSt.hour, adjustedSt.min);
        //     var endTime = new Date(y, m, d, adjustedEt.hour, adjustedEt.min);
        //     //draw on DOM
        //     theEvent = {title: $scope.calendarEvents[calendarEvent].title, start: startTime, end: endTime, description: $scope.calendarEvents[calendarEvent].description, author: $scope.calendarEvents[calendarEvent].author};
        //     $("#calendar").fullCalendar("renderEvent", theEvent);
        //     $scope.eventsArr.push(theEvent);
        //   }
        // }
      });//end of promise
    };

    $scope.resetEventObj = function(){
      $scope.eventObj = {};
      $scope.serverMessage = "";
    };

    $scope.addCalendarEvent = function(calendarType){
      //selects previous day by default, so need to adjust
      $scope.eventObj.day = new Date($scope.dayClicked.getTime());
      console.log('event obj is ', $scope.eventObj);
      //save event to database
      if (calendarType === 'RIS'){
        DataService.addRISCalendarEvent($scope.eventObj).then(function(data){
          $('#calendarModal').modal('hide');
          $scope.serverMessage = "Your event has been succesfully added.";
          //updates events on DOM
          $scope.emptyCalendar();
          $scope.viewRISCalendarEventsPromise();
          $scope.resetEventObj();

          console.log('event is ', $scope.eventTest);
          $scope.eventTest = "Goodbye";
          console.log('event2 is ', $scope.eventTest);
        })
      } else {
        DataService.addCalendarEvent($scope.eventObj).then(function(data){
          $('#calendarModal').modal('hide');
          $scope.serverMessage = "Your event has been succesfully added.";
          //updates events on DOM
          $scope.emptyCalendar();
          $scope.viewCalendarEventsPromise();
          $scope.resetEventObj();
        })
      }
    };

    $scope.addAgendaEvent = function(){
      //selects following day by default, so need to adjust
      $scope.eventObj.day = $scope.selectedEventDatePrevious;
      //save event to database
      DataService.addCalendarEvent($scope.eventObj).then(function(data){
        $('#calendarModal').modal('hide');
        $scope.serverMessage = "Your event has been succesfully added.";
        //updates events on DOM
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var st = $scope.eventObj.startTime;
        var adjustedSt = $scope.adjustTimeForCalendar(st);
        var et = $scope.eventObj.endTime;
        var adjustedEt = $scope.adjustTimeForCalendar(et);
        var startTime = new Date(y, m, d, adjustedSt.hour, adjustedSt.min);
        var endTime = new Date(y, m, d, adjustedEt.hour, adjustedEt.min);

        var theEvent = {title: $scope.eventObj.title, start: startTime, end: endTime, description: $scope.eventObj.description, author: $scope.eventObj.author};

        console.log('event obj is ', $scope.eventObj);
        console.log('the event is ', theEvent);

        $("#calendar").fullCalendar("renderEvent", theEvent);

        $scope.resetEventObj();
      })
    };

    $scope.deleteAgendaEvent = function(eventToDelete, calEventToDelete){
      //delete event from database
      DataService.deleteAgendaEvent(eventToDelete).then(function(data){
        $('#calendarModal').modal('hide');
        $scope.serverMessage = "Your event has been succesfully deleted.";
        $("#calendar").fullCalendar("removeEvents", calEventToDelete._id);
      })
    };

    $scope.viewCalendarEventsPromise = function(){
      var deferred = $q.defer();
      //get events from database
      DataService.viewCalendarEvents()
      .then(function(data){
        $scope.calendarEvents = data.data;
        $scope.drawEventsOnCalendar();
        deferred.resolve('Resolved: ', data.data);
      }).catch(function(err){
        deferred.resolve('Error: ', err);
      })
      return deferred.promise;
    };

    $scope.viewRISCalendarEventsPromise = function(){
      var deferred = $q.defer();
      //get events from database
      DataService.viewRISCalendarEvents()
      .then(function(data){
        $scope.calendarEvents = data.data;
        console.log('RIS calendar events are ', $scope.calendarEvents);
        // $scope.drawEventsOnRISCalendar();
        deferred.resolve('Resolved: ', data.data);
      }).catch(function(err){
        deferred.resolve('Error: ', err);
      })
      return deferred.promise;
    };

    $scope.drawEventsOnRISCalendar = function(){
      console.log('inside draw events ris');
      $(document).ready(function(){
        // var html = $('#calendar-week').find('.fc-view-container').find('.fc-widget-content');
        var html = $('#calendar-week').find('.fc-view-container');
        console.log("html is ", html);
        console.log();
      })
    };


    //place events on their respective day tabs
    // $scope.drawEventsOnRISCalendar = function(){
    //   console.log('inside draw events ris');
    //   $(document).find('#calendar-week').each(function(){
    //     var elem = $(this);
    //     console.log('this is ', elem);
    //     // var widget = elem.find('.fc-view-container').find('.fc-widget-content');
    //     var widget = elem.find('.fc-view-container');
    //     console.log('widget is ',widget);
    //   })
    //   console.log('end of ris');
    // };


    //place events on their respective day tabs
    $scope.drawEventsOnCalendar = function(){
      $scope.eventsinFC = [];
      $('.fc-day').each(function(){
        var tabDate = $(this).context.dataset.date;
        var count = 0;
        var ctx;
        for (event in $scope.calendarEvents){
          var event = $scope.calendarEvents[event];
          var eventDateShort = event.day.slice(0,10);
          if (eventDateShort === tabDate){
            ctx = $(this).context;
            // console.log('a match! event is ', event, 'tab ctx is ', $(this).context);

            //orders events chronologically for a given day
            var later = $scope.isLaterTime(event, $(this).context);
            if (later){
              $(this).context.innerHTML = $(this).context.innerHTML + '<h6 class="agenda-link"><span class="badge badge-secondary">' + event.startTime + '-' + event.endTime + '<br>' + event.title + '</span></h6>';
            } else {
              $(this).context.innerHTML = '<h6 class="agenda-link"><span class="badge badge-secondary">' + event.startTime + '-' + event.endTime + '<br>' + event.title + '</span></h6>' + $(this).context.innerHTML;
            }

            //if more than 2 events on tab, add the more button to prevent overflow
            count = ctx.childElementCount;
            if (count > 3) {
              $(this).children().eq(1).nextAll().css("display","none");
              var moreBtn = '<button class="btn btn-sm" style="height:20px;width:70%;margin-top:-230px;font-size:14px;color: black">Show more</button>';
              $(this).context.innerHTML = $(this).context.innerHTML + moreBtn;
            }
          }
        }
      })
    };

    $scope.isLaterTime = function(theEvent, theContext){
      var numEventsInCell = theContext.children.length;
      var lastChild = theContext.children[theContext.children.length -1];

      if (lastChild){
        var slicedTime = lastChild.innerText.slice(0, lastChild.innerText.indexOf('-'));

        var eventAdjustedTime = $scope.adjustTimeForCalendar(theEvent.startTime);
        var adjustedTime = $scope.adjustTimeForCalendar(slicedTime);

        // console.log('adjusted time ', adjustedTime, 'event adjusted time ', eventAdjustedTime);
        if (eventAdjustedTime.hour >= adjustedTime.hour){
          return true
        } else {
          return false;
        }
      }
    };


    $scope.emptyCalendar = function(){
      $('.fc-day').each(function(){
        $(this).context.innerHTML = ""
      })
    };


    $scope.retrieveFromSelectedEvent = function(){
      $scope.selectedEventDatePrevious = $stateParams.selectedEventDate;
      $scope.selectedEventDate = $scope.selectedEventDatePrevious.addDays(1);
      $scope.selectedEventDateFormatted = new Date($scope.selectedEventDate).toDateString();
    };


    function compareNumbers(a, b) {
      return a - b;
    } //numArray.sort(compareNumbers)


    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

}]);
