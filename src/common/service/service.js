if (!window.DYC) {
    window.DYC = angular.module('COM', []);
}
DYC.factory('service', function() {
    var factory = {
        expand: function(attr, fn) {
            this[attr] = fn();
        }
    };
    return factory;
});