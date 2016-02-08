'use strict';

require('../ng')
.component('sdkOverTime', {
  bindings: {
    vertical: '='
  },
  template: '<div ng-attr-id="sdkOverTime-{{$ctrl.id}}" class="graph"></div>',
  controller: function ($scope, $timeout, dataParser) {
    this.id = Math.random().toString(36).slice(2);
    let dataPoints = {
      results: []
    };
    let chart;

    // Need to establish chart in timeout so id is dynamically set
    $timeout(() => {
      chart = new CanvasJS.Chart('sdkOverTime-' + this.id, {
        animationEnabled: true,
        title: {
          fontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
          text: 'SDK rankings over time'
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

    $scope.$watch('$ctrl.vertical', (n, o) => {
      if (!n) { return; }

      let results = dataParser.getFilteredDataBy(sdk => sdk.category === n.id, 'name');
      /// hAAAAAAX
      dataPoints.results.length = 0;
      Object.keys(results).forEach(key => dataPoints.results.push(results[key]));
      if (chart) {
        chart.render();
      }
    });
  }
});