angular.module('mychat.controllers', [])

  .controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
    console.log('Login Controller Initialized firebaseUrl:', firebaseUrl);

    var ref = new Firebase(firebaseUrl);
    var auth = $firebaseAuth(ref);

    $ionicModal.fromTemplateUrl('templates/signup.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.createUser = function (user) {
      console.log("Create User Function called");
      if (user && user.name) {
        $ionicLoading.show({
          template: 'Signing Up...'
        });

        auth.$authAnonymously()
          .then(function (userData) {
            alert("User created successfully!");
            ref.child("users").child(userData.uid).set({
              name: user.email
            });
            $ionicLoading.hide();
            $scope.modal.hide();
          }).catch(function (error) {
            alert("Error: " + error);
            $ionicLoading.hide();
          });
      } else
        alert("Please fill all details");
    };

    $scope.signIn = function (user) {

      if (user && user.displayName) {
        $ionicLoading.show({
          template: 'Signing In...'
        });
        auth.$authAnonymously({
          displayName: user.displayName
        }).then(function (authData) {
          console.log("Logged in as:" + authData.uid);
          ref.child("users").child(authData.uid).set({
            displayName: user.displayName
          });
          $rootScope.displayName = user.displayName;
          $ionicLoading.hide();
          $state.go('tab.rooms');
        }).catch(function (error) {
          alert("Authentication failed:" + error.message);
          $ionicLoading.hide();
        });
      } else
        alert("유저네임이 어떻게 되시죠?");
    }
  })

  .controller('ChatCtrl', function ($scope, Chats, $state) {
    console.log("Chat Controller initialized");

    $scope.IM = {
      textMessage: ""
    };

    Chats.selectRoom($state.params.roomId);

    var roomName = Chats.getSelectedRoomName();

    // Fetching Chat Records only if a Room is Selected
    if (roomName) {
      $scope.roomName = " - " + roomName;
      $scope.chats = Chats.all();
    }

    $scope.sendMessage = function (msg) {
      console.log($scope.displayName, msg);
      Chats.send($scope.displayName, msg);
      $scope.IM.textMessage = "";
    }

    $scope.remove = function (chat) {
      Chats.remove(chat);
    }
  })

  .controller('RoomsCtrl', function ($scope, Rooms, Chats, $state) {
    //console.log("Rooms Controller initialized");
    $scope.rooms = Rooms.all();

    $scope.openChatRoom = function (roomId) {
      $state.go('tab.chat', {
        roomId: roomId
      });
    }
  });