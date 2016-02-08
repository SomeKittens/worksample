'use strict';

let angular = require('angular');
require('angular-ui-router');

let netflix = angular.module('netflix', ['ws-common', 'ui.bootstrap'])
.constant('name', 'netflix')
.constant('ghkey', '39b4843cdd18f099cbc4a321d478b2cff94252f3')
.run((loader) => loader.isLoading = false);

module.exports = netflix;