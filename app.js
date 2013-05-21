if (Meteor.isClient) {
	Meteor.startup(function() {
		Meteor.Router.to('/home');
	});

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

	// highstock options
	var betaOpts = {
		rangeSelector : {selected : 1},
		title : {text : 'DGS5'},
		series : [{
			name : 'Notes',
			// data : [[1041465600000, 2.2], [1041552000000, 3.1]],
			tooltip: {valueDecimals: 2}
		}]
	};

	var obj2arr = function(arr) {
		var result = [];
		for (i=0; i<arr.length; i++) {
			if (arr[i].value !== '.') {
				result.push([Date.parse(arr[i].date), parseFloat(arr[i].value)]);
			}
		}
		return result;
	};

	var drawChart = function(dataSeries, chartOpts) {
		var data = Session.get(dataSeries);
		if (data) {
			chartOpts.series[0].data = obj2arr(data.notes);
			$('.container').highcharts('StockChart', chartOpts);
		} else {
			$('.container').text('fetching current data...');
			Meteor.setTimeout(function() {
				drawChart(dataSeries, chartOpts)
			}, 1000);
		}
	};

	Template.gutter.goto = function() {
		var loc = Meteor.Router.page();
		if (loc === 'home') return 'about';
		return 'home';
	};

	Template.home.rendered = function() {
		drawChart('betaSeries', _.clone(betaOpts));
	};

} // Meteor.isClient

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
				var url = 'http://api.stlouisfed.org/fred/series/observations';
				var seriesUri = '?series_id=' + seriesInfo.series[key];
				var dateUri = '&observation_start=' + seriesInfo.fromDate;
				var apiKey = '&api_key=c2b3e4b899953f52dc9740abab6c28eb';
				url = url + seriesUri + dateUri + apiKey;
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
