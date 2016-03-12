angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});


})

.controller('ChatsCtrl', function ($scope, Chats, $ionicLoading) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $ionicLoading.show({
        template: 'loading'
    });

    Chats.load(function () {
        
        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };

        $scope.search = function () {
            $scope.chats = Chats.search($scope.query);
        }

        $ionicLoading.hide();
    });
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function ($scope, Chats, $ionicLoading) {
    $scope.refresh = function () {

        $ionicLoading.show({
            template: 'loading'
        });

        Chats.refresh(function () {
            $ionicLoading.hide();
        });
    }
})
;
