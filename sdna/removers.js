'use strict';

require('./ng')
.controller('RemoverCtrl', function (sdata, dataParser) {
  let RC = this;

  RC.vendors = sdata[0].records.vendor;
  RC.idToName = dataParser.sdkIdToNameMap;

  RC.pickVendor = (v) => {
    RC.removed = dataParser.getRemovers(v);
    RC.selected = v;
    RC.type = 'vendor';
  };

  RC.pickVendor(RC.vendors[0]);
});
