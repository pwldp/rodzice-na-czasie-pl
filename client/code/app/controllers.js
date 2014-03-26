angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            $('#application_loader').show();
            //console.log("loadshow");
            //console.log(data);
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                // do something on success
                // todo hide the spinner
                $('#application_loader').hide();
                //console.log("loadhide");
                return response;

            }, function (response) {
                // do something on error
                // todo hide the spinner
                $('#application_loader').hide();
                //console.log("loadhide");
                return $q.reject(response);
            });
        };
    })
    .factory('Docs', function($resource) {
        return $resource('docs/:docId', {}, {
                query: {method: 'GET',
                        params: {docId: 'docs.json'},
                        isArray: true }
        });
    });



var kidsApp = angular.module('kidsApp', ['ssAngular', 'ngCookies', 'SharedServices'])
    .config(function(authProvider,$routeProvider,$locationProvider,$httpProvider) {
    authProvider.authServiceModule('authorization');	// server/rpc/authorization
    authProvider.loginPath('/login');
    $routeProvider.
        when('/login', {controller:'AuthCtrl', templateUrl:'login.html'}).
//        when('/app', {controller:'SSCtrl', templateUrl:'app.html'}).
        when('/home', {controller:'homeCtrl', templateUrl: 'home.html', reloadOnSearch: false}).
        when('/search', {templateUrl: 'search.html', controller: 'searchCtrl', reloadOnSearch: true}).
        when('/kids', {controller:'kidsCtrl', templateUrl: 'kids.html', reloadOnSearch: false}).
        when('/kidsEdit/:kidId', {controller:'kidsEditCtrl', templateUrl: 'kids_edit.html', reloadOnSearch: false}).
        when('/kidsSecondParent/:kidId', {controller:'kidsSecondParentCtrl', templateUrl: 'kids_second_parent.html', reloadOnSearch: false}).
        when('/kidsDelete/:kidId', {controller:'kidsDeleteCtrl', templateUrl: 'delete.html', reloadOnSearch: false}).
        when('/kidsTimetable', {templateUrl: 'kids_timetable.html', controller: 'kidsTimetableCtrl', reloadOnSearch: false}).
        when('/kidsTimetable/:kidId', {templateUrl: 'kids_timetable.html', controller: 'kidsTimetableCtrl', reloadOnSearch: false}).
        //when('/kidsSchool/:kidId', {templateUrl: 'kids_school.html', controller: 'kidsSchoolCtrl', reloadOnSearch: false}).
        when('/kidsComments/:kidId', {templateUrl: 'kids_comments.html', controller: 'kidsCommentsCtrl', reloadOnSearch: false}).
        when('/schools', {templateUrl: 'schools.html', controller: 'schoolsCtrl', reloadOnSearch: false}).
        when('/schoolsDetails', {templateUrl: 'schools_details.html', controller: 'schoolsDetailsCtrl', reloadOnSearch: false}).
        when('/schoolsDetails/:schoolId', {templateUrl: 'schools_details.html', controller: 'schoolsDetailsCtrl', reloadOnSearch: false}).
        when('/teacherAbuse/:teacherId', {controller:'teacherAbuseCtrl', templateUrl: 'abuse.html', reloadOnSearch: false}).
        when('/schoolClassDetails', {templateUrl: 'schoolclass_details.html', controller: 'schoolClassDetailsCtrl', reloadOnSearch: false}).
        when('/schoolClassDetails/:schoolId/:schoolclassId', {templateUrl: 'schoolclass_details.html', controller: 'schoolClassDetailsCtrl', reloadOnSearch: false}).
        when('/schoolClassStudentDelete/:schoolId/:schoolclassId/:studentId', {templateUrl: 'delete_from_class.html', controller: 'schoolClassStudentDeleteCtrl', reloadOnSearch: false}).
        when('/studentAbuse/:studentId', {controller:'studentAbuseCtrl', templateUrl: 'abuse.html', reloadOnSearch: false}).
        when('/teachers', {templateUrl: 'teachers.html', controller: 'teachersCtrl', reloadOnSearch: false}).
        when('/chat', {templateUrl: 'chat.html', controller: 'chatCtrl', reloadOnSearch: false}).
        when('/chat/:userId', {templateUrl: 'chat_form.html', controller: 'chatCtrl', reloadOnSearch: false}).
        when('/news', {templateUrl: 'news.html', controller: 'newsCtrl', reloadOnSearch: false}).
        when('/news/:groupId', {templateUrl: 'news.html', controller: 'newsCtrl', reloadOnSearch: false}).
        when('/newsDelete/:newsId', {controller:'newsDeleteCtrl', templateUrl: 'delete.html', reloadOnSearch: false}).
        when('/newsCommentsDelete/:commentId', {controller:'newsCommentsDeleteCtrl', templateUrl: 'delete.html', reloadOnSearch: false}).
        when('/contacts', {templateUrl: 'contacts.html', controller: 'contactsCtrl', reloadOnSearch: false}).
        when('/contactsInvite/:userId', {templateUrl: 'search.html', controller: 'contactsInviteCtrl', reloadOnSearch: false}).
        when('/contactsDelete/:contactId', {controller:'contactsDeleteCtrl', templateUrl: 'delete.html', reloadOnSearch: false}).
        when('/groups', {templateUrl: 'groups.html', controller: 'groupsCtrl', reloadOnSearch: false}).
        when('/groupsDetails/:groupId', {templateUrl: 'groups_details.html', controller: 'groupsDetailsCtrl', reloadOnSearch: false}).
        when('/groupsEdit/:groupId', {controller:'groupsEditCtrl', templateUrl: 'groups_edit.html', reloadOnSearch: false}).
        when('/groupsLeave/:groupId', {controller:'groupsLeaveCtrl', templateUrl: 'groups_leave.html', reloadOnSearch: false}).
        when('/groupsDelete/:groupId', {controller:'groupsDeleteCtrl', templateUrl: 'delete.html', reloadOnSearch: false}).
        when('/documents', {templateUrl: 'documents.html', controller: 'documentCtrl', reloadOnSearch: false}).
        when('/polls', {templateUrl: 'polls.html', controller: 'pollsCtrl', reloadOnSearch: false}).
        when('/budget', {templateUrl: 'budget.html', controller: 'budgetCtrl', reloadOnSearch: false}).
        when('/calendar', {templateUrl: 'calendar.html', controller: 'calendarCtrl', reloadOnSearch: false}).
        when('/userProfile', {templateUrl: 'user_profile.html', controller: 'userProfileCtrl', reloadOnSearch: false}).
        when('/userPrivacy', {templateUrl: 'user_privacy.html', controller: 'userPrivacyCtrl', reloadOnSearch: false}).
        when('/userNotifications', {templateUrl: 'user_notifications.html', controller: 'userNotificationsCtrl', reloadOnSearch: false}).
        otherwise({redirectTo:'/home', templateUrl: 'home.html', reloadOnSearch: false});
//      when('/get', {controller:'SSCtrl', templateUrl:'app.html'}).
//      otherwise({redirectTo:'/app'});
    $locationProvider.html5Mode(true);
})



.run( function($rootScope, $location, rpc, $routeParams, $cookies, $cookieStore) {
    //if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
    //    if(!console) { var console = {}; console['log'] = function(string) {}; }
    //}


    //$("#wrapper").css('visibility', 'visible');
    //$("#main_application_logo").css('visibility', 'visible');

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        //console.log("ss");
        //console.log(ss.server._events);
        if((ss.server._events).hasOwnProperty('application_is_ready')) {
            console.log('application ready');
            console.log(ss.server._events.application_is_ready);
        }
        else {
            console.log('not ready');
            do { setTimeout(function() {
                console.log("Wywoluje authorization.authenticated");
                var promiseAuth = rpc("authorization.authenticated");
                //console.log(promiseAuth);
                promiseAuth.then(function(auth) {
                    console.log("Wywolalem authorization.authenticated");
                    console.log(auth);
                    $rootScope.authenticated = auth;
                    if (!auth) {
                        console.log("app.LISTENER: USER NOT LOGGED IN");
    	                console.log("location->login");
    	                $location.path("/login");
                        $("#wrapper").css('visibility', 'visible');
                        $("#main_application_logo").css('visibility', 'visible');
                    } else {
                        console.log("app.LISTENER: USER LOGGED IN");
                        if($rootScope.kids.length == 0) {
                            console.log("Sprawdzam userInfo w .run");
                            console.log($rootScope.userInfo);
                            if($rootScope.userInfo === undefined)
                                $rootScope.getUserInfo();
                            $rootScope.kids = [];
                            $rootScope.getKids();
                            //$rootScope.getUsersList();
                            $rootScope.getFriendsGroup();
                        }
                        if(next.templateUrl == "login.html") {
                            $location.path("/home");
                            $("#wrapper").css('visibility', 'visible');
                            $("#main_application_logo").css('visibility', 'visible');
                        }
                        //console.log($location);
                        //console.log(next);
                        //console.log(current);
                        //$location.path("/" + current.controller.replace("Ctrl", ""));
                    }
                });
            }, 1500); }
            while((ss.server._events).hasOwnProperty('application_is_ready'));
        }
        //console.log(auth);
        //if(auth) console.log("auth-true");
        //else console.log("auth-false");
        //showLoader();
        //console.log(parent.location.href);
        //console.log($routeParams);
        //console.log("event");
        //console.log(event);
        //console.log("-------------------");
        //console.log("next");
        //console.log(next);
        //console.log("-------------------");
        //console.log("current");
        //console.log(current);
        
        //hideLoader(); 
    });

})
.directive('searchautocomplete', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<input name="autocomplete" type="text" />',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.list, function(value) {
                element.autocomplete({
                    source: value,
                    minLength: 2,
                    select: function(event, ui) {
                        setSearchValue(ui.item.id);
                        scope[attrs.selection] = ui.item.value;
                        scope.$apply();
                    }
                }).data("autocomplete")._renderItem = function (ul, item) {
                    var tmpvals = item.value.split("__||__");
                    item.id = tmpvals[1];
                    item.avatar = "/images/avatar.png";
                    item.label = tmpvals[0];
                    item.value = tmpvals[0];
                    return $("<li></li>")
                            .data("item.autocomplete", item)
                            .append('<a onclick="setSearchValue(\'' + tmpvals[1] + '\');"><div style="height: 30px; border-bottom: 1px solid #cccccc; color: #220022; cursor: pointer;"><img src="' + item.avatar + '" align="left" width="26" height="26" />&nbsp;' + item.label + '</div></a>')
                            .appendTo(ul);
                };
            });
        }
    }
})
.directive('myDatepicker', function ($parse) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
        var theDate = new Date();
        var next_year = theDate.getFullYear()+1;
        $(function(){
            element.datepicker({
                //showOn:"both",
                changeYear:true,
                changeMonth:true,
                dateFormat:'yy-mm-dd',
                monthNamesShort: [ "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru" ],
                //maxDate: new Date(),
                yearRange: '1920:'+next_year,
                onSelect:function (dateText, inst) {
                    scope.$apply(function(scope){
                        // Change binded variable
                        ngModel.assign(scope, dateText);
                    });
                }
            });
        });
    }
})
.filter("notDeleted", function(){
    return function(input, test){
        var newArray = [];
        for(var x = 0; x < input.length; x+=2) {
             if((input[x].deleted).toString() != "true")
                 newArray.push(input[x]);   
        }
        return newArray;
    }
})








/**************************************************************************************************************************** 

AuthCtrl 

*****************************************************************************************************************************/

.controller('AuthCtrl',['$scope', '$location', '$log', '$cookies', '$cookieStore', '$rootScope', 'auth', 'rpc', '$routeParams', function($scope, $location, $log, $cookies, $cookieStore, $rootScope, auth, rpc, $routeParams) {
    //console.log($routeParams);
    $('#application_loader').css('left', '44%');
    $('#application_loader').show();

    $scope.processAuth = function() {
        $('#application_loader').show();
        $scope.showError = false;
        var promise = auth.login($scope.user, $scope.password);
        promise.then(function(reason) {
            console.log("Probuje sie zalogowac i dostalem:");
            console.log("--1.1--");
            console.log(reason);
            console.log("--1.2--");
            $log.log(reason);
            var newPath = '/app';
            if($scope.redirectPath) {
                newPath = $scope.redirectPath;
            }
            console.log("Sprawdzam userInfo w AuthCtrl 2");
            console.log($rootScope.userInfo);
            if($rootScope.userInfo === undefined)
                $rootScope.getUserInfo();
            $rootScope.searchUsersList = [];
            $rootScope.searchSchoolList = [];
            $rootScope.kids = [];
            $rootScope.groups = [];
            setTimeout(function() {
                //$rootScope.getUsersList();
                $rootScope.getKids();
                $location.path(newPath);
                $('#application_loader').hide();
            }, 600);
        }, function(reason) {
            console.log("--2.1--");
            $log.log(reason);
            $scope.showError = true;
            $scope.errorMsg = "Invalid login.";
            $.jnotify("Błędny użytkownik lub hasło.", "error");
        });
    };


    $scope.confirmCookies = function() {
        console.log("confirmedCookies");
        $scope.use_cookies_confirm = '1';
        createCookie("use_cookies_confirm", 1, 99);
        //$cookieStore.put('use_cookies_confirm', 1);
        $("#rncpg_subtopper").hide();
        //console.log($cookies);
    }
    //console.log($cookies);
    /*if($cookies.use_cookies_confirm == "1") {
        $scope.use_cookies_confirm = '1';
    }
    else {
        $scope.use_cookies_confirm = '0';
    }*/

    var gc = getCookie("use_cookies_confirm");
    if(gc == "1" || gc == 1) {
        $scope.use_cookies_confirm = '1';
    }
    else {
        $scope.use_cookies_confirm = '0';
    }

    $scope.processRegister = function() {
        $scope.showError = false;
        console.log($scope.register_user);
        console.log($scope.register_password);
        console.log($scope.register_confirm_password);
        console.log($scope.register_first_name);
        console.log($scope.register_last_name);
        console.log($scope.register_city);
        /*var promise = auth.login($scope.user, $scope.password);
        promise.then(function(reason) {
            $log.log(reason);
            var newPath = '/app';
            if($scope.redirectPath) {
                newPath = $scope.redirectPath;
            }
            $rootScope.getUserInfo();
            $rootScope.searchUsersList = [];
            $rootScope.searchSchoolList = [];
            $rootScope.kids = [];
            $rootScope.groups = [];
            setTimeout(function() {
                $rootScope.getUsersList();
                $rootScope.getKids();
                $location.path(newPath);
            }, 600);
        }, function(reason) {
            $log.log(reason);
            $scope.showError = true;
            $scope.errorMsg = "Invalid login.";
        });*/
    };
    

    $scope.formregisternewuser = {};
    $scope.completeRegistrationNewUser = function(formregisternewuser) {
        console.log(formregisternewuser);
        if(formregisternewuser.pass1.length < 8) {
            $.jnotify("Podane hasło jest za krótkie. Hasło musi mieć co najmniej 8 znaków.", "error");
        }
        else if(formregisternewuser.pass1 != formregisternewuser.pass2) {
            $.jnotify("Podane hasła są różne. Proszę wpisać dwa takie same hasła.", "error");
        }
        else {
            var promiseNewUser = rpc('rpc_Registration.newUser', {'first_name': formregisternewuser.first_name, 'last_name': formregisternewuser.last_name, 'email': formregisternewuser.email, 'pswd': formregisternewuser.pass1});
            promiseNewUser.then(function(resp) {
                console.log("Wywolalem newUser() i dostalem");
                console.log(resp);
                if(resp.ret == "OK") {
                    $.jnotify("Rejestracja przebiegła pomyślnie. Sprawdź skrzynkę mailową.");
                }
                else
                    $.jnotify("Wystąpił błąd. Nie udało się zarejestrować.", "error");
                formregisternewuser.first_name = "";
                formregisternewuser.last_name = "";
                formregisternewuser.email = "";
                formregisternewuser.pass1 = "";
                formregisternewuser.pass2 = "";
            });
            
        }
    }

    $scope.formemailnewpass = {};
    $scope.requestNewPassword = function(formemailnewpass) {
        console.log(formemailnewpass);
        var promisePassReset = rpc("rpc_Registration.pswdResetInvitation", formemailnewpass.email);
        promisePassReset.then(function(resp) {
            console.log("Wywolalem pswdResetInvitation() i dostalem");
            console.log(resp);
            if(resp.ret == "OK") {
                if(resp.res.toString() == "true") {
                    $.jnotify("Sprawdź skrzynkę mailową. Wiadomość dotycząca dalszych kroków została wysłana.");
                }
                else
                    $.jnotify("Wystąpił błąd. Nie wysłano żądania zmiany hasła.", "error");
            }
            else
                $.jnotify("Wystąpił błąd. Nie wysłano żądania zmiany hasła.", "error");
            $("#rncpg_forgot_pass_form").fadeOut();
        });   
    }

    $scope.onFacebookLogin = function () {
	console.log("onFacebookLogin");
	window.location = "/auth/facebook";
    };


    $scope.contactSend = function() {
        console.log("contacted");
        var obj = {'cnt': $scope.contact_context, 'cntxt': 'page', 'cat': 'contact'};
        var promiseContact = rpc('rpc_UniForm.save', obj);
        promiseContact.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Zgłoszenie zostało wysłane. Dziękujemy!");
                $location.path("/login");
            }
        });
    }


    $scope.contentLoaded = function() {
        var still_loading = 1;
        $("#rncpg_main_image img").load(function() {
            $('#application_loader').css('left', '49%');
            $('#application_loader').hide();
            still_loading = 0;
        });
        if(still_loading == 1) {
            setTimeout(function() {
                $scope.contentLoaded();
            }, 200);
        }
    }

}])









/**************************************************************************************************************************** 

kidsMainCtrl 

*****************************************************************************************************************************/

.controller('kidsMainCtrl',['$scope', '$location', '$log', '$rootScope', 'rpc', 'auth', function($scope, $location, $log, $rootScope, rpc, auth) {
    $('#application_loader').css('left', '44%');
    $('#application_loader').show();

    
    $scope.setRoute = function(route) {
        $location.path(route);
    }
  
    //$scope.formregisternewuser = {};
    //$scope.formemailnewpass = {};

    $rootScope.getUserInfo = function() {
        //$("#application_loader").show();
        console.log("WYWOLUJE: $rootScope.getUserInfo 1");
        var promiseUserInfo = rpc("rpc_ServiceUser.getUserInfo");
        promiseUserInfo.then(function(ui) {
            console.log("Wywolalem getUserInfo() i dostalem 2");
            console.log(ui);
            $rootScope.userInfo = ui.res;
            $scope.userInfo = ui.res;
            // mam userInfo to wywoluje liste userow
            console.log("mam userInfo to wywoluje liste userow getUsersList()");
            $rootScope.getUsersList();
        });   
        //$("#application_loader").hide();
    }


    $scope.logout = function() {
        var promise = auth.logout();
        promise.then(function() { 
            $rootScope.authenticated = false;
            $location.path("/"); 
        });
    }

    $rootScope.searchUsersList = [];
    $rootScope.searchUsersListIdsByNames = [];
    $rootScope.usersList = [];
    $rootScope.getUsersList = function() {
        //$("#application_loader").show();
        var promiseUsersList = rpc("rpc_ServiceUser.getListUsers");
        promiseUsersList.then(function(usersList) {
            $rootScope.searchUsersList = [];
            $rootScope.usersList = [];
            console.log("Wywolalem getUsersList() i dostalem");
            console.log(usersList);
            if(usersList.hasOwnProperty("res")) {
                for(var i=0; i<usersList.res.length; i++) {
                    if($rootScope.userInfo.id != usersList.res[i].id) {
                        $rootScope.usersList.push(usersList.res[i]);
                        $rootScope.searchUsersList.push(usersList.res[i].first_name + " " + usersList.res[i].last_name + "__||__" + usersList.res[i].id);
                        var tmpobj = {};
                        tmpobj[usersList.res[i].first_name + " " + usersList.res[i].last_name] = usersList.res[i].id;
                        $rootScope.searchUsersListIdsByNames.push(tmpobj);
                    }
                }
            }
        });
        //$("#application_loader").hide();
    }
    
    
    $rootScope.kids = [];
    $rootScope.getKids = function() {
        //$("#application_loader").show();
        var promiseKids = rpc("rpc_Kid.getKidsInfo");
        promiseKids.then(function(kids) {
            console.log("Wywolalem getKidsInfo() i dostalem");
            console.log(kids);
            $scope.kids = [];
            $rootScope.kids = [];
            for(var i=0; i<kids.res.length; i++) {
                kids.res[i].schools.sort(function(obj1, obj2) {
                    return obj2.school_year - obj1.school_year;
                });
                kids.res[i].age = getAge(kids.res[i].born_date);
                kids.res[i]['active_classes'] = [];
                for(var ac=0; ac<kids.res[i].schools.length; ac++) {
                    var dt = new Date();
                    var year1 = parseInt(dt.getFullYear());
                    var year2 = parseInt(dt.getFullYear())-1;
                    if(kids.res[i].schools[ac].school_year.toString() == year1.toString() || kids.res[i].schools[ac].school_year.toString() == year2.toString()) {
                        if((kids.res[i].schools[ac].deleted).toString() == "false")
                            kids.res[i].active_classes.push(kids.res[i].schools[ac]);
                    }
                    if(kids.res[i].active_classes.length > 0)
                        kids.res[i]['first_active_class'] = kids.res[i].active_classes[0];
                    else
                        kids.res[i]['first_active_class'] = {};
                }
                if((kids.res[i].deleted).toString() == "false") {
                    $rootScope.kids.push(kids.res[i]);
                    $scope.kids.push(kids.res[i]);
                }
                //usersList.res[i].id
            }
            //console.log($scope.kids);
            //console.log($rootScope.kids);
        });
        //$("#application_loader").hide();
    }
    

    $rootScope.invitations = {};
    $rootScope.invitations['friends'] = {};
    $rootScope.invitations.friends['count'] = 0;
    $rootScope.invitations.friends.invitations = [];
    $rootScope.invitations['groups'] = {};
    $rootScope.invitations.groups['count'] = 0;
    $rootScope.invitations.groups.invitations = [];
    $rootScope.getGroupInvitations = function() {
        //$("#application_loader").show();
        var invitations = {};
        var promiseInvitations = rpc("rpc_ServiceGroup.getGroupInvitations");
        promiseInvitations.then(function(invitations) {
            console.log("Wywolalem getGroupInvitations() i dostalem");
            console.log(invitations);
            $scope.invitations = {};
            $scope.invitations['friends'] = {};
            $scope.invitations.friends['count'] = 0;
            $scope.invitations.friends.invitations = [];
            $scope.invitations['groups'] = {};
            $scope.invitations.groups['count'] = 0;
            $scope.invitations.groups.invitations = [];
            $rootScope.invitations = {};
            $rootScope.invitations['friends'] = {};
            $rootScope.invitations.friends['count'] = 0;
            $rootScope.invitations.friends.invitations = [];
            $rootScope.invitations['groups'] = {};
            $rootScope.invitations.groups['count'] = 0;
            $rootScope.invitations.groups.invitations = [];
            for(var i=0; i<invitations.res.length; i++) {
                if(invitations.res[i].grp_type == "friends") {
                    $rootScope.invitations.friends.count = $rootScope.invitations.friends.count + 1;
                    $scope.invitations.friends.count = $scope.invitations.friends.count + 1;
                    $rootScope.invitations.friends.invitations.push(invitations.res[i]);
                    $scope.invitations.friends.invitations.push(invitations.res[i]);
                }
                else {
                    $rootScope.invitations.groups.count = $rootScope.invitations.groups.count + 1;
                    $scope.invitations.groups.count = $scope.invitations.groups.count + 1;
                    $rootScope.invitations.groups.invitations.push(invitations.res[i]);
                    $scope.invitations.groups.invitations.push(invitations.res[i]);
                }
            }
            console.log("$rootScope.invitations.groups");
            console.log($rootScope.invitations.groups);
            console.log("$rootScope.invitations.friends");
            console.log($rootScope.invitations.friends);
            if($rootScope.invitations.groups.count > 0)
                createNotification("groups", $rootScope.invitations.groups.count, "Zostałeś zaproszony do grupy");
            if($rootScope.invitations.friends.count > 0)
                createNotification("contacts", $rootScope.invitations.friends.count, "Zostałeś zaproszony do znajomych");
        });
        //$("#application_loader").hide();
    }
    
    
    $rootScope['count_unread_messages'] = 0;
    $rootScope.getMsgUnread = function() {
        var promiseMsg = rpc('rpc_Msg.getMsgList', {'folder': 'inbox', 'read':false});
        promiseMsg.then(function(messages) {
            console.log("Wywolalem getMsgList() i dostalem");
            console.log(messages);
            if(messages.ret == "OK") {
                $rootScope.count_unread_messages = messages.res.length;
            }
            if($rootScope.count_unread_messages > 0)
                createNotification("chat", $rootScope.count_unread_messages, "Masz nowe wiadomości");
            
        });
    }



    $rootScope.friendsGroup = {};
    $scope.friendsGroup = {};
    $rootScope.getFriendsGroup = function() {
        //$("#application_loader").show();
        var promiseContacts = rpc('rpc_ServiceGroup.getGroupFriends');
        promiseContacts.then(function(friends) {
            console.log("Wywolalem getGroupFriends() i dostalem");
            console.log(friends);
            if(friends.ret == "OK") {
                $rootScope.friendsGroup = friends.res;
                $scope.friendsGroup = friends.res;
                
            }
            else
                $.jnotify("Nie można pobrać grupy znajomych użytkownika: " + friends.msg, "error");
        });
        //$("#application_loader").hide();
    }


    if($rootScope.authenticated) {
        //setTimeout(function() {
            console.log("Sprawdzam userInfo w MainCtrl 3");
            console.log($rootScope.userInfo);
            if($rootScope.userInfo === undefined)
                $rootScope.getUserInfo();
            $rootScope.getKids();
            $rootScope.getGroupInvitations();
            $rootScope.getMsgUnread();
            $rootScope.getFriendsGroup();
        //}, 1000);
    }



    $rootScope.setSearch = function() {
        $scope.searched_users = [];
        console.log($("#f_search_users").val());
        console.log($("#f_search_users").val().length);
        if($("#f_search_users").val().length < 2) {
            $.jnotify("Wpisz przynajmniej 2 znaki w pole wyszukiwania.", "warning");
        }
        else {
            for(var i=0; i<$rootScope.usersList.length; i++) {
                if($("#search_selected_id").text() != "") {
                    if(($rootScope.usersList[i].id).toString() == ($("#search_selected_id").text()).toString()) {
                        $scope.searched_users.push($rootScope.usersList[i]);
                    }
                }
                else {
                    if(($rootScope.usersList[i].first_name).toLowerCase().indexOf($("#f_search_users").val()) > -1 || ($rootScope.usersList[i].last_name).toLowerCase().indexOf($("#f_search_users").val()) > -1) {
                        $scope.searched_users.push($rootScope.usersList[i]);
                    }
                }
            }
            setTimeout(function() {
                createMainTooltip(".bottom_box_options_icons");
                $("#search_selected_id").text('');
                $("#f_search_users").val('');
                setSearchValue('');
            }, 800);
            $location.path("/search");
        }
    }
    
    
    $('#application_loader').css('left', '49%');
    $('#application_loader').hide();

}])









/**************************************************************************************************************************** 

searchCtrl 

*****************************************************************************************************************************/

.controller('searchCtrl',['$scope', '$location', '$log', 'pubsub', 'auth', 'rpc', '$rootScope', function($scope, $location, $log, pubsub, auth, rpc, $rootScope) {
    clearTooltips();
    $('#application_loader').show();
    
    $("#module_title").html('Wyszukiwanie znajomych');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Other/Search_31x31.png');

    $rootScope.setSearch();

    $scope.getFriendsGroupMembers = function() {
        var promiseMembers = rpc('rpc_ServiceGroup.getGroupMembers', $rootScope.friendsGroup.group.id);
        promiseMembers.then(function(friends) {
            console.log("Wywolalem getGroupMembers() i dostalem");
            console.log(friends);
            if(friends.ret == "OK") {
                var my_friends_ids = [];
                for(var i=0; i<friends.res.members.length; i++) {
                    my_friends_ids.push(friends.res.members[i].id);
                }
                for(var ii=0; ii<$scope.searched_users.length; ii++) {
                    if($.inArray($scope.searched_users[ii].id, my_friends_ids) > -1)
                        $scope.searched_users[ii]['my_friend'] = '1';
                    else
                        $scope.searched_users[ii]['my_friend'] = '0';
                }

                createMainTooltip(".bottom_box_options_icons_search");
            }
            else
                $.jnotify("Nie można pobrać grupy znajomych użytkownika: " + friends.msg, "error");
        });
    }

    $scope.inviteUser = function(userId) {
        jConfirm("Czy na pewno wysłać zaproszenie do użytkownika?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm('Czy na pewno wysłać zaproszenie do użytkownika?'); 
          if(agree)  {
            $location.path('/contactsInvite/' + userId);
          }
        });
    }


    $scope.getFriendsGroupMembers();
    $('#application_loader').hide();
}])









/**************************************************************************************************************************** 

homeCtrl 

*****************************************************************************************************************************/

.controller('homeCtrl',['$scope', '$location', '$log', 'pubsub', 'auth', 'rpc', '$rootScope', function($scope, $location, $log, pubsub, auth, rpc, $rootScope) {
    clearTooltips();
    $('#application_loader').show();

    $("#module_title").html('Witaj w serwisie RodziceNaCzasie.pl');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Other/Home_32x32.png');


    $scope.invite = {};
    $scope.sendExternalInvitation = function(invite) {
        console.log(invite);
        var promiseMembers = rpc('rpc_Invitation.sendInvitation', [invite.email]);
        promiseMembers.then(function(invitation) {
            console.log("Wywolalem sendInvitation() i dostalem");
            console.log(invitation);
            if(invitation.ret == "OK") {
                $.jnotify("Zaproszenie zostało wysłane. Będzie ważne przez 7 dni.");
                $scope.invite.email = "";
            }
            else
                $.jnotify("Nie można wysłać zaproszenia: " + friends.msg, "error");
        });
    } 


    $scope.posts = [];
    $scope.getPosts = function(limit, offset, filter, group_ids, clear) {
        var obj = {'limit':limit, 'offset':offset, 'filter':filter};
        var promisePost = rpc('rpc_Post.getPosts', obj);
        promisePost.then(function(posts) {
            console.log("Wywolalem getPosts() z homeCtrl i dostalem");
            console.log(posts);
            if(posts.ret == "OK") {
                for(var i=0; i<posts.res.length; i++) {
                    var post = posts.res[i];
                    post['created'] = posts.res[i]['edited_dt'];
                    post['created_text'] = getDateText(post['created']);
                    post['content_short'] = posts.res[i].content.substr(0, 60) + "...";
                    post['comments'] = [];
                    post['comments_to_show'] = [];
                    if(post.owner == $scope.userInfo.id) {
                        post['owner_obj'] = {};
                        post.owner_obj = $scope.userInfo;
                    }
                    else {
                        post['owner_obj'] = {};
                        if($rootScope.usersList.length > 0) {
                            $.each($rootScope.usersList, function(idx, user) {
                                if(user.id == post.owner) {
                                    post.owner_obj = user;
                                }
                            });
                        }
                        else {
                            // jesli nie ma jeszcze listy userow, wywoluje userinfo
                            var promiseUserInfo = rpc("rpc_ServiceUser.getUserInfo", post.owner);
                            promiseUserInfo.then(function(ui) {
                                post.owner_obj = ui.res;
                            }); 
                        }
                    }
                    $scope.posts.push(post);
                    //createMainTooltip(".del_link_posts");
                    //fitPostContents();
                }
            }
        });
    }
    

    
    $scope.groups = [];
    /* pobranie grup uzytkownika */
    $scope.getGroups = function() {
        var promiseGroups = rpc('rpc_ServiceGroup.getListGroups');
        promiseGroups.then(function(groups) {
            console.log("Wywolalem getListGroups() i dostalem");
            console.log(groups);
            if(groups.ret == "OK") {
               for(var g=0; g<groups.res.length; g++) {
                   $scope.groups.push(groups.res[g]);
               }
               $scope.getPolls();
            }
        });
        
    }
    $scope.getGroups();

    $scope.polls = [];
    $scope.getPolls = function() {
        var poll_groups = [];
        for(var g=0; g<$scope.groups.length; g++) {
            poll_groups.push($scope.groups[g].id);
        }
        //var obj = {'groups': poll_groups};
        var promiseGroups = rpc('rpc_Poll.getPolls');
        console.log('rpc_Poll.getPolls');
        promiseGroups.then(function(polls) {
            console.log("Wywolalem getPolls() i dostalem");
            console.log(polls);
            var dt = new Date();
            if(polls.ret == "OK") {
                for(var p=0; p<polls.res.length; p++) {

                    if((polls.res[p].voted).hasOwnProperty('choice'))
                        polls.res[p]['i_voted'] = 1;
                    else
                        polls.res[p]['i_voted'] = 0;
                    
                    var dtstart = Date.parse(polls.res[p].dt_start);
                    var dtstop = Date.parse(polls.res[p].dt_stop);
                    var dttoday = dt.getTime();
                    polls.res[p]['dtstart'] = (polls.res[p].dt_start).toString().substr(0, 10);
                    polls.res[p]['dtstop'] = (polls.res[p].dt_stop).toString().substr(0, 10);
                    if(dtstart <= dttoday && dtstop >= dttoday)
                        $scope.polls.push(polls.res[p]);
                }
            }
        });
    }
    

    $scope.common_cases = [];
    $scope.common_cases_icons = [];
    $scope.common_cases_icons['configuration'] = '/images/Metro_Icons/Folders_OS/Configure_alt_1_46x46.png';
    $scope.common_cases_icons['kids'] = '/images/Metro_Icons/System_Icons/User_Accounts_46x46.png';
    $scope.common_cases_icons['school'] = '/images/Metro_Icons/Folders_OS/Libraries_46x46.png';
    $scope.common_cases_icons['schoolclass'] = '/images/Metro_Icons/Folders_OS/Libraries_46x46.png';
    $scope.common_cases_icons['timetable'] = '/images/Metro_Icons/Folders_OS/Groups_46x46.png';
    $scope.common_cases_icons['calendar'] = '/images/Metro_Icons/Applications/Calendar_46x46.png';
    $scope.common_cases_icons['news'] = '/images/Metro_Icons/Applications/Messaging_alt_46x46.png';
    $scope.common_cases_icons['contacts'] = '/images/Metro_Icons/System_Icons/Contacts_46x46.png';

    $scope.getCommonCases = function() {
        //console.log("scope.userInfo");
        //console.log($scope.userInfo);
        if($scope.userInfo.first_name == "" || $scope.userInfo.last_name == "" || $scope.userInfo.city_name == "" || $scope.userInfo.postcode == "") {
            var obj = {'icon': $scope.common_cases_icons['configuration'], 'text':'Uzupełnij swoje dane w Profilu Użytkownika', 'more':'link', 'link':'/userProfile'};
            $scope.common_cases.push(obj);
        }
        var promiseNotif = rpc("rpc_Notification.getNotifications");
        promiseNotif.then(function(notif) {
            console.log("Wywolalem getNotifications i otrzymalem:");
            console.log(notif);
            if(notif.ret == "OK") {
                for(var i=0; i<notif.res.length; i++) {
                    if(notif.res[i].status == "waiting") {
                        var obj = notif.res[i];
                        obj['icon'] = $scope.common_cases_icons[notif.res[i].type];
                        obj['text'] = notif.res[i].note;
                        obj['more'] = 'buttons';
                        $scope.common_cases.push(obj);
                    }
                }
            }
            
        });
    }
    

    $scope.confirmNotification = function(notif) {
        console.log("confirmNotification");
        console.log(notif);
            // update notification - zmiana status = confirmed
            
        if(notif.payload.procedure == "second_parent") {
            jConfirm("Czy na pewno chcesz zatwierdzić informację?", 'Confirmation Dialog', function(agree) {
            //var agree = confirm("Czy na pewno chcesz zatwierdzić informację?");
              if(agree) {
                // drugi opiekun dziecka
                var promiseConfNotiv = rpc("rpc_Kid.confirmKidParent", notif.payload.kid_id);
                promiseConfNotiv.then(function(resp) {
                    console.log("Wywolalem confirmKidParent i otrzymalem:");
                    console.log(resp);
                    if(resp.ret == "OK") {
                        $rootScope.getKids();
                        $.jnotify("Informacja została potwierdzona. Zostałeś dopisany jako opiekun dziecka.");
                    }            
                });
                var not = {'id': notif.id, 'status':'confirmed'};
                console.log(not);
                var promiseConfirmed = rpc("rpc_Notification.putNotification", not);
                promiseConfirmed.then(function(resp) {
                    console.log("Wywolalem putNotification i otrzymalem:");
                    console.log(resp);
                });
                for(var i=0; i<$scope.common_cases.length; i++) {
                    if($scope.common_cases[i].id == notif.id) {
                        $scope.common_cases.splice(i, 1);
                    }
                }
              }
            });
        }
        if(notif.payload.procedure == "kid_added_to_class_by_teacher") {
            // nauczyciel zaproponowal dziecko w klasie
            $scope.case_detail = {};
            $scope.case_detail['kid_first_name'] = notif.payload.kid_first_name;
            $scope.case_detail['kid_last_name'] = notif.payload.kid_last_name;
            $(".buttons_" + notif.id).hide();
            $("#case_" + notif.id).css('display', 'block');
            // reszta w confirmNotification2   
        }
    }
    

    $scope.confirmNotification2 = function(notif) {
        console.log("confirmNotification2");
        console.log(notif);
        jConfirm("Czy na pewno chcesz zatwierdzić wybór?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno chcesz zatwierdzić wybór?");
          if(agree) {
            var kid_id = "0";
            $(".case_kid_radio").each(function() {
                if($(this).attr('checked')) {
                    kid_id = $(this).attr('id').replace("case_kid_radio_", "");
                }
            });    
            if(kid_id == "0") {
                // nie ma id czyli trzeba najpierw dopisac dziecko do uzytkownika
                var dt = new Date();
                var new_kid = {};
                new_kid['first_name'] = notif.payload.kid_first_name;
                new_kid['last_name'] = notif.payload.kid_last_name;
                new_kid['gender'] = "male";
                new_kid['born_date'] = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate();
                var school_class_id = notif.payload.school_class_id;
                var notif_id = notif.id;
                var promiseNewKid = rpc("rpc_Kid.putKid", new_kid);
                promiseNewKid.then(function(kid) {
                    console.log("Wywolalem putKid z Notification i otrzymalem");
                    console.log(kid);
                    $.jnotify("Dziecko zostało dodane do Twojej listy dzieci. Uzupełnij jego dane.");

                    console.log(kid.res.id);
                    console.log(school_class_id);
                    
                    var promiseSchool = rpc("rpc_School.addKidToClassByParent", kid.res.id, school_class_id);
                    promiseSchool.then(function(student) {
                        console.log("Wywolalem addKidToClassByParent() z Notification i dostalem");
                        console.log(student);
                        if(student.ret == "OK") {
                            $.jnotify("Dziecko zostało dopisane do klasy.");

                            var not = {'id': notif_id, 'status':'confirmed'};
                            console.log(not);
                            var promiseConfirmed = rpc("rpc_Notification.putNotification", not);
                            promiseConfirmed.then(function(resp) {
                                console.log("Wywolalem putNotification i otrzymalem:");
                                console.log(resp);
                            });
                            for(var i=0; i<$scope.common_cases.length; i++) {
                                if($scope.common_cases[i].id == notif_id) {
                                    $scope.common_cases.splice(i, 1);
                                }
                            }
                        }
                        else
                            $.jnotify("Wystąpił błąd! Nie udało się dopisać dziecka do klasy: " + student.msg, "error");
                    });
                    $rootScope.getKids();
                    
                });
            }
            else {
                // jest id czyli uzytkownik ma takie dziecko na swojej liscie
                var promiseSchool = rpc("rpc_School.addKidToClassByParent", kid_id, notif.payload.school_class_id);
                promiseSchool.then(function(student) {
                    console.log("Wywolalem addKidToClassByParent() z Notification i dostalem");
                    console.log(student);
                    if(student.ret == "OK") {
                        $.jnotify("Dziecko zostało dopisane do klasy.");

                        var not = {'id': notif.id, 'status':'confirmed'};
                        console.log(not);
                        var promiseConfirmed = rpc("rpc_Notification.putNotification", not);
                        promiseConfirmed.then(function(resp) {
                            console.log("Wywolalem putNotification i otrzymalem:");
                            console.log(resp);
                        });
                        for(var i=0; i<$scope.common_cases.length; i++) {
                            if($scope.common_cases[i].id == notif.id) {
                                $scope.common_cases.splice(i, 1);
                            }
                        }
                    }
                    else
                        $.jnotify("Wystąpił błąd! Nie udało się dopisać dziecka do klasy: " + student.msg, "error");
                });
            }
          }
        });
    }

    $scope.rejectNotification = function(notif) {
        console.log("rejectNotification");
        console.log(notif);
        jConfirm("Czy na pewno chcesz odrzucić informację?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno chcesz odrzucić informację?");
          if(agree) {
            var not = {'id': notif.id, 'status':'rejected'};
            console.log(not);
            var promiseConfirmed = rpc("rpc_Notification.putNotification", not);
            promiseConfirmed.then(function(resp) {
                console.log("Wywolalem putNotification i otrzymalem:");
                console.log(resp);
            });
            for(var i=0; i<$scope.common_cases.length; i++) {
                if($scope.common_cases[i].id == notif.id) {
                    $scope.common_cases.splice(i, 1);
                }
            }        
          }
        });
    }


    setTimeout(function() {
        if($rootScope.authenticated) {
            $rootScope.getUserInfo();
        }

        if($rootScope.invitations.groups.count > 0)
            createNotification("groups", $rootScope.invitations.groups.count, "Zostałeś zaproszony do grupy");
        if($rootScope.invitations.friends.count > 0)
            createNotification("contacts", $rootScope.invitations.friends.count, "Zostałeś zaproszony do znajomych");
        //createNotification("news", 12, "Nowe dyskusje oczekują na Ciebie");
        //createNotification("budget", 1, "Nowe składki");
        //createNotification("calendar", 1, "Nowe wydarzenia");
        createMainTooltip(".img_home_help");
        createMainTooltip(".home_voted");

        if($rootScope.authenticated) {
            $rootScope.getKids();
            $rootScope.getGroupInvitations();
            $rootScope.getMsgUnread();
            $rootScope.getFriendsGroup();
            $scope.getPosts(5, 0, 'all', [], 1);
        }
        $scope.getCommonCases();

        $('#application_loader').hide();
    }, 1000);

}])









/**************************************************************************************************************************** 

kidsCtrl 

*****************************************************************************************************************************/

.controller('kidsCtrl',['$scope', '$location', '$log', '$rootScope', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, auth, pubsub, rpc, model) {
    clearTooltips();
    $('#application_loader').show();    
    $scope.userInfo = $rootScope.userInfo;
    
    $("#module_title").html('Dzieci');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/User_Accounts_32x32.png');

    $scope.kidform = {};
    $scope.kids = $rootScope.kids;
    
    $scope.toSeconds = function(t) {
        var bits = t.split(':');
        return parseInt(bits[0]*3600 + bits[1]*60);
    }

    $scope.currentTimetableHour = 0; 
    $scope.getCurrentTimetableHour = function() {
        var promiseHours = rpc('rpc_SchoolTimetable.getSchoolTimetableHours', $scope.kids[0].id);
        promiseHours.then(function(hours) {
            console.log(hours);
            var dt = new Date();
            var current_time = dt.getHours() + ":" + dt.getMinutes(); 
            console.log($scope.toSeconds(current_time));
            //console.log($scope.toSeconds(hours.res.hour1.start));
            if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour1.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour1.stop)) $scope.currentTimetableHour = 1;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour2.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour2.stop)) $scope.currentTimetableHour = 2;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour3.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour3.stop)) $scope.currentTimetableHour = 3;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour4.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour4.stop)) $scope.currentTimetableHour = 4;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour5.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour5.stop)) $scope.currentTimetableHour = 5;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour6.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour6.stop)) $scope.currentTimetableHour = 6;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour7.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour7.stop)) $scope.currentTimetableHour = 7;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour8.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour8.stop)) $scope.currentTimetableHour = 8;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour9.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour9.stop)) $scope.currentTimetableHour = 9;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour10.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour10.stop)) $scope.currentTimetableHour = 10;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour11.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour11.stop)) $scope.currentTimetableHour = 11;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour12.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour12.stop)) $scope.currentTimetableHour = 12;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour13.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour13.stop)) $scope.currentTimetableHour = 13;
            else if($scope.toSeconds(current_time) >= $scope.toSeconds(hours.res.hour14.start) && $scope.toSeconds(current_time) <= $scope.toSeconds(hours.res.hour14.stop)) $scope.currentTimetableHour = 14;        
            else $scope.currentTimetableHour = 0;
        });
    }
    if($scope.kids.length > 0)
        $scope.getCurrentTimetableHour();

    $scope.getSubjectFromId = function(subject_id, kid_id) {
        var promiseMEN = rpc('rpc_SchoolSubject.getListMENSchoolSubjects');
        promiseMEN.then(function(subjects) {
            var subj = "";
            for(var i=0; i<subjects.res.length; i++) {
                if(subjects.res[i].id == subject_id) {
                    subj = subjects.res[i].descr;
                }
            }
            if(subj == "") {
                var promiseSubjects = rpc('rpc_SchoolSubject.getListUserSchoolSubjects', $scope.userInfo.id);
                promiseSubjects.then(function(subjects_add) {
                    for(var i=0; i<subjects_add.res.length; i++) {
                        if(subjects_add.res[i].id == subject_id) {
                            subj = subjects_add.res[i].name;
                        }
                    }
                });
            }
            if(subj == "") subj = "brak zajęć";
            $("#kid_now_in_school_info1" + kid_id).text(subj.toUpperCase());
        });
    }

    $scope.getNowInSchool = function(kid_id, index, day_number_today, current_hour) {
        var promiseTimetable = rpc('rpc_SchoolTimetable.getSchoolTimetable', kid_id);
        promiseTimetable.then(function(timetable) {
            console.log(timetable);
            if(timetable.ret == "OK") {
                var subject_id = timetable.res['day' + day_number_today + '_' + current_hour].id;
                $scope.kids[index]['now_in_school'] = $scope.getSubjectFromId(subject_id, kid_id);
            }
            
        });
    }
    
    $scope.getKidTimetableInfo = function(current_hour) {
        console.log("current_hour -- " + current_hour);
        var dt = new Date();
        var day_number_today = dt.getDay(); 
        if(day_number_today == 0) day_number_today = 7;
        //console.log(day_number_today);
        for(var k=0; k<$scope.kids.length; k++) {
            $scope.kids[k]['filled_timetable'] = $scope.kids[k].stats_timetable;
            $scope.kids[k]['now_in_school'] = '';
            $scope.kids[k]['end_class_today'] = 0;
            var kid = $scope.kids[k];
            $scope.getNowInSchool($scope.kids[k].id, k, day_number_today, current_hour);  
            if(parseInt($("#kid_graph_info" + $scope.kids[k].id).text()) > 0) {
                $("#kid_stats_timetable_filled" + $scope.kids[k].id).show();
                $("#kid_stats_timetable_empty" + $scope.kids[k].id).hide();
            }
            else {
                $("#kid_stats_timetable_filled" + $scope.kids[k].id).hide();
                $("#kid_stats_timetable_empty" + $scope.kids[k].id).show();
            }
        }
    }


    



    $scope.saveKid = function(kidform) {
        var new_kid = {'first_name': kidform.kidFirstName, 'last_name': kidform.kidLastName, 
                       'born_date': kidform.kidBornDate, 'gender': kidform.kidGender,
                       'note':''};
        console.log("-------");
        console.log("WYWOLUJE putKid z obiektem:");
        console.log(new_kid);
        var promiseNewKid = rpc("rpc_Kid.putKid", new_kid);
        promiseNewKid.then(function(kid) {
            console.log("ZWROT z funkcji putKid:");
            console.log(kid);
            console.log("-------");
            if(kid.ret == "OK") {
                kid.res.school_class_id = -1;
                kid.res.school_class_name = "";
                kid.res.school_id = -1;
                kid.res.school_name = "";
                kid.res.stats_comments = 0;
                kid.res.stats_kids_in_class = 0;
                kid.res.stats_timetable = 0;
                kid.res.id = kid.res._id;
                kid.res.age = getAge(kid.res.born_date);
                kid.res['active_classes'] = [];
                $rootScope.kids.push(kid.res);
                //$scope.kids.push(kid.res);
                $scope.kids = $rootScope.kids;
                
                kidform.kidFirstName = "";
                kidform.kidLastName = "";
                kidform.kidBornDate = "";
                kidform.kidGender = "";
                $.jnotify("Dziecko zostało dodane");
                $('#hidden_forms_kids').slideUp();
                setTimeout(function() {
                    $scope.refreshTimetableGraphsId(kid.res.id);
                    $("#kid_pie_chart" + kid.res.id).sparkline([0,(168)], {type: 'pie', width: '80', height: '80', offset: -180, sliceColors: ['#4b63e0','#010c16']});
                }, 1000);
            }
            else
                $.jnotify("Wystąpił błąd. Nie można dodać dziecka: " + kid.msg, "error");
        });
        //console.log($scope.kids);
    }

    $scope.refreshTimetableGraphs = function() {
        for(var i=0; i<$rootScope.kids.length; i++) {
            $scope.refreshTimetableGraphsId($rootScope.kids[i].id);
        }
    }

    $scope.refreshTimetableGraphsId = function(kidId) {
        var promiseStats = rpc("rpc_SchoolTimetable.getSchoolTimetableSummary", kidId);
        promiseStats.then(function(stats) {
            $("#kid_pie_chart" + kidId).sparkline([stats.res.sum,(168-stats.res.sum)], {type: 'pie', width: '80', height: '80', offset: -180, sliceColors: ['#4b63e0','#010c16']});
            $("#kid_graph_info" + kidId).text(stats.res.sum);
            $scope.getKidTimetableInfo($scope.currentTimetableHour); 
        });
    }


    
    $scope.cancelKid = function() {
        $('#hidden_forms_kids').slideUp();
    }

    setTimeout(function() {
        createMainTooltip(".bottom_box_options_icons");
        $scope.refreshTimetableGraphs();
        
        if(($rootScope.kids).length == 0) {
            $("#hidden_forms_kids").show();
        }
        else {
            $("#hidden_forms_kids").hide();
        }
        
        $scope.kidform.kidGender = "male";
        

        $('#application_loader').hide();
    }, 800);


}])









/**************************************************************************************************************************** 

kidsEditCtrl 

*****************************************************************************************************************************/

.controller('kidsEditCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    
    $("#module_title").html('Dzieci');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/User_Accounts_32x32.png');

    $scope.kidformedit = {};
    $scope.kidInfo = function() {
        var promiseKid = rpc('rpc_Kid.getKid', $routeParams.kidId);
        promiseKid.then(function(kid) {
            if(kid.ret == "OK") {
                $("#module_title").html('Edycja danych - ' + kid.res.first_name + ' ' + kid.res.last_name);
                $scope.kidformedit.id = kid.res.id;
                $scope.kidformedit.kidFirstName = kid.res.first_name;
                $scope.kidformedit.kidLastName = kid.res.last_name;
                $scope.kidformedit.kidGender = kid.res.gender;
                $scope.kidformedit.kidBornDate = (kid.res.born_date).toString().substr(0, 10);
                //console.log($scope.kidformedit);  
            }
            else
                $.jnotify("Nie można pobrać danych dziecka: " + kid.msg, "error");
        });
    }
    if($routeParams.kidId !== "") {
        $scope.kidInfo();
    }
    else {
        $location.path("/kids");
    }
    
    $scope.saveKid = function(kidformedit) {
        var new_kid = {'id': kidformedit.id, 
                       'first_name': kidformedit.kidFirstName, 'last_name': kidformedit.kidLastName, 
                       'born_date': kidformedit.kidBornDate, 'gender': kidformedit.kidGender,
                       'note':''};
        console.log("-------");
        console.log("WYWOLUJE putKid (edycja) z obiektem:");
        console.log(new_kid);
        var promiseNewKid = rpc("rpc_Kid.putKid", new_kid);
        promiseNewKid.then(function(kid) {
            console.log("ZWROT z funkcji putKid (edycja):");
            console.log(kid);
            console.log("-------");
            for(var i=0; i<$rootScope.kids.length; i++) {
                if($rootScope.kids[i].id == kidformedit.id) {
                    $rootScope.kids[i].first_name = kidformedit.kidFirstName;
                    $rootScope.kids[i].last_name = kidformedit.kidLastName;
                    $rootScope.kids[i].gender = kidformedit.kidGender;
                    $rootScope.kids[i].born_date = kidformedit.kidBornDate;
                    $rootScope.kids[i].age = getAge($rootScope.kids[i].born_date);
                }
            }
            kidformedit.kidFirstName = "";
            kidformedit.kidLastName = "";
            kidformedit.kidBornDate = "";
            kidformedit.kidGender = "";
            $.jnotify("Dane dziecka zostały zmienione");
            $('#hidden_forms_kids_edit').slideUp();
            $location.path("/kids");
        });
        //console.log($scope.kids);
    }


    $scope.cancelKid = function() {
        $location.path("/kids");
    }

    //setTimeout(function() {

    //}, 400);


}])









/**************************************************************************************************************************** 

kidsSecondParentCtrl 

*****************************************************************************************************************************/

.controller('kidsSecondParentCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    
    $("#module_title").html('Dzieci');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/User_Accounts_32x32.png');

    $scope.kidformparent = {};
    $scope.kidInfo = function() {
        var promiseKid = rpc('rpc_Kid.getKid', $routeParams.kidId);
        promiseKid.then(function(kid) {
            if(kid.ret == "OK") {
                $("#module_title").html('Dodaj opiekuna do dziecka - ' + kid.res.first_name + ' ' + kid.res.last_name);
                $scope.kidformparent.id = kid.res.id;
                $scope.kidformparent['first_name'] = kid.res.first_name;
                $scope.kidformparent['last_name'] = kid.res.last_name;
            }
            else
                $.jnotify("Nie można pobrać danych dziecka: " + kid.msg, "error");
        });
    }
    if($routeParams.kidId !== "") {
        $scope.kidInfo();
    }
    else {
        $location.path("/kids");
    }
    

    $scope.saveParent = function(kidformparent) {
        var new_parent = {'email': kidformparent.email};
        console.log("WYWOLUJE saveParent z obiektem:");
        console.log(new_parent);
        console.log($routeParams.kidId);
        console.log(kidformparent.email);
        var promiseInv = rpc("rpc_Invitation.inviteNextParent", $routeParams.kidId, kidformparent.email);
        promiseInv.then(function(inv) {
            console.log("ZWROT z funkcji rpc_Invitation.inviteNextParent:");
            console.log(inv);
            if(inv.ret == "OK") {
                var payload = {"procedure": "second_parent",
                               "kid_id": $routeParams.kidId,
                               "kid_first_name": kidformparent.first_name,
                               "kid_last_name": kidformparent.last_name,
                               "user_id": inv.res.user_id                               
                              };
                var obj = {'to_user_id': inv.res.user_id,
                           'to_user_email': '',
                           'type': "kids",
                           'payload': payload,
                           'note': "Użytkownik " + $scope.userInfo.first_name + " " + $scope.userInfo.last_name + " zaproponował Ciebie jako opiekuna dziecka " + kidformparent.first_name + ' ' + kidformparent.last_name + ". Jeśli naprawdę jesteś opiekunem tego dziecka, możesz potwierdzić tą informację, a dostaniesz dostęp do wskazanego dziecka.",
                           'status': "waiting"};
                var promiseNotif = rpc("rpc_Notification.putNotification", obj);
                promiseNotif.then(function(notif) {
                    console.log("Wywolalem putNotification i otrzymalem:");
                    console.log(notif);
                    if(notif.ret == "OK") {
                        console.log($routeParams.kidId);
                        console.log(notif.res.to_user_id);
                        var promiseKid = rpc("rpc_Kid.putKidParent", $routeParams.kidId, notif.res.to_user_id, 0);
                        promiseKid.then(function(kid) {
                            console.log("ZWROT z funkcji putKidParent");
                            console.log(kid);
                            if(kid.ret == "OK") {
                                $.jnotify("Wysłano powiadomienie do wskazanego użytkownika. Po potwierdzeniu zostanie on opiekunem dziecka.");
                                $('#hidden_forms_kids_second_parent').slideUp();
                            }
                            else
                                $.jnotify("Wystąpił błąd. Nie udało się wysłać zaproszenia do użytkownika: " + kid.msg, "error");
                        });
                    }
                    kidformparent.email = "";
                    
                });
                //if(inv.res.existed.toString() == "true") {
                    // taki user juz jest 
                //}
                //else {
                    // nie ma takiego usera
                //}
            }
            else
                $.jnotify("Wystąpił błąd. Nie udało się wysłać zaproszenia do użytkownika: " + inv.msg, "error");
            
        });
        

    }


    $scope.cancelKid = function() {
        $location.path("/kids");
    }

    //setTimeout(function() {

    //}, 400);


}])









/**************************************************************************************************************************** 

kidsDeleteCtrl 

*****************************************************************************************************************************/

.controller('kidsDeleteCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    console.log($rootScope.kids);

    $scope.kidId = "";
    if($routeParams.kidId != "") {
        $scope.kidId = $routeParams.kidId;
        $scope.kidName = $routeParams.n;
        $scope.type = "dziecko";
        $scope.backRoute = "/kids";
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/kids");
    }

    $scope.cancelDelete = function() {
        $location.path("/kids");
    }

    $scope.confirmDelete = function() {
        console.log("confirmed");
        var promiseKid = rpc('rpc_Kid.delKidInfo', $scope.kidId);
        promiseKid.then(function(resp) {
            console.log("Wywolalem delKidInfo i dostalem");
            console.log(resp);
            if(resp.ret == "OK") {
                for(var i=0; i<$rootScope.kids.length; i++) {
                    if($rootScope.kids[i].id == $scope.kidId) {
                        $rootScope.kids.splice(i, 1); 
                    }
                }
                $.jnotify("Dziecko zostało usunięte z serwisu");
                $location.path("/kids");
            }
        });
    }

}])









/**************************************************************************************************************************** 

kidsTimetableCtrl 

*****************************************************************************************************************************/

.controller('kidsTimetableCtrl',['$scope', '$location', '$rootScope', '$routeParams', '$log', 'pubsub', 'rpc', 'model', 'auth', function($scope, $location, $rootScope, $routeParams, $log, pubsub, rpc, model, auth) {
    clearTooltips();    
    $('#application_loader').show();
    $scope.userInfo = $rootScope.userInfo;
    
    $("#module_title").html('Plan lekcji');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Folders_OS/Groups_32x32.png');
    
    
    // pobranie info o dziecku ktorego dotyczy plan lekcji
    $scope.kidInfo = function(kidId) {
        $('#application_loader').show();
        setTimeout(function() {
            console.log("Wywoluje rpc_Kid.getKid z parametrem " + kidId);
            var promiseKid = rpc('rpc_Kid.getKid', kidId);
            promiseKid.then(function(kid) {
                if(kid.ret == "OK") {
                    $("#module_title").html("Plan lekcji - " + kid.res.first_name + " " + kid.res.last_name);
                }
                else
                    $.jnotify("Nie można pobrać danych dziecka: " + kid.msg, "error");
            });
            $('#application_loader').hide();
        }, 1000);
    }
    if($routeParams.kidId !== undefined) {
        // jesli dziecko podane w urlu to pobieram dane
        $scope.kidInfo($routeParams.kidId);
        $scope.isKid = 1;
    }
    else {
        // jesli dziecko NIE podane w urlu to pobieram dane pierwszego dziecka z listy dzieci usera
        //if($rootScope.userInfo.user_kids.length > 0) {
        //    $location.path("/kidsTimetable/" + $rootScope.userInfo.user_kids[0]);
        //}
        if($rootScope.kids.length > 0) {
            $scope.kidInfo($rootScope.kids[0].id);
            $scope.isKid = 1;
            $routeParams.kidId = $rootScope.kids[0].id;
        }
        else {
            console.log("Nie ma dzieci");
            $.jnotify("Nie możesz wpisać planu lekcji ponieważ nie dodałeś dziecka do serwisu. Zostajesz przeniesiony na stronę z dziećmi.");
            //$location.path("/kids");
            $scope.isKid = 0;
        }
    }


    var subjects_descriptions = {};
    var subjects_ids = {};
    var subjects_ids_rev = {};
    $scope.subject = {};
    $scope.subject.user_id = $scope.userInfo.id;
    $scope.hours = {};
    $scope.hours.user_id = $scope.userInfo.id;
    $scope.hours.kid_id = $routeParams.kidId;
    
    $scope.MENSchoolSubjectsList = [];
    $scope.eatSubjectsList = [];
    $scope.getMENSchoolSubjectsList = function() {
        var promiseMEN = rpc('rpc_SchoolSubject.getListMENSchoolSubjects');
        promiseMEN.then(function(subjects) {
            for(var i=0; i<subjects.res.length; i++) {
                if(subjects.res[i].cat == "std") {
                    $scope.MENSchoolSubjectsList.push(subjects.res[i]);
                    subjects_descriptions[subjects.res[i].abbr] = subjects.res[i].descr;
                    subjects_ids[subjects.res[i].abbr] = subjects.res[i].id;
                    subjects_ids_rev[subjects.res[i].id] = {"abbr": subjects.res[i].abbr, "descr": subjects.res[i].descr, "classname": "orange2"};
                }
                if(subjects.res[i].cat == "meal") {
                    $scope.eatSubjectsList.push(subjects.res[i]);
                    subjects_descriptions[subjects.res[i].abbr] = subjects.res[i].descr;
                    subjects_ids[subjects.res[i].abbr] = subjects.res[i].id;
                    subjects_ids_rev[subjects.res[i].id] = {"abbr": subjects.res[i].abbr, "descr": subjects.res[i].descr, "classname": "yellow"};
                }
                //console.log(subjects.res[i]);
            }
        });
    }
    
    
    // pobranie dzieci do listy wyboru
    $scope.kids = $rootScope.kids;
    

    // pobranie listy przedmiotow dodatkowych
    $scope.additionalSubjects = [];
    $scope.listUserSchoolSubjects = function() {
        var promiseSubjects = rpc('rpc_SchoolSubject.getListUserSchoolSubjects', $scope.userInfo.id);
        promiseSubjects.then(function(subjects) {
            for(var i=0; i<subjects.res.length; i++) {
                $scope.additionalSubjects.push(subjects.res[i]);
                subjects_descriptions[subjects.res[i].abbr] = subjects.res[i].name;
                subjects_ids[subjects.res[i].abbr] = subjects.res[i].id;
                subjects_ids_rev[subjects.res[i].id] = {"abbr": subjects.res[i].abbr, "descr": subjects.res[i].name, "classname": "lightblue2"};
                //console.log(subjects.res[i]);
            }
            setTimeout(function() {
                $scope.prepareTimetable();
            }, 600);
        });
    }
    //console.log(subjects_ids_rev);

    // pobranie godzin lekcyjnych dla dziecka
    $scope.getSchoolTimetableHours = function() {
        var promiseHours = rpc('rpc_SchoolTimetable.getSchoolTimetableHours', $routeParams.kidId);
        promiseHours.then(function(hours) {
            if(hours.ret == "OK") {
                $scope.hour1_start = hours.res.hour1.start;    $scope.hour1_stop = hours.res.hour1.stop;
                $scope.hour2_start = hours.res.hour2.start;    $scope.hour2_stop = hours.res.hour2.stop;
                $scope.hour3_start = hours.res.hour3.start;    $scope.hour3_stop = hours.res.hour3.stop;
                $scope.hour4_start = hours.res.hour4.start;    $scope.hour4_stop = hours.res.hour4.stop;
                $scope.hour5_start = hours.res.hour5.start;    $scope.hour5_stop = hours.res.hour5.stop;
                $scope.hour6_start = hours.res.hour6.start;    $scope.hour6_stop = hours.res.hour6.stop;
                $scope.hour7_start = hours.res.hour7.start;    $scope.hour7_stop = hours.res.hour7.stop;
                $scope.hour8_start = hours.res.hour8.start;    $scope.hour8_stop = hours.res.hour8.stop;
                $scope.hour9_start = hours.res.hour9.start;    $scope.hour9_stop = hours.res.hour9.stop;
                $scope.hour10_start = hours.res.hour10.start;  $scope.hour10_stop = hours.res.hour10.stop;
                $scope.hour11_start = hours.res.hour11.start;  $scope.hour11_stop = hours.res.hour11.stop;
                $scope.hour12_start = hours.res.hour12.start;  $scope.hour12_stop = hours.res.hour12.stop;
                $scope.hour13_start = hours.res.hour13.start;  $scope.hour13_stop = hours.res.hour13.stop;
                $scope.hour14_start = hours.res.hour14.start;  $scope.hour14_stop = hours.res.hour14.stop;
                console.log("hours");
                console.log(hours);
            }
        });
    }


    // zapis godzin lekcyjnych dla dziecka
    $scope.saveHours = function(hours) {
        var error = 0;
        for(var i=1; i<=14; i++) {
            if($("#hours_hour" + i + "_start").val() != "") {
                if(validateHhMm($("#hours_hour" + i + "_start").val())) error += 0;
                else error += 1;
            }
            if($("#hours_hour" + i + "_stop").val() != "") {
                if(validateHhMm($("#hours_hour" + i + "_stop").val())) error += 0;
                else error += 1;
            }
        }
        
        hours.hour1 = {"start": $("#hours_hour1_start").val(), "stop": $("#hours_hour1_stop").val()};
        hours.hour2 = {"start": $("#hours_hour2_start").val(), "stop": $("#hours_hour2_stop").val()};
        hours.hour3 = {"start": $("#hours_hour3_start").val(), "stop": $("#hours_hour3_stop").val()};
        hours.hour4 = {"start": $("#hours_hour4_start").val(), "stop": $("#hours_hour4_stop").val()};
        hours.hour5 = {"start": $("#hours_hour5_start").val(), "stop": $("#hours_hour5_stop").val()};
        hours.hour6 = {"start": $("#hours_hour6_start").val(), "stop": $("#hours_hour6_stop").val()};
        hours.hour7 = {"start": $("#hours_hour7_start").val(), "stop": $("#hours_hour7_stop").val()};
        hours.hour8 = {"start": $("#hours_hour8_start").val(), "stop": $("#hours_hour8_stop").val()};
        hours.hour9 = {"start": $("#hours_hour9_start").val(), "stop": $("#hours_hour9_stop").val()};
        hours.hour10 = {"start": $("#hours_hour10_start").val(), "stop": $("#hours_hour10_stop").val()};
        hours.hour11 = {"start": $("#hours_hour11_start").val(), "stop": $("#hours_hour11_stop").val()};
        hours.hour12 = {"start": $("#hours_hour12_start").val(), "stop": $("#hours_hour12_stop").val()};
        hours.hour13 = {"start": $("#hours_hour13_start").val(), "stop": $("#hours_hour13_stop").val()};
        hours.hour14 = {"start": $("#hours_hour14_start").val(), "stop": $("#hours_hour14_stop").val()};
        console.log("save hours");
        console.log(hours);
        if(error == 0) {
            var saved_hours = rpc('rpc_SchoolTimetable.putSchoolTimetableHours', hours);
            saved_hours.then(function(response) {
                console.log(response);
                console.log("Zapisalem godziny zajec");
                for(var i=1; i<=14; i++) {
                    var start_input_val = $("#hours_hour" + i + "_start").val();
                    var start_html = $("#hour" + i + "_start").html('');
                    var start_text = $("#hour" + i + "_start").text(start_input_val);
                    var stop_input_val = $("#hours_hour" + i + "_stop").val();
                    var stop_html = $("#hour" + i + "_stop").html('');
                    var stop_text = $("#hour" + i + "_stop").text(stop_input_val);
                }
                $("#btn_change_hours").show();
                $("#btn_change_hours_cancel").hide();
                $("#btn_change_hours_submit").hide();
            });
            $.jnotify("Godziny lekcyjne zostały zapisane");
        }
        else {
            $.jnotify("Niepoprawnie wpisane godziny! Proszę wpisać poprawny format HH:MM", "error");
        }
    }


    // wejscie w formularz zmiany godzin zajec
    $scope.changeHours = function() {
        $("#btn_change_hours").hide();
        $("#btn_change_hours_cancel").show();
        $("#btn_change_hours_submit").show();
        
        for(var i=1; i<=14; i++) {
            var start_html = $("#hour" + i + "_start").html();
            var start_text = $("#hour" + i + "_start").text();
            if(start_html.indexOf("input") == -1) {
                var new_html = '<input type="text" class="input_text_tt_hours" autocomplete="off" value="' + start_text + '" id="hours_hour' + i + '_start" ng-model="hours.hour' + i + '.start" placeholder="od" />';
                $("#hour" + i + "_start").html(new_html)
            }
            else {
                var val = $("#hour" + i + "_start").find("input").val();
                $("#hour" + i + "_start").text(val);
            }
            var stop_html = $("#hour" + i + "_stop").html();
            var stop_text = $("#hour" + i + "_stop").text();
            if(stop_html.indexOf("input") == -1) {
                var new_html = '<input type="text" class="input_text_tt_hours" autocomplete="off" value="' + stop_text + '" id="hours_hour' + i + '_stop" ng-model="hours.hour' + i + '.stop" placeholder="do" />';
                $("#hour" + i + "_stop").html(new_html)
            }
            else {
                var val = $("#hour" + i + "_stop").find("input").val();
                $("#hour" + i + "_stop").text(val);
            }
        }
    }


    // wyjscie z formularza zmiany godzin zajec
    $scope.cancelChangeHours = function() {
        $("#btn_change_hours").show();
        $("#btn_change_hours_cancel").hide();
        $("#btn_change_hours_submit").hide();

        var promiseHours = rpc('rpc_SchoolTimetable.getSchoolTimetableHours', $routeParams.kidId);
        promiseHours.then(function(hours) {
            if(hours.ret == "OK") {
                $("#hour1_start").html(hours.res.hour1.start);    $("#hour1_stop").html(hours.res.hour1.stop);
                $("#hour2_start").html(hours.res.hour2.start);    $("#hour2_stop").html(hours.res.hour2.stop);
                $("#hour3_start").html(hours.res.hour3.start);    $("#hour3_stop").html(hours.res.hour3.stop);
                $("#hour4_start").html(hours.res.hour4.start);    $("#hour4_stop").html(hours.res.hour4.stop);
                $("#hour5_start").html(hours.res.hour5.start);    $("#hour5_stop").html(hours.res.hour5.stop);
                $("#hour6_start").html(hours.res.hour6.start);    $("#hour6_stop").html(hours.res.hour6.stop);
                $("#hour7_start").html(hours.res.hour7.start);    $("#hour7_stop").html(hours.res.hour7.stop);
                $("#hour8_start").html(hours.res.hour8.start);    $("#hour8_stop").html(hours.res.hour8.stop);
                $("#hour9_start").html(hours.res.hour9.start);    $("#hour9_stop").html(hours.res.hour9.stop);
                $("#hour10_start").html(hours.res.hour10.start);  $("#hour10_stop").html(hours.res.hour10.stop);
                $("#hour11_start").html(hours.res.hour11.start);  $("#hour11_stop").html(hours.res.hour11.stop);
                $("#hour12_start").html(hours.res.hour12.start);  $("#hour12_stop").html(hours.res.hour12.stop);
                $("#hour13_start").html(hours.res.hour13.start);  $("#hour13_stop").html(hours.res.hour13.stop);
                $("#hour14_start").html(hours.res.hour14.start);  $("#hour14_stop").html(hours.res.hour14.stop);
            }
        });
    }


    // pobranie planu lekcji dla dziecka
    $scope.getSchoolTimetable = function() {
        var promiseTimetable = rpc('rpc_SchoolTimetable.getSchoolTimetable', $routeParams.kidId);
        promiseTimetable.then(function(timetable) {
            console.log("Wywoluje getSchoolTimetable i dostalem");
            console.log(timetable);
            if(timetable.ret == "OK") {
                for(var d=1; d<=7; d++) {
                    for(var h=1; h<=14; h++) {
                        if(timetable.res['day' + d + '_' + h] !== "") {
                            var subj = subjects_ids_rev[timetable.res['day' + d + '_' + h].id];
                            if(subj !== undefined) {
                                $('#day_' + d + '_' + h + '').html('<div class="subject_box ' + subj.classname + '" title="' + subj.descr + '"><span>' + subj.abbr + '</span></div><div class="remove_position" title="Usuń pozycję" onclick="removeTimetablePosition(\'day_' + d + '_' + h + '\')"><img src="/images/Dusseldorf_icons/delete.png" /></div>');
                                createMainTooltip(".subject_box");
                                createMainTooltip(".remove_position");
                            }
                        }
                    }
                }
            }
            else
                $.jnotify("Nie można pobrać planu lekcji: " + timetable.msg, "error");           
        });
    }


    // zapis planu lekcji dla dziecka
    $scope.saveTimetable = function() {
        jConfirm("Czy na pewno zapisać zmiany w planie lekcji?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno zapisać zmiany w planie lekcji?");
          if(agree) {
            var new_timetable = {};
            new_timetable.user_id = $scope.userInfo.id;
            new_timetable.kid_id = $routeParams.kidId;
            for(var d=1; d<=7; d++) {
                for(var h=1; h<=14; h++) {
                    var subj = "";
                    if(subjects_ids[$('#day_' + d + '_' + h + '').text()] !== undefined) 
                        subj = subjects_ids[$('#day_' + d + '_' + h + '').text()];
                    else 
                        subj = "";
                    new_timetable['day' + d + '_' + h + ''] = {"id": subj};
                }
            }
            console.log("save timetable");
            console.log(new_timetable);
            var saved_timetable = rpc('rpc_SchoolTimetable.putSchoolTimetable', new_timetable);
            saved_timetable.then(function(response) {
                console.log(response);
                $.jnotify("Plan lekcji został zapisany");
                $("#timetable_change_info").hide();
            });
          }
        });
    }


    // zapis przedmiotu dodatkowego
    $scope.saveSubject = function(subject) {
        var abbr = generateSubjectShortcut(subject.name);
        var new_subject = {'user_id': subject.user_id, 'name': subject.name, 'descr': subject.name, 'abbr': (abbr).toUpperCase()};
        var saved = rpc('rpc_SchoolSubject.putSchoolSubject', new_subject);
        saved.then(function(response) {
            console.log(response);
            //$scope.additionalSubjects.push({'id': response.res.id, 'name': subject.name, 'abbr': (abbr).toUpperCase()});
            //console.log($scope.additionalSubjects);
            $('#hidden_forms_kidtimetable').slideUp();
            setTimeout(function() {
                $scope.additionalSubjects = [];
                $scope.listUserSchoolSubjects();
                $.jnotify("Nowy przedmiot został zapisany");
                $scope.prepareTimetable();
            }, 800);
        });
    }
    

    // wyjscie z formularza dodania przedmiotu dodatkowego
    $scope.cancelSubject = function() {
        $('#hidden_forms_kidtimetable').slideUp();
    }



    // przygotowanie drag and drop w planie lekcji
    $scope.prepareTimetable = function() {
        $(".subject_box").draggable({
            revert:false,
            helper:'clone'
        });
        $(".days_cell").droppable({
            over: function(event, ui) {
                $(this).addClass("darkviolet");
            },
            out: function(event, ui) {
                $(this).removeClass("darkviolet");
            },
            drop: function(event, ui) {
                $(this).removeClass("darkviolet");
                var element_class = ui.draggable.attr("class").replace("subject_box ", "").replace(" ui-draggable", "");
                var element_text = ui.draggable.text();
                // pobranie title nie dziala, bo to clone. Trzeba zrobic dociaganie title, zeby tooltip dzialal
                var element_title = ui.draggable.attr("title");
                //console.log(ui.draggable);
                //console.log(element_title);
                var td_id = $(this).attr("id");
                
                var window_width = $(window).width();
                $(this).html('<div class="subject_box ' + element_class + '" title="' + subjects_descriptions[ui.draggable.text()] + '"><span>' + element_text + '</span></div><div class="remove_position" title="Usuń pozycję" onclick="removeTimetablePosition(\'' + td_id + '\')"><img src="/images/Dusseldorf_icons/delete.png" /></div>');
                createMainTooltip(".subject_box");
                createMainTooltip(".remove_position");
                $("#timetable_change_info").show();
            }
        });
        $("#subject_trash").droppable({
            over: function(event, ui) {
                $(this).removeClass("opacity7");
            },
            out: function(event, ui) {
                $(this).addClass("opacity7");
            },
            drop: function(event, ui) {
                var element_class = ui.draggable.attr("class").replace("subject_box ", "").replace(" ui-draggable", "");
                var element_text = ui.draggable.text();
                if(element_class == "lightblue2") {
                    jConfirm("Czy na pewno chcesz usunąć ten przedmiot? Zostanie on też usunięty ze wszystkich Twoich planów lekcji.", 'Confirmation Dialog', function(agree) {
                    //var agree = confirm("Czy na pewno chcesz usunąć ten przedmiot? Zostanie on też usunięty ze wszystkich Twoich planów lekcji.");
                      if(agree) {
                        console.log($scope.userInfo.id);
                        console.log(subjects_ids[element_text]);
                        var deleted = rpc('rpc_SchoolSubject.delSchoolSubject', $scope.userInfo.id, subjects_ids[element_text]);
                        deleted.then(function(response) {
                            console.log(response);
                            for(var d=1; d<=7; d++) {
                                for(var h=1; h<=14; h++) {
                                    if($('#day_' + d + '_' + h + '').text() == element_text) 
                                        $('#day_' + d + '_' + h + '').html('');
                                }
                            }
                            $scope.additionalSubjects = [];
                            $scope.listUserSchoolSubjects();
                            clearTooltips();
                        });
                      }
                    });
                }
                else {
                    alert("Nie można usunąć tego przedmiotu! Można usuwać tylko własne przedmioty dodatkowe.");
                }
            }
        });
        
        $(".option_link").each(function() {
            $(this).bind('mouseover', function() {
                $(this).find('img').attr('src', $(this).find('img').attr('src').replace("16x16_white", "16x16_hover"));
                $(this).find('span').css('color', '#7DBADF');
            });
            $(this).bind('mouseout', function() {
                $(this).find('img').attr('src', $(this).find('img').attr('src').replace("16x16_hover", "16x16_white"));
                $(this).find('span').css('color', '#FFFFFF');
            });
        });

        var subjects_all_height = $("#subjects_all").height();
        $("#subject_trash").css('height', subjects_all_height+20 + 'px');

        createMainTooltip(".subject_box");
        createMainTooltip("#subject_trash");
        createMainTooltip("#timetable_close_subjects");
    };


    $scope.getMENSchoolSubjectsList();
    $scope.listUserSchoolSubjects();
    if($routeParams.kidId !== undefined) {
        if($scope.isKid == 1) $scope.getSchoolTimetableHours();
        setTimeout(function() {
            if($scope.isKid == 1) $scope.getSchoolTimetable();
        }, 800);
    }
    
    setTimeout(function() {
        $("#tt_kid_choose_" + $routeParams.kidId).addClass("hover");
        $scope.prepareTimetable();
        
        $("#field_subject_name").bind('keyup', function() {
            var abbr = generateSubjectShortcut($(this).val());
            $("#field_subject_shortcut span").text(abbr.toUpperCase());
        });

        if(window.chrome) {
            $("#timetable_close_subjects").css("top", "72px");
        }

        $('#application_loader').hide();
    }, 800);

}])










/* kidsCommentsCtrl */

.controller('kidsCommentsCtrl',['$scope', '$location', '$log', 'auth', function($scope, $location, $log, auth) {
    clearTooltips();
    
    $("#module_title").html('Komentarze nauczycieli');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Applications/Messaging_alt_32x32.png');
}])









/**************************************************************************************************************************** 

schoolsCtrl 

*****************************************************************************************************************************/

.controller('schoolsCtrl',['$scope', '$location', '$log', '$rootScope', 'auth', '$http', 'rpc', function($scope, $location, $log, $rootScope, auth, $http, rpc) {
    clearTooltips();    
    $('#application_loader').show();
    $scope.userInfo = $rootScope.userInfo;
    
    $("#module_title").html('Placówka');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Folders_OS/Libraries_32x32.png');

    $scope.voivodeships = [];
    $scope.getVoivodeshipList = function() {
        var promiseVoivodeshipList = rpc("rpc_Geo.getListVoivodeships");
        promiseVoivodeshipList.then(function(voivodeships) {
            console.log("Wywolalem getListVoivodeships() i dostalem");
            console.log(voivodeships);
            if(voivodeships.ret == "OK") {
                for(var i=0; i<voivodeships.res.length; i++) {
                    $scope.voivodeships.push(voivodeships.res[i]);
                }
            }
        });
    } 
    $scope.getVoivodeshipList();


    $scope.cities = [];
    $scope.getCities = function(voivodeship) {
        $('#application_loader').show();
        var promiseCitiesList = rpc("rpc_Geo.getListCities", voivodeship.id);
        promiseCitiesList.then(function(cities) {
            console.log("Wywolalem getListCities() z parametrem " + voivodeship.id + " i dostalem");
            console.log(cities);
            $scope.cities = cities.res;
            $('#application_loader').hide();
        });
    }


    $scope.schooltypes = [];
    $scope.getListSchoolTypes = function() {
        $('#application_loader').show();
        var promiseTypesList = rpc("rpc_SchoolType.getListSchoolTypes");
        promiseTypesList.then(function(types) {
            console.log("Wywolalem getListSchoolTypes() i dostalem");
            console.log(types);
            $scope.schooltypes = [];
            for(var t=0; t<types.res.length; t++) {
                if(types.res[t].popularity == 1)
                    $scope.schooltypes.push(types.res[t]);
            }
            $('#application_loader').hide();
        });
        
    }


    $scope.schools = [];
    $scope.schools_backup = [];
    $scope.schoolstreets = [];
    $scope.getSchoolsByCityAndType = function() {
        $('#application_loader').show();
        console.log($scope.voivodeship);
        console.log($scope.city);
        console.log($scope.schooltype);
        var promiseSchoolsList = rpc("rpc_School.getListSchools", $scope.city.id, $scope.schooltype.id);
        promiseSchoolsList.then(function(schoolsList) {
            $scope.schools = [];
            $scope.schools_backup = [];
            $scope.schoolstreets = [];
            console.log("Wywolalem getListSchools() i dostalem");
            console.log(schoolsList);
            if(schoolsList.ret == "OK") {
                for(var i=0; i<schoolsList.res.length; i++) {
                    $scope.schools.push(schoolsList.res[i]);
                    $scope.schools_backup.push(schoolsList.res[i]);
                    $scope.schoolstreets.push(schoolsList.res[i].address);
                    //console.log(schoolsList.res[i].address);
                    //usersList.res[i].id
                }
            }
            //console.log($scope.schoolstreets);
            $scope.schoolstreets.sort();
            $scope.schoolstreets.unshift("--Wszystkie--");
            $('#application_loader').hide();
        });
    }


    $scope.getSchoolsByCityAndTypeAndStreet = function() {
        $('#application_loader').show();
        $scope.schools = [];
        if($scope.schoolstreet == "--Wszystkie--") {
            $scope.schools = $scope.schools_backup;
        }
        else {
            for(var i=0; i<$scope.schools_backup.length; i++) {
                console.log($scope.schoolstreet);
                console.log($scope.schools_backup[i].address);
                if($scope.schoolstreet == $scope.schools_backup[i].address)
                    $scope.schools.push($scope.schools_backup[i]);
            }
        }        
        $('#application_loader').hide();
    }



    $scope.my_schools = [];
    var my_schools_used_ids = [];
    $scope.getMySchools = function() {  //test
        var promiseSchoolsList = rpc("rpc_School.getUserSchools");
        promiseSchoolsList.then(function(schoolsList) {
            console.log("Wywolalem getUserSchools() i dostalem");
            console.log(schoolsList);
            if(schoolsList.ret == "OK") {
                for(var i=0; i<schoolsList.res.length; i++) {
                    if($.inArray(schoolsList.res[i].school_id, my_schools_used_ids) == -1) {
                        var promiseSchool = rpc("rpc_School.getSchoolInfo", schoolsList.res[i].school_id);
                        promiseSchool.then(function(schl) {
                            console.log("Wywolalem getSchoolInfo() i dostalem");
                            console.log(schl);
                            if(schl.ret == "OK") {
                                $scope.my_schools.push(schl.res);
                                my_schools_used_ids.push(schl.res.id);
                            }
                        });
                        
                    }
                }
            }
        });
    }


    $scope.getMySchools();
    setTimeout(function() {
        createMainTooltip(".bottom_box_options_icons");
        createMainTooltip("#myschool_close_schools");
        //createMainTooltip(".bottom_box_options_icons");

        if($.browser.msie) {
            //alert($(".selectstyled").find("select").css('padding'));
            $(".selectstyled").find("select").css('padding', '0px 4px 0px 10px !important');
            //alert($(".selectstyled").find("select").css('padding'));
            $(".selectstyled").find("select").css('height', '18px !important');
            
   
//            $(".selectstyled").css('width', '162px !important');
//            $(".selectstyled").find("select").css('background-color', '#1f0127');
//            $(".selectstyled").find("select").css('width', '152px !important');
        }
        
        $('#application_loader').hide();
    }, 1000);
    
}])









/**************************************************************************************************************************** 

schoolsDetailsCtrl 

*****************************************************************************************************************************/

.controller('schoolsDetailsCtrl',['$scope', '$location', '$filter', '$log', '$rootScope', 'auth', '$http', 'rpc', '$routeParams', function($scope, $location, $filter, $log, $rootScope, auth, $http, rpc, $routeParams) {
    clearTooltips(); 
    $('#application_loader').show();   
    $scope.userInfo = $rootScope.userInfo;
    
    if($routeParams.schoolId == "") {
        $.jnotify("Wystąpił błąd. Nie podano id szkoły.", "error");
        $location.path('schools');
    }

    $("#module_title").html('Szczegóły placówki');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Folders_OS/Libraries_32x32.png');

    $scope.start_year = /^\d\d\d\d$/;

    $scope.school = {};
    $scope.getSchool = function() {
        var promiseSchool = rpc("rpc_School.getSchoolInfo", $routeParams.schoolId);
        promiseSchool.then(function(school) {
            console.log("Wywolalem getSchoolInfo() i dostalem");
            console.log(school);
            if(school.ret == "OK") {
                $scope.school = school.res;
            }
        });
    }
    $scope.getSchool();


    $scope.classes_all = [];
    $scope.classes_tmp = [];
    $scope.getSchoolClasses = function() {
        var promiseSchool = rpc("rpc_School.getSchoolClasses", $routeParams.schoolId);
        promiseSchool.then(function(schoolclasses) {
            console.log("Wywolalem getSchoolClasses() i dostalem");
            console.log(schoolclasses);
            if(schoolclasses.ret == "OK") {
                for(var i=0; i<schoolclasses.res.length; i++) {
                    var sclass = {'id':schoolclasses.res[i].id, 
                                  'name':schoolclasses.res[i].name, 
                                  'start_year':schoolclasses.res[i].school_year, 
                                  'main_teacher':'', 'students':[]};
                    $scope.getSchoolClassStudents(sclass.id, i);
                    $scope.classes_all.push(sclass);
                }
                $scope.prepareSchoolYears();
            }
        });
    }
    

    
    /* pobranie wlasciciela kazdego wpisu */
    $scope.getSchoolClassStudents = function(schoolclass_id, index) {
        var promiseGroup = rpc('rpc_School.getSchoolClassStudents', schoolclass_id);
        promiseGroup.then(function(resp) {
            console.log("Wywolalem getSchoolClassStudents() z getSchoolClasses() i dostalem");
            console.log(resp);
            if(resp.ret == "OK") {
                for(var s=0; s<resp.res.length; s++) {
                    if((resp.res[s].deleted).toString() != "true") {
                        $scope.classes_all[index].students.push(resp.res[s]);
                    }
                }
                //$scope.posts[index].owner_obj = ui.res;
            }
        });
    }







    /*$scope.countStudentsNotDeleted = function() {
        console.log("$scope.classes_all");
        console.log($scope.classes_all);
        for(var i=0; i<$scope.classes_all.length; i++) {
            for(var s=0; s<$scope.classes_all[i].students.res.length; s++) {
                if(($scope.classes_all[i].students.res[s].deleted).toString() == "true") {
                    $scope.classes_all[i].students.res.splice(s);
                }
            }
        }
    }*/


    $scope.teachers_confirmed = [];
    $scope.teachers_unconfirmed = [];
    $scope.getSchoolTeachers = function() {
        console.log("Bede wywolywal getSchoolTeachers()");
        var promiseSchool = rpc("rpc_School.getSchoolTeachers", $routeParams.schoolId);
        promiseSchool.then(function(teachers) {
            console.log("Wywolalem getSchoolTeachers() i dostalem");
            console.log(teachers);
            if(teachers.ret == "OK") {
                for(var t=0; t<teachers.res.length; t++) {
                    if(teachers.res[t].confirmed.toString() == "true")
                        $scope.teachers_confirmed.push(teachers.res[t]);
                    else
                        $scope.teachers_unconfirmed.push(teachers.res[t]);
                }
            }
        });
    }
    //console.log("before getSchoolTeachers");
    $scope.getSchoolTeachers();
    //console.log("after getSchoolTeachers");

    
    $scope.confirmTeacher = function(teacher_id) {
        jConfirm("Czy na pewno chcesz potwierdzić nauczyciela w tej szkole?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno chcesz potwierdzić nauczyciela w tej szkole?");
          if(agree) {
            var promiseTeacher = rpc("rpc_School.confirmTeacher", $routeParams.schoolId, teacher_id);
            promiseTeacher.then(function(teacher) {
                console.log("Wywolalem confirmTeacher() i dostalem");
                console.log(teacher);
                if(teacher.ret == "OK") {
                    for(var t=0; t<$scope.teachers_unconfirmed.length; t++) {
                        if($scope.teachers_unconfirmed[t].id == teacher_id) {
                            $scope.teachers_unconfirmed[t].confirmed = true;
                            $scope.teachers_confirmed.push($scope.teachers_unconfirmed[t]);
                            $scope.teachers_unconfirmed.splice(t);
                        }
                    }
                    $.jnotify("Nauczyciel został potwierdzony.");
                }
                else
                    $.jnotify("Nie udało się zapisać danych klasy: " + schoolclass.msg, "error");
            });
          }
        });
    }


    $scope.saveSchoolClass = function(classform) {
        var new_class = {'name':classform.name, 'school_id':$routeParams.schoolId, 'school_year':classform.start_year};
        console.log(new_class);
        var promiseSchool = rpc("rpc_School.putSchoolClass", new_class);
        promiseSchool.then(function(schoolclass) {
            console.log("Wywolalem putSchoolClass() i dostalem");
            console.log(schoolclass);
            if(schoolclass.ret == "OK") {
                schoolclass.res['start_year'] = schoolclass.res.school_year;
                schoolclass.res['students'] = [];
                $scope.classes_all.push(schoolclass.res);
                $('#hidden_forms_schoolclass').slideUp();
                $.jnotify("Klasa została dopisana.");
                $scope.prepareSchoolYears();
            }
            else
                $.jnotify("Nie udało się zapisać danych klasy: " + schoolclass.msg, "error");
        });
    }

    
    $scope.MENSubjects = [];
    $scope.getMENSchoolSubjectsList = function() {
        var promiseMEN = rpc('rpc_SchoolSubject.getListMENSchoolSubjects');
        promiseMEN.then(function(subjects) {
            console.log("Wywolalem getListMENSchoolSubjects() i dostalem");
            console.log(subjects);
            for(var i=0; i<subjects.res.length; i++) {
                if(subjects.res[i].cat == "std") {
                    var new_obj = {'id':subjects.res[i].id, 'descr':subjects.res[i].descr, 'checked':false};
                    $scope.MENSubjects.push(subjects.res[i]);
                }
            }
        });
    }
    $scope.getMENSchoolSubjectsList();
    //$scope.selectedTeacherSubjects = function () {
    //    return $filter('filter')($scope.MENSubjects, {checked: true});
    //};

    $scope.joinSchoolAsTeacher = function(formteacher) {
        var subject_ids = [];
        var subject_names = [];
        for(var s = 0; s<$scope.MENSubjects.length; s++) {
            if($scope.MENSubjects[s].checked) {
                subject_ids.push($scope.MENSubjects[s].id);
            }
        }
        if(formteacher.new_subject !== undefined) {
            subject_names.push(formteacher.new_subject);
        }
        //console.log($scope.MENSubjects);
        //console.log(formteacher);
        var new_teacher = {'school_id':$routeParams.schoolId, 'subjects_id_list':subject_ids, 'subjects_name_list':subject_names};
        console.log(new_teacher);
        var promiseSchool = rpc("rpc_School.joinAsTeacher", new_teacher);
        promiseSchool.then(function(teacher) {
            console.log("Wywolalem joinAsTeacher() i dostalem");
            console.log(teacher);
            if(teacher.ret == "OK") {
                var new_teacher = $scope.userInfo;
                new_teacher['subjects'] = [];
                for(var s = 0; s<$scope.MENSubjects.length; s++) {
                    if($scope.MENSubjects[s].checked) {
                        $scope.MENSubjects[s]['name'] = $scope.MENSubjects[s].descr;
                        new_teacher.subjects.push($scope.MENSubjects[s]);
                    }
                }
                for(var s = 0; s<subject_names.length; s++) {
                    if(subject_names[s].toString() != "") {
                        new_teacher.subjects.push({'id':'9999', 'name':subject_names[s]});
                    }
                }
                $scope.teachers_unconfirmed.push(new_teacher);
                $.jnotify("Zostałeś dopisany do szkoły. Ktoś z rodziców lub innych nauczycieli musi potwierdzić, że jesteś Nauczycielem.");
                $scope.prepareSchoolYears();
            }
            else
                $.jnotify("Nie udało się dołączyć jako nauczyciel do szkoły: " + teacher.msg, "error");
            $("#hidden_forms_schoolclass_teacher").slideUp();
        });
    }


    $scope.teacherLeavesSchool = function() {
        jConfirm("Czy na pewno chcesz odejść z grona nauczycielskiego szkoły?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno chcesz odejść z grona nauczycielskiego szkoły?");
          if(agree) {
            var promiseSchool = rpc("rpc_School.disconnFromSchool", $routeParams.schoolId);
            promiseSchool.then(function(teacher) {
                console.log("Wywolalem disconnFromSchool() i dostalem");
                console.log(teacher);
                if(teacher.ret == "OK") {
                    for(var t=0; t<$scope.teachers_unconfirmed.length; t++) {
                        if($scope.teachers_unconfirmed[t].id == $scope.userInfo.id) {
                            $scope.teachers_unconfirmed.splice(t);
                        }
                    }
                    for(var t=0; t<$scope.teachers_confirmed.length; t++) {
                        if($scope.teachers_confirmed[t].id == $scope.userInfo.id) {
                            $scope.teachers_confirmed.splice(t);
                        }
                    }
                    $.jnotify("Odszedłeś z grona nauczycielskiego szkoły.");
                }
                else
                    $.jnotify("Nie udało się odłączyć ze szkoły: " + teacher.msg, "error");
            });
          }
        });
    }


    $scope.setStartYear = function(year) {
        $scope.classes = [];
        var actual_start_year_1 = year;
        var actual_start_year_2 = actual_start_year_1 + 1;
        $scope.actual_start_years = actual_start_year_1 + "/" + actual_start_year_2;
        $scope.previous_start_year = year-1;
        $scope.next_start_year = year+1;
        
        for(var c=0; c<$scope.classes_all.length; c++) {
            if($scope.classes_all[c].start_year == actual_start_year_1) {
                $scope.classes.push($scope.classes_all[c]);
            }
        }
    }

    $scope.classform = {};
    $scope.prepareSchoolYears = function() {
        var dt = new Date();
        if(dt.getMonth() < 8) {
            $scope.previous_start_year = dt.getFullYear()-2;
            $scope.next_start_year = dt.getFullYear();
            $scope.setStartYear(dt.getFullYear()-1);
            $scope.classform.start_year = dt.getFullYear()-1;
        }
        else {
            $scope.previous_start_year = dt.getFullYear()-1;
            $scope.next_start_year = dt.getFullYear()+1;
            $scope.setStartYear(dt.getFullYear());
            $scope.classform.start_year = dt.getFullYear();
        }
    }
    
    
    // wyjscie z formularza dodania klasy
    $scope.cancelSchoolClass = function() {
        $('#hidden_forms_schoolclass').slideUp();
    }
    // wyjscie z formularza dodania nauczyciela
    $scope.cancelJoinAsTeacher = function() {
        $('#hidden_forms_schoolclass_teacher').slideUp();
    }
    
    $scope.getSchoolClasses();
    setTimeout(function() {
        //$("#classform_field_start_year").mask("9999");    
        createMainTooltip(".schoolclass_contact_icon");
        createMainTooltip("#change_actual_start_year_previous_link");
        createMainTooltip("#change_actual_start_year_next_link");
        createMainTooltip(".abuse");
        $('#application_loader').hide();
    }, 600);
    
}])









/**************************************************************************************************************************** 

schoolClassDetailsCtrl 

*****************************************************************************************************************************/

.controller('schoolClassDetailsCtrl',['$scope', '$location', '$log', '$rootScope', 'auth', '$http', 'rpc', '$routeParams', function($scope, $location, $log, $rootScope, auth, $http, rpc, $routeParams) {
    clearTooltips();    
    $('#application_loader').show();
    $scope.userInfo = $rootScope.userInfo;
    $scope.kids = $rootScope.kids;
    for(var sk=0; sk<$scope.kids.length; sk++) {
        $scope.kids[sk].in_this_class = 0;
    }
    $scope.i_have_children_in_class = 0;

    if($.inArray($routeParams.schoolId, $scope.userInfo.teacher_in) > -1)
        $scope.i_am_teacher_in_this_school = 1;
    

    if($routeParams.schoolclassId == "" || $routeParams.schoolId == "") {
        $.jnotify("Wystąpił błąd. Nie podano id szkoły i klasy.", "error");
        $location.path('schools');
    }
    $("#module_title").html('Szczegóły klasy');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Folders_OS/Libraries_32x32.png');


    $scope.school = {};
    $scope.getSchool = function() {
        console.log($routeParams.schoolId);
        var promiseSchool = rpc("rpc_School.getSchoolInfo", $routeParams.schoolId);
        promiseSchool.then(function(school) {
            console.log("Wywolalem getSchoolInfo() i dostalem");
            console.log(school);
            if(school.ret == "OK") {
                $scope.school = school.res;
            }
        });
    }
    $scope.getSchool();


    $scope.schoolclass = {};
    $scope.schoolclass_teacher_ids = [];
    $scope.getSchoolClassInfo = function() {
        var promiseSchoolClass = rpc("rpc_School.getSchoolClassInfo", $routeParams.schoolclassId);
        promiseSchoolClass.then(function(schoolclass) {
            console.log("Wywolalem getSchoolClassInfo() i dostalem");
            console.log(schoolclass);
            if(schoolclass.ret == "OK") {
                $scope.schoolclass = schoolclass.res;
                for(var t=0; t<schoolclass.res.class_teachers.length; t++) {
                    $scope.schoolclass_teacher_ids.push(schoolclass.res.class_teachers[t].id);
                }
            }
        });
    }
    $scope.getSchoolClassInfo();


    $scope.students = [];
    $scope.getSchoolClassStudents = function() {
        var promiseStudents = rpc("rpc_School.getSchoolClassStudents", $routeParams.schoolclassId);
        promiseStudents.then(function(students) {
            console.log("Wywolalem getSchoolClassStudents() i dostalem");
            console.log(students);
            if(students.ret == "OK") {
                for(var i=0; i<students.res.length; i++) {
                    if((students.res[i].deleted).toString() != "true") {
                        var kid = students.res[i].kid;
                        $scope.students.push(kid);
                        for(var sk=0; sk<$scope.kids.length; sk++) {
                            //console.log(kid.id);
                            //console.log($scope.kids[sk].id);
                            if(($scope.kids[sk].id).toString() == (kid._id).toString()) {
                                $scope.kids[sk].in_this_class = 1;
                                $scope.i_have_children_in_class = 1;
                            }
                        }
                    }
                }
                console.log($scope.kids);
            }
        });
    }
    $scope.getSchoolClassStudents();


    $scope.school_teachers = [];
    $scope.getSchoolTeachers = function() {
        var promiseSchool = rpc("rpc_School.getSchoolTeachers", $routeParams.schoolId);
        promiseSchool.then(function(teachers) {
            console.log("Wywolalem getSchoolTeachers() i dostalem");
            console.log(teachers);
            if(teachers.ret == "OK") {
                for(var t=0; t<teachers.res.length; t++) {
                    if($.inArray(teachers.res[t].id, $scope.schoolclass_teacher_ids) == -1)
                        $scope.school_teachers.push(teachers.res[t]);
                }
            }
        });
    }
    $scope.getSchoolTeachers();
    
    
    // zapisanie dzieci w klasie jako rodzic
    $scope.saveSchoolClass1 = function(classform1) {
        console.log($scope.kids);
        for(var t=0; t<$scope.kids.length; t++) {
            if($scope.kids[t].checked !== undefined) {
                if(($scope.kids[t].checked).toString() == "true") {
                    var added_kid = $scope.kids[t];
                    var promiseSchool = rpc("rpc_School.addKidToClassByParent", $scope.kids[t].id, $routeParams.schoolclassId);
                    promiseSchool.then(function(student) {
                        console.log("Wywolalem addKidToClassByParent() i dostalem");
                        console.log(student);
                        if(student.ret == "OK") {
                            added_kid['parent_id'] = $scope.userInfo.id;
                            $scope.students.push(added_kid);
                            for(var sk=0; sk<$scope.kids.length; sk++) {
                                if($scope.kids[sk].id == added_kid.id)
                                    $scope.kids[sk].in_this_class = 1;
                            }
                            $scope.i_have_children_in_class = 1;
                            $.jnotify("Uczeń został dopisany do klasy.");
                            $rootScope.getKids();
                            $('#hidden_forms_schoolclass_kid1').slideUp();
                        }
                        else
                            $.jnotify("Wystąpił błąd! Nie udało się dopisać dziecka do klasy: " + student.msg, "error");
                    });
                }
            }
        }
    }

    // zapisanie dzieci w klasie jako nauczyciel
    $scope.saveSchoolClass2 = function(classform2) {
        console.log(classform2);
        var new_student = {'first_name':classform2.first_name, 'last_name':classform2.last_name, 'parent_email':classform2.parent_email};
        console.log(new_student);

        var form_data = {};
        form_data['first_name'] = classform2.first_name;
        form_data['last_name'] = classform2.last_name;
        form_data['parent_email'] = classform2.parent_email;
        var promiseInv = rpc("rpc_Invitation.inviteUserByTeacher", classform2.first_name, classform2.last_name, classform2.parent_email);
        promiseInv.then(function(inv) {
            console.log("ZWROT z funkcji rpc_Invitation.inviteUserByTeacher:");
            console.log(inv);
            console.log("form_data");
            console.log(form_data);
            if(inv.ret == "OK") {
                var payload = {"procedure": "kid_added_to_class_by_teacher",
                               "school_class_name": $scope.schoolclass.name,
                               "school_class_id": $scope.schoolclass.id,
                               "kid_first_name": form_data.first_name,
                               "kid_last_name": form_data.last_name,
                               "parent_email": form_data.parent_email,
                               "user_id": inv.res.user_id                               
                              };
                var obj = {'to_user_id': inv.res.user_id,
                           'to_user_email': '',
                           'type': "schoolclass",
                           'payload': payload,
                           'note': "Nauczyciel " + $scope.userInfo.first_name + " " + $scope.userInfo.last_name + " wskazał Twoje dziecko " + form_data.first_name + ' ' + form_data.last_name + " jako ucznia w klasie " + $scope.schoolclass.name + " w szkole " + $scope.school.name + ". Jeśli " + form_data.first_name + ' ' + form_data.last_name + " naprawdę jest uczniem w tej klasie, możesz potwierdzić tą informację, a dziecko zostanie dopisane do klasy.",
                           'status': "waiting"};
                var promiseNotif = rpc("rpc_Notification.putNotification", obj);
                promiseNotif.then(function(notif) {
                    console.log("Wywolalem putNotification i otrzymalem:");
                    console.log(notif);
                    if(notif.ret == "OK") {
                
                    }
                    $.jnotify("Wysłano powiadomienie do wskazanego użytkownika. Po potwierdzeniu dziecko zostanie dopisane do klasy.");
                    //$('#hidden_forms_kids_second_parent').slideUp();
                });
                //if(inv.res.existed.toString() == "true") {
                    // taki user juz jest 
                //}
                //else {
                    // nie ma takiego usera
                //}
            }
            else
                $.jnotify("Wystąpił błąd. Nie udało się wysłać zaproszenia do użytkownika: " + inv.msg, "error");
            
        });
        classform2.first_name = "";
        classform2.last_name = "";
        classform2.parent_email = "";
        //console.log($scope.students);
    }

    // dodanie wychowawcy do klasy
    $scope.teachers = [];
    $scope.saveSchoolClass3 = function(classform3) {
        console.log($scope.school_teachers);
        for(var t=0; t<$scope.school_teachers.length; t++) {
            console.log($scope.school_teachers[t].checked);
            if($scope.school_teachers[t].hasOwnProperty("checked")) {
                if(($scope.school_teachers[t].checked).toString() == "true") {
                    console.log($scope.school_teachers[t].id);
                    console.log($routeParams.schoolclassId);
                    var promiseSchool = rpc("rpc_School.setClassTeacher", $scope.school_teachers[t].id, $routeParams.schoolclassId);
                    promiseSchool.then(function(teacher) {
                        console.log("Wywolalem setClassTeacher() i dostalem");
                        console.log(teacher);
                        if(teacher.ret == "OK") {
                            $scope.getSchoolClassInfo();
                            $('#hidden_forms_schoolclass_kid3').slideUp();
                            $.jnotify("Wychowawca został dopisany do klasy.");
                        }
                    });
                }
            }
        }
    }


    $scope.saveMeAsMainTeacher = function() {
        jConfirm("Czy na pewno chcesz dopisać siebie jako wychowawcę w klasie?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno chcesz dopisać siebie jako wychowawcę w klasie?");
          if(agree) {
            console.log($scope.school_teachers);
            var promiseSchool = rpc("rpc_School.setClassTeacher", $scope.userInfo.id, $routeParams.schoolclassId);
            promiseSchool.then(function(teacher) {
                console.log("Wywolalem setClassTeacher() i dostalem");
                console.log(teacher);
                if(teacher.ret == "OK") {
                    $scope.getSchoolClassInfo();
                    $('#hidden_forms_schoolclass_kid3').slideUp();
                    $.jnotify("Zostałeś dopisany do klasy jako wychowawca.");
                }
            });
          }
        });
    }


    $scope.cancelSchoolClass1 = function() {
        $('#hidden_forms_schoolclass_kid1').slideUp();
    }
    $scope.cancelSchoolClass2 = function() {
        $('#hidden_forms_schoolclass_kid2').slideUp();
    }
    $scope.cancelSchoolClass3 = function() {
        $('#hidden_forms_schoolclass_kid3').slideUp();
    }
    

    
    setTimeout(function() {
        //$("#hidden_forms_schoolclass_kid1").css('height', ($scope.kids.length)*40 + 180 + 'px');
        createMainTooltip(".schoolclass_contact_icon");
        createMainTooltip(".schoolclass_icon");
        $('#application_loader').hide();
    }, 500);
    
}])









/**************************************************************************************************************************** 

schoolClassStudentDeleteCtrl 

*****************************************************************************************************************************/

.controller('schoolClassStudentDeleteCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    //console.log($rootScope.kids);

    $scope.studentId = "";
    if($routeParams.studentId != "") {
        $scope.schoolclassId = $routeParams.scid;
        $scope.schoolId = $routeParams.sid;
        $scope.schoolclassName = $routeParams.scn;
        $scope.schoolName = $routeParams.sn;
        $scope.studentId = $routeParams.studentId;
        $scope.studentName = $routeParams.n;
        $scope.type = "ucznia";
        $scope.backRoute = "/schoolClassDetails/" + $routeParams.schoolId + "/" + $routeParams.schoolclassId;
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/schoolClassDetails/" + $routeParams.schoolId + "/" + $routeParams.schoolclassId);
    }

    $scope.cancelDelete = function() {
        $location.path("/schoolClassDetails/" + $routeParams.schoolId + "/" + $routeParams.schoolclassId);
    }

    $scope.confirmDelete = function() {
        console.log("confirmed");
        var promiseKid = rpc('rpc_School.delKidFromSchoolClass', $routeParams.studentId, $routeParams.schoolclassId);
        promiseKid.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Dziecko zostało usunięte z klasy");
                $location.path("/schoolClassDetails/" + $routeParams.schoolId + "/" + $routeParams.schoolclassId);
            }
            else
                $.jnotify("Wystąpił błąd! Nie udało się usunąć dziecka z klasy: " + resp.msg, "error");
        });
    }

}])









/**************************************************************************************************************************** 

studentAbuseCtrl 

*****************************************************************************************************************************/

.controller('studentAbuseCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    //console.log($rootScope.kids);

    $scope.studentId = "";
    if($routeParams.studentId != "") {
        $scope.schoolclassId = $routeParams.scid;
        $scope.schoolId = $routeParams.sid;
        $scope.schoolclassName = $routeParams.scn;
        $scope.schoolName = $routeParams.sn;
        $scope.studentId = $routeParams.studentId;
        $scope.studentName = $routeParams.n;
        $scope.type = "ucznia";
        $scope.backRoute = "/schoolClassDetails/" + $scope.schoolId + "/" + $scope.schoolclassId;
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/schoolClassDetails/" + $scope.schoolId + "/" + $scope.schoolclassId);
    }
    $scope.abuse_context = "Informuję, że " + $routeParams.n + " nie jest uczniem klasy " + $routeParams.scn + " w szkole " + $routeParams.sn + ".";

    $scope.cancelAbuse = function() {
        $location.path("/schoolClassDetails/" + $scope.schoolId + "/" + $scope.schoolclassId);
    }

    $scope.confirmAbuse = function() {
        console.log("confirmed");
        console.log($scope.abuse_context);
        var cntxt = "{'studentId' : " + $routeParams.studentId + ", 'schoolclassId' : " + $scope.schoolclassId + ", 'schoolId' : " + $scope.schoolId + "}";
        var obj = {'cnt': $scope.abuse_context, 'cntxt': (cntxt).toString(), 'cat': 'abuse'};
        var promiseAbuse = rpc('rpc_UniForm.save', obj);
        promiseAbuse.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Zgłoszenie zostało wysłane. Dziękujemy!");
                $location.path("/schoolClassDetails/" + $scope.schoolId + "/" + $scope.schoolclassId);
            }
        });
    }

}])









/**************************************************************************************************************************** 

teacherAbuseCtrl 

*****************************************************************************************************************************/

.controller('teacherAbuseCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    //console.log($rootScope.kids);

    $scope.teacherId = "";
    if($routeParams.teacherId != "") {
        $scope.schoolId = $routeParams.sid;
        $scope.schoolName = $routeParams.sn;
        $scope.teacherId = $routeParams.teacherId;
        $scope.teacherName = $routeParams.n;
        $scope.type = "nauczyciela";
        $scope.backRoute = "/schoolsDetails/" + $scope.schoolId;
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/schoolsDetails/" + $scope.schoolId);
    }
    $scope.abuse_context = "Informuję, że " + $routeParams.n + " nie jest nauczycielem w szkole " + $routeParams.sn + ".";

    
    $scope.cancelAbuse = function() {
        $location.path("/schoolsDetails/" + $scope.schoolId);
    }

    $scope.confirmAbuse = function() {
        console.log("confirmed");
        console.log($scope.abuse_context);
        var cntxt = "{'teacherId' : " + $routeParams.teacherId + ", 'schoolId' : " + $scope.schoolId + "}";
        var obj = {'cnt': $scope.abuse_context, 'cntxt': (cntxt).toString(), 'cat': 'abuse'};
        var promiseAbuse = rpc('rpc_UniForm.save', obj);
        promiseAbuse.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Zgłoszenie zostało wysłane. Dziękujemy!");
                $location.path("/schoolsDetails/" + $scope.schoolId);
            }
        });
    }

}])










/* teachersCtrl */

.controller('teachersCtrl',['$scope', '$location', '$rootScope', '$log', 'auth', function($scope, $location, $rootScope, $log, auth) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    
    $("#module_title").html('Nauczyciele');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Applications/Live_Messenger_alt_3_32x32.png');

    $scope.teachers = [
        {'id':'3', 'avatar':'avatar.png',
         'first_name':'Maciej', 'last_name':'Rąbała', 
         'subjects':[{'subject_id':'9', 'subject_name':'Matematyka'}, {'subject_id':'19', 'subject_name':'Muzyka'}, {'subject_id':'19', 'subject_name':'Fizyka'}, {'subject_id':'19', 'subject_name':'Plastyka'}],
         'school_id':'1', 'school_name':'Szkoła Podstawowa nr 141 im. Mjr Henryka Sucharskiego1'},
        {'id':'4', 'avatar':'avatar.png',
         'first_name':'Marcin', 'last_name':'Kielecki', 
         'subjects':[{'subject_id':'9', 'subject_name':'Historia'}],
         'school_id':'1', 'school_name':'Szkoła Podstawowa nr 141 im. Mjr Henryka Sucharskiego1'},
        {'id':'5', 'avatar':'Metro_Icons/Folders_OS/Personal_80x80.png',
         'first_name':'Jacek', 'last_name':'Michnikowski', 
         'subjects':[{'subject_id':'9', 'subject_name':'Biologia'}],
         'school_id':'2', 'school_name':'Szkoła Podstawowa nr 141 im. Mjr Henryka Sucharskiego2'},
        {'id':'6', 'avatar':'avatar.png',
         'first_name':'Krystyna', 'last_name':'Porożek', 
         'subjects':[{'subject_id':'9', 'subject_name':'Geografia'}],
         'school_id':'3', 'school_name':'Szkoła Podstawowa nr 141 im. Mjr Henryka Sucharskiego3'},
    ];

    $(".school").each(function() {
        if($(this).attr('id') != "school_ALL") {
            $(this).bind('click', function() {
                $("#school_ALL").removeClass("hover");
                var school = ($(this).attr('id')).replace("school_", "");
                $(".school").each(function() { $(this).removeClass("hover") });
                $(".vis_card_inner").each(function() {
                    $(this).hide();
                    $("#school_" + (school).toUpperCase()).addClass("hover");
                    if(($(this).attr('id')).indexOf(school + "_vis_card_inner_") > -1) {
                        $(this).show();
                    } 
                    else {
                        $(this).hide();
                    }
                });
            });
        }
    });

    $("#school_ALL").bind('click', function() {
        $(".school").each(function() {
            $(this).removeClass("hover");
        });
        $(".vis_card_inner").each(function() {
            $(this).show();
        });
        $("#school_ALL").addClass("hover");
    });


}])




/**************************************************************************************************************************** 

contactsCtrl 

*****************************************************************************************************************************/

.controller('contactsCtrl',['$scope', '$location', '$rootScope', '$log', 'auth', 'rpc', function($scope, $location, $rootScope, $log, auth, rpc) {
    clearTooltips();
    $('#application_loader').show();    
    $scope.userInfo = $rootScope.userInfo;
    $scope.invitations = $rootScope.invitations.friends.invitations;
    removeNotification("contacts");
    //console.log($scope.invitations);

    // pobranie grup uzytkownika
    $scope.groups = [];
    $scope.getGroups = function() {
        var promiseGroups = rpc('rpc_ServiceGroup.getListGroups');
        promiseGroups.then(function(groups) {
            console.log("Wywolalem getListGroups() i dostalem");
            console.log(groups);
            if(groups.ret == "OK") {
               for(var g=0; g<groups.res.length; g++) {
                   //groups.res[g]['members_shortlist'] = groups.res[g].members.splice(0, 8);
                   $scope.groups.push(groups.res[g]);
               }
            }
            else
                $.jnotify("Nie można pobrać grup użytkownika: " + groups.msg, "error");
        });
    }
    
    $("#module_title").html('Znajomi');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/Contacts_32x32.png');


    // pobranie znajomych
    $scope.contacts = [];
    $scope.getContacts = function() {
        var promiseContacts = rpc('rpc_ServiceGroup.getGroupMembers', $rootScope.friendsGroup.group.id);
        promiseContacts.then(function(friends) {
            console.log("Wywolalem getGroupMembers() i dostalem");
            console.log(friends);
            if(friends.ret == "OK") {
                $scope.contacts = friends.res.members;
            }
            $("#c_letter_ALL").click();
        });
    }


    // potwierdzenie zaproszenia
    $scope.confirmInvitationForm = function(invitation) {
        console.log("groups_invitations_form");
        console.log(invitation);
        var promiseContactsConfirm = rpc('rpc_ServiceGroup.confirmInvitation', invitation.invit_id, true);
        promiseContactsConfirm.then(function(resp) {
            console.log("Wywolalem rpc_ServiceGroup.confirmInvitation() i dostalem");
            console.log(resp);
            if(resp.ret == "OK") {
                $("#invitation_box_" + invitation.invit_id).hide();
                var rootscope_invitations_clone = [];
                for(var i=0; i<$rootScope.invitations.friends.invitations.length; i++) {
                    if($rootScope.invitations.friends.invitations[i].invit_id != invitation.invit_id) {
                        rootscope_invitations_clone.push($rootScope.invitations.friends.invitations[i]);
                    }
                }
                $rootScope.invitations.friends.invitations = [];
                $rootScope.invitations.friends.invitations = rootscope_invitations_clone;
                $scope.invitations = [];
                $scope.invitations = $rootScope.invitations.friends.invitations;
                $rootScope.invitations.friends.invitations = $scope.invitations;
                $rootScope.getGroupInvitations();
 
                $scope.contacts = [];
                for(var i=0; i<resp.res.members.length; i++)
                    $scope.contacts.push(resp.res.members[i]);
                 
                $.jnotify("Przyjęto zaproszenie do grupy Znajomych");
                createMainTooltip(".bottom_box_options_icons");
            }
            //else    // celowo to zakomentowalem, bo confirmInvitation zostaje wywolany zaraz po rejectInvitation, nie wiem czemu
            //    $.jnotify("Wystąpił błąd: " + resp.msg, "error");
        });
    }


    // odrzucenie zaproszenia
    $scope.rejectInvitation = function(invitation_id) {
        jConfirm("Czy na pewno chcesz odrzucić zaproszenie?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno chcesz odrzucić zaproszenie?");
          if(agree) {
            var promiseContactsConfirm = rpc('rpc_ServiceGroup.confirmInvitation', invitation_id, false);
            promiseContactsConfirm.then(function(resp) {
                console.log("Wywolalem rpc_ServiceGroup.confirmInvitation() / reject i dostalem");
                console.log(resp);
                if(resp.ret == "OK") {
                    $("#invitation_box_" + invitation_id).hide();
                    var rootscope_invitations_clone = [];
                    for(var i=0; i<$rootScope.invitations.friends.invitations.length; i++) {
                        if($rootScope.invitations.friends.invitations[i].invit_id != invitation_id) {
                            rootscope_invitations_clone.push($rootScope.invitations.friends.invitations[i]);
                        }
                    }
                    $rootScope.invitations.friends.invitations = [];
                    $rootScope.invitations.friends.invitations = rootscope_invitations_clone;
                    $scope.invitations = [];
                    $scope.invitations = $rootScope.invitations.friends.invitations;

                    $.jnotify("Odrzucono zaproszenie do grupy Znajomych");
                }
                else
                    $.jnotify("Wystąpił błąd: " + resp.msg, "error");
            });
          }
        });
    }


    $(".letter").each(function() {
        if($(this).attr('id') != "letter_ALL") {
            $(this).bind('click', function() {
                $("#letter_ALL").removeClass("hover");
                var letter = $(this).text();
                $(".letter").each(function() { $(this).removeClass("hover") });
                $(".contact_name").each(function() {
                    var id = $(this).attr('id').replace("contact_name_", "");
                    $(".contact_vis_card_inner_" + id).hide();
                    $("#letter_" + (letter).toUpperCase()).addClass("hover");
                    if(($(this).find('label').text()).toUpperCase().substring(0,1) === (letter).toUpperCase()) {
                        $("#vis_card_inner_" + id).show();
                    } 
                    else {
                        $("#vis_card_inner_" + id).hide();
                    }
                });
            });
        }
    });

    $("#letter_ALL").bind('click', function() {
        $(".letter").each(function() {
            $(this).removeClass("hover");
        });
        $(".contact_vis_card_inner").each(function() {
            $(this).show();
        });
        $("#letter_ALL").addClass("hover");
    });


    $scope.getGroups();
    $scope.getContacts();
    setTimeout(function() {
        createMainTooltip(".bottom_box_options_icons"); 
        $('#application_loader').hide();       
    }, 800);
    
    

}])




/**************************************************************************************************************************** 

contactsInviteCtrl 

*****************************************************************************************************************************/

.controller('contactsInviteCtrl',['$scope', '$location', '$rootScope', '$routeParams', '$log', 'auth', 'rpc', function($scope, $location, $rootScope, $routeParams, $log, auth, rpc) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;

    $scope.inviteUserToContacts = function() {
        var promiseGroups = rpc('rpc_ServiceGroup.inviteToGroup', $routeParams.userId, $rootScope.friendsGroup.group.id);
        promiseGroups.then(function(invitation) {
            console.log("Wywolalem inviteToGroup() i dostalem");
            console.log(invitation);
            console.log("Parametry:");
            console.log($routeParams.userId);
            console.log($rootScope.friendsGroup.group.id);
            console.log($rootScope.friendsGroup.group);
            if(invitation.ret == "OK") {
                $.jnotify("Wysłano użytkownikowi zaproszenie do grupy Znajomych");
            }
            else {
                $.jnotify("Nie udało się wysłać zaproszenia do użytkownika: " + invitation.msg, "error");
            }
        });
    }
    
    if($routeParams.userId != "") {
        $scope.userId = $routeParams.userId;
        $scope.inviteUserToContacts();
    }
    else {
        $location.path("/contacts");
    }

}])




/**************************************************************************************************************************** 

contactsDeleteCtrl 

*****************************************************************************************************************************/

.controller('contactsDeleteCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    
    $scope.contactId = "";
    if($routeParams.contactId != "") {
        $scope.contactId = $routeParams.contactId;
        $scope.contactName = $routeParams.n;
        $scope.type = "znajomego";
        $scope.backRoute = "/contacts";
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/contacts");
    }

    $scope.cancelDelete = function() {
        $location.path("/contacts");
    }

    $scope.confirmDelete = function() {
        console.log("confirmed");
        console.log("Parametry:");
        console.log($routeParams.contactId);
        console.log($rootScope.friendsGroup);
        console.log($rootScope.friendsGroup.id);
        var promiseGroup = rpc('rpc_ServiceGroup.delFromGroup', $routeParams.contactId, $rootScope.friendsGroup.group.id);
        promiseGroup.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Użytkownik został usunięty z kontaktów");
                $location.path("/contacts");
            }
            else
                $.jnotify("Nie można usunąć użytkownika z kontaktów: " + resp.msg, "error");
        });
    }

}])










/**************************************************************************************************************************** 

groupsCtrl 

*****************************************************************************************************************************/

.controller('groupsCtrl',['$scope', '$location', '$rootScope', '$log', 'auth', 'rpc', function($scope, $location, $rootScope, $log, auth, rpc) {
    clearTooltips();   
    $('#application_loader').show(); 
    $scope.userInfo = $rootScope.userInfo;
    $scope.invitations = $rootScope.invitations.groups.invitations;
    removeNotification("groups");
    //console.log("$scope.invitations");
    //console.log($scope.invitations);

    $("#module_title").html('Grupy');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/Windows_Card_Space_32x32.png');

    // pobranie grup uzytkownika
    $scope.groups = [];
    $scope.getGroups = function() {
        var promiseGroups = rpc('rpc_ServiceGroup.getListGroups');
        promiseGroups.then(function(groups) {
            $scope.groups = [];
            console.log("Wywolalem getListGroups() i dostalem");
            console.log(groups);
            if(groups.ret == "OK") {
               for(var g=0; g<groups.res.length; g++) {
                   groups.res[g]['members_shortlist'] = [];
                   groups.res[g]['members'] = rpc('rpc_ServiceGroup.getGroupMembers', groups.res[g].id);
                   if(groups.res[g].moderator == $scope.userInfo.id && groups.res[g].group_type == "private")
                       groups.res[g]['can_delete'] = '1';
                   else
                       groups.res[g]['can_delete'] = '0';
                   $scope.groups.push(groups.res[g]);
                   
               }
            }
            else
                $.jnotify("Nie można pobrać grup użytkownika: " + groups.msg, "error");
        });  
             
    }
    $scope.getGroups();
    

    /*$scope.contacts = [];
    $scope.getContacts = function() {
        var promiseContacts = rpc('rpc_ServiceGroup.getGroupFriendsMembers');
        promiseContacts.then(function(friends) {
            if(friends.ret == "OK") {
                $scope.contacts = friends.res.members;
            }
        });
    }*/
    
    $scope.saveGroup = function(group) {
        var new_group = {'name':group.name, 'is_school_class':false};
        var promiseGroup = rpc('rpc_ServiceGroup.putGroup', new_group);
        promiseGroup.then(function(response) {
            console.log("Wywolalem rpc_ServiceGroup.putGroup() i dostalem");
            console.log(response);
            if(response.ret == "OK") {
                var added_group = response.res.group;
                added_group['moderator'] = $scope.userInfo.id;
                added_group['can_delete'] = '1';
                added_group['group_type'] = 'private';
                if(response.res.members.length > 0) {
                    added_group['members'] = {};
                    added_group.members['res'] = {};
                    added_group.members.res['members'] = [];
                    added_group.members.res['members'].push(response.res.members[0]);
                }
                $scope.groups.push(added_group);
                $.jnotify("Grupa została zapisana");
                createMainTooltip(".bottom_box_options_icons");
            }
            else
                $.jnotify("Nie można zapisać grupy: " + response.msg, "error");
 
        })
        group.name = "";
        $('#hidden_forms_groups').slideUp();
    }


    // potwierdzenie zaproszenia
    $scope.confirmInvitationForm = function(invitation) {
        console.log("groups_invitations_form");
        console.log(invitation);
        var promiseContactsConfirm = rpc('rpc_ServiceGroup.confirmInvitation', invitation.invit_id, true);
        promiseContactsConfirm.then(function(resp) {
            console.log("Wywolalem rpc_ServiceGroup.confirmInvitation() i dostalem");
            console.log(resp);
            if(resp.ret == "OK") {
                $("#invitation_box_" + invitation.invit_id).hide();
                var rootscope_invitations_clone = [];
                for(var i=0; i<$rootScope.invitations.groups.invitations.length; i++) {
                    if($rootScope.invitations.groups.invitations[i].invit_id != invitation.invit_id) {
                        rootscope_invitations_clone.push($rootScope.invitations.groups.invitations[i]);
                    }
                }
                $rootScope.invitations.groups.invitations = [];
                $rootScope.invitations.groups.invitations = rootscope_invitations_clone;
                $scope.invitations = [];
                $scope.invitations = $rootScope.invitations.groups.invitations;
                $rootScope.invitations.groups.invitations = $scope.invitations;
                $rootScope.getGroupInvitations();

                

                var added_group = resp.res.group;
                added_group['can_delete'] = '0';
                added_group['group_type'] = 'private';
                if(resp.res.members.length > 0) {
                    added_group['members'] = {};
                    added_group.members['res'] = {};
                    added_group.members.res['members'] = resp.res.members;
                }
                $scope.groups.push(added_group); 
                $.jnotify("Przyjęto zaproszenie do grupy");
                createMainTooltip(".bottom_box_options_icons");
            }
            //else    // celowo to zakomentowalem, bo confirmInvitation zostaje wywolany zaraz po rejectInvitation, nie wiem czemu
            //    $.jnotify("Wystąpił błąd: " + resp.msg, "error");
        });
    }


    // odrzucenie zaproszenia
    $scope.rejectInvitation = function(invitation_id) {
        jConfirm("Czy na pewno chcesz odrzucić zaproszenie?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno chcesz odrzucić zaproszenie?");
          if(agree) {
            var promiseContactsConfirm = rpc('rpc_ServiceGroup.confirmInvitation', invitation_id, false);
            promiseContactsConfirm.then(function(resp) {
                console.log("Wywolalem rpc_ServiceGroup.confirmInvitation() / reject i dostalem");
                console.log(resp);
                if(resp.ret == "OK") {
                    $("#invitation_box_" + invitation_id).hide();
                    var rootscope_invitations_clone = [];
                    for(var i=0; i<$rootScope.invitations.groups.invitations.length; i++) {
                        if($rootScope.invitations.groups.invitations[i].invit_id != invitation_id) {
                            rootscope_invitations_clone.push($rootScope.invitations.groups.invitations[i]);
                        }
                    }
                    $rootScope.invitations.groups.invitations = [];
                    $rootScope.invitations.groups.invitations = rootscope_invitations_clone;
                    $scope.invitations = [];
                    $scope.invitations = $rootScope.invitations.groups.invitations;

                    $.jnotify("Odrzucono zaproszenie do grupy");
                }
                else
                    $.jnotify("Wystąpił błąd: " + resp.msg, "error");
            });
          }
        });
    }


    $(".group_type").each(function() {
        if($(this).attr('id') != "group_type_ALL") {
            $(this).bind('click', function() {
                $("#group_type_ALL").removeClass("hover");
                $(".group_type").each(function() { $(this).removeClass("hover") });
                for(var i=0; i<$scope.groups.length; i++) {
                    if($scope.groups[i].group_type == "school_class" && $(this).attr("id") == "group_type_CLASS") {
                        $("#vis_card_inner_" + $scope.groups[i].id).show();
                        $("#group_type_CLASS").addClass("hover");
                    } 
                    else if($scope.groups[i].group_type == "private" && $(this).attr("id") == "group_type_PRIVATE") {
                        $("#vis_card_inner_" + $scope.groups[i].id).show();
                        $("#group_type_PRIVATE").addClass("hover");
                    } 
                    else if($scope.groups[i].group_type == "friends" && $(this).attr("id") == "group_type_FRIENDS") {
                        $("#vis_card_inner_" + $scope.groups[i].id).show();
                        $("#group_type_FRIENDS").addClass("hover");
                    } 
                    else {
                        $("#vis_card_inner_" + $scope.groups[i].id).hide();
                        //$("#group_type_ALL").addClass("hover");
                    }
                }
            });
        }
    });

    $("#group_type_ALL").bind('click', function() {
        $(".group_type").each(function() {
            $(this).removeClass("hover");
        });
        $(".group_vis_card_inner").each(function() {
            $(this).show();
        });
        $("#group_type_ALL").addClass("hover");
    });



    // wyjscie z formularza dodania grupy
    $scope.cancelGroup = function() {
        $('#hidden_forms_groups').slideUp();
    }

    //$scope.getContacts();
    setTimeout(function() {
        createMainTooltip(".small_group_avatar");
        createMainTooltip(".bottom_box_options_icons");
        $('#application_loader').hide();
    }, 600);

    

}])









/**************************************************************************************************************************** 

groupsDetailsCtrl 

*****************************************************************************************************************************/

.controller('groupsDetailsCtrl',['$scope', '$location', '$rootScope', '$routeParams', '$log', 'auth', 'rpc', function($scope, $location, $rootScope, $routeParams, $log, auth, rpc) {
    clearTooltips();   
    $('#application_loader').show(); 
    $scope.userInfo = $rootScope.userInfo;
    
    $("#module_title").html('Grupy');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/Windows_Card_Space_32x32.png');

    // pobranie grup uzytkownika
    $scope.group = {};
    $scope.getGroups = function() {
        var promiseGroups = rpc('rpc_ServiceGroup.getListGroups');
        promiseGroups.then(function(groups) {
            console.log("Wywolalem getListGroups() i dostalem");
            console.log(groups);
            if(groups.ret == "OK") {
               for(var g=0; g<groups.res.length; g++) {
                   if(groups.res[g].id == $routeParams.groupId) {
                       if(groups.res[g].moderator == $scope.userInfo.id && groups.res[g].group_type == "private")
                           groups.res[g]['can_delete'] = '1';
                       else
                           groups.res[g]['can_delete'] = '0';
                       $scope.group = groups.res[g];
                       console.log($scope.group);
                       $scope.group['members'] = [];
                       var group_id = groups.res[g].id;
                       var promiseGroupsMembers = rpc('rpc_ServiceGroup.getGroupMembers', group_id);
                       promiseGroupsMembers.then(function(members) {
                           console.log("Wywolalem getGroupMembers() i dostalem");
                           console.log(members);
                           if(members.ret == "OK") {
                               $scope.group.members = members.res.members;
                           }
                       });
                   }
               }
            }
        });
    }

    // pobranie znajomych
    $scope.contacts = [];
    $scope.getContacts = function() {
        var promiseContacts = rpc('rpc_ServiceGroup.getGroupMembers', $rootScope.friendsGroup.group.id);
        promiseContacts.then(function(friends) {
            console.log("Wywolalem getGroupFriendsMembers() i dostalem");
            console.log(friends);
            if(friends.ret == "OK") {
                //for(var z=0; z<100; z++) {
                //for(var i=0; i<friends.res.members.length; i++) {
                //    $scope.contacts.push(friends.res.members[i]);
                //}
                //}
                $scope.contacts = friends.res.members;
            }
            $("#c_letter_ALL").click();
        });
    }

    // wyslanie zaproszen dla uzytkownikow
    $scope.saveGroupMembers = function() {
        var users_to_save = [];
        var users_to_save_names = [];
        $(".group_details_contact").each(function() {
            if($(this).css('background-color') == "rgb(11, 0, 11)" || $(this).css('background-color') == "#0b000b") {
                users_to_save.push($(this).attr("id").replace("gd_contact_", ""));
                users_to_save_names.push($(this).attr("title"));
            }
        });
        var users_saved = [];
        for(var u=0; u<users_to_save.length; u++) {
            var username = users_to_save_names[u];
            var promiseAddGroup = rpc('rpc_ServiceGroup.inviteToGroup', users_to_save[u], $scope.group.id);
            promiseAddGroup.then(function(response) {
                console.log("Wywolalem inviteToGroup() i dostalem");
                console.log(response);
                if(response.ret == "OK") {
                    users_saved.push(username);
                }
            });
        }
        setTimeout(function() {
            if(users_saved.length == 1) $.jnotify(users_saved.length + " zaproszenie zostało wysłane");
            else if(users_saved.length <= 4) $.jnotify(users_saved.length + " zaproszenia zostały wysłane");
            else $.jnotify(users_saved.length + " zaproszeń zostało wysłanych");
            $('#hidden_forms_groups_details').slideUp();
            $("#btn_save_group_members").hide();
            $("#groups_change_info").hide();
            $location.path('/groupDetails/' + $scope.group.id);
        }, users_to_save.length*400);
    }



    $(".c_letter").bind('click', function() {
        $(".c_letter").each(function() {
            $(this).removeClass("hover");
        });
        $(this).addClass("hover");
        var letters = ($(this).attr("id").replace("c_letter_", "")).split('');
        $(".group_details_contact").each(function() {
            if(letters.length == 3) {  // ALL
                $(this).show();
            }
            else if(letters.length == 1) {
                var names = ($(this).text()).split(" ");
                if(names.length > 1) {
                    if(names[1].substr(0, 1).toUpperCase() === letters[0].toUpperCase())
                        $(this).show();
                    else
                        $(this).hide();
                } 
                else {
                    $(this).hide();
                }
            }
            else {
                var names = ($(this).text()).split(" ");
                if(names.length > 1) {
                    if(names[1].substr(0, 1).toUpperCase() === letters[0].toUpperCase())
                        $(this).show();
                    else if(names[1].substr(0, 1).toUpperCase() === letters[1].toUpperCase())
                        $(this).show();
                    else
                        $(this).hide();
                } 
                else {
                    $(this).hide();
                }
            }
        });
    });
    

    $scope.getGroups();
    $scope.getContacts();
    setTimeout(function() {
        // obsluga klikniec na liscie kontaktow
        $(".group_details_contact").bind('click', function() {
            //console.log($(this).css('background-color'));
            if($(this).css('background-color') == '#0b000b' || $(this).css('background-color') == 'rgb(11, 0, 11)')
                $(this).css('background-color', '#2E003A');
            else {
                $(this).css('background-color', '#0b000b');
                $("#btn_save_group_members").show();
                $("#groups_change_info").show();
            }

            var cnt = 0;
            $(".group_details_contact").each(function() {
                if($(this).css('background-color') == '#0b000b' || $(this).css('background-color') == 'rgb(11, 0, 11)') {
                    cnt = cnt + 1;
                    //console.log(cnt);
                }
                else {
                    cnt = cnt;
                    //console.log(cnt);
                }
            });
            //console.log("total cnt");
            //console.log(cnt);
            if(cnt == 0) {
                $("#btn_save_group_members").hide();
                $("#groups_change_info").hide();
            }

        });
        
        
        createMainTooltip(".contact");
        $('#application_loader').hide();
    }, 1500);


}])






/**************************************************************************************************************************** 

groupsEditCtrl 

*****************************************************************************************************************************/

.controller('groupsEditCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $('#application_loader').show();
    $scope.userInfo = $rootScope.userInfo;
    
    $("#module_title").html('Grupy');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/Windows_Card_Space_32x32.png');

    $scope.groupformedit = {};
    $scope.groups = [];
    $scope.getGroups = function() {
        var promiseGroups = rpc('rpc_ServiceGroup.getListGroups');
        promiseGroups.then(function(groups) {
            console.log("Wywolalem getListGroups() i dostalem");
            console.log(groups);
            if(groups.ret == "OK") {
               for(var g=0; g<groups.res.length; g++) {
                   //groups.res[g]['members'] = [];
                   //groups.res[g]['members_shortlist'] = [];
                   //groups.res[g]['members_shortlist'] = groups.res[g].members.splice(0, 8);
                   if(groups.res[g].id == $routeParams.groupId) {
                       $scope.groupformedit = groups.res[g];
                   }
               }
            }
        });
    }
    

    if($routeParams.groupId == "") {
        $location.path("/groups");
    }
    
    $scope.saveGroup = function(groupformedit) {
        var new_group = {'id': groupformedit.id, 'name': groupformedit.name};
        console.log("WYWOLUJE putGroup (edycja) z obiektem:");
        console.log(new_group);
        var promiseNewGroup = rpc("rpc_ServiceGroup.putGroup", new_group);
        promiseNewGroup.then(function(group) {
            for(var i=0; i<$scope.groups.length; i++) {
                if($scope.groups[i].id == $routeParams.groupId) {
                    $scope.groups[i].name = new_group.name;
                }
            }
            console.log("ZWROT z funkcji putGroup (edycja):");
            console.log(group);
            console.log("-------");
            groupformedit.name = "";
            $.jnotify("Dane grupy zostały zmienione");
            $('#hidden_forms_groups_edit').slideUp();
            $location.path("/groups");
        });
        //console.log($scope.kids);
    }


    $scope.cancelGroup = function() {
        $location.path("/groups");
    }

    setTimeout(function() {
        $scope.getGroups();
        $('#application_loader').hide();
    }, 400);


}])




/**************************************************************************************************************************** 

groupsLeaveCtrl 

*****************************************************************************************************************************/

.controller('groupsLeaveCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    
    $scope.groupId = "";
    if($routeParams.groupId != "") {
        $scope.groupId = $routeParams.groupId;
        $scope.groupName = $routeParams.n;
        $scope.backRoute = "/groups";
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/groups");
    }

    $scope.cancelDelete = function() {
        $location.path("/groups");
    }

    $scope.confirmDelete = function() {
        console.log("confirmed");
        var promiseGroup = rpc('rpc_ServiceGroup.leaveGroup', $scope.groupId);
        promiseGroup.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Odłączyłeś od grupy");
                $location.path("/groups");
            }
        });
    }

}])




/**************************************************************************************************************************** 

groupsDeleteCtrl 

*****************************************************************************************************************************/

.controller('groupsDeleteCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    
    $scope.groupId = "";
    if($routeParams.groupId != "") {
        $scope.groupId = $routeParams.groupId;
        $scope.groupName = $routeParams.n;
        $scope.type = "grupę";
        $scope.backRoute = "/groups";
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/groups");
    }

    $scope.cancelDelete = function() {
        $location.path("/groups");
    }

    $scope.confirmDelete = function() {
        console.log("confirmed");
        var promiseGroup = rpc('rpc_ServiceGroup.delGroup', $scope.groupId);
        promiseGroup.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Grupa została usunięta");
                $location.path("/groups");
            }
        });
    }

}])









/**************************************************************************************************************************** 

chatCtrl 

*****************************************************************************************************************************/

.controller('chatCtrl',['$scope', '$location', '$log', '$rootScope', 'rpc', 'auth', '$routeParams', function($scope, $location, $log, $rootScope, rpc, auth, $routeParams) {
    clearTooltips();
    $('#application_loader').show();
    $scope.userInfo = $rootScope.userInfo;
    removeNotification("chat");

    $("#module_title").html('Wiadomości');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Other/Mail_32x32.png');

    $scope.user_name = $routeParams.n;
    if($routeParams.kid == "1")
        $scope.parent_kid = 1;
    else
        $scope.parent_kid = 0;
    $scope.sendMessage = function() {
        if($scope.message_content == "") {
            $.jnotify("Nie wpisałeś treści wiadomości. Nie można wysłać.", "error");
        }
        else {
            var obj = {'content': $scope.message_content, 'recipients': [$routeParams.userId]};
            console.log(obj);
            var promiseMsg = rpc('rpc_Msg.putMsg', obj);
            promiseMsg.then(function(message) {
                console.log("Wywolalem putMsg() i dostalem");
                console.log(message);
                if(message.ret == "OK") {
                    $.jnotify("Wiadomość została wysłana.");
                    $location.path('/chat');
                }
                else 
                    $.jnotify("Wystąpił błąd. Nie udało się wysłać wiadomości.", "error");
            });
        }
    }


    // pobranie znajomych
    $scope.contacts = [];
    $scope.getContacts = function() {
        var promiseContacts = rpc('rpc_ServiceGroup.getGroupMembers', $rootScope.friendsGroup.group.id);
        promiseContacts.then(function(friends) {
            console.log("Wywolalem getGroupFriendsMembers() i dostalem");
            console.log(friends);
            if(friends.ret == "OK") {
                $scope.contacts = friends.res.members;
            }
        });
    }
    $scope.getContacts();

    $scope.messages = [];
    $scope.msg_detail = {};
    $scope.folder_type = '';
    $scope.getMessages = function(folder_type) {
        var promiseMsg = rpc('rpc_Msg.getMsgList', {'folder': folder_type});
        promiseMsg.then(function(messages) {
            $(".chat_folder_type").each(function() { $(this).removeClass("hover") });
            $("#chat_folder_type_" + folder_type).addClass("hover");
            $scope.messages = [];
            $("#chat_box_detail").hide();
            $scope.msg_detail = {};
            console.log("Wywolalem getMsgList() i dostalem");
            console.log(messages);
            $scope.folder_type = folder_type;
            if(messages.ret == "OK") {
                for(var i=0; i<messages.res.length; i++) {
                    messages.res[i]['date_short'] = messages.res[i].cdt.substr(0,19).replace("T", " ");
                    messages.res[i]['content_short'] = messages.res[i].cnt.substr(0,30) + "...";
                    $scope.messages.push(messages.res[i]);
                    if(folder_type == "outbox") {
                        $scope.getMsgOwner(messages.res[i].rcps[0], i);
                    }
                    else {
                        $scope.getMsgOwner(messages.res[i].athr, i);
                    }
                }
            }
            else 
                $.jnotify("Wystąpił błąd. Nie udało się pobrać wiadomości.", "error");
        });
    }
    $scope.getMessages('inbox');
    

    $scope.getMsgOwner = function(user_id, index) {
        var promiseMsgOwner = rpc('rpc_ServiceUser.getUserInfo', user_id);
        promiseMsgOwner.then(function(ui) {
            console.log("Wywolalem getUserInfo() z getMessages() i dostalem");
            console.log(ui);
            $scope.messages[index].owner_obj = ui.res;
        });
    }


    $scope.showMessage = function(msg_id) {
        for(var m=0; m<$scope.messages.length; m++) {
            if($scope.messages[m].id == msg_id) {
                $scope.msg_detail = $scope.messages[m];
                $("#chat_box_detail").show();
                var promiseMsg = rpc('rpc_Msg.setMsgRead', $scope.messages[m].id);
                promiseMsg.then(function(message) {
                    console.log("Wywolalem setMsgRead() i otrzymalem");
                    console.log(message);
                    $rootScope.getMsgUnread();
                });
            }
        }
        
    }

 
    $scope.setMessageArchive = function(msg_id) {
        console.log(msg_id);
        jConfirm("Czy na pewno przenieść wiadomość do archiwum?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno przenieść wiadomość do archiwum?");
          if(agree) {
            var promiseMsg = rpc('rpc_Msg.delMsg', msg_id);
            promiseMsg.then(function(message) {
                console.log("Wywolalem delMsg() i otrzymalem");
                console.log(message);
                if(message.ret == "OK") {
                    $.jnotify("Wiadomość została przeniesiona do archiwum.");
                    $scope.getMessages('inbox');
                }
                else {
                    $.jnotify("Wystąpił błąd. Nie udało się przenieść wiadomości do archiwum: " + message.msg, "error");
                }
            });
          }
        });
    }    


    setTimeout(function() {


        createMainTooltip(".show_more");
        createMainTooltip(".bottom_box_options_icons");
        $('#application_loader').hide();

    }, 500);


}])









/**************************************************************************************************************************** 

newsCtrl 

*****************************************************************************************************************************/

.controller('newsCtrl',['$scope', '$location', '$log', '$rootScope', 'rpc', 'auth', '$routeParams', function($scope, $location, $log, $rootScope, rpc, auth, $routeParams) {
    clearTooltips();
    $('#application_loader').show();
    $scope.userInfo = $rootScope.userInfo;

    $("#module_title").html('Dyskusje');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Applications/Messaging_alt_32x32.png');

    $scope.limit = 10;
    $scope.offset = 0;
    $scope.filter = 'all';
    $scope.group_ids = [];
        

    /* pobranie wpisow dostepnych dla uzytkownika */
    $scope.posts = [];
    $scope.getPosts = function(limit, offset, filter, group_ids, clear) {
        $scope.limit = limit;
        $scope.offset = offset+limit;
        $scope.filter = filter;
        $scope.group_ids = group_ids;
        $(".post_type").each(function() {
            $(this).removeClass("hover");
            if($(this).attr('id').indexOf("ALL") > -1 && filter == "all") {
                $(this).addClass('hover');
            }
            else if($(this).attr('id').indexOf("PRIVATE") > -1 && filter == "private") {
                $(this).addClass('hover');
            }
            else if($(this).attr('id').indexOf("GROUP") > -1 && filter == "group") {
                for(var i = 0; i<group_ids.length; i++) {
                    if($(this).attr('id').indexOf("GROUP_" + group_ids[i]) > -1)
                        $(this).addClass('hover');
                }
            }
        });
        var obj = {'limit':limit, 'offset':offset, 'filter':filter};
        if(filter == "group" && group_ids.length > 0)
            obj['fil'] = group_ids;
        //console.log(obj);
        var promisePost = rpc('rpc_Post.getPosts', obj);
        promisePost.then(function(posts) {
            console.log("Wywolalem getPosts() i dostalem");
            console.log(posts);
            if(posts.res.length == 0) {
                $.jnotify("Nie ma więcej wpisów", "warning");
            }
            if(clear == 1)
                $scope.posts = [];
            for(var i=0; i<posts.res.length; i++) {
                var post = posts.res[i];
                post['content_short'] = posts.res[i]['content'].substr(0, 100);
                if(post['content_short'] == posts.res[i]['content'])
                    post['more_link_needed'] = '0';
                else
                    post['more_link_needed'] = '1';
                post['created'] = posts.res[i]['edited_dt'];
                post['created_text'] = getDateText(post['created']);
                post['comments'] = [];
                post['comments_to_show'] = [];
                if(post.owner == $scope.userInfo.id) {
                    post['owner_obj'] = {};
                    post.owner_obj = $scope.userInfo;
                }
                else {
                    post['owner_obj'] = {};
                    $.each($rootScope.usersList, function(idx, user) {
                        if(user.id == post.owner) {
                            post.owner_obj = user;
                        }
                    });
                }
                $scope.getPostComments(post.id, i+offset);
                $scope.posts.push(post);
                //createMainTooltip(".del_link_posts");
                //fitPostContents();
            }
            setTimeout(function() {
                fitPostContents();
                createMainTooltip(".del_link_posts");
            }, 600);
            fitPostContents();
        });
    }
    
    if($routeParams.groupId !== undefined)
        $scope.getPosts($scope.limit, 0, 'group', [$routeParams.groupId], 1);
    else
        $scope.getPosts($scope.limit, 0, 'all', [], 1);

    

    /* pobranie komentarzy dla każdego wpisu */
    $scope.getPostComments = function(post_id, index) {
        var promiseGroup = rpc('rpc_Post.getComments', {'post_id':post_id, 'limit':0, 'offset':0});
        promiseGroup.then(function(comments) {
            console.log("Wywolalem getComments() z getPosts() i dostalem");
            console.log(comments);
            for(var p=0; p<comments.res.length; p++) {
                //comments.res[p]['owner'] = {};
                comments.res[p]['created_text'] = getDateText(comments.res[p]['edited_dt']);
                var wdth2 = $("#post_content_" + post_id).width();
                comments.res[p]['comment_width'] = wdth2 + 32;
                comments.res[p]['comment_textarea_width'] = wdth2 - 160;
                comments.res[p]['owner'] = {};
                if(comments.res[p].owner_id == $scope.userInfo.id) {
                    comments.res[p].owner = $scope.userInfo;
                }
                else {
                    $.each($rootScope.usersList, function(idx, user) {
                        if(user.id == comments.res[p].owner_id) {
                            comments.res[p].owner = user;
                        }
                    });
                }
                //if(p >= comments.res.length-2)
                if(p >= comments.res.length)
                    $scope.posts[index].comments_to_show.push(comments.res[p]);
                $scope.posts[index].comments.push(comments.res[p]);
            }
        });
        console.log("Posts w komentarzach:");
        console.log($scope.posts);
        fitPostContents();
        createMainTooltip(".del_link_posts");
    }

    
    /* zapisanie wpisu */
    $scope.saveNews = function(newsform) {
        var groups_checked = [];
        $(".post_checkbox_for_groups").each(function() {
            if($(this).attr('checked') == "checked")
                groups_checked.push($(this).attr('id').replace('new_post_group_', ''));
        });
        var new_post = {'owner_id':$scope.userInfo.id, 'owner_obj':$scope.userInfo, 'title':newsform.title, 'content':newsform.text, 'content_short':newsform.text.substr(0, 100), 'comments':[], 'comments_to_show':[], 'comments_num':0};
        if(newsform.only_me == true) {
            new_post['private'] = true;
            new_post['groups'] = [];
        }
        else if(groups_checked.length > 0) {
            new_post['private'] = false;
            new_post['groups'] = groups_checked;
        }
        else { 
            new_post['private'] = true;
            new_post['groups'] = [];
        }
        //var new_post = {'owner_id':$scope.userInfo.id, 'title':newsform.title, 'content':newsform.text, 'comments':[], 'comments_to_show':[]};
        console.log(new_post);
        var promiseGroup = rpc('rpc_Post.putPost', new_post);
        promiseGroup.then(function(posts) {
            console.log("Wywolalem putPost() i dostalem");
            console.log(posts);
            if(posts.ret == "OK")
                $.jnotify("Wpis został opublikowany");
            else
                $.jnotify("Nie można opublikować wpisu: " + posts.msg, "error");
        });
        $scope.posts.unshift(new_post);
        newsform.title = "";
        newsform.text = "";
        $("#hidden_forms_news").slideUp();
        setTimeout(function() {
            fitPostContents();
            createMainTooltip(".del_link_posts");
        }, 800);
    }

    
    $scope.cancelNews = function() {
        $('#hidden_forms_news').slideUp();
    }


    /* pokazanie wszystkich komentarzy do wpisu */
    $scope.showAllComments = function(post_id) {
        var wdth2 = $("#post_content_" + post_id).width();
        //console.log(wdth2);
        for(var p=0; p<$scope.posts.length; p++) {
            if(post_id == $scope.posts[p].id) {
                $scope.posts[p].comments_to_show = $scope.posts[p].comments;
                //$(".comments_" + $scope.posts[p].id).slideUp("fast");
                $(".comments_" + $scope.posts[p].id).show();
            }
        }
        $("#post_comments_show_all_" + post_id).hide();
        

        //$(".post_comments_show_all").css('margin-left', wdth1 + wdth2 - 162 + 'px');
        //$(".post_comments").css('width', wdth2 + 32 + 'px');
        //$(".post_comment_textarea").css('width', wdth2 - 78 + 'px');
        createMainTooltip(".del_link_posts");
        fitPostContents();
    }


    $scope.hideAllComments = function(post_id) {
        var wdth2 = $("#post_content_" + post_id).width();
        //console.log(wdth2);
        for(var p=0; p<$scope.posts.length; p++) {
            if(post_id == $scope.posts[p].id) {
                $scope.posts[p].comments_to_show = $scope.posts[p].comments;
                //$(".comments_" + $scope.posts[p].id).slideUp("fast");
                $(".comments_" + $scope.posts[p].id).show();
            }
        }
        $("#post_comments_show_all_" + post_id).show();
        

        //$(".post_comments_show_all").css('margin-left', wdth1 + wdth2 - 162 + 'px');
        //$(".post_comments").css('width', wdth2 + 32 + 'px');
        //$(".post_comment_textarea").css('width', wdth2 - 78 + 'px');
        createMainTooltip(".del_link_posts");
        fitPostContents();
    }

    
    $scope.commentform = {};
    /* zapisanie komentarza do wpisu */
    $scope.saveComment = function(commentform, post_id, comment) {
        $("#post_comments_show_all_" + post_id).hide();
        //console.log(comment);
        //console.log(commentform);
        //console.log(post_id);
        for(var p=0; p<$scope.posts.length; p++) {
            if(post_id == $scope.posts[p].id) {
                var createdDate = new Date();
                var day = createdDate.getDate();
                var month = createdDate.getMonth() + 1;
                var year = createdDate.getFullYear();
                var hours = createdDate.getHours();
                var minutes = createdDate.getMinutes();
                var created = "" + year + "-" + month + "-" + day + " " + hours + ":" + minutes;
                var new_comment = {'id':'999', 'owner':{'first_name':$scope.userInfo.first_name, 'last_name':$scope.userInfo.last_name}, 'owner_name':$scope.userInfo.first_name + " " + $scope.userInfo.last_name, 'created':created, 'created_text':getDateText(created), 'content':comment};
                var promiseGroup = rpc('rpc_Post.putComment', {'post_id':post_id, 'content':new_comment.content});
                promiseGroup.then(function(comment) {
                    console.log("Wywolalem putComment() i dostalem");
                    console.log(comment);
                    if(comment.ret == "OK") {
                        $.jnotify("Komentarz został opublikowany");
                        new_comment.id = comment.res.id;
                        //new_comment.owner = $scope.userInfo;
                        $("#post_comments_show_all_" + post_id).hide();
                    }
                    else
                        $.jnotify("Nie można opublikować komentarza: " + comment.msg, "error");
                });
                $scope.posts[p].comments.push(new_comment);
                $scope.posts[p].comments_to_show.push(new_comment);
                $scope.commentform.comment = "";
                $scope.comment = "";
                $("#post_comment_to_add_" + post_id).val('');
                $("#post_comment_to_add_" + post_id).text('');
                createMainTooltip(".del_link_posts");
            }
        }
        
    }


    $scope.groups = [];
    /* pobranie grup uzytkownika */
    $scope.getGroups = function() {
        var promiseGroups = rpc('rpc_ServiceGroup.getListGroups');
        promiseGroups.then(function(groups) {
            console.log("Wywolalem getListGroups() i dostalem");
            console.log(groups);
            if(groups.ret == "OK") {
               for(var g=0; g<groups.res.length; g++) {
                   $scope.groups.push(groups.res[g]);
               }
            }
            else
                $.jnotify("Nie można pobrać grup użytkownika: " + groups.msg, "error");

        });
        
    }
    $scope.getGroups();
        


    setTimeout(function() {

        //var content_box_width = $("#content_box").css('width');
        //$(".post_title").css('width', parseInt(content_box_width) - 420 + 'px');

        $(".post_comment_textarea").jScrollPane();
        $(".post_comment_textarea").css('color', '#7b7b7b');
        $(".post_comment_textarea").bind('keyup', function() {
            if($(this).val() == "Wpisz komentarz")
                $(this).css('color', '#7b7b7b');
            else
                $(this).css('color', '#e8e6ed');
        });
        $(".post_comment_textarea").bind('change', function() {
            if($(this).val() == "Wpisz komentarz")
                $(this).css('color', '#7b7b7b');
            else
                $(this).css('color', '#e8e6ed');
        });
        
        fitPostContents();
 
        //createMainTooltip(".post_footer a");
        createMainTooltip(".del_link_posts");
        
        console.log($scope.groups.length);
        if($scope.groups.length <= 3) {
            $("#hidden_forms_news").css('height', '440px');
        }
        else {
            //console.log($scope.groups.length/3);
            var new_height = 400 + parseInt($scope.groups.length/1) * 26;
            //console.log(new_height);
            $("#hidden_forms_news").css('height', new_height + 'px');
        }
        $('#application_loader').hide();

    }, 500);


}])




/**************************************************************************************************************************** 

newsDeleteCtrl 

*****************************************************************************************************************************/

.controller('newsDeleteCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    
    $scope.newsId = "";
    if($routeParams.newsId != "") {
        $scope.newsId = $routeParams.newsId;
        $scope.newsName = $routeParams.n;
        $scope.type = "wpis";
        $scope.backRoute = "/news";
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/news");
    }

    $scope.cancelDelete = function() {
        $location.path("/news");
    }

    $scope.confirmDelete = function() {
        console.log("confirmed");
        var promiseGroup = rpc('rpc_Post.delPost', $scope.newsId);
        promiseGroup.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Wpis został usunięty");
                $location.path("/news");
            }
        });
    }

}])




/**************************************************************************************************************************** 

newsCommentsDeleteCtrl 

*****************************************************************************************************************************/

.controller('newsCommentsDeleteCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    
    $scope.commentId = "";
    if($routeParams.commentId != "") {
        $scope.commentId = $routeParams.commentId;
        $scope.type = "komentarz";
        $scope.backRoute = "/news";
        $scope.name = $routeParams.n;
    }
    else {
        $location.path("/news");
    }

    $scope.cancelDelete = function() {
        $location.path("/news");
    }

    $scope.confirmDelete = function() {
        console.log("confirmed");
        var promiseGroup = rpc('rpc_Post.delComment', $scope.commentId);
        promiseGroup.then(function(resp) {
            console.log(resp);
            if(resp.ret == "OK") {
                $.jnotify("Komentarz został usunięty");
                $location.path("/news");
            }
        });
    }

}])




/**************************************************************************************************************************** 

pollsCtrl 

*****************************************************************************************************************************/

.controller('pollsCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'auth', 'pubsub', 'rpc', 'model', function($scope, $location, $log, $rootScope, $routeParams, auth, pubsub, rpc, model) {
    clearTooltips();
    $scope.userInfo = $rootScope.userInfo;
    $('#application_loader').show();
    
    $("#module_title").html('Ankiety');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/System_alt_32x32.png');


    $scope.polls = [];
    $scope.polls_archive = [];
    $scope.pollform = {};
    $scope.answers = [];
    $scope.answers.push('');
    $scope.answers.push('');
    $scope.addAnswer = function() {
        $scope.answers.push('');
        $("#hidden_forms_polls").height($("#hidden_forms_polls").height() + 60 + 'px');
    }

    $scope.delAnswer = function(index) {
        $("#poll_answer_" + index).hide();
        $("#poll_answer_input_" + index).val('');
        $("#hidden_forms_polls").height($("#hidden_forms_polls").height() - 60 + 'px');
    }

    $scope.getPolls = function() {
        var poll_groups = [];
        for(var g=0; g<$scope.groups.length; g++) {
            poll_groups.push($scope.groups[g].id);
        }
        var obj = {'groups': poll_groups};
        console.log(obj);
        var promiseGroups = rpc('rpc_Poll.getPolls');
        console.log('rpc_Poll.getPolls');
        promiseGroups.then(function(polls) {
            console.log("Wywolalem getPolls() i dostalem");
            console.log(polls);
            var width100 = $("#content_box").width() - 400;
            //console.log(width100);
            var dt = new Date();
            var today = dt.getFullYear() + "-" + (dt.getMonth()+1) + "-" + dt.getDate();
            if(polls.ret == "OK") {
                var colors = ['lightblue2', 'yellow', 'mattgreen', 'violet2', 'grey', 'darkblue', 'orange', 'lightblue2', 'yellow', 'mattgreen', 'violet2', 'grey', 'darkblue', 'orange', 'lightblue2', 'yellow', 'mattgreen', 'violet2', 'grey', 'darkblue', 'orange'];
                for(var p=0; p<polls.res.length; p++) {

                    if((polls.res[p].voted).hasOwnProperty('choice'))
                        polls.res[p]['i_voted'] = 1;
                    else
                        polls.res[p]['i_voted'] = 0;
                    
                    var wsp = parseFloat(width100/polls.res[p].vote_counter);
                    //console.log(wsp);
                    for(var c=0; c<polls.res[p].choices.length; c++) {
                        polls.res[p].choices[c]['width'] = parseFloat(polls.res[p].choices[c].counter * wsp);
                        if(parseInt(polls.res[p].choices[c].width) == 0) polls.res[p].choices[c].width = 1;
                        polls.res[p].choices[c]['color'] = colors[c];
                    }
                    
                    var dtstart = Date.parse(polls.res[p].dt_start);
                    var dtstop = Date.parse(polls.res[p].dt_stop);
                    var dttoday = dt.getTime();
                    polls.res[p]['dtstart'] = (polls.res[p].dt_start).toString().substr(0, 10);
                    polls.res[p]['dtstop'] = (polls.res[p].dt_stop).toString().substr(0, 10);
                    if(dtstart <= dttoday && dtstop >= dttoday)
                        $scope.polls.push(polls.res[p]);
                    else
                        $scope.polls_archive.push(polls.res[p]);
                }
                if($scope.polls.length !== undefined) {
                    $scope.polls.sort(function(obj1, obj2) {
                        return obj1.i_voted - obj2.i_voted;
                    });
                }
                if($scope.polls_archive !== undefined) {
                    $scope.polls_archive.sort(function(obj1, obj2) {
                        return obj1.dt_start - obj2.dt_start;
                    });
                }
            }
            else
                $.jnotify("Nie udało się pobrać ankiet: " + polls.msg, "error");

            $('#application_loader').hide();
        });
        
    }
                

    $scope.showPollDetails = function(poll_id) {
        $("#poll_card_info_more_" + poll_id).slideDown();
    }


    $scope.savePoll = function(pollform) {
        var groups_checked = [];
        $(".post_checkbox_for_groups").each(function() {
            if($(this).attr('checked') == "checked")
                groups_checked.push($(this).attr('id').replace('new_poll_group_', ''));
        });
        var count_answers = 0;
        var choices = [];
        $(".poll_form_input_answer").each(function() {
            if($(this).val() != '') {
                count_answers = count_answers + 1;
                var choice = {};
                choice['choice'] = $(this).val();
                choices.push(choice);
            }
        });
        if(count_answers == 0) {
            $.jnotify("Wymagane są co najmniej 2 odpowiedzi w ankiecie.", "error");
        }
        else {
            var obj = {'question': pollform.question, 'descr': '', 'choices': choices, 'groups': groups_checked, 'dt_start': pollform.startDate, 'dt_stop': pollform.endDate, 'anon': true};
            console.log(obj);
            var promiseGroups = rpc('rpc_Poll.putPoll', obj);
            promiseGroups.then(function(poll) {
                console.log("Wywolalem putPoll() i dostalem");
                console.log(poll);
                if(poll.ret == "OK") {
                    $scope.polls.push(poll.res);
                    $.jnotify("Ankieta została zapisana.");
                    $("#hidden_forms_polls").slideUp();
                    $scope.polls = [];
                    $scope.polls_archive = [];
                    $scope.getPolls();
                }
                else
                    $.jnotify("Nie udało się zapisać ankiety: " + poll.msg, "error");

            });
        }
    }

    $scope.cancelPoll = function() {
        $("#hidden_forms_polls").slideUp();
    }

    $scope.showPollResults = function(poll_id) {
        $("#" + poll_id + "_results").fadeToggle();
    }
    
    $scope.vote = function(poll_id, choice) {
        jConfirm("Czy na pewno chcesz zagłosować na '" + choice.choice + "'?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno przenieść wiadomość do archiwum?");
          if(agree) {
            console.log(poll_id);
            console.log(choice._id);
            var promiseMsg = rpc('rpc_Poll.putVote', poll_id, choice._id);
            promiseMsg.then(function(vote) {
                console.log("Wywolalem putVote() i otrzymalem");
                console.log(vote);
                if(vote.ret == "OK") {
                    $.jnotify("Głos został oddany.");
                    for(var p=0; p<$scope.polls.length; p++) {
                        if($scope.polls[p].id == poll_id) {
                            for(var c=0; c<$scope.polls[p].choices.length; c++) {
                                if($scope.polls[p].choices[c]._id == choice._id) {
                                    $scope.polls[p].choices[c].counter = $scope.polls[p].choices[c].counter + 1;

                                    $scope.polls[p]['i_voted'] = 1;
                                    var width100 = $("#content_box").width() - 400;
                                    var wsp = parseFloat(width100/$scope.polls[p].choices[c].counter);
                                    $scope.polls[p].choices[c].width = parseFloat($scope.polls[p].choices[c].counter * wsp);
                                    if(parseInt($scope.polls[p].choices[c].width) == 0) $scope.polls[p].choices[c].width = 1;
                                }
                            }
                            //$scope.polls_archive.push($scope.polls[p]);
                            //$scope.polls.splice(p, 1);
                        }
                    }
                }
                else {
                    $.jnotify("Wystąpił błąd. Nie udało się zagłosować w ankiecie: " + vote.msg, "error");
                }
            });
          }
        });
    }


    $scope.delPoll = function(poll_id) {
        jConfirm("Czy na pewno chcesz usunąć ankietę?", 'Confirmation Dialog', function(agree) {
          if(agree) {
            console.log(poll_id);
            var promiseMsg = rpc('rpc_Poll.delPoll', poll_id);
            promiseMsg.then(function(poll) {
                console.log("Wywolalem delPoll() i otrzymalem");
                console.log(poll);
                if(poll.ret == "OK") {
                    $.jnotify("Ankieta została usunięta.");
                    for(var p=0; p<$scope.polls.length; p++) {
                        if($scope.polls[p].id == poll_id) {
                            $scope.polls.splice(p, 1);
                        }
                    }
                    for(var p=0; p<$scope.polls_archive.length; p++) {
                        if($scope.polls_archive[p].id == poll_id) {
                            $scope.polls_archive.splice(p, 1);
                        }
                    }
                }
                else {
                    $.jnotify("Wystąpił błąd. Nie udało się usunąć ankiety: " + poll.msg, "error");
                }
            });
          }
        });
    }


    $scope.groups = [];
    /* pobranie grup uzytkownika */
    $scope.getGroups = function() {
        var promiseGroups = rpc('rpc_ServiceGroup.getListGroups');
        promiseGroups.then(function(groups) {
            console.log("Wywolalem getListGroups() i dostalem");
            console.log(groups);
            if(groups.ret == "OK") {
               for(var g=0; g<groups.res.length; g++) {
                   $scope.groups.push(groups.res[g]);
                   $("#hidden_forms_polls").height($("#hidden_forms_polls").height() + 60 + 'px');
               }
               $scope.getPolls();
            }
            else
                $.jnotify("Nie można pobrać grup użytkownika: " + groups.msg, "error");

        });
        
    }
    $scope.getGroups();

    setTimeout(function() {
        createMainTooltip(".vote_poll");
        createMainTooltip(".del_poll");
    }, 500);

}])














/* calendarCtrl */

.controller('calendarCtrl',['$scope', '$location', '$log', 'auth', function($scope, $location, $log, auth) {
    clearTooltips();
    
    $("#module_title").html('Kalendarz');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Applications/Calendar_32x32.png');

    var eventsInline = [{ "date": "1349703047000", "type": "demo", "title": "Project B demo", "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", "url": "http://www.event2.com/" },{ "date": "1344515447000", "type": "meeting", "title": "Project A meeting", "description": "Lorem Ipsum dolor set", "url": "http://www.event1.com/" },{ "date": "1345033847000", "type": "demo", "title": "Project B demo", "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", "url": "http://www.event2.com/" },{ "date": "1347712247000", "type": "meeting", "title": "Project A meeting", "description": "Lorem Ipsum dolor set", "url": "http://www.event1.com/" },{ "date": "1348230647000", "type": "demo", "title": "Project B demo", "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", "url": "#" },
                        { "date": "1349094647000", "type": "meeting", "title": "Project A meeting", "description": "Lorem Ipsum dolor set", "url": "#" }
    ];
    $("#eventCalendar").eventCalendar({
        monthNames: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
	monthNamesAddistional: ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Wrzesnia", "Października", "Listopada", "Grudnia"],
	dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa','Czwartek', 'Piątek','Sobota'],
        dayNamesShort: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob' ],
        txt_noEvents: "Brak wydarzeń",
        txt_SpecificEvents_prev: "",
        txt_SpecificEvents_after: "Wydarzenia:",
        txt_next: "nast",
        txt_prev: "poprz",
        txt_NextEvents: "Następne wydarzenia:",
        txt_GoToEventUrl: "Przejdź do wydarzenia",
        jsonData: eventsInline,
        showDescription: true,
        showDayAsWeeks: true,
    });
}])



/* budgetCtrl */

.controller('budgetCtrl',['$scope', '$location', '$log', 'auth', function($scope, $location, $log, auth) {
    clearTooltips();
    
    $("#module_title").html('Budżet');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Applications/Calculator_32x32.png');

}])


/* documentCtrl */

.controller('documentCtrl',['$scope', '$location', '$log', '$rootScope', 'pubsub', 'auth', 'rpc', function($scope, $location, $log, $rootScope, pubsub, auth, rpc) {
    clearTooltips();    
    $scope.profile = $rootScope.userInfo;
    
    $("#module_title").html('Foldery i dokumenty');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Folders_OS/User_Folder_Blank_32x32.png');
  
    /*setTimeout(function() {
        var file_uploader = $('#thumbnail-fine-uploader').fineUploader({
            request: {
                //endpoint: 'server/success.html'
                endpoint: '/upload'
            },
            autoUpload: false,
            multiple: true,
            //validation: {
            //    allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
            //    sizeLimit: 51200 // 50 kB = 50 * 1024 bytes
            //},
            text: {
                uploadButton: 'Dodaj pliki',
                cancelButton: 'Anuluj',
                retryButton: 'Ponów',
                failUpload: 'Przesyłanie nie powiodło się!',
                formatProgress: "{percent}% z {total_size}",
                waitingForResponse: "Przesyłanie..."
            },
            debug: true
        }).on('submit', function(event, id, filename) {
            $(this).fineUploader('setParams', {'user_id': '1'});
        }).on('error', function(event, id, fileName, reason) {
            console.log("Przesyłanie nie powiodło się: " + reason);
            //if (responseJSON.success) {
            //    $(this).append('<img src="img/success.jpg" alt="' + fileName + '">');
            //}
        }).on('complete', function(event, id, fileName, responseJSON) {
            //if (responseJSON.success) {
            //    $(this).append('<img src="img/success.jpg" alt="' + fileName + '">');
            //}
        }); 

        $('#triggerUpload').bind('click', function() {
             file_uploader.fineUploader('uploadStoredFiles');
        });

    }, 500);*/
}])




.controller('AttachmentCtrl',['$scope', '$location', '$timeout', '$log', '$rootScope', 'pubsub', 'auth', 'rpc', function($scope, $location, $timeout, $log, $rootScope, pubsub, auth, rpc) {
    clearTooltips();    
    $scope.userInfo = $rootScope.userInfo;
    $scope.project = {};

    $("#module_title").html('Foldery i dokumenty 2');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Folders_OS/User_Folder_Blank_32x32.png');
  
    $scope.files = [];
    //$location.search().id
    $(function() {
        $('#detail-form-doc').fileupload({
            dataType: 'json',
            url: '/upload?uid=' + $scope.userInfo.id,
            add: function(e, data) {
                $scope.$apply(function(scope) {
                    // Turn the FileList object into an Array
                    for (var i = 0; i < data.files.length; i++) {
                        $scope.files.push(data.files[i]);
                    }
                    $scope.progressVisible = false;
                    $scope.$broadcast('fileadded',
                                      { files: $scope.files.length });
                    $scope.toUpload = true;
                    $('button#startupload').on('startupload', function(e) {
                        data.submit();
                    });
                });
            },
            done: function(e, data) {
                //
                uploadComplete(e, data);
            },
            fail: function(e, data) {
            },
            progress: function(e, data) {
                console.log(e);
                console.log(data);
            },
            progressall: function(e, data) {
                //
                uploadProgressAll(e, data);
            }
        });
    });
    $scope.$on('fileadded', function(e, parameters) {
        //
    });
    $scope.deleteCurrentAttachment = function(delid) {
        if (delid) {
            Docs.delete({ id: this.file.id });
        }
        $scope.files = $scope.files.filter(
            function(val, i, array) {
                return val !== this.file;
            },
            this);
        $scope.toUpload = $scope.files.some(function(val, i) {
            return !val.loaded;
        });
    };
    $scope.uploadFile = function() {
            $scope.progressVisible = true;
            $scope.percentVisible = true;
            $('button#startupload').trigger('startupload');
    };
        var waitloop, i;
        function nextwait() { // <-> hin und her
            waitloop = $timeout(function() {
                $scope.progress = i % 100 - 20;
                i += 10;
                nextwait();
            }, 500);
        }
    function uploadProgressAll(evt, data) {
        $scope.$apply(function() {
                $scope.progress = Math.round(data.loaded * 100 / data.total);
                if (data.loaded === data.total) {
                    i = 0;
                    $scope.percentVisible = false;
                    nextwait(); // kickoff <-> hin und her
                }
        });
    }
    function uploadComplete(evt, data) {
        /* This event is raised when the server send back a response */
        $scope.$apply(function() {
            $timeout.cancel(uploadProgressAll.waitloop);
            $scope.progressVisible = false;
            $scope.toUpload = false;
            $scope.files = 
                $scope.files.map(function(file, index, array) {
                    var x = data.result.filter(function(f, i) {
                        return f.name == file.name;
                    });
                    if (x.length > 0) {
                        file.url = x[0].url;
                    }
                    if (!file.loaded) {
                        file.loaded = true;
                    }
                    return file;
            });
            //alert(evt.target.responseText);
        });
    }
    function uploadFailed(evt) {
        alert('There was an error attempting to upload the file.');
    }
    function uploadCanceled(evt) {
        $scope.$apply(function() {
            $scope.progressVisible = false;
        });
        alert('The upload has been canceled by the user or the browser ' +
            'dropped the connection.');
    }
}])




/**************************************************************************************************************************** 

userProfileCtrl 

*****************************************************************************************************************************/

.controller('userProfileCtrl',['$scope', '$location', '$log', '$rootScope', 'rpc', 'auth', function($scope, $location, $log, $rootScope, rpc, auth) {
    clearTooltips();    
    $('#application_loader').show();
    $scope.profile = $rootScope.userInfo;
    $scope.profileform = {};
    $scope.profileform = $scope.profile;
    if($scope.profile.hasOwnProperty('born_date')) {
        if($scope.profile.born_date !== undefined && $scope.profile.born_date !== null) {
            $scope.profile.born_date_short = ($scope.profile.born_date).toString().substr(0, 10)
            $scope.profileform.born_date = ($scope.profile.born_date).toString().substr(0, 10)
        }
    }
        
    $("#module_title").html('Twój profil');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Folders_OS/Configure_alt_1_32x32.png');

    $scope.pat_zipcode = /^\d\d-\d\d\d$/;
    $scope.pat_phone = /^\d\d\d\d\d\d\d\d\d$/;

    
    $scope.changeProfile = function() {
        $("#hidden_forms_user_profile").slideDown();
    }

    $scope.cancelChangeProfile = function() {
        $("#hidden_forms_user_profile").slideUp();
    }


    $scope.updateUserInfo = function(profileform) {
        //console.log(profileform);
        var new_user_info = {'first_name':profileform.first_name, 'last_name':profileform.last_name, 'gender':profileform.gender};
        if(profileform.born_date !== null) new_user_info['born_date'] = (profileform.born_date).toString().substr(0, 10);
        if(profileform.city_id !== null) new_user_info['city_id'] = profileform.city.id;
        if(profileform.phone !== null) new_user_info['phone'] = profileform.phone;
        if(profileform.postcode !== null) new_user_info['postcode'] = profileform.postcode;
        //console.log(profileform);
        console.log("Wywoluje updateUserInfo i przekazuje obiekt:");
        console.log(new_user_info);
        var promiseUser = rpc('rpc_ServiceUser.updateUserInfo', new_user_info);
        promiseUser.then(function(ui) {
            console.log("Wywolalem updateUserInfo i dostalem:");
            console.log(ui);
            if(ui.ret == "OK") {
                $rootScope.userInfo = {};
                $scope.profile = {};
                var promiseUserInfo = rpc("rpc_ServiceUser.getUserInfo");
                promiseUserInfo.then(function(uinew) {
                    //console.log(uinew);
                    $rootScope.userInfo = uinew.res;
                    $scope.userInfo = uinew.res;
                    $scope.profile = uinew.res;
                    $scope.profile.born_date = (new_user_info.born_date).toString().substr(0, 10);
                    $scope.profile.postcode = new_user_info.postcode;
                }); 
                if((ui.res).toString() == "true") {
                    $.jnotify("Dane użytkownika zostały zmienione");
                    $("#hidden_forms_user_profile").slideUp();
                }
                else
                    $.jnotify("Wystąpił błąd. Dane użytkownika nie zostały zmienione", "error");
            }
        });
    }

    /*
    passform = {};
    $scope.resetPassword = function(passform) {
        console.log(passform);
        if(passform.new_pass.length < 8) {
            $.jnotify("Podane hasło jest za krótkie. Hasło musi mieć co najmniej 8 znaków.", "error");
        }
        else if(passform.new_pass != passform.new_pass2) {
            $.jnotify("Podane hasła są różne. Proszę wpisać dwa takie same hasła.", "error");
        }
        else {
            var hash = $routeParams.h;
            var email = $scope.userInfo.email;
            var new_pass = passform.new_pass;
            console.log(hash);
            console.log(email);
            console.log(new_pass);
            var promiseNewPass = rpc('rpc_Registration.pswdResetSubmit', hash, email, new_pass);
            promiseNewPass.then(function(resp) {
                console.log("Wywolalem pswdResetSubmit() i dostalem");
                console.log(resp);
                if(resp.ret == "OK") {
                    if(resp.res.toString() == "true") {
                        $.jnotify("Hasło zostało zmienione. Przejdź na stronę główną, żeby się zalogować.");
                    }
                    else
                        $.jnotify("Wystąpił błąd. Nie udało się zmienić hasła.", "error");
                }
                else
                    $.jnotify("Wystąpił błąd. Nie udało się zmienić hasła.", "error");
            });
            
        }
    }*/


    $scope.voivodeships = [];
    $scope.getVoivodeshipList = function() {
        var promiseVoivodeshipList = rpc("rpc_Geo.getListVoivodeships");
        promiseVoivodeshipList.then(function(voivodeships) {
            console.log("Wywolalem getListVoivodeships() i dostalem");
            console.log(voivodeships);
            if(voivodeships.ret == "OK") {
                for(var i=0; i<voivodeships.res.length; i++) {
                    $scope.voivodeships.push(voivodeships.res[i]);
                }
            }
            $scope.profile.voivodeship = {"id":$scope.profile.voiv_id, "name":$scope.profile.voiv_name};
        });
    } 
    $scope.getVoivodeshipList();


    $scope.cities = [];
    $scope.getCities = function(voivodeship) {
        console.log(voivodeship);
        var promiseCitiesList = rpc("rpc_Geo.getListCities", voivodeship);
        promiseCitiesList.then(function(cities) {
            console.log("Wywolalem getListCities() i dostalem");
            console.log(cities);
            $scope.cities = cities.res;
        });
    }


    $scope.delAccount = function() {
        jConfirm("Czy na pewno chcesz BEZPOWROTNIE USUNĄĆ swoje konto z serwisu RodziceNaCzasie.pl?", 'Confirmation Dialog', function(agree) {
        //var agree = confirm("Czy na pewno chcesz BEZPOWROTNIE USUNĄĆ swoje konto z serwisu RodziceNaCzasie.pl?");
          if(agree) {
            var promiseUser = rpc('rpc_ServiceUser.delUser');
            promiseUser.then(function(resp) {
                console.log("Wywolalem delUser i dostalem:");
                console.log(resp);
                if(resp.ret == "OK") {
                    $rootScope.userInfo = {};
                    $scope.profile = {};
                    $.jnotify("Twoje konto zostało usunięte z serwisu.");
                    var promise = auth.logout();
                    promise.then(function() { 
                        $rootScope.authenticated = false;
                        $location.path("/"); 
                    });
                }
                else
                    $.jnotify("Wystąpił błąd. Nie udało się usunąć konta: " + resp.msg, "error");
            });
          }
        });
    }



    setTimeout(function() {
        //$("#f_profile_zipcode").mask("99-999");    
        //$("#f_profile_phone").mask("999999999");    
        
        $scope.profile.city = {"id":$scope.profile.city_id, "name":$scope.profile.city_name};
        $scope.profile.voivodeship = {"id":$scope.profile.voiv_id, "name":$scope.profile.voiv_name};
        $scope.profileform.city = {"id":$scope.profile.city_id, "name":$scope.profile.city_name};
        $scope.profileform.voivodeship = {"id":$scope.profile.voiv_id, "name":$scope.profile.voiv_name};
        
        createMainTooltip(".little_red_star");
        $('#application_loader').hide();
    }, 800);

}])


/* userPrivacyCtrl */

.controller('userPrivacyCtrl',['$scope', '$location', '$log', '$rootScope', 'rpc', 'auth', function($scope, $location, $log, $rootScope, rpc, auth) {
    clearTooltips();    
    $scope.profile = $rootScope.userInfo;

    $("#module_title").html('Prywatność konta');
    $("#module_title_image").attr('src', '/images/Metro_Icons/Other/Power_Lock_32x32.png');

    $scope.checklist = [
        {id: 1, name: 'Chcę pokazać innym użytkownikom mój numer telefonu', checked :true}, 
        {id: 2, name: 'Chcę pokazać innym użytkownikom mój kod pocztowy', checked :true} 
    ];


}])


/* userNotificationsCtrl */

.controller('userNotificationsCtrl',['$scope', '$location', '$log', '$rootScope', 'rpc', 'auth', function($scope, $location, $log, $rootScope, rpc, auth) {
    clearTooltips();    
    $scope.profile = $rootScope.userInfo;

    $("#module_title").html('Twoje powiadomienia');
    $("#module_title_image").attr('src', '/images/Metro_Icons/System_Icons/Info_32x32.png');

    $scope.checklist = [
        {id: 1, name: 'Chcę dostawać powiadomienie 1', checked :true}, 
        {id: 2, name: 'Chcę dostawać powiadomienie 2', checked :true}, 
        {id: 3, name: 'Chcę dostawać powiadomienie 3', checked :true}, 
        {id: 4, name: 'Chcę dostawać powiadomienie 4', checked :true}, 
        {id: 5, name: 'Chcę dostawać powiadomienie 5', checked :true}, 
        {id: 6, name: 'Chcę dostawać powiadomienie 6', checked :true} 
    ];


}])

;

