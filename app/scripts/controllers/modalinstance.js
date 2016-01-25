'use strict';

/**
 * @ngdoc function
 * @name planckApp.controller:ModalinstanceCtrl
 * @description
 * # ModalinstanceCtrl
 * Controller of the planckApp
 */
angular.module('planckApp')
  .controller('ModalinstanceCtrl', function($scope, $uibModalInstance, data) {

    $scope.months = [];
    $scope.data = data;

    // create an object to represent a calendar year
    var i = 0;
    for (i = 0; i < 12; i += 1) {
      $scope.months[i] = new Array(new Date(1970, i + 1, 0).getDate());
    }

    // populate the existing events into the calendar object
    angular.forEach($scope.data, function(d, i) {
      if (d.gsx$datetime.$t.length && (d.gsx$bya.$t.length || d.gsx$mya.$t.length || d.gsx$kya.$t.length)) {
        var date = Date.parse(d.gsx$datetime.$t),
          month = date.getMonth(),
          day = date.getDate();

        $scope.months[month][day - 1] = {
          'class': 'has-event',
          'id': 'e-' + i
        };
      }
    });

    // called on event selection
    $scope.ok = function($event) {
      $uibModalInstance.close({
        target: $event.target.id
      });
    };

    // generates an array of length i, for the days of the month ng-repeat directive
    $scope.enumerator = function(i) {
      return new Array(i);
    };

    // return the month name as a string
    $scope.getMonthName = function(s) {
      return new Date(1970, s, 0).toString('MMMM');
    };

    // set the li id to the nth day of the year
    $scope.setId = function(d, m) {
      var date = new Date(1970, m, d + 1),
        start = new Date(date.getFullYear(), 0, 0),
        diff = date - start,
        day = Math.floor(diff / (1000 * 60 * 60 * 24));
      return 'd-' + day;
    };
  });
