var app = angular.module('filmserial', []);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');

app.controller('statsCtrl', function($scope){
  $scope.cPercent = 50;
  $scope.dPercent = 50;

  var updateScores = function(){
    socket.on('scores', function (json) {
       data = JSON.parse(json);
       var c = parseInt(data.c || 0);
       var d = parseInt(data.d || 0);

       var percentages = getPercentages(c, d);

       bg1.style.width = percentages.c + "%";
       bg2.style.width = percentages.d + "%";

       $scope.$apply(function () {
         $scope.cPercent = percentages.c;
         $scope.dPercent = percentages.d;
         $scope.total = c + d;
       });
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});

function getPercentages(c, d) {
  var result = {};

  if (c + d > 0) {
    result.c = Math.round(c / (c + d) * 100);
    result.d = 100 - result.c;
  } else {
    result.c = result.d = 50;
  }

  return result;
}