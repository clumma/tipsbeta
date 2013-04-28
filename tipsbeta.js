var apiKey = '&api_key=c2b3e4b899953f52dc9740abab6c28eb';
var seriesUrl = 'http://api.stlouisfed.org/fred/series/observations?series_id=';
var noteSeries = 'DGS5';
var tipsSeries = 'DFII5';
note = new Meteor.Collection('note');
tips = new Meteor.Collection('tips');

if (Meteor.isClient) {
  Template.home.rawdata = function() {
    var currentData = tips.find(Session.get('currentRecord'));
    console.log(currentData.fetch()[0]);
    return JSON.stringify(currentData.fetch()[0]);
  };

  Template.home.events({
    'click input' : function() {
      // template data, if any, is available in 'this'
      var url = seriesUrl + noteSeries + apiKey;
      Meteor.call('checkFred', url, function(error, result) {
        error && console.log(error);
        Session.set('currentRecord', result);
      });
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
      var recordId = tips.insert(result);
      return recordId;
    }});
  });
}
