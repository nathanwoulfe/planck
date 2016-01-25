'use strict';

/**
 * @ngdoc function
 * @name planckApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the planckApp
 */
angular.module('planckApp')
  .controller('MainCtrl', function($scope, $document, Data, $uibModal) {
    $scope.currentIndex = 1;
    $scope.scrollDate = 'January 1 12:00:00';
    $scope.scrolling = false;
    $scope.animationDuration = 0;
    $scope.animationIterationCount = 0;
  
    var minutes = 1000 * 60,
      hours = minutes * 60,
      days = hours * 24,
      dayPx = 1e4,
      eleven50 = new Date(1970, 0, 365, 23, 50).getTime();          

    (function() {
      Data.get(4)
        .then(function(resp) {
          $scope.data = resp.data.feed.entry;

          angular.forEach($scope.data, function(d, i) {

            // one day = 10000 pixels
            // find the distance between consecutive events and multiply by 10k
            var thisDate = Date.parse(d.gsx$datetime.$t),
              prevDate = Date.parse($scope.data[i - 1 >= 0 ? i - 1 : 0].gsx$datetime.$t),
              h = Math.ceil(((thisDate - prevDate) / days) * dayPx);

            // any events in the final 10 minutes of the year are re-scaled
            if (Date.compare(thisDate, Date.parse('December 31 1970 23:50:00')) === 1) {
              h = Math.ceil((thisDate - prevDate) / 4);
            }

            // some events have an explicit height set
            if (d.gsx$height.$t.length > 0) {
              h = parseInt(d.gsx$height.$t, 10);
            }

            // after all that, if there is no height for the element, default to 200px
            d.height = h > 0 ? h + 'px' : '200px';
          });
        });
    }());

    // date formatting for event labels
    // returns midnight as a string rather than a time
    $scope.date = function(s) {
      var d = Date.parse(s).toString('h:mm:ss');
      return d !== '12:00:00' ? Date.parse(s).toString('MMMM d, h:mm:sstt') : Date.parse(s).toString('MMMM d') + ', Midnight';
    };

    // was it billion or million or thousands of years ago?
    // checks for values in the data set
    $scope.yearsAgo = function(e) {
      return e.gsx$bya.$t.length ? e.gsx$bya.$t + ' billion' : e.gsx$mya.$t.length ? e.gsx$mya.$t + ' million' : e.gsx$kya.$t;
    };

    // clicking prev/next buttons
    // also called from the modal callback
    $scope.move = function(i, id) {

      var elem,
        d = 0,
        scrollTime = 0;
      
      // id will be undefined on next/prev click - only has a value from the modal callback
      if (id === undefined) {
        // increment/decrement the current index, if the value is valid
        $scope.currentIndex = $scope.currentIndex + i <= 365 && $scope.currentIndex + i > 0 ? $scope.currentIndex + i : $scope.currentIndex;
      } else {
        $scope.currentIndex = parseInt(id.replace('d-', ''), 10);
      }      

      d = ($scope.currentIndex - 1) * dayPx;
      scrollTime = Math.abs($document.duScrollTop() - d) / 10;      
      
      // scroll to the element, adjusting speed and offset based on the caller
      $document.duScrollTop(d, scrollTime, function(x) {
        return x;
      }).then(function() {
        // scroll complete - hide the scroll indicator
      });
    };

    function getProgress() {
      var s = Math.floor(window.scrollY / dayPx),
        d = new Date(1970, 0, 1).addDays(s > 364 ? 364 : s),
        r = Math.floor(window.scrollY / (dayPx / 360)),
        milliseconds = 0,
        finalTen = 3649930, 
          time;

      r = r > 360 ? r - 360 : r;

      // need to add 2 hours...
      milliseconds = Math.round((r / 15) * 60 * 60 * 1000 + (2 * 1000 * 60 * 60));
      
      if (window.scrollY >= finalTen) {        
        var scroll = Math.floor(window.scrollY - finalTen);
        // scroll / 500 = total seconds.
        // * 1000 = milliseconds
       
        milliseconds = (scroll / 250) * 1000;
        time = new Date(1970, 0, 1, 23, 50, 0, milliseconds).toString('h:mm');
        r = 359;
      }
      else {
        time = new Date(milliseconds).toString('h:mm');
      }
      
      $scope.dayNightRotation = 'rotate(' + r + 'deg)';            

      $scope.$apply(function() {
        $scope.scrollDate = d.toString('MMMM d ') + time;
      });
    }

    angular.element(window).on('scroll', getProgress);

    // modal
    $scope.open = function(data) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modal.html',
        controller: 'ModalinstanceCtrl',
        resolve: {
          data: function() {
            return data;
          }
        }
      });

      // handle the selectedItem object and call the move function
      modalInstance.result.then(function(selectedItem) {
        $scope.move(0, selectedItem.target);
      }, function() {});
    };
  });