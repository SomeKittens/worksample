'use strict';

require('./ng')
.controller('FeatureCtrl', function (sdata, dataParser) {
  let FC = this;

  FC.vendors = sdata[0].records.vendor;

  FC.pickVendor = (v) => {
    FC.common = dataParser.getCommonSDKs(v);
    console.log(FC.common);
    FC.selected = v;
  };

  FC.pickVendor(FC.vendors[0]);
});
