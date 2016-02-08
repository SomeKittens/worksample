'use strict';

require('../ng')
.component('commonSdkGraph', {
  bindings: {
    sdkName: '=',
    commonSdks: '='
  },
  template: '<div ng-attr-id="commonSdk-{{$ctrl.id}}" class="graph"></div>',
  controller: function ($scope, $timeout, dataParser) {
    this.id = Math.random().toString(36).slice(2);
    let dataPoints = {
      results: []
    };
    let chart;

    dataPoints.results = [{
      type: 'column',
      indexLabelPlacement: 'inside',
      indexLabel: '{label}',
      indexLabelFontColor: 'black',
      indexLabelOrientation: 'vertical',
      indexLabelFontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
      dataPoints: Object.keys(this.commonSdks)
      .sort((a, b) => this.commonSdks[b] - this.commonSdks[a])
      .slice(0, 20)
      .map((key, idx) => {
        return {
          label: dataParser.sdkIdToNameMap[key],
          x: idx,
          y: this.commonSdks[key]
        };
      })
    }];

    // Need to establish chart in timeout so id is dynamically set
    $timeout(() => {
      chart = new CanvasJS.Chart('commonSdk-' + this.id, {
        animationEnabled: true,
        title: {
          text: dataParser.sdkIdToNameMap[this.sdkName],
          fontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif'
        },
        axisX: {
          lineThickness:0,
          tickThickness:0,
          valueFormatString: '',
          labelFontColor: 'white'
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
  }
});