/* globals lodash */
if (!window.DY) {
    window.DY = angular.module('RCP', ['COM']);
}
window.DY.controller('testCtrl', function($scope, service) {
    let a = 'hello world';
    $scope.hi = a || 'hello world';
});