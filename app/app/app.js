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
            controller: 'MainController',
            templateUrl: viewsPath + 'home.html'
        })
        .state('contact', {
            url: '/contact',
            controller: 'MainController',
            templateUrl: viewsPath + 'contact.html'
        })
        .state('what-we-do', {
            url: '/what-we-do',
            controller: 'MainController',
            templateUrl: viewsPath + 'what-we-do.html',
            params: {
              anchor: null
            }
        })
        .state('keyword-pages', {
            url: '/keyword-pages',
            controller: 'MainController',
            templateUrl: viewsPath + 'keyword-pages.html'
        })
        .state('login', {
            url: '/login',
            controller: 'MainController',
            templateUrl: viewsPath + 'login.html'
        })
        .state('dashboard', {
            url: '/dashboard',
            controller: 'MainController',
            templateUrl: viewsPath + 'dashboard.html'
        })
        .state('view-form', {
            url: '/view-form',
            controller: 'MainController',
            templateUrl: viewsPath + 'view-form.html',
            params: {
                formObj: null,
                formType: null
            }
        })
        .state('backup-pdf', {
            url: '/backup-pdf',
            controller: 'MainController',
            templateUrl: viewsPath + 'backup-pdf.html'
        })
        .state('wildcard', {
            url: '/*',
            controller: 'MainController',
            templateUrl: viewsPath + 'home.html'
        })
        .state('draft', {
            url: '/draft',
            controller: 'MainController',
            templateUrl: viewsPath + 'draft.html'
        })
        .state('find-your-itn', {
            url: '/find-your-itn',
            controller: 'MainController',
            templateUrl: viewsPath + 'find-your-itn.html'
        })
        .state('ways-to-give', {
            url: '/ways-to-give',
            controller: 'MainController',
            templateUrl: viewsPath + 'ways-to-give.html'
        })
        .state('million-rides-campaign-photo-album', {
            url: '/million-rides-campaign-photo-album',
            controller: 'MainController',
            templateUrl: viewsPath + 'million-rides-campaign-photo-album.html'
        })
        .state('annual-report-2017', {
            url: '/annual-report-2017',
            controller: 'MainController',
            templateUrl: viewsPath + 'annual-report-2017.html'
        })
        .state('about', {
            url: '/about',
            controller: 'MainController',
            templateUrl: viewsPath + 'about.html',
            params: {
              anchor: null
            }
        })
        .state('portal', {
            url: '/portal',
            controller: 'MainController',
            templateUrl: viewsPath + 'portal.html'
        })
        .state('login-portal', {
            url: '/login-portal',
            controller: 'MainController',
            templateUrl: viewsPath + 'login-portal.html'
        })
        .state('itnamerica', {
            url: '/itnamerica',
            controller: 'MainController',
            templateUrl: viewsPath + 'itnamerica.html'
        })
        .state('rides-in-sight', {
            url: '/rides-in-sight',
            controller: 'MainController',
            templateUrl: viewsPath + 'rides-in-sight.html'
        })
        .state('itn-services', {
            url: '/itn-services',
            controller: 'MainController',
            templateUrl: viewsPath + 'itn-services.html'
        })
        .state('other', {
            url: '/other',
            controller: 'MainController',
            templateUrl: viewsPath + 'other.html'
        })
        .state('affiliates', {
            url: '/affiliates/:name',
            templateUrl: viewsPath + 'affiliates.html',
            params : {
              name: 'none',
              gaViewCode: 0,
            }
        })
        .state('nda', {
            url: '/nda2018xyz',
            controller: 'MainController',
            templateUrl: viewsPath + 'nda.html'
        })
        .state('rides', {
            url: '/rides',
            controller: 'MainController',
            templateUrl: viewsPath + 'rides.html'
        })
        .state('human-resources', {
            url: '/human-resources',
            controller: 'MainController',
            templateUrl: viewsPath + 'human-resources.html'
        })
        .state('calendar', {
            url: '/calendar',
            controller: 'CalendarController',
            templateUrl: viewsPath + 'calendar.html'
        })
        .state('agenda', {
            url: '/agenda',
            controller: 'CalendarController',
            templateUrl: viewsPath + 'agenda.html',
            params: {
              selectedEventDate: null
            }
        })
        .state('ttp', {
            url: '/ttp',
            controller: 'MainController',
            templateUrl: viewsPath + 'ttp.html'
        })
        .state('research', {
            url: '/research',
            controller: 'MainController',
            templateUrl: viewsPath + 'research.html'
        })
        .state('important-docs', {
            url: '/important-docs',
            controller: 'MainController',
            templateUrl: viewsPath + 'important-docs.html',
            params: {
              filter: null
            }
        })
        .state('employee-profiles', {
            url: '/employee-profiles',
            controller: 'MainController',
            templateUrl: viewsPath + 'employee-profiles.html'
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