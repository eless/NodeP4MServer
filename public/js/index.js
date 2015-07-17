/**
 * Created by Eless on 25.05.2015.
 */
angular.module('app', [])
    .controller('paginationCtrl', function ($scope, $filter, $http) {
        $http.get('tournaments/tournaments.json').success(function(data) {
            if(data && data.tournaments){
                data.tournaments.forEach(function(tournament, i){
                    tournament.index = i+1;
                    tournament.addCurrentUser = function(id){
                        io.emit('addToTournament', [tournament.id, id])
                    }
                })
            }
            $scope.rowCollection = data.tournaments || [];
            $scope.itemsByPage=20;


        });
        io.on('currentUsersInTournament', function (tournament){
            $scope.rowCollection.some(function(row, i){
                if(row.id == tournament.id){
                    row.uCount = tournament.count;
                    alert('registered: ' + $scope.rowCollection[i].uCount);
                    return true;
                }
            });
        })
    } );
angular.module('appStats', [])
    .controller('paginationStatsCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        $scope.itemsByPage=20;
        $http.get('/tournament/stats/'+ $routeParams.id + '/stats.json').success(function(data) {
            $scope.rowCollection = {};
            if(data && data.length > 0){
                $scope.rowCollection = data[0] || {};
            }
        });
    } ]);