var getSeries = function(seriesName) {
  var apiKey = '&api_key=c2b3e4b899953f52dc9740abab6c28eb';
  var seriesUrl = 'http://api.stlouisfed.org/fred/series/observations?series_id=';
  var seriesCode = 'DGS5';
  if (seriesName === 'tips') {seriesCode = 'DFII5'};
  var url = seriesUrl + seriesCode + apiKey;
  Meteor.call('checkFred', url, function(error, result) {
    error && console.log(error);
    Session.set(seriesName, result);
  });
}

if (Meteor.isClient) {
  getSeries('notes');
  getSeries('tips');
  Template.home.rawdata = function() {
    console.log(Session.get('tips')[0]);
    return Session.get('tips')[0].value;
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
    Meteor.methods({checkFred: function(url) {
      this.unblock();
      var result = Meteor.http.call('GET', url);
      result = XML2JS.parse(result.content);
      result = _.pluck(result.observations.observation, '$');
      return result;
    }});
  });
}
