app.controller('MainCtrl', [
  '$scope', '$timeout', '$q', 'Company', 
  function ($scope, $timeout, $q, Company) {

    $scope.gridOptions = {
      //infiniteScrollRowsFromEnd: 20,
      infiniteScrollUp: true,
      infiniteScrollDown: true,
      columnDefs: [
        {name: 'id'},
        {name: 'Name'},
        {name: 'AddedAt'}
      ],
      data: 'data',
      onRegisterApi: function(gridApi){
        gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);
        gridApi.infiniteScroll.on.needLoadMoreDataTop($scope, $scope.getDataUp);
        $scope.gridApi = gridApi;
      }
    };

    $scope.data = [];

    $scope.firstPage = 1; // Starts from 1
    $scope.lastPage = 1;

    $scope.pageSize = 100;
    $scope.maxLoadedPages = 5;
    $scope.totalPages = 1;


    $scope.getFirstData = function() {
      var promise = $q.defer();

      Company
        .find({
          filter: {
            "offset": ($scope.firstPage - 1) * $scope.pageSize,
            "limit": ($scope.lastPage - $scope.firstPage + 1) * $scope.pageSize
          }
        })
        .$promise
        .then(function(results) {
          $scope.data = $scope.data.concat(results);
        })
        .then(function() {
          Company
            .count()
            .$promise
            .then(function(results) {
              $scope.totalPages = Math.ceil(results.count / $scope.pageSize);
              promise.resolve();
            });
        });

      return promise.promise;
    };

    $scope.getDataDown = function() {
      var promise = $q.defer();

      Company
        .find({
          filter: {
            "offset": ($scope.lastPage + 1) * $scope.pageSize,
            "limit": $scope.pageSize
          }
        })
        .$promise
        .then(function(results) {
          $scope.lastPage++;
          $scope.gridApi.infiniteScroll.saveScrollPercentage();
          $scope.data = $scope.data.concat(results);

          $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 1, $scope.lastPage < $scope.totalPages)
            .then(function() {
              $scope.checkDataLength('up');
            })
            .then(function() {
              promise.resolve();
            });
        });

      return promise.promise;
    };

    $scope.getDataUp = function() {
      var promise = $q.defer();

      Company
        .find({
          filter: {
            "offset": ($scope.firstPage - 2) * $scope.pageSize,
            "limit": $scope.pageSize
          }
        })
        .$promise
        .then(function(results) {
          $scope.firstPage--;
          $scope.gridApi.infiniteScroll.saveScrollPercentage();
          $scope.data = results.concat($scope.data);

          $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 1, $scope.lastPage < $scope.totalPages)
            .then(function() {
              $scope.checkDataLength('down');
            })
            .then(function() {
              promise.resolve();
            });
        });
      
      return promise.promise;
    };


    $scope.getPage = function(data, page) {
      var res = [];
      for (var i = (page * $scope.pageSize); i < (page + 1) * $scope.pageSize && i < data.length; ++i) {
        res.push(data[i]);
      }
      return res;
    };

    $scope.checkDataLength = function(discardDirection) {
      // work out whether we need to discard a page, if so discard from the direction passed in
      if ($scope.lastPage - $scope.firstPage > $scope.maxLoadedPages - 1) {
        // we want to remove a page
        $scope.gridApi.infiniteScroll.saveScrollPercentage();

        if (discardDirection === 'up') {
          $scope.data = $scope.data.slice($scope.pageSize);
          $scope.firstPage++;
          $timeout(function() {
            // wait for grid to ingest data changes
            $scope.gridApi.infiniteScroll.dataRemovedTop($scope.firstPage > 1, $scope.lastPage < $scope.totalPages);
          });
        } else {
          $scope.data = $scope.data.slice(0, $scope.pageSize * ($scope.lastPage - 1));
          $scope.lastPage--;
          $timeout(function() {
            // wait for grid to ingest data changes
            $scope.gridApi.infiniteScroll.dataRemovedBottom($scope.firstPage > 1, $scope.lastPage < $scope.totalPages);
          });
        }
      }
    };

    $scope.reset = function() {
      $scope.firstPage = 1;
      $scope.lastPage = 1;

      // turn off the infinite scroll handling up and down - hopefully this won't be needed after @swalters scrolling changes
      $scope.gridApi.infiniteScroll.setScrollDirections(false, false);
      $scope.data = [];

      $scope.getFirstData().then(function() {
        $timeout(function() {
          // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
          $scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 1, $scope.lastPage < $scope.totalPages);
        });
      });
    };

    $scope.getFirstData().then(function(){
      $timeout(function() {
        // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
        // you need to call resetData once you've loaded your data if you want to enable scroll up,
        // it adjusts the scroll position down one pixel so that we can generate scroll up events
        $scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 1, $scope.lastPage < $scope.totalPages);
      });
    });

  }
]);
