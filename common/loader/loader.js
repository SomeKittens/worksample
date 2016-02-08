'use strict';

require('../ng')
.factory('loader', [() => {
  let isLoading = true;

  return {
    isLoading: isLoading,
    message: 'Loading...'
  };
}])
.directive('loadingScreen', ['loader', (loader) => {
  return {
    restrict: 'A',
    link: ($scope, el) => {
      $scope.$watch(() => loader.isLoading, (n, o) => {
        if (!n) {
          el.addClass('hidden');
        } else {
          el.removeClass('hidden');
        }
      });

      $scope.load = loader;
    }
  }
}])

// separate directive for sub loaders
.component('loadingHeartbeat', {
  bindings: {
    show: '='
  },
  controller: function (name) {
    this.name = name;
  },
  template: require('./heartbeat.jade')()
});