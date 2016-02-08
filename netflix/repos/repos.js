'use strict';

require('./repos.scss');

require('../ng')
.component('repoSelector', {
  controller: function (ghSearch) {
    this.ghData = ghSearch.current;
    this.sortBy = '-stargazers_count';
    this.getHumanSort = () => {
      if (this.sortBy === '-forks_count') {
        return '# Forks';
      } else if (this.sortBy === 'name') {
        return 'A -> Z';
      } else if (this.sortBy === '-open_issues') {
        return 'Open Issues';
      } else if (this.sortBy === '-stargazers_count') {
        return 'Stars';
      } else if (this.sortBy === '-watchers') {
        return 'Watchers';
      } else {
        return 'Z -> A';
      }
    }

    this.selectRepo = ghSearch.selectRepo;
  },
  template: require('./repos.jade')()
});