'use strict';

let angular = require('angular');
require('angular-ui-router');

let sdna = angular.module('sdna', ['ws-common', 'ui.router', 'ui.bootstrap'])
.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      // All states inherit from app, so init MUST run
      // Bit of a hack to make up for the fact that we can't load sdata sync anymore
      .state('app', {
        abstract: true,
        template: '<div ui-view></div>',
        resolve: {
          init: (dataFetcher) => dataFetcher()
        }
      })
      // • How is my product's adoption rate compared to my competitors'?
      .state('app.adoption', {
        url: '/adoption',
        template: require('./adoption.jade')(),
        controller: 'AdoptionCtrl',
        controllerAs: 'AC'
      })
      // • Which apps have removed my product?
      .state('app.removers', {
        url: '/removers',
        template: require('./removers.jade')(),
        controller: 'RemoverCtrl',
        controllerAs: 'RC'
      })
      // • What sort of features should be our next priority for development in my product?
      .state('app.features', {
        url: '/features',
        template: require('./features.jade')(),
        controller: 'FeatureCtrl',
        controllerAs: 'FC'
      });
    $urlRouterProvider.otherwise('/adoption');
}])
.constant('name', 'sdna')
.factory('sdata', function () { return []; })
.factory('dataFetcher', function ($http, $q, sdata, loader) {
  let filenames = ['data_20151021', 'data_20151222', 'data_20160120'];

  return () => {
    return $q.all(
      filenames.map(filename => $http.get(`data/${filename}.json`)
      .then(resp => resp.data))
    )
    .then(data => {
      data.forEach(datum => sdata.push(datum));
      loader.isLoading = false;
      console.log(data);
    })
    .catch(err => {
      // Can't use template strings here because that messes with white-space: pre
      loader.message = 'Hello Nate and/or nosy Netflixers!\n' +
                       'I couldn\'t find the source data.\n' +
                       'Did you remember to unzip it to sdna/data?';
    });
  }
});

module.exports = sdna;