var myApp = angular.module('myApp');

myApp.service('DataService', function($http){
  this.getAllRides = function(){
    return $http.get('/getAllRides').then(function(data){
      console.log('rides data is ', data);
      return data;
    })
  };
  this.updateAffiliateRidesData = function(affiliateName){
    return $http.put('/updateAffiliateRidesData', affiliateName).then(function(data){
      return data;
    })
  };
  this.getCommentsPhoto = function(affiliateName){
    console.log('inside getcommentsphoto');
    return $http.get('/getCommentsPhoto').then(function(data){
      return data;
    })
  };
  this.addComment = function(content, affiliate){
    return $http.put('/updateCommentsPhoto', {content: content, affiliate: affiliate, operation: 'add'}).then(function(data){
      console.log('data returned from add comment service is ', data);
      return data;
    })
  };
  this.deleteComment = function(content, affiliate){
    console.log('content is ', content, 'affiliate is ', affiliate);
    return $http.put('/updateCommentsPhoto', {content: content, affiliate: affiliate, operation: 'delete'}).then(function(data){
      console.log('data returned from delete comment service is ', data);
      return data;
    })
  };
  this.addCalendarEvent = function(newEvent){
    console.log('event is ', newEvent);
    return $http.post('/addCalendarEvent', {newEvent: newEvent}).then(function(data){
      console.log('data returned from add calendar event service is ', data);
      return data;
    })
  };
  this.viewCalendarEvents = function(){
    return $http.get('/viewCalendarEvents').then(function(data){
      return data;
    })
  };
  this.deleteAgendaEvent = function(agendaEvent){
    console.log('event is ', agendaEvent);
    return $http.delete('/deleteAgendaEvent', {
        params: {
            agendaEvent: agendaEvent
        }
    }).then(function(data){
      console.log('data returned is ', data);
      return data;
    })
  };
});