var merge = function() {
	var i,
		len = arguments.length,
		ret = {},
		doCopy = function (copy, original) {
			var value, key;

			for (key in original) {
				if (original.hasOwnProperty(key)) {
					value = original[key];

					// An object is replacing a primitive
					if (typeof copy !== 'object') {
						copy = {};
					}

					// Copy the contents of objects, but not arrays or DOM nodes
					if (value && typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]'
							&& typeof value.nodeType !== 'number') {
						copy[key] = doCopy(copy[key] || {}, value);

					// Primitives and arrays are copied over directly
					} else {
						copy[key] = original[key];
					}
				}
			}
			return copy;
		};

	// For each argument, extend the return
	for (i = 0; i < len; i++) {
		ret = doCopy(ret, arguments[i]);
	}

	return ret;
};

var defaultLabelOptions = {
	enabled: true,
	align: 'center',
	x: 0,
	y: 15,
	style: {
		color: '#666',
		cursor: 'default',
		fontSize: '11px',
		lineHeight: '14px'
	}
};

Highcharts.theme = {
	colors: ['#2f7ed8',
					'#0d233a',
					'#8bbc21',
					'#910000',
					'#1aadce',
					'#492970',
					'#f28f43',
					'#77a1e5',
					'#c42525',
					'#a6c96a'],
	chart: {
		borderColor: '#4572A7',
		borderRadius: 0,
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		spacingTop: 10,
		spacingRight: 10,
		spacingBottom: 15,
		spacingLeft: 10,
		style: {
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
			fontSize: '12px'
		},
		backgroundColor: '#FFFFFF',
		plotBorderColor: '#C0C0C0',
		resetZoomButton: {
			theme: {
				zIndex: 20
			},
			position: {
				align: 'right',
				x: -10,
				y: 10
			}
		}
	},
	title: {
		text: 'Chart title',
		align: 'center',
		y: 15,
		style: {
			color: '#274b6d',
			fontSize: '16px'
		}
	},
	subtitle: {
		text: '',
		align: 'center',
		y: 30,
		style: {
			color: '#4d759e'
		}
	},
	plotOptions: {
		line: {
			allowPointSelect: false,
			showCheckbox: false,
			animation: {
				duration: 1000
			},
			events: {},
			lineWidth: 2,
			marker: {
				enabled: true,
				lineWidth: 0,
				radius: 4,
				lineColor: '#FFFFFF',
				states: {
					hover: {
						enabled: true
					},
					select: {
						fillColor: '#FFFFFF',
						lineColor: '#000000',
						lineWidth: 2
					}
				}
			},
			point: {
				events: {}
			},
			dataLabels: merge(defaultLabelOptions, {
				enabled: false,
				formatter: function () {
					return this.y;
				},
				verticalAlign: 'bottom',
				y: 0
			}),
			cropThreshold: 300,
			pointRange: 0,
			showInLegend: true,
			states: {
				hover: {
					marker: {
					}
				},
				select: {
					marker: {}
				}
			},
			stickyTracking: true
		}
	},
	labels: {
		style: {
			position: 'ABSOLUTE',
			color: '#3E576F'
		}
	},
	legend: {
		enabled: true,
		align: 'center',
		layout: 'horizontal',
		labelFormatter: function () {
			return this.name;
		},
		borderWidth: 1,
		borderColor: '#909090',
		borderRadius: 5,
		navigation: {
			activeColor: '#274b6d',
			inactiveColor: '#CCC'
		},
		shadow: false,
		itemStyle: {
			cursor: 'pointer',
			color: '#274b6d',
			fontSize: '12px'
		},
		itemHoverStyle: {
			color: '#000'
		},
		itemHiddenStyle: {
			color: '#CCC'
		},
		itemCheckboxStyle: {
			position: 'ABSOLUTE',
			width: '13px',
			height: '13px'
		},
		symbolWidth: 16,
		symbolPadding: 5,
		verticalAlign: 'bottom',
		x: 0,
		y: 0,
		title: {
			style: {
				fontWeight: 'bold'
			}
		}
	},
	loading: {
		labelStyle: {
			fontWeight: 'bold',
			position: 'RELATIVE',
			top: '1em'
		},
		style: {
			position: 'ABSOLUTE',
			backgroundColor: 'white',
			opacity: 0.5,
			textAlign: 'center'
		}
	},
	tooltip: {
		enabled: true,
		backgroundColor: 'rgba(255, 255, 255, .85)',
		borderWidth: 1,
		borderRadius: 3,
		dateTimeLabelFormats: {
			millisecond: '%A, %b %e, %H:%M:%S.%L',
			second: '%A, %b %e, %H:%M:%S',
			minute: '%A, %b %e, %H:%M',
			hour: '%A, %b %e, %H:%M',
			day: '%A, %b %e, %Y',
			week: 'Week from %A, %b %e, %Y',
			month: '%B %Y',
			year: '%Y'
		},
		headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
		pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
		shadow: true,
		style: {
			color: '#333333',
			cursor: 'default',
			fontSize: '12px',
			padding: '8px',
			whiteSpace: 'nowrap'
		}
	},
	credits: {
		enabled: false,
		text: 'Highcharts.com',
		href: 'http://www.highcharts.com',
		position: {
			align: 'right',
			x: -10,
			verticalAlign: 'bottom',
			y: -5
		},
		style: {
			cursor: 'pointer',
			color: '#909090',
			fontSize: '9px'
		}
	},
	exporting: {
		buttons: {
			contextButton: {
				symbol: 'triangle-down',
				symbolSize: 10,
				symbolStrokeWidth: 1,
				height: 18,
				width: 20,
				symbolX: 11,
				symbolY: 10,
				x: -4,
				y: 0,
				menuItems: [
					{text: 'Download PNG image',
						onclick: function() {
							this.exportChart({width: 900});
						}},
					{text: 'Download SVG vector image',
						onclick: function() {
							this.exportChart({type: 'image/svg+xml'});
						}, separator: false}
				]
			}
		}
	},
	navigation: {
		buttonOptions: {
			theme: {
				stroke: 'silver',
				r: 0
			}
		}
	}
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
