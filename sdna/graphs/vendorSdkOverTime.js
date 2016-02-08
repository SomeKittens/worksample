'use strict';

require('../ng')
.component('vendorSdkOverTime', {
  bindings: {
    vendor: '='
  },
  template: '<div ng-attr-id="vendorSdkOverTime-{{$ctrl.id}}" class="graph"></div>',
  controller: function ($scope, $timeout, dataParser) {
    this.id = Math.random().toString(36).slice(2);
    let dataPoints = {
      results: []
    };
    let chart;

    // Need to establish chart in timeout so id is dynamically set
    $timeout(() => {
      chart = new CanvasJS.Chart('vendorSdkOverTime-' + this.id, {
        animationEnabled: true,
        title: {
          fontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
          text: 'SDK rankings over time (Vendor)'
        },
        data: dataPoints.results,
        legend: {
          cursor: 'pointer',
          itemclick: function (e) {
            if (typeof(e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            chart.render();
          }
        }
      });
      chart.render();
    });

    $scope.$watch('$ctrl.vendor', (n, o) => {
      if (!n) { return; }

      let sdks = dataParser.getVendorData(n);

      /// hAAAAAAX
      dataPoints.results.length = 0;
      Object.keys(sdks).forEach(key => dataPoints.results.push(sdks[key]));

      if (chart) {
        chart.render();
      }
    });
  }
});