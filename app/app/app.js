var myApp = angular.module('myApp', ['ui.router', 'ngAnimate', 'angularUtils.directives.dirPagination']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    console.log('inside of config block');
    var viewsPath = "views/";
    if (location.host === "localhost:8080") {
        viewsPath = "app/views/";
    };

    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: viewsPath + 'home.html'
        })
        .state('contact', {
            url: '/contact',
            templateUrl: viewsPath + 'contact.html'
        })
        .state('what-we-do', {
            url: '/what-we-do',
            templateUrl: viewsPath + 'what-we-do.html',
            params: {
              anchor: null
            }
        })
        .state('services-map', {
            url: '/services-map',
            templateUrl: viewsPath + 'services-map.html'
        })
        .state('keyword-pages', {
            url: '/keyword-pages',
            templateUrl: viewsPath + 'keyword-pages.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: viewsPath + 'login.html'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: viewsPath + 'dashboard.html'
        })
        .state('view-form', {
            url: '/view-form',
            templateUrl: viewsPath + 'view-form.html',
            params: {
                formObj: null,
                formType: null
            }
        })
        .state('backup-pdf', {
            url: '/backup-pdf',
            templateUrl: viewsPath + 'backup-pdf.html'
        })
        .state('wildcard', {
            url: '/*',
            templateUrl: viewsPath + 'home.html'
        })
        .state('draft', {
            url: '/draft',
            templateUrl: viewsPath + 'draft.html'
        })
        .state('find-your-itn', {
            url: '/find-your-itn',
            templateUrl: viewsPath + 'find-your-itn.html'
        })
        .state('ways-to-give', {
            url: '/ways-to-give',
            templateUrl: viewsPath + 'ways-to-give.html'
        })
        .state('million-rides-campaign-photo-album', {
            url: '/million-rides-campaign-photo-album',
            templateUrl: viewsPath + 'million-rides-campaign-photo-album.html'
        })
        .state('annual-report-2017', {
            url: '/annual-report-2017',
            templateUrl: viewsPath + 'annual-report-2017.html'
        })
        .state('about', {
            url: '/about',
            templateUrl: viewsPath + 'about.html',
            params: {
              anchor: null
            }
        })
        .state('portal', {
            url: '/portal',
            templateUrl: viewsPath + 'portal.html'
        })
        .state('login-portal', {
            url: '/login-portal',
            templateUrl: viewsPath + 'login-portal.html'
        })
        .state('itnamerica', {
            url: '/itnamerica',
            templateUrl: viewsPath + 'itnamerica.html'
        })
        .state('rides-in-sight', {
            url: '/rides-in-sight',
            templateUrl: viewsPath + 'rides-in-sight.html'
        })
        .state('itn-services', {
            url: '/itn-services',
            templateUrl: viewsPath + 'itn-services.html'
        })
        .state('other', {
            url: '/other',
            templateUrl: viewsPath + 'other.html'
        })
        .state('affiliates', {
            url: '/affiliates/:affiliateName',
            templateUrl: viewsPath + 'affiliates.html',
            params : {
              affiliateName: 'none'
            }
        })
        .state('nda', {
            url: '/nda2018xyz',
            templateUrl: viewsPath + 'nda.html'
        })
        .state('rides', {
            url: '/rides',
            templateUrl: viewsPath + 'rides.html'
        })

    // default fall back route
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true).hashPrefix('');

})



myApp.run(['$rootScope', '$location', '$window', '$state', '$stateParams',
    function($rootScope, $location, $window, $state, $stateParams) {
        $rootScope.$on('$routeChangeSuccess',
            function(event) {
                if (!$window.ga) {
                    return;
                }
                $window.ga('send', 'pageview', {
                    page: $location.path()
                });
            });
    }
]);

myApp.controller('MainController', ['$scope', '$transitions', '$http', '$anchorScroll', '$location', '$stateParams', '$timeout', '$state', '$rootScope', '$window', 'FormService', '$sce', 'RidesDataService', function($scope, $transitions, $http, $anchorScroll, $location, $stateParams, $timeout, $state, $rootScope, $window, FormService, $sce, RidesDataService) {
    console.log('inside main controller');

    $scope.assetsPath = "assets";
    $scope.viewsPath = "../views";

    if (location.host === "localhost:8080") {
        console.log("localhost server, staging env");
        $scope.assetsPath = "app/assets";
        $scope.viewsPath = "../app/views";
    };

    $scope.affiliate = "America";
    $scope.zoomLevel = 1;
    $scope.tab = 1;
    $scope.loading = false;
    $scope.minlength = 2;
    $scope.maxlength = 50;
    $scope.maxMsgLength = 2000;
    $scope.ssnPattern = new RegExp(/^\d{3}-?\d{2}-?\d{4}$/);
    $scope.zipPattern = new RegExp(/^\d{5}$/);
    $scope.emailPattern = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
    $scope.datePattern = new RegExp(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    $scope.dobPattern = new RegExp(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    $scope.phonePattern = new RegExp(/^\d{3}[- ]?\d{3}[- ]?\d{4}$/);
    $scope.errorMessages = {
        required: "This field is required",
        minlength: "This field needs to be at least 2 characters long",
        maxlength: "This field needs to be at most 30 characters long",
        phone: "Please match pattern [+91-036-78658 || 91-036-78658]",
        zip: "The zipcode should be be 5 digits long",
        email: "The email should have the format: test@example.com",
        emailConfirmation: "The email confirmation field should match the email field",
        date: "The date should have the format: MM/DD/YYYY",
        dob: "The date of birth should have the format: MM/DD/YYYY",
        phone: "The phone number should have the format: 111-111-1111",
        ssn: "The driver license number should have the format: 123-45-6789",
        mismatchName: "Please match the name you entered above",
        mismatchSignature: "Please match the signature you entered above",
        mismatchDate: "Please match the date you entered above"
    };
    $scope.dataPDF = null;
    $scope.formSubject = 'New application received';
    $scope.states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $scope.itnSources = ['Family', 'Friend', 'Speaker', 'Doctor', 'Radio', 'Television', 'Flier', 'Book', 'Phone', 'Agency on Aging', 'Social Worker', 'Internet', 'Referred by Current Member'];
    $scope.ratings = ['None', 1, 2, 3, 4, 5, 6];
    $scope.keyword = '';
    $scope.keywordPages = '';
    $scope.urlsWithKeyword = [];
    $scope.affiliateList = ['Lanier','Gateway','MontereyCounty','Orlando','Memphis','LehighValley','Bluegrass','SouthernDelaware','CentralCT','CentralOklahoma','Portland','NorthJersey','Suncoast'];
    $scope.listOfUrls = [{
            name: 'Home',
            state: 'home',
            url: $scope.viewsPath + '/home.html'
        },
        {
            name: 'What We Do',
            state: 'what-we-do',
            url: $scope.viewsPath + '/what-we-do.html'
        },
        {
            name: 'Our Organization',
            state: 'organization',
            url: $scope.viewsPath + '/organization.html'
        },
        {
            name: 'Faces of our Members',
            state: 'faces',
            url: $scope.viewsPath + '/faces.html'
        },
        {
            name: 'FAQ',
            state: 'faq',
            url: $scope.viewsPath + '/faq.html'
        },
        {
            name: 'News',
            state: 'news',
            url: $scope.viewsPath + '/news.html'
        },
        {
            name: 'Contact Us',
            state: 'contact',
            url: $scope.viewsPath + '/contact.html'
        },
        {
            name: 'Become a Member',
            state: 'become-member',
            url: $scope.viewsPath + '/become-member.html'
        },
        {
            name: 'Online Membership Application',
            state: 'member-app',
            url: $scope.viewsPath + '/member-app.html'
        },
        {
            name: 'Volunteer To Drive',
            state: 'volunteer-to-drive',
            url: $scope.viewsPath + '/volunteer-to-drive.html'
        },
        {
            name: 'Online Volunteer Application',
            state: 'volunteer-app',
            url: $scope.viewsPath + '/volunteer-app.html'
        },
        {
            name: 'Family Involvement',
            state: 'family',
            url: $scope.viewsPath + '/family.html'
        },
        {
            name: 'Member Programs',
            state: 'member-programs',
            url: $scope.viewsPath + '/member-programs.html'
        },
        {
            name: 'Pay Online',
            state: 'pay-online',
            url: $scope.viewsPath + '/pay-online.html'
        },
        {
            name: 'Donate',
            state: 'donate',
            url: $scope.viewsPath + '/donate.html'
        },
        {
            name: 'Corporate Partnership',
            state: 'corporate',
            url: $scope.viewsPath + '/corporate.html'
        },
        {
            name: 'ITN Affiliates',
            state: 'affiliates',
            url: $scope.viewsPath + '/affiliates.html'
        },
        {
            name: 'ITNAmerica',
            state: 'itnamerica',
            url: $scope.viewsPath + '/itnamerica.html'
        },
        {
            name: 'Rides in Sight',
            state: 'rides-in-sight',
            url: $scope.viewsPath + '/rides-in-sight.html'
        },
        {
            name: 'Miscellaneous',
            state: 'other',
            url: $scope.viewsPath + '/other.html'
        },
        {
            name: 'ITN Services',
            state: 'itn-services',
            url: $scope.viewsPath + '/itn-services.html'
        }
        
    ];
    $scope.formType = '';
    $scope.ndaFormData = [];
    $scope.contactFormData = [];
    $scope.newsletterFormData = [];
    $scope.formObj = {};
    $scope.formObjType = {};
    $scope.session = null;
    console.log('session is ', $scope.session);
    $scope.formCount = {
        member: 0,
        volunteer: 0,
        nonrider: 0,
        contact: 0,
        newsletter: 0
    };
    $scope.pdfUrl = '';
    $scope.formData = {
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
    var originalFormData = $scope.formData;
    $scope.showForm = false;
    $scope.blogEntries = [];
    $scope.showPortal = true;
    $scope.affiliateName = '';

    // alternative to ng-init, functions that trigger on state/page changes.
    $transitions.onSuccess({}, function(transition) {
        if (transition.from().name !== 'dashboard') {
            $scope.resetFormData();
        }
        if (transition.from().name === 'keyword-pages') {
            angular.element(document).ready(function() {
                $scope.searchKeyword();
                $scope.scrollToTop();
                $scope.urlsWithKeyword = [];
            });
        }
        if (!$stateParams.anchor) {
            $scope.scrollToTop();
        }
    });

    //use this function instead of ng-href as ng-href is not compatible with html5mode
    $scope.redirectToURL = function(url) {
        $window.open(url, '_blank');
    }

    $scope.scrollTo = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

    $scope.catchAnchor = function() {
        console.log('stateparam is ', $stateParams, $stateParams.anchor);
        $scope.scrollTo($stateParams.anchor);
    }

    $scope.resetFormData = function() {
        $scope.formData = originalFormData;
        $scope.serverMessage = "";
        $scope.loading = false;
        $scope.tab = 1;
    }

    $scope.nextTabMemberApp = function(prev) {
        $(window).scrollTop(50);
        if (prev) {
            $scope.tab -= 1;
        } else {
            $scope.tab += 1;
        }
    }

    $scope.scrollToTop = function() {
        $(window).scrollTop(50);
    }

    $scope.readMore = function(divId) {
        var content = document.getElementById(divId);
        if (content.style.display === "none") {
            content.style.display = "block";
            content.nextElementSibling.nextElementSibling.nextElementSibling.innerText = "READ LESS";
        } else {
            content.style.display = "none";
            content.nextElementSibling.nextElementSibling.nextElementSibling.innerText = "READ MORE";
        }
    }

    $scope.zoom = function(direction) {
        if (direction == 'more') {
            $scope.zoomLevel += 1;
            var content = document.getElementByTagName(body);
            content.style.fontSize = $scope.zoomLevel + 'rem';
        } else if (direction == 'less') {
            $scope.zoomLevel -= 1;
        }
    }

    $scope.searchKeyword = function() {
        var myHilitor = new Hilitor("main-content");
        myHilitor.apply($scope.keyword);
    }

    $scope.searchKeywordInApp = function() {
        var x;
        for (x = 0; x < $scope.listOfUrls.length; x++) {
            apiCallToUrls(x)
        }
        $state.go('keyword-pages');
    }

    function apiCallToUrls(x) {
        $http.get($scope.listOfUrls[x].url)
            .then(function(data) {
                var matchWord = findWord($scope.keyword, data.data);
                if (matchWord) {
                    $scope.urlsWithKeyword.push($scope.listOfUrls[x])
                }
            })
    }

    function findWord(keyword, str) {
        var text = str.split(' ');
        for (var word = 0; word < text.length; word++) {
            if (text[word].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                return keyword
            }
        }
        return false;
    }

    $scope.animateValue = function(id, start, end, duration) {
        var range = end - start;
        var current = start;
        var increment = end > start ? 50 : -50;
        var stepTime = Math.abs(Math.floor(duration / range));
        var obj = document.getElementById(id);
        var timer = setInterval(function() {
            current += increment;
            obj.innerHTML = current;
            if (current >= end) {
                clearInterval(timer);
                obj.innerHTML = end;
            }
        }, stepTime);
    };

    var zoomLevel = 1;
    $scope.resizeText = function(multiplier) {
        if (multiplier) {
            zoomLevel += multiplier;
            $('#main-content-inner').css('transform', 'scale(' + zoomLevel + ')');
        } else {
            $('#main-content-inner').css('transform', 'scale(1)');
        }
    };

    $scope.searchTable = function(tableId) {
        var input, filter, table, tr, td, i;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        table = document.getElementById(tableId);
        tr = table.getElementsByTagName("tr");

        for (row = 0; row < tr.length; row++) {
            tdd = tr[row].getElementsByTagName("td");
            for (col = 0; col < tdd.length - 1; col++) {
                td = tr[row].getElementsByTagName("td")[col];
                if (td) {
                    if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        return tr[row].style.display = "table-row";
                    } else {
                        tr[row].style.display = "none";
                    }
                }
            }
        }
    };

    $scope.resetTable = function(tableId) {
        var input, filter, table, tr, td, i;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        table = document.getElementById(tableId);
        tr = table.getElementsByTagName("tr");

        for (row = 0; row < tr.length; row++) {
            tr[row].style.display = "table-row";
        }
    };

    $scope.base64ToPDF = function(formType, formObj) {
        console.log('inside base64 func');
        console.log('form type is ', formType, 'form obj is ', formObj);
        if (formObj && formObj.pdf) {
            var base64 = formObj.pdf;
            base64 = base64.replace("data:application/pdf;base64,", "");
            var binaryImg = window.atob(base64);
            var length = binaryImg.length;
            var arrayBuffer = new ArrayBuffer(length);
            var uintArray = new Uint8Array(arrayBuffer);

            for (var i = 0; i < length; i++) {
                uintArray[i] = binaryImg.charCodeAt(i);
            }
            var currentBlob = new Blob([uintArray], {
                type: 'application/pdf'
            });
            $scope.pdfUrl = URL.createObjectURL(currentBlob);
            // $("#output").append($("<a/>").attr({href: $scope.pdfUrl}).append("Download"));
            // $scope.redirectToURL($scope.pdfUrl);
            console.log('redirecting to pdf', formType, formObj);
            window.location.href = $scope.pdfUrl;
        } else {
            return $scope.pdfUrl = "This form does not contain a PDF";
        }

    };

    $scope.authenticate = function() {
        if ($scope.session) {
            $scope.getApps();
        }
    };

    $scope.getApps = function() {
        FormService.getNDAForms().then(function(data) {
            $scope.ndaFormData = data;
            $scope.formCount.nda = data.length
        });
        FormService.getContactForms().then(function(data) {
            $scope.contactFormData = data;
            $scope.formCount.contact = data.length
        });
        FormService.getNewsletterForms().then(function(data) {
            $scope.newsletterFormData = data;
            $scope.formCount.newsletter = data.length
        });
    };

    $scope.catchFormObj = function() {
        $scope.formObj = $stateParams.formObj;
        $scope.formObjType = $stateParams.formType;
        console.log('formobj is ', $scope.formObj);
    };

    $scope.askBeforeDelete = function(formType, formObj) {
        $scope.formData = formObj;
        $scope.formType = formType;
        $(document).ready(function() {
            $('#deleteAppModal').modal('show');
        })
    }

    $scope.deleteForm = function(formType, formObj) {
        console.log('inside deleteform, form type', formType, 'form obj', formObj);
        if (formType !== 'other') {
            $(document).ready(function() {
                $('#deleteAppModal').modal('hide');
            })
        }
        FormService.deleteForm(formType, formObj).then(function(data) {
            console.log('record successfully deleted ', data);
            $scope.getApps();
        })
    };

    $scope.sort = function(keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    $scope.login = function(isStaff) {
      var routeName;
      if (isStaff){
        routeName = 'portal';
      } else {
        routeName = 'dashboard';
      }
        FormService.login($scope.formData, isStaff).then(function(data) {
            console.log('response is ', data);
            if (data) {
                $scope.session = data;
                $state.go(routeName)
            } else {
                $scope.serverMessage = 'Incorrect login or password';
            }
        });
    };

    $scope.logout = function() {
        $window.location.reload();
    };

    $scope.prepopulate = function(currentModel, modelType) {
        if (modelType === 'date') {
            $scope.formData.requestDriverRecord.date = currentModel;
            $scope.formData.requestCriminalRecord.date = currentModel;
            $scope.formData.vehicleDescription.date = currentModel;
            $scope.formData.changeOfStatus.date = currentModel;
        } else if (modelType === 'signature') {
            $scope.formData.requestDriverRecord.signature = currentModel;
            $scope.formData.requestCriminalRecord.signature = currentModel;
            $scope.formData.vehicleDescription.signature = currentModel;
            $scope.formData.changeOfStatus.signature = currentModel;
        } else if (modelType === 'name') {
            $scope.formData.requestDriverRecord.name = currentModel;
            $scope.formData.requestCriminalRecord.name = currentModel;
        } else if (modelType === 'dob') {
            $scope.formData.requestCriminalRecord.dob = currentModel;
        } else if (modelType === 'maiden') {
            $scope.formData.requestCriminalRecord.maidenName = currentModel;
        }
    };

    $scope.checkRequiredFields = function(formType) {
        var requiredFieldsArray;
        if (formType === 'volunteer') {
            requiredFieldsArray = {
                'Volunteer Name': $scope.formData.riderName,
                'Gender': $scope.formData.riderGender,
                'Street': $scope.formData.streetAddress,
                'City': $scope.formData.city,
                'State': $scope.formData.state,
                'Zip': $scope.formData.zip,
                'Preferred phone': $scope.formData.preferredPhone,
                'First Emergency Contact name': $scope.formData.firstEmergencyContact.name,
                'First Emergency Contact relationship': $scope.formData.firstEmergencyContact.relationship,
                'First Emergency Contact street': $scope.formData.firstEmergencyContact.street,
                'First Emergency Contact city': $scope.formData.firstEmergencyContact.city,
                'First Emergency Contact state': $scope.formData.firstEmergencyContact.state,
                'First Emergency Contact zip': $scope.formData.firstEmergencyContact.zip,
                'Has adequate vision': $scope.formData.drivingExperience.adequateVision,
                'Current employment status': $scope.formData.currentEmployment,
                'Has past criminal conviction': $scope.formData.criminalConviction,
                'Has been convicted of moving violation in past 3 years': $scope.formData.movingViolation,
                'First reference name': $scope.formData.firstReference.name,
                'First reference phone or mailing address': $scope.formData.firstReference.phoneOrMailing,
                'How are you acquainted with your first reference': $scope.formData.firstReference.acquainted,
                'Second reference name': $scope.formData.secondReference.name,
                'Second reference phone or mailing address': $scope.formData.secondReference.phoneOrMailing,
                'How are you acquainted with your second reference': $scope.formData.secondReference.acquainted,
                'Third reference name': $scope.formData.thirdReference.name,
                'Third reference phone or mailing address': $scope.formData.thirdReference.phoneOrMailing,
                'How are you acquainted with your third reference': $scope.formData.thirdReference.acquainted,
                'Agree to check for references - signature': $scope.formData.references.signature,
                'Agree to check for references - date': $scope.formData.references.date,
                'Member of organization or union': $scope.formData.memberOfProfessionalOrgOrUnion,
                'Served in military': $scope.formData.servedInMilitary,
                'Authorization to Request Driver Record - name': $scope.formData.requestDriverRecord.name,
                'Authorization to Request Driver Record - date of birth': $scope.formData.requestDriverRecord.dob,
                'Authorization to Request Driver Record - license number': $scope.formData.requestDriverRecord.licenseNumber,
                'Authorization to Request Driver Record - from state': $scope.formData.requestDriverRecord.authorize,
                'Authorization to Request Driver Record - signature': $scope.formData.requestDriverRecord.signature,
                'Authorization to Request Driver Record - date': $scope.formData.requestDriverRecord.date,
                'Authorization to Request Driver Record - checkbox authorization': $scope.formData.requestDriverRecord.agree,
                'Authorization to Request Criminal Record - name': $scope.formData.requestCriminalRecord.name,
                'Authorization to Request Criminal Record - date of birth': $scope.formData.requestCriminalRecord.dob,
                'Authorization to Request Criminal Record - from state': $scope.formData.requestCriminalRecord.authorize,
                'Authorization to Request Criminal Record - signature': $scope.formData.requestCriminalRecord.signature,
                'Authorization to Request Criminal Record - date': $scope.formData.requestCriminalRecord.date,
                'Authorization to Request Driver Record - checkbox authorization': $scope.formData.requestCriminalRecord.agree,
                'Do you own the vehicle': $scope.formData.vehicleDescription.vehicleOwner,
                'Vehicle make': $scope.formData.vehicleDescription.make,
                'Vehicle model': $scope.formData.vehicleDescription.model,
                'Vehicle year': $scope.formData.vehicleDescription.year,
                'Vehicle registration plate': $scope.formData.vehicleDescription.registrationPlate,
                'Number of doors on vehicle': $scope.formData.vehicleDescription.numberOfDoors,
                'Vehicle registration expiration': $scope.formData.vehicleDescription.registrationExpiration,
                'Vehicle insurance company': $scope.formData.vehicleDescription.insuranceCompany,
                'Vehicle agent': $scope.formData.vehicleDescription.agent,
                'Vehicle agent email': $scope.formData.vehicleDescription.agentEmailAddress,
                'Can your vehicle transport a walker': $scope.formData.vehicleDescription.canTransportWalker,
                'Can your vehicle transport a wheelchair': $scope.formData.vehicleDescription.canTransportWheelChair,
                'Vehicle general condition': $scope.formData.vehicleDescription.generalCondition,
                'Vehicle passenger capacity': $scope.formData.vehicleDescription.passengerCapacity,
                'Vehicle can transport pets ': $scope.formData.vehicleDescription.canTransportPets,
                'Vehicle has large trunk': $scope.formData.vehicleDescription.hasLargeTrunk,
                'Vehicle has covered bed': $scope.formData.vehicleDescription.hasCoveredTruckBed,
                'Is it your only vehicle': $scope.formData.vehicleDescription.onlyVehicle,
                'Vehicle description - signature': $scope.formData.vehicleDescription.signature,
                'Vehicle description - date': $scope.formData.vehicleDescription.date,
                'Vehicle description - checkbox authorization': $scope.formData.vehicleDescription.authorize,
                'Change of Status - signature': $scope.formData.changeOfStatus.signature,
                'Change of Status - date': $scope.formData.changeOfStatus.date,
                'Checkbox authorization to contact references': $scope.formData.agree
            }
        } else if (formType === 'membership') {
            requiredFieldsArray = {
                'Rider Name': $scope.formData.riderName,
                'Membership Type': $scope.formData.membership,
                'Street': $scope.formData.streetAddress,
                'City': $scope.formData.city,
                'State': $scope.formData.state,
                'Zip': $scope.formData.zip,
                'Years at Address': $scope.formData.yearsAtAddress,
                'It is a Mailing address': $scope.formData.isMailingAddress,
                'It is a Billing address': $scope.formData.isBillingAddress,
                'It is a year-round residence': $scope.formData.isYearRoundResidence,
                'Primary phone': $scope.formData.primaryPhone,
                // 'First emergency contact (full)': $scope.formData.firstEmergencyContact, 
                'First emergency contact name': $scope.formData.firstEmergencyContact.name,
                'First emergency contact relationship': $scope.formData.firstEmergencyContact.relationship,
                'First emergency contact street': $scope.formData.firstEmergencyContact.street,
                'First emergency contact city': $scope.formData.firstEmergencyContact.city,
                'First emergency contact state': $scope.formData.firstEmergencyContact.state,
                'First emergency contact zip': $scope.formData.firstEmergencyContact.zip,
                'First emergency contact best phone number': $scope.formData.firstEmergencyContact.bestPhone,
                // 'Second emergency contact (full)': $scope.formData.secondEmergencyContact, 
                'Second emergency contact name': $scope.formData.secondEmergencyContact.name,
                'Second emergency contact relationship': $scope.formData.secondEmergencyContact.relationship,
                'Second emergency contact street': $scope.formData.secondEmergencyContact.street,
                'Second emergency contact city': $scope.formData.secondEmergencyContact.city,
                'Second emergency contact state': $scope.formData.secondEmergencyContact.state,
                'Second emergency contact zip': $scope.formData.secondEmergencyContact.zip,
                'Second emergency contact best phone number': $scope.formData.secondEmergencyContact.bestPhone,
                'How did you hear about ITN?': $scope.formData.heardAboutItn,
                'Send info to friends or relatives?': $scope.formData.sendInfoToRelativeFriendBiz,
                // 'Customer info (full)': $scope.formData.customerInfo , 
                'Date of Birth': $scope.formData.customerInfo.dateOfBirth,
                'Gender': $scope.formData.customerInfo.gender,
                'Marital Status': $scope.formData.customerInfo.maritalStatus,
                'Living Arrangement': $scope.formData.customerInfo.livingArrangement,
                'Dwelling Arrangement': $scope.formData.customerInfo.dwellingArrangement,
                'Languages Spoken': $scope.formData.customerInfo.languages,
                'Current transportation means': $scope.formData.customerInfo.currentTransportationMeans,
                'Member of Organization or Union': $scope.formData.memberOfProfessionalOrgOrUnion,
                'Served in Military': $scope.formData.customerInfo.servedInMilitary,
                'Special Needs': $scope.formData.customerInfo.specialNeeds,
                // 'Driving Info (full)': $scope.formData.drivingInfo, 
                'Has license': $scope.formData.drivingInfo.hasLicense,
                'Owns a vehicle': $scope.formData.drivingInfo.ownVehicle,
                'Took Driver Improvement classes': $scope.formData.drivingInfo.driverImprovementClasses,
                'Driven in last 10 years': $scope.formData.drivingInfo.drivenLast10Years,
                'Currently drives': $scope.formData.drivingInfo.currentlyDrive,
                'Reduce trip cost by sharing ride': $scope.formData.drivingInfo.reduceCostWithRideshare,
                // 'Agreement (full)': $scope.formData.agreement, 
                'Agreement signature': $scope.formData.agreement.signature1,
                'Agreement date': $scope.formData.agreement.date1,
                'Informed consent signature': $scope.formData.agree1,
                'Informed consent date': $scope.formData.agreement.signature2,
            }
        } else {
            return true;
        }

        for (var field in requiredFieldsArray) {
            console.log('field is ', field);
            if (requiredFieldsArray.hasOwnProperty(field) && !requiredFieldsArray[field]) {
                console.log('You must fill this required field: ', field);
                $scope.serverMessage = 'Please complete all required fields. Field missing is:  " ' + field + '"';
                return false;
            }
        }
        return true;
    };


    $scope.validateContactInputs = function() {
        return ($scope.formData.name && $scope.formData.email && $scope.formData.phone && $scope.formData.subject && $scope.formData.messageBody) ? true : false;
    };


    $scope.removeIfEmpty = function(formField) {
        // console.log('form field is ', formField, 'type is ', typeof(formField), 'length is ', formField.length)
        if ((formField.constructor === Object) && (Object.keys(formField).length < 1)) {
            console.log('false1');
            return false;
        } else if ((formField.constructor === String) && (formField.length < 1)) {
            console.log('false2');
            return false;
        }  else if ((formField.constructor === Boolean) && formField) {
            console.log('yes');
            return true;
        } else {
            return true;
        }
    };

    //for contact and newsletter forms
    $scope.submitForm = function(formType) {
        var contactInputsValid = $scope.validateContactInputs();
        console.log('valid contact is ', contactInputsValid);
        var formObj = {};
        $scope.formType = formType;
        $scope.loading = true;
        if (formType === 'contact' && contactInputsValid) {
            console.log('submitting valid contact form');
            formObj = {
                from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                to: 'itnamerica2018@gmail.com',
                subject: "ITNAmerica Contact Form Submitted",
                text: $scope.formData,
                html: "<p><strong>Name:</strong>: " + $scope.formData.name + "</p>\n" +
                    "<p><strong>Email:</strong>: " + $scope.formData.email + "</p>\n " +
                    "<p><strong>Mobile:</strong>: " + $scope.formData.phone + "</p>\n " +
                    "<p><strong>Subject:</strong>: " + $scope.formData.subject + "</p>\n " +
                    "<p><strong>Message Body:</strong>: " + $scope.formData.messageBody + "</p>\n ",
                formType: $scope.formType
            }
        } else if (formType === 'newsletter' && $scope.formData.email) {
            console.log('submitting valid newsletter form');
            formObj = {
                from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                to: 'itnamerica2018@gmail.com',
                subject: "ITNAmerica Request to be added to Newsletter",
                text: $scope.formData,
                html: "<p><strong>Email:</strong>: " + $scope.formData.email + "</p> ",
                formType: $scope.formType
            }
        } else {
            return $scope.serverMessage = "Please fill in all required fields before submitting."
        }
        $http.post('/sendmail', formObj)
            .then(function(res) {
                $scope.loading = false;
                $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
            }).catch(function(err) {
                $scope.loading = false;
                $scope.serverMessage = 'There was an error submitting your form. Please contact us by phone instead.';
            });
    };



    //for membership, volunteer and non-rider forms
    $scope.submitFormWithPDF = function(formType) {
        console.log('submitForm PDF, formData is ', $scope.formData);
        $scope.serverMessage = '';
        $scope.formType = formType;
        var volunteerRequiredComplete = $scope.checkRequiredFields(formType);
        console.log('volunteerRequiredComplete is ', volunteerRequiredComplete);
        if (!(Object.keys($scope.formData).length === 0 && $scope.formData.constructor === Object)) {
            $scope.loading = true;
            //check for validations
            if (!volunteerRequiredComplete) {
                $scope.loading = false;
                return $scope.serverMessage;
                // return $scope.serverMessage = 'Please complete all required fields.';
            }
            
            $scope.formSubject = 'ITNAmerica - New ' + formType + ' application received';
            if (formType === 'membership' || formType === 'volunteer') {
                $(document).ready(function() {
                    $('#pdfVersion').css('display', 'block');
                })
                $scope.generateMultiPagePDF();
            } else if (formType === 'nonrider' || formType === 'NDA') {
                $scope.generatePDF();
            }
        } else {
            $scope.loading = false;
            $scope.serverMessage = 'You cannot submit an empty form';
        }
    };


    $scope.generatePDF = function() {
        console.log('inside pdf');
        kendo.drawing.drawDOM($("#formConfirmation"))
            .then(function(group) {
                return kendo.drawing.exportPDF(group, {
                    paperSize: "auto",
                    margin: {
                        left: "1cm",
                        top: "1cm",
                        right: "1cm",
                        bottom: "1cm"
                    }
                });
            })
            .done(function(data) {
                console.log('data is ', data);
                var ndaForm = null;
                if ($scope.formType === 'NDA') {
                  $("#ndaForm input#name").replaceWith(function () {
                      return $("<span>"+ $scope.formData.name +"</span>");
                  });
                  $("#ndaForm input#itnAffiliate").replaceWith(function () {
                      return $("<span>"+ $scope.formData.itnAffiliate +"</span>");
                  });
                  ndaForm = $('#ndaForm').html();
                }
                $scope.dataPDF = data;
                $http.post('/sendmail', {
                    from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                    to: 'itnamerica2018@gmail.com',
                    subject: $scope.formSubject,
                    text: $scope.formData,
                    pdf: $scope.dataPDF,
                    html: ndaForm,
                    formType: $scope.formType
                }).then(function(res) {
                    $scope.loading = false;
                    $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
                }).catch(function(err) {
                    $scope.loading = false;
                    $scope.serverMessage = 'There was an error submitting your form. Please contact us, or consider submitting your form by paper instead.';
                });
            });
    }

    $scope.generateMultiPagePDF = function() {
        console.log('inside multipage');
        kendo.drawing.drawDOM($("#pdfVersion"), {
                paperSize: "A4",
                margin: {
                    left: "3cm",
                    top: "1cm",
                    right: "1cm",
                    bottom: "1cm"
                },
                template: $("#page-template").html()
            }).then(function(group) {
                return kendo.drawing.exportPDF(group);
            })
            .done(function(data) {
                console.log('data is ', data);
                $scope.dataPDF = data;
                $http.post('/sendmail', {
                    from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                    to: 'itnamerica2018@gmail.com',
                    subject: $scope.formSubject,
                    text: $scope.formData,
                    pdf: $scope.dataPDF,
                    formType: $scope.formType
                }).then(function(res) {
                    $scope.loading = false;
                    $scope.showForm = false;
                    $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
                }).catch(function(err) {
                    $scope.loading = false;
                    $scope.serverMessage = 'There was an error submitting your form. Please contact us, or consider submitting your form by paper instead.';
                });
            });
    };

    $scope.regenerateMultiPagePDF = function(formObj, formType) {
        console.log('inside renegerate pdf');
        $scope.formData = formObj;
        $scope.formType = formType;
        console.log("formdata is ", $scope.formData);
        $state.go('backup-pdf')
            .then(function() {
                console.log('begin kendo drawing');
                kendo.drawing.drawDOM($("#backupPdf"), {
                        paperSize: "A4",
                        margin: {
                            left: "3cm",
                            top: "1cm",
                            right: "1cm",
                            bottom: "1cm"
                        },
                        template: $("#page-template").html()
                    }).then(function(group) {
                        console.log('kendo complete, exporting pdf ', group);
                        return kendo.drawing.exportPDF(group);
                    }).catch(function(err) {
                        console.log('could not generate kendo, error is ', err);
                    })
                    .done(function(data) {
                        console.log('data is ', data);
                        // $scope.dataPDF = data;
                        $scope.base64ToPDF($scope.formType, $scope.formData);
                    });
            })
    };

    
    
    $scope.fetchRecentBlogURLs = function(){
      $http.get('/getBlogContent', { 
          params: { 
            blogURL: 'http://blog.itnamerica.org/'
          }
        }).then(function(response) {
        console.log('response is ', response);
        
        $scope.homepageBlogContent = response.data;
        $scope.blogURLs = [];
        var blogNumber = 3;
        var idx;
        
        if ($scope.homepageBlogContent.indexOf('<h1 class="entry-title"><a href="') !== -1){
          
          for (var num=0; num<blogNumber; num++){
            idx = $scope.homepageBlogContent.indexOf('<h1 class="entry-title"><a href="');
            var storeBlogURL = [];
            for (var i=33; i<$scope.homepageBlogContent.length; i++){
              if ($scope.homepageBlogContent[idx+i] === ' ' && $scope.homepageBlogContent[idx+i+1] === 'r' && $scope.homepageBlogContent[idx+i+2] === 'e' && $scope.homepageBlogContent[idx+i+3] === 'l' && $scope.homepageBlogContent[idx+i+4] === '='){
                break;
              }
              storeBlogURL.push($scope.homepageBlogContent[idx+i]);
            }
            storeBlogURL = storeBlogURL.slice(0, -1).join('').toString();
            $scope.blogURLs.push(storeBlogURL);
            
            $scope.homepageBlogContent =  $scope.homepageBlogContent.slice(idx+33);
            
          }
        }
        $scope.getContentForEachBlogURL();
        
      })
    };
    
    $scope.getContentForEachBlogURL = function(){
      // console.log('blogurls are ', $scope.blogURLs);
      for (var x = 0; x < $scope.blogURLs.length; x++) {
        $scope.getBlogContent($scope.blogURLs[x]);
      }
    }
    
    
    $scope.getBlogContent = function(url){
      $http.get('/getBlogContent', { 
          params: { 
            blogURL: url
          }
        }).then(function(response) {
          $scope.blogContent = response.data;
          // console.log('blog content is ', $scope.blogContent);
          //get title of post for thumnail
          if ($scope.blogContent.indexOf('<h1 class="entry-title"') !== -1){
            var idx = $scope.blogContent.indexOf('<h1 class="entry-title"');
            var store = [];
            for (var i=24; i<$scope.blogContent.length; i++){
              if ($scope.blogContent[idx+i] === '<'){
                break;
              }
              store.push($scope.blogContent[idx+i]);
            }
            store = store.join('').toString();
            //if title tag has other attr, strip them off
            $scope.entryTitle = store.substr(store.indexOf(">")+1,store.length)
            console.log('entry title is ', $scope.entryTitle);
          }
          //get img of post for thumnail
          if ($scope.blogContent.indexOf('<img class=') !== -1){
            var idx = $scope.blogContent.indexOf('<img class=');
            var store2 = [];
            for (var i=12; i<$scope.blogContent.length; i++){
              if ($scope.blogContent[idx+i] === 'a' && $scope.blogContent[idx+i+1] === 'l' && $scope.blogContent[idx+i+2] === 't' || $scope.blogContent[idx+i] === '>'){
                break;
              }
              store2.push($scope.blogContent[idx+i]);
            }
            $scope.entryImgURL = store2.join('').toString();
            $scope.entryImgURL = $scope.entryImgURL.match(/\bhttps?:\/\/\S+/gi);
            $scope.entryImgURL = $scope.entryImgURL.toString().slice(0,-1);
          }    
          $scope.blogEntries.push({
            title: $scope.entryTitle,
            imgURL: $scope.entryImgURL,
            blogURL: url
          });
        });
        
    };

    $scope.readMoreLess = function(){
      $('.icon-legend').click(function() {
          var content = $(this).html();
          if ($(content).hasClass("btn-lg")){
            var innerTxt = $(this).find(".btn-lg")[0].innerText
            if (innerTxt === 'Show more'){
              $(this).find(".btn-lg")[0].innerText = 'Show less';
            } else {
              $(this).find(".btn-lg")[0].innerText = 'Show more';
            }
          }
      })        
    };

    
    $scope.openAdditionalPage = function(pageName){
      var affiliateName;
      console.log('inside openadditionalpage ', pageName)
      $scope.itnamerica = $scope.ris = $scope.other = $scope.services = $scope.affiliates = $scope.social = $scope.events = $scope.learn = $scope.analytics = $scope.affiliateLanding = false;
      if (pageName && pageName === 'portal'){
        $state.go('portal');
      }
      else if (pageName) {
        $scope[pageName] = true;
        $scope.showPortal = false;
      } else {
        $scope.showPortal = true;
      }
    };
    
    $scope.bindParamToVar = function(pageName){
      if (pageName === 'affiliates') {
        $scope.affiliateName = $stateParams.affiliateName;
      }
    };
    
    $scope.getRidesData = function(){
        RidesDataService.getAllRides().then(function(data){
          console.log('rides data from func is ', data);
          $scope.ridesData = data.data;
        })
    };
    
    $scope.editRidesData = function(row){
      // $('.editValues').click(function () {
        $('#rides-edit-btn').parents('tr').find('td.editableColumns').each(function() {
          var html = $(this).html();
          var input = $('<input class="editableColumnsStyle" type="text" />');
          input.val(html);
          $(this).html(input);
        });
      // });
    };

}]);


myApp.directive('match', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                return $parse(attrs.match)(scope) === ctrl.$modelValue;
            }, function(currentValue) {
                ctrl.$setValidity('mismatch', currentValue);
            });
        }
    };
});

myApp.filter('inputSelected', function() {
    return function(formData) {
        var keyArr = [];
        var word = [];
        if (formData) {
            Object.keys(formData).forEach(function(key) {
                if (formData[key]) {
                    var keyCap = key.charAt(0).toUpperCase() + key.slice(1);
                    for (var char = 0; char < keyCap.length; char++) {
                        if (keyCap[char] == keyCap[char].toUpperCase()) {
                            var spacedLetter = ' ' + keyCap[char];
                            word.push(spacedLetter);
                        } else {
                            word.push(keyCap[char]);
                        }
                    }
                }
                keyArr.push(word.join(''))
                word = [];
            })
            return keyArr.toString();
        }
    }
});

myApp.filter('filterLongObj', function($filter) {
    return function(formObj) {
        if (Object.keys(formObj).length > 1 && formObj.constructor === Object) {
            var pretty = JSON.stringify(formObj).replace(/{|}|"/g, "");
            return pretty;
        } else if (formObj.constructor === Object) {
            return $filter('inputSelected')(formObj);
        } else {
            return formObj;
        }
    }
});

myApp.filter('newlines', function($sce) {
    return function(formObj) {
        if (formObj) {
          return $sce.trustAsHtml(formObj.replace(/,/g, '<br>'));
        }
    }
});

myApp.filter('timestamp', function() {
    return function(formObj) {
        var timestamp = formObj._id.toString().substring(0, 8);
        var date = new Date(parseInt(timestamp, 16) * 1000);
        return date;
    }
});

myApp.filter('tableToFormName', function() {
    return function(tableName) {
        if (tableName === 'memberapp') {
            return 'Membership'
        } else if (tableName === 'volunteerapp') {
            return 'Volunteer'
        } else if (tableName === 'nonriderapp') {
            return 'Non-Rider'
        } else if (tableName === 'contactform') {
            return 'Contact'
        } else {
            return 'Other'
        }
    }
});

myApp.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});


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


myApp.service('RidesDataService', function($http){
  this.getAllRides = function(){
    return $http.get('/getAllRides').then(function(data){
      console.log('rides data is ', data);
      return data;
    })
  };
});



myApp.directive('contactForm', function() {
    return {
        restrict: "E",
        templateUrl: "../views/contact-form.html"
    }
})