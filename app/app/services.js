var myApp = angular.module('myApp');


myApp.service('FormService', function($http) {
    this.getNDAForms = function() {
        return $http.get('/getNDAForms').then(function(data) {
            console.log('data is ', data);
            return data.data;
        })
    };
    this.getContactForms = function() {
        return $http.get('/getContactForms').then(function(data) {
            console.log('data is ', data);
            return data.data;
        })
    };
    this.getHRContactForms = function() {
        return $http.get('/getHRContactForms').then(function(data) {
            console.log('data is ', data);
            return data.data;
        })
    };
    this.getNewsletterForms = function() {
        return $http.get('/getNewsletterForms').then(function(data) {
            console.log('data is ', data);
            return data.data;
        })
    };
    this.deleteForm = function(formType, formObj) {
        return $http.delete('/deleteForm/' + formObj._id, {
            params: {
                formType: formType
            }
        }).then(function(data) {
            return data;
        })
    }
    this.sendMail = function(formType, formObj) {
      return $http.post('/sendmail', formObj)
          .then(function(res) {
              $scope.serverMessage = 'Your comment was submitted successfully and emailed to the relevant staff';
              $scope.loading = false;
              $scope.contactPerson = null;
          }).catch(function(err) {
              $scope.serverMessage = 'There was an error submitting your comment.';
              $scope.loading = false;
              $scope.contactPerson = null;
          });
    }
});


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
  this.getEmployees = function(){
    return $http.get('/getEmployees').then(function(data){
      return data;
    })
  };
  this.updateEmployee = function(employee){
    return $http.put('/updateEmployee', {employee: employee}).then(function(data){
      return data;
    })
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
  this.loginEmployees = function(formData, employeeSelected){
    console.log('inside login employees' , employeeSelected);
    return $http.get('/loginEmployees', {
            params: {
                formData: formData,
                employeeSelected: employeeSelected
            }
        })
      .then(function(data){
        return data;
      }).catch(function(error) {
          return error
      })
  };
  this.addEmployee = function(newEmployee){
    return $http.post('/addEmployee', {newEmployee: newEmployee}).then(function(data){
      console.log('data returned from employee post req ', data);
      return data;
    })
  }
});




myApp.service('FileUploadService', ['$http', function ($http) {
   this.uploadFileToUrl = function(file, uploadUrl){
      var fd = new FormData();
      fd.append('file', file);
   
      $http.post(uploadUrl, fd, {
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
      })
      .success(function(){
      })
      .error(function(){
      });
   };
   this.uploadFileToDB = function(file){
      var fd = new FormData();
      console.log('file is ', file);
      fd.append('file', file);
      console.log('fd about to be sent is ', fd);
   
      // $http.post('/uploadFile', {fileObj: fd})
      $http.post('/uploadFile', file)
      .then(function(data){
        console.log('succesfully uploaded file ', data);
      })
      .catch(function(err){
        console.log('error uploading file ', err);
      });
   }
}]);