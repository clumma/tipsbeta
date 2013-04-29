var getSeries = function(seriesName) {
  var seriesUrl = 'http://api.stlouisfed.org/fred/series/observations?series_id=';
  var seriesCode = 'DGS5';
  if (seriesName === 'tips') {seriesCode = 'DFII5'};
  if (seriesName === 'sp500') {seriesCode = 'SP500'};
  var fromDate = '&observation_start=2003-01-01';
  var apiKey = '&api_key=c2b3e4b899953f52dc9740abab6c28eb';
  var url = seriesUrl + seriesCode + fromDate + apiKey;
  Meteor.call('checkFred', url, function(error, result) {
    error && console.log(error);
    Session.set(seriesName, result);
  });
}

if (Meteor.isClient) {
  getSeries('notes');
  getSeries('tips');
  getSeries('sp500');
  Template.home.chart = function() {
    var data = Session.get('sp500');
    if (!data) return 'loading...';
    return data[0].date;
  };
  Template.home.events({
    'click input' : function() {
      // template data, if any, is available in 'this'
      console.log('you clicked');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
    var lastChecked = 0;
    var resultCache = {};
    Meteor.methods({checkFred: function(url) {
      this.unblock();
      var result = {};
      var fresh = (Date.now() - lastChecked < 3600000);
      if (resultCache.hasOwnProperty(url) && fresh) {
        result = resultCache[url];
      } else {
        result = Meteor.http.call('GET', url);
        result = XML2JS.parse(result.content);
        result = _.pluck(result.observations.observation, '$');
        resultCache[url] = result;
        lastChecked = Date.now();
      }
      return result;
    }});
  });
}
