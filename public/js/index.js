/**
 * Created by Eless on 25.05.2015.
 */
var app = angular.module('app', []);
app.controller('tournamentListCtrl', function ($scope, $filter, $http) {
    $http.get('tournaments/tournaments.json').success(function(data) {
        if(data && data.tournaments){
            data.tournaments.forEach(function(tournament, i){
                tournament.index = i+1;
                tournament.addCurrentUser = function(id){
                    io.emit('addToTournament', [tournament.tournament_id, id])
                }
            })
        }
        $scope.rowCollection = data.tournaments || [];
        $scope.itemsByPage=20;


    });
    io.on('currentUsersInTournament', function (tournament){
        $scope.rowCollection.some(function(row, i){
            if(row.id == tournament.tournament_id){
                row.uCount = tournament.count;
                var node ='add-column-'+tournament.tournament_id;
                var success = '<span class="label label-success">Success</span>';
                $(success).appendTo(node);
                alert('registered: ' + $scope.rowCollection[i].uCount);
                return true;
            }
        });
    })
} );
app.controller('tournamentDataCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.init = function(id)
    {
        $scope.id = id;
        $scope.itemsByPage=20;
        $http.get($scope.id + '/stats.json').success(function(data) {
            $scope.playersInTournament = [];
            $scope.tableHeaders = [];
            if(data && data.length > 0){
                for(var col in data[0]) {
                    if (data[0].hasOwnProperty(col) && col != 'account_id')
                        $scope.tableHeaders.push(col);
                }
                $scope.playersInTournament = data || {};
            }
        });
    };

} ]);