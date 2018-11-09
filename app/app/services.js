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
      var responseMsg = {
        loading: false,
        contactPerson: null
      };
      return $http.post('/sendmail', formObj)
          .then(function(res) {
              responseMsg.serverMessage = 'Your comment was submitted successfully and emailed to the relevant staff';
              return responseMsg;
          }).catch(function(err) {
              responseMsg.serverMessage = 'There was an error submitting your comment.';
              return responseMsg;
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
    }).catch(function(error){ return error })
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
  this.fetchImages = function(affiliateName){
    return $http.get('/fetchImages', {
      params: {
        affiliateName: affiliateName
      }
    })
    .then(function(data){
      console.log('data returned from fetch images frontend service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
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



myApp.service('LongVariablesService', ['$http', function ($http) {

  var assetsPath = "assets";
  var viewsPath = "../views";
  // var viewsPath = "../app/views";
  if (location.host === "localhost:8080") {
      console.log("localhost server, staging env");
      assetsPath = "app/assets";
      viewsPath = "../app/views";
  }

   this.errorMessages  = {
       required: "This field is required.",
       minlength: "This field needs to be at least 2 characters lon.g",
       maxlength: "This field needs to be at most 30 characters long.",
       phone: "Please match pattern [+91-036-78658 || 91-036-78658].",
       zip: "The zipcode should be be 5 digits long.",
       email: "The email should have the format: test@example.com.",
       emailConfirmation: "The email confirmation field should match the email field.",
       date: "The date should have the format: MM/DD/YYYY.",
       dob: "The date of birth should have the format: MM/DD/YYYY.",
       phone: "The phone number should have the format: 111-111-1111.",
       ssn: "The driver license number should have the format: 123-45-6789.",
       mismatchName: "Please match the name you entered above.",
       mismatchSignature: "Please match the signature you entered above.",
       mismatchDate: "Please match the date you entered above.",
       endTime: "The end time must be later than the start time."
   };
  this.states = [
    'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  this.itnSources = [
    'Family', 'Friend', 'Speaker', 'Doctor', 'Radio', 'Television', 'Flier', 'Book', 'Phone', 'Agency on Aging', 'Social Worker', 'Internet', 'Referred by Current Member'
  ];
  this.affiliateListArr = [
    'Lanier','Gateway','MontereyCounty','Orlando','Memphis','LehighValley','Bluegrass','SouthernDelaware','CentralCT','CentralOklahoma','Portland','NorthJersey','Suncoast'
  ];
  this.affiliateList = [
    {
      name: 'Lanier',
      gaViewCode: 89470158,
      email: 'info@itnlanier.org'
    },
    {
      name: 'Gateway',
      gaViewCode: 171669720,
      email: 'info@itngateway.org'
    },
    {
      name: 'MontereyCounty',
      gaViewCode: 52125007,
      email: 'info@itnmontereycounty.org'
    },
    {
      name: 'Orlando',
      gaViewCode: 8439088,
      email: 'info@itnorlando.org'
    },
    {
      name: 'Memphis',
      gaViewCode: 41748788,
      email: 'info@itnmemphis.org'
    },
    {
      name: 'LehighValley',
      gaViewCode: 75254537,
      email: 'info@itnlehighvalley.org'
    },
    {
      name: 'Bluegrass',
      gaViewCode: 8437134,
      email: 'info@itnbluegrass.org'
    },
    {
      name: 'SouthernDelaware',
      gaViewCode: 96015351,
      email: 'info@itnsoutherndelaware.org'
    },
    {
      name: 'CentralCT',
      gaViewCode: 8437187,
      email: 'info@itncentralct.org'
    },
    {
      name: 'CentralOklahoma',
      gaViewCode: 71615872,
      email: 'info@itncentraloklahoma.org'
    },
    {
      name: 'Portland',
      gaViewCode: 8439116,
      email: 'info@itnportland.org'
    },
    {
      name: 'NorthJersey',
      gaViewCode: 60671208,
      email: 'info@itnnorthjersey.org'
    },
    {
      name: 'Suncoast',
      gaViewCode: 171748983,
      email: 'info@itnsuncoast.org'
    }
  ];
  this.listOfPrograms = [
    {
      name: 'America',
      gaViewCode: 0000000,
      email: 'info@itnamerica.org'
      // email: 'sguergenenov@itnamerica.org'
    },
    {
      name: 'RidesInSight',
      gaViewCode: 0000000,
      email: 'mail@ridesinsight.org;Maria.madden@itnamerica.org;Macy.kelley@itnamerica.org;Rachel.alexander@itnamerica.org'
    }
  ];
  this.listOfProgramsObj = {
    'itnAmerica': {
      name: 'America',
      gaViewCode: 0000000,
      email: 'info@itnamerica.org'
    },
    'ridesInSight': {
      name: 'RidesInSight',
      gaViewCode: 0000000,
      email: 'mail@ridesinsight.org;Maria.madden@itnamerica.org;Macy.kelley@itnamerica.org;Rachel.alexander@itnamerica.org'
    }
  };
  this.formCount = {
      member: 0,
      volunteer: 0,
      nonrider: 0,
      contact: 0,
      newsletter: 0
  };
  this.formData = {
      requestDriverRecord: {},
      requestCriminalRecord: {},
      vehicleDescription: {},
      changeOfStatus: {},
      drivingExperience: {},
      references: {},
      firstReference: {},
      secondReference: {},
      thirdReference: {},
      firstEmergencyContact: {},
      secondEmergencyContact: {},
      customerInfo: {},
      drivingInfo: {},
      agreement: {}
  };
  this.itnAffiliate = {
    name: '',
    gaViewCode: ''
  };
  this.listOfUrls = [{
          name: 'Home',
          state: 'home',
          url: viewsPath + '/home.html'
      },
      {
          name: 'What We Do',
          state: 'what-we-do',
          url: viewsPath + '/what-we-do.html'
      },
      {
          name: 'Our Organization',
          state: 'organization',
          url: viewsPath + '/organization.html'
      },
      {
          name: 'Faces of our Members',
          state: 'faces',
          url: viewsPath + '/faces.html'
      },
      {
          name: 'FAQ',
          state: 'faq',
          url: viewsPath + '/faq.html'
      },
      {
          name: 'News',
          state: 'news',
          url: viewsPath + '/news.html'
      },
      {
          name: 'Contact Us',
          state: 'contact',
          url: viewsPath + '/contact.html'
      },
      {
          name: 'Become a Member',
          state: 'become-member',
          url: viewsPath + '/become-member.html'
      },
      {
          name: 'Online Membership Application',
          state: 'member-app',
          url: viewsPath + '/member-app.html'
      },
      {
          name: 'Volunteer To Drive',
          state: 'volunteer-to-drive',
          url: viewsPath + '/volunteer-to-drive.html'
      },
      {
          name: 'Online Volunteer Application',
          state: 'volunteer-app',
          url: viewsPath + '/volunteer-app.html'
      },
      {
          name: 'Family Involvement',
          state: 'family',
          url: viewsPath + '/family.html'
      },
      {
          name: 'Member Programs',
          state: 'member-programs',
          url: viewsPath + '/member-programs.html'
      },
      {
          name: 'Pay Online',
          state: 'pay-online',
          url: viewsPath + '/pay-online.html'
      },
      {
          name: 'Donate',
          state: 'donate',
          url: viewsPath + '/donate.html'
      },
      {
          name: 'Corporate Partnership',
          state: 'corporate',
          url: viewsPath + '/corporate.html'
      },
      {
          name: 'ITN Affiliates',
          state: 'affiliates',
          url: viewsPath + '/affiliates.html'
      },
      {
          name: 'ITNAmerica',
          state: 'itnamerica',
          url: viewsPath + '/itnamerica.html'
      },
      {
          name: 'Rides in Sight',
          state: 'rides-in-sight',
          url: viewsPath + '/rides-in-sight.html'
      },
      {
          name: 'Miscellaneous',
          state: 'other',
          url: viewsPath + '/other.html'
      },
      {
          name: 'ITN Operations',
          state: 'itn-operations',
          url: viewsPath + '/itn-operations.html'
      }
  ];

}]);
