var Series;
var Chart;
var Axis;

(function($) {
	Chart = function(config) {

		var _config = {
			series : [], // he will just have one lazy move
			axis: [], // configures the axis displays
			$container : $('body'),
			labelSpacing : {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		};

		var $root = $('<svg></svg>'); //$('<svg class="chart" version="1.1" preserveAspectRatio="xMinYMin meet"></svg>');
		var $chartArea = $('<g class="series"></g>');

		var _width = 100;
		var _height = 100;
		var _chartHeight = _height;
		var _chartWidth = _width;


		var _init = function() {
			console.log("charts's got a heartbeat");
			$.extend(_config, config);

			_calcCurrentSizing();
			_instantiateChart();
		};

		var _calcCurrentSizing = function () {
			_width = _config.$container.width();
			_height = _config.$container.height();

			// modified charting area sizes after margins are considered
			_chartHeight = _height - _config.labelSpacing.top - _config.labelSpacing.bottom;
			_chartWidth = _width - _config.labelSpacing.left - _config.labelSpacing.right;


			console.log(_config.labelSpacing, _width, _height, _chartWidth, _chartHeight);



		};

		var _renderSeriesOnChart = function(series) {
			var seriesData = series.getData();
			var pos = 1;
			var pathDirective = "";
			var fillPathDirective = "";
			var $seriesGroup = $('<g class="series-group '+series.getClassName()+'"></g>');
			var $seriesCircleGroup = $('<g class="'+series.getClassName()+'-circle"></g>');
			var $fillPath = $('<path class="'+series.getClassName()+'-fill"></path>');
			var axis = series.getAxis();
			// value limits
			var yTop = series.getUpperLimit(); // 30; // TODO: needs to be calculated
			var yBottom = 0; //series.getLowerLimit(); //0;
			var yRatio = _chartHeight/(yTop - yBottom); // 270/20

			console.log("----- ", yRatio, _chartHeight, yTop, yBottom);

			var xLength = seriesData.length;
			var xRatio = _chartWidth/(xLength - 1);

			var y = _chartHeight;
			var x = 0;

			fillPathDirective = "M" + x + " " + y + ", L";

			_renderAxisOnChart(axis);

			seriesData.forEach(function(data) {
				var starty = y;
				var startx = x;

				// path calculations
				y = _chartHeight - (yRatio * data.value);
				x = ((pos-1) * xRatio);
				pathDirective = "M" + startx + " " + starty + ", L";
				pathDirective += x + " " + y;
				fillPathDirective += x + " " + y + " ";

				var $path = $('<path d="'+pathDirective+'"></path>');
				var $circle = $('<circle cx="'+x+'" cy="'+y+'" r="6"/>');

				if(y < 50) {
					$path.addClass('warning');
				}
				if(y > 150) {
					$path.addClass('cool');
				}
				$seriesGroup.append($path)
				$seriesCircleGroup.append($circle);
				/*
				if(pos == 1) {
					pathDirective += "M" + x + " " + y + ", L"; // move to
				}
				pathDirective += x + " " + y + ", ";
				pos++;
				*/
				//M150 0 L75 200 L225 200 Z
				/*
				M = moveto
				L = lineto
				H = horizontal lineto
				V = vertical lineto
				C = curveto
				S = smooth curveto
				Q = quadratic Bézier curve
				T = smooth quadratic Bézier curveto
				A = elliptical Arc
				Z = closepath
				*/
				pos++;
			});
			// lets close it out
			fillPathDirective += x + " " + _chartHeight  + " Z";
			$fillPath.attr('d', fillPathDirective);

			$chartArea.append($fillPath);
			$chartArea.append($seriesGroup);
			$chartArea.prepend($seriesCircleGroup);
		};

		var _renderAxisOnChart = function(axis) {
			var position = axis.getPosition();
			axis.setXStart(_config.labelSpacing.left);
			axis.setYStart(_config.labelSpacing.top);
			axis.setChartWidth(_chartWidth);
			axis.setChartHeight(_chartHeight);
			if(!$root.find('.axis').length) {
				$root.prepend(axis.getRenderedAxisSVG());
			}
		};

		var _rePaint = function() {
			_config.$container.find('.chart').empty();
			$root.empty();
			$chartArea.empty();

			_calcCurrentSizing();
			_instantiateChart();
			_config.$container.find('.chart').html(_get$Root);

		};
		var _instantiateChart = function() {
			//$root.attr('viewBox', '0 0 100 100'); // this will make percentages easier
			$chartArea.attr('transform', 'translate('+_config.labelSpacing.left+','+_config.labelSpacing.top+')');
			_config.series.forEach(_renderSeriesOnChart);

			$root.append($chartArea);

			var chartBoxPath = $('<rect class="chart-axis-line" x="' + _config.labelSpacing.left + '" y="' + _config.labelSpacing.top+'" width="' + _chartWidth + '" height="' +_chartHeight + '"></rect>');
			$root.prepend(chartBoxPath);
		};

		var _get$Root = function() {
			return $root.html();
		};



		_init();

		this.get$Root = _get$Root;
		this.rePaint = _rePaint;

	};

	return Chart;

})(jQuery);




(function($) {
	Series = function(config) {

		var _config = {
			data : [],
			unique : false,
			className : 'series'
		};
		var axis;
		var _rawValues = [];
		var upperLimit;
		var lowerLimit;
		var _this = this;

		var _init = function() {
			$.extend(_config, config);
			for (var i=0; i < _config.data.length; i++) {
				_rawValues.push(_config.data[i].value);
			}
			lowerLimit = Math.min.apply(Math,_rawValues);
			upperLimit = Math.max.apply(Math,_rawValues);
			var seriesConfig = {
				data: _config.data,
				upperLimit: upperLimit,
				lowerLimit: lowerLimit
			}
			var axisConfig = $.extend(_config.axis, seriesConfig);
			axis = new Axis(axisConfig);
		};

		var _getData = function() {
			return _config.data;
		};
		var _getClassName = function() {
			return _config.className;
		};
		var _getAxis = function() {
			return axis;
		};
		var _getUpperLimit = function() {
			return upperLimit;
		};
		var _getLowerLimit = function() {
			return lowerLimit;
		};
		_init();

		this.getData = _getData;
		this.getClassName = _getClassName;
		this.getAxis = _getAxis;
		this.getUpperLimit = _getUpperLimit;
		this.getLowerLimit = _getLowerLimit;

	};

	return Series;

})(jQuery);




(function($) {
	Axis = function(config) {

		var $root = $('<g class="axis"></g>');

		var _config = {
			position: 'left',
			unique: true,
			series : {},
			line_count : 10,
			start: function(v) { return v; },
			end:  function(v) { return v; }
		};

		var _XStart;
		var _YStart;
		var _chartWidth;
		var _chartHeight;
		var _startValue;
		var _endValue;

		var _init = function() {
			$.extend(_config, config);
			var lower = _config.lowerLimit;
			var upper = _config.upperLimit;

			if(_config.start && typeof _config.start === 'function') {
				_startValue = _config.start(lower);
			}
			if(_config.end && typeof _config.end === 'function') {
				_endValue = _config.end(upper);
			}

			console.log(upper, "start: " + _startValue, "end: " + _endValue);
		};

		var _get$Root = function() {
			return $root;
		};

		var _getPosition = function() {
			return _config.position;
		};

		var _setXStart = function(x) {
			_XStart = x;
		};

		var _setYStart = function(y) {
			_YStart = y;
		};

		var _setChartWidth = function(w) {
			_chartWidth = w;
		};

		var _setChartHeight = function(h) {
			_chartHeight = h;
		};

		var _getRenderedAxisSVG = function() {
			$root.empty();
			var tick_length = 10;
			var startValue = _startValue;
			var tickIncrement = (_endValue - _startValue) / _config.line_count;
			console.log("axis _chartHeight: " , _chartHeight);

			/*

				starts at 10
				ends at 10px + height : 280

				space of 270 which is a ratio of 270/(highest (25)-lowest (4))) : 270/21 :  12.85.

				every plot should be 280 - ( 12.85 *


			 */
			for (var y = _chartHeight + _YStart; y >= 0 + _YStart; y = y - _chartHeight/_config.line_count) {
				var line = $('<path d="M ' + (_XStart - tick_length) + ' ' + y + ' L ' + (_chartWidth + _XStart) + ' ' + y + '"></path>');
				var label = $('<text x="'+(_XStart - tick_length - 2)+'" y="' + (y + 5) + '" text-anchor="end">' + startValue + '</text>');
				$root.prepend(line).prepend(label);
				startValue = startValue + Number(tickIncrement);
				console.log(startValue, tickIncrement);
			}
			return $root;
		};

		_init();

		this.get$Root = _get$Root;
		this.getPosition = _getPosition;
		this.setXStart = _setXStart;
		this.setYStart = _setYStart;
		this.setChartWidth = _setChartWidth;
		this.setChartHeight = _setChartHeight;
		this.getRenderedAxisSVG = _getRenderedAxisSVG;


	};

	return Axis;

})(jQuery);





