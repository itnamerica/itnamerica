var myApp = angular.module('myApp', ['ui.router', 'ngAnimate', 'angularUtils.directives.dirPagination','ngFileUpload']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    console.log('inside of config block');
    var viewsPath = "views/";
    var appPath = "/";
    var today = new Date();
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
            templateUrl: viewsPath + 'contact.html',
            params: {
              contact: null
            }
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
        .state('itn-operations', {
            url: '/itn-operations',
            templateUrl: viewsPath + 'itn-operations.html'
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
        .state('affiliate', {
            url: '/affiliate/:name',
            templateUrl: viewsPath + 'affiliate.html',
            params : {
              name: 'Lanier',
              gaViewCode: 89470158,
            }
        })
        // .state('affiliate', {
        //      url: '/affiliate?name',
        //      templateUrl: viewsPath + 'affiliate.html',
        //      params: {
        //         name: {
        //            value: 'Lanier',
        //            dynamic: true
        //         }
        //      }
        // })
        .state('nda', {
            url: '/nda2018xyz',
            templateUrl: viewsPath + 'nda.html'
        })
        .state('rides', {
            url: '/rides',
            templateUrl: viewsPath + 'rides.html'
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
              selectedEventDate: today.toISOString()
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
        .state('important-docs-landing', {
            url: '/important-docs-landing',
            templateUrl: viewsPath + 'important-docs-landing.html',
        })
        .state('employee-profiles', {
            url: '/employee-profiles',
            templateUrl: viewsPath + 'employee-profiles.html'
        })
        .state('dept-report', {
            url: '/dept-report',
            templateUrl: viewsPath + 'dept-report.html'
        })
        .state('hr-tickets', {
            url: '/hr-tickets',
            templateUrl: viewsPath + 'hr-tickets.html'
        })
        .state('calendar-ris', {
            url: '/calendar-ris',
            templateUrl: viewsPath + 'calendar-ris.html',
            controller: 'CalendarCtrl'
        })
        .state('human-resources', {
            url: '/human-resources',
            templateUrl: viewsPath + 'human-resources.html'
        })
        .state('affiliate-info', {
            url: '/affiliate-info/:affiliateName',
            templateUrl: viewsPath + 'affiliate-info.html'
        })
        .state('comments', {
            url: '/comments?filter',
            templateUrl: viewsPath + 'comments.html',
            controller: function($stateParams, $scope){
              $scope.comments = $stateParams.filter;
            }
        })
        .state('documents', {
            url: '/documents/:affiliateName',
            templateUrl: viewsPath + 'documents.html'
        })
        .state('web-traffic', {
            url: '/web-traffic/:affiliateName',
            templateUrl: viewsPath + 'web-traffic.html'
        })
        .state('rides-data', {
            url: '/rides-data/:affiliateName',
            templateUrl: viewsPath + 'rides-data.html'
        })
        .state('timesheets', {
            url: '/timesheets/:affiliateName',
            templateUrl: viewsPath + 'timesheets.html'
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
