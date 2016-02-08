'use strict';

require('./users.scss');

require('../ng')
.component('searchDisplay', {
  controller: function ($scope, ghSearch) {
    this.ghData = ghSearch.current;

    $scope.$watch('$ctrl.currentSearch', (n, o) => {
      if (n) {
        this.searching = true;
        ghSearch.searchUsers(n, this.type)
        .then(results => {
          this.results = results;
          if (results.length === 1) {
            this.selectUser(results[0]);
          }
        })
        .finally(() => this.searching = false);
      }
    });

    this.selectUser = (user) => {
      ghSearch.selectUser(user);
    };
  },
  template: require('./users.jade')()
});
