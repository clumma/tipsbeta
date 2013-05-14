if (Meteor.isClient) {
	Meteor.startup(function() {
		Meteor.Router.to('/home');
	});

	Template.home.currpage = function() {
		var loc = Meteor.Router.page();
		if (loc === 'home') return 'home';
	};

	Template.chart.rawdata = function() {
		var data = Session.get('betaSeries');
		if (!data) return 'fetching current data...';
		console.log(data.notes[1]);
		console.log(data.tips.length);
		console.log(data.sp500.length);
		return data.notes;
	};

	var getData = function(seriesInfo) {
		Meteor.call('checkFred', seriesInfo, function(error, result) {
			error && console.log(error);
			Session.set(seriesInfo.name, result);
		});
	};

	// a seriesInfo object
	var betaSeries = {
		name: 'betaSeries',
		fromDate: '2003-01-01',
		series: {
			notes: 'DGS5',
			tips: 'DFII5',
			sp500: 'SP500'
		}
	};

	getData(betaSeries);

}

/* a fredCache object
{
	seriesInfoName: {
		date: number,
		results: {
			notes: obj,
			tips: obj,
			sp500: obj
		}
	},
	...
} */

if (Meteor.isServer) {
	Meteor.startup(function() {
		// code to run on server at startup
		var fredCache = {};
		Meteor.methods({checkFred: function(seriesInfo) {
			this.unblock();
			var freshness = 7200000;
			if (fredCache.hasOwnProperty(seriesInfo.name)) {
				if (Date.now() - fredCache[seriesInfo.name].date < freshness) {
					return fredCache[seriesInfo.name].results;
				}
			}
			fredCache[seriesInfo.name] = {};
			fredCache[seriesInfo.name].results = {};
			for (key in seriesInfo.series) {
				var url = 'http://api.stlouisfed.org/fred/series/observations?series_id=';
				fromDate = '&observation_start=' + seriesInfo.fromDate;
				var apiKey = '&api_key=c2b3e4b899953f52dc9740abab6c28eb';
				url = url + seriesInfo.series[key] + fromDate + apiKey;
				var result = Meteor.http.call('GET', url);
				result = XML2JS.parse(result.content);
				result = _.pluck(result.observations.observation, '$');
				fredCache[seriesInfo.name].results[key] = result;
			}
			fredCache[seriesInfo.name].date = Date.now();
			return fredCache[seriesInfo.name].results;
		}});
	});
}
