'use strict';

require('./users.scss');

require('../ng')
.component('searchDisplay', {
  controller: function ($scope, ghSearch) {
    this.ghData = ghSearch.current;

    let runSearch = () => {
      let query = this.currentSearch;
      ghSearch.clearData();
      if (query === undefined) { return; }
      if (query === '') {
        this.results = [];
        return;
      }
      this.searching = true;
      ghSearch.searchUsers(query, this.type)
      .then(results => {
        this.results = results;
        if (results.length === 1) {
          this.selectUser(results[0]);
        }
      })
      .finally(() => this.searching = false);
    };

    $scope.$watch('$ctrl.currentSearch', runSearch);
    $scope.$watch('$ctrl.type', runSearch);

    this.selectUser = (user) => {
      ghSearch.selectUser(user);
    };
  },
  template: require('./users.jade')()
});
