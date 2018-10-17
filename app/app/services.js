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
    this.login = function(formData, isStaff) {
        return $http.get('/getAdmin', {
                params: {
                    formData: formData,
                    isStaff: isStaff
                }
            })
            .then(function(data) {
                console.log('response in service is ', data);
                return data;
            }).catch(function(error) {
                console.log('service, unable to login', error);
            })
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
    console.log("inside update employee ", employee);
    return $http.put('/updateEmployee', {employee: employee}).then(function(data){
      // console.log('data returned update employee is ', data);
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