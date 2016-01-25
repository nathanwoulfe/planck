'use strict';

/**
 * @ngdoc service
 * @name planckApp.Data
 * @description
 * # Data
 * Factory in the planckApp.
 */
angular.module('planckApp')
  .factory('Data', function ($http) {
    // Service logic
    // ...

    var key = '1nlXzHEdrWpEusaZgPdgrND5e58DU6fWEAP0T_M0NnhQ';

    // Public API here
    return {
      get: function (i) {
        return $http.get('https://spreadsheets.google.com/feeds/list/' + key + '/' + i + '/public/values?alt=json');
      }
    };
  });
