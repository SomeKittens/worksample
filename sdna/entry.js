'use strict';

require('../common/entry');
require('./sdna.scss');

require('../lib/canvasjs.min.js');

require('./dataParser');

require('./adoption');
require('./removers');
require('./features');

require('./graphs/sdkOverTime');
require('./graphs/vendorOverTime');
require('./graphs/vendorSdkOverTime');
require('./graphs/commonSdk');