var myApp = angular.module('myApp', ['ui.router', 'ngAnimate', 'angularUtils.directives.dirPagination','ngFileUpload']);

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
            url: '/affiliates/:name',
            templateUrl: viewsPath + 'affiliates.html',
            params : {
              name: 'none',
              gaViewCode: 0,
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
        .state('human-resources', {
            url: '/human-resources',
            templateUrl: viewsPath + 'human-resources.html'
        })
        .state('calendar', {
            url: '/calendar',
            controller: 'CalendarCtrl',
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
            templateUrl: viewsPath + 'ttp.html'
        })
        .state('research', {
            url: '/research',
            templateUrl: viewsPath + 'research.html'
        })
        .state('important-docs', {
            url: '/important-docs',
            templateUrl: viewsPath + 'important-docs.html',
            params: {
              filter: null
            }
        })
        .state('employee-profiles', {
            url: '/employee-profiles',
            templateUrl: viewsPath + 'employee-profiles.html'
        })
        .state('dept-report', {
            url: '/dept-report',
            templateUrl: viewsPath + 'dept-report.html'
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
