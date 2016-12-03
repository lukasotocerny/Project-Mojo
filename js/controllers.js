angular.module('app.controllers', ['ionic', 'ngCordova', 'ngAnimate', 'ionic.contrib.ui.tinderCards'])

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-arrow-left-c').previousTitleText(false);;
})

.service('phpUsers', function($http) {
    
    this.add_data = function(user) {
        return $http.post('###', user);
    };
    
    this.check_username = function(username) {
        return $http.post('###', { 'username':username });
    };    

    this.get_data = function(username) {
        return $http.post('###', { 'username':username });
    };

    this.get_responses = function(user_id) {
        return $http.post('###', {'user_id':user_id});
    };

    this.get_question = function(answer_id, question, answer) {
        return $http.post('###', {'answer_id':answer_id, 'question':question, 'answer':answer});
    };

    this.edit_photo = function(answer_id, photo) {
        return $http.post('###', {'answer_id':answer_id, 'photo':photo});
    };

    this.edit_question = function(answer_id, question, answer, newquestion, newanswer) {
        return $http.post('###', {'answer_id':answer_id, 'question':question, 'answer':answer, 'newquestion':newquestion, 'newanswer':newanswer});
    };
    this.edit_preferences = function(id, date, friends, work, fun, hobbies, other, male, female) {
        return $http.post('###', {'id':id, 'date':date, 'friends':friends, 'work':work, 'fun':fun,
        'hobbies':hobbies, 'other':other, 'male':male, 'female':female});
    };
    this.edit_location = function(id, latitude, longitude) {
        return $http.post('###', {'id':id, 'latitude':latitude, 'longitude':longitude});
    };
    this.delete_account = function(id, filename) {
        return $http.post('###', {'id':id})
            .then(function() {
                $http.post("###", {'filename':filename});
            });
    };   
})

.service('phpPublicMojo', function($http) {
    
    this.add_data = function(question_id, answer_id, a1, a1_like, a2, a2_like, a3, a3_like) {
        return $http.post('###', {'question_id':question_id, 'answer_id':answer_id, 'a1':a1, 'a1_like':a1_like, 
        'a2':a2, 'a2_like':a2_like, 'a3':a3, 'a3_like':a3_like });
    };

    this.mojo_button = function(question_id, answer_id, a1, a1_like, a2, a2_like, a3, a3_like, mojo) {
        return $http.post('###', { 'question_id':question_id, 'answer_id':answer_id, 'a1':a1, 'a1_like':a1_like, 
        'a2':a2, 'a2_like':a2_like, 'a3':a3, 'a3_like':a3_like, 'mojo':mojo });
    };
    
    this.get_friends = function(answer_id) {
        return $http.post('###', {'answer_id':answer_id});
    };

    this.get_new_question = function(answer_id, latitude, longitude) {
        return $http.post('###', {'answer_id':answer_id, 'latitude':latitude, 'longitude':longitude });
    };

    this.get_connected = function(answer_id) {
        return $http.post('###', {'answer_id':answer_id});
    };

    this.respond_mojo = function(question_id, answer_id, mojo) {
        return $http.post('###', {'answer_id':answer_id, 'question_id':question_id, 'mojo':mojo});
    };
})

.service('phpChat', function($http) {

    this.get_conversation = function(from_id, to_id) {
        return $http.post('###', {'to_id':to_id, 'from_id':from_id});
    };
    this.add_data = function(from_id, to_id, message) {
        return $http.post('###', {'to_id':to_id, 'from_id':from_id, 'message':message});
    };
})

.service('hashFunction', function() {
    this.hashPhoto = function(text) {
        var hash = 0;
        if (text.length == 0) return hash;
        for (i = 0; i < text.length; i++) {
            char = text.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };
})


//when loggin in read questions as well
.service('UserService', function() {
    this.id = null;
    this.username = null;
    this.password = null;
    this.q1 = null;
    this.a1 = null;
    this.q2 = null;
    this.a2 = null;
    this.q3 = null;
    this.a3 = null;
    this.age = null;
    this.me_male = null;
    this.me_female = null;
    this.date = null;
    this.work = null;
    this.friends = null;
    this.fun = null;
    this.hobbies = null;
    this.other = null;
    this.male = null;
    this.female = null;
    this.min_age = null;
    this.max_age = null;
    this.distance = null;
    this.latitude = null;
    this.longitude = null;
    this.photo = null;
})

.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success'
})

//AUTHENTICATION service
.service('AuthService', function() {

    this.login = function(username, password) {

        var promise = $q.defer();

        $http.post('###', { 'username':username })
            .then(function(response) {
                UserSession.create(response.id, response.user.id, response.user.role);
                return response.data.user
            }, function(error) {
                return error
            });

    }

})


//SIDEMENU CONTROLLER
.controller('sidemenuCtrl', function($scope, $state, UserService) {

    $scope.logout = function() {
        UserService.id = null;
        UserService.username = null;
        UserService.password = null;
        $state.go('welcome')
    };

})

//WELCOME CONTROLLER
//when logging out userservice stays
//strong password requirements
//harmonograph
.controller('welcomeCtrl', function($scope, $state, phpUsers, hashFunction, UserService, $cordovaGeolocation) {

    $scope.data = {};

    console.log(angular.toJson(UserService));

    $scope.login = function(username, password) {
        if (username != "" && password != "") {
            phpUsers.get_data(username)
                .then(function(response) {
                    if (response.data == 'null') {
                        alert('You have entered wrong username.');
                        $scope.data.username = "";
                        $scope.data.password = "";
                    } else {
                        if ( password == response.data.password ) {
                            UserService.username = username;
                            UserService.id = parseInt(response.data.id);
                            UserService.password = password;
                            UserService.age = parseInt(response.data.age);
                            UserService.me_male = response.data.me_male;
                            UserService.me_female = response.data.me_female;
                            UserService.date = parseInt(response.data.date);
                            UserService.photo = parseInt(response.data.photo);
                            UserService.work = parseInt(response.data.work);
                            UserService.friends = parseInt(response.data.friends);
                            UserService.fun = parseInt(response.data.fun);
                            UserService.hobbies = parseInt(response.data.hobbies);
                            UserService.other = parseInt(response.data.other);
                            UserService.q1 = response.data.q1;
                            UserService.q2 = response.data.q2;
                            UserService.q3 = response.data.q3;
                            UserService.a1 = parseInt(response.data.a1);
                            UserService.a2 = parseInt(response.data.a2);
                            UserService.a3 = parseInt(response.data.a3);
                            UserService.male = parseInt(response.data.male);
                            UserService.female = parseInt(response.data.female);
                            UserService.min_age = parseInt(response.data.min_age);
                            UserService.max_age = parseInt(response.data.max_age);
                            UserService.distance = parseInt(response.data.distance);
                            alert(UserService.username + ' logged in successfully.');
                            navigator.geolocation.getCurrentPosition(function(position) {
                                UserService.latitude = (position.coords.latitude / 360 * 2 * Math.PI).toFixed(8);
                                UserService.longitude = (position.coords.longitude / 360 * 2 * Math.PI).toFixed(8);
                                    phpUsers.edit_location(UserService.id, UserService.latitude, UserService.longitude)
                                        .then(function() {
                                            console.log('location ', UserService.latitude, UserService.longitude);
                                            $state.go('sidemenu.home_questions');
                                        });
                                }, function(error) { console.log('Error ' + angular.toJson(error)); }, { timeout:10000, enableHighAccuracy:true });                         
                        } else {
                            alert('Password does not match your username.');
                            $scope.data.password = "";
                        };
                    };
                }, function(error) { alert('Error ' + error.status); });
        } else {
            alert('Please fill out the required information.');
        };
    };
     
    $scope.registerButton = function(username, password) {
        if (username && $scope.data.password) {
            phpUsers.check_username($scope.data.username)
                .then(function(response) {
                    if (response.data == 0) { //USERNAME NOT IN DB
                        UserService.username = $scope.data.username;
                        UserService.password = $scope.data.password;
                        $state.go('registration.profile');
                    } else { //USERNAME ALREADY IN DB
                        alert('Your username is already taken. Please choose a different one.');
                        $scope.data.username = "";
                        $scope.data.password = "";
                    };  
                }, function(error) { alert('Error ' + error.status); });
        } else {
            alert('Please fill out the required information.');
        };
    };
})


//REGISTRATION PROFILE CONTROLLER
//kliknout radio box zacervenat
.controller('registration_profileCtrl', function($scope, UserService, $state) {

    $scope.data = {};

    $scope.continue_button = function() {
        if ($scope.data.age && ($scope.data.me_male || $scope.data.me_female) && ($scope.data.date || $scope.data.hobbies || $scope.data.work || $scope.data.friends || $scope.data.fun || $scope.data.other)
         && ($scope.data.male || $scope.data.female) ) {   
            UserService.age = parseInt($scope.data.age);
            if ( $scope.data.me_male == 1 ) {
                UserService.me_male = 1;
                UserService.me_female = 0;
            } else {
                UserService.me_male = 0;
                UserService.me_female = 1;
            };
            UserService.date = $scope.data.date ? 1 : 0;
            UserService.friends = $scope.data.friends ? 1 : 0;
            UserService.work = $scope.data.work ? 1 : 0;
            UserService.hobbies = $scope.data.hobbies ? 1 : 0;
            UserService.fun = $scope.data.fun ? 1 : 0;
            UserService.other = $scope.data.other ? 1 : 0;
            UserService.male = $scope.data.male ? 1 : 0;
            UserService.female = $scope.data.female ? 1 : 0;
            UserService.min_age = 18;
            UserService.max_age = UserService.age + 10;
            UserService.distance = 15000;
            $state.go('registration.questions.questions', {question:'0'});
        } else {
            alert('Please enter the required information.');   
        };
    };

    $scope.setDelay = function() {
        $scope.delay = true;
        $timeout(function(){
            $scope.delay = false;
        }, 200);
    };
})


//REGISTRATION QUESTIONS CONTROLLER
//when going to .example the chosen question already marked
.controller('registration_questionsCtrl', function($scope, $state, UserService, $stateParams) {

    $scope.data = $scope.data || {};

    $scope.currentquestion = 'q'.concat($stateParams.question);

    $scope.setupquestionsButton = function() {
        if ($scope.data.q1 && (typeof $scope.data.a1 != 'undefined') && $scope.data.q2 && (typeof $scope.data.a2 != 'undefined') && $scope.data.q3 && (typeof $scope.data.a3 != 'undefined')) {   
            UserService.q1 = $scope.data.q1;
            UserService.a1 = $scope.data.a1;
            UserService.q2 = $scope.data.q2;
            UserService.a2 = $scope.data.a2;
            UserService.q3 = $scope.data.q3;
            UserService.a3 = $scope.data.a3;
            $state.go('registration.photo', { registration:1 }); 
        } else {
            alert('Please fill out the required information.');
        };              
    };

    $scope.database = ["Are you looking for one night stand?", "Just a casual beer and talk?", "Can I invite you to a Salsa Club for a dance?", "Yes: TV-Series, No: Books", "Would you be interested in a soccer team?",
    "Could you explain me Differential Geometry?", "Are taxes a crime?", "Friends cannot be lovers.", "Can you program in C++?", "Would you mind your partner having higher salary?"];
})


//REGISTRATION PHOTO CONTROLLER
//design picture for unknown
//localstorage save
//hash collisions
//loading process
.controller('registration_photoCtrl', function($scope, hashFunction, $cordovaCamera, $cordovaFileTransfer, $cordovaGeolocation, UserService, $state, phpUsers, $stateParams) {

    $scope.user = { username:UserService.username, age:UserService.age };
    
    var username = hashFunction.hashPhoto(UserService.username).toString();

    if ( $stateParams.registration == 1 )  {
        $scope.button_text = 'Finish';
        $scope.pictureUrl = 'img/profilepicture.png';
        UserService.photo = 0;
    } else if ( ($stateParams.registration == 1) & (UserService.photo != null) ) {
        $scope.button_text = 'Finish';
        $scope.pictureUrl = "###".concat(username, ".jpg");
    } else {
        $scope.button_text = 'Save';
        $scope.pictureUrl = "###".concat(username, ".jpg");
    }; 

    $scope.takePicture = function() {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            saveToPhotoAlbum: true,
            correctOrientation: true,
            targetHeight: 300
        }; 
        $cordovaCamera.getPicture(options)
            .then(function(data) {
                console.log('first');
                var options = {
                    fileName: username.concat(".jpg")
                };
                console.log(options.fileName);
                $cordovaFileTransfer.upload("###", data, options)
                    .then(function() {
                        console.log('second');
                        UserService.photo = 1;
                        $scope.pictureUrl = "###".concat(username, ".jpg");
                        alert('Upload successful..');
                    }, function() {
                        alert("Upload Error");
                    });
            }, function(error) {
                alert('Camera Error');   
            });  
    };  

    $scope.choosePicture = function() {
        var options = {
            quality: 100,
            correctOrientation: true,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
        };
        $cordovaCamera.getPicture(options)
            .then(function(data) {
                console.log('first');
                var options = {
                    fileName: username.concat(".jpg")
                };
                console.log(options.fileName);
                $cordovaFileTransfer.upload("###", data, options)
                    .then(function() {
                        console.log('second');
                        UserService.photo = 1;
                        $scope.pictureUrl = "###".concat(username, ".jpg");
                    }, function() {
                        alert('Upload Error');
                    });
            }, function(error) {
                console.log('Camera Error: ');   
            });         
    }; 

    $scope.finish_button = function() {
        if ( $stateParams.registration == 1 ) {
            navigator.geolocation.getCurrentPosition(function(position) {
                UserService.latitude = parseFloat((position.coords.latitude / 360 * 2 * Math.PI).toFixed(8));
                UserService.longitude = parseFloat((position.coords.longitude / 360 * 2 * Math.PI).toFixed(8));
                console.log(UserService.latitude, UserService.longitude);
                console.log(angular.toJson(UserService));
                phpUsers.add_data(UserService)
                    .then(function(response) {
                        UserService.id = parseInt(response.data);
                        $state.go('sidemenu.home_questions');
                    });
                }, function(error) { console.log('Error ' + angular.toJson(error)); }, { timeout:10000, enableHighAccuracy:true });
        } else {
            $state.go('sidemenu.my_profile');
        };
    };   
})

//delete photo option?
//new random hash for a new picture
.controller('change_photoCtrl', function($scope, hashFunction, $cordovaCamera, $cordovaFileTransfer, UserService, $state, phpUsers) {

    $scope.user = { username:UserService.username, age:UserService.age };   

    var username = hashFunction.hashPhoto(UserService.username).toString();

    if (UserService.photo == 1 ) {
        $scope.pictureUrl = "###".concat(username, ".jpg");
    } else {
        $scope.pictureUrl = "img/profilepicture.png";
    }

    $scope.button_text = "Save";

    $scope.takePicture = function() {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            saveToPhotoAlbum: true,
            correctOrientation: true,
            targetHeight: 300
        }; 
        $cordovaCamera.getPicture(options)
            .then(function(data) {
                var options = {
                    fileName: username.concat(".jpg")
                };
                $cordovaFileTransfer.upload("###", data, options)
                    .then(function() {
                        UserService.photo = 1;
                        phpUsers.edit_photo(UserService.id, 1)
                            .then(function() {
                                $scope.pictureUrl = "###".concat(username, ".jpg");
                                alert('Upload successful..');
                            })
                        
                    }, function() {
                        alert("Upload Error");
                    });
            }, function(error) {
                alert('Camera Error');   
            });  
    };  

    $scope.choosePicture = function() {
        var options = {
            quality: 100,
            correctOrientation: true,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
        };
        $cordovaCamera.getPicture(options)
            .then(function(data) {
                var options = {
                    fileName: username.concat(".jpg")
                };
                $cordovaFileTransfer.upload("###", data, options)
                    .then(function() {
                        UserService.photo = 1;
                        phpUsers.edit_photo(UserService.id, 1)
                            .then(function() {
                                $scope.pictureUrl = "img/profilepicture.png";
                                $scope.pictureUrl = "###".concat(username, ".jpg");
                                alert('Upload successful..');
                            })
                    }, function() {
                        alert('Upload Error');
                    });
            }, function(error) {
            });         
    }; 

    $scope.finish_button = function() {
        $state.go('sidemenu.my_profile');
    }; 
})


//HOME QUESTIONS CONTROLLER
//skip question phpAction
//loading on beginning!!!
//loggin out!!(when logging out and signign back in does not load)
//making ["we are sorry","we are sorry","we are sorry"] or changing current question
//scope.disablebuttons can be only var
//when picture on and Mojo/Mono the picture of second card can be seen
//skip button functioning after all questions are gone
//the page behind shows current question instead of first one
.controller('home_questionsCtrl', function($scope, $timeout, $cordovaSpinnerDialog, $cordovaSplashscreen, hashFunction, TDCardDelegate, $http, UserService, phpPublicMojo, $state, phpUsers, $stateParams, $cordovaGeolocation) {
    
    $scope.picture = false;
    var pre_last = false;
    $scope.wrong = false;
    $scope.like = false;
    $scope.currentquestion = 1;
    var answers = ['NULL', 'NULL', 'NULL'];
    var answers_likes = ['NULL', 'NULL', 'NULL'];
    var questionstack = [];
    var newCard = null;
    $scope.answers_view = [true, false, false];

    var initializing_card = function() {
        $scope.answers_view = [true, false, false];
        answers = ['NULL', 'NULL', 'NULL'];
        answers_likes = ['NULL', 'NULL', 'NULL'];
        $scope.currentquestion = 1;
        $scope.like = false;
        $scope.picture = false;
    };

    var get_new_question_user = function() {
        return phpPublicMojo.get_new_question(UserService.id, UserService.latitude, UserService.longitude)
            .then(function(response) {
                if ( response.data.length == 0 ) {
                    $scope.disable_buttons = true;
                    questionstack.push({ questions: ["We are sorry, but we do not have any other questions currently."] }, { questions: ["We are sorry, but we do not have any other questions currently."] });
                } else if ( response.data.length == 1 ) {
                    $scope.disable_buttons = false;
                    questionstack.push({ questions: ["We are sorry, but we do not have any other questions currently."] }, response.data[0])
                } else {
                    $scope.disable_buttons = false;
                    var i = 0;
                    while ( i < response.data.length ) {
                        var question_user = {};
                        question_user.id = parseInt(response.data[i].user_id);
                        question_user.username = response.data[i].username;
                        question_user.age = response.data[i].age;
                        question_user.photo = parseInt(response.data[i].photo);
                        question_user.questions = [response.data[i].q1, response.data[i].q2, response.data[i].q3];
                        question_user.answers = [parseInt(response.data[i].a1), parseInt(response.data[i].a2), parseInt(response.data[i].a3)];
                        questionstack.push(question_user);
                        i++;
                    };
                };
            });
    };

    $cordovaSpinnerDialog.show("hello","Loading...", true);
    get_new_question_user()
        .then(function() {
            newCard = questionstack.splice(0,1);
            $scope.cards = [{question:""}, newCard[0]];   
            $timeout(function() {
                TDCardDelegate.$getByHandle('friends').cardInstances[0].swipe('left')
                    .then(function() {
                        $cordovaSpinnerDialog.hide()
                    });
            },500);
        });

    //TEST CASE
    //$scope.cards = [{username:'LukasCerny', age:19, questions:['If you were told to answer no, would you answer no?']},{questions:['If you were told to answer no, would you answer no?']}];
    /*questionstack.push({username:'LukasCerny', age:19, questions:["Are you looking for one night stand?","Are you looking for one night stand?","Are you looking for one night stand?"],answers:[0,0,0]},
        {questions:["Just a casual beer and talk?","Just a casual beer and talk?","Just a casual beer and talk?"],answers:[0,0,0]},
        {questions:["Can I invite you to a Salsa Club for a dance?","Can I invite you to a Salsa Club for a dance?","Can I invite you to a Salsa Club for a dance?"],answers:[0,0,0]}, 
        {questions:["Yes: TV-Series, No: Books","Yes: TV-Series, No: Books","Yes: TV-Series, No: Books"],answers:[0,0,0]},
        {username:'LukasCerny', age:19, questions:["Would you be interested in a soccer team?","Would you be interested in a soccer team?","Would you be interested in a soccer team?"],answers:[0,0,0]});
    $scope.disable_buttons = false;
    $scope.picture = false;
    newCard = questionstack.splice(0,2);
    //$scope.pictureUrl = "###";
    $scope.pictureUrl = "###";
    $scope.cards = [newCard[0], newCard[1]]; 
    */


    $scope.cardDestroyed = function(index) {
        console.log("INDEX:", index);
        if (questionstack.length == 0) {
            newCard = { id: null, questions: ["We are sorry, but we do not have any other questions currently."] };
            $scope.cards.splice(index, 1);
            $scope.cards.unshift(newCard);
            if (pre_last == true) {
                $scope.disable_buttons = true;
            } else {
                pre_last = true;
                $scope.disable_buttons = false;
            };            
        } else {
            $scope.disable_buttons = false;
            newCard = questionstack.shift();
            $scope.cards.splice(index, 1);
            $scope.cards.unshift(newCard);
        };
        initializing_card();
    };

    $scope.yes_button = function() {  
        if ($scope.disable_buttons == true) {
            return null;
        } else if ($scope.picture == true) {
            return phpPublicMojo.mojo_button($scope.cards[1].id, UserService.id, answers[0], answers_likes[0], answers[1], answers_likes[1], answers[2], answers_likes[2], 1)
                .then(function() {
                    TDCardDelegate.$getByHandle('friends').cardInstances[0].swipe('left');
                });
        };
        answers[$scope.currentquestion - 1] = 1;
        answers_likes[$scope.currentquestion - 1] = $scope.like ? 1 : 0;
        //CORRECT ANSWER
        if ($scope.cards[1].answers[$scope.currentquestion - 1] == 1) {
            $scope.answers_view[$scope.currentquestion] = true;
            $scope.like = false;
            if ( $scope.currentquestion < 3 ) {
                $scope.currentquestion++;
            //3 QUESTIONS ANSWERED
            } else {
                if ($scope.cards[1].photo == 1) {
                    $scope.pictureUrl = "###".concat(hashFunction.hashPhoto($scope.cards[1].username), ".jpg");
                } else {
                    $scope.pictureUrl = "img/profilepicture.png";
                };
                $scope.picture = true;
                /*
                $http.get("###".concat(hashFunction.hashPhoto($scope.cards[1].username), ".jpg"))
                    .then( function() {
                        $scope.pictureUrl = "###".concat(hashFunction.hashPhoto($scope.cards[1].username), ".jpg")
                    }, function() {
                        $scope.pictureUrl = "img/profilepicture.png";
                    });
                $scope.picture = true;
                */
            };
        //WRONG ANSWER
        } else {
            $scope.disable_buttons = true; 
            phpPublicMojo.add_data($scope.cards[1].id, UserService.id, answers[0], answers_likes[0], answers[1], answers_likes[1],  answers[2], answers_likes[2])
                .then(function() {
                    $scope.wrong = true;
                    $timeout(function() { 
                        $scope.wrong = false;
                        $scope.like = false;
                        TDCardDelegate.$getByHandle('friends').cardInstances[0].swipe('left');
                    }, 500);
                });
        };
    };  

    $scope.no_button = function() {  
        console.log('NO: ', $scope.disable_buttons);
        if ($scope.disable_buttons == true) {
            return null;
        } else if ($scope.picture == true) {
            return phpPublicMojo.mojo_button($scope.cards[1].id, UserService.id, answers[0], answers_likes[0], answers[1], answers_likes[1], answers[2], answers_likes[2], 0)
                .then(function() {
                    $scope.picture = false;
                    TDCardDelegate.$getByHandle('friends').cardInstances[0].swipe('left');
                });
        };
        //CORRECT ANSWER
        $scope.answers_view[$scope.currentquestion]=true;
        answers[$scope.currentquestion - 1] = 0;
        answers_likes[$scope.currentquestion - 1] = $scope.like ? 1 : 0;
        if ($scope.cards[1].answers[$scope.currentquestion-1] == 0) {
            if ( $scope.currentquestion < 3 ) {
                $scope.like = false;
                $scope.currentquestion++;
            //3 QUESTIONS ANSWERED
            } else {    
                $scope.like = false;  
                if ($scope.cards[1].photo == 1) {
                    $scope.pictureUrl = "###".concat(hashFunction.hashPhoto($scope.cards[1].username), ".jpg");
                } else {
                    $scope.pictureUrl = "img/profilepicture.png";
                };
                $scope.picture = true;
                /*         
                $http.get("###".concat(hashFunction.hashPhoto($scope.cards[1].username), ".jpg"))
                    .then( function() {
                        $scope.pictureUrl = "###".concat(hashFunction.hashPhoto($scope.cards[1].username), ".jpg")
                    }, function() {
                        $scope.pictureUrl = "img/profilepicture.png";
                    });
                $scope.picture = true;
                */
            };
        //WRONG ANSWER
        } else {
            $scope.disable_buttons = true; 
            phpPublicMojo.add_data($scope.cards[1].id, UserService.id, answers[0], answers_likes[0], answers[1], answers_likes[1],  answers[2], answers_likes[2])
                .then(function() {
                    $scope.wrong = true;
                    $timeout(function() { 
                        $scope.wrong = false;
                        $scope.like = false;
                        TDCardDelegate.$getByHandle('friends').cardInstances[0].swipe('left');
                    }, 550);
                });
        };  
    }; 

    $scope.skip_button = function() {
        console.log('SKIP: ', $scope.disable_buttons);
        if ( ($scope.disable_buttons == true) || ($scope.picture == true) ) {
            return null;
        } else {
            $scope.like = false;
            $scope.disable_buttons = true;
            TDCardDelegate.$getByHandle('friends').cardInstances[0].swipe('left');
        };
    };

    $scope.like_button = function() {
        if ( ($scope.disable_buttons == true) || ($scope.picture == true) ) {
            return null;
        } else {  
            $scope.like = !$scope.like;
        };
    };  

})


//HOME PICTURE CONTROLLER
.controller('home_pictureCtrl', function($scope, $stateParams, UserService, phpPublicMojo, $http, $state) {

    $scope.question_user = {
        username: $stateParams.username,
        id: parseInt($stateParams.id)
    };

    var answers = [parseInt($stateParams.a1), parseInt($stateParams.a2), parseInt($stateParams.a3)];
    var answers_likes = [parseInt($stateParams.a1_like), parseInt($stateParams.a2_like), parseInt($stateParams.a3_like)];
    var username = $scope.question_user.username.replace(/\s+/g, ''); 

    $http.get("###".concat(username, ".jpg"))
        .then(function() {
            $scope.pictureUrl = "###".concat(username, ".jpg");
        }, function() {
            $scope.pictureUrl = "img/profilepicture.png";
        });

    $scope.mojo_button = function() {
        phpPublicMojo.mojo_button($scope.question_user.id, UserService.id, answers[0], answers_likes[0], answers[1], answers_likes[1], answers[2], answers_likes[2], 1)
            .then(function() {
                $state.go('sidemenu.home_questions');
            });
    };

    $scope.mono_button = function() {
        phpPublicMojo.mojo_button($scope.question_user.id, UserService.id, answers[0], answers_likes[0], answers[1], answers_likes[1], answers[2], answers_likes[2], 0)
            .then(function() {
                $state.go('sidemenu.home_questions');
            });
    };
})

 
//FRIENDS LIST CONTROLLER
//if not profile picture then img.profilepicute2.png
.controller('friendsCtrl', function($scope, phpPublicMojo, UserService, hashFunction, $http, $q) {
//TEST
//$scope.connected = [{id:152,username:"Lukas",photo:"img/profilepicture.png"}];

    $scope.friends = {};

    $scope.connected = [];
    
    phpPublicMojo.get_friends(parseInt(UserService.id))
        .then(function(response) {
            var i = 0;
            while (i < response.data.length) {
                if (response.data[i].photo == "0") {
                    response.data[i].photo = "img/profilepicture.png";
                } else {
                    response.data[i].photo = "###".concat(hashFunction.hashPhoto(response.data[i].username), ".jpg");
                }
                i++;
            };
            $scope.friends = response.data;
        });

    phpPublicMojo.get_connected(parseInt(UserService.id))
        .then(function(response) {
            var i = 0;
            while (i < response.data.length) {
                if (response.data[i].photo == "0") {
                    response.data[i].photo = "img/profilepicture.png";
                } else {
                    response.data[i].photo = "###".concat(hashFunction.hashPhoto(response.data[i].username), ".jpg");
                }
                i++;
            };
            $scope.connected = response.data;
        });
})


//FRIEND PROFILE CONTROLLER
//profile picture if not
.controller('friend_profileCtrl', function($scope, $state, hashFunction, $stateParams, UserService, $ionicPopup, phpUsers, phpPublicMojo) {

    var get_responses = function(id) {
        phpUsers.get_responses(id) 
            .then(function(response) {
                console.log(angular.toJson(response.data));
                $scope.user_profile = {
                    username: response.data.username,
                    id: parseInt(response.data.id),
                    age: parseInt(response.data.age),
                    q1: response.data.q1,
                    a1_yes: parseInt(response.data.a1_yes),
                    a1_like: parseInt(response.data.a1_like),
                    a1_total: parseInt(response.data.totala1),
                    q2: response.data.q2,
                    a2_yes: parseInt(response.data.a2_yes),
                    a2_like: parseInt(response.data.a2_like),
                    a2_total: parseInt(response.data.totala2),
                    q3: response.data.q3,
                    a3_yes: parseInt(response.data.a3_yes),
                    a3_like: parseInt(response.data.a3_like),
                    a3_total: parseInt(response.data.totala3)
                };
                $scope.user_profile.a1_no = $scope.user_profile.a1_total - $scope.user_profile.a1_yes;
                $scope.user_profile.a2_no = $scope.user_profile.a2_total - $scope.user_profile.a2_yes;
                $scope.user_profile.a3_no = $scope.user_profile.a3_total - $scope.user_profile.a3_yes;
                if (response.data.photo == "1") {
                    $scope.pictureUrl = "###".concat(hashFunction.hashPhoto($scope.user_profile.username), ".jpg");
                } else {
                    $scope.pictureUrl = "img/profilepicture.png";
                };
            });
    };

    $scope.user_profile = $scope.user_profile || get_responses(parseInt($stateParams.user_id));

    if ($stateParams.friend == 'true') {
        $scope.friend = true;
    } else {
        $scope.friend = false;
    };

    $scope.mojo_button = function(mojo) {
        console.log($scope.user_profile.id, UserService.id, parseInt(mojo));
        phpPublicMojo.respond_mojo($scope.user_profile.id, UserService.id, parseInt(mojo)) 
            .then(function() {
                $state.go('sidemenu.friends');
            });
    };

    $scope.block_button = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Block a friend',
            template: 'Are you sure you want to block you friend? You will not be able to see him again.'
        });
        confirmPopup.then(function(res) {
            if(res) {
                phpPublicMojo.respond_mojo($scope.user_profile.id, parseInt(UserService.id), 0) 
                    .then(function() {
                        $state.go('sidemenu.friends');
                    });
            } else {
                console.log('You are not sure.');
            };
        });
    };  
})


//CHAT CONTROLLER
//message has to contain at least a letter
//weird characters and parsing to the database, not entering rows
//ciphering
.controller('chatCtrl', function($scope, $stateParams, phpChat, UserService, $state, $ionicScrollDelegate) {
    //TEST CASE
//    $scope.conversation.push({user:'ME', message:'How are you?', id:152});
//    $scope.conversation.push({user:'HIM', message:'I am fine...', id:155}); 

    $scope.user_profile = function() {
        $state.go('sidemenu.friend_profile', { user_id:to_id, friend:'true' });
    };
    
    var to_id = parseInt($stateParams.to_id);
    $scope.to_username = $stateParams.to_username;
    $scope.conversation = $scope.conversation || [];

    $scope.set_style = function(user) {
        var him_style = {'display':'block','clear':'both','margin':'0 1rem 1rem 0.5rem', 'float':'left'};
        var me_style = {'display':'block','clear':'both','margin':'0 0.5rem 1rem 1rem', 'float':'right'};
        if (user == "ME") {
            return me_style
        } else {
            return him_style
        };
    };

    $scope.mojo_button = function() {
        phpChat.add_data(to_id, UserService.id, $scope.message)
            .then(function() {
                $scope.conversation.push({
                    user: 'ME',
                    message: $scope.message
                });
                $ionicScrollDelegate.scrollBottom(true);
                $scope.message = "";
            });       
    };

    $scope.get_conversation = function() {
        phpChat.get_conversation(to_id, UserService.id)
            .then(function(response) {
                var i=0;      
                $scope.conversation = $scope.conversation || [];   
                while (i<response.data.length) {
                    if (response.data[i].to_id == UserService.id) {
                        $scope.conversation.push({
                            user: 'ME',
                            message: response.data[i].message,
                            id: parseInt(response.data[i].id)
                        });
                    } else {
                        $scope.conversation.push({
                            user: 'HIM',
                            message: response.data[i].message,
                            id: parseInt(response.data[i].id)
                        });
                    };
                    i++;
                };
            });
    };

    $scope.get_conversation(); 
})


//CREATE PROFILE PICTURE THAT IS AUTOMATICALLY LOADED
//not recognizing swiped questions
//urging person to take photo
//marking correct answers in individual questions
.controller('my_profileCtrl', function($scope, phpUsers, hashFunction, $ionicPopup, $state, $http, UserService) {

//TEST
//    $scope.pictureUrl = "img/profilepicture.png";
/*    $scope.myprofile = { username:'Test', id:4, q1:'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest', 
    a1_yes:1, a1_like:1, a1_total:1, q2:'Are you looking for one night stand tonight?', a2_yes:2, a2_like:1, a2_total:2, q3:'Test3', a3_yes:3, a3_like:1, a3_total:3, age:19 };
    $scope.myprofile.a1_no = $scope.myprofile.a1_total - $scope.myprofile.a1_yes;
    $scope.myprofile.a2_no = $scope.myprofile.a2_total - $scope.myprofile.a2_yes;
    $scope.myprofile.a3_no = $scope.myprofile.a3_total - $scope.myprofile.a3_yes;  */

    $scope.data = {};
    console.log('okey');

    phpUsers.get_responses(UserService.id)
        .then(function(response) {
            console.log(response.data);
            console.log('okey22');
            $scope.myprofile = {
                username: response.data.username,
                age: parseInt(response.data.age),
                id: parseInt(response.data.id),
                q1: response.data.q1,
                a1_yes: parseInt(response.data.a1_yes),
                a1_like: parseInt(response.data.a1_like),
                a1_total: parseInt(response.data.totala1),
                q2: response.data.q2,
                a2_yes: parseInt(response.data.a2_yes),
                a2_like: parseInt(response.data.a2_like),
                a2_total: parseInt(response.data.totala2),
                q3: response.data.q3,
                a3_yes: parseInt(response.data.a3_yes),
                a3_like: parseInt(response.data.a3_like),
                a3_total: parseInt(response.data.totala3)
            };
            $scope.myprofile.a1_no = $scope.myprofile.a1_total - $scope.myprofile.a1_yes;
            $scope.myprofile.a2_no = $scope.myprofile.a2_total - $scope.myprofile.a2_yes;
            $scope.myprofile.a3_no = $scope.myprofile.a3_total - $scope.myprofile.a3_yes;
            if (response.data.photo == "1") {
                console.log(hashFunction.hashPhoto($scope.myprofile.username));
                $scope.pictureUrl = "###".concat(hashFunction.hashPhoto($scope.myprofile.username), ".jpg");
            } else {
                $scope.pictureUrl = "img/profilepicture.png";
            };
        });

    $scope.delete_account = function() {
        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.password">',
            title: 'Enter Your Password',
            subTitle: 'In order to delete your account',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Delete</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        console.log($scope.data.password);
                        if ( $scope.data.password == UserService.password ) {
                            phpUsers.delete_account(UserService.id, hashFunction.hashPhoto(UserService.username))
                                .then($state.go('welcome'));
                        } else {
                            alert("Incorrect password entered.");
                            $scope.data.password = "";
                        };
                    }
                }
            ]
        });
    }
})


//CHANGE MY QUESTIONS CONTROLLER
.controller('change_questionsCtrl', function($scope, UserService, $stateParams, $state, phpUsers, $ionicPopup) {
        
    var request = {
        question: "q".concat($stateParams.question),
        answer: "a".concat($stateParams.question)
    };
    $scope.buttons = [{text: "Yes", value: 1}, {text: "No", value: 0}];
    $scope.myquestion = { newquestion: null, newanswer: null };

    phpUsers.get_question(parseInt(UserService.id), request.question, request.answer)
        .then(function(response) {
            $scope.myquestion.initialquestion = response.data['0'];
            $scope.myquestion.newanswer = parseInt(response.data['1']);
        });
    
    if ($stateParams.question == '1') {
        $scope.vieworder = 'First';
    } else if ($stateParams.question == '2') {
        $scope.vieworder = 'Second';
    } else {
        $scope.vieworder = 'Third';
    };

    $scope.show_confirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Change question',
            template: 'Are you sure you want to change you question? All data about it will be erased.'
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('You are sure');
                phpUsers.edit_question(UserService.id, request.question, request.answer, $scope.myquestion.newquestion, $scope.myquestion.newanswer)
                    .then(function() {
                        $state.go('sidemenu.my_profile');
                    });
            } else {
                console.log('You are not sure');
            };
        });
    };
})


.controller('settingsCtrl', function($scope, UserService, phpUsers, $state, $ionicPopup) {
    $scope.data = {
        date: Boolean(UserService.date),
        friends: Boolean(UserService.friends),
        work: Boolean(UserService.work),
        fun: Boolean(UserService.fun),
        hobbies: Boolean(UserService.hobbies),
        other: Boolean(UserService.other),
        male: Boolean(UserService.male),
        female: Boolean(UserService.female) ,
        min_age: UserService.min_age,
        max_age: UserService.max_age,
        distance: UserService.distance
    };

    $scope.saveButton = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Change preferences',
            template: 'Are you sure you want to change your preferences?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                UserService.date = $scope.data.date ? 1 : 0;
                UserService.friends = $scope.data.friends ? 1 : 0;
                UserService.hobbies = $scope.data.hobbies ? 1 : 0;
                UserService.fun = $scope.data.fun ? 1 : 0;
                UserService.work = $scope.data.work ? 1 : 0;
                UserService.other = $scope.data.other ? 1 : 0;
                UserService.male = $scope.data.male ? 1 : 0;
                UserService.female = $scope.data.female ? 1 : 0;
                phpUsers.edit_preferences(UserService.id, UserService.date, UserService.friends, UserService.work, UserService.fun, UserService.hobbies, UserService.other, UserService.male, UserService.female)
                    .then(function() {
                        $state.go('sidemenu.home_questions');
                    });
            } else {
                console.log('You are not sure');
            };
        });
    };
})


//TESTING CTRL
.controller('testCtrl', function($scope) {

    $scope.show = false;
    $scope.testButton = function() {
        var demo = document.getElementsByClassName('demo')[0];
        $scope.testText = "Test worked!";
        $scope.show = !$scope.show;
    };
})