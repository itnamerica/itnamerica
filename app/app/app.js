var myApp = angular.module('myApp', ['ui.router', 'ngAnimate', 'angularUtils.directives.dirPagination']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    console.log('inside of config block');
    var viewsPath = "views/";
    var appPath = "/";
    if (location.host === "localhost:8080") {
        viewsPath = "app/views/";
        appPath = "app/";
    };

    $stateProvider

        .state('home', {
            url: '/',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'home.html'
        })
        .state('contact', {
            url: '/contact',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'contact.html'
        })
        .state('what-we-do', {
            url: '/what-we-do',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'what-we-do.html',
            params: {
              anchor: null
            }
        })
        .state('keyword-pages', {
            url: '/keyword-pages',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'keyword-pages.html'
        })
        .state('login', {
            url: '/login',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'login.html'
        })
        .state('dashboard', {
            url: '/dashboard',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'dashboard.html'
        })
        .state('view-form', {
            url: '/view-form',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'view-form.html',
            params: {
                formObj: null,
                formType: null
            }
        })
        .state('backup-pdf', {
            url: '/backup-pdf',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'backup-pdf.html'
        })
        .state('wildcard', {
            url: '/*',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'home.html'
        })
        .state('draft', {
            url: '/draft',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'draft.html'
        })
        .state('find-your-itn', {
            url: '/find-your-itn',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'find-your-itn.html'
        })
        .state('ways-to-give', {
            url: '/ways-to-give',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'ways-to-give.html'
        })
        .state('million-rides-campaign-photo-album', {
            url: '/million-rides-campaign-photo-album',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'million-rides-campaign-photo-album.html'
        })
        .state('annual-report-2017', {
            url: '/annual-report-2017',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'annual-report-2017.html'
        })
        .state('about', {
            url: '/about',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'about.html',
            params: {
              anchor: null
            }
        })
        .state('portal', {
            url: '/portal',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'portal.html'
        })
        .state('login-portal', {
            url: '/login-portal',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'login-portal.html'
        })
        .state('itnamerica', {
            url: '/itnamerica',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'itnamerica.html'
        })
        .state('rides-in-sight', {
            url: '/rides-in-sight',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'rides-in-sight.html'
        })
        .state('itn-services', {
            url: '/itn-services',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'itn-services.html'
        })
        .state('other', {
            url: '/other',
            controller: 'MainCtrl',
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
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'nda.html'
        })
        .state('rides', {
            url: '/rides',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'rides.html'
        })
        .state('human-resources', {
            url: '/human-resources',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'human-resources.html'
        })
        .state('calendar', {
            url: '/calendar',
            controller: 'CalendarCtrl',
            controllerUrl: appPath + '/calendarController.js',
            templateUrl: viewsPath + 'calendar.html'
        })
        .state('agenda', {
            url: '/agenda',
            controller: 'CalendarCtrl',
            templateUrl: viewsPath + 'agenda.html',
            params: {
              selectedEventDate: null
            }
        })
        .state('ttp', {
            url: '/ttp',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'ttp.html'
        })
        .state('research', {
            url: '/research',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'research.html'
        })
        .state('important-docs', {
            url: '/important-docs',
            controller: 'MainCtrl',
            templateUrl: viewsPath + 'important-docs.html',
            params: {
              filter: null
            }
        })
        .state('employee-profiles', {
            url: '/employee-profiles',
            controller: 'MainCtrl',
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
