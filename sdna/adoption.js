'use strict';

require('./ng')
.controller('AdoptionCtrl', function (sdata) {
  let AC = this;

  AC.verticals = sdata[0].records.category;

  AC.vendors = sdata[0].records.vendor;


  AC.pickVertical = (v) => {
    AC.selected = v;
    AC.type = 'vertical';
  };

  AC.pickVendor = (v) => {
    AC.selected = v;
    AC.type = 'vendor';
  };

  AC.pickVertical(AC.verticals[0]);
});