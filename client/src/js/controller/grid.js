app.controller('GridController', [
  '$scope', '$timeout', '$q', 'entity', 'columnDefs',
  function GridController($scope, $timeout, $q, entity, columnDefs) {

    $scope.getFilter = function(grid) {
      var filter = [];
      var i, j;
      for (i = 0; i < grid.columns.length; i++) {
        for (j = 0; j < grid.columns[i].filters.length; j++) {
          if ('term' in grid.columns[i].filters[j]) {
            if (grid.columns[i].filters[j].term) {
              var elem = {};
              elem[grid.columns[i].field] = grid.columns[i].filters[j].term;
              //elem[grid.columns[i].field] = {like: '%' + grid.columns[i].filters[j].term + '%'};
              filter.push(elem);
            }
          }
        }
      }
      if (filter.length === 0) {
        return null;
      }
      return {and: filter};
    };

    $scope.getSorting = function(grid) {
      var sorting = [];
      var sortColumns = grid.getColumnSorting();
      if (sortColumns.length > 0) {
        for (var i = 0; i< sortColumns.length; i++) {
          sorting.push(sortColumns[i].field + ' ' + sortColumns[i].sort.direction);
        }
      }
      if (sorting.length === 0) {
        return null;
      }
      return sorting;
    };

    $scope.render = function(grid) {
      $scope.filter = $scope.getFilter(grid);
      $scope.sorting = $scope.getSorting(grid);
      $scope.firstPage = 1;
      $scope.lastPage = 1;
      $scope.data = [];
      $scope.getFirstData();
    };

    $scope.gridOptions = {
      //infiniteScrollRowsFromEnd: 20,
      infiniteScrollUp: true,
      infiniteScrollDown: true,
      enableFiltering: true,
      useExternalFiltering: true,
      useExternalSorting: true,
      columnDefs: columnDefs,
      data: 'data',

      onRegisterApi: function(gridApi){
        gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);
        gridApi.infiniteScroll.on.needLoadMoreDataTop($scope, $scope.getDataUp);
        $scope.gridApi = gridApi;

        $scope.gridApi.core.on.sortChanged($scope, function() {
          $scope.render(this.grid);
        });

        $scope.gridApi.core.on.filterChanged($scope, function() {
          $scope.render(this.grid);
        });
      }
    };

    $scope.data = [];

    $scope.firstPage = 1; // Starts from 1
    $scope.lastPage = 1;
    $scope.filter = null;
    $scope.sorting = null;

    $scope.pageSize = 100;
    $scope.maxLoadedPages = 5;
    $scope.totalPages = 1;


    $scope.getFirstData = function() {
      var promise = $q.defer();

      entity
        .find({
          filter: {
            offset: ($scope.firstPage - 1) * $scope.pageSize,
            limit: ($scope.lastPage - $scope.firstPage + 1) * $scope.pageSize,
            where: $scope.filter,
            order: $scope.sorting
          }
        })
        .$promise
        .then(function(results) {
          $scope.data = $scope.data.concat(results);
        })
        .then(function() {
          entity
            .count()
            .$promise
            .then(function(results) {
              $scope.totalPages = Math.ceil(results.count / $scope.pageSize);
              promise.resolve();
            });
        })
        .then(function() {
          $timeout(function() {
          // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
          $scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 1, $scope.lastPage < $scope.totalPages);
        });
      });;

      return promise.promise;
    };

    $scope.getDataDown = function() {
      var promise = $q.defer();

      entity
        .find({
          filter: {
            offset: ($scope.lastPage + 1) * $scope.pageSize,
            limit: $scope.pageSize,
            where: $scope.filter,
            order: $scope.sorting
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

      entity
        .find({
          filter: {
            offset: ($scope.firstPage - 2) * $scope.pageSize,
            limit: $scope.pageSize,
            where: $scope.filter,
            order: $scope.sorting
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
      $scope.filter = null;
      $scope.sorting = null;

      // turn off the infinite scroll handling up and down - hopefully this won't be needed after @swalters scrolling changes
      $scope.gridApi.infiniteScroll.setScrollDirections(false, false);
      $scope.data = [];

      $scope.getFirstData();
    };

    $scope.getFirstData();
  }
]);