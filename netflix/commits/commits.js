'use strict';

require('./commits.scss');

require('../ng')
.component('commitSelector', {
  controller: function (ghSearch) {
    this.ghData = ghSearch.current;

    this.selectCommit = ghSearch.selectCommit;
  },
  template: require('./commits.jade')()
});