'use strict';

require('./ng')
.factory('dataParser', function (sdata) {
  let sdkIdToNameMap = {};
  let dates = [];
  let appIdMap = {};
  sdata.forEach(sdatum => {
    dates.push(sdatum.reportDate);
    sdatum.records.sdk.forEach(sdk => sdkIdToNameMap[sdk.id] = sdk.name);
    sdatum.records.app.forEach(app => appIdMap[app.id] = app);
  });


  let getFilteredDataBy = (filterFn, key) => {
    if (!key) { key = 'name'; }
    // Desired Result
    /**
     * [{
     *   type: 'line',
     *   label: 'app-name',
     *   dataPoints: [{x/y}, {x/y}]
     * }, ...]
     */

    let sdks = {};
    let idNameMap = {};

    // O(scary);
    let results = sdata.map((sdatum, idx) => {
      let records = sdatum.records;
      let inVertical = records.sdk
        .filter(filterFn)
        .map(sdk => {
          idNameMap[sdk.id] = sdk[key];
          return sdk.id;
        });

      return records.app.reduce((prev, app) => {
        app.sdks.forEach(sdk => {
          if (inVertical.indexOf(sdk) !== -1) {
            if (!prev[idNameMap[sdk]]) {
              prev[idNameMap[sdk]] = 0;
            }
            prev[idNameMap[sdk]]++;
          }
        });
        return prev;
      }, {});
    });

    // Now we have count of all sdk uses by sample
    results.forEach((result, idx) => {
      Object.keys(result).forEach(key => {
        if (!sdks[key]) {
          sdks[key] = {
            type: 'spline',
            fontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
            showInLegend: true,
            label: key,
            legendText: key,
            dataPoints: []
          };
        }
        sdks[key].dataPoints.push({
          label: dates[idx],
          x: idx,
          y: result[key]
        });
      });
    });
    return sdks;
  };

  let vendorCache = {};
  let getVendorSdks = vendor => {
    if (vendorCache[vendor.name]){ return vendorCache[vendor.name]; }
    let vendorSDKs = sdata.reduce((prev, sdatum) => {
      sdatum.records.sdk.forEach(sdk => {
        if (sdk.vendor === vendor.name && prev.indexOf(sdk.name) === -1) {
          prev.push(sdk);
        }
      });
      return prev;
    }, []);

    vendorCache[vendor.name] = vendorSDKs;
    return vendorSDKs;
  };

  let getVendorData = (vendor) => {
    let vendorSdks = getVendorSdks(vendor).map(sdk => sdk.name);
    return getFilteredDataBy(sdk => vendorSdks.indexOf(sdk.name) !== -1);
  };

  let getRemovers = (vendor) => {
    // On selection:
    // - Need to get all SDKs of that vendor
    // - Get all apps that removed one or more of those SDKs
    let vendorSdks = getVendorSdks(vendor).map(sdk => sdk.id);

    let dropped = {};

    // O(n^lots) isn't so bad...
    vendorSdks.forEach(vSDK => {
      let hadSDK = [];
      dropped[vSDK] = [];
      sdata.forEach((sdatum, idx) => {
        let currentIterationHaveSDK = sdatum.records.app
        .filter(app => app.sdks.indexOf(vSDK) !== -1)
        .map(app => app.id);
        if (!idx) {
          hadSDK = currentIterationHaveSDK;
          return;
        }

        hadSDK
        // Get droppers
        .filter(app => currentIterationHaveSDK.indexOf(app) === -1)
        .forEach(droppedApp => {
          if (dropped[vSDK].indexOf(droppedApp) === -1) {
            dropped[vSDK].push(appIdMap[droppedApp]);
          }
        });

        hadSDK = currentIterationHaveSDK;
      });

      // TODO: get more details using following
      // vendorSdks.forEach(vSDK => {
      //   let hadSDK = [];
      //   sdata.forEach((sdatum, idx) => {
      //     let currentIterationHaveSDK = sdatum.records.app.filter(app =>
      //       app.sdks.filter(sdk => vendorSdks.indexOf(sdk))
      //     ).map(app => app.name);

      //     if (!idx) {
      //       hadSDK = currentIterationHaveSDK;
      //       return;
      //     }

      //     let currentIterationDropped = hadSDK.filter(sdk => currentIterationHaveSDK.indexOf(sdk) === -1);

      //     dropped = dropped.concat(currentIterationDropped);
      //   });
    });

    return dropped;
  };

  let getCommonSDKs = (vendor) => {
    let vendorSdks = getVendorSdks(vendor).map(sdk => sdk.id);
    let common = {};

    vendorSdks.forEach(vSDK => {
      common[vSDK] = {};
      let hadSDK = [];
      sdata.forEach((sdatum, idx) => {
        let currentIterationHaveSDK = sdatum.records.app
        .filter(app => app.sdks.indexOf(vSDK) !== -1)
        .map(app => app.sdks)
        .forEach(appSDKs => {
          appSDKs.forEach(aSDK => {
            if (vendorSdks.indexOf(aSDK) > -1) { return; }
            if (!common[vSDK][aSDK]) {
              common[vSDK][aSDK] = 0;
            }
            common[vSDK][aSDK]++;
          });
        });
      });
    });

    return common;
  };
  return {
    getFilteredDataBy: getFilteredDataBy,
    getVendorData: getVendorData,
    getRemovers: getRemovers,
    getCommonSDKs: getCommonSDKs,
    sdkIdToNameMap: sdkIdToNameMap,
    appIdMap: appIdMap
  };
});