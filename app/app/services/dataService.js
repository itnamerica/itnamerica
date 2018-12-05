var myApp = angular.module('myApp');

myApp.service('DataService', ['$http','$q', function($http, $q){
  this.getAllRides = function(){
    return $http.get('/getAllRides').then(function(data){
      // console.log('rides data is ', data);
      return data;
    })
  };
  this.updateAffiliateRidesData = function(affiliateName){
    return $http.put('/updateAffiliateRidesData', affiliateName).then(function(data){
      return data;
    })
  };
  this.getCommentsPhoto = function(){
    return $http.get('/getCommentsPhoto').then(function(data){
      return data;
    })
  };
  this.fetchCommentsPerAffiliate = function(affiliateName){
    return $http.get('/fetchCommentsPerAffiliate', {
      params: {
        affiliateName: affiliateName
      }
    })
    .then(function(data){
      console.log('data returned from fetch comments per aff frontend service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
  this.fetchImages = function(affiliateName){
    return $http.get('/fetchCommentsPhoto', {
      params: {
        affiliateName: affiliateName
      }
    })
    .then(function(data){
      console.log('data returned from fetch images frontend service is ', data);
      return data;
    }).catch(function(error){ return error })
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
    }).catch(function(error){ return error })
    // return $http.put('/updateComments').then(function(data){
    //   console.log('return from update comments', data);
    // })
  };
  this.addRISCalendarEvent = function(newEvent){
    console.log('event is ', newEvent);
    return $http.post('/addRISCalendarEvent', {newEvent: newEvent}).then(function(data){
      console.log('data returned from add calendar event service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
  this.addCalendarEvent = function(newEvent){
    console.log('event is ', newEvent);
    return $http.post('/addCalendarEvent', {newEvent: newEvent}).then(function(data){
      console.log('data returned from add calendar event service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
  this.deleteRISCalendarEvent = function(agendaEvent, dbName){
    //special circular object, do not send full agendaEvent obj to backend.
    console.log('event is ', agendaEvent, 'from ', dbName);
    return $http.delete('/deleteRISCalendarEvent/' + agendaEvent._id, {params: {dbName: dbName}} ).then(function(data){
      console.log('data returned is ', data);
      return data;
    }).catch(function(error){
      console.log('error is ', error);
      return error;
    })
  };
  this.viewRISCalendarEvents = function(){
    return $http.get('/viewRISCalendarEvents').then(function(data){
      return data;
    }).catch(function(error){ return error })
  };
  this.viewCalendarEvents = function(){
    return $http.get('/viewCalendarEvents').then(function(data){
      return data;
    }).catch(function(error){ return error })
  };
  this.deleteAgendaEvent = function(agendaEvent, dbName){
    console.log('event is ', agendaEvent, 'from ', dbName);
    return $http.delete('/deleteAgendaEvent', {
        params: {
            agendaEvent: agendaEvent,
            dbName: dbName
        }
    }).then(function(data){
      console.log('data returned is ', data);
      return data;
    }).catch(function(error){
      console.log('error is ', error);
      return error;
    })
  };
  this.getEmployees = function(){
    return $http.get('/getEmployees').then(function(data){
      return data;
    }).catch(function(error){ return error })
  };
  this.updateEmployee = function(employee){
    return $http.put('/updateEmployee', {employee: employee}).then(function(data){
      return data;
    }).catch(function(error){ return error })
  };
  this.login = function(formData, tableName) {
    console.log('inside DataService login ', formData, tableName);
      return $http.get('/loginStandard', {
              params: {
                  formData: formData,
                  tableName: tableName
              }
          })
          .then(function(data) {
              return data;
          }).catch(function(error) {
              return error
          })
  };
  this.loginPrivilege = function(formData, tableName, privilegeType) {
    console.log('inside DataService login ', formData, tableName, privilegeType);
      return $http.get('/loginPrivilege', {
              params: {
                  formData: formData,
                  tableName: tableName,
                  privilegeType: privilegeType
              }
          })
          .then(function(data) {
              return data;
          }).catch(function(error) {
              return error
          })
  };
  this.loginEmployees = function(formData, employeeSelected){
    console.log('inside login employees' , employeeSelected);
    return $http.get('/loginEmployees', {
            params: {
                formData: formData,
                employeeSelected: employeeSelected
            }
        })
      .then(function(data){
        console.log('good is ', data);
        return data;
      }).catch(function(error) {
        console.log('bad is ', error);
          return error
      })
  };
  this.addEmployee = function(newEmployee){
    return $http.post('/addEmployee', {newEmployee: newEmployee})
    .then(function(data){
      console.log('data returned from employee post req ', data);
      return data;
    }).catch(function(error){ return error })
  };

}]);
