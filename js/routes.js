angular.module('app.routes', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'welcomeCtrl',
    reload: false,
    cache: false
  })

  .state('registration', {
    url: '/registration',
    templateUrl: 'templates/registration.html',
    abstract: true,
  })

  .state('registration.profile', {
    url: '/profile',
    views: {
      'registration': { templateUrl:'templates/registrationprofile.html', controller:'registration_profileCtrl' }
    }
  })

  .state('registration.questions', {
    url: '/questions',
    views: {
      'registration': { templateUrl:'templates/registrationquestions.html', controller:'registration_questionsCtrl' }
    }
  })

  .state('registration.questions.questions', {
    url: '/questions/:question',
    views: {
      'questions': { templateUrl:'templates/registrationquestionschild.html', controller:'registration_questionsCtrl' }
    }
  })

  .state('registration.questions.example', {
    url: '/example/:question',
    views: {
      'questions': { templateUrl:'templates/registrationquestionsexample.html', controller:'registration_questionsCtrl' }
    }
  })

  .state('registration.photo', {
    url: '/photo/{registration:int}',
    cache: false,
    reload: true,
    views: {
      'registration': { templateUrl:'templates/registrationphoto.html', controller:'registration_photoCtrl' }
    }
  })

  .state('sidemenu', {
    url: '/sidemenu',
    templateUrl: 'templates/sidemenu.html',
    controller: 'sidemenuCtrl',
    abstract:true
  })

  .state('sidemenu.home_questions', {
    url: '/homequestions',
    cache: false,
    reload: true,
    views: {
        'menuContent': { templateUrl:'templates/homequestions.html', controller:'home_questionsCtrl' }
    }
  }) 
  
  .state('sidemenu.home_picture', {
    url: '/homepicture/{id:int}/:username/{a1:int}/{a2:int}/{a3:int}/{a1_like:int}/{a2_like:int}/{a3_like:int}',
    cache: false,
    reload: true,
    views: {
        'menuContent': { templateUrl: 'templates/homepicture.html', controller:'home_pictureCtrl' }
    }
  })

  .state('sidemenu.my_profile', {
    url: '/myprofile',
    cache: false,
    reload: true,
    views: {
      'menuContent': { templateUrl:'templates/myprofile.html', controller:'my_profileCtrl' }
    }
  })

  .state('sidemenu.friends', {
    url: '/friends',
    cache: false,
    reload: true,
    views: {
        'menuContent': { templateUrl:'templates/friends.html', controller:'friendsCtrl' }
    }
  })

  .state('sidemenu.chat', {
    url: '/chat/{to_id:int}/:to_username',
    cache: false,
    reload: true,
    views: {
        'menuContent': { templateUrl:'templates/chat.html', controller:'chatCtrl' }
    }
  })

  .state('sidemenu.friend_profile', {
    url: '/friendprofile/{user_id:int}/:friend',
    views: {
        'menuContent': { templateUrl:'templates/friendprofile.html', controller:'friend_profileCtrl' }
    }
  })

  .state('sidemenu.settings', {
    url: '/settings',
    cache: false,
    reload: true,
    views: {
        'menuContent': { templateUrl:'templates/settings.html', controller:'settingsCtrl' }
    }
  })

  .state('sidemenu.photo', {
    url: '/photo/{registration:int}',
    cache: false,
    reload: true,
    views: {
        'menuContent': { templateUrl:'templates/registrationphoto.html', controller:'change_photoCtrl' }
    }
  })

  .state('sidemenu.change_questions', {
    url: '/changequestions/{question:int}',
    views: {
        'menuContent': { templateUrl: 'templates/changequestions.html', controller: 'change_questionsCtrl' }
    }
  })


$urlRouterProvider.otherwise('/welcome')

});