'use strict';

require('./viewer.scss');

require('../ng')
.component('commitViewer', {
  controller: function (ghSearch) {
    this.ghData = ghSearch.current;
  },
  template: require('./viewer.jade')()
});